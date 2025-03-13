import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import ManagerDashboard from "../pages/Manager/Dashboard";
import AuthLayout from "../components/Layout/AuthLayout";
import AdminLayout from "../components/Layout/AdminLayout";
import ManagerLayout from "../components/Layout/ManagerLayout";
import Bookings from "../pages/Bookings";
import Payment from "../pages/Payment";
import Inventory from "../pages/Inventory";
import Employees from "../pages/Employees";
import Notifications from "../pages/Notifications";
import Clients from "../pages/Clients";
import ProtectedRoute from "../components/ProtectedRoute";
import Revenue from "../pages/Revenue";
import ShiftTracking from "../pages/ShiftTracking";
import Category from "../pages/Category";
import Rooms from "../pages/Rooms";

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      }
    />

    <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
      <Route
        path="/admin/*"
        element={
          <AdminLayout>
            <Routes>
              <Route path="" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="booking" element={<Bookings />} />
              <Route path="client" element={<Clients />} />
              <Route path="payment" element={<Payment />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="category" element={<Category />} />
              <Route path="room" element={<Rooms />} />
              {/* <Route path="location" element={<Locations />} /> */}
              <Route path="shift" element={<ShiftTracking />} />
            </Routes>
          </AdminLayout>
        }
      />
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
      <Route
        path="/manager/*"
        element={
          <ManagerLayout>
            <Routes>
              <Route path="" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="booking" element={<Bookings />} />
              <Route path="client" element={<Clients />} />
              <Route path="payment" element={<Payment />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="category" element={<Category />} />
              <Route path="category" element={<Category />} />
              <Route path="revenue" element={<Revenue />} />
              <Route path="employees" element={<Employees />} />
              <Route path="notification" element={<Notifications />} />
            </Routes>
          </ManagerLayout>
        }
      />
    </Route>
  </Routes>
);

export default AppRoutes;
