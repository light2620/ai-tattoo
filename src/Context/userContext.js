import React, { createContext, useContext, useState } from "react";
import {useApi} from "../Api/apiProvider";              
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from 'jwt-decode'; 
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/Slice/userSlice";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const {post} = useApi();
  const [loading, setLoading] = useState(false);
  const [user,setUser] = useState(null);
  const [isAdmin,setIsAdmin] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
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
        const response = await post(
          "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/getUserDetails"
        );

        if (response.status === 200) {
          const userData = response.data;
          setUser(userData);
          dispatch(setUserData(userData));
          setIsLoggedIn(true);
          if (userData.role === "admin") {
            setIsAdmin(true);
          }
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
        console.log("Token:", token);
        const userData = jwtDecode(token);
        localStorage.setItem('Authorization', token);
        if(userData.role === "admin"){
          setIsAdmin(true);
        }
        
        setUser(response.data.userData) 
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
            const response = await post("https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/forgotPassword",credentials);
          
            if(response.status === 200){
                toast.success(response.data.message);
                setCredentials({
                    email: ""
                });
                navigate("/signin");
            }
        }catch(err){
          console.log(err);
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
    <UserContext.Provider value={{  login, logout, register,user,isAdmin,resetPassword,loading}}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);
