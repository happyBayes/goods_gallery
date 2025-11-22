import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import ArtifactModel from './ArtifactModel';
import { Artifact, CameraState } from '../types';

interface SceneContainerProps {
  artifact: Artifact;
  cameraState: CameraState;
  onCameraChange: (newState: Partial<CameraState>) => void;
  isInteractingWithSliders: boolean;
}

// Helper to update camera based on props
const CameraController: React.FC<{ 
  cameraState: CameraState; 
  isInteractingWithSliders: boolean 
}> = ({ cameraState, isInteractingWithSliders }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (isInteractingWithSliders) {
      camera.position.set(cameraState.x, cameraState.y, cameraState.z);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [cameraState, isInteractingWithSliders, camera]);

  return null;
};

const SceneContainer: React.FC<SceneContainerProps> = ({ 
  artifact, 
  cameraState, 
  onCameraChange, 
  isInteractingWithSliders 
}) => {
  const orbitRef = useRef<any>(null);

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-gallery-black to-gallery-dark">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1} 
            castShadow 
          />
          
          <ArtifactModel artifact={artifact} isLoading={false} />
          
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.5} 
            scale={10} 
            blur={1.5} 
            far={4.5} 
          />

          <CameraController 
            cameraState={cameraState} 
            isInteractingWithSliders={isInteractingWithSliders} 
          />

          <OrbitControls 
            ref={orbitRef}
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
            // Disable orbit controls while using sliders to avoid conflict
            enabled={!isInteractingWithSliders}
            onEnd={(e) => {
               // Optional: Sync back to slider state if needed
               // For now, we let orbit be free-flow until slider is touched again
            }}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 text-xs text-white/20 pointer-events-none select-none">
        WebGL Renderer • Three.js • React Three Fiber
      </div>
    </div>
  );
};

export default SceneContainer;
