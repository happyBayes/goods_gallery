/**
 * AspectRatioSelector Component
 * 
 * A component that allows users to select aspect ratios for their creative designs.
 * Features:
 * - Visual preview of aspect ratios
 * - Support for common ratios: 1:1, 16:9, 9:16, 4:3
 * - Interactive hover effects
 * - Clear visual feedback for selected ratio
 * 
 * Requirements: 6.4
 */

import React, { useState } from 'react';

export interface AspectRatioSelectorProps {
    selected: string;
    onChange: (ratio: string) => void;
}

interface AspectRatioOption {
    ratio: string;
    label: string;
    description: string;
    icon: string;
    useCase: string;
    dimensions: { width: number; height: number };
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
    selected,
    onChange
}) => {
    const [hoveredRatio, setHoveredRatio] = useState<string | null>(null);

    // Aspect ratio options with metadata
    const aspectRatios: AspectRatioOption[] = [
        {
            ratio: '1:1',
            label: '正方形',
            description: '社交媒体头像、徽章设计',
            icon: '⬜',
            useCase: '适合头像、徽章、贴纸',
            dimensions: { width: 100, height: 100 }
        },
        {
            ratio: '16:9',
            label: '宽屏',
            description: '横版海报、桌面壁纸',
            icon: '📺',
            useCase: '适合海报、横幅、壁纸',
            dimensions: { width: 160, height: 90 }
        },
        {
            ratio: '9:16',
            label: '竖屏',
            description: '手机壁纸、竖版海报',
            icon: '📱',
            useCase: '适合手机壁纸、竖版设计',
            dimensions: { width: 90, height: 160 }
        },
        {
            ratio: '4:3',
            label: '传统',
            description: '传统照片、印刷品',
            icon: '🖼️',
            useCase: '适合照片、明信片、印刷品',
            dimensions: { width: 120, height: 90 }
        }
    ];

    const handleRatioSelect = (ratio: string) => {
        onChange(ratio);
    };

    const handleMouseEnter = (ratio: string) => {
        setHoveredRatio(ratio);
    };

    const handleMouseLeave = () => {
        setHoveredRatio(null);
    };

    // Calculate preview dimensions for visual representation
    const getPreviewDimensions = (option: AspectRatioOption) => {
        const maxSize = 60;
        const { width, height } = option.dimensions;
        const scale = Math.min(maxSize / width, maxSize / height);
        return {
            width: width * scale,
            height: height * scale
        };
    };

    return (
        <div className="space-y-3">
            {/* Label */}
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <path d="M9 9h6v6H9z" />
                    </svg>
                    尺寸比例
                </label>
                <span className="text-xs text-gray-500">
                    已选择: {aspectRatios.find(r => r.ratio === selected)?.label || selected}
                </span>
            </div>

            {/* Ratio Buttons Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {aspectRatios.map((option) => {
                    const isSelected = selected === option.ratio;
                    const isHovered = hoveredRatio === option.ratio;
                    const previewDims = getPreviewDimensions(option);

                    return (
                        <button
                            key={option.ratio}
                            onClick={() => handleRatioSelect(option.ratio)}
                            onMouseEnter={() => handleMouseEnter(option.ratio)}
                            onMouseLeave={handleMouseLeave}
                            className={`
                                relative flex flex-col items-center justify-center p-4 rounded-lg
                                border transition-all duration-200 text-center min-h-[120px]
                                ${isSelected
                                    ? 'bg-gallery-accent/20 border-gallery-accent text-gallery-accent shadow-lg shadow-gallery-accent/20'
                                    : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/5'
                                }
                                ${isHovered && !isSelected ? 'scale-105' : ''}
                            `}
                            type="button"
                        >
                            {/* Preview Rectangle */}
                            <div className="mb-2 flex items-center justify-center h-16">
                                <div
                                    className={`
                                        border-2 rounded transition-all duration-200
                                        ${isSelected
                                            ? 'border-gallery-accent bg-gallery-accent/10'
                                            : 'border-current bg-current/10'
                                        }
                                    `}
                                    style={{
                                        width: `${previewDims.width}px`,
                                        height: `${previewDims.height}px`
                                    }}
                                />
                            </div>

                            {/* Ratio Text */}
                            <span className="text-sm font-bold mb-1">
                                {option.ratio}
                            </span>

                            {/* Label */}
                            <span className="text-xs font-medium mb-1">
                                {option.label}
                            </span>

                            {/* Icon */}
                            <span className="text-lg">
                                {option.icon}
                            </span>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-gallery-accent/30 to-yellow-600/30 rounded-lg -z-10" />
                            )}

                            {/* Selected Check Mark */}
                            {isSelected && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gallery-accent rounded-full flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-black"
                                    >
                                        <polyline points="20,6 9,17 4,12" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Ratio Description */}
            <div className="min-h-[3rem] flex items-center">
                {(hoveredRatio || selected) && (
                    <div className="text-sm text-gray-400 space-y-1 animate-fade-in">
                        {(() => {
                            const currentOption = aspectRatios.find(r => r.ratio === (hoveredRatio || selected));
                            if (!currentOption) return null;

                            return (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
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
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                        <span className="font-medium">
                                            {currentOption.description}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 ml-5">
                                        {currentOption.useCase}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 leading-relaxed">
                💡 <strong>提示：</strong>选择合适的比例可以让设计更适合特定的应用场景和展示平台
            </div>

            {/* Animation Styles */}
            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-4px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AspectRatioSelector;