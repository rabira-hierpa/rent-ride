export interface Location {
  latitude: number;
  longitude: number;
}

export interface Car {
  id: string; // Use unique IDs, maybe UUIDs or sequential numbers
  modelName: string;
  availability: boolean;
  bookedBy: string | null;
  bookedAt: Date | null; // Or string if preferred, handle parsing
  location: Location;
}
