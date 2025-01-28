// src/router/index.tsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Home from '../pages/Home';
import Bookings from '../pages/Bookings';
import Stock from '../pages/Stock';
import Revenue from '../pages/Revenue';
import Notifications from '../pages/Notifications';
import Employees from '../pages/Employees';
import Admin from '../pages/Admin';

const RouterConfig: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/bookings" element={<Layout><Bookings /></Layout>} />
        <Route path="/stock" element={<Layout><Stock /></Layout>} />
        <Route path="/revenue" element={<Layout><Revenue /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/employees" element={<Layout><Employees /></Layout>} />
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterConfig;
