
import './App.css';
import { UserProvider } from './Context/userContext';
import { Outlet } from 'react-router-dom';
import  { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useUser } from './Context/userContext';
function App() {
window.addEventListener('error', (event) => {
  const message = event.message || '';
  const target = event.target || {};

  // Check for common chunk load error patterns
  const isChunkLoadError =
    message.includes('Loading chunk ') || // Webpack JS chunks
    message.includes('Loading CSS chunk') || // Webpack CSS chunks
    (target.tagName === 'SCRIPT' && target.src && !document.querySelector(`script[src="${target.src}"]`)); // Script tag failed to load

  if (isChunkLoadError) {
    console.warn('Chunk load error detected, attempting reload:', event);
    // Optionally, try to reload only once to prevent reload loops
    if (!sessionStorage.getItem('chunk_reload_attempted')) {
      sessionStorage.setItem('chunk_reload_attempted', 'true');
      window.location.reload();
    } else {
      console.error('Chunk load error persists after reload attempt.');
      // Display a persistent error message to the user here if needed
    }
  }
});

// Clear the flag when the page successfully loads
window.addEventListener('load', () => {
  sessionStorage.removeItem('chunk_reload_attempted');
});
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
