
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem("Authorization");

  return token ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default ProtectedRoute;