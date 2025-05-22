
import React from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '../utils/Spinner/Spinner';
import { useUser } from '../Context/userContext';
const RoleBasedRedirect = () => {
  const { role, loading: userContextLoading } = useUser();

  if (userContextLoading) {

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  if (role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  } else if (role === 'user') { 
    return <Navigate to="/tattoo-ai" replace />;
  } else {
    return <Navigate to="/auth/signin" replace />;
  }
};

export default RoleBasedRedirect;