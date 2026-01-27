import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContexts';
import LoadingSpinner from '../components/loading-spinner/LoadingSpinner';
const ProtectedRoutes:React.FC = () => {

    const { user, loadingUser} = useUser();
    
    if(loadingUser) return <LoadingSpinner/>

    if(!user){
        return <Navigate to={'/login'} replace/>
    }


  return (
    <Outlet/>
  )
}

export default ProtectedRoutes