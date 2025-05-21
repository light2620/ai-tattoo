import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom'
import { router } from './Routes/routes.jsx';
import { ApiProvider } from './Api/apiProvider.js';
import Spinner from './utils/Spinner/Spinner';
import store from './Redux/store.js';
import { Provider } from 'react-redux';
import Loader from './utils/Loader/Loader.jsx';
import ChunkErrorBoundary from './Components/ChunkErrorBoundary/ChunkErrorBoundary.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));
window.addEventListener('error', (event) => {
  const isChunkLoadError = event.message && event.message.includes('Loading CSS chunk');

  if (isChunkLoadError) {
    
    window.location.reload();
  }
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
