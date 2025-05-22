import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom'
import { router } from './Routes/routes.jsx';
import { ApiProvider } from './Api/apiProvider.js';

import store from './Redux/store.js';
import { Provider } from 'react-redux';
import Loader from './utils/Loader/Loader.jsx';
import ChunkErrorBoundary from './Components/ChunkErrorBoundary/ChunkErrorBoundary.jsx';
import { UserProvider } from './Context/userContext';
const root = ReactDOM.createRoot(document.getElementById('root'));

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
root.render(
  <ChunkErrorBoundary>
  <ApiProvider>
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </ApiProvider>
  </ChunkErrorBoundary>
);


reportWebVitals();
