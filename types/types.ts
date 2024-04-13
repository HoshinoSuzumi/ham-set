export type ObserverLocationStore = {
  longitude: number,
  latitude: number,
  altitude?: number | null,
  accuracy: number,
  altitudeAccuracy?: number | null,
} | 'pending'

export interface SatelliteSighting {
  rise: SightingDetail;
  culminate: SightingDetail;
  set: SightingDetail;
}

export interface SightingDetail {
  time: Date;
  lat: number;
  lon: number;
  elevation: number;
  azimuth: number;
  distance: number;
}

