// src/Components/Sidebar/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';
import sidebarItemsData from '../../utils/Sidebar';
import { useUser } from '../../Context/userContext';
import Logo from '../Logo'; // Assuming path is correct
import { useSelector } from 'react-redux';
// Optional: Import an icon for credits if you have one
// import { FaCoins } from 'react-icons/fa';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { user } = useUser(); // Get the full user object
  const role = user?.role; // Safely access role
  const totalCredits = useSelector((state) => state.credits.credits);

  const isActiveTab = (itemPath) => {
    if (location.pathname === itemPath) {
      return true;
    }
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
              to={path}
              key={name}
              className={`nav-link ${isActiveTab(path) ? 'active' : ''}`}
              onClick={onClose}
            >
              { Icon && <Icon className="nav-icon" /> }
              <span className="nav-item-title">{name}</span>
            </Link>
          ))}
      </nav>

      {/* Credits Section Added */}
      <div className="sidebar-credits-section">
        {/* <FaCoins className="credits-icon" />  */}
        {/* Uncomment if you have an icon */}
        <span className="credits-label">Credits Left:</span>
        <span className="credits-value">{totalCredits ?? 'N/A'}</span>
      </div>
    </div>
  );
};

export default Sidebar;