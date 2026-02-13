
import React, { useState } from 'react';

interface SidebarProps {
  onSearch: (date: string, region: string) => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onSearch, isLoading }) => {
  const [date, setDate] = useState('2026-08-12');
  const [region, setRegion] = useState('Nordspanien');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(date, region);
  };

  return (
    <aside className="w-full lg:w-96 h-full flex flex-col bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-amber-500 p-2 rounded-full text-white">
            <i className="fas fa-sun text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Eclipse Finder</h1>
        </div>
        <p className="text-sm text-slate-500">Ihre Reise ins Herz der Dunkelheit.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Ziel-Region
          </label>
          <div className="relative">
            <i className="fas fa-map-marker-alt absolute left-3 top-3.5 text-slate-400"></i>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="z.B. Spanien, Burgos..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Datum des Ereignisses
          </label>
          <div className="relative">
            <i className="fas fa-calendar absolute left-3 top-3.5 text-slate-400"></i>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2 ${
            isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <i className="fas fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fas fa-satellite-dish"></i>
          )}
          Eclipse visualisieren
        </button>
      </form>

      <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Empfohlene Orte (2026)</h3>
        <div className="space-y-3">
          {[
            { city: 'Gijón', desc: 'Erste Sichtung in Spanien', time: '1m 45s' },
            { city: 'Burgos', desc: 'Optimale Wetterchance', time: '1m 44s' },
            { city: 'Zaragoza', desc: 'Tiefe Sonnenhöhe (Abend)', time: '1m 26s' }
          ].map((loc, i) => (
            <button 
              key={i} 
              onClick={() => { setRegion(loc.city); onSearch(date, loc.city); }}
              className="w-full text-left p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-amber-500 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-800">{loc.city}</p>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">{loc.time}</span>
              </div>
              <p className="text-[10px] text-slate-500 group-hover:text-amber-600">{loc.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
