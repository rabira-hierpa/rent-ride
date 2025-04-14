import { configureStore } from "@reduxjs/toolkit";
import { carsSlice } from "../redux/features/cars/carsSlice";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

export const renderWithRedux = (
  ui: React.ReactNode,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { cars: carsSlice.reducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
};
