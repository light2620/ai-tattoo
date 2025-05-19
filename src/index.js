import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {  RouterProvider } from 'react-router-dom' 
import { router } from './Routes/routes.jsx';
import { ApiProvider } from './Api/apiProvider.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApiProvider>

    <RouterProvider router={router} />

  </ApiProvider>
  
);


reportWebVitals();
