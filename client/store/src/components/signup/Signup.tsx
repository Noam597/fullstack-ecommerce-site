
import Inputs from '../inputs/Inputs'
import Button from '../button/Button'
import React,{ useState } from 'react'
import type { signUpProps } from './Signup.types'
import { Link } from 'react-router-dom'
function Signup({onSignUp}:signUpProps) {

    const [name, setName] = useState<string>('')
    const [surname, setSurname] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [verifyPassword, setVerifyPassword] = useState<string>('')
    const [localError, setLocalError] = useState<string>('')
    
    const handleSubmit = (e:React.FormEvent)=>{
        e.preventDefault()
        setLocalError("")
        if(!name ||
           !surname||
           !email ||
           !password ||
           !verifyPassword
        ){
            setLocalError("Please fill in all the fields")
        }else{
            onSignUp(name ,surname ,email, password, verifyPassword)
        }
        
    }

  return (
    <form onSubmit={handleSubmit}>
        <Inputs 
        label='Username' 
        name='username' 
        type='text' value={name} 
        onChange={(e)=>setName(e.target.value)} 
        placeholder='Enter username'
        className='w-[95%]'
        />
        <Inputs 
        label='Surname' 
        name='surname' 
        type='text' value={surname} 
        onChange={(e)=>setSurname(e.target.value)} 
        placeholder='Enter Surname'
        className='w-[95%]'
        />
        <Inputs label='Email'
         name='email' 
         type='email'
         value={email}
         onChange={(e)=>setEmail(e.target.value)} 
         placeholder='enter valid email example@mail.com'
         className='w-[95%]'
         />

        <Inputs 
        label='Password' 
        name='password' 
        type='text' 
        value={password} 
        onChange={(e)=>setPassword(e.target.value)} 
        placeholder='Enter valid password'
        className='w-[95%]'
        />
        <Inputs 
        label='Verify Password' 
        name='verifypassword' 
        type='text' 
        value={verifyPassword} 
        onChange={(e)=>setVerifyPassword(e.target.value)} 
        placeholder='Verify password'
        className='w-[95%]'
        />
        <div className='my-3 flex items-center'>
            <Button type='submit'>Sign Up</Button>
        </div>
        {localError && <p className='text-red-500'>{localError}</p>}
        <p>Already have an account?<Link to={'/login'}>Click <u>Here</u></Link> To Log In</p>
    </form>
  )
}

export default Signup