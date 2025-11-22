import React, { useRef } from 'react';
import { Artifact } from '../types';

interface GalleryGridProps {
  artifacts: Artifact[];
  currentArtifactId: string;
  onSelect: (artifact: Artifact) => void;
  onUpload: (file: File) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ artifacts, currentArtifactId, onSelect, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
      // Reset input value so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gallery-black border-r border-white/5">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-serif font-bold text-white tracking-tight">LUMINA</h1>
        <p className="text-xs text-gallery-accent mt-1 uppercase tracking-widest">Collection</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {artifacts.map((art) => (
          <button
            key={art.id}
            onClick={() => onSelect(art)}
            className={`w-full text-left group relative overflow-hidden rounded-lg transition-all duration-300 
              ${currentArtifactId === art.id 
                ? 'bg-white/10 border-gallery-accent' 
                : 'bg-white/5 hover:bg-white/10 border-transparent'
              } border border-white/5 hover:border-white/20 p-4`}
          >
            <div className="relative z-10">
              <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 block
                ${currentArtifactId === art.id ? 'text-gallery-accent' : 'text-gray-500 group-hover:text-gray-400'}
              `}>
                {art.type}
              </span>
              <h3 className={`font-serif font-medium text-sm transition-colors
                ${currentArtifactId === art.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}
              `}>
                {art.title}
              </h3>
            </div>
            
            {/* Subtle active indicator */}
            {currentArtifactId === art.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gallery-accent" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-2">
         <input 
           type="file" 
           ref={fileInputRef} 
           className="hidden" 
           accept=".glb,.gltf"
           onChange={handleFileChange}
         />
         
         <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 text-xs font-semibold bg-gallery-accent text-gallery-black rounded hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
         >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Upload Model
         </button>

         <button className="w-full py-2 text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m15 9 3-3"/><path d="m15 15 3 3"/><path d="m3 9 3 3"/><path d="m3 15 3 3"/></svg>
            View Full Catalog
         </button>
      </div>
    </div>
  );
};

export default GalleryGrid;