import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Map from "@arcgis/core/Map";
import esirConfig from "@arcgis/core/config";
import MapView, { MapViewClickEvent } from "@arcgis/core/views/MapView.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import { ViewClickEvent } from "@arcgis/core/views/View.js";

import { Location } from "../../../types";
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

export interface MapViewHandle {
  zoomToLocation: (location: Location, zoomLevel?: number) => void;
  onMapClick: (handler: (event: ViewClickEvent) => void) => void;
}

interface MapContainerProps {
  isReturnCarLoading: boolean;
}

const MapContainer = forwardRef<MapViewHandle, MapContainerProps>(
  ({ isReturnCarLoading }, ref) => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<MapView | null>(null);
    const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
    const clickHandlerRef = useRef<((event: ViewClickEvent) => void) | null>(
      null
    );

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
        if (!viewRef.current) {
          const view = new MapView({
            container: mapDivRef.current,
            map: map,
            center: [MAP_CENTER.LATITUDE, MAP_CENTER.LONGITUDE],
            zoom: MAP_ZOOM,
          });
          viewRef.current = view;
          view.on("click", (event: MapViewClickEvent) => {
            const mapPoint = view.toMap(event);

            if (mapPoint) {
              clickHandlerRef.current?.(event);
            }

            if (!isReturnCarLoading) {
              // Find the nearest graphic based on proximity
              const tolerance = 30; // Tolerance in pixels (adjust as needed)
              const screenPoint = view.toScreen(mapPoint);
              const carGraphic = graphicsLayerRef.current?.graphics.find(
                (graphic) => {
                  if (graphic.geometry && graphic.geometry.type === "point") {
                    const graphicScreenPoint = view.toScreen(graphic.geometry);
                    const distance = Math.hypot(
                      (graphicScreenPoint?.x ?? 0) - (screenPoint?.x ?? 0),
                      (graphicScreenPoint?.y ?? 0) - (screenPoint?.y ?? 0)
                    );
                    return distance <= tolerance; // Check if within tolerance
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
              } else if (!isReturnCarLoading) {
                dispatch(clearMapSelections());
              }
            }

            if (isReturnCarLoading) {
              clickHandlerRef.current?.(event);
            }
          });
        }

        if (!graphicsLayerRef.current) {
          graphicsLayerRef.current = new GraphicsLayer({
            id: "carsLayer",
          });
          map.add(graphicsLayerRef.current);
        } else {
          graphicsLayerRef.current.removeAll();
        }
      }
      return () => {
        if (viewRef.current) {
          viewRef.current.destroy();
          viewRef.current = null;
          graphicsLayerRef.current = null;
        }
      };
    }, [isReturnCarLoading]);

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
      if (viewRef.current && isReturnCarLoading) {
        console.log("isReturnCarLoading [map]", isReturnCarLoading);
        const handleMapClick = (event: ViewClickEvent) => {
          const mapPoint = viewRef.current?.toMap(event);
          const latitude = mapPoint?.latitude;
          const longitude = mapPoint?.longitude;

          if (
            mapPoint &&
            typeof latitude === "number" &&
            typeof longitude === "number"
          ) {
            dispatch(
              selectReturnLocation({
                latitude,
                longitude,
              })
            );

            const graphicsLayer = viewRef.current?.map.layers.find(
              (layer) => layer.id === "carsLayer"
            ) as GraphicsLayer;

            if (graphicsLayer) {
              const returnLocationGraphic = graphicsLayer.graphics.find(
                (graphic) => graphic.attributes?.id === "returnLocation"
              );
              if (returnLocationGraphic) {
                graphicsLayer.remove(returnLocationGraphic);
              }
              const graphic = new Graphic({
                attributes: {
                  id: "returnLocation",
                },
                geometry: mapPoint,
                symbol: selectedLocationSymbol,
              });
              graphicsLayer.add(graphic);
            }
          }
        };

        const clickHandle = viewRef.current.on("click", handleMapClick);

        return () => {
          clickHandle?.remove();
        };
      }
    }, [isReturnCarLoading, dispatch]);

    useImperativeHandle(ref, () => ({
      zoomToLocation: (location: Location, zoomLevel?: number) => {
        if (viewRef.current && location && Object.keys(location).length > 0) {
          viewRef.current.goTo({
            target: [location.longitude, location.latitude],
            zoom: zoomLevel || 8,
          });
        }
      },
      onMapClick: (handler: (event: ViewClickEvent) => void) => {
        clickHandlerRef.current = handler;
      },
    }));

    return (
      <div
        ref={mapDivRef}
        style={{ height: "100%", width: "100%", position: "absolute" }}
      ></div>
    );
  }
);

export default MapContainer;
