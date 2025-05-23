// src/router.js
import React, { lazy, Suspense } from 'react'; // Import lazy and Suspense if needed for specific fallbacks here
import { createBrowserRouter, Navigate } from 'react-router-dom';

// --- Layouts & Higher-Order Components (usually not lazy-loaded if they are core structure) ---
import App from '../App';
import UnProtectedRoute from './UnProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import RoleBasedRedirect from './RoleBasedRedirect';
import AuthLayout from "../Layout/AuthLayout/AuthLayout";
// DashboardLayout can be lazy-loaded if it's substantial
const DashboardLayout = lazy(() => import('../Layout/Dashboard/DashboardLayout'));

// --- Page Components (Ideal candidates for lazy loading) ---
const SignIn = lazy(() => import('../Pages/Auth/SignIn'));
const SignUp = lazy(() => import('../Pages/Auth/SignUp'));
const ForgotPassword = lazy(() => import('../Pages/Auth/ForgotPassword'));

const Dashboard = lazy(() => import('../Pages/Dashbaord/Dashboard'));
const Home = lazy(() => import('../Pages/Dashbaord/Home/Home')); // Tattoo AI
const GenratedImages = lazy(() => import('../Pages/Dashbaord/GenratedImages/Genrated-Images'));
const User = lazy(() => import("../Pages/Dashbaord/Users/User"));
const ProfilePage = lazy(() => import("../Pages/Dashbaord/ProfilePage/Profile"));
const Plans = lazy(() => import('../Pages/Dashbaord/Plans/Plans'));
const CreateNewUserPage = lazy(() => import('../Components/AddNewUser/CreateNewUserPage')); 
const ManagePlansPage = lazy(() => import('../Pages/Dashbaord/ManagePlans/ManagePlansPage'))

const NotFound = lazy(() => import("../Pages/NotFound/NotFound"));


// --- Your Suspense Fallback Loader (if you want a different one than main.jsx for specific routes) ---
// import Loader from '../utils/Loader/Loader'; // Path to your loader component
// const RouteSuspenseFallback = <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader /></div>;


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is usually not lazy-loaded as it's the root shell
    children: [
      // --- Authentication Routes ---
      {
        element: <UnProtectedRoute />,
        children: [
          {
            path: "auth",
            element: <AuthLayout />, // AuthLayout might not need lazy loading if simple
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
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <RoleBasedRedirect /> // Handles initial redirect logic
          },
          {
            // Routes accessible to ALL authenticated users
            element: <DashboardLayout />, // Lazy-loaded layout
            children: [
              { path: "tattoo-ai", element: <Home /> },
              { path: "generated-images", element: <GenratedImages /> },
              { path: "profile", element: <ProfilePage /> },
              {path: "manage-plans", element: <ManagePlansPage/>}
            ]
          },
          {
            // Admin-specific routes
            element: <AdminRoute />,
            children: [
              {
                element: <DashboardLayout />, // Lazy-loaded layout again for admin section
                children: [
                  { path: "dashboard", element: <Dashboard /> },
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