import { createBrowserRouter } from 'react-router-dom';
import UnProtectedRoute from './UnProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
import App from '../App';

import SignUp from '../Pages/Auth/SignUp';
import SignIn from '../Pages/Auth/SignIn';
import ForgotPassword from '../Pages/Auth/ForgotPassword';
import DashboardLayout from '../Layout/Dashboard/DashboardLayout';
import Home from '../Pages/Dashbaord/Home';
import GenratedImages from '../Pages/Dashbaord/GenratedImages/Genrated-Images';
import User from "../Pages/Dashbaord/Users/User";
import AuthLayout from "../Layout/AuthLayout/AuthLayout";
import ProfilePage from "../Pages/Dashbaord/ProfilePage/Profile";
import NotFound from "../Pages/NotFound/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <UnProtectedRoute />,
        children: [
          {
            path: "",
            element: <AuthLayout />,
            children: [
              { path: "/", element: <SignIn /> },
              { path: "signin", element: <SignIn /> },
              { path: "signup", element: <SignUp /> },
              { path: "forgot-password", element: <ForgotPassword /> }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              { path: "home", element: <Home /> },
              { path: "", element: <Home /> },
              { path: "generated-images", element: <GenratedImages /> },
              { path: "users", element: <User /> },
              { path: "profile", element: <ProfilePage /> }
            ]
          }
        ]
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);
