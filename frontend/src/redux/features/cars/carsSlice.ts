import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialCars } from "../../../data/initialCars";
import { Car, Location } from "../../../types";

interface CarsState {
  allCars: Car[];
  selectedCarIdForRent: string[];
  returnLocation: Location | null;
}

const initialState: CarsState = {
  allCars: initialCars,
  selectedCarIdForRent: [],
  returnLocation: null,
};

export const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    rentCar: (
      state,
      action: PayloadAction<{ carIds: string[]; userName: string }>
    ) => {
      const { carIds, userName } = action.payload;
      carIds.forEach((carId) => {
        const carIndex = state.allCars.findIndex((car) => carId === car.id);
        if (carIndex !== -1 && state.allCars[carIndex].availability) {
          state.allCars[carIndex] = {
            ...state.allCars[carIndex],
            availability: false,
            bookedBy: userName,
            bookedAt: new Date().toISOString(),
          };
          state.selectedCarIdForRent = [];
          state.returnLocation = null;
        }
      });
    },
    returnCar: (
      state,
      action: PayloadAction<{ carIds: string[]; location: string }>
    ) => {
      const { carIds, location } = action.payload;
      carIds.forEach((carId) => {
        const carIndex = state.allCars.findIndex((car) => carId === car.id);
        if (carIndex !== -1 && !state.allCars[carIndex].availability) {
          state.allCars[carIndex] = {
            ...state.allCars[carIndex],
            availability: true,
            bookedBy: null,
            bookedAt: null,
            location: JSON.parse(location),
          };
          state.selectedCarIdForRent = [];
          state.returnLocation = null;
        }
      });
    },
    selectCarForRent: (state, action: PayloadAction<string[] | null>) => {
      state.selectedCarIdForRent = action.payload || [];
    },
    selectReturnLocation: (state, action: PayloadAction<Location | null>) => {
      state.returnLocation = action.payload;
    },
    clearMapSelections: (state) => {
      state.selectedCarIdForRent = [];
      state.returnLocation = null;
    },
  },
});

export const {
  rentCar,
  returnCar,
  selectCarForRent,
  selectReturnLocation,
  clearMapSelections,
} = carsSlice.actions;

export default carsSlice.reducer;
