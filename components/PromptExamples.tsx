/**
 * PromptExamples Component
 * 
 * Provides prompt examples, templates, and suggestions for users.
 * Features:
 * - Categorized prompt examples
 * - Quick-fill functionality
 * - Template selector with customizable parameters
 * - Smart prompt completion suggestions
 * 
 * Requirements: 2.4
 */

import React, { useState, useMemo } from 'react';

interface PromptExamplesProps {
    onSelectExample: (example: string) => void;
    currentPrompt: string;
    artifactTitle?: string;
}

interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    template: string;
    category: string;
    parameters?: string[];
}

interface PromptCategory {
    id: string;
    name: string;
    icon: string;
    examples: string[];
}

const PromptExamples: React.FC<PromptExamplesProps> = ({
    onSelectExample,
    currentPrompt,
    artifactTitle = "这个文物"
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('popular');
    const [showTemplates, setShowTemplates] = useState(false);

    // Prompt categories with examples
    const categories: PromptCategory[] = useMemo(() => [
        {
            id: 'popular',
            name: '热门推荐',
            icon: '🔥',
            examples: [
                `将${artifactTitle}设计成现代简约风格的海报`,
                `创作一个融合传统与现代元素的T恤图案，以${artifactTitle}为主题`,
                `设计一张以${artifactTitle}为主题的明信片，水彩风格`,
                `生成一个抽象艺术风格的手机壳图案，灵感来自${artifactTitle}`,
                `制作${artifactTitle}主题的冰箱贴，卡通可爱风格`
            ]
        },
        {
            id: 'products',
            name: '文创产品',
            icon: '🛍️',
            examples: [
                `${artifactTitle}主题的帆布包设计，极简风格`,
                `以${artifactTitle}为灵感的笔记本封面设计`,
                `${artifactTitle}元素的马克杯图案设计`,
                `制作${artifactTitle}主题的书签，古典风格`,
                `设计${artifactTitle}风格的胸针或徽章`,
                `${artifactTitle}主题的鼠标垫设计，现代感十足`
            ]
        },
        {
            id: 'styles',
            name: '艺术风格',
            icon: '🎨',
            examples: [
                `用印象派风格重新诠释${artifactTitle}`,
                `将${artifactTitle}转换为赛博朋克风格的艺术作品`,
                `${artifactTitle}的新中式设计，融合现代美学`,
                `用波普艺术风格表现${artifactTitle}`,
                `${artifactTitle}的蒸汽波美学设计`,
                `将${artifactTitle}设计成日式和风插画`
            ]
        },
        {
            id: 'occasions',
            name: '使用场景',
            icon: '🎪',
            examples: [
                `${artifactTitle}主题的生日贺卡设计`,
                `适合博物馆纪念品店的${artifactTitle}海报`,
                `${artifactTitle}风格的节日装饰品设计`,
                `制作${artifactTitle}主题的教育海报，适合学校展示`,
                `${artifactTitle}元素的商务礼品包装设计`,
                `适合咖啡厅装饰的${artifactTitle}艺术画`
            ]
        }
    ], [artifactTitle]);

    // Prompt templates with parameters
    const templates: PromptTemplate[] = useMemo(() => [
        {
            id: 'product-design',
            name: '产品设计模板',
            description: '适用于各种文创产品的通用模板',
            template: '将{artifact}设计成{style}风格的{product}，{requirements}',
            category: 'product',
            parameters: ['artifact', 'style', 'product', 'requirements']
        },
        {
            id: 'artistic-style',
            name: '艺术风格模板',
            description: '专注于艺术风格转换的模板',
            template: '用{artStyle}风格重新诠释{artifact}，{mood}，{colors}',
            category: 'art',
            parameters: ['artStyle', 'artifact', 'mood', 'colors']
        },
        {
            id: 'commercial-use',
            name: '商业应用模板',
            description: '适合商业用途的设计模板',
            template: '为{target}设计{artifact}主题的{application}，{brand}，{purpose}',
            category: 'commercial',
            parameters: ['target', 'artifact', 'application', 'brand', 'purpose']
        }
    ], []);

    // Smart completion suggestions based on current input
    const getSmartSuggestions = (prompt: string): string[] => {
        const suggestions: string[] = [];
        const lowerPrompt = prompt.toLowerCase();

        // Style suggestions
        if (lowerPrompt.includes('风格') || lowerPrompt.includes('style')) {
            suggestions.push('现代简约风格', '传统古典风格', '抽象艺术风格', '水彩画风格');
        }

        // Product suggestions
        if (lowerPrompt.includes('设计') || lowerPrompt.includes('制作')) {
            suggestions.push('海报', 'T恤图案', '明信片', '手机壳', '帆布包', '马克杯');
        }

        // Color suggestions
        if (lowerPrompt.includes('颜色') || lowerPrompt.includes('色彩')) {
            suggestions.push('暖色调', '冷色调', '单色调', '渐变色彩', '高对比度');
        }

        return suggestions.slice(0, 4); // Limit to 4 suggestions
    };

    const smartSuggestions = useMemo(() => {
        return currentPrompt.length > 5 ? getSmartSuggestions(currentPrompt) : [];
    }, [currentPrompt]);

    return (
        <div className="space-y-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                            px-3 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2
                            ${selectedCategory === category.id
                                ? 'bg-gallery-accent/20 border-gallery-accent text-gallery-accent border'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white border'
                            }
                        `}
                    >
                        <span>{category.icon}</span>
                        {category.name}
                    </button>
                ))}
                <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className={`
                        px-3 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2
                        ${showTemplates
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400 border'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white border'
                        }
                    `}
                >
                    <span>📝</span>
                    模板
                </button>
            </div>

            {/* Smart Suggestions */}
            {smartSuggestions.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-xs text-blue-300 mb-2 flex items-center gap-1">
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
                        智能建议：
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {smartSuggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    const newPrompt = currentPrompt.includes(suggestion)
                                        ? currentPrompt
                                        : `${currentPrompt} ${suggestion}`.trim();
                                    onSelectExample(newPrompt);
                                }}
                                className="px-2 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded border border-blue-500/30 hover:border-blue-500/50 transition-all"
                            >
                                + {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Templates View */}
            {showTemplates ? (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">提示词模板</h4>
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h5 className="text-sm font-medium text-white">{template.name}</h5>
                                    <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                                </div>
                                <button
                                    onClick={() => onSelectExample(template.template.replace(/\{artifact\}/g, artifactTitle))}
                                    className="px-3 py-1 text-xs bg-gallery-accent/20 hover:bg-gallery-accent/30 text-gallery-accent rounded border border-gallery-accent/30 hover:border-gallery-accent/50 transition-all"
                                >
                                    使用模板
                                </button>
                            </div>
                            <div className="text-xs text-gray-300 bg-black/30 rounded p-2 font-mono">
                                {template.template}
                            </div>
                            {template.parameters && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {template.parameters.map((param) => (
                                        <span
                                            key={param}
                                            className="px-2 py-0.5 text-xs bg-white/10 text-gray-400 rounded"
                                        >
                                            {param}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                /* Examples View */
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        {categories.find(c => c.id === selectedCategory)?.icon}
                        {categories.find(c => c.id === selectedCategory)?.name}示例
                    </h4>
                    <div className="grid gap-2">
                        {categories
                            .find(c => c.id === selectedCategory)
                            ?.examples.map((example, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onSelectExample(example)}
                                    className="text-left p-3 bg-black/20 hover:bg-black/30 border border-white/10 hover:border-white/20 rounded-lg text-sm text-gray-300 hover:text-white transition-all group"
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="flex-1 leading-relaxed">{example}</span>
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
                                            className="text-gray-500 group-hover:text-gallery-accent transition-colors flex-shrink-0 ml-2"
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

            {/* Quick Actions */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2">快速操作：</p>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onSelectExample(`将${artifactTitle}设计成`)}
                        className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded border border-white/10 hover:border-white/20 transition-all"
                    >
                        开始设计...
                    </button>
                    <button
                        onClick={() => onSelectExample(`创作一个以${artifactTitle}为主题的`)}
                        className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded border border-white/10 hover:border-white/20 transition-all"
                    >
                        创作主题...
                    </button>
                    <button
                        onClick={() => onSelectExample(`制作${artifactTitle}风格的`)}
                        className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded border border-white/10 hover:border-white/20 transition-all"
                    >
                        制作风格...
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptExamples;