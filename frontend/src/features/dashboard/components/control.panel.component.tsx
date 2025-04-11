import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Table, Typography, Tag, Button } from "antd";
import { Car, Location } from "../../../types";
import { selectCarForRent } from "../../../redux/features/cars/carsSlice";
import { MapViewHandle } from "./map.container.component";
import { useEffect, useState } from "react";
import { alert } from "../../../shared/lib/services";
const { Title } = Typography;

const ControlPanel = ({
  mapRef,
}: {
  mapRef: React.RefObject<MapViewHandle>;
}) => {
  const dispatch = useDispatch();
  const { allCars } = useSelector((state: RootState) => state.cars);
  const selectedCarIdForRent = useSelector(
    (state: RootState) => state.cars.selectedCarIdForRent
  );
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.onMapClick((event) => {
        setSelectedLocation({
          latitude: event.screenPoint.x,
          longitude: event.screenPoint.y,
        });
        console.log(event);
      });
    }
  }, [mapRef]);

  const columns = [
    {
      title: "Model",
      dataIndex: "model",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      render: (availability: boolean) =>
        availability ? (
          <Tag color="green">Available</Tag>
        ) : (
          <Tag color="red">Booked</Tag>
        ),
    },

    {
      title: "Booked By",
      dataIndex: "bookedBy",
    },
    {
      title: "Booked At",
      dataIndex: "bookedAt",
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (location: Location) => (
        <span className="text-xs">
          {location.latitude}, {location.longitude}
        </span>
      ),
    },
    {
      title: "Base Location",
      dataIndex: "baseLocation",
      render: (baseLocation: Location) => (
        <span className="text-xs">
          {baseLocation.latitude}, {baseLocation.longitude}
        </span>
      ),
    },
  ];

  const rowSelection = {
    type: "radio",
    onChange: (selectedRowKeys: React.Key[], selectedRows: unknown) => {
      const selectedCar = (selectedRows as Car[])[0];
      if (selectedCar) {
        dispatch(selectCarForRent(selectedCar.id));
        mapRef.current?.zoomToLocation(selectedCar.location);
      }
    },
  };

  const handleRentCar = () => {
    if (selectedCarIdForRent) {
      const selectedCar = allCars.find(
        (car) => car.id === selectedCarIdForRent
      );
      if (selectedCar) {
        console.log({ selectedCar });
        mapRef.current?.zoomToLocation(selectedCar.location);
        alert.info("Click on the map to rent the car");
      } else {
        alert.error("Please select a car to rent");
      }
    }
  };

  return (
    <div className="px-2">
      <Title level={3}>Cars</Title>
      <Table
        dataSource={allCars}
        rowKey="id"
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        size="small"
        style={{ width: "100%" }}
      />
      <div className="flex justify-center space-x-5 items-center py-5">
        <Button
          type="primary"
          disabled={!selectedCarIdForRent}
          onClick={handleRentCar}
        >
          Rent
        </Button>
        <Button type="primary" disabled={!selectedCarIdForRent}>
          Return
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
