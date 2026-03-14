import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import DeliveryLogin from "../DeliveryPages/DeliveryLogin";
import { useAuth } from "../AuthContext";

/* ===============================
   Super-Admin only protection
================================ */
const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, userType } = useAuth();

  // Not logged in → go to delivery login
  if (!isAuthenticated) {
    return <Navigate to="/delivery/login" replace />;
  }

  // Logged in but not Super-Admin → blocked
  if (userType !== "Super-Admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

/* ===============================
   Login page guard
================================ */
const DeliveryLoginGuard = ({ children }) => {
  const { isAuthenticated, userType } = useAuth();

  // Logged in Super-Admin → allow (or redirect to dashboard later)
  if (isAuthenticated && userType === "Super-Admin") {
    return children;
  }

  // Logged in but wrong role → blocked
  if (isAuthenticated && userType !== "Super-Admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Not logged in → allow login
  return children;
};

/* ===============================
   Routes
================================ */
export default function DeliveryRoutes() {
  return (
    <Routes>
      {/* Super-Admin login ONLY */}
      <Route
        path="login"
        element={
          <DeliveryLoginGuard>
            <DeliveryLogin />
          </DeliveryLoginGuard>
        }
      />

      {/* Everything else under /delivery */}
      <Route
        element={
          <SuperAdminRoute>
            <Outlet />
          </SuperAdminRoute>
        }
      >
        {/* future pages */}
        {/* <Route path="dashboard" element={<DeliveryDashboard />} /> */}
        {/* <Route path="orders" element={<DeliveryOrders />} /> */}

        {/* Catch-all */}
        <Route
          path="*"
          element={<div>404 – This page is not available</div>}
        />
      </Route>
    </Routes>
  );
}
