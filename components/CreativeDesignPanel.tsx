/**
 * CreativeDesignPanel Component
 * 
 * A comprehensive AI-powered creative design workspace that allows users to:
 * - Capture screenshots of 3D artifact models
 * - Input design prompts with character limits
 * - Select design styles (modern, traditional, abstract, etc.)
 * - Configure aspect ratios for different use cases
 * - Generate AI-powered creative designs using Gemini Image Pro
 * 
 * Features:
 * - Responsive design (mobile and desktop)
 * - Slide-in panel with overlay
 * - Real-time character counting
 * - Quick prompt examples
 * - Visual style selection
 * 
 * Requirements: 7.1, 7.3
 */

import React, { useEffect } from 'react';
import { Artifact } from '../types';
import { DesignStyle } from '../types/creativeDesign';
import { useCreativeDesignState } from '../hooks/useCreativeDesignState';
import PromptInputWithExamples from './PromptInputWithExamples';
import DesignStyleSelector from './DesignStyleSelector';
import AspectRatioSelector from './AspectRatioSelector';

interface CreativeDesignPanelProps {
    artifact: Artifact;
    isOpen: boolean;
    onClose: () => void;
    screenshot: string | null;
    onCaptureScreenshot: () => void;
    enablePersistence?: boolean; // Optional: enable state persistence
}

const CreativeDesignPanel: React.FC<CreativeDesignPanelProps> = ({
    artifact,
    isOpen,
    onClose,
    screenshot,
    onCaptureScreenshot,
    enablePersistence = true
}) => {
    // Use the custom state management hook
    const {
        state,
        setScreenshot,
        setPrompt,
        setStyle,
        setAspectRatio,
        canGenerate
    } = useCreativeDesignState({
        artifactId: artifact.id,
        artifactTitle: artifact.title,
        enablePersistence
    });

    // Sync external screenshot prop with internal state
    useEffect(() => {
        if (screenshot !== state.screenshot) {
            setScreenshot(screenshot);
        }
    }, [screenshot, state.screenshot, setScreenshot]);

    const maxPromptLength = 500;
    const remainingChars = maxPromptLength - state.prompt.length;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <div
                className={`
          fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[700px]
          bg-gallery-dark/95 backdrop-blur-md border-l border-white/10
          shadow-2xl z-50 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gallery-black/90 backdrop-blur-md border-b border-white/10 p-6 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gallery-accent uppercase tracking-widest">
                                Jworld文创设计工作台
                            </span>
                            <h2 className="text-2xl font-serif text-white mt-2">创意设计生成</h2>
                            <p className="text-sm text-gray-400 mt-1">基于 {artifact.title} 生成文创设计</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            aria-label="关闭设计面板"
                        >
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
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Screenshot Section */}
                    <div className="bg-black/20 rounded-xl border border-white/5 p-5">
                        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
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
                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                <circle cx="12" cy="13" r="3" />
                            </svg>
                            参考图像
                        </h3>

                        {screenshot ? (
                            <div className="space-y-3">
                                <div className="relative aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/5">
                                    <img
                                        src={screenshot}
                                        alt="3D模型截图"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <button
                                    onClick={onCaptureScreenshot}
                                    className="w-full py-2 text-xs font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded transition-colors flex items-center justify-center gap-2"
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
                                        <polyline points="23 4 23 10 17 10" />
                                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                    </svg>
                                    重新截图
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-500 mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mx-auto opacity-30"
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">
                                    请先截取 3D 模型视图作为设计参考
                                </p>
                                <button
                                    onClick={onCaptureScreenshot}
                                    className="px-6 py-2 bg-gallery-accent text-black font-medium text-sm rounded-lg hover:bg-yellow-400 transition-colors"
                                >
                                    📷 截取当前视图
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Prompt Input Section */}
                    <PromptInputWithExamples
                        value={state.prompt}
                        onChange={setPrompt}
                        maxLength={maxPromptLength}
                        placeholder="描述你想要的文创设计，例如：将这个文物设计成现代简约风格的海报..."
                        showExamples={true}
                        artifactTitle={artifact.title}
                    />

                    {/* Design Style Section */}
                    <div className="bg-black/20 rounded-xl border border-white/5 p-5">
                        <DesignStyleSelector
                            selected={state.style}
                            onChange={setStyle}
                        />
                    </div>

                    {/* Aspect Ratio Section */}
                    <div className="bg-black/20 rounded-xl border border-white/5 p-5">
                        <AspectRatioSelector
                            selected={state.aspectRatio}
                            onChange={setAspectRatio}
                        />
                    </div>

                    {/* Generate Button */}
                    <button
                        disabled={!canGenerate}
                        className={`
              w-full py-4 px-6 rounded-lg font-semibold text-base transition-all flex items-center justify-center gap-3
              ${!canGenerate
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-gallery-accent to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-600 shadow-lg shadow-yellow-900/30 hover:shadow-yellow-900/50'
                            }
            `}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        ✨ 生成设计
                    </button>

                    {/* Info Notice */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <p className="text-xs text-blue-300 leading-relaxed">
                            💡 <strong>提示：</strong>生成过程可能需要 10-30 秒。请确保提示词清晰描述您想要的设计风格和用途。
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreativeDesignPanel;
