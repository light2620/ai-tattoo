
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem("Authorization");

  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;