export type ObserverLocationStore = {
  longitude: number,
  latitude: number,
  altitude?: number | null,
  accuracy: number,
  altitudeAccuracy?: number | null,
} | 'pending'