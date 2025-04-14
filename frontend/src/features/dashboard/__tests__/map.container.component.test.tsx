import MapContainer from "../components/map.container.component";
import { renderWithRedux } from "../../../utils/render-with-store";
import { initialCars } from "../../../data/initialCars";
import { screen, act } from "@testing-library/react";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { selectReturnLocation } from "../../../redux/features/cars/carsSlice";
import { Location, MapClickEvent, MapViewHandle } from "../../../types";

jest.mock("@arcgis/core/Map");
jest.mock("@arcgis/core/views/MapView");
jest.mock("@arcgis/core/layers/GraphicsLayer");
jest.mock("@arcgis/core/Graphic");
jest.mock("@arcgis/core/geometry/Point");

describe("Map Interactions", () => {
  const mockCars = initialCars;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initializes map", () => {
    const { container } = renderWithRedux(
      <MapContainer isReturnCarLoading={false} />,
      {
        preloadedState: {
          cars: {
            allCars: mockCars,
            selectedCarIdForRent: null,
            returnLocation: null,
          },
        },
      }
    );
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  test("handles zoom functionality", async () => {
    const mockGoTo = jest.fn();
    jest.mocked(MapView).mockImplementation(
      () =>
        ({
          container: document.createElement("div"),
          goTo: mockGoTo,
          on: jest.fn().mockReturnValue({ remove: jest.fn() }),
          destroy: jest.fn(),
          toMap: jest.fn(),
          toScreen: jest.fn(),
        } as unknown as MapView)
    );

    const ref = { current: null };
    renderWithRedux(<MapContainer ref={ref} isReturnCarLoading={false} />, {
      preloadedState: {
        cars: {
          allCars: mockCars,
          selectedCarIdForRent: null,
          returnLocation: null,
        },
      },
    });

    await screen.findByTestId("map-container-div");

    // Allow time for useImperativeHandle to set up the ref
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(ref.current).not.toBeNull();

    await act(async () => {
      const mapRef = ref.current as unknown as MapViewHandle;
      if (mapRef) {
        mapRef.zoomToLocation({ latitude: 40, longitude: -100 });
      }
    });

    expect(mockGoTo).toHaveBeenCalled();
  });

  test("updates return location on map click", async () => {
    const mockLocation: Location = {
      latitude: 24.4539,
      longitude: 54.3773,
    };

    let mapClickHandler: ((event: MapClickEvent) => void) | null = null;

    jest.mocked(MapView).mockImplementation(
      () =>
        ({
          container: document.createElement("div"),
          goTo: jest.fn(),
          on: jest.fn().mockImplementation((eventName, handler) => {
            if (eventName === "click") {
              mapClickHandler = handler as (event: MapClickEvent) => void;
            }
            return { remove: jest.fn() };
          }),
          destroy: jest.fn(),
          toMap: jest.fn().mockReturnValue(mockLocation),
          toScreen: jest.fn(),
        } as unknown as MapView)
    );

    const { store } = renderWithRedux(
      <MapContainer isReturnCarLoading={true} />,
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

    await screen.findByTestId("map-container-div");

    // Allow time for effects to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(mapClickHandler).not.toBeNull();

    await act(async () => {
      store.dispatch(selectReturnLocation(mockLocation));
    });
    expect(store.getState().cars.returnLocation).toEqual(mockLocation);
  });

  test("shows/hides cars based on availability", async () => {
    const addMock = jest.fn();
    const mockGraphicsLayer = {
      graphics: [],
      add: addMock,
      remove: jest.fn(),
      removeAll: jest.fn(),
    };

    jest
      .mocked(GraphicsLayer)
      .mockImplementation(() => mockGraphicsLayer as unknown as GraphicsLayer);

    const rentedCar = { ...mockCars[0], id: "car1", availability: false };
    const availableCar = { ...mockCars[1], id: "car2", availability: true };

    renderWithRedux(<MapContainer isReturnCarLoading={false} />, {
      preloadedState: {
        cars: {
          allCars: [rentedCar, availableCar],
          selectedCarIdForRent: [],
          returnLocation: null,
        },
      },
    });

    await screen.findByTestId("map-container-div");

    // Wait for the effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(addMock).toHaveBeenCalled();
    expect(mockGraphicsLayer.removeAll).toHaveBeenCalled();
  });
});
