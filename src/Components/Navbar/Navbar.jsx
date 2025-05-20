import React from 'react';
import Logo from '../Logo';
import './style.css';
import { useMobile } from '../../hooks/useMobile';
import ProfileSection from '../ProfileSection/ProfileSection';
const Navbar = ({ onToggleSidebar }) => {
  const isMobile = useMobile();

  return (
    <nav className="navbar">
      {/* Burger icon - only on mobile */}
      {isMobile && (
        <div
          className="burger-menu"
          onClick={onToggleSidebar}
          role="button"
          tabIndex={0}
          aria-label="Toggle sidebar"
        >
          &#9776;
        </div>
      )}

      {/* Logo - only on mobile */}
      {isMobile && (
        <div className="navbar-logo">
          <Logo />
        </div>
      )}

      {/* Profile - always visible */}
      <div className="navbar-profile">
        <ProfileSection />
      </div>
    </nav>
  );
};

export default Navbar;
