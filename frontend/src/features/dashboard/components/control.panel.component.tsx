import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Table, Typography, Tag, Button, Form, Input } from "antd";
import { Car, Location } from "../../../types";
import {
  rentCar,
  selectCarForRent,
} from "../../../redux/features/cars/carsSlice";
import { MapViewHandle } from "./map.container.component";
import { useEffect, useMemo, useState } from "react";
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
  // const selectedCarIdForReturn = useSelector(
  //   (state: RootState) => state.cars.setCarIdForReturn
  // );
  const [, setSelectedLocation] = useState<Location | null>(null);
  const [userForm] = Form.useForm();
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.onMapClick((event) => {
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
      render: (bookedAt: string) =>
        bookedAt ? new Date(bookedAt).toLocaleString() : "",
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
    selectedRowKeys: selectedCarIdForRent?.length
      ? [...selectedCarIdForRent]
      : [],
    onChange: (selectedRowKeys: React.Key[], selectedRows: unknown) => {
      const selectedCars = selectedRows as Car[];
      if (selectedCars) {
        dispatch(selectCarForRent(selectedCars.map((car) => car.id)));
        mapRef.current?.zoomToLocation(
          selectedCars[selectedCars.length - 1].location
        );
      } else {
        dispatch(selectCarForRent(null));
      }
    },
  };

  const handleRentCar = () => {
    if (selectedCarIdForRent?.length) {
      dispatch(
        rentCar({
          carIds: selectedCarIdForRent,
          userName: userForm.getFieldValue("userName"),
        })
      );
      userForm.resetFields();
    }
  };

  const handleClearSelection = () => {
    dispatch(selectCarForRent(null));
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

      <div className="flex flex-col ">
        <Form
          className="p-5"
          form={userForm}
          disabled={!selectedCarIdForRent}
          onFinish={handleRentCar}
          initialValues={{
            userName: "",
          }}
        >
          <Form.Item name="userName" label="Name">
            <Input name="userName" required />
          </Form.Item>
          <div className="flex justify-center space-x-5 items-center py-5">
            <Button type="primary" htmlType="submit">
              Rent
            </Button>
            <Button type="primary">Return</Button>
            <Button type="primary" onClick={handleClearSelection}>
              Clear Selection
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ControlPanel;
