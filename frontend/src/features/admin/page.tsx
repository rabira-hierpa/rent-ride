import React, { useEffect, useState } from "react";
import { getAllUsersApi } from "./apis/admin.api";
import { LoadingSpinner } from "../../shared/ui/spinner/loading.spinner";
import { User } from "../../shared/lib/models";
import { Table } from "antd";

const AdminPage = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsersApi()
      .then((response) => {
        setAllUsers(response);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="flex flex-col justify-center container mx-auto">
      <h1 className="py-2 text-xl font-semibold text-center">User portal</h1>
      <Table
        dataSource={allUsers}
        columns={[
          {
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
        ]}
        rowKey="id"
        pagination={false}
        bordered
      />
    </div>
  );
};

export default AdminPage;
