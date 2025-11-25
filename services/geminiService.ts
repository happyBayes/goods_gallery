import { GoogleGenAI } from "@google/genai";
import { Artifact } from '../types';
import {
  GenerateDesignRequest,
  GeneratedDesign,
  DesignStyle,
  STYLE_DESCRIPTIONS,
  DesignErrorType,
  DesignError
} from '../types/creativeDesign';

// Error handling constants
const API_TIMEOUT_MS = 30000; // 30 seconds
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000; // 1 second

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to avoid immediate crashes in dev if missing
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateCuratorInsight = async (artifact: Artifact): Promise<string> => {
  if (!ai) {
    logError(createDesignError(
      DesignErrorType.API_ERROR,
      "AI Curator is offline - API Key not configured",
      false
    ));
    return "AI Curator is offline. Please configure your API Key.";
  }

  try {
    const prompt = `
      You are a sophisticated museum curator and art historian.
      Provide a creative, culturally rich description for a digital artifact titled "${artifact.title}" from the "${artifact.period}".
      The object looks like a ${artifact.type.toLowerCase()} and is ${artifact.color} in color.
      
      Write a short, engaging paragraph (max 100 words) describing its fictional history, cultural significance, and artistic merit.
      Make it sound like a high-end gallery plaque.
    `;

    // Add timeout to curator insight generation
    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 } // Fast response
        }
      }),
      createTimeoutPromise(15000) // 15 second timeout for curator insights
    ]);

    const result = response.text || "No insight available at this time.";

    // Log successful generation
    console.log('Curator insight generated successfully', {
      artifactId: artifact.id,
      artifactTitle: artifact.title,
      responseLength: result.length
    });

    return result;
  } catch (error) {
    const designError = handleGenericError(error, 'generateCuratorInsight');

    // For curator insights, we want to return a user-friendly message instead of throwing
    console.error("Error fetching curator insight:", designError);

    if (designError.type === DesignErrorType.NETWORK_ERROR) {
      return "The curator is currently unavailable due to a connection issue. Please check your network and try again.";
    } else if (designError.type === DesignErrorType.RATE_LIMIT_EXCEEDED) {
      return "The curator is busy with other visitors. Please try again in a moment.";
    } else {
      return "The curator is currently unavailable. Please try again later.";
    }
  }
};

/**
 * Generate creative design using Gemini Image Pro API
 * Combines reference image with text prompt to create cultural product designs
 */
export const generateCreativeDesign = async (
  request: GenerateDesignRequest,
  artifactId: string,
  artifactTitle: string
): Promise<GeneratedDesign> => {
  const startTime = Date.now();

  try {
    // Validate API availability
    if (!ai) {
      throw createDesignError(
        DesignErrorType.API_ERROR,
        "AI服务离线，请配置API密钥",
        false
      );
    }

    // Validate prompt
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw createDesignError(
        DesignErrorType.INVALID_PROMPT,
        "提示词不能为空，请输入您的设计需求",
        false
      );
    }

    if (request.prompt.trim().length > 500) {
      throw createDesignError(
        DesignErrorType.INVALID_PROMPT,
        "提示词过长，请控制在500字符以内",
        false
      );
    }

    // Validate reference image
    if (!request.referenceImage) {
      throw createDesignError(
        DesignErrorType.SCREENSHOT_FAILED,
        "参考图像不能为空，请先截取3D模型图像",
        false
      );
    }

    // Validate image format
    if (!request.referenceImage.startsWith('data:image/')) {
      throw createDesignError(
        DesignErrorType.SCREENSHOT_FAILED,
        "图像格式不正确，请重新截图",
        false
      );
    }

    // Enhance the prompt with style and context
    const enhancedPrompt = enhancePrompt(request.prompt, request.style);

    // Prepare the reference image (remove data URL prefix if present)
    const base64Image = request.referenceImage.includes(',')
      ? request.referenceImage.split(',')[1]
      : request.referenceImage;

    // Validate base64 image size (limit to 10MB)
    const imageSizeBytes = (base64Image.length * 3) / 4;
    if (imageSizeBytes > 10 * 1024 * 1024) {
      throw createDesignError(
        DesignErrorType.SCREENSHOT_FAILED,
        "图像文件过大，请降低截图质量后重试",
        false
      );
    }

    // Call Gemini API with retry and timeout
    const response = await retryWithBackoff(async () => {
      return await Promise.race([
        callGeminiImageAPI({
          prompt: enhancedPrompt,
          referenceImage: base64Image,
          aspectRatio: request.aspectRatio || '1:1',
          numberOfImages: request.numberOfImages || 1
        }),
        createTimeoutPromise(API_TIMEOUT_MS)
      ]);
    });

    // Generate unique ID for the design
    const designId = generateDesignId();
    const generationTime = Date.now() - startTime;

    // Create the generated design object
    const design: GeneratedDesign = {
      id: designId,
      imageUrl: response.imageUrl,
      prompt: request.prompt,
      enhancedPrompt,
      style: request.style || DesignStyle.MODERN,
      referenceImage: request.referenceImage,
      timestamp: new Date(),
      artifactId,
      artifactTitle,
      metadata: {
        aspectRatio: request.aspectRatio || '1:1',
        fileSize: response.fileSize || 0,
        dimensions: response.dimensions || { width: 1024, height: 1024 },
        generationTime
      }
    };

    // Log successful generation
    console.log(`Design generated successfully in ${generationTime}ms`, {
      designId,
      artifactId,
      promptLength: request.prompt.length,
      style: request.style
    });

    return design;

  } catch (error) {
    // Handle and convert all errors to structured DesignError
    const designError = handleGenericError(error, 'generateCreativeDesign');
    throw designError;
  }
};

/**
 * Enhance user prompt with style descriptions and cultural context
 */
const enhancePrompt = (userPrompt: string, style?: DesignStyle): string => {
  let enhanced = `基于提供的文物图像，创作一个文创产品设计。\n\n`;
  enhanced += `用户需求: ${userPrompt}\n`;

  if (style && STYLE_DESCRIPTIONS[style]) {
    enhanced += `设计风格: ${STYLE_DESCRIPTIONS[style]}\n`;
  }

  enhanced += `\n设计要求:\n`;
  enhanced += `- 保留文物的核心特征和文化元素\n`;
  enhanced += `- 适合应用于文创产品（海报、明信片、T恤图案等）\n`;
  enhanced += `- 色彩和谐，构图美观\n`;
  enhanced += `- 具有现代审美和商业价值\n`;
  enhanced += `- 高质量，专业设计\n`;
  enhanced += `- 融合传统文化与现代设计理念`;

  return enhanced;
};

/**
 * Call Gemini Image API for design generation
 * Note: This is a placeholder implementation for Gemini Image Pro API
 */
const callGeminiImageAPI = async (params: {
  prompt: string;
  referenceImage: string;
  aspectRatio: string;
  numberOfImages: number;
}): Promise<{
  imageUrl: string;
  fileSize?: number;
  dimensions?: { width: number; height: number };
}> => {
  try {
    // Validate parameters
    if (!params.prompt || params.prompt.trim().length === 0) {
      throw new Error('Prompt is required for image generation');
    }

    if (!params.referenceImage) {
      throw new Error('Reference image is required for image generation');
    }

    // Note: This is a placeholder implementation
    // The actual Gemini Image Pro API (imagen-3.0-generate-001) may have different endpoints and parameters
    // Update this implementation based on the official Gemini Image API documentation when available

    // Log API call attempt
    console.log('Calling Gemini Image API', {
      promptLength: params.prompt.length,
      aspectRatio: params.aspectRatio,
      numberOfImages: params.numberOfImages,
      imageSize: params.referenceImage.length
    });

    // Note: Currently using text generation as placeholder
    // The actual Gemini Image Pro API call would be different
    const response = await ai!.models.generateContent({
      model: 'gemini-2.5-flash-image', // gemini-3-pro-image-preview
      contents: [
        {
          text: params.prompt
        },
        {
          inlineData: {
            mimeType: 'image/png',
            data: params.referenceImage
          }
        }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    // Validate response
    if (!response) {
      throw new Error('Empty response from Gemini API');
    }

    // For now, return the reference image as a placeholder
    // In production, this should return the actual generated image from Gemini Image Pro
    const imageUrl = `data:image/png;base64,${params.referenceImage}`;

    const result = {
      imageUrl,
      fileSize: getBase64FileSize(imageUrl),
      dimensions: { width: 1024, height: 1024 }
    };

    console.log('Gemini Image API call successful', {
      fileSize: result.fileSize,
      dimensions: result.dimensions
    });

    return result;

  } catch (error) {
    console.error('Gemini Image API call failed:', error);

    // Convert API-specific errors to more user-friendly messages
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        throw createDesignError(
          DesignErrorType.RATE_LIMIT_EXCEEDED,
          "API配额已用完，请稍后再试或检查您的配额设置",
          true,
          { originalError: error.message }
        );
      }

      if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        throw createDesignError(
          DesignErrorType.API_ERROR,
          "API权限不足，请检查您的API密钥配置",
          false,
          { originalError: error.message }
        );
      }

      if (error.message.includes('model not found') || error.message.includes('invalid model')) {
        throw createDesignError(
          DesignErrorType.API_ERROR,
          "AI模型不可用，请联系技术支持",
          false,
          { originalError: error.message }
        );
      }

      if (error.message.includes('content policy') || error.message.includes('safety')) {
        throw createDesignError(
          DesignErrorType.API_ERROR,
          "内容不符合安全政策，请修改您的提示词",
          false,
          { originalError: error.message }
        );
      }
    }

    // Re-throw the error to be handled by the generic error handler
    throw error;
  }
};

/**
 * Create a structured design error with logging
 */
const createDesignError = (
  type: DesignErrorType,
  message: string,
  retryable: boolean,
  details?: any
): DesignError => {
  const error: DesignError = {
    type,
    message,
    retryable,
    details
  };

  // Log error for debugging and monitoring
  logError(error);

  return error;
};

/**
 * Enhanced error logging with context
 */
const logError = (error: DesignError): void => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type: error.type,
    message: error.message,
    retryable: error.retryable,
    details: error.details,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown'
  };

  // Console logging for development
  console.error('[DesignError]', logEntry);

  // In production, you might want to send this to a logging service
  // Example: sendToLoggingService(logEntry);
};

/**
 * Convert generic errors to structured DesignError
 */
const handleGenericError = (error: unknown, context: string): DesignError => {
  if ((error as DesignError).type) {
    return error as DesignError;
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('NetworkError') ||
      error.name === 'NetworkError') {
      return createDesignError(
        DesignErrorType.NETWORK_ERROR,
        "网络连接失败，请检查您的网络连接后重试",
        true,
        { originalError: error.message, context }
      );
    }

    // Timeout errors
    if (error.message.includes('timeout') ||
      error.message.includes('AbortError') ||
      error.name === 'AbortError') {
      return createDesignError(
        DesignErrorType.API_ERROR,
        "请求超时，请稍后重试",
        true,
        { originalError: error.message, context }
      );
    }

    // API quota/rate limit errors
    if (error.message.includes('quota') ||
      error.message.includes('rate limit') ||
      error.message.includes('429')) {
      return createDesignError(
        DesignErrorType.RATE_LIMIT_EXCEEDED,
        "API调用频率过高，请稍后再试",
        true,
        { originalError: error.message, context }
      );
    }

    // Authentication errors
    if (error.message.includes('401') ||
      error.message.includes('unauthorized') ||
      error.message.includes('authentication')) {
      return createDesignError(
        DesignErrorType.API_ERROR,
        "API认证失败，请检查配置",
        false,
        { originalError: error.message, context }
      );
    }

    // Server errors (5xx)
    if (error.message.includes('500') ||
      error.message.includes('502') ||
      error.message.includes('503') ||
      error.message.includes('504')) {
      return createDesignError(
        DesignErrorType.API_ERROR,
        "服务器暂时不可用，请稍后重试",
        true,
        { originalError: error.message, context }
      );
    }

    // Generic API errors
    return createDesignError(
      DesignErrorType.API_ERROR,
      `生成设计时发生错误: ${error.message}`,
      true,
      { originalError: error.message, context }
    );
  }

  // Unknown error type
  return createDesignError(
    DesignErrorType.API_ERROR,
    "发生未知错误，请重试",
    true,
    { originalError: String(error), context }
  );
};

/**
 * Create a timeout promise that rejects after specified milliseconds
 */
const createTimeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });
};

/**
 * Retry function with exponential backoff
 */
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxAttempts: number = MAX_RETRY_ATTEMPTS,
  baseDelay: number = RETRY_DELAY_MS
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on non-retryable errors
      if ((error as DesignError).type && !(error as DesignError).retryable) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);

      logError(createDesignError(
        DesignErrorType.API_ERROR,
        `Attempt ${attempt} failed, retrying in ${delay}ms`,
        true,
        { error: lastError.message, attempt, delay }
      ));

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

/**
 * Generate a unique ID for designs
 */
const generateDesignId = (): string => {
  return `design_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Calculate file size from base64 string
 */
const getBase64FileSize = (base64String: string): number => {
  const base64Data = base64String.includes(',')
    ? base64String.split(',')[1]
    : base64String;

  // Base64 encoding increases size by ~33%
  return Math.round((base64Data.length * 3) / 4);
};
