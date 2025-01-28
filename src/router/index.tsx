import { Routes, Route } from "react-router";
import App from "../App.tsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  );
};

export default AppRoutes;
