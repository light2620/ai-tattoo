import React from 'react';
import Logo from '../../Components/Logo';
import { Outlet } from 'react-router-dom';
import './style.css';
import "../../Assets/LoginBg.png"
const AuthLayout = () => {
  return (
    <div className="auth-container">
      <div className="auth-logo">
        <Logo />
      </div>
      <div className="auth-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
