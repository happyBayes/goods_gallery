import React from 'react';
import { CameraState, Artifact } from '../types';
import { DEFAULT_CAMERA_STATE } from '../constants';

interface ControlsPanelProps {
  cameraState: CameraState;
  setCameraState: (state: CameraState) => void;
  setIsInteracting: (isInteracting: boolean) => void;
  onReset: () => void;
  onAskCurator: () => void;
  curatorLoading: boolean;
  artifact: Artifact;
  curatorResponse: string | null;
}

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}> = ({ label, value, min, max, onChange, onMouseDown, onMouseUp }) => (
  <div className="flex flex-col gap-1 mb-3">
    <div className="flex justify-between text-xs text-gray-400 font-mono">
      <label>{label}</label>
      <span>{value.toFixed(2)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={0.1}
      value={value}
      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gallery-accent hover:accent-white transition-all"
      onChange={(e) => onChange(parseFloat(e.target.value))}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
    />
  </div>
);

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  cameraState,
  setCameraState,
  setIsInteracting,
  onReset,
  onAskCurator,
  curatorLoading,
  artifact,
  curatorResponse
}) => {
  
  const handleSliderChange = (axis: keyof CameraState, value: number) => {
    setCameraState({ ...cameraState, [axis]: value });
  };

  return (
    <div className="bg-gallery-dark/90 backdrop-blur-md border-l border-white/5 h-full p-6 flex flex-col overflow-y-auto">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold text-gallery-accent uppercase tracking-widest">Exhibit Control</span>
        <h2 className="text-2xl font-serif text-white mt-2">{artifact.title}</h2>
        <p className="text-sm text-gray-400 italic mt-1">{artifact.period}</p>
      </div>

      {/* Camera Controls */}
      <div className="mb-8 p-4 bg-black/20 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
          Camera Projection
        </h3>
        
        <Slider
          label="Axis X"
          value={cameraState.x}
          min={-5}
          max={5}
          onChange={(v) => handleSliderChange('x', v)}
          onMouseDown={() => setIsInteracting(true)}
          onMouseUp={() => setIsInteracting(false)}
        />
        <Slider
          label="Axis Y"
          value={cameraState.y}
          min={-5}
          max={5}
          onChange={(v) => handleSliderChange('y', v)}
          onMouseDown={() => setIsInteracting(true)}
          onMouseUp={() => setIsInteracting(false)}
        />
        <Slider
          label="Axis Z (Zoom)"
          value={cameraState.z}
          min={2}
          max={8}
          onChange={(v) => handleSliderChange('z', v)}
          onMouseDown={() => setIsInteracting(true)}
          onMouseUp={() => setIsInteracting(false)}
        />

        <button
          onClick={onReset}
          className="mt-2 w-full py-2 text-xs font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded transition-colors"
        >
          Reset View
        </button>
      </div>

      {/* AI Curator Section */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="m8 6 4-4 4 4"/><path d="M12 14v10"/><path d="M9 14h6"/><path d="M5 18h14"/></svg>
          AI Curator
        </h3>
        
        <div className="flex-1 bg-black/20 rounded-xl border border-white/5 p-4 mb-4 overflow-y-auto min-h-[150px]">
          {curatorLoading ? (
            <div className="flex items-center justify-center h-full text-gallery-accent animate-pulse">
              <span className="text-sm">Consulting archives...</span>
            </div>
          ) : curatorResponse ? (
            <p className="text-sm text-gray-300 leading-relaxed font-serif">
              {curatorResponse}
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <p className="text-xs mb-2">Ask the curator for insights about this piece.</p>
            </div>
          )}
        </div>

        <button
          onClick={onAskCurator}
          disabled={curatorLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2
            ${curatorLoading 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-gallery-accent to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-600 shadow-lg shadow-yellow-900/20'
            }
          `}
        >
          {curatorLoading ? 'Processing...' : 'Ask Curator Insights'}
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Description</h4>
        <p className="text-sm text-gray-400 leading-relaxed">
          {artifact.description}
        </p>
      </div>
    </div>
  );
};

export default ControlsPanel;
