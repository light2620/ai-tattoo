import Logo from './Components/Logo';
import './App.css';
import { UserProvider } from './Context/userContext';
import { Outlet } from 'react-router-dom';
import  { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
function App() {
  const location = useLocation();
 const isDasboard = location.pathname.includes('/dashboard');

  return (
    
    <UserProvider>
        <div>
          <Outlet />
        </div>
      <Toaster />
      </UserProvider>
    
  );
}

export default App;
