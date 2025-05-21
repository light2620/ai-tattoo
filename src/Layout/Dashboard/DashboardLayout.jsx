import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Navbar from '../../Components/Navbar/Navbar';
import { useMobile } from '../../hooks/useMobile';
import MobileSideBar from '../../Components/MobileSideBar/MobileSideBar';
import './style.css';

const DashboardLayout = () => {
  const isMobile = useMobile(768);
  const [mobileSidebar, setMobileSidebar] = useState(false); // default closed

  const toggleMobileSidebar = () => {
    setMobileSidebar(prev => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebar(false);
  };

  return (
    <div className="dashboard-container">
  
      {!isMobile && <Sidebar />}

      <div className="right-side" style={{ flex: 1 }}>
        <Navbar onToggleSidebar={toggleMobileSidebar} />


        {isMobile && mobileSidebar && (
          <MobileSideBar onClose={closeMobileSidebar} />
        )}

        <div className="dashboard-content" style={{ pointerEvents: mobileSidebar ? 'none' : 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
