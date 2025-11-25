/**
 * PromptInput Component
 * 
 * A specialized text input component for AI creative design prompts.
 * Features:
 * - Multi-line textarea with character counting
 * - Maximum length validation (500 characters)
 * - Input validation and error display
 * - Responsive design with proper styling
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.5
 */

import React, { useState, useCallback } from 'react';
import { PromptInputProps } from '../types/creativeDesign';

const PromptInput: React.FC<PromptInputProps> = ({
    value,
    onChange,
    maxLength = 500,
    placeholder = "描述你想要的文创设计，例如：将这个文物设计成现代简约风格的明信片...",
    suggestions = []
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasError, setHasError] = useState(false);

    const remainingChars = maxLength - value.length;
    const isNearLimit = remainingChars < 50;
    const isAtLimit = remainingChars <= 0;
    const isEmpty = value.trim().length === 0;

    // Handle input change with validation
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        // Enforce maximum length
        if (newValue.length <= maxLength) {
            onChange(newValue);
            setHasError(false);
        } else {
            // Truncate to max length if exceeded
            const truncatedValue = newValue.slice(0, maxLength);
            onChange(truncatedValue);
            setHasError(true);
        }
    }, [onChange, maxLength]);

    // Handle focus events
    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        // Validate on blur - check if empty
        if (isEmpty) {
            setHasError(true);
        }
    }, [isEmpty]);

    // Handle suggestion click
    const handleSuggestionClick = useCallback((suggestion: string) => {
        onChange(suggestion);
        setHasError(false);
    }, [onChange]);

    return (
        <div className="space-y-3">
            {/* Input Label */}
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
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    设计提示词
                </label>
                {isEmpty && (
                    <span className="text-xs text-red-400">* 必填</span>
                )}
            </div>

            {/* Textarea */}
            <div className="relative">
                <textarea
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`
                        w-full h-32 bg-black/40 border rounded-lg p-4 text-sm text-white 
                        placeholder-gray-500 focus:outline-none transition-all resize-none
                        ${isFocused
                            ? 'border-gallery-accent/50 ring-1 ring-gallery-accent/50'
                            : hasError
                                ? 'border-red-500/50 ring-1 ring-red-500/50'
                                : 'border-white/10 hover:border-white/20'
                        }
                    `}
                    maxLength={maxLength}
                    rows={4}
                />

                {/* Focus indicator */}
                {isFocused && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gallery-accent/20 to-yellow-600/20 rounded-lg -z-10" />
                )}
            </div>

            {/* Character count and validation */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {hasError && isEmpty && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            请输入设计提示词
                        </span>
                    )}
                    {hasError && !isEmpty && isAtLimit && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <triangle points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            已达到最大字符限制
                        </span>
                    )}
                </div>

                <span className={`text-xs ${isAtLimit
                    ? 'text-red-400'
                    : isNearLimit
                        ? 'text-yellow-500'
                        : 'text-gray-500'
                    }`}>
                    {value.length} / {maxLength} 字符
                </span>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
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
                        💡 示例提示词：
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full border border-white/5 hover:border-white/20 transition-all duration-200 hover:scale-105"
                                type="button"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Help text */}
            <div className="text-xs text-gray-500 leading-relaxed">
                💡 <strong>提示：</strong>详细描述设计风格、用途和期望效果，例如"现代简约风格的海报，适合博物馆纪念品"
            </div>
        </div>
    );
};

export default PromptInput;