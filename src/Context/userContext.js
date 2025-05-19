import { createContext, useContext, useState } from "react";
import {useApi} from "../Api/apiProvider";              
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from 'jwt-decode'; 
import { getUserDetails } from "../Api/getUserDataApi";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const {post} = useApi();
  const [loading, setLoading] = useState(false);
  const [user,setUser] = useState(null);
  const [images, setImages] = useState([]); 
  const [role,setRole] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  console.log(user);
  useEffect(() => {
    const checkAndFetchUser = async () => {
      const token = localStorage.getItem("Authorization");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.log("Token expired");
          logout();
          return;
        }

        const userData = await getUserDetails(post);
        if (userData) {
          setUser(userData);
          setRole(userData.role);  
          setIsLoggedIn(true);
          setImages(userData.generateImages);
        } else {
          console.error("Failed to fetch user details");
        }

      } catch (error) {
        console.error("Error validating token or fetching user:", error);

      }
    };

    checkAndFetchUser();
  }, [isLoggedIn]);


  const login = async (credentials,setCredentials) => {
    try {
      setLoading(true);
      const response =  await post("https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/signinUser", credentials);
      console.log("Login response:", response);
      if (response.status === 200) {
        const token = response.data.idToken
        localStorage.setItem('Authorization', token);
        setIsLoggedIn(true);                                               
        setCredentials({
          email: "",
          password: ""
        });
        setLoading(false);
        toast.success("Login successful");
        navigate("/dashboard");

      }
    } catch (error) {
      console.error("Login failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('Authorization');
  
  };
  const resetPassword = async(credentials,setCredentials)=>{
        try{
          setLoading(true);
            const response = await post("https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/forgotPassword",credentials);
          
            if(response.status === 200){
                toast.success(response.data.message);
                setCredentials({
                    email: ""
                });
                setLoading(false);
                navigate("/signin");
            }
        }catch(err){
          console.log(err);
        }finally{
          setLoading(false);
        }
  }

  const register = async(credentials,setCredentials) => {
    try{
      setLoading(true);
         const response = await post("https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/signupUser", credentials);
         console.log(response)
         if (response.data?.result?.success) {                                      
          setCredentials({
            email: "",
            password: ""
          });
          toast.success(response.data?.message);
          setLoading(false);
          navigate("/signin");
        }
    }catch(err){
      console.error("Registration failed:", err.message);
      toast.error(err.response.data.error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <UserContext.Provider value={{  login, logout, register,user,role,resetPassword,loading,setImages,images}}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);
