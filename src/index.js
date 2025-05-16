import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {  RouterProvider } from 'react-router-dom' 
import { router } from './Routes/routes.jsx';
import { Provider } from 'react-redux'
import { store } from './Redux/store.js';
import { ApiProvider } from './Api/apiProvider.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApiProvider>
<Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </ApiProvider>
  
);


reportWebVitals();
