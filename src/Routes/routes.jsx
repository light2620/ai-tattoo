// src/router.js
import { createBrowserRouter, Navigate } from 'react-router-dom';
import UnProtectedRoute from './UnProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute'; // Import AdminRoute
import RoleBasedRedirect from './RoleBasedRedirect';
import App from '../App';

import SignUp from '../Pages/Auth/SignUp';
import SignIn from '../Pages/Auth/SignIn';
import ForgotPassword from '../Pages/Auth/ForgotPassword';
import DashboardLayout from '../Layout/Dashboard/DashboardLayout';
import Home from '../Pages/Dashbaord/Home/Home';
import GenratedImages from '../Pages/Dashbaord/GenratedImages/Genrated-Images';
import User from "../Pages/Dashbaord/Users/User";
import AuthLayout from "../Layout/AuthLayout/AuthLayout";
import ProfilePage from "../Pages/Dashbaord/ProfilePage/Profile";
import NotFound from "../Pages/NotFound/NotFound";
import Plans from '../Pages/Dashbaord/Plans/Plans';
import CreateNewUserPage from '../Components/AddNewUser/CreateNewUserPage';
import Dashboard from '../Pages/Dashbaord/Dashboard';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // --- Authentication Routes ---
      {
        element: <UnProtectedRoute />,
        children: [
          {
            path: "auth",
            element: <AuthLayout />,
            children: [
              { path: "signin", element: <SignIn /> },
              { path: "signup", element: <SignUp /> },
              { path: "forgot-password", element: <ForgotPassword /> }
            ]
          }
        ]
      },

      // --- Protected Application Routes ---
      {
        element: <ProtectedRoute />, // First, ensure user is logged in
        children: [
          {
            // This is the entry point for authenticated users.
            // RoleBasedRedirect will handle where they land based on their role.
            index: true, // Matches the root path ("/") for authenticated users
            element: <RoleBasedRedirect />
          },
          {
            // Routes accessible to ALL authenticated users (admin and normal user)
            // These will be wrapped by DashboardLayout if placed inside it
            element: <DashboardLayout />,
            children: [
              { path: "tattoo-ai", element: <Home /> },
              { path: "generated-images", element: <GenratedImages /> },
              { path: "profile", element: <ProfilePage /> },
              // Add other routes accessible by all logged-in users here
            ]
          },
          {
            // Admin-specific routes, also wrapped by DashboardLayout
            element: <AdminRoute />, // Further protects these routes for admins only
            children: [
              {
                element: <DashboardLayout />, // Ensure admin routes also get the layout
                children: [
                  { path: "dashboard", element: <Dashboard /> }, // Admin's dashboard
                  { path: "users", element: <User /> },
                  { path: "users/new", element: <CreateNewUserPage /> },
                  { path: "plans", element: <Plans /> },
                ]
              }
            ]
          }
        ]
      },

      // --- Not Found Route ---
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);