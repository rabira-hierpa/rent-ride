import React from "react";
import { Button as AntButton } from "antd";

const Button = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Welcome to Ant Design with Tailwind!
      </h1>
      <AntButton
        type="primary"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={onClick}
      >
        Ant Design Button
      </AntButton>
    </div>
  );
};

export default Button;
