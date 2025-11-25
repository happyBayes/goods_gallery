/**
 * AI Creative Design Feature Types
 * 
 * This file contains all TypeScript interfaces and enums for the AI-powered
 * creative design generation feature.
 */

/**
 * Design style options for creative generation
 */
export enum DesignStyle {
    MODERN = 'modern',
    TRADITIONAL = 'traditional',
    ABSTRACT = 'abstract',
    MINIMALIST = 'minimalist',
    WATERCOLOR = 'watercolor',
    VINTAGE = 'vintage'
}

/**
 * Human-readable descriptions for each design style
 */
export const STYLE_DESCRIPTIONS: Record<DesignStyle, string> = {
    [DesignStyle.MODERN]: "现代简约，线条流畅",
    [DesignStyle.TRADITIONAL]: "传统文化，古典韵味",
    [DesignStyle.ABSTRACT]: "抽象艺术，创意表达",
    [DesignStyle.MINIMALIST]: "极简主义，留白美学",
    [DesignStyle.WATERCOLOR]: "水彩风格，柔和渐变",
    [DesignStyle.VINTAGE]: "复古怀旧，时光印记"
};

/**
 * Request parameters for generating a creative design
 */
export interface GenerateDesignRequest {
    referenceImage: string; // base64 encoded image
    prompt: string;
    style?: DesignStyle;
    aspectRatio?: string; // "1:1", "16:9", "9:16", "4:3"
    numberOfImages?: number; // 1-4
}

/**
 * Generated design result with metadata
 */
export interface GeneratedDesign {
    id: string; // UUID
    imageUrl: string; // base64 or blob URL
    imageBlob?: Blob; // Original image data
    prompt: string; // User's original prompt
    enhancedPrompt: string; // System-enhanced prompt
    style: DesignStyle;
    referenceImage: string; // Original screenshot
    timestamp: Date;
    artifactId: string; // Associated artifact ID
    artifactTitle: string; // Artifact name
    metadata: {
        aspectRatio: string;
        fileSize: number;
        dimensions: { width: number; height: number };
        generationTime: number; // Generation time in milliseconds
    };
}

/**
 * Error types for design generation
 */
export enum DesignErrorType {
    SCREENSHOT_FAILED = 'SCREENSHOT_FAILED',
    API_ERROR = 'API_ERROR',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    INVALID_PROMPT = 'INVALID_PROMPT',
    STORAGE_ERROR = 'STORAGE_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    CONTENT_POLICY_ERROR = 'CONTENT_POLICY_ERROR',
    QUOTA_EXCEEDED = 'QUOTA_EXCEEDED'
}

/**
 * Structured error information
 */
export interface DesignError {
    type: DesignErrorType;
    message: string;
    details?: any;
    retryable: boolean;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number; // Time window in milliseconds
}

/**
 * Props for CreativeDesignPanel component
 */
export interface CreativeDesignPanelProps {
    artifactId: string;
    artifactTitle: string;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    onDesignGenerated?: (design: GeneratedDesign) => void;
}

/**
 * State for CreativeDesignPanel component
 */
export interface CreativeDesignPanelState {
    screenshot: string | null; // base64
    prompt: string;
    style: DesignStyle;
    aspectRatio: string;
    isGenerating: boolean;
    generatedDesign: GeneratedDesign | null;
    error: DesignError | null;
}

/**
 * Props for ScreenshotCapture component
 */
export interface ScreenshotCaptureProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    onCapture: (imageData: string) => void;
    quality?: number; // 0-1, default 0.9
}

/**
 * Props for PromptInput component
 */
export interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
    placeholder?: string;
    suggestions?: string[];
    showExamples?: boolean;
    artifactTitle?: string;
}

/**
 * Props for PromptExamples component
 */
export interface PromptExamplesProps {
    onSelectExample: (example: string) => void;
    currentPrompt: string;
    artifactTitle?: string;
}

/**
 * Prompt template interface
 */
export interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    template: string;
    category: string;
    parameters?: string[];
}

/**
 * Prompt category interface
 */
export interface PromptCategory {
    id: string;
    name: string;
    icon: string;
    examples: string[];
}

/**
 * Props for DesignStyleSelector component
 */
export interface DesignStyleSelectorProps {
    selected: DesignStyle;
    onChange: (style: DesignStyle) => void;
}

/**
 * Props for AspectRatioSelector component
 */
export interface AspectRatioSelectorProps {
    selected: string;
    onChange: (ratio: string) => void;
}

/**
 * Props for DesignResult component
 */
export interface DesignResultProps {
    design: GeneratedDesign;
    onDownload: () => void;
    onRegenerate: () => void;
    onSave: () => void;
}

/**
 * Props for DesignGallery component
 */
export interface DesignGalleryProps {
    designs: GeneratedDesign[];
    onSelect: (design: GeneratedDesign) => void;
    onDelete: (designId: string) => void;
    onDownload: (design: GeneratedDesign) => void;
}

/**
 * State for DesignGallery component
 */
export interface DesignGalleryState {
    selectedDesign: GeneratedDesign | null;
    viewMode: 'grid' | 'list';
    sortBy: 'date' | 'artifact';
}

/**
 * Example prompts for user guidance
 */
export const PROMPT_EXAMPLES = [
    "将这个文物设计成现代简约风格的冰箱贴",
    "创作一个融合传统与现代元素的T恤图案",
    "设计一张以这个文物为主题的明信片，水彩风格",
    "生成一个抽象艺术风格的手机壳图案"
];
