
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ObservationPoint, EclipseEvent } from '../types';

interface MapVisualizerProps {
  selectedEclipse: EclipseEvent;
  onPointSelect: (lat: number, lng: number) => void;
  isLoading: boolean;
  currentPoint: ObservationPoint | null;
  onOpen3D: (point: ObservationPoint) => void;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ 
  selectedEclipse, 
  onPointSelect, 
  isLoading, 
  currentPoint,
  onOpen3D
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);
  const searchMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('mapTheme') !== 'light';
  });

  // Reliable Tile URLs requested by user
  const darkUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
  const lightUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('mapTheme', newTheme ? 'dark' : 'light');
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(newTheme ? darkUrl : lightUrl);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: selectedEclipse.center, 
        zoom: selectedEclipse.zoom,
        zoomControl: false,
      });

      tileLayerRef.current = L.tileLayer(isDarkMode ? darkUrl : lightUrl, {
        attribution: isDarkMode ? '&copy; OpenStreetMap contributors &copy; CARTO' : '&copy; OpenStreetMap contributors',
        subdomains: ['a', 'b', 'c', 'd'],
        maxZoom: 20
      }).addTo(mapRef.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      layersRef.current = L.layerGroup().addTo(mapRef.current);

      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onPointSelect(lat, lng);
      });

      // Handle popup button clicks more robustly
      mapRef.current.on('popupopen', (e) => {
        const btn = e.popup.getElement()?.querySelector('#open-3d-btn') as HTMLButtonElement;
        if (btn && currentPoint) {
          btn.onclick = () => onOpen3D(currentPoint);
        }
      });
    } else {
      mapRef.current.setView(selectedEclipse.center, selectedEclipse.zoom);
    }
  }, [selectedEclipse.id, currentPoint]); // Added currentPoint to deps to ensure popup event has latest data

  useEffect(() => {
    if (!layersRef.current || !mapRef.current) return;
    layersRef.current.clearLayers();

    if (selectedEclipse.northernLimit.length > 0 && selectedEclipse.southernLimit.length > 0) {
      const polygonPoints = [
        ...selectedEclipse.northernLimit,
        ...[...selectedEclipse.southernLimit].reverse()
      ] as [number, number][];

      L.polygon(polygonPoints, {
        color: '#fbbf24',
        weight: 1,
        fillOpacity: 0.25,
        fillColor: '#fbbf24',
        interactive: false
      }).addTo(layersRef.current);

      L.polyline(selectedEclipse.northernLimit, { color: '#fbbf24', weight: 1.5, opacity: 0.6, dashArray: '5, 8' }).addTo(layersRef.current);
      L.polyline(selectedEclipse.southernLimit, { color: '#fbbf24', weight: 1.5, opacity: 0.6, dashArray: '5, 8' }).addTo(layersRef.current);
    }

    if (selectedEclipse.centerLine.length > 0) {
      L.polyline(selectedEclipse.centerLine, {
        color: '#ef4444',
        weight: 3,
        opacity: 0.8
      }).addTo(layersRef.current);

      const times = ["18:30", "19:00", "19:30", "20:00", "20:30"];
      selectedEclipse.centerLine.forEach((coord, index) => {
        if (index < times.length) {
          const icon = L.divIcon({
            className: 'time-label',
            html: `<div class="bg-slate-900/90 backdrop-blur-sm border border-amber-500/50 text-amber-500 px-2 py-0.5 rounded text-[10px] font-black whitespace-nowrap shadow-lg">${times[index]} UTC</div>`,
            iconSize: [45, 20],
            iconAnchor: [22, 10]
          });
          L.marker(coord, { icon, interactive: false }).addTo(layersRef.current!);
        }
      });
    }
  }, [selectedEclipse]);

  useEffect(() => {
    if (!currentPoint || !mapRef.current) return;

    const isTotal = currentPoint.duration && (currentPoint.duration.toLowerCase().includes('total') || currentPoint.duration.toLowerCase().includes('totality'));
    
    const lat = (currentPoint.lat ?? 0).toFixed(4);
    const lng = (currentPoint.lng ?? 0).toFixed(4);
    const alt = (currentPoint.altitude ?? 0).toFixed(1);
    const azi = (currentPoint.azimuth ?? 0).toFixed(1);

    const popupHtml = `
      <div class="p-2 min-w-[240px] space-y-4">
        <div class="border-b border-white/10 pb-2">
          <div class="flex justify-between items-start mb-1 gap-2">
            <h4 class="font-bold text-lg text-white leading-tight">${currentPoint.name || 'Ausgewählter Ort'}</h4>
            <span class="shrink-0 px-2 py-0.5 rounded text-[9px] font-black tracking-tighter uppercase ${isTotal ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}">
              ${isTotal ? 'TOTALITÄT' : 'PARTIELL'}
            </span>
          </div>
          <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest">${lat}, ${lng}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-white/5 p-2 rounded-lg border border-white/10">
            <span class="block text-[8px] uppercase text-slate-500 font-bold mb-1">Sonnenhöhe</span>
            <span class="text-xs font-bold text-white">${alt}°</span>
          </div>
          <div class="bg-white/5 p-2 rounded-lg border border-white/10">
            <span class="block text-[8px] uppercase text-slate-500 font-bold mb-1">Azimut</span>
            <span class="text-xs font-bold text-white">${azi}°</span>
          </div>
        </div>

        <div class="bg-slate-800/50 p-3 rounded-xl border border-white/5">
          <p class="text-xs ${isTotal ? 'text-amber-400' : 'text-slate-400'} font-bold flex items-center gap-2">
            ${isTotal ? `<i class="fas fa-moon text-amber-500"></i>` : `<i class="fas fa-sun text-slate-500"></i>`}
            ${currentPoint.duration}
          </p>
        </div>

        <button id="open-3d-btn" style="background-color: #fbbf24 !important; color: #0f172a !important; width: 100%; padding: 0.75rem; border-radius: 0.75rem; font-size: 0.75rem; font-weight: 900; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;" class="hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95">
          <i class="fas fa-cube"></i> 3D ANSICHT STARTEN
        </button>
      </div>
    `;

    L.popup({
      closeButton: false,
      className: 'eclipse-popup',
      offset: [0, -10]
    })
    .setLatLng([currentPoint.lat, currentPoint.lng])
    .setContent(popupHtml)
    .openOn(mapRef.current);
    
  }, [currentPoint]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapRef.current) return;

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);

        mapRef.current.setView([latNum, lngNum], 10);
        
        if (searchMarkerRef.current) {
          searchMarkerRef.current.remove();
        }

        searchMarkerRef.current = L.marker([latNum, lngNum], {
          icon: L.divIcon({
            className: 'search-marker',
            html: '<div class="w-6 h-6 bg-amber-500 border-2 border-white rounded-full animate-pulse shadow-xl"></div>',
            iconSize: [24, 24]
          })
        }).addTo(mapRef.current);

        onPointSelect(latNum, lngNum);
      } else {
        alert("Ort nicht gefunden.");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Suche fehlgeschlagen. Bitte prüfen Sie Ihre Verbindung.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      <div className="absolute top-6 left-0 right-0 z-[1000] px-6 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              placeholder="Ort suchen (z.B. Burgos, Spain)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 shadow-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all group-hover:border-white/20"
            />
            <i className={`fas ${isSearching ? 'fa-circle-notch fa-spin' : 'fa-search'} absolute left-5 top-1/2 -translate-y-1/2 text-slate-500`}></i>
          </form>
        </div>

        <button 
          onClick={toggleTheme}
          className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white p-4 rounded-2xl shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center w-14 h-14"
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          <i className={`fas ${isDarkMode ? 'fa-sun text-amber-500' : 'fa-moon text-indigo-400'} text-xl`}></i>
        </button>
      </div>

      <div ref={mapContainerRef} className="w-full h-full" />

      <div className="absolute bottom-6 left-6 z-[1000] dark-glass p-4 rounded-2xl shadow-2xl border border-white/10 flex flex-col gap-2 pointer-events-none">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Legende</h5>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-amber-500/30 border border-amber-500/50 rounded"></div>
          <span className="text-[10px] font-bold text-slate-300">Totalitätszone</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-1 bg-red-500 rounded-full"></div>
          <span className="text-[10px] font-bold text-slate-300">Zentrallinie (Maximum)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-[10px] font-bold text-slate-300">Marker: Totalität</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
          <span className="text-[10px] font-bold text-slate-300">Marker: Partiell</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-16 z-[1000] p-6 dark-glass rounded-[32px] shadow-2xl max-w-[280px] border border-white/10 animate-in slide-in-from-bottom-4 duration-500 hidden md:block">
        <div className="flex items-center gap-3 mb-3">
           <div className="bg-amber-500 text-slate-900 p-2 rounded-xl"><i className="fas fa-info-circle"></i></div>
           <h3 className="text-amber-400 font-bold text-sm leading-tight uppercase tracking-tight">{selectedEclipse.title}</h3>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Klicken Sie auf einen Punkt für die 3D-Simulation.
        </p>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-[2000] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
              <i className="fas fa-satellite absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-amber-500 animate-pulse"></i>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Scanne Horizon-Koordinaten...</h2>
            <p className="text-slate-400 text-sm font-bold opacity-50">Präzise Pfad-Daten werden abgerufen</p>
          </div>
        </div>
      )}

      <style>{`
        .eclipse-popup .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.98) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 28px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
          color: white !important;
          padding: 0 !important;
        }
        .eclipse-popup .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .eclipse-popup .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.98) !important;
        }
        .search-marker div {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
        }
        .leaflet-container {
          background: #0f172a !important;
        }
      `}</style>
    </div>
  );
};

export default MapVisualizer;
