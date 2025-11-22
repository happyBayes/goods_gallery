import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Artifact, ArtifactType } from '../types';
import { Html, Gltf, Center, Resize } from '@react-three/drei';

interface ArtifactModelProps {
  artifact: Artifact;
  isLoading: boolean;
}

const ArtifactModel: React.FC<ArtifactModelProps> = ({ artifact, isLoading }) => {
  // Use Object3D as a generic ref type to support both Mesh and Group (for Gltf)
  const meshRef = useRef<THREE.Object3D>(null);

  // Gentle rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      // Add a subtle float
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  if (isLoading) {
    return (
      <Html center>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-gallery-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-gallery-accent uppercase tracking-widest">Loading Model</span>
        </div>
      </Html>
    );
  }

  // Special handling for user uploaded files
  if (artifact.type === ArtifactType.UPLOADED && artifact.fileUrl) {
    return (
      <group ref={meshRef} scale={artifact.geometryConfig.scale}>
        <Resize>
          <Center>
            <Gltf src={artifact.fileUrl} castShadow receiveShadow />
          </Center>
        </Resize>
      </group>
    );
  }

  const materialProps = {
    color: artifact.color,
    roughness: artifact.roughness,
    metalness: artifact.metalness,
    envMapIntensity: 1,
  };

  const renderGeometry = () => {
    switch (artifact.type) {
      case ArtifactType.SCULPTURE:
        return (
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        );
      case ArtifactType.VASE:
        // Approximating a vase with a lathed shape or capsule-like cylinder
        return (
           <capsuleGeometry args={[1, 2.5, 4, 16]} />
        );
      case ArtifactType.RELIC:
        return (
          <icosahedronGeometry args={[1.5, 0]} />
        );
      case ArtifactType.ABSTRACT:
        return (
          <octahedronGeometry args={[1.5, 0]} />
        );
      default:
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    }
  };

  return (
    <mesh ref={meshRef as React.RefObject<THREE.Mesh>} castShadow receiveShadow scale={artifact.geometryConfig.scale}>
      {renderGeometry()}
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
};

export default ArtifactModel;