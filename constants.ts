import { Artifact, ArtifactType } from './types';

export const DEFAULT_CAMERA_STATE = {
  x: 0,
  y: 0,
  z: 5,
  zoom: 1
};

export const ARTIFACTS: Artifact[] = [
  {
    id: '1',
    title: "The Golden Torus",
    period: "Contemporary Abstract",
    type: ArtifactType.SCULPTURE,
    description: "A continuous loop representing eternity and the cyclical nature of cultural evolution.",
    color: "#d4af37",
    roughness: 0.2,
    metalness: 1.0,
    geometryConfig: { scale: 1.5, detail: 100 }
  },
  {
    id: '2',
    title: "Cerulean Vessel",
    period: "Neo-Ceramic Era",
    type: ArtifactType.VASE,
    description: "A reimagined ancient vessel, symbolizing the preservation of knowledge through liquid metaphors.",
    color: "#0ea5e9",
    roughness: 0.6,
    metalness: 0.1,
    geometryConfig: { scale: 1.2 }
  },
  {
    id: '3',
    title: "Obsidian Icosahedron",
    period: "Digital Antiquity",
    type: ArtifactType.RELIC,
    description: "A geometric relic found in the digital archives, representing the complexity of early algorithmic art.",
    color: "#18181b",
    roughness: 0.1,
    metalness: 0.8,
    geometryConfig: { scale: 1.8, detail: 0 }
  },
  {
    id: '4',
    title: "Crimson Knot",
    period: "Expressionist Revival",
    type: ArtifactType.ABSTRACT,
    description: "A complex entanglement of emotions captured in a static, crimson form.",
    color: "#ef4444",
    roughness: 0.4,
    metalness: 0.3,
    geometryConfig: { scale: 1.3, detail: 64 }
  }
];
