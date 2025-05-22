// src/router.js (or your path)
import { createBrowserRouter, Navigate } from 'react-router-dom';
import UnProtectedRoute from './UnProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
import App from '../App'; // Main App component, might just be an empty Outlet wrapper if all logic is in layouts

import SignUp from '../Pages/Auth/SignUp';
import SignIn from '../Pages/Auth/SignIn';
import ForgotPassword from '../Pages/Auth/ForgotPassword';
import DashboardLayout from '../Layout/Dashboard/DashboardLayout'; // Your layout with Sidebar & TopBar
import Home from '../Pages/Dashbaord/Home/Home'; // This is your 'Tattoo AI' page component
import GenratedImages from '../Pages/Dashbaord/GenratedImages/Genrated-Images';
import User from "../Pages/Dashbaord/Users/User";
import AuthLayout from "../Layout/AuthLayout/AuthLayout";
import ProfilePage from "../Pages/Dashbaord/ProfilePage/Profile"; // Assuming you have a profile page
import NotFound from "../Pages/NotFound/NotFound";
import Plans from '../Pages/Dashbaord/Plans/Plans';
import CreateNewUserPage from '../Components/AddNewUser/CreateNewUserPage';
import Dashboard from '../Pages/Dashbaord/Dashboard'; // Your main Dashboard component

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App can be a simple <Outlet /> if layouts handle everything
    children: [
      // --- Authentication Routes (Outside Dashboard Layout) ---
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

      // --- Protected Application Routes (Inside Dashboard Layout) ---
      {
        element: <ProtectedRoute />, // Ensures user is authenticated
        children: [
          {
            element: <DashboardLayout />, // All these routes will have the sidebar & top bar
            children: [
              // Redirect root of protected area and /dashboard to your main Dashboard component
              { index: true, element: <Navigate to="/dashboard" replace /> }, // Handles '/' when authenticated
              { path: "dashboard", element: <Dashboard /> }, // Main dashboard view

              { path: "tattoo-ai", element: <Home /> }, // Tattoo AI page
              { path: "generated-images", element: <GenratedImages /> },
              { path: "users", element: <User /> },
              { path: "users/new", element: <CreateNewUserPage /> },
              { path: "plans", element: <Plans /> },
              { path: "profile", element: <ProfilePage /> }, // Example for a profile page
              // Add other top-level routes that need the dashboard layout here
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