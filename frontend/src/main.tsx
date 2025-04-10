import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css"; // For Ant Design v5+
import { AuthProvider } from "./shared/context/auth.context.tsx";
import { LoadingSpinner } from "./shared/ui/spinner/loading.spinner.tsx";
import AppRoutes from "./app.routes.tsx";
import { BrowserRouter } from "react-router-dom";
import { environment } from "./environments/environment.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider environment={environment}>
        <Suspense fallback={<LoadingSpinner fullScreen={true} />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
