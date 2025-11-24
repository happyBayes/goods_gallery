import React from 'react';

interface ScreenshotPreviewProps {
    /** The screenshot data URL to display */
    screenshot: string | null;
    /** Callback when user wants to retake the screenshot */
    onRetake: () => void | Promise<void>;
    /** Optional custom className for styling */
    className?: string;
}

/**
 * ScreenshotPreview Component
 * 
 * Displays a preview of the captured screenshot with options to retake.
 * Stores screenshot temporarily in React state (managed by parent component).
 * 
 * Requirements: 1.2, 1.3 - Display screenshot preview and allow retaking
 */
const ScreenshotPreview: React.FC<ScreenshotPreviewProps> = ({
    screenshot,
    onRetake,
    className = ''
}) => {
    if (!screenshot) {
        return null;
    }

    return (
        <div className={`p-3 bg-black/30 rounded-lg border border-white/10 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400 font-medium">Screenshot Preview</p>
                <button
                    onClick={onRetake}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    title="Retake screenshot"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 2v6h-6" />
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                        <path d="M3 22v-6h6" />
                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                    </svg>
                    <span>Retake</span>
                </button>
            </div>

            {/* Screenshot Image */}
            <div className="relative group">
                <img
                    src={screenshot}
                    alt="Screenshot preview"
                    className="w-full rounded border border-white/5 shadow-lg"
                />

                {/* Hover Overlay with Info */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <div className="text-center text-white text-xs">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto mb-1"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <p>Click to view full size</p>
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Captured: {new Date().toLocaleTimeString()}</span>
                <span className="text-green-400">✓ Ready</span>
            </div>
        </div>
    );
};

export default ScreenshotPreview;
