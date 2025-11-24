# AI Creative Design Feature

## Overview

The AI Creative Design feature enables users to generate creative 2D designs from 3D artifact models using Gemini Image Pro AI. Users can capture screenshots of 3D models, add text prompts, and generate designs suitable for cultural creative products.

## Architecture

### Directory Structure

```
goods_gallery/
├── types/
│   ├── creativeDesign.ts      # TypeScript interfaces and enums
│   └── index.ts                # Type exports
├── utils/
│   ├── imageUtils.ts           # Image processing utilities
│   ├── rateLimiter.ts          # Rate limiting implementation
│   └── index.ts                # Utility exports
├── services/
│   ├── geminiImageService.ts   # Gemini Image API integration
│   └── designStorageService.ts # IndexedDB storage service
├── config/
│   └── creativeDesign.ts       # Feature configuration
├── components/
│   └── [To be implemented]     # React components
└── docs/
    └── CREATIVE_DESIGN.md      # This file
```

## Core Components

### 1. Type Definitions (`types/creativeDesign.ts`)

Defines all TypeScript interfaces and enums:
- `DesignStyle`: Available design styles (modern, traditional, abstract, etc.)
- `GeneratedDesign`: Complete design object with metadata
- `DesignError`: Structured error handling
- Component props interfaces

### 2. Rate Limiter (`utils/rateLimiter.ts`)

Implements time-window based rate limiting:
- Configurable request limits (default: 3 per minute)
- Automatic cleanup of expired requests
- Provides remaining requests and reset time

### 3. Image Utilities (`utils/imageUtils.ts`)

Image processing functions:
- `compressImage()`: Compress images to reduce file size
- `dataURLToBlob()`: Convert data URLs to Blobs
- `blobToDataURL()`: Convert Blobs to data URLs
- `getImageDimensions()`: Extract image dimensions
- `downloadImage()`: Download images to device

### 4. Gemini Image Service (`services/geminiImageService.ts`)

AI integration service:
- Handles Gemini Image Pro API calls
- Prompt enhancement with style and context
- Rate limiting integration
- Error handling and retry logic

### 5. Design Storage Service (`services/designStorageService.ts`)

IndexedDB-based storage:
- CRUD operations for designs
- Query by artifact ID
- Indexed for efficient retrieval
- Storage management

### 6. Configuration (`config/creativeDesign.ts`)

Centralized settings:
- Rate limit configuration
- Image processing parameters
- API settings
- UI configuration
- Feature flags

## Environment Setup

### Required Environment Variables

Create a `.env` file in the `goods_gallery` directory:

```env
VITE_GEMINI_API_KEY=your_api_key_here
API_KEY=your_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

## Usage Examples

### Using the Rate Limiter

```typescript
import { RateLimiter } from './utils/rateLimiter';

const limiter = new RateLimiter({
  maxRequests: 3,
  windowMs: 60000
});

try {
  await limiter.checkLimit();
  // Proceed with API call
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Wait ${error.waitTime}ms`);
  }
}
```

### Compressing Images

```typescript
import { compressImage } from './utils/imageUtils';

const compressed = await compressImage(
  originalDataUrl,
  1024,  // max width
  0.8    // quality
);
```

### Storing Designs

```typescript
import { designStorage } from './services/designStorageService';

// Save a design
await designStorage.saveDesign(generatedDesign);

// Get all designs
const designs = await designStorage.getAllDesigns();

// Get designs for specific artifact
const artifactDesigns = await designStorage.getDesignsByArtifact('artifact-id');
```

### Generating Designs

```typescript
import { geminiImageService } from './services/geminiImageService';

const design = await geminiImageService.generateDesign(
  {
    referenceImage: screenshotDataUrl,
    prompt: '现代简约风格海报',
    style: DesignStyle.MODERN,
    aspectRatio: '1:1'
  },
  artifactId,
  artifactTitle
);
```

## Next Steps

The following components need to be implemented:

1. **UI Components** (Task 2-6):
   - ScreenshotCapture
   - CreativeDesignPanel
   - PromptInput
   - DesignStyleSelector
   - DesignResult
   - DesignGallery

2. **Integration** (Task 7-9):
   - Connect components to services
   - Implement screenshot capture from 3D canvas
   - Wire up API calls and error handling

3. **Testing** (Task 14):
   - Unit tests for utilities
   - Integration tests for services
   - E2E tests for user flows

## API Reference

### Rate Limiter

```typescript
class RateLimiter {
  checkLimit(): Promise<void>
  getRemainingRequests(): number
  getResetTime(): number
  getTimeUntilReset(): number
  reset(): void
}
```

### Image Utils

```typescript
compressImage(dataUrl: string, maxWidth?: number, quality?: number): Promise<string>
dataURLToBlob(dataUrl: string): Blob
blobToDataURL(blob: Blob): Promise<string>
getImageDimensions(dataUrl: string): Promise<{width: number, height: number}>
downloadImage(dataUrl: string, filename: string): void
```

### Design Storage

```typescript
class DesignStorageService {
  init(): Promise<void>
  saveDesign(design: GeneratedDesign): Promise<void>
  getAllDesigns(): Promise<GeneratedDesign[]>
  getDesign(id: string): Promise<GeneratedDesign | null>
  getDesignsByArtifact(artifactId: string): Promise<GeneratedDesign[]>
  deleteDesign(id: string): Promise<void>
  clearAll(): Promise<void>
  getCount(): Promise<number>
}
```

### Gemini Image Service

```typescript
class GeminiImageService {
  generateDesign(
    request: GenerateDesignRequest,
    artifactId: string,
    artifactTitle: string
  ): Promise<GeneratedDesign>
  getRemainingRequests(): number
  getTimeUntilReset(): number
  resetRateLimit(): void
}
```

## Configuration

All configuration is centralized in `config/creativeDesign.ts`:

- `RATE_LIMIT_CONFIG`: Rate limiting settings
- `IMAGE_CONFIG`: Image processing parameters
- `PROMPT_CONFIG`: Prompt validation rules
- `STORAGE_CONFIG`: IndexedDB settings
- `API_CONFIG`: API call configuration
- `UI_CONFIG`: UI-related settings
- `ASPECT_RATIOS`: Available aspect ratios
- `FEATURE_FLAGS`: Feature toggles

## Error Handling

The feature uses structured error types:

- `SCREENSHOT_FAILED`: Canvas capture errors
- `API_ERROR`: Gemini API errors
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INVALID_PROMPT`: Prompt validation errors
- `STORAGE_ERROR`: IndexedDB errors
- `NETWORK_ERROR`: Network connectivity issues

All errors include:
- `type`: Error type enum
- `message`: User-friendly message
- `retryable`: Whether the operation can be retried
- `details`: Additional error information

## Performance Considerations

1. **Image Compression**: Screenshots are compressed before upload
2. **Rate Limiting**: Prevents excessive API usage
3. **IndexedDB**: Efficient local storage for design history
4. **Lazy Loading**: Gallery uses virtual scrolling (to be implemented)
5. **Web Workers**: Image processing in background (to be implemented)

## Security

1. **API Key Protection**: Use environment variables
2. **Rate Limiting**: Prevent API abuse
3. **Input Validation**: Validate all user inputs
4. **Content Filtering**: Use Gemini's safety filters
5. **Storage Limits**: Prevent excessive local storage usage
