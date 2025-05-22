// src/utils/Loader/Loader.jsx (or your path)
import React from 'react';
import './style.css'; // We'll create this CSS file
import crownLogo from '../../Assets/logo-single.png'; // Adjust path to your logo

const Loader = () => {
  return (
    <div className="custom-loader-overlay">
      <div className="custom-loader-content">
        <img src={crownLogo} alt="Loading..." className="loader-logo-image" />
       
        <p className="loader-text">Loading...</p>
        
      </div>
    </div>
  );
};

export default Loader;