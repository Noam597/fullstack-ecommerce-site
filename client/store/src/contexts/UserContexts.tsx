import React,{useContext, useState, useEffect, createContext} from 'react'
import type { UserContextType, User } from './UserContext.types';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { fetchCartAsync } from '../redux/cart/cartThunks';
import type { AppDispatch } from '../redux/store';
import { api } from '../axios';

axios.defaults.withCredentials = true;

const UserContext = createContext<UserContextType| undefined>(undefined);


export const UserProvider: React.FC<{children : React.ReactNode}> = ({children})=> {

    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const dispatch = useDispatch<AppDispatch>()

    const refreshAccessToken = async () => {
      try {
        await api.post("/users/auth/refresh"); // backend sets new A_Token cookie
        console.log("Access token refreshed");
      } catch (err) {
        console.error("Refresh failed:", err);
        setUser(null); // optional: log user out if refresh fails
      }
    };
    
    

  const checkSession = async ()=>{
    try{
      const res = await api.get(`/users/getMe`, {
        withCredentials: true
      })
      setUser(res.data.user)

      dispatch(fetchCartAsync({customerId: res.data.user.id}))

    }catch(err){
      setUser(null)
    }finally{
      setLoadingUser(false)
    } 
  }

  useEffect(() => {
    console.log("API URL:", import.meta.env.VITE_API_URL)
    checkSession()
    
  }, [])
  
  useEffect(() => {
    // set up response interceptor
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
  
        // only retry once
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          await refreshAccessToken(); // call your refresh endpoint
          return api(originalRequest); // retry original request
        }
  
        return Promise.reject(error);
      }
    );
  
    // cleanup interceptor when context unmounts
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);
  

  return (

    
    <UserContext.Provider value={{ user ,setUser, loadingUser, setLoadingUser }}>
        {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};