import { FaHome } from 'react-icons/fa';
import { IoImagesOutline } from 'react-icons/io5';
import { FiUsers } from "react-icons/fi";
const sidebarItems = [
  {
    name: 'Home',
    icon: FaHome,
    path: 'home',
   
  },
  {
    name: 'Generated Images',
    path: 'generated-images',
    icon: IoImagesOutline,
    
  },
  {
    name : "Users",
    icon: FiUsers,
    path: 'users',
     adminOnly: true
    
  }
];

export default sidebarItems;
