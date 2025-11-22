export enum ArtifactType {
  SCULPTURE = 'SCULPTURE',
  VASE = 'VASE',
  RELIC = 'RELIC',
  ABSTRACT = 'ABSTRACT',
  UPLOADED = 'UPLOADED'
}

export interface Artifact {
  id: string;
  title: string;
  period: string;
  type: ArtifactType;
  description: string;
  color: string;
  roughness: number;
  metalness: number;
  geometryConfig: {
    scale: number;
    detail?: number;
  };
  fileUrl?: string;
}

export interface CameraState {
  x: number;
  y: number;
  z: number;
  zoom: number;
}

export interface AICuratorResponse {
  story: string;
  culturalSignificance: string;
}