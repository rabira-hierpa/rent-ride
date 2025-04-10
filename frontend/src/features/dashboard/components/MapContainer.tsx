import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Car, Location } from "../../../types"; // Adjust path based on actual location of types
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Graphic from "@arcgis/core/Graphic.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Point from "@arcgis/core/geometry/Point.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import esriConfig from "@arcgis/core/config.js";

// Import ArcGIS CSS
import "@arcgis/core/assets/esri/themes/light/main.css";

interface MapContainerProps {
  cars: Car[];
  selectedCarId: string | null;
  onSelectCar: (id: string | null) => void;
  onSelectReturnLocation: (location: Location | null) => void;
  clearListSelection: () => void;
}

// Define handle structure for ref
export interface MapViewHandle {
  zoomToLocation: (location: Location, zoomLevel?: number) => void;
}

// Wrap component with forwardRef
const MapContainer = forwardRef<MapViewHandle, MapContainerProps>(
  (
    {
      cars,
      selectedCarId, // Will be used later for highlighting
      onSelectCar,
      onSelectReturnLocation,
      clearListSelection,
    },
    ref // Add ref parameter
  ) => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<MapView | null>(null);
    const graphicsLayerRef = useRef<GraphicsLayer | null>(null);

    // Expose zoom function via ref
    useImperativeHandle(ref, () => ({
      zoomToLocation: (location: Location, zoomLevel: number = 14) => {
        if (viewRef.current) {
          viewRef.current.goTo({
            target: [location.longitude, location.latitude],
            zoom: zoomLevel,
          });
        }
      },
    }));

    // Initialize MapView and GraphicsLayer
    useEffect(() => {
      // Configure API Key inside useEffect before map creation
      const apiKey = import.meta.env.VITE_APP_ARCGIS_API_KEY;
      if (apiKey) {
        esriConfig.apiKey = apiKey;
      } else {
        console.warn(
          "ArcGIS API key not found. Set VITE_APP_ARCGIS_API_KEY in .env"
        );
        // Optionally: return early or handle error if key is essential and missing
      }

      if (mapDivRef.current && !viewRef.current) {
        const map = new Map({
          basemap: "osm/streets",
        });

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);
        graphicsLayerRef.current = graphicsLayer;

        const view = new MapView({
          container: mapDivRef.current,
          map: map,
          center: [54.5, 24.5], // Centered roughly on UAE
          zoom: 7,
        });

        viewRef.current = view;

        // --- Click Handling ---
        view.on("click", (event) => {
          view
            .hitTest(event)
            .then((response) => {
              // Filter results for hits on graphics within our specific GraphicsLayer
              const graphicHits = response.results.filter(
                (
                  result
                ): result is __esri.GraphicHit => // Type guard
                  result.type === "graphic" && // Ensure it's a graphic hit
                  result.graphic.layer === graphicsLayerRef.current
              );

              if (graphicHits.length > 0) {
                // We have at least one hit on our layer, take the first one
                const graphic = graphicHits[0].graphic; // Safe to access .graphic now

                if (graphic.attributes?.carId) {
                  const clickedCar = cars.find(
                    (c) => c.id === graphic.attributes.carId
                  );
                  if (clickedCar?.availability) {
                    onSelectCar(graphic.attributes.carId);
                    onSelectReturnLocation(null);
                    clearListSelection();
                  } else {
                    onSelectCar(null);
                    onSelectReturnLocation(null);
                  }
                }
              } else {
                // Clicked on the map background
                const mapPoint = view.toMap(event);
                if (
                  mapPoint &&
                  typeof mapPoint.latitude === "number" &&
                  typeof mapPoint.longitude === "number"
                ) {
                  onSelectReturnLocation({
                    latitude: mapPoint.latitude,
                    longitude: mapPoint.longitude,
                  });
                  onSelectCar(null);
                  clearListSelection();
                }
              }
            })
            .catch((err) => {
              // It's good practice to catch potential errors from promises like hitTest
              console.error("Error during map hitTest:", err);
            });
        });

        // Cleanup function
        return () => {
          if (viewRef.current) {
            viewRef.current.destroy();
            viewRef.current = null;
            graphicsLayerRef.current = null; // Clear layer ref too
          }
        };
      }
    }, [onSelectCar, onSelectReturnLocation, clearListSelection, cars]);

    // Update Graphics when cars or selectedCarId change
    useEffect(() => {
      if (graphicsLayerRef.current) {
        graphicsLayerRef.current.removeAll(); // Clear existing graphics

        const availableCars = cars.filter((car) => car.availability);

        availableCars.forEach((car) => {
          const point = new Point({
            longitude: car.location.longitude,
            latitude: car.location.latitude,
          });

          const isSelected = car.id === selectedCarId;

          // Define symbols for default and selected states
          const defaultSymbol = new SimpleMarkerSymbol({
            color: "blue",
            size: "10px",
            outline: {
              color: [255, 255, 255], // White outline
              width: 1,
            },
          });

          const selectedSymbol = new SimpleMarkerSymbol({
            color: "cyan", // Different color for selected
            size: "14px", // Slightly larger when selected
            outline: {
              color: [0, 0, 0], // Black outline for contrast
              width: 1.5,
            },
          });

          const graphic = new Graphic({
            geometry: point,
            symbol: isSelected ? selectedSymbol : defaultSymbol, // Use appropriate symbol
            attributes: {
              carId: car.id,
            },
          });
          graphicsLayerRef.current?.add(graphic);
        });
      }
    }, [cars, selectedCarId]); // Re-run if cars array or selectedCarId changes

    return (
      <div
        ref={mapDivRef}
        style={{ height: "100%", width: "100%", position: "absolute" }}
      ></div>
    );
  }
); // Close forwardRef

export default MapContainer;
