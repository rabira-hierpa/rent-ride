import React, { forwardRef, useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import esirConfig from "@arcgis/core/config";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import PopupTemplate from "@arcgis/core/PopupTemplate";

import { Location } from "../../../types";
import { alert } from "../../../shared/lib/services";
import { initialCars } from "../../../data/initialCars";
export interface MapViewHandle {
  zoomToLocation: (location: Location, zoomLevel?: number) => void;
}

const MapContainer = forwardRef<MapViewHandle>(() => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);

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

      if (!graphicsLayerRef.current) {
        graphicsLayerRef.current = new GraphicsLayer({
          id: "carsLayer",
        });
        map.add(graphicsLayerRef.current);

        const carSymbol = new SimpleMarkerSymbol({
          style: "circle",
          size: 10,
          color: [226, 114, 114],
          outline: {
            color: [255, 255, 255],
            width: 1,
          },
        });

        const carPopupTemplate = new PopupTemplate({
          title: "{modelName}",
          content: `
        <ul>
          <li>Model: {modelName}</li>
          <li>Availability: {availability}</li>
          <li>Location: {location.latitude}, {location.longitude}</li>
          <li>Booked By: {bookedBy}</li>
          <li>Booked At: {bookedAt}</li>
        </ul>
        `,
          fieldInfos: [
            {
              fieldName: "modelName",
              label: "Model",
              visible: true,
            },
            {
              fieldName: "availability",
              label: "Availability",
              visible: true,
            },
            {
              fieldName: "location.latitude",
              label: "Location",
              format: {
                places: 5,
                digitSeparator: false,
              },
              visible: true,
            },
            {
              fieldName: "location.longitude",
              label: "Longitude",
              format: {
                places: 5,
                digitSeparator: false,
              },
              visible: true,
            },
            {
              fieldName: "bookedBy",
              label: "Booked By",
              visible: true,
            },
            {
              fieldName: "bookedAt",
              label: "Booked At",
              visible: true,
            },
          ],
        });

        const availableCars = initialCars.filter((car) => car.availability);

        console.log(availableCars);
        availableCars.forEach((car) => {
          const point = new Point({
            x: car.location.longitude,
            y: car.location.latitude,
          });
          const attributes = {
            ...car,
            latitude: car.location.latitude,
            longitude: car.location.longitude,
          };
          const graphic = new Graphic({
            geometry: point,
            symbol: carSymbol,
            popupTemplate: carPopupTemplate,
            attributes: attributes,
          });
          graphicsLayerRef?.current?.add(graphic);
        });
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
  }, []);

  return (
    <div
      ref={mapDivRef}
      style={{ height: "95.5%", width: "100%", position: "absolute" }}
    ></div>
  );
});

export default MapContainer;
