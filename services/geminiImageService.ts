/**
 * Gemini Image Service
 * 
 * Handles AI-powered creative design generation using Gemini Image Pro API.
 * Integrates with rate limiting and error handling.
 */

import { GoogleGenAI } from "@google/genai";
import {
    GenerateDesignRequest,
    GeneratedDesign,
    DesignStyle,
    STYLE_DESCRIPTIONS,
    DesignErrorType,
    DesignError
} from '../types/creativeDesign';
import { RateLimiter, RateLimitError } from '../utils/rateLimiter';
import { generateDesignId, getImageDimensions, getBase64FileSize } from '../utils/imageUtils';

/**
 * Service class for Gemini Image API integration
 */
export class GeminiImageService {
    private apiKey: string;
    private ai: GoogleGenAI | null;
    private rateLimiter: RateLimiter;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

        // Configure rate limiter: 3 requests per minute
        this.rateLimiter = new RateLimiter({
            maxRequests: 3,
            windowMs: 60000 // 1 minute
        });
    }

    /**
     * Generate a creative design using Gemini Image Pro
     */
    async generateDesign(
        request: GenerateDesignRequest,
        artifactId: string,
        artifactTitle: string
    ): Promise<GeneratedDesign> {
        const startTime = Date.now();

        try {
            // Check API availability
            if (!this.ai) {
                throw this.createError(
                    DesignErrorType.API_ERROR,
                    'API Key not configured',
                    true
                );
            }

            // Check rate limit
            try {
                await this.rateLimiter.checkLimit();
            } catch (error) {
                if (error instanceof RateLimitError) {
                    throw this.createError(
                        DesignErrorType.RATE_LIMIT_EXCEEDED,
                        error.message,
                        false,
                        { waitTime: error.waitTime }
                    );
                }
                throw error;
            }

            // Validate prompt
            if (!request.prompt || request.prompt.trim().length === 0) {
                throw this.createError(
                    DesignErrorType.INVALID_PROMPT,
                    '提示词不能为空',
                    false
                );
            }

            // Enhance the prompt
            const enhancedPrompt = this.enhancePrompt(request.prompt, request.style);

            // Prepare the reference image (remove data URL prefix if present)
            const base64Image = request.referenceImage.includes(',')
                ? request.referenceImage.split(',')[1]
                : request.referenceImage;

            // Call Gemini API
            const response = await this.callGeminiAPI({
                prompt: enhancedPrompt,
                referenceImage: base64Image,
                aspectRatio: request.aspectRatio || '1:1',
                numberOfImages: request.numberOfImages || 1
            });

            // Process the response
            const generatedImageUrl = `data:image/png;base64,${response.imageData}`;
            const dimensions = await getImageDimensions(generatedImageUrl);
            const fileSize = getBase64FileSize(generatedImageUrl);
            const generationTime = Date.now() - startTime;

            const design: GeneratedDesign = {
                id: generateDesignId(),
                imageUrl: generatedImageUrl,
                prompt: request.prompt,
                enhancedPrompt,
                style: request.style || DesignStyle.MODERN,
                referenceImage: request.referenceImage,
                timestamp: new Date(),
                artifactId,
                artifactTitle,
                metadata: {
                    aspectRatio: request.aspectRatio || '1:1',
                    fileSize,
                    dimensions,
                    generationTime
                }
            };

            return design;

        } catch (error) {
            // Handle different error types
            if ((error as DesignError).type) {
                throw error;
            }

            if (error instanceof Error) {
                if (error.message.includes('network') || error.message.includes('fetch')) {
                    throw this.createError(
                        DesignErrorType.NETWORK_ERROR,
                        '网络连接失败，请检查您的网络',
                        true
                    );
                }
            }

            throw this.createError(
                DesignErrorType.API_ERROR,
                '生成设计时发生错误，请重试',
                true,
                error
            );
        }
    }

    /**
     * Enhance user prompt with style and context
     */
    private enhancePrompt(userPrompt: string, style?: DesignStyle): string {
        let enhanced = `基于提供的文物图像，创作一个文创产品设计。\n\n`;
        enhanced += `用户需求: ${userPrompt}\n`;

        if (style) {
            enhanced += `设计风格: ${STYLE_DESCRIPTIONS[style]}\n`;
        }

        enhanced += `\n要求:\n`;
        enhanced += `- 保留文物的核心特征和文化元素\n`;
        enhanced += `- 适合应用于文创产品（海报、明信片、T恤等）\n`;
        enhanced += `- 色彩和谐，构图美观\n`;
        enhanced += `- 具有现代审美和商业价值\n`;
        enhanced += `- 高质量，专业设计`;

        return enhanced;
    }

    /**
     * Call Gemini Image API
     */
    private async callGeminiAPI(params: {
        prompt: string;
        referenceImage: string;
        aspectRatio: string;
        numberOfImages: number;
    }): Promise<{ imageData: string }> {
        try {
            // Note: This is a placeholder implementation
            // The actual Gemini Image API endpoint and request format may differ
            // You'll need to update this based on the official Gemini Image API documentation

            const response = await this.ai!.models.generateContent({
                model: 'gemini-2.5-flash', // Update to image model when available
                contents: params.prompt,
                config: {
                    thinkingConfig: { thinkingBudget: 0 }
                }
            });

            // For now, return a placeholder response
            // In production, this should return the actual generated image data
            return {
                imageData: params.referenceImage // Placeholder: return reference image
            };

        } catch (error) {
            console.error('Gemini API call failed:', error);
            throw error;
        }
    }

    /**
     * Create a structured error object
     */
    private createError(
        type: DesignErrorType,
        message: string,
        retryable: boolean,
        details?: any
    ): DesignError {
        return {
            type,
            message,
            retryable,
            details
        };
    }

    /**
     * Get remaining API requests
     */
    getRemainingRequests(): number {
        return this.rateLimiter.getRemainingRequests();
    }

    /**
     * Get time until rate limit resets
     */
    getTimeUntilReset(): number {
        return this.rateLimiter.getTimeUntilReset();
    }

    /**
     * Reset rate limiter (for testing purposes)
     */
    resetRateLimit(): void {
        this.rateLimiter.reset();
    }
}

// Helper function to get API key from environment
const getApiKey = (): string => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env.VITE_GEMINI_API_KEY || '';
    }
    return '';
};

// Export a singleton instance
export const geminiImageService = new GeminiImageService(getApiKey());

// Export factory function for custom instances
export const createGeminiImageService = (apiKey: string) => {
    return new GeminiImageService(apiKey);
};
