import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';
import sidebarItems from '../../utils/Sidebar';

const Sidebar = () => {
  const location = useLocation();

  const isActiveTab = (path) => {
    if (path === 'home') {
  
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/home';
    }
    return location.pathname === `/dashboard/${path}`;
  };

  return (
    <div className="sidebar">
      {sidebarItems.map(({ name, icon: Icon, path }) => (
        <Link
          to={`/dashboard/${path}`}
          key={name}
          className={`nav-link ${isActiveTab(path) ? 'active' : ''}`}
        >
          <Icon className="nav-icon" />
          <span className="title">{name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
