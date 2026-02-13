
import React from 'react';

interface SidebarProps {
  onSearch: (date: string, region: string) => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onSearch, isLoading }) => {
  return (
    <aside className="w-full lg:w-96 h-full flex flex-col bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-amber-500 p-2 rounded-full text-white">
            <i className="fas fa-sun text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Eclipse Finder</h1>
        </div>
        <p className="text-sm text-slate-500">12. August 2026 • Nordspanien</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Status</p>
            <h2 className="text-xl font-bold mb-4">Totalität Garantiert</h2>
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
              <i className="fas fa-satellite-dish text-amber-500"></i>
              <p className="text-xs text-slate-300">Orbitale Pfad-Daten sind für Offline-Nutzung optimiert.</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-all duration-700"></div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Beobachtungs-Hotspots</h3>
          <div className="grid gap-3">
            {[
              { city: 'Gijón', desc: 'Sicht am Meer', time: '1:47' },
              { city: 'Burgos', desc: 'Beste Wetterlage', time: '1:44' },
              { city: 'Saragossa', desc: 'Flacher Winkel', time: '1:25' },
              { city: 'Palma', desc: 'Mittelmeer-Kulisse', time: '0:58' }
            ].map((loc, i) => (
              <div 
                key={i} 
                className="w-full text-left p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 hover:shadow-lg transition-all flex justify-between items-center group cursor-pointer"
              >
                <div>
                  <h4 className="font-bold text-slate-800">{loc.city}</h4>
                  <p className="text-[10px] text-slate-500">{loc.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-amber-600 font-mono">{loc.time}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-tighter">Minuten</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
          <i className="fas fa-info-circle"></i>
          <span>Event Info</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed italic">
          Klicken Sie auf die Marker auf der Karte, um die 3D-Simulation der Sonnenfinsternis für diesen Standort zu starten.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
