import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';
import sidebarItems from '../../utils/Sidebar';
import { useUser } from '../../Context/userContext';
import Logo from '../Logo';

const Sidebar = ({onClose}) => {
  const location = useLocation();
  const { role } = useUser();

  const isActiveTab = (path) => {
    if (path === 'home') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/home';
    }
    return location.pathname === `/dashboard/${path}`;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Logo />
      </div>

     {sidebarItems
  .filter(item => !item.adminOnly || role === 'admin') 
  .map(({ name, icon: Icon, path }) => (
    <Link
      to={`/dashboard/${path}`}
      key={name}
      className={`nav-link ${isActiveTab(path) ? 'active' : ''}`
      }
    >
      <Icon className="nav-icon" />
      <span className="title">{name}</span>
    </Link>
  ))
}
    </div>
  );
};

export default Sidebar;
