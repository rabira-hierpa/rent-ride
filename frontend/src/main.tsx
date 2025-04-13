import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { LoadingSpinner } from "./shared/ui/spinner/loading.spinner";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

const Dashboard = lazy(() =>
  import("./features/dashboard/page").then((module) => ({
    default: module.default,
  }))
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<LoadingSpinner fullScreen={true} />}>
        <Dashboard />
      </Suspense>
    </Provider>
  </StrictMode>
);
