import { Car } from "../types";

// Helper to generate random coordinates within approximate UAE bounds
const getRandomUaeLocation = () => {
  const minLat = 22.6;
  const maxLat = 26.1;
  const minLon = 53.5;
  const maxLon = 56.2;
  return {
    latitude: Number((Math.random() * (maxLat - minLat) + minLat).toFixed(2)),
    longitude: Number((Math.random() * (maxLon - minLon) + minLon).toFixed(2)),
  };
};

// Simple ID generator
let carIdCounter = 0;
const generateCarId = () => `car_${carIdCounter++}`;

export const initialCars: Car[] = [
  {
    id: generateCarId(),
    model: "Tesla Model 3",
    vendor: "Tesla",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
    baseLocation: getRandomUaeLocation(),
  },
  {
    id: generateCarId(),
    model: "Volkswagen Golf",
    vendor: "Volkswagen",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
    baseLocation: getRandomUaeLocation(),
  },
  {
    id: generateCarId(),
    model: "Volkswagen Polo",
    vendor: "Volkswagen",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
    baseLocation: getRandomUaeLocation(),
  },
  {
    id: generateCarId(), // Second Polo
    model: "Volkswagen Polo",
    vendor: "Volkswagen",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
    baseLocation: getRandomUaeLocation(),
  },
  {
    id: generateCarId(), // Third Polo
    model: "Volkswagen Polo",
    vendor: "Volkswagen",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
    baseLocation: getRandomUaeLocation(),
  },
  {
    id: generateCarId(),
    model: "Range Rover",
    vendor: "Range Rover",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
    baseLocation: getRandomUaeLocation(),
  },
  {
    id: generateCarId(),
    model: "Porsche 911",
    vendor: "Porsche",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
    baseLocation: getRandomUaeLocation(),
  },
];
