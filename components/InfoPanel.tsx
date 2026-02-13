
import React, { useState } from 'react';
import { EclipseDetails, ObservationPoint } from '../types';

interface InfoPanelProps {
  data: EclipseDetails | null;
  onOpen3D: (point: ObservationPoint) => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ data, onOpen3D }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'accommodations' | 'json'>('info');

  if (!data) return null;

  return (
    <div className="w-full lg:w-96 h-full flex flex-col bg-white border-l border-slate-200 shadow-2xl z-20 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex bg-slate-50 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'info' ? 'border-amber-500 text-amber-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Details
        </button>
        <button 
          onClick={() => setActiveTab('accommodations')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'accommodations' ? 'border-amber-500 text-amber-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Hotels
        </button>
        <button 
          onClick={() => setActiveTab('json')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'json' ? 'border-amber-500 text-amber-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          JSON
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'info' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{data.date}</h2>
              <p className="text-slate-600 leading-relaxed text-sm">{data.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <i className="fas fa-sun text-amber-500 mb-2"></i>
                <span className="block text-xs text-slate-400 font-bold uppercase">Höhe</span>
                <span className="text-lg font-bold text-slate-700">{data.sunPosition.altitude}°</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <i className="fas fa-compass text-indigo-500 mb-2"></i>
                <span className="block text-xs text-slate-400 font-bold uppercase">Azimut</span>
                <span className="text-lg font-bold text-slate-700">{data.sunPosition.azimuth}°</span>
              </div>
            </div>

            <div className="space-y-3">
               <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Top Beobachtungsorte</h3>
               {data.observationPoints.map((pt, i) => (
                 <div key={i} className="p-4 bg-slate-900 rounded-2xl text-white flex justify-between items-center group overflow-hidden relative">
                    <div className="z-10">
                      <h4 className="font-bold">{pt.name}</h4>
                      <p className="text-[10px] text-amber-400 font-mono uppercase tracking-widest">{pt.duration} Totalität</p>
                    </div>
                    <button 
                      onClick={() => onOpen3D(pt)}
                      className="z-10 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 flex items-center gap-2"
                    >
                      <i className="fas fa-cube"></i> 3D Ansicht
                    </button>
                    {/* Decorative blur */}
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'accommodations' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-slate-800">Unterkünfte in der Nähe</h3>
            {data.accommodations.map((acc, i) => (
              <div key={i} className="p-4 border border-slate-200 rounded-xl hover:border-amber-300 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{acc.name}</h4>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">
                    ★ {acc.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{acc.address}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-slate-400">{acc.priceLevel}</span>
                  {acc.uri && (
                    <a 
                      href={acc.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Google Maps <i className="fas fa-external-link-alt ml-1"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'json' && (
          <div className="h-full bg-slate-900 rounded-xl p-4 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <pre className="text-[10px] text-emerald-400 font-mono overflow-auto h-full scrollbar-hide">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
