# Prompt Input Components Documentation

## Overview

The prompt input functionality for the AI Creative Design feature consists of three main components that work together to provide a comprehensive prompt input experience.

## Components

### 1. PromptInput

A basic prompt input component with validation and character counting.

**Features:**
- Multi-line textarea with 500 character limit
- Real-time character counting with visual indicators
- Input validation with error messages
- Focus states and visual feedback
- Responsive design

**Props:**
```typescript
interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    maxLength?: number; // Default: 500
    placeholder?: string;
    suggestions?: string[];
    showExamples?: boolean;
    artifactTitle?: string;
}
```

### 2. PromptExamples

A comprehensive examples and templates system for prompt suggestions.

**Features:**
- Categorized prompt examples (Popular, Products, Styles, Occasions)
- Template system with customizable parameters
- Smart suggestions based on current input
- Quick action buttons
- Dynamic artifact title integration

**Categories:**
- 🔥 **热门推荐** - Popular and commonly used prompts
- 🛍️ **文创产品** - Product-specific design prompts
- 🎨 **艺术风格** - Art style transformation prompts
- 🎪 **使用场景** - Occasion and context-specific prompts

**Templates:**
- Product Design Template
- Artistic Style Template
- Commercial Use Template

### 3. PromptInputWithExamples

A combined component that integrates both input and examples functionality.

**Features:**
- Complete prompt input system
- Toggleable examples panel
- Quick start suggestions when input is empty
- Smart integration with artifact context
- Enhanced user experience with guided prompting

## Usage

### Basic Usage

```tsx
import { PromptInput } from '../components';

<PromptInput
    value={prompt}
    onChange={setPrompt}
    maxLength={500}
    placeholder="描述你想要的文创设计..."
/>
```

### With Examples

```tsx
import { PromptInputWithExamples } from '../components';

<PromptInputWithExamples
    value={prompt}
    onChange={setPrompt}
    maxLength={500}
    showExamples={true}
    artifactTitle="青铜鼎"
/>
```

### Standalone Examples

```tsx
import { PromptExamples } from '../components';

<PromptExamples
    onSelectExample={handleSelectExample}
    currentPrompt={currentPrompt}
    artifactTitle="青铜鼎"
/>
```

## Integration

The components are integrated into the `CreativeDesignPanel` component, replacing the previous basic textarea implementation with a comprehensive prompt input system.

### Key Improvements

1. **Enhanced User Experience**: Guided prompting with examples and templates
2. **Smart Suggestions**: Context-aware suggestions based on current input
3. **Validation**: Proper input validation with user-friendly error messages
4. **Accessibility**: Better focus management and visual feedback
5. **Extensibility**: Modular design allows for easy customization and extension

## Requirements Fulfilled

- ✅ **2.1**: Multi-line text input box implemented
- ✅ **2.2**: Character count display with visual indicators
- ✅ **2.3**: Input validation and error messages
- ✅ **2.4**: Prompt examples and suggestions system
- ✅ **2.5**: Maximum length limit (500 characters) enforced

## File Structure

```
goods_gallery/components/
├── PromptInput.tsx              # Basic input component
├── PromptExamples.tsx           # Examples and templates
├── PromptInputWithExamples.tsx  # Combined component
└── index.ts                     # Component exports
```

## Styling

All components follow the existing design system:
- Dark theme with gallery-specific colors
- Consistent spacing and typography
- Hover and focus states
- Responsive design for mobile and desktop
- Gallery accent color for highlights

## Future Enhancements

Potential improvements for future iterations:
- AI-powered prompt completion
- User-generated template saving
- Prompt history and favorites
- Multi-language support
- Advanced template parameters