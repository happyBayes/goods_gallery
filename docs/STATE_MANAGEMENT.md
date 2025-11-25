# Creative Design State Management

## Overview

The Creative Design Panel uses a custom React hook (`useCreativeDesignState`) for centralized state management with optional localStorage persistence. This provides a clean, type-safe way to manage all design-related state.

## Architecture

### State Structure

```typescript
interface CreativeDesignPanelState {
    screenshot: string | null;        // Base64 encoded screenshot
    prompt: string;                   // User's design prompt
    style: DesignStyle;              // Selected design style
    aspectRatio: string;             // Selected aspect ratio
    isGenerating: boolean;           // Generation in progress
    generatedDesign: GeneratedDesign | null;  // Generated result
    error: DesignError | null;       // Error state
}
```

### Hook Usage

```typescript
import { useCreativeDesignState } from '../hooks/useCreativeDesignState';

const {
    state,                    // Current state
    setScreenshot,           // Update screenshot
    setPrompt,               // Update prompt
    setStyle,                // Update style
    setAspectRatio,          // Update aspect ratio
    setIsGenerating,         // Update generating status
    setGeneratedDesign,      // Update generated design
    setError,                // Set error
    clearError,              // Clear error
    resetState,              // Reset to defaults
    clearResult,             // Clear result only
    updateState,             // Batch update
    isFormValid,             // Check if form is valid
    canGenerate              // Check if can generate
} = useCreativeDesignState({
    artifactId: 'artifact-123',
    artifactTitle: 'Ancient Vase',
    enablePersistence: true
});
```

## Features

### 1. Centralized State Management

All design panel state is managed in one place, making it easy to:
- Track state changes
- Debug issues
- Add new state fields
- Implement undo/redo (future)

### 2. Optional Persistence

State can be automatically persisted to localStorage:

```typescript
// Enable persistence (default)
useCreativeDesignState({
    artifactId: 'artifact-123',
    artifactTitle: 'Ancient Vase',
    enablePersistence: true
});

// Disable persistence
useCreativeDesignState({
    artifactId: 'artifact-123',
    artifactTitle: 'Ancient Vase',
    enablePersistence: false
});
```

**Persistence Rules:**
- Only persists draft state (screenshot, prompt, style, aspectRatio)
- Does NOT persist generated designs or errors
- State expires after 24 hours
- Only restores state for the same artifact
- Automatically clears expired or mismatched state

### 3. Validation

Built-in validation for form inputs:

```typescript
// Prompt validation
validatePrompt(prompt) // Returns { isValid, error? }

// Screenshot validation
validateScreenshot(screenshot) // Returns { isValid, error? }

// Form readiness check
isFormReady(state) // Returns { ready, errors[] }
```

### 4. Computed Values

The hook provides convenient computed values:

```typescript
const {
    hasScreenshot,    // Boolean: has screenshot
    hasPrompt,        // Boolean: has valid prompt
    hasResult,        // Boolean: has generated design
    hasError,         // Boolean: has error
    canGenerate       // Boolean: can generate design
} = useCreativeDesignState(options);
```

## Configuration

### Default Configuration

Located in `config/creativeDesignState.ts`:

```typescript
// Prompt configuration
export const PROMPT_CONFIG = {
    maxLength: 500,
    minLength: 10,
    warningThreshold: 50
};

// Persistence configuration
export const PERSISTENCE_CONFIG = {
    enabled: true,
    storageKey: 'creative-design-draft',
    expirationHours: 24,
    maxStorageSize: 5 * 1024 * 1024 // 5MB
};

// Aspect ratios
export const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3'];
```

### Customization

You can customize the configuration by modifying the config file or passing options:

```typescript
useCreativeDesignState({
    artifactId: 'artifact-123',
    artifactTitle: 'Ancient Vase',
    enablePersistence: true,
    persistenceKey: 'my-custom-key',  // Custom storage key
    onStateChange: (state) => {        // State change callback
        console.log('State changed:', state);
    }
});
```

## State Updates

### Individual Updates

```typescript
// Update single fields
setScreenshot('data:image/png;base64,...');
setPrompt('Design a modern poster');
setStyle(DesignStyle.MODERN);
setAspectRatio('16:9');
```

### Batch Updates

```typescript
// Update multiple fields at once
updateState({
    prompt: 'New prompt',
    style: DesignStyle.TRADITIONAL,
    aspectRatio: '1:1'
});
```

### Reset State

```typescript
// Reset to defaults (also clears persistence)
resetState();

// Clear only result and error
clearResult();

// Clear only error
clearError();
```

## Best Practices

### 1. Use Computed Values

Instead of:
```typescript
const canSubmit = state.screenshot && state.prompt.trim() && !state.isGenerating;
```

Use:
```typescript
const { canGenerate } = useCreativeDesignState(options);
```

### 2. Validate Before Submission

```typescript
const handleGenerate = () => {
    if (!canGenerate) {
        const { ready, errors } = isFormReady(state);
        if (!ready) {
            console.error('Form validation failed:', errors);
            return;
        }
    }
    
    // Proceed with generation
    setIsGenerating(true);
    // ...
};
```

### 3. Handle Errors Properly

```typescript
try {
    const design = await generateDesign(request);
    setGeneratedDesign(design);
    clearError();
} catch (error) {
    setError({
        type: DesignErrorType.API_ERROR,
        message: error.message,
        retryable: true
    });
}
```

### 4. Clean Up on Unmount

The hook automatically handles cleanup, but you can manually reset if needed:

```typescript
useEffect(() => {
    return () => {
        // Optional: clear state on unmount
        resetState();
    };
}, []);
```

## Storage Management

### Check Storage Size

```typescript
import { estimateStorageSize, formatStorageSize } from '../config/creativeDesignState';

const size = estimateStorageSize(state);
console.log('Storage size:', formatStorageSize(size));
```

### Clear Persisted State

```typescript
// Reset state (also clears localStorage)
resetState();

// Or manually clear localStorage
localStorage.removeItem('creative-design-draft');
```

## Testing

### Mock the Hook

```typescript
jest.mock('../hooks/useCreativeDesignState', () => ({
    useCreativeDesignState: () => ({
        state: {
            screenshot: null,
            prompt: '',
            style: DesignStyle.MODERN,
            aspectRatio: '1:1',
            isGenerating: false,
            generatedDesign: null,
            error: null
        },
        setScreenshot: jest.fn(),
        setPrompt: jest.fn(),
        // ... other functions
        canGenerate: false
    })
}));
```

### Test State Updates

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCreativeDesignState } from '../hooks/useCreativeDesignState';

test('updates prompt correctly', () => {
    const { result } = renderHook(() => 
        useCreativeDesignState({
            artifactId: 'test',
            artifactTitle: 'Test',
            enablePersistence: false
        })
    );
    
    act(() => {
        result.current.setPrompt('Test prompt');
    });
    
    expect(result.current.state.prompt).toBe('Test prompt');
});
```

## Troubleshooting

### State Not Persisting

1. Check if persistence is enabled
2. Verify localStorage is available
3. Check browser storage quota
4. Ensure artifact ID matches

### State Not Restoring

1. Check if state is expired (>24 hours)
2. Verify artifact ID matches
3. Check for localStorage errors in console
4. Clear localStorage and try again

### Performance Issues

1. Disable persistence if not needed
2. Reduce screenshot quality/size
3. Use batch updates instead of individual updates
4. Implement debouncing for frequent updates

## Future Enhancements

- [ ] Undo/redo functionality
- [ ] State history tracking
- [ ] IndexedDB for larger storage
- [ ] State synchronization across tabs
- [ ] Optimistic updates
- [ ] State migration for version updates
