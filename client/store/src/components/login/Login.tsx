import React, { useState } from 'react';
import type {loginProps} from './Login.types';
import Inputs from '../inputs/Inputs';
import Button from '../button/Button';
import { Link } from 'react-router-dom';

function Login({onLogin}:loginProps) {
    
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [localError, setLocalError] = useState<string>('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLocalError('');
  
      if (!email || !password) {
        setLocalError('Must fill in email and password');
        return;
      }
  
      onLogin(email, password); // ✅ Pass credentials correctly
    };

  return (
    <form onSubmit={handleSubmit}>
        <Inputs label='Email'
         name='email'
          type='email'
           value={email} 
           onChange={(e)=> setEmail(e.target.value)}
           placeholder='Enter Email'
           className='w-[95%]'
           />
           
        <Inputs  label='Password'
         name='password'
          type='password'
           value={password}
            onChange={(e)=> setPassword(e.target.value)}
             placeholder='Enter password'
             className='w-[95%]'
             />
        <div className='my-4 flex items-center'>
        <Button type='submit'>Login</Button>
        </div>
        {localError && <p>{localError}</p>}
        <p className='text-black'>Not Registered yet?<u><Link to={'/signup'}>Click Here</Link></u> To Sign Up</p>
    </form >
  )
}

export default Login