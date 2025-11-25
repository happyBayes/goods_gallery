/**
 * DesignStyleSelector Component
 * 
 * A style selector component that allows users to choose from predefined design styles.
 * Features:
 * - Button group UI with visual feedback
 * - Style descriptions on hover
 * - Responsive design
 * - Integration with DesignStyle enum
 * 
 * Requirements: 6.1, 6.2, 6.3
 */

import React, { useState } from 'react';
import { DesignStyle, STYLE_DESCRIPTIONS, DesignStyleSelectorProps } from '../types/creativeDesign';

const DesignStyleSelector: React.FC<DesignStyleSelectorProps> = ({
    selected,
    onChange
}) => {
    const [hoveredStyle, setHoveredStyle] = useState<DesignStyle | null>(null);

    // Style icons mapping
    const styleIcons: Record<DesignStyle, string> = {
        [DesignStyle.MODERN]: '🏢',
        [DesignStyle.TRADITIONAL]: '🏛️',
        [DesignStyle.ABSTRACT]: '🎨',
        [DesignStyle.MINIMALIST]: '⚪',
        [DesignStyle.WATERCOLOR]: '🌊',
        [DesignStyle.VINTAGE]: '📜'
    };

    // Style display names
    const styleNames: Record<DesignStyle, string> = {
        [DesignStyle.MODERN]: '现代',
        [DesignStyle.TRADITIONAL]: '传统',
        [DesignStyle.ABSTRACT]: '抽象',
        [DesignStyle.MINIMALIST]: '极简',
        [DesignStyle.WATERCOLOR]: '水彩',
        [DesignStyle.VINTAGE]: '复古'
    };

    const handleStyleSelect = (style: DesignStyle) => {
        onChange(style);
    };

    const handleMouseEnter = (style: DesignStyle) => {
        setHoveredStyle(style);
    };

    const handleMouseLeave = () => {
        setHoveredStyle(null);
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
                        <circle cx="13.5" cy="6.5" r=".5" />
                        <circle cx="17.5" cy="10.5" r=".5" />
                        <circle cx="8.5" cy="7.5" r=".5" />
                        <circle cx="6.5" cy="12.5" r=".5" />
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                    </svg>
                    设计风格
                </label>
                <span className="text-xs text-gray-500">
                    已选择: {styleNames[selected]}
                </span>
            </div>

            {/* Style Buttons Grid */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {Object.values(DesignStyle).map((style) => {
                    const isSelected = selected === style;
                    const isHovered = hoveredStyle === style;

                    return (
                        <button
                            key={style}
                            onClick={() => handleStyleSelect(style)}
                            onMouseEnter={() => handleMouseEnter(style)}
                            onMouseLeave={handleMouseLeave}
                            className={`
                                relative flex flex-col items-center justify-center p-3 rounded-lg
                                border transition-all duration-200 text-center min-h-[80px]
                                ${isSelected
                                    ? 'bg-gallery-accent/20 border-gallery-accent text-gallery-accent shadow-lg shadow-gallery-accent/20'
                                    : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/5'
                                }
                                ${isHovered && !isSelected ? 'scale-105' : ''}
                            `}
                            type="button"
                        >
                            {/* Icon */}
                            <span className="text-2xl mb-1">
                                {styleIcons[style]}
                            </span>

                            {/* Style Name */}
                            <span className="text-xs font-medium">
                                {styleNames[style]}
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

            {/* Style Description */}
            <div className="min-h-[2rem] flex items-center">
                {(hoveredStyle || selected) && (
                    <div className="text-sm text-gray-400 flex items-center gap-2 animate-fade-in">
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
                        <span>
                            {STYLE_DESCRIPTIONS[hoveredStyle || selected]}
                        </span>
                    </div>
                )}
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 leading-relaxed">
                💡 <strong>提示：</strong>选择的风格将自动添加到提示词中，影响AI生成的设计效果
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

export default DesignStyleSelector;