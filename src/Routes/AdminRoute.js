
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../Context/userContext';
import Loader from '../utils/Loader/Loader';
import toast from 'react-hot-toast';


const AdminRoute = () => {
  const { role, authLoading, isLoggedIn } = useUser(); // Use authLoading here

  if (authLoading) {
    return (
      <Loader />
    );
  }

  if (!isLoggedIn) { // Should be caught by ProtectedRoute, but good for safety
    return <Navigate to="/auth/signin" replace />;
  }

  if (role === 'admin') {
    return <Outlet />;
  } else {
    // User is logged in but not an admin
    toast.error("Access denied: You do not have admin privileges."); // Optional feedback
    return <Navigate to="/tattoo-ai" replace />; // Or to a specific 'unauthorized' page
  }
};

export default AdminRoute;