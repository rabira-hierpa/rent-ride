import { initialCars } from "../../../data/initialCars";
import { RootState } from "../../../redux/store";
import { renderWithRedux } from "../../../utils/render-with-store";
import ControlPanel from "../components/control.panel.component";
import { fireEvent, screen, within, act } from "@testing-library/react";
import { alert } from "../../../shared/lib/services";

// Set up spies on the alert service methods
const successSpy = jest.spyOn(alert, "success").mockImplementation(() => {});
const errorSpy = jest.spyOn(alert, "error").mockImplementation(() => {});
const infoSpy = jest.spyOn(alert, "info").mockImplementation(() => {});

describe("Car Rental Workflow", () => {
  const mockCars = initialCars;

  const mapRef = { current: null };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("renders car table with data", () => {
    renderWithRedux(
      <ControlPanel setIsReturnCarLoading={jest.fn()} mapRef={mapRef} />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars,
            selectedCarIdForRent: [],
            returnLocation: null,
          },
        },
      }
    );

    // Verify table structure
    const table = screen.getByTestId("car-table");
    expect(table).toBeInTheDocument();
    expect(within(table).getAllByRole("row")).toHaveLength(mockCars.length);
  });

  test("selects car when row clicked", () => {
    const { store } = renderWithRedux(
      <ControlPanel setIsReturnCarLoading={jest.fn()} mapRef={mapRef} />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars,
            selectedCarIdForRent: [],
            returnLocation: null,
          },
        },
      }
    );

    // Click first car row
    const firstRow = screen.getByTestId(`table-row-${mockCars[0].id}`);
    fireEvent.click(firstRow);

    expect(store.getState().cars.selectedCarIdForRent).toEqual([
      mockCars[0].id,
    ]);
  });

  test("rents a car successfully", async () => {
    const { store } = renderWithRedux(
      <ControlPanel setIsReturnCarLoading={jest.fn()} mapRef={mapRef} />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars,
            selectedCarIdForRent: [],
            returnLocation: null,
          },
        },
      }
    );

    // Select and rent a car
    const carToRent = mockCars[0];
    const userName = "John Doe";

    await act(async () => {
      fireEvent.click(screen.getByTestId(`table-row-${carToRent.id}`));
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: userName },
      });
    });

    // Wrap the button click in act()
    await act(async () => {
      fireEvent.click(screen.getByText("Rent"));
    });

    // Verify state changes
    const state = store.getState() as RootState;
    const rentedCar = state.cars.allCars.find((c) => c.id === carToRent.id);

    expect(rentedCar?.bookedBy).toBe(userName);
    expect(rentedCar?.availability).toBe(false);
    expect(state.cars.selectedCarIdForRent).toEqual([]);
    expect(successSpy).toHaveBeenCalledWith(
      `Dear ${userName} thank you for the rental car`
    );
  });

  test("returns a car to new location", async () => {
    const { store } = renderWithRedux(
      <ControlPanel setIsReturnCarLoading={jest.fn()} mapRef={mapRef} />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars.map((c) => ({ ...c, availability: false })),
            selectedCarIdForRent: [],
            returnLocation: { latitude: 25.2048, longitude: 55.2708 }, // Dubai coordinates
          },
        },
      }
    );

    // Select and return a car
    await act(async () => {
      fireEvent.click(screen.getByTestId(`table-row-${mockCars[1].id}`));
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Return"));
    });

    // Verify state changes
    const state = store.getState() as RootState;
    const returnedCar = state.cars.allCars.find((c) => c.id === mockCars[1].id);

    expect(returnedCar?.availability).toBe(true);
    expect(returnedCar?.location).toEqual({
      latitude: 25.2048,
      longitude: 55.2708,
    });
    expect(state.cars.returnLocation).toBeNull();
  });

  test("shows error alert when trying to rent an already rented car", async () => {
    renderWithRedux(
      <ControlPanel setIsReturnCarLoading={jest.fn()} mapRef={mapRef} />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars.map((c, index) =>
              index === 0
                ? { ...c, availability: false, bookedBy: "Jane Doe" }
                : c
            ),
            selectedCarIdForRent: [],
            returnLocation: null,
          },
        },
      }
    );

    // Select an already rented car
    const carToRent = mockCars[0];
    await act(async () => {
      fireEvent.click(screen.getByTestId(`table-row-${carToRent.id}`));
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "John Doe" },
      });
    });

    // Try to rent it
    await act(async () => {
      fireEvent.click(screen.getByText("Rent"));
    });

    // Verify error alert
    expect(errorSpy).toHaveBeenCalledWith("1 car is already rented");
  });

  test("shows info alert when trying to return without selecting a car", async () => {
    renderWithRedux(
      <ControlPanel setIsReturnCarLoading={jest.fn()} mapRef={mapRef} />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars,
            selectedCarIdForRent: [],
            returnLocation: null,
          },
        },
      }
    );

    // Try to return without selecting a car
    await act(async () => {
      fireEvent.click(screen.getByText("Return"));
    });

    // Verify info alert
    expect(infoSpy).toHaveBeenCalledWith("Please select a car to return");
  });

  test("shows error alert when trying to return an available car", async () => {
    renderWithRedux(
      <ControlPanel setIsReturnCarLoading={jest.fn()} mapRef={mapRef} />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars, // All cars are available by default
            selectedCarIdForRent: [],
            returnLocation: null,
          },
        },
      }
    );

    // Select an available car
    const carToReturn = mockCars[0];
    await act(async () => {
      fireEvent.click(screen.getByTestId(`table-row-${carToReturn.id}`));
    });

    // Try to return it
    await act(async () => {
      fireEvent.click(screen.getByText("Return"));
    });

    // Verify error alert
    expect(errorSpy).toHaveBeenCalledWith("1 car is not rented");
  });

  test("shows info alert when trying to return without selecting a location", async () => {
    const setIsReturnCarLoadingMock = jest.fn();
    renderWithRedux(
      <ControlPanel
        setIsReturnCarLoading={setIsReturnCarLoadingMock}
        mapRef={mapRef}
      />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars.map((c, index) =>
              index === 0
                ? { ...c, availability: false, bookedBy: "Jane Doe" }
                : c
            ),
            selectedCarIdForRent: [mockCars[0].id],
            returnLocation: null,
          },
        },
      }
    );

    // Try to return a car without selecting a location
    await act(async () => {
      fireEvent.click(screen.getByText("Return"));
    });

    // Verify info alert
    expect(infoSpy).toHaveBeenCalledWith(
      "Please select a location to return the car"
    );
    expect(setIsReturnCarLoadingMock).toHaveBeenCalledWith(true);
  });

  test("confirms car return when return location is selected", async () => {
    const setIsReturnCarLoadingMock = jest.fn();
    const { store } = renderWithRedux(
      <ControlPanel
        setIsReturnCarLoading={setIsReturnCarLoadingMock}
        mapRef={mapRef}
        isReturnCarLoading={true}
      />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars.map((c, index) =>
              index === 0
                ? { ...c, availability: false, bookedBy: "Jane Doe" }
                : c
            ),
            selectedCarIdForRent: [mockCars[0].id],
            returnLocation: { latitude: 25.2048, longitude: 55.2708 }, // Dubai coordinates
          },
        },
      }
    );

    // Confirm return with a selected location
    await act(async () => {
      fireEvent.click(screen.getByText("Confirm Return"));
    });

    // Verify state changes
    const state = store.getState() as RootState;
    const returnedCar = state.cars.allCars.find((c) => c.id === mockCars[0].id);

    expect(returnedCar?.availability).toBe(true);
    expect(returnedCar?.location).toEqual({
      latitude: 25.2048,
      longitude: 55.2708,
    });
    expect(state.cars.returnLocation).toBeNull();
    expect(setIsReturnCarLoadingMock).toHaveBeenCalledWith(false);
  });

  test("cancels car return process when cancel button is clicked", async () => {
    const setIsReturnCarLoadingMock = jest.fn();
    renderWithRedux(
      <ControlPanel
        setIsReturnCarLoading={setIsReturnCarLoadingMock}
        mapRef={mapRef}
        isReturnCarLoading={true}
      />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars.map((c, index) =>
              index === 0
                ? { ...c, availability: false, bookedBy: "Jane Doe" }
                : c
            ),
            selectedCarIdForRent: [mockCars[0].id],
            returnLocation: { latitude: 25.2048, longitude: 55.2708 }, // Dubai coordinates
          },
        },
      }
    );

    // Click cancel
    await act(async () => {
      fireEvent.click(screen.getByText("Cancel"));
    });

    // Verify the loading state is reset
    expect(setIsReturnCarLoadingMock).toHaveBeenCalledWith(false);
  });
});
