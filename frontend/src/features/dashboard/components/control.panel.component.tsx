import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Table, Typography, Tag, Button, Form, Input } from "antd";
import { Car, Location } from "../../../types";
import {
  rentCar,
  returnCar,
  selectCarForRent,
  clearMapSelections,
} from "../../../redux/features/cars/carsSlice";
import { MapViewHandle } from "../../../types";
import { alert } from "../../../shared/lib/services";
const { Title } = Typography;

const ControlPanel = ({
  mapRef,
  isReturnCarLoading,
  setIsReturnCarLoading,
}: {
  mapRef: React.RefObject<MapViewHandle>;
  isReturnCarLoading?: boolean;
  setIsReturnCarLoading: (isReturnCarLoading: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const { allCars } = useSelector((state: RootState) => state.cars);
  const selectedCarIdForRent = useSelector(
    (state: RootState) => state.cars.selectedCarIdForRent
  );
  const selectedReturnLocation = useSelector(
    (state: RootState) => state.cars.returnLocation
  );

  const [userForm] = Form.useForm();

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
          selectedCars[selectedCars.length - 1]?.location
        );
      } else {
        dispatch(selectCarForRent([]));
      }
    },
  };

  const handleClearSelection = () => {
    dispatch(clearMapSelections());
  };

  const handleRentCar = () => {
    if (selectedCarIdForRent?.length) {
      const selectedCars = allCars.filter((car) =>
        selectedCarIdForRent?.includes(car.id)
      );
      const isCarRented = selectedCars.filter((car) => !car.availability);
      if (isCarRented.length > 0) {
        alert.error(
          `${isCarRented.length} car${
            isCarRented.length > 1 ? "s" : ""
          } is already rented`
        );
        return;
      }
      const userName = userForm.getFieldValue("userName");
      dispatch(
        rentCar({
          carIds: selectedCarIdForRent,
          userName,
        })
      );
      alert.success(`Dear ${userName} thank you for the rental car`);
      userForm.resetFields();
    }
  };

  const handleReturnCar = () => {
    if (!selectedCarIdForRent?.length) {
      alert.info("Please select a car to return");
      return;
    }

    const isCarAvailable = allCars.filter(
      (car) => selectedCarIdForRent?.includes(car.id) && car.availability
    );

    if (isCarAvailable.length > 0) {
      alert.error(
        `${isCarAvailable.length} car${
          isCarAvailable.length > 1 ? "s" : ""
        } is not rented`
      );
      return;
    }

    setIsReturnCarLoading(true);

    if (selectedReturnLocation) {
      submitReturnCar();
    } else {
      alert.info("Please select a location to return the car");
    }
  };

  const submitReturnCar = () => {
    if (!selectedReturnLocation) {
      alert.info("Please select a location to return the car");
      return;
    }

    dispatch(
      returnCar({
        carIds: selectedCarIdForRent || [],
        location: JSON.stringify(selectedReturnLocation),
      })
    );

    setIsReturnCarLoading(false);
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
          disabled={!selectedCarIdForRent?.length}
          onFinish={handleRentCar}
          initialValues={{
            userName: "",
          }}
        >
          <Form.Item name="userName" label="Name">
            <Input name="userName" required />
          </Form.Item>

          <div className="flex justify-center space-x-5 items-center py-5">
            {isReturnCarLoading ? (
              <>
                <Button
                  type="primary"
                  onClick={submitReturnCar}
                  disabled={!selectedReturnLocation}
                >
                  Confirm Return
                </Button>
                <Button
                  onClick={() => {
                    setIsReturnCarLoading(false);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" htmlType="submit">
                  Rent
                </Button>
                <Button type="primary" onClick={handleReturnCar}>
                  Return
                </Button>
                <Button type="primary" onClick={handleClearSelection}>
                  Clear Selection
                </Button>
              </>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ControlPanel;
