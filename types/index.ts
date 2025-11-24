/**
 * Type exports index
 * 
 * Central export point for all TypeScript types and interfaces
 */

// Re-export existing types
export * from './creativeDesign';

// Re-export from parent types.ts if needed
export type { Artifact, CameraState, AICuratorResponse } from '../types';
export { ArtifactType } from '../types';

// Re-export SceneContainer types
export type { ScreenshotOptions, SceneContainerHandle } from '../components/SceneContainer';
