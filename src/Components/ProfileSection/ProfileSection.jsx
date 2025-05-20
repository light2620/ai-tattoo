import React, { useState, useRef, useEffect } from 'react';
import { FaLink } from 'react-icons/fa';
import './Style.css';
import { useUser } from '../../Context/userContext';
import { Link } from 'react-router-dom';
const ProfileSection = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {logout} = useUser();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-section" ref={dropdownRef}>
      <div className="profile-circle" onClick={() => setOpen(!open)}>
        SN
      </div>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-item">
            <FaLink className="icon" />
            <Link to={"profile"}>Shivam Negi</Link>
          </div>
          <div 
          onClick={logout}
          className="profile-item logout">Logout</div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
