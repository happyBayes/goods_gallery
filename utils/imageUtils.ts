/**
 * Image Processing Utilities
 * 
 * Provides functions for image compression, format conversion,
 * and validation for the creative design feature.
 */

/**
 * Compress an image to reduce file size
 * 
 * @param dataUrl - Base64 encoded image data URL
 * @param maxWidth - Maximum width in pixels (default: 1024)
 * @param quality - Compression quality 0-1 (default: 0.8)
 * @returns Promise resolving to compressed base64 data URL
 * @throws Error if image format is invalid, dimensions are invalid, or quality is out of range
 */
export async function compressImage(
    dataUrl: string,
    maxWidth: number = 1024,
    quality: number = 0.8
): Promise<string> {
    // Validate image format
    if (!isValidImageFormat(dataUrl)) {
        throw new Error('Invalid image format. Supported formats: PNG, JPEG, JPG, WEBP');
    }

    // Validate quality parameter
    if (quality < 0 || quality > 1) {
        throw new Error('Quality must be between 0 and 1');
    }

    // Validate maxWidth parameter
    if (maxWidth <= 0) {
        throw new Error('Maximum width must be greater than 0');
    }

    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            // Validate image dimensions
            if (img.width === 0 || img.height === 0) {
                reject(new Error('Invalid image dimensions'));
                return;
            }

            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // Scale proportionally if width exceeds max
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = dataUrl;
    });
}

/**
 * Convert data URL to Blob
 * 
 * @param dataUrl - Base64 encoded data URL
 * @returns Blob object
 */
export function dataURLToBlob(dataUrl: string): Blob {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(parts[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }

    return new Blob([u8arr], { type: mime });
}

/**
 * Convert Blob to data URL
 * 
 * @param blob - Blob object
 * @returns Promise resolving to base64 data URL
 */
export function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Validate image format
 * 
 * @param dataUrl - Base64 encoded data URL
 * @returns true if valid image format
 */
export function isValidImageFormat(dataUrl: string): boolean {
    const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const mime = dataUrl.split(',')[0].match(/:(.*?);/)?.[1];
    return mime ? validFormats.includes(mime) : false;
}

/**
 * Validate image dimensions
 * 
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param maxWidth - Maximum allowed width (optional)
 * @param maxHeight - Maximum allowed height (optional)
 * @param minWidth - Minimum allowed width (default: 1)
 * @param minHeight - Minimum allowed height (default: 1)
 * @returns Object with validation result and error message if invalid
 */
export function validateImageDimensions(
    width: number,
    height: number,
    maxWidth?: number,
    maxHeight?: number,
    minWidth: number = 1,
    minHeight: number = 1
): { valid: boolean; error?: string } {
    if (width < minWidth || height < minHeight) {
        return {
            valid: false,
            error: `Image dimensions must be at least ${minWidth}x${minHeight}px`
        };
    }

    if (maxWidth && width > maxWidth) {
        return {
            valid: false,
            error: `Image width exceeds maximum of ${maxWidth}px`
        };
    }

    if (maxHeight && height > maxHeight) {
        return {
            valid: false,
            error: `Image height exceeds maximum of ${maxHeight}px`
        };
    }

    return { valid: true };
}

/**
 * Get image dimensions from data URL
 * 
 * @param dataUrl - Base64 encoded data URL
 * @returns Promise resolving to dimensions object
 */
export function getImageDimensions(
    dataUrl: string
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = dataUrl;
    });
}

/**
 * Calculate file size from base64 data URL
 * 
 * @param dataUrl - Base64 encoded data URL
 * @returns File size in bytes
 */
export function getBase64FileSize(dataUrl: string): number {
    const base64 = dataUrl.split(',')[1];
    const padding = (base64.match(/=/g) || []).length;
    return (base64.length * 3) / 4 - padding;
}

/**
 * Generate a unique ID for designs
 * 
 * @returns UUID-like string
 */
export function generateDesignId(): string {
    return `design-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Download image to user's device
 * 
 * @param dataUrl - Base64 encoded data URL
 * @param filename - Desired filename
 */
export function downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
