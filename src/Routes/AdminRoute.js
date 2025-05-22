
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../Context/userContext';
import Spinner from '../utils/Spinner/Spinner';

const AdminRoute = () => {
  const { role, loading: userContextLoading } = useUser();

  if (userContextLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  if (role === 'admin') {
    return <Outlet />;
  } else {
    return <Navigate to="/tattoo-ai" replace />;
  }
};

export default AdminRoute;