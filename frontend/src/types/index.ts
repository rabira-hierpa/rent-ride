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

export interface RentedCar extends Car {
  rentedAt: Date;
  returnLocation: Location;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}
