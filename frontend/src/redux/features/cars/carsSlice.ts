import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialCars } from "../../../data/initialCars";
import { Car, Location } from "../../../types";

interface CarsState {
  allCars: Car[];
  selectedCarIdForRent: string | null; // Selected on map
  selectedCarIdForReturn: string | null; // Selected in list
  returnLocation: Location | null; // Selected on map for return
  nameInput: string | null;
}

const initialState: CarsState = {
  allCars: initialCars,
  selectedCarIdForRent: null,
  selectedCarIdForReturn: null,
  returnLocation: null,
  nameInput: null,
};

export const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    rentCar: (
      state,
      action: PayloadAction<{ carId: string; userId: string }>
    ) => {
      const { carId, userId } = action.payload;
      const carIndex = state.allCars.findIndex((car) => car.id === carId);
      if (carIndex !== -1 && state.allCars[carIndex].availability) {
        state.allCars[carIndex] = {
          ...state.allCars[carIndex],
          availability: false,
          bookedBy: userId,
          bookedAt: new Date().toISOString(), // Store as ISO string for serializability
        };
        // Clear selections after action
        state.selectedCarIdForRent = null;
        state.selectedCarIdForReturn = null;
        state.returnLocation = null;
      }
    },
    returnCar: (
      state,
      action: PayloadAction<{ carId: string; location: Location }>
    ) => {
      const { carId, location } = action.payload;
      const carIndex = state.allCars.findIndex((car) => car.id === carId);
      if (carIndex !== -1 && !state.allCars[carIndex].availability) {
        state.allCars[carIndex] = {
          ...state.allCars[carIndex],
          availability: true,
          bookedBy: null,
          bookedAt: null,
          location: location,
        };
        // Clear selections after action
        state.selectedCarIdForRent = null;
        state.selectedCarIdForReturn = null;
        state.returnLocation = null;
      }
    },
    selectCarForRent: (state, action: PayloadAction<string | null>) => {
      state.selectedCarIdForRent = action.payload;
      // Clear conflicting selections
      if (action.payload) {
        state.selectedCarIdForReturn = null;
      }
    },
    selectCarForReturn: (state, action: PayloadAction<string | null>) => {
      state.selectedCarIdForReturn = action.payload;
      // Clear conflicting selections
      if (action.payload) {
        state.selectedCarIdForRent = null;
        state.returnLocation = null; // Keep location if already selected?
      }
    },
    selectReturnLocation: (state, action: PayloadAction<Location | null>) => {
      state.returnLocation = action.payload;
      // Clear conflicting selection
      if (action.payload) {
        state.selectedCarIdForRent = null;
      }
    },
    clearMapSelections: (state) => {
      state.selectedCarIdForRent = null;
      state.returnLocation = null;
    },
    clearListSelection: (state) => {
      state.selectedCarIdForReturn = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  rentCar,
  returnCar,
  selectCarForRent,
  selectCarForReturn,
  selectReturnLocation,
  clearMapSelections,
  clearListSelection,
} = carsSlice.actions;

export default carsSlice.reducer;
