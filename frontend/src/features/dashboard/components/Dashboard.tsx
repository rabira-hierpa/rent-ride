import React, { useState, useRef } from "react";
import { Car, Location } from "../../../types"; // Adjust path if needed
import { initialCars } from "../../../data/initialCars"; // Adjust path if needed
import MapContainer, { MapViewHandle } from "./MapContainer";
import ControlPanel from "./ControlPanel";
import { Layout } from "antd";

const { Header, Sider, Content } = Layout;

// Simple function to generate a temporary user ID (replace with actual user later)
const getCurrentUserId = () => "User123";

function Dashboard() {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null); // For renting (selected on map)
  const [selectedRentedCarId, setSelectedRentedCarId] = useState<string | null>(
    null
  ); // For returning (selected in list)
  const [returnLocation, setReturnLocation] = useState<Location | null>(null); // For returning (selected on map)
  const mapRef = useRef<MapViewHandle>(null); // Create ref for MapContainer

  const rentedCars = cars.filter((car) => !car.availability);

  const handleRentCar = (carId: string) => {
    setCars((prevCars) =>
      prevCars.map((car) =>
        car.id === carId
          ? {
              ...car,
              availability: false,
              bookedBy: getCurrentUserId(),
              bookedAt: new Date(),
            }
          : car
      )
    );
    setSelectedCarId(null); // Clear map selection after renting
  };

  const handleReturnCar = (carId: string, location: Location) => {
    setCars((prevCars) =>
      prevCars.map((car) =>
        car.id === carId
          ? {
              ...car,
              availability: true,
              bookedBy: null,
              bookedAt: null,
              location: location,
            }
          : car
      )
    );
    setSelectedRentedCarId(null); // Clear list selection
    setReturnLocation(null); // Clear map location selection
  };

  // Function to handle selection from the rented list
  const handleSelectRentedCar = (carId: string | null) => {
    setSelectedRentedCarId(carId);
    if (carId) {
      setSelectedCarId(null);
      setReturnLocation(null);
      // Find the selected car and zoom to it
      const carToZoom = cars.find((c) => c.id === carId);
      if (carToZoom) {
        mapRef.current?.zoomToLocation(carToZoom.location);
      }
    } // Don't zoom if deselecting (carId is null)
  };

  // Function to handle selection on the map (for renting)
  const handleSelectCarOnMap = (carId: string | null) => {
    setSelectedCarId(carId);
    // If a car is selected on map for rent, clear list selection
    if (carId) {
      setSelectedRentedCarId(null);
    }
  };

  // Function to handle selecting a return location on the map
  const handleSelectReturnLocation = (location: Location | null) => {
    setReturnLocation(location);
    // If a return location is selected, clear map car selection
    if (location) {
      setSelectedCarId(null);
    }
  };

  // Function to clear map selections (called by ControlPanel when list item selected)
  const clearMapSelections = () => {
    setSelectedCarId(null);
    setReturnLocation(null);
  };

  // Function to clear list selection (called by MapContainer when map interacted with)
  const clearListSelection = () => {
    setSelectedRentedCarId(null);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "white", display: "flex", alignItems: "center" }}>
        Rent-a-Ride Dashboard
      </Header>
      <Layout>
        <Sider
          width={350}
          theme="light"
          style={{ height: "calc(100vh - 64px)", overflow: "auto" }}
        >
          {" "}
          {/* Adjust width and ensure height */}
          <ControlPanel
            rentedCars={rentedCars}
            selectedCarId={selectedCarId}
            selectedRentedCarId={selectedRentedCarId}
            returnLocation={returnLocation}
            onSelectRentedCar={handleSelectRentedCar}
            onReturnCar={handleReturnCar}
            onRentCar={handleRentCar}
            clearMapSelections={clearMapSelections}
          />
        </Sider>
        <Content style={{ position: "relative", height: "calc(100vh - 64px)" }}>
          {" "}
          {/* Ensure Content fills height */}
          <MapContainer
            ref={mapRef}
            cars={cars}
            selectedCarId={selectedCarId}
            onSelectCar={handleSelectCarOnMap}
            onSelectReturnLocation={handleSelectReturnLocation}
            clearListSelection={clearListSelection}
          />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
