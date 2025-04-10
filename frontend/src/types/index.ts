export interface Location {
  latitude: number;
  longitude: number;
}

export interface Car {
  id: string;
  modelName: string;
  availability: boolean;
  bookedBy: string | null;
  bookedAt: Date | null;
  location: Location;
}

export interface RentedCar extends Car {
  rentedAt: Date;
  returnLocation: Location;
}
