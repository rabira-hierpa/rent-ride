export interface Location {
  latitude: number;
  longitude: number;
}

export interface Car {
  id: string;
  model: string;
  vendor: string;
  availability: boolean;
  bookedBy: string | null;
  bookedAt: string | null;
  location: Location;
  baseLocation: Location;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface MapPoint {
  latitude: number;
  longitude: number;
  type: string;
  spatialReference?: Record<string, unknown>;
}

export interface MapClickEvent {
  mapPoint: MapPoint;
  x: number;
  y: number;
  button: number;
  type: string;
  stopPropagation: () => void;
  preventDefault: () => void;
}

// Define modes for map interaction
export enum MapMode {
  SELECT_CAR = "SELECT_CAR",
  RETURN_CAR = "RETURN_CAR",
}

export interface MapViewHandle {
  zoomToLocation: (location: Location, zoomLevel?: number) => void;
  onMapClick: (handler: (event: MapClickEvent) => void) => void;
}
