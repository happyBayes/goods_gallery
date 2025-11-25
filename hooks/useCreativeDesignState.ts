/**
 * useCreativeDesignState Hook
 * 
 * Custom React hook for managing CreativeDesignPanel state with optional persistence.
 * Handles screenshot, prompt, design parameters, generation status, and results.
 * 
 * Features:
 * - Centralized state management for the design panel
 * - Optional localStorage persistence for draft designs
 * - Automatic state restoration on mount
 * - Type-safe state updates
 * 
 * Requirements: All requirements foundation
 */

import { useState, useEffect, useCallback } from 'react';
import {
    DesignStyle,
    GeneratedDesign,
    DesignError,
    CreativeDesignPanelState
} from '../types/creativeDesign';
import {
    DEFAULT_DESIGN_STATE,
    PERSISTENCE_CONFIG,
    validatePrompt,
    validateScreenshot
} from '../config/creativeDesignState';

/**
 * Configuration options for the state hook
 */
interface UseCreativeDesignStateOptions {
    artifactId: string;
    artifactTitle: string;
    enablePersistence?: boolean; // Enable localStorage persistence
    persistenceKey?: string; // Custom localStorage key
    onStateChange?: (state: CreativeDesignPanelState) => void; // State change callback
}

/**
 * Persisted state structure (subset of full state)
 */
interface PersistedDesignState {
    screenshot: string | null;
    prompt: string;
    style: DesignStyle;
    aspectRatio: string;
    artifactId: string;
    timestamp: number;
}

/**
 * Default state values
 */
const DEFAULT_STATE: CreativeDesignPanelState = DEFAULT_DESIGN_STATE;

/**
 * Custom hook for managing creative design panel state
 */
export function useCreativeDesignState(options: UseCreativeDesignStateOptions) {
    const {
        artifactId,
        artifactTitle,
        enablePersistence = PERSISTENCE_CONFIG.enabled,
        persistenceKey = PERSISTENCE_CONFIG.storageKey,
        onStateChange
    } = options;

    // Initialize state
    const [state, setState] = useState<CreativeDesignPanelState>(() => {
        // Try to restore persisted state if enabled
        if (enablePersistence) {
            const restored = restorePersistedState(persistenceKey, artifactId);
            if (restored) {
                return { ...DEFAULT_STATE, ...restored };
            }
        }
        return DEFAULT_STATE;
    });

    // Persist state changes to localStorage
    useEffect(() => {
        if (enablePersistence && !state.isGenerating) {
            persistState(persistenceKey, {
                screenshot: state.screenshot,
                prompt: state.prompt,
                style: state.style,
                aspectRatio: state.aspectRatio,
                artifactId,
                timestamp: Date.now()
            });
        }
    }, [
        state.screenshot,
        state.prompt,
        state.style,
        state.aspectRatio,
        enablePersistence,
        persistenceKey,
        artifactId
    ]);

    // Notify state changes
    useEffect(() => {
        if (onStateChange) {
            onStateChange(state);
        }
    }, [state, onStateChange]);

    // State update functions
    const setScreenshot = useCallback((screenshot: string | null) => {
        setState(prev => ({ ...prev, screenshot }));
    }, []);

    const setPrompt = useCallback((prompt: string) => {
        setState(prev => ({ ...prev, prompt }));
    }, []);

    const setStyle = useCallback((style: DesignStyle) => {
        setState(prev => ({ ...prev, style }));
    }, []);

    const setAspectRatio = useCallback((aspectRatio: string) => {
        setState(prev => ({ ...prev, aspectRatio }));
    }, []);

    const setIsGenerating = useCallback((isGenerating: boolean) => {
        setState(prev => ({ ...prev, isGenerating }));
    }, []);

    const setGeneratedDesign = useCallback((generatedDesign: GeneratedDesign | null) => {
        setState(prev => ({ ...prev, generatedDesign }));
    }, []);

    const setError = useCallback((error: DesignError | null) => {
        setState(prev => ({ ...prev, error }));
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Reset state to defaults
    const resetState = useCallback(() => {
        setState(DEFAULT_STATE);
        if (enablePersistence) {
            clearPersistedState(persistenceKey);
        }
    }, [enablePersistence, persistenceKey]);

    // Clear only the generated design and error
    const clearResult = useCallback(() => {
        setState(prev => ({
            ...prev,
            generatedDesign: null,
            error: null
        }));
    }, []);

    // Update multiple state fields at once
    const updateState = useCallback((updates: Partial<CreativeDesignPanelState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    // Check if form is valid for submission
    const isFormValid = useCallback(() => {
        const screenshotValid = validateScreenshot(state.screenshot).isValid;
        const promptValid = validatePrompt(state.prompt).isValid;
        return screenshotValid && promptValid && !state.isGenerating;
    }, [state.screenshot, state.prompt, state.isGenerating]);

    return {
        // State
        state,

        // Individual setters
        setScreenshot,
        setPrompt,
        setStyle,
        setAspectRatio,
        setIsGenerating,
        setGeneratedDesign,
        setError,

        // Utility functions
        clearError,
        resetState,
        clearResult,
        updateState,
        isFormValid,

        // Computed values
        hasScreenshot: !!state.screenshot,
        hasPrompt: !!state.prompt.trim(),
        hasResult: !!state.generatedDesign,
        hasError: !!state.error,
        canGenerate: !state.isGenerating && !!state.screenshot && !!state.prompt.trim()
    };
}

/**
 * Persist state to localStorage
 */
function persistState(key: string, state: PersistedDesignState): void {
    try {
        const serialized = JSON.stringify(state);
        localStorage.setItem(key, serialized);
    } catch (error) {
        console.warn('Failed to persist design state:', error);
    }
}

/**
 * Restore persisted state from localStorage
 */
function restorePersistedState(
    key: string,
    currentArtifactId: string
): Partial<CreativeDesignPanelState> | null {
    try {
        const serialized = localStorage.getItem(key);
        if (!serialized) return null;

        const persisted: PersistedDesignState = JSON.parse(serialized);

        // Only restore if it's for the same artifact and not too old
        const expirationMs = PERSISTENCE_CONFIG.expirationHours * 60 * 60 * 1000;
        const isExpired = Date.now() - persisted.timestamp > expirationMs;
        const isSameArtifact = persisted.artifactId === currentArtifactId;

        if (!isExpired && isSameArtifact) {
            return {
                screenshot: persisted.screenshot,
                prompt: persisted.prompt,
                style: persisted.style,
                aspectRatio: persisted.aspectRatio
            };
        }

        // Clear expired or mismatched state
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.warn('Failed to restore design state:', error);
        return null;
    }
}

/**
 * Clear persisted state from localStorage
 */
function clearPersistedState(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn('Failed to clear persisted state:', error);
    }
}
