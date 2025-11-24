import React, { useState } from 'react';

interface ScreenshotButtonProps {
    /** Callback function triggered when screenshot button is clicked */
    onCapture: () => void | Promise<void>;
    /** Optional custom className for styling */
    className?: string;
    /** Whether the button is disabled */
    disabled?: boolean;
}

/**
 * ScreenshotButton Component
 * 
 * A button component with camera icon that triggers screenshot capture.
 * Provides visual feedback (flash effect) when screenshot is taken.
 * 
 * Requirements: 1.1 - User can capture 3D model view
 */
const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({
    onCapture,
    className = '',
    disabled = false
}) => {
    const [isFlashing, setIsFlashing] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const handleClick = async () => {
        if (disabled || isCapturing) return;

        try {
            setIsCapturing(true);

            // Trigger the capture callback
            await onCapture();

            // Show flash effect for visual feedback
            setIsFlashing(true);
            setTimeout(() => {
                setIsFlashing(false);
            }, 300);
        } catch (error) {
            console.error('Screenshot capture failed:', error);
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <>
            <button
                onClick={handleClick}
                disabled={disabled || isCapturing}
                className={`
          flex items-center justify-center gap-2 px-4 py-2 rounded-lg
          font-medium text-sm transition-all
          ${disabled || isCapturing
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40'
                    }
          ${className}
        `}
                title="Capture screenshot of current view"
            >
                {/* Camera Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isCapturing ? 'animate-pulse' : ''}
                >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                </svg>
                <span>{isCapturing ? 'Capturing...' : 'Screenshot'}</span>
            </button>

            {/* Flash Effect Overlay */}
            {isFlashing && (
                <div
                    className="fixed inset-0 bg-white pointer-events-none z-50 animate-flash"
                    style={{
                        animation: 'flash 0.3s ease-out'
                    }}
                />
            )}

            {/* Flash Animation Styles */}
            <style>{`
        @keyframes flash {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
        </>
    );
};

export default ScreenshotButton;
