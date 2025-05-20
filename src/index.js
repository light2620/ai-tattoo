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
const root = ReactDOM.createRoot(document.getElementById('root'));
window.addEventListener('error', (event) => {
  const isChunkLoadError = event.message && event.message.includes('Loading CSS chunk');

  if (isChunkLoadError) {
    
    window.location.reload();
  }
});
root.render(
  <ApiProvider>
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </ApiProvider>
);


reportWebVitals();
