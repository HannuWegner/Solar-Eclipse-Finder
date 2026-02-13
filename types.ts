
export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface SunPathPoint {
  time: string;
  altitude: number;
  azimuth: number;
}

export interface EclipseTimelinePoint {
  time: string;
  coverage: number; // 0 to 1
  altitude: number;
  azimuth: number;
}

export interface ObservationPoint extends Location {
  duration: string;
  altitude: number;
  azimuth: number;
  sunPath?: SunPathPoint[];
  timeline: EclipseTimelinePoint[];
}

export interface EclipseEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  region: string;
  center: [number, number];
  zoom: number;
  pathPolygon: [number, number][]; // Array of lat/lng pairs for the totality band
  northernLimit: [number, number][];
  southernLimit: [number, number][];
  centerLine: [number, number][];
}

export interface Accommodation {
  name: string;
  rating: number;
  priceLevel: string;
  uri: string;
  address: string;
}

export interface EclipseDetails {
  date: string;
  region: string;
  totalityDuration: string;
  sunPosition: {
    altitude: number;
    azimuth: number;
  };
  pathOfTotality: { lat: number; lng: number; time: string }[];
  northernLimit: { lat: number; lng: number; time: string }[];
  southernLimit: { lat: number; lng: number; time: string }[];
  observationPoints: ObservationPoint[];
  accommodations: Accommodation[];
  summary: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
