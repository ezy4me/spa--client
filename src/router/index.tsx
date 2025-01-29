// src/routes.js
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import AdminDashboard from '../pages/Admin/Dashboard';
import ManagerDashboard from '../pages/Manager/Dashboard';
import AuthLayout from '../components/Layout/AuthLayout';
import AdminLayout from '../components/Layout/AdminLayout';
import ManagerLayout from '../components/Layout/ManagerLayout';
import Bookings from '../pages/Bookings';
import Payment from '../pages/Payment';
import Inventory from '../pages/Inventory';
import Revenue from '../pages/Revenue';
import Employees from '../pages/Employees';
import Notifications from '../pages/Notifications';

const AppRoutes = () => (
  <Routes>
    {/* Страницы авторизации */}
    <Route
      path="/"
      element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      }
    />

    {/* Администратор */}
    <Route
      path="/admin/*"
      element={
        <AdminLayout>
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/booking" element={<Bookings />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/notification" element={<Notifications />} />
          </Routes>
        </AdminLayout>
      }
    />

    {/* Управляющий */}
    <Route
      path="/manager/*"
      element={
        <ManagerLayout>
          <Routes>
            <Route path="/dashboard" element={<ManagerDashboard />} />
            {/* Добавьте другие страницы управляющего */}
          </Routes>
        </ManagerLayout>
      }
    />
  </Routes>
);

export default AppRoutes;