import { Spin } from "antd/es";
import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ConfirmationPage from "./components/comfirmation.component";
import ForgotPassword from "./components/forgot.password.component";
import ResetPassword from "./components/reset.password.component";

const LoginPage = lazy(() => import("./components/login.component"));
const RegisterPage = lazy(() => import("./components/register.component"));

function AccountPage() {
  return (
    <div>
      <div className="flex my-8 justify-center">
        <span>Fullstack Auth</span>
      </div>
      <div
        style={{
          boxShadow: "0px 1px 3px rgba(18, 62, 119, 0.15)",
          borderRadius: "8px",
          border: "0.5px solid #E5E7EB",
          width: "520px",
          minHeight: "477.06px",
        }}
        className="bg-white p-8 pt-6 pb-6 flex flex-col mx-auto mb-8"
      >
        <Suspense fallback={<Spin />}>
          <Routes>
            <Route path="/" element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="activate/:id/:token" element={<ConfirmationPage />} />
            <Route path="forgot/:type?" element={<ForgotPassword />} />
            <Route
              path="forgotPassword/:id/:token"
              element={<ResetPassword />}
            />
            <Route
              path="resetPassword/:id/:token"
              element={<ResetPassword />}
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default AccountPage;
