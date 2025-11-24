/**
 * Creative Design Feature Configuration
 * 
 * Centralized configuration for the AI creative design feature.
 */

import { RateLimitConfig } from '../types/creativeDesign';

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG: RateLimitConfig = {
    maxRequests: 3,
    windowMs: 60000 // 1 minute
};

/**
 * Image processing configuration
 */
export const IMAGE_CONFIG = {
    maxWidth: 1024,
    maxHeight: 1024,
    compressionQuality: 0.8,
    screenshotQuality: 0.9,
    supportedFormats: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
};

/**
 * Prompt configuration
 */
export const PROMPT_CONFIG = {
    maxLength: 500,
    minLength: 5,
    placeholder: '描述你想要的文创设计...'
};

/**
 * Storage configuration
 */
export const STORAGE_CONFIG = {
    dbName: 'CreativeDesignDB',
    storeName: 'designs',
    version: 1,
    maxDesigns: 100 // Maximum number of designs to store
};

/**
 * API configuration
 */
export const API_CONFIG = {
    model: 'gemini-2.5-flash', // Will be updated to image model
    timeout: 30000, // 30 seconds
    retryAttempts: 2
};

/**
 * UI configuration
 */
export const UI_CONFIG = {
    galleryThumbnailSize: 200,
    previewMaxWidth: 800,
    animationDuration: 300,
    toastDuration: 3000
};

/**
 * Aspect ratio options
 */
export const ASPECT_RATIOS = [
    { value: '1:1', label: '正方形 (1:1)' },
    { value: '16:9', label: '横屏 (16:9)' },
    { value: '9:16', label: '竖屏 (9:16)' },
    { value: '4:3', label: '标准 (4:3)' }
];

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
    enableGallery: true,
    enableDownload: true,
    enableShare: false, // Not implemented yet
    enableBatchGeneration: false // Not implemented yet
};
