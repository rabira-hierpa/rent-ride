import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Global styles
import "antd/dist/reset.css"; // Ant Design reset
// import App from './App'; // Remove old App import
import Dashboard from "./features/dashboard/components/Dashboard"; // Import the new Dashboard component

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    {/* <App /> */}
    <Dashboard /> {/* Render the Dashboard */}
  </StrictMode>
);
