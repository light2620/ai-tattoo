// src/Components/UnProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const UnProtectedRoute = () => {
  const token = localStorage.getItem("Authorization");

  return token ? <Navigate to="/" /> : <Outlet />;
  
};

export default UnProtectedRoute;
