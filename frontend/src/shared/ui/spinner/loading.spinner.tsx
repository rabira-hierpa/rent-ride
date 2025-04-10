import { Spin } from "antd";
import React from "react";

enum SpinnerSize {
  LARGE = "large",
  DEFAULT = "default",
  SMALL = "small",
}

interface ILoadingSpinner {
  spinnerSize?: SpinnerSize;
  message?: string;
  fullScreen?: boolean;
  background?: string;
}

export const LoadingSpinner: React.FC<ILoadingSpinner> = ({
  spinnerSize = SpinnerSize.LARGE,
  message = "",
  fullScreen = false,
  background,
}) => {
  return (
    <div
      className={
        fullScreen
          ? "min-h-screen w-full grid place-content-center mx-auto"
          : ""
      }
      style={{
        background: background || "",
      }}
    >
      <div className="flex space-y-1 flex-col items-center justify-center">
        <Spin size={spinnerSize} />
        <div>Loading {message}</div>
      </div>
    </div>
  );
};
