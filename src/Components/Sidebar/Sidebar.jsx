// src/Components/Sidebar/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';
import sidebarItemsData from '../../utils/Sidebar';
import { useUser } from '../../Context/userContext';
import Logo from '../Logo'; // Assuming path is correct

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { role } = useUser();

  const isActiveTab = (itemPath) => {
    // For exact matches (like /dashboard or /tattoo-ai)
    if (location.pathname === itemPath) {
      return true;
    }
    // For paths that might have sub-routes (like /users and /users/new)
    // ensure itemPath is not just '/' to avoid matching everything.
    if (itemPath !== '/' && location.pathname.startsWith(itemPath + '/')) {
        return true;
    }
   
    if (itemPath === '/dashboard' && location.pathname === '/') {
        return true;
    }
    return false;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo-section">
        <Logo />
      </div>

      <nav className="sidebar-navigation">
        {sidebarItemsData
          .filter(item => !item.adminOnly || role === 'admin')
          .map(({ name, icon: Icon, path }) => (
            <Link
              to={path} // Use the direct path from sidebarItemsData
              key={name}
              className={`nav-link ${isActiveTab(path) ? 'active' : ''}`}
              onClick={onClose}
            >
              { Icon && <Icon className="nav-icon" /> }
              <span className="nav-item-title">{name}</span>
            </Link>
          ))}
      </nav>
    </div>
  );
};

export default Sidebar;