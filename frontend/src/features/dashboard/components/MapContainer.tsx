import React, { forwardRef, useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import esirConfig from "@arcgis/core/config";
import MapView from "@arcgis/core/views/MapView";
import { Location } from "../../../types";
import { alert } from "../../../shared/lib/services";

export interface MapViewHandle {
  zoomToLocation: (location: Location, zoomLevel?: number) => void;
}

const MapContainer = forwardRef<MapViewHandle>(() => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);

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
          center: [55.5, 24.5],
          zoom: 8,
        });
        viewRef.current = view;
      }
    }
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [mapDivRef]);

  return (
    <div
      ref={mapDivRef}
      style={{ height: "95.5%", width: "100%", position: "absolute" }}
    ></div>
  );
});

export default MapContainer;
