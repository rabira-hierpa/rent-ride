/// <reference types="node" />
import "@testing-library/jest-dom";

// Set up environment variables for tests
process.env.VITE_APP_ARCGIS_API_KEY =
  "AAPT3NKHt6i2urmWtqOuugvr9WQ-3kPUVAY3_T-cE04ACA6QtzaKQ1oMq4mcyFaDQom38OfZ6sdEVh5pNG0i11-kPyoesqBVG7DSZw5IiogRwi_gcIb_yGLRMYLHGJUKbrjE9log8cBSAuKel0Pv0a9SDmXa0tjcQ0mlh_gK09nNvHGhYiwQxkOj7svJMhaXZ6YTjUrRoPIpcnGQYYkGZosKhJi31lnWhnN25h-Pf1ranm4.";
process.env.MODE = "test";
process.env.DEV = "true";
process.env.PROD = "false";

// Mock browser APIs needed by ArcGIS
// Create a simple mock for ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
