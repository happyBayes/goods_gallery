/**
 * PromptInputWithExamples Component
 * 
 * A comprehensive prompt input system that combines:
 * - Multi-line text input with validation
 * - Character counting and limits
 * - Prompt examples and templates
 * - Smart suggestions and quick actions
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import React, { useState } from 'react';
import PromptInput from './PromptInput';
import PromptExamples from './PromptExamples';
import { PromptInputProps } from '../types/creativeDesign';

interface PromptInputWithExamplesProps extends PromptInputProps {
    showExamples?: boolean;
    artifactTitle?: string;
}

const PromptInputWithExamples: React.FC<PromptInputWithExamplesProps> = ({
    value,
    onChange,
    maxLength = 500,
    placeholder,
    suggestions = [],
    showExamples = true,
    artifactTitle = "这个文物"
}) => {
    const [showExamplesPanel, setShowExamplesPanel] = useState(false);

    // Handle example selection
    const handleSelectExample = (example: string) => {
        onChange(example);
        setShowExamplesPanel(false); // Close examples panel after selection
    };

    // Enhanced suggestions that include default examples
    const enhancedSuggestions = [
        `将${artifactTitle}设计成现代简约风格的海报`,
        `创作一个融合传统与现代元素的T恤图案`,
        `设计一张以${artifactTitle}为主题的明信片，水彩风格`,
        `生成一个抽象艺术风格的手机壳图案`,
        ...suggestions
    ];

    return (
        <div className="bg-black/20 rounded-xl border border-white/5 p-5 space-y-4">
            {/* Header with toggle */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
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
                </h3>

                {showExamples && (
                    <button
                        onClick={() => setShowExamplesPanel(!showExamplesPanel)}
                        className={`
                            px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-2
                            ${showExamplesPanel
                                ? 'bg-gallery-accent/20 border-gallery-accent text-gallery-accent border'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white border'
                            }
                        `}
                    >
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
                        {showExamplesPanel ? '隐藏示例' : '查看示例'}
                    </button>
                )}
            </div>

            {/* Prompt Input */}
            <PromptInput
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                placeholder={placeholder}
                suggestions={enhancedSuggestions}
            />

            {/* Examples Panel */}
            {showExamples && showExamplesPanel && (
                <div className="border-t border-white/10 pt-4">
                    <PromptExamples
                        onSelectExample={handleSelectExample}
                        currentPrompt={value}
                        artifactTitle={artifactTitle}
                    />
                </div>
            )}

            {/* Quick Start Actions */}
            {!showExamplesPanel && value.length === 0 && (
                <div className="border-t border-white/10 pt-4">
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
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
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        快速开始：
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {enhancedSuggestions.slice(0, 4).map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelectExample(suggestion)}
                                className="text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-xs text-gray-400 hover:text-white transition-all group"
                            >
                                <div className="flex items-start justify-between">
                                    <span className="flex-1 leading-relaxed">{suggestion}</span>
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
                                        className="text-gray-600 group-hover:text-gallery-accent transition-colors flex-shrink-0 ml-2"
                                    >
                                        <polyline points="9 11 12 14 22 4" />
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptInputWithExamples;