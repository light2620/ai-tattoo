import React from 'react';
import './style.css'; // style it appropriately
import Sidebar from "../Sidebar/Sidebar"
const MobileSideBar = ({ onClose }) => {
  return (
    <>
      <div className="mobile-sidebar-overlay" onClick={onClose} />

      <aside className="mobile-sidebar">
       <Sidebar />
      </aside>
    </>
  );
};

export default MobileSideBar;
