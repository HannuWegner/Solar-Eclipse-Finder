
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import MapVisualizer from './components/MapVisualizer';
import ThreeDView from './components/ThreeDView';
import { EclipseEvent, ObservationPoint } from './types';
import { fetchEclipseDataForLocation } from './services/geminiService';

const App: React.FC = () => {
  const [selectedEclipse, setSelectedEclipse] = useState<EclipseEvent | null>(null);
  const [currentPoint, setCurrentPoint] = useState<ObservationPoint | null>(null);
  const [active3DPoint, setActive3DPoint] = useState<ObservationPoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePointSelect = async (lat: number, lng: number) => {
    if (!selectedEclipse) return;
    
    setIsLoading(true);
    try {
      const data = await fetchEclipseDataForLocation(lat, lng, selectedEclipse.date);
      // We set currentPoint which MapVisualizer uses to show the interactive popup
      setCurrentPoint(data);
    } catch (e) {
      console.error("Failed to fetch location data:", e);
      alert("Fehler bei der Datenberechnung. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedEclipse) {
    return <LandingPage onSelect={setSelectedEclipse} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 relative">
      <main className="flex-1 relative h-full">
        {/* Navigation Button */}
        <button 
          onClick={() => {
            setSelectedEclipse(null);
            setCurrentPoint(null);
          }}
          className="absolute top-6 left-6 z-[2000] bg-white text-slate-900 px-6 py-4 rounded-2xl font-black text-xs shadow-2xl hover:bg-slate-100 transition-all flex items-center gap-2 uppercase tracking-widest"
        >
          <i className="fas fa-chevron-left"></i> Event wechseln
        </button>

        <MapVisualizer 
          selectedEclipse={selectedEclipse} 
          onPointSelect={handlePointSelect} 
          isLoading={isLoading} 
          currentPoint={currentPoint}
          onOpen3D={setActive3DPoint}
        />

        {active3DPoint && (
          <ThreeDView 
            point={active3DPoint} 
            onClose={() => setActive3DPoint(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
