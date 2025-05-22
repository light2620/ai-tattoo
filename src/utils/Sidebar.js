// src/utils/Sidebar.js
import { FaHome, FaTachometerAlt } from 'react-icons/fa';
import { IoImagesOutline } from 'react-icons/io5';
import { FiUsers } from "react-icons/fi";
import { IoPricetagsOutline } from "react-icons/io5";

const sidebarItems = [
  {
    name: 'Dashboard',
    icon: FaTachometerAlt,
    path: '/dashboard', // Direct path to the dashboard
    adminOnly: true
  },
  {
    name: 'Tattoo AI',
    icon: FaHome, 
    path: '/tattoo-ai', 
  },
  {
    name: 'Generated Images',
    path: '/generated-images', 
    icon: IoImagesOutline,
  },
  {
    name: "Users",
    icon: FiUsers,
    path: '/users', 
    adminOnly: true
  },
  {
    name: "Plans",
    icon: IoPricetagsOutline,
    path: "/plans", 
    adminOnly: true
  }
];

export default sidebarItems;