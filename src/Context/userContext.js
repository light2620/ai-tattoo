import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useApi } from "../Api/apiProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from 'jwt-decode';
import { getUserDetails } from "../Api/getUserDataApi"; // Ensure this path is correct
import { useDispatch } from "react-redux";
import { setImages, setImageLoading } from "../Redux/ImagesSlice"; // Ensure these paths are correct
import { setCredits } from "../Redux/creditSlice";  
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { post } = useApi();
  const [operationLoading, setOperationLoading] = useState(false); // For login, signup, etc. UI feedback
  const [authLoading, setAuthLoading] = useState(true); // For initial auth check & user data fetch
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const performLogout = useCallback(() => {
    localStorage.removeItem('Authorization');
    setUser(null);
    setRole("");
    setIsLoggedIn(false);
    // dispatch(clearImages()); // Optional: clear images from redux on logout
    if (window.location.pathname !== "/auth/signin") { // Avoid navigation loop
      navigate("/auth/signin", { replace: true });
    }
  }, [navigate, dispatch]);


  // Effect for initial authentication check and user data fetching
  useEffect(() => {
    const initializeAuth = async () => {
      setAuthLoading(true);
      const token = localStorage.getItem("Authorization");

      if (!token) {
        performLogout(); // Ensures state is clean if no token
        setAuthLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          toast.error("Session expired. Please login again.");
          performLogout();
          setAuthLoading(false);
          return;
        }
        
       
        if (decoded.role) setRole(decoded.role); 


        const userData = await getUserDetails(dispatch, post, setImageLoading); 
  
        if (userData) {
          setUser(userData);
          setRole(userData.role); // This is the authoritative role
          setIsLoggedIn(true);
          dispatch(setImages(userData.generateImages || []));
          dispatch(setCredits(userData.creditScore || 0));
        } else {
          console.error("Failed to fetch user details despite valid token.");
          toast.error("Could not verify user. Logging out.");
          performLogout();
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        toast.error("Authentication error. Please login again.");
        performLogout();
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();

  }, [dispatch, post, performLogout]); 


  const login = async (credentials, setCredentials) => {
    try {
      setOperationLoading(true);
      const response = await post("https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/signinUser", credentials);

      if (response.status === 200 && response.data.idToken) {
        const token = response.data.idToken;
        localStorage.setItem('Authorization', token);

       
        setAuthLoading(true); 
        const userData = await getUserDetails(dispatch, post, setImageLoading);
        if (userData) {
          setUser(userData);
          setRole(userData.role);
          setIsLoggedIn(true);
          dispatch(setImages(userData.generateImages || []));
          dispatch(setCredits(userData.creditScore || 0));
          setCredentials({ email: "", password: "" });
          toast.success("Login successful");
          
          // Determine redirect path after role is set
          if (userData.role === 'admin') {
            navigate("/dashboard", { replace: true });
          } else if (userData.role === 'user') {
            navigate("/tattoo-ai", { replace: true });
          } else {
            navigate("/", { replace: true }); // Fallback, or handle as error
          }
        } else {
          toast.error("Login succeeded but failed to fetch user details.");
          performLogout(); // Clean up
        }
        setAuthLoading(false);
      } else {
        
        toast.error(response.data?.error || "Login failed. Invalid response from server.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setOperationLoading(false);
    }
  };

  const logout = () => { 
    performLogout();
    toast.success("Logged out successfully.");
  };

  const resetPassword = async (credentials, setCredentials) => {
    try {
      setOperationLoading(true);
      const response = await post("https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/forgotPassword", credentials);

      if (response.status === 200) {
        toast.success(response.data.message);
        setCredentials({ email: "" });
        navigate("/auth/signin", { replace: true });
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "Password reset failed.");
    } finally {
      setOperationLoading(false);
    }
  };

  const register = async (credentials, setCredentials) => {
    try {
      setOperationLoading(true);
      const response = await post("https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/signupUser", credentials);

      if (response.data?.result?.success) {
        setCredentials({ email: "", password: "" });
        toast.success(response.data?.message || "Registration successful! Please sign in.");
        navigate("/auth/signin", { replace: true });
      } else {
        toast.error(response.data?.error || "Registration failed.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setOperationLoading(false);
    }
  };

  const value = useMemo(() => ({
    login,
    logout,
    register,
    user,
    role,
    isLoggedIn,
    resetPassword,
    loading: operationLoading, 
    authLoading,          
  }), [user, role, isLoggedIn, operationLoading, authLoading, login, logout, register, resetPassword]); 

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};