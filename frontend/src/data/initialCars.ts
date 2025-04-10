import { Car } from "../types";

// Helper to generate random coordinates within approximate UAE bounds
const getRandomUaeLocation = () => {
  const minLat = 22.6;
  const maxLat = 26.1;
  const minLon = 51.6;
  const maxLon = 56.4;
  return {
    latitude: Math.random() * (maxLat - minLat) + minLat,
    longitude: Math.random() * (maxLon - minLon) + minLon,
  };
};

// Simple ID generator
let carIdCounter = 0;
const generateCarId = () => `car_${carIdCounter++}`;

export const initialCars: Car[] = [
  {
    id: generateCarId(),
    modelName: "Tesla Model 3",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
  },
  {
    id: generateCarId(),
    modelName: "Volkswagen Golf",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
  },
  {
    id: generateCarId(),
    modelName: "Volkswagen Polo",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
  },
  {
    id: generateCarId(), // Second Polo
    modelName: "Volkswagen Polo",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
  },
  {
    id: generateCarId(), // Third Polo
    modelName: "Volkswagen Polo",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
  },
  {
    id: generateCarId(),
    modelName: "Range Rover",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
  },
  {
    id: generateCarId(),
    modelName: "Porsche 911",
    availability: true,
    bookedBy: null,
    bookedAt: null,
    location: getRandomUaeLocation(),
  },
];
