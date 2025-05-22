
import './App.css';
import { UserProvider } from './Context/userContext';
import { Outlet } from 'react-router-dom';
import  { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useUser } from './Context/userContext';
function App() {

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
