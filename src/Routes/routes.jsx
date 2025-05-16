import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import SignUp from '../Pages/Auth/SignUp';
import SignIn from '../Pages/Auth/SignIn';
import ForgotPassword from '../Pages/Auth/ForgotPassword';
import DashboardLayout from '../Layout/Dashboard/DashboardLayout';
import Home from '../Pages/Dashbaord/Home';
import UnProtectedRoute from './UnProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
import GenratedImages from '../Pages/Dashbaord/GenratedImages/Genrated-Images';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Unprotected routes
      {
        element: <UnProtectedRoute />, // 👈 wrapper
        children: [
          {
            path: "signin",
            element: <SignIn />
          },
          {
            path: "signup",
            element: <SignUp />
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />
          },
        ]
      },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              {
                path: "home",
                element: <Home />
              },
              {
                path: "",
                element: <Home />
              },{
                path : "generated-images",
                element : <GenratedImages />
              }
            ]
          }
        ]
      }
    ]
  }
]);
