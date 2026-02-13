
import React from 'react';
import { EclipseEvent } from '../types';

const ECLIPSES: EclipseEvent[] = [
  {
    id: '2026',
    title: 'Total Eclipse 2026',
    date: '12. August 2026',
    region: 'Spain, Iceland, Greenland',
    description: 'The first total eclipse in mainland Europe for decades, passing through northern Spain at sunset.',
    center: [41.5, -2.0],
    zoom: 6,
    pathPolygon: [],
    northernLimit: [[45.5, -10.0], [44.5, -5.0], [43.3, -3.0], [42.6, -0.2], [40.5, 3.3], [39.0, 6.0]],
    southernLimit: [[43.5, -11.0], [42.5, -6.3], [41.3, -4.4], [40.7, -1.5], [38.6, 2.0], [37.0, 4.5]],
    centerLine: [[44.5, -10.5], [43.54, -5.66], [42.34, -3.70], [41.65, -0.88], [39.57, 2.65], [38.0, 5.25]]
  },
  {
    id: '2027',
    title: 'Total Eclipse 2027',
    date: '2. August 2027',
    region: 'North Africa, Spain, Gibraltar',
    description: 'One of the longest eclipses of the century, passing directly over the Valley of the Kings in Egypt.',
    center: [30.0, 15.0],
    zoom: 4,
    pathPolygon: [],
    northernLimit: [[37.5, -8.0], [36.8, 0.0], [35.0, 10.0], [31.5, 25.0], [26.0, 40.0]],
    southernLimit: [[35.5, -9.0], [34.8, -1.0], [33.0, 9.0], [29.5, 24.0], [24.0, 39.0]],
    centerLine: [[36.5, -8.5], [35.8, -0.5], [34.0, 9.5], [30.5, 24.5], [25.0, 39.5]]
  },
  {
    id: '2028',
    title: 'Total Eclipse 2028',
    date: '22. July 2028',
    region: 'Australia, New Zealand',
    description: 'A spectacular path crossing the entire Australian continent and passing directly over Sydney Harbour.',
    center: [-25.0, 133.0],
    zoom: 4,
    pathPolygon: [],
    northernLimit: [[-12.0, 120.0], [-18.0, 130.0], [-28.0, 140.0], [-34.0, 151.0]],
    southernLimit: [[-14.0, 118.0], [-20.0, 128.0], [-30.0, 138.0], [-36.0, 149.0]],
    centerLine: [[-13.0, 119.0], [-19.0, 129.0], [-29.0, 139.0], [-35.0, 150.0]]
  },
  {
    id: '2030',
    title: 'Total Eclipse 2030',
    date: '25. November 2030',
    region: 'South Africa, Australia',
    description: 'Crossing the Southern Ocean from Africa to the Australian outback.',
    center: [-32.0, 50.0],
    zoom: 3,
    pathPolygon: [],
    northernLimit: [[-28.0, 15.0], [-32.0, 30.0], [-38.0, 80.0], [-33.0, 140.0]],
    southernLimit: [[-30.0, 14.0], [-34.0, 29.0], [-40.0, 79.0], [-35.0, 139.0]],
    centerLine: [[-29.0, 14.5], [-33.0, 29.5], [-39.0, 79.5], [-34.0, 139.5]]
  }
];

interface LandingPageProps {
  onSelect: (eclipse: EclipseEvent) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="inline-block p-3 bg-amber-500 rounded-full mb-6 shadow-[0_0_40px_rgba(251,191,36,0.5)]">
            <i className="fas fa-sun text-4xl text-slate-900"></i>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Eclipse Finder <span className="text-amber-500">3.0</span></h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">Visualisieren Sie die kommenden totalen Sonnenfinsternisse mit präzisen Pfadberechnungen und 3D-Simulationen.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ECLIPSES.map((e, idx) => (
            <div 
              key={e.id}
              onClick={() => onSelect(e)}
              className="group relative bg-slate-900 border border-white/10 rounded-[32px] p-8 cursor-pointer hover:bg-slate-800 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="relative z-10">
                <span className="text-amber-500 font-mono font-bold text-sm tracking-widest uppercase mb-2 block">{e.date}</span>
                <h3 className="text-2xl font-bold mb-4">{e.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{e.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-white/50 bg-white/5 p-3 rounded-2xl">
                  <i className="fas fa-globe-africa text-amber-500"></i>
                  {e.region}
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
