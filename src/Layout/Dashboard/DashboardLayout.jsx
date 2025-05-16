import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './style.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
