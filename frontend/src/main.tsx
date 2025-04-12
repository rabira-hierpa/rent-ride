import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Global styles
import "antd/dist/reset.css"; // Ant Design reset
import DashboardPage from "./features/dashboard/page";
import { store } from "./redux/store"; // Import the store
import { Provider } from "react-redux"; // Import the Provider

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <DashboardPage />
    </Provider>
  </StrictMode>
);
