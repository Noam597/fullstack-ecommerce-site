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