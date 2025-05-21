import { FaHome } from 'react-icons/fa';
import { IoImagesOutline } from 'react-icons/io5';
import { FiUsers } from "react-icons/fi";
import { IoPricetagsOutline } from "react-icons/io5";
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
  },{
    name : "Plans",
    icon : IoPricetagsOutline,
    path : "plans",
    adminOnly : true
  }
];

export default sidebarItems;
