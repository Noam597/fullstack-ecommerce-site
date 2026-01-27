import React, { useState } from 'react'
import Signup from '../../components/signup/Signup'
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { api } from '../../axios';

const SignUpPage:React.FC = () => {

    const [error, setError] = useState()
    const navigate = useNavigate()



    const handleSignUp = async ( name: string ,
        surname:string,
        email: string ,
        password: string ,
        verifyPassword:string)=>{
        try{   
        const response = await api.post(`/users/register`,
            {
            name ,
           surname,
           email ,
           password ,
           verifyPassword
            })
        
        if (response.data.success) {
            navigate('/home');
          } else {
            setError(response.data.message || 'Login failed');
          }
        }catch(err: any) {
          setError(err.response?.data?.message || 'Server error');
        }
      };
    


  return (
    <div className="min-h-screen flex items-center justify-center ">
  <div className='bg-black rounded-[20px] p-2 w-100 m-auto'>
        <Signup onSignUp={handleSignUp}/>
        {error && <p className='text-red-600'>{error}</p>}
    </div>
    </div>
  )
}

export default SignUpPage


