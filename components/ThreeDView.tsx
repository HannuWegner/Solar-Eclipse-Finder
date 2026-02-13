
import React, { useState, useMemo } from 'react';
import { ObservationPoint } from '../types';

interface ThreeDViewProps {
  point: ObservationPoint;
  onClose: () => void;
}

const ThreeDView: React.FC<ThreeDViewProps> = ({ point, onClose }) => {
  const [timelineIndex, setTimelineIndex] = useState(5);
  const apiKey = process.env.API_KEY;

  const timeline = useMemo(() => point.timeline || [], [point]);
  const currentState = timeline.length > 0 ? timeline[timelineIndex] : {
    time: "20:30",
    coverage: 1.0,
    altitude: point.altitude || 10,
    azimuth: point.azimuth || 286
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimelineIndex(parseInt(e.target.value));
  };

  // Google Street View Static API URL
  const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=1200x800&location=${point.lat},${point.lng}&heading=${point.azimuth}&pitch=15&fov=100&key=${apiKey}`;
  
  // Projection logic
  const viewWidth = 100;
  const viewHeight = 60;
  const horizonY = 24; 

  const getSunXY = (az: number, alt: number) => {
    const centerX = 50;
    const deltaAz = (az ?? 286) - (point.azimuth || 286);
    const x = centerX + (deltaAz * 2.0);
    const y = horizonY - ((alt ?? 0) * 2.0);
    return { x, y };
  };

  const { x: sunX, y: sunY } = getSunXY(currentState.azimuth, currentState.altitude);

  return (
    <div className="absolute inset-0 z-[5000] bg-black flex flex-col animate-in fade-in zoom-in duration-500">
      <div className="absolute top-6 left-6 z-30 pointer-events-none w-full max-w-md">
        <div className="dark-glass p-6 rounded-3xl shadow-2xl pointer-events-auto border border-white/10">
          <button 
            onClick={onClose}
            className="mb-4 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-arrow-left"></i> ZURÜCK ZUM PFAD
          </button>
          <h2 className="text-2xl font-bold mb-1">{point.name || 'Simulation'}</h2>
          <p className="text-sm opacity-70 mb-4 tracking-wide uppercase">Street View Simulation</p>
          
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold opacity-50">Zeitpunkt</span>
              <span className="text-amber-500 font-mono font-bold text-lg">{currentState.time || '--:--'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold opacity-50">Bedeckung</span>
              <span className="text-white font-mono font-bold">{((currentState.coverage ?? 0) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative overflow-hidden bg-black z-10">
        {/* Real Street View Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img 
            src={streetViewUrl}
            className="w-full h-full object-cover transition-opacity duration-1000"
            alt="Street View"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop";
            }}
          />
          <div 
            className="absolute inset-0 transition-colors duration-700 mix-blend-multiply"
            style={{ backgroundColor: `rgba(15, 23, 42, ${Math.min(0.9, (currentState.coverage ?? 0) * 0.95)})` }}
          ></div>
        </div>

        {/* Sky Overlay */}
        <svg className="absolute inset-0 w-full h-full z-10" viewBox={`0 0 ${viewWidth} ${viewHeight}`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="sunGlow"><stop offset="0%" stopColor="#fff" /><stop offset="30%" stopColor="#fbbf24" stopOpacity="0.9" /><stop offset="100%" stopColor="#fbbf24" stopOpacity="0" /></radialGradient>
          </defs>
          <g>
            <circle cx={sunX} cy={sunY} r="3.2" fill="url(#sunGlow)" />
            <circle cx={sunX - (1 - (currentState.coverage ?? 0)) * 5.2} cy={sunY} r="3.1" fill="#080c14" />
          </g>
        </svg>

        {/* Direction Text */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
          Blickrichtung: {(currentState.azimuth ?? 0).toFixed(0)}°
        </div>
      </div>

      <div className="p-8 bg-slate-900 border-t border-white/10 z-30">
        <div className="max-w-4xl mx-auto">
          <input 
            type="range" min="0" max={Math.max(0, timeline.length - 1)} value={timelineIndex} 
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500 mb-6"
          />
          <div className="flex justify-between items-center">
            <div className="bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
              <p className="text-[10px] opacity-40 uppercase font-bold">Höhe</p>
              <p className="text-lg font-black text-white">{(currentState.altitude ?? 0).toFixed(1)}°</p>
            </div>
            <button onClick={() => setTimelineIndex(5)} className="bg-amber-500 text-slate-900 px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-amber-500/20 active:scale-95">
              MAXIMALE PHASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDView;
