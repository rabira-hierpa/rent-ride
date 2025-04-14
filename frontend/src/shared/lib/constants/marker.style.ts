import PopupTemplate from "@arcgis/core/PopupTemplate";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

export const selectedLocationSymbol = new SimpleMarkerSymbol({
  style: "circle",
  size: 25,
  color: [255, 255, 0],
  outline: {
    color: [0, 0, 0],
    width: 2,
  },
});

export const defaultCarSymbol = new PictureMarkerSymbol({
  url: "/assets/car-available.svg",
  width: 25,
  height: 45,
  xoffset: 0,
  yoffset: 12.5,
});

export const selectedCarSymbol = new PictureMarkerSymbol({
  url: "/assets/car-selected.svg",
  width: 25,
  height: 55,
  xoffset: 0,
  yoffset: 12.5,
});

export const hoveredCarSymbol = new PictureMarkerSymbol({
  url: "/assets/car-selected.svg",
  width: 30,
  height: 60,
  xoffset: 0,
  yoffset: 12.5,
});

export const bookedCarSymbol = new PictureMarkerSymbol({
  url: "/assets/car-booked.svg",
  width: 25,
  height: 45,
  xoffset: 0,
  yoffset: 12.5,
});

export const carPopupTemplate = new PopupTemplate({
  title: "{model}",
  content: `
                  <ul>
                    <li>Model: {model}</li>
                    <li>Vendor: {vendor}</li>
                    <li>Availability: {availability}</li>
                    <li>Location: {location.latitude}, {location.longitude}</li>
                    <li>Booked By: {bookedBy}</li>
                    <li>Booked At: {bookedAt}</li>
                  </ul>
          `,
  fieldInfos: [
    {
      fieldName: "model",
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
        digitSeparator: true,
        places: 2,
      },
      visible: true,
    },
    {
      fieldName: "location.longitude",
      label: "Longitude",
      format: {
        places: 2,
        digitSeparator: true,
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
