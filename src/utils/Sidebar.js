// src/utils/Sidebar.js
import { FaHome, FaTachometerAlt } from 'react-icons/fa';
import { IoImagesOutline } from 'react-icons/io5';
import { FiUsers } from "react-icons/fi";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdOutlineManageHistory } from "react-icons/md"; // Added icon for Manage Plans

const sidebarItems = [
  {
    name: 'Dashboard',
    icon: FaTachometerAlt,
    path: '/dashboard',
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
    name: "Plans", // This was previously "Plans", assuming it's for creating/viewing all plans
    icon: IoPricetagsOutline,
    path: "/plans",
    adminOnly: true
  },
  { // New Item
    name: "Manage Plans",
    icon: MdOutlineManageHistory, // Or any other icon you prefer
    path: "/manage-plans",
    adminOnly: true
  }
];

export default sidebarItems;