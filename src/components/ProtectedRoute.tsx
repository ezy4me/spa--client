import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface ProtectedRouteProps {
  allowedRoles: string[]; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole!)) {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;
