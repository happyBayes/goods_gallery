import React, { Suspense, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import ArtifactModel from './ArtifactModel';
import { Artifact, CameraState } from '../types';

/**
 * Screenshot configuration options
 */
export interface ScreenshotOptions {
  /** Image format: 'png' or 'jpeg' */
  format?: 'png' | 'jpeg';
  /** Image quality (0-1), only applies to jpeg */
  quality?: number;
  /** Image width in pixels (optional, defaults to canvas width) */
  width?: number;
  /** Image height in pixels (optional, defaults to canvas height) */
  height?: number;
}

/**
 * Methods exposed by SceneContainer via ref
 */
export interface SceneContainerHandle {
  /** Capture a screenshot of the current 3D scene */
  captureScreenshot: (options?: ScreenshotOptions) => Promise<string>;
}

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

// Helper to expose canvas element to parent
const CanvasExposer: React.FC<{
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}> = ({ canvasRef }) => {
  const { gl } = useThree();

  useEffect(() => {
    canvasRef.current = gl.domElement;
  }, [gl, canvasRef]);

  return null;
};

const SceneContainer = forwardRef<SceneContainerHandle, SceneContainerProps>(({
  artifact,
  cameraState,
  onCameraChange,
  isInteractingWithSliders
}, ref) => {
  const orbitRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Capture a screenshot of the current 3D scene
   * 
   * @param options - Screenshot configuration options
   * @returns Promise resolving to base64 data URL
   */
  const captureScreenshot = async (options: ScreenshotOptions = {}): Promise<string> => {
    const {
      format = 'png',
      quality = 0.9,
      width,
      height
    } = options;

    return new Promise((resolve, reject) => {
      // Wait for next frame to ensure rendering is complete
      requestAnimationFrame(() => {
        try {
          const canvas = canvasRef.current;

          if (!canvas) {
            reject(new Error('Canvas not found'));
            return;
          }

          // If custom dimensions are specified, create a temporary canvas
          if (width || height) {
            const tempCanvas = document.createElement('canvas');
            const targetWidth = width || canvas.width;
            const targetHeight = height || canvas.height;

            tempCanvas.width = targetWidth;
            tempCanvas.height = targetHeight;

            const ctx = tempCanvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
            }

            // Draw the original canvas onto the temporary canvas with scaling
            ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);

            const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
            const dataUrl = tempCanvas.toDataURL(mimeType, quality);
            resolve(dataUrl);
          } else {
            // Use original canvas dimensions
            const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
            const dataUrl = canvas.toDataURL(mimeType, quality);
            resolve(dataUrl);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    captureScreenshot
  }));

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-gallery-black to-gallery-dark">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          <CanvasExposer canvasRef={canvasRef} />

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
});

SceneContainer.displayName = 'SceneContainer';

export default SceneContainer;
