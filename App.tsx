import React, { useState, useCallback, useEffect } from 'react';
import SceneContainer from './components/SceneContainer';
import ControlsPanel from './components/ControlsPanel';
import GalleryGrid from './components/GalleryGrid';
import { ARTIFACTS, DEFAULT_CAMERA_STATE } from './constants';
import { Artifact, CameraState, ArtifactType } from './types';
import { generateCuratorInsight } from './services/geminiService';

const App: React.FC = () => {
  // Use state for artifacts to allow additions via upload
  const [artifacts, setArtifacts] = useState<Artifact[]>(ARTIFACTS);
  const [currentArtifact, setCurrentArtifact] = useState<Artifact>(ARTIFACTS[0]);
  const [cameraState, setCameraState] = useState<CameraState>(DEFAULT_CAMERA_STATE);
  const [isInteractingWithSliders, setIsInteractingWithSliders] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mobile responsive state
  
  // Curator State
  const [curatorLoading, setCuratorLoading] = useState(false);
  const [curatorResponse, setCuratorResponse] = useState<string | null>(null);
  // Cache curator responses to save API calls
  const [curatorCache, setCuratorCache] = useState<Record<string, string>>({});

  const handleArtifactSelect = (artifact: Artifact) => {
    setCurrentArtifact(artifact);
    setCuratorResponse(curatorCache[artifact.id] || null);
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  };

  const handleFileUpload = useCallback((file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const newArtifact: Artifact = {
      id: `upload-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      period: "User Collection",
      type: ArtifactType.UPLOADED,
      description: "A unique piece from the user's private collection, uploaded for digital preservation.",
      color: "#ffffff", // Default base color, though model textures usually take precedence
      roughness: 0.5,
      metalness: 0.0,
      geometryConfig: { scale: 1.5 },
      fileUrl: objectUrl
    };

    setArtifacts(prev => [newArtifact, ...prev]); // Add to top of list
    handleArtifactSelect(newArtifact);
  }, [curatorCache]);

  const handleArtifactDelete = (id: string) => {
    const artifactToDelete = artifacts.find(a => a.id === id);
    
    if (artifactToDelete?.fileUrl) {
      URL.revokeObjectURL(artifactToDelete.fileUrl);
    }

    const newArtifacts = artifacts.filter(a => a.id !== id);
    setArtifacts(newArtifacts);

    // If the deleted artifact was selected, switch to the first available one
    if (currentArtifact.id === id) {
      const nextArtifact = newArtifacts.length > 0 ? newArtifacts[0] : ARTIFACTS[0];
      handleArtifactSelect(nextArtifact);
    }
  };

  const handleAskCurator = async () => {
    if (curatorCache[currentArtifact.id]) {
      setCuratorResponse(curatorCache[currentArtifact.id]);
      return;
    }

    setCuratorLoading(true);
    try {
      const insight = await generateCuratorInsight(currentArtifact);
      setCuratorResponse(insight);
      setCuratorCache(prev => ({ ...prev, [currentArtifact.id]: insight }));
    } catch (e) {
      console.error(e);
    } finally {
      setCuratorLoading(false);
    }
  };

  const handleResetView = useCallback(() => {
    setCameraState(DEFAULT_CAMERA_STATE);
    setIsInteractingWithSliders(true);
    // Small timeout to release the interaction lock so OrbitControls can take over if needed
    setTimeout(() => setIsInteractingWithSliders(false), 100);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gallery-black text-white font-sans">
      
      {/* Left Sidebar: Gallery List */}
      <div className={`
        fixed md:relative z-20 h-full w-64 bg-gallery-black transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block flex-shrink-0 border-r border-white/5
      `}>
        <GalleryGrid 
          artifacts={artifacts} 
          currentArtifactId={currentArtifact.id} 
          onSelect={handleArtifactSelect} 
          onUpload={handleFileUpload}
          onDelete={handleArtifactDelete}
        />
      </div>

      {/* Mobile Header / Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-gallery-black/90 backdrop-blur p-4 border-b border-white/5 flex justify-between items-center">
        <span className="font-serif font-bold">LUMINA</span>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white bg-white/10 rounded"
        >
          {isSidebarOpen ? 'Close Menu' : 'Browse Gallery'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row relative h-full">
        
        {/* 3D Scene */}
        <div className="flex-1 relative h-[60vh] md:h-full order-1 md:order-1">
          <SceneContainer 
            artifact={currentArtifact}
            cameraState={cameraState}
            onCameraChange={(newVal) => setCameraState(prev => ({ ...prev, ...newVal }))}
            isInteractingWithSliders={isInteractingWithSliders}
          />
        </div>

        {/* Right Sidebar: Controls (Desktop: Right side, Mobile: Bottom scrollable) */}
        <div className="w-full md:w-80 h-[40vh] md:h-full z-10 order-2 md:order-2 flex-shrink-0 relative shadow-2xl">
            <ControlsPanel 
              cameraState={cameraState}
              setCameraState={setCameraState}
              setIsInteracting={setIsInteractingWithSliders}
              onReset={handleResetView}
              onAskCurator={handleAskCurator}
              curatorLoading={curatorLoading}
              artifact={currentArtifact}
              curatorResponse={curatorResponse}
            />
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;