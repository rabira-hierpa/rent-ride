import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Map from "@arcgis/core/Map";
import esirConfig from "@arcgis/core/config";
import MapView from "@arcgis/core/views/MapView.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";

import {
  Location,
  MapClickEvent,
  MapMode,
  MapViewHandle,
} from "../../../types";
import { alert } from "../../../shared/lib/services";
import { useAppSelector } from "../../../redux/hooks";
import {
  defaultCarSymbol,
  selectedCarSymbol,
  selectedLocationSymbol,
} from "../../../shared/lib/constants/marker.style";
import {
  clearMapSelections,
  selectCarForRent,
  selectReturnLocation,
} from "../../../redux/features/cars/carsSlice";
import { useDispatch } from "react-redux";
import { MAP_ZOOM } from "../../../shared/lib/constants/constants";
import { MAP_CENTER } from "../../../shared/lib/constants/constants";

interface MapContainerProps {
  isReturnCarLoading: boolean;
}

const MapContainer = forwardRef<MapViewHandle, MapContainerProps>(
  ({ isReturnCarLoading }, ref) => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<MapView | null>(null);
    const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
    const clickHandlerRef = useRef<((event: MapClickEvent) => void) | null>(
      null
    );
    const [mapMode, setMapMode] = useState<MapMode>(MapMode.SELECT_CAR);

    const { allCars } = useAppSelector((state) => state.cars);
    const dispatch = useDispatch();
    const selectedCarIdForRent = useAppSelector(
      (state) => state.cars.selectedCarIdForRent
    );

    useEffect(() => {
      const apiKey = import.meta.env.VITE_APP_ARCGIS_API_KEY;
      if (!apiKey) {
        alert.error("API key is not set");
        return;
      }
      esirConfig.apiKey = apiKey;
      if (mapDivRef.current && !viewRef.current) {
        const map = new Map({
          basemap: "arcgis/streets-night",
        });

        const view = new MapView({
          container: mapDivRef.current,
          map: map,
          center: [MAP_CENTER.LATITUDE, MAP_CENTER.LONGITUDE],
          zoom: MAP_ZOOM,
        });
        viewRef.current = view;

        graphicsLayerRef.current = new GraphicsLayer({ id: "carsLayer" });
        map.add(graphicsLayerRef.current);
      }

      return () => {
        if (viewRef.current) {
          viewRef.current.destroy();
          viewRef.current = null;
          graphicsLayerRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      if (!viewRef.current) return;

      const view = viewRef.current;

      const handleMapClick = (event: MapClickEvent) => {
        const mapPoint = view.toMap({ x: event.x, y: event.y });
        if (!mapPoint) return;

        if (clickHandlerRef.current) {
          clickHandlerRef.current(event);
        }

        if (mapMode === MapMode.SELECT_CAR) {
          const tolerance = 30; // Tolerance in pixels
          const screenPoint = view.toScreen(mapPoint);
          const carGraphic = graphicsLayerRef.current?.graphics.find(
            (graphic) => {
              if (graphic.geometry && graphic.geometry.type === "point") {
                const graphicScreenPoint = view.toScreen(graphic.geometry);
                const distance = Math.hypot(
                  (graphicScreenPoint?.x ?? 0) - (screenPoint?.x ?? 0),
                  (graphicScreenPoint?.y ?? 0) - (screenPoint?.y ?? 0)
                );
                return distance <= tolerance;
              }
              return false;
            }
          );

          if (carGraphic) {
            const attributes = carGraphic.attributes;
            if (attributes) {
              dispatch(
                selectCarForRent(
                  selectedCarIdForRent?.length
                    ? [...selectedCarIdForRent, attributes.id]
                    : [attributes.id]
                )
              );
            }
          } else {
            dispatch(clearMapSelections());
          }
        } else if (mapMode === MapMode.RETURN_CAR) {
          const latitude = mapPoint.latitude;
          const longitude = mapPoint.longitude;

          if (typeof latitude === "number" && typeof longitude === "number") {
            dispatch(
              selectReturnLocation({
                latitude,
                longitude,
              })
            );

            if (graphicsLayerRef.current) {
              const returnLocationGraphic =
                graphicsLayerRef.current.graphics.find(
                  (graphic) => graphic.attributes?.id === "returnLocation"
                );
              if (returnLocationGraphic) {
                graphicsLayerRef.current.remove(returnLocationGraphic);
              }
              const graphic = new Graphic({
                attributes: {
                  id: "returnLocation",
                },
                geometry: mapPoint,
                symbol: selectedLocationSymbol,
              });
              graphicsLayerRef.current.add(graphic);
            }
          }
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clickHandle = view.on("click", handleMapClick as any); // Type assertion needed for ArcGIS compatibility

      return () => {
        if (clickHandle && typeof clickHandle.remove === "function") {
          clickHandle.remove();
        }
      };
    }, [mapMode, selectedCarIdForRent, dispatch]);

    useEffect(() => {
      if (graphicsLayerRef.current) {
        graphicsLayerRef.current.removeAll();
        const availableCars = allCars.filter((car) => car.availability);
        availableCars.forEach((car) => {
          const point = new Point({
            x: car.location.longitude,
            y: car.location.latitude,
          });
          const isCarSelected = selectedCarIdForRent?.includes(car.id);
          const attributes = {
            ...car,
            latitude: car.location.latitude,
            longitude: car.location.longitude,
          };

          const symbol = isCarSelected ? selectedCarSymbol : defaultCarSymbol;

          const graphic = new Graphic({
            geometry: point,
            symbol: symbol,
            attributes: attributes,
          });
          graphicsLayerRef.current?.add(graphic);
        });
      }
    }, [allCars, selectedCarIdForRent]);

    useEffect(() => {
      setMapMode(isReturnCarLoading ? MapMode.RETURN_CAR : MapMode.SELECT_CAR);
    }, [isReturnCarLoading]);

    useImperativeHandle(ref, () => ({
      zoomToLocation: (location: Location, zoomLevel?: number) => {
        if (viewRef.current && location && Object.keys(location).length > 0) {
          viewRef.current.goTo({
            target: [location.longitude, location.latitude],
            zoom: zoomLevel || 8,
          });
        }
      },
      onMapClick: (handler: (event: MapClickEvent) => void) => {
        clickHandlerRef.current = handler;
      },
    }));

    return (
      <div
        ref={mapDivRef}
        style={{ height: "100%", width: "100%", position: "absolute" }}
        data-testid="map-container-div"
      ></div>
    );
  }
);

export default MapContainer;
