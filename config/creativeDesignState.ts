/**
 * Creative Design State Configuration
 * 
 * Configuration constants and utilities for the creative design state management.
 * Centralizes default values, validation rules, and persistence settings.
 */

import { DesignStyle, CreativeDesignPanelState } from '../types/creativeDesign';

/**
 * Default state configuration
 */
export const DEFAULT_DESIGN_STATE: CreativeDesignPanelState = {
    screenshot: null,
    prompt: '',
    style: DesignStyle.MODERN,
    aspectRatio: '1:1',
    isGenerating: false,
    generatedDesign: null,
    error: null
};

/**
 * Prompt validation configuration
 */
export const PROMPT_CONFIG = {
    maxLength: 500,
    minLength: 10,
    warningThreshold: 50 // Show warning when remaining chars < this value
};

/**
 * Persistence configuration
 */
export const PERSISTENCE_CONFIG = {
    enabled: true,
    storageKey: 'creative-design-draft',
    expirationHours: 24, // State expires after 24 hours
    maxStorageSize: 5 * 1024 * 1024 // 5MB max for screenshots
};

/**
 * Aspect ratio options
 */
export const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3'] as const;

/**
 * Validate prompt input
 */
export function validatePrompt(prompt: string): {
    isValid: boolean;
    error?: string;
} {
    const trimmed = prompt.trim();

    if (trimmed.length === 0) {
        return { isValid: false, error: '提示词不能为空' };
    }

    if (trimmed.length < PROMPT_CONFIG.minLength) {
        return {
            isValid: false,
            error: `提示词至少需要 ${PROMPT_CONFIG.minLength} 个字符`
        };
    }

    if (trimmed.length > PROMPT_CONFIG.maxLength) {
        return {
            isValid: false,
            error: `提示词不能超过 ${PROMPT_CONFIG.maxLength} 个字符`
        };
    }

    return { isValid: true };
}

/**
 * Validate screenshot data
 */
export function validateScreenshot(screenshot: string | null): {
    isValid: boolean;
    error?: string;
} {
    if (!screenshot) {
        return { isValid: false, error: '请先截取 3D 模型视图' };
    }

    // Check if it's a valid base64 image
    if (!screenshot.startsWith('data:image/')) {
        return { isValid: false, error: '无效的图像格式' };
    }

    // Check size (approximate)
    const sizeInBytes = (screenshot.length * 3) / 4;
    if (sizeInBytes > PERSISTENCE_CONFIG.maxStorageSize) {
        return { isValid: false, error: '图像文件过大' };
    }

    return { isValid: true };
}

/**
 * Check if the design form is ready for submission
 */
export function isFormReady(state: CreativeDesignPanelState): {
    ready: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    const screenshotValidation = validateScreenshot(state.screenshot);
    if (!screenshotValidation.isValid) {
        errors.push(screenshotValidation.error!);
    }

    const promptValidation = validatePrompt(state.prompt);
    if (!promptValidation.isValid) {
        errors.push(promptValidation.error!);
    }

    if (state.isGenerating) {
        errors.push('正在生成设计，请稍候');
    }

    return {
        ready: errors.length === 0,
        errors
    };
}

/**
 * Calculate storage size estimate
 */
export function estimateStorageSize(state: CreativeDesignPanelState): number {
    let size = 0;

    // Screenshot size
    if (state.screenshot) {
        size += (state.screenshot.length * 3) / 4;
    }

    // Prompt size
    size += new Blob([state.prompt]).size;

    // Generated design size
    if (state.generatedDesign?.imageUrl) {
        size += (state.generatedDesign.imageUrl.length * 3) / 4;
    }

    return size;
}

/**
 * Format storage size for display
 */
export function formatStorageSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
}
