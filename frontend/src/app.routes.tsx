import React, { useContext } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./index.css";
import AccountPage from "./features/account";

import { LoadingSpinner } from "./shared/ui/spinner/loading.spinner";
import { AuthContext } from "./shared/context/auth.context";
import AppLayout from "./shared/layout/app.layout";

const DashboardPage = React.lazy(() => import("./features/dashboard/page"));
const AdminPage = React.lazy(() => import("./features/admin/page"));
interface AuthenticatedRouteProps {
  component: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  component,
}) => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  return auth.isAuthenticated && auth.isAuthenticated() ? (
    <AppLayout>{component}</AppLayout>
  ) : (
    <Navigate to="/account/login" state={{ from: location.pathname }} />
  );
};

const AdminRoute: React.FC<AuthenticatedRouteProps> = ({ component }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  return auth.isAuthenticated &&
    auth.isAuthenticated() &&
    auth.isAdmin &&
    auth.isAdmin() ? (
    <AppLayout>{component}</AppLayout>
  ) : (
    <Navigate to="/account/login" state={{ from: location.pathname }} />
  );
};

export function AppRoutes() {
  const auth = useContext(AuthContext);

  if (auth?.loading) {
    return <LoadingSpinner fullScreen={true} />;
  }
  return (
    <Routes>
      <Route path="/account/*" element={<AccountPage />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route
        path="/dashboard"
        element={<AuthenticatedRoute component={<DashboardPage />} />}
      />
      <Route path="/admin" element={<AdminRoute component={<AdminPage />} />} />
    </Routes>
  );
}

export default AppRoutes;
