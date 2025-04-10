import React from "react";
import { Car, Location } from "../../../types"; // Adjust path as needed
import { Button, List, Typography, Divider } from "antd";

interface ControlPanelProps {
  rentedCars: Car[];
  selectedCarId: string | null; // From map selection (for enabling Rent)
  selectedRentedCarId: string | null; // From list selection
  returnLocation: Location | null; // From map click (for enabling Return)
  onSelectRentedCar: (id: string | null) => void;
  onRentCar: (carId: string) => void;
  onReturnCar: (carId: string, location: Location) => void;
  clearMapSelections: () => void;
}

const { Title, Text } = Typography;

const ControlPanel: React.FC<ControlPanelProps> = ({
  rentedCars,
  selectedCarId,
  selectedRentedCarId,
  returnLocation,
  onSelectRentedCar,
  onRentCar,
  onReturnCar,
  clearMapSelections,
}) => {
  const handleRentClick = () => {
    if (selectedCarId) {
      onRentCar(selectedCarId);
    }
  };

  const handleReturnClick = () => {
    if (selectedRentedCarId && returnLocation) {
      onReturnCar(selectedRentedCarId, returnLocation);
    }
  };

  const handleSelectRented = (carId: string) => {
    // Toggle selection off if clicking the same item again
    const newSelection = selectedRentedCarId === carId ? null : carId;
    onSelectRentedCar(newSelection);
    if (newSelection) {
      clearMapSelections(); // Clear map selections only if selecting a new item
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Title level={4}>Controls</Title>
      <Button
        type="primary"
        onClick={handleRentClick}
        disabled={!selectedCarId}
        style={{ marginBottom: "8px", width: "100%" }}
      >
        Rent Selected Car
      </Button>
      <Button
        onClick={handleReturnClick}
        disabled={!selectedRentedCarId || !returnLocation}
        style={{ width: "100%" }}
      >
        Return Car to Selected Location
      </Button>
      {returnLocation && selectedRentedCarId && (
        <Text
          type="secondary"
          style={{ fontSize: "0.8em", marginTop: "4px", textAlign: "center" }}
        >
          Return to: {returnLocation.latitude.toFixed(4)},{" "}
          {returnLocation.longitude.toFixed(4)}
        </Text>
      )}

      <Divider />

      <Title level={4} style={{ marginTop: "auto" }}>
        Rented Cars
      </Title>
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        <List
          bordered
          dataSource={rentedCars}
          renderItem={(car) => (
            <List.Item
              onClick={() => handleSelectRented(car.id)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectedRentedCarId === car.id ? "#e6f7ff" : "transparent",
                transition: "background-color 0.2s",
              }}
              role="button"
              aria-pressed={selectedRentedCarId === car.id}
            >
              <List.Item.Meta
                title={car.modelName}
                description={`Booked: ${
                  car.bookedAt ? car.bookedAt.toLocaleDateString() : "N/A"
                }`}
              />
              <Text type="secondary" style={{ fontSize: "0.8em" }}>
                ID: {car.id}
              </Text>
            </List.Item>
          )}
          locale={{ emptyText: "No cars currently rented" }}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
