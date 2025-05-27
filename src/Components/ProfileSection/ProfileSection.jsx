import React, { useState, useRef, useEffect } from 'react';
import { FaLink } from 'react-icons/fa';
import './Style.css'; // Make sure this path is correct and the file exists
import { useUser } from '../../Context/userContext';
import { Link } from 'react-router-dom';

const ProfileSection = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, user } = useUser();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper function to get initials
  const getInitials = (name) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      // Fallback if name is not available or empty
      if (user && user.email && typeof user.email === 'string' && user.email.length > 0) {
        return user.email[0].toUpperCase(); // Use first letter of email
      }
      return 'P'; // Default to 'P' for Profile or 'U' for User
    }
    const nameParts = name.trim().split(/\s+/); // Split by one or more spaces
    if (nameParts.length > 1 && nameParts[0] && nameParts[nameParts.length -1]) {
      // Ensure both first and last parts exist before trying to get charAt(0)
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length > 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length === 1) {
      return nameParts[0][0].toUpperCase();
    }
    // Fallback if parsing somehow failed (e.g., name was only spaces)
    if (user && user.email && typeof user.email === 'string' && user.email.length > 0) {
        return user.email[0].toUpperCase();
    }
    return 'P';
  };

  // Determine the initials and display name to use
  // Provide default values if user or user.displayName is not yet available
  const initials = user ? getInitials(user.displayName) : 'P'; // Default to 'P' if user is null
  const displayName = user && user.displayName ? user.displayName : 'My Profile';

  return (
    <div className="profile-section" ref={dropdownRef}>
      <div className="profile-circle" onClick={() => setOpen(!open)}>
        {initials}
      </div>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-item">
            <FaLink className="icon" />
            {/* Link to a dynamic profile page if needed, or keep "profile" generic */}
            <Link to={"/profile"}>{displayName}</Link> {/* Ensure Link `to` is appropriate */}
          </div>
          {/* The empty div was here, I've removed it as it served no purpose */}
          <div
            onClick={() => {
              logout();
              setOpen(false); // Close dropdown on logout
            }}
            className="profile-item logout"
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;