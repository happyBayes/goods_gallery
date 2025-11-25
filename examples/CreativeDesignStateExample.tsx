/**
 * Creative Design State Example
 * 
 * This file demonstrates how to use the useCreativeDesignState hook
 * in different scenarios.
 */

import React from 'react';
import { useCreativeDesignState } from '../hooks/useCreativeDesignState';
import { DesignStyle, DesignErrorType } from '../types/creativeDesign';

/**
 * Example 1: Basic Usage
 */
export function BasicExample() {
    const {
        state,
        setPrompt,
        setStyle,
        canGenerate
    } = useCreativeDesignState({
        artifactId: 'artifact-001',
        artifactTitle: 'Ancient Vase',
        enablePersistence: true
    });

    return (
        <div>
            <h2>Basic State Management</h2>
            <input
                type="text"
                value={state.prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter design prompt"
            />
            <select
                value={state.style}
                onChange={(e) => setStyle(e.target.value as DesignStyle)}
            >
                {Object.values(DesignStyle).map(style => (
                    <option key={style} value={style}>{style}</option>
                ))}
            </select>
            <button disabled={!canGenerate}>
                Generate Design
            </button>
        </div>
    );
}

/**
 * Example 2: With Persistence Disabled
 */
export function NoPersistenceExample() {
    const {
        state,
        setPrompt,
        resetState
    } = useCreativeDesignState({
        artifactId: 'artifact-002',
        artifactTitle: 'Bronze Statue',
        enablePersistence: false // Disable persistence
    });

    return (
        <div>
            <h2>No Persistence Mode</h2>
            <p>State will not be saved to localStorage</p>
            <input
                type="text"
                value={state.prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <button onClick={resetState}>Reset</button>
        </div>
    );
}

/**
 * Example 3: With State Change Callback
 */
export function WithCallbackExample() {
    const {
        state,
        setPrompt,
        setStyle
    } = useCreativeDesignState({
        artifactId: 'artifact-003',
        artifactTitle: 'Jade Pendant',
        enablePersistence: true,
        onStateChange: (newState) => {
            console.log('State changed:', newState);
            // You can trigger analytics, logging, etc.
        }
    });

    return (
        <div>
            <h2>With State Change Callback</h2>
            <p>Check console for state changes</p>
            <input
                type="text"
                value={state.prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
        </div>
    );
}

/**
 * Example 4: Batch Updates
 */
export function BatchUpdateExample() {
    const {
        state,
        updateState
    } = useCreativeDesignState({
        artifactId: 'artifact-004',
        artifactTitle: 'Ceramic Bowl'
    });

    const applyPreset = (preset: 'modern' | 'traditional') => {
        if (preset === 'modern') {
            updateState({
                style: DesignStyle.MODERN,
                aspectRatio: '16:9',
                prompt: '现代简约风格设计'
            });
        } else {
            updateState({
                style: DesignStyle.TRADITIONAL,
                aspectRatio: '1:1',
                prompt: '传统文化风格设计'
            });
        }
    };

    return (
        <div>
            <h2>Batch Updates</h2>
            <button onClick={() => applyPreset('modern')}>
                Apply Modern Preset
            </button>
            <button onClick={() => applyPreset('traditional')}>
                Apply Traditional Preset
            </button>
            <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
    );
}

/**
 * Example 5: Error Handling
 */
export function ErrorHandlingExample() {
    const {
        state,
        setError,
        clearError,
        hasError
    } = useCreativeDesignState({
        artifactId: 'artifact-005',
        artifactTitle: 'Stone Tablet'
    });

    const simulateError = () => {
        setError({
            type: DesignErrorType.API_ERROR,
            message: 'Failed to generate design',
            retryable: true
        });
    };

    return (
        <div>
            <h2>Error Handling</h2>
            <button onClick={simulateError}>Simulate Error</button>
            {hasError && (
                <div style={{ color: 'red' }}>
                    <p>Error: {state.error?.message}</p>
                    <button onClick={clearError}>Clear Error</button>
                </div>
            )}
        </div>
    );
}

/**
 * Example 6: Complete Form
 */
export function CompleteFormExample() {
    const {
        state,
        setScreenshot,
        setPrompt,
        setStyle,
        setAspectRatio,
        setIsGenerating,
        setGeneratedDesign,
        setError,
        clearResult,
        canGenerate,
        hasResult
    } = useCreativeDesignState({
        artifactId: 'artifact-006',
        artifactTitle: 'Gold Ornament'
    });

    const handleGenerate = async () => {
        if (!canGenerate) return;

        setIsGenerating(true);
        clearResult();

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock generated design
            setGeneratedDesign({
                id: 'design-001',
                imageUrl: 'data:image/png;base64,...',
                prompt: state.prompt,
                enhancedPrompt: `Enhanced: ${state.prompt}`,
                style: state.style,
                referenceImage: state.screenshot!,
                timestamp: new Date(),
                artifactId: 'artifact-006',
                artifactTitle: 'Gold Ornament',
                metadata: {
                    aspectRatio: state.aspectRatio,
                    fileSize: 1024000,
                    dimensions: { width: 1024, height: 1024 },
                    generationTime: 2000
                }
            });
        } catch (error) {
            setError({
                type: DesignErrorType.API_ERROR,
                message: 'Generation failed',
                retryable: true
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <h2>Complete Form Example</h2>

            {/* Screenshot */}
            <div>
                <button onClick={() => setScreenshot('data:image/png;base64,mock')}>
                    Capture Screenshot
                </button>
                {state.screenshot && <p>✓ Screenshot captured</p>}
            </div>

            {/* Prompt */}
            <div>
                <textarea
                    value={state.prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter design prompt"
                />
            </div>

            {/* Style */}
            <div>
                <label>Style:</label>
                {Object.values(DesignStyle).map(style => (
                    <button
                        key={style}
                        onClick={() => setStyle(style)}
                        style={{
                            fontWeight: state.style === style ? 'bold' : 'normal'
                        }}
                    >
                        {style}
                    </button>
                ))}
            </div>

            {/* Aspect Ratio */}
            <div>
                <label>Aspect Ratio:</label>
                {['1:1', '16:9', '9:16', '4:3'].map(ratio => (
                    <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        style={{
                            fontWeight: state.aspectRatio === ratio ? 'bold' : 'normal'
                        }}
                    >
                        {ratio}
                    </button>
                ))}
            </div>

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={!canGenerate || state.isGenerating}
            >
                {state.isGenerating ? 'Generating...' : 'Generate Design'}
            </button>

            {/* Result */}
            {hasResult && (
                <div>
                    <h3>Generated Design</h3>
                    <p>ID: {state.generatedDesign?.id}</p>
                    <p>Generation Time: {state.generatedDesign?.metadata.generationTime}ms</p>
                    <button onClick={clearResult}>Clear Result</button>
                </div>
            )}

            {/* Error */}
            {state.error && (
                <div style={{ color: 'red' }}>
                    <p>Error: {state.error.message}</p>
                </div>
            )}
        </div>
    );
}
