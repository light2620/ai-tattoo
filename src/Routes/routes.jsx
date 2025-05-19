import { createBrowserRouter } from 'react-router-dom';
import {lazy } from 'react'
import UnProtectedRoute from './UnProtectedRoute';
import ProtectedRoute from './ProtectedRoute';

const App = lazy(() => import('../App'));

const SignUp = lazy(() => import('../Pages/Auth/SignUp'));
const SignIn = lazy(() => import('../Pages/Auth/SignIn'));  
const ForgotPassword = lazy(() => import('../Pages/Auth/ForgotPassword'));
const DashboardLayout = lazy(() => import('../Layout/Dashboard/DashboardLayout'));
const Home = lazy(() => import('../Pages/Dashbaord/Home'));
const GenratedImages = lazy(() => import('../Pages/Dashbaord/GenratedImages/Genrated-Images'));
const User = lazy (() =>  import ("../Pages/Dashbaord/Users/User"))





export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Unprotected routes
      {
        element: <UnProtectedRoute />, 
        children: [
           {
            path: "/",
            element: <SignIn />
          },
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
              },{
                path : "users",
                element : <User />

              }
            ]
          }
        ]
      }
    ]
  }
]);
