import React from "react";
import { Routes, Route } from "react-router";
import Stock from "../pages/Inventory";

const StockLayout = () => {
  return (
    <div>
      <h2>Stock Layout</h2>
      <Routes>
        <Route path="/" element={<Stock />} />
        {/* Добавить вложенные страницы по необходимости */}
      </Routes>
    </div>
  );
};

export default StockLayout;
