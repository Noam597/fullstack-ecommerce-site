import React from 'react'
import { Link , useNavigate} from 'react-router-dom'
import Button  from '../button/Button'
import { useUser } from '../../contexts/UserContexts'
import { api } from '../../axios'
const NavbarAdmin:React.FC = () => {

    const { setUser } = useUser()
    const navigate = useNavigate()
    
  
    const logOut = async () =>{
      await api.post('/users/logout',{},{
        withCredentials: true
      })
        console.log("logout button works");
        setUser(null)
        navigate('/login')
    }



  return (
    <nav  className="flex justify-between fixed top-0 left-0 w-full bg-black text-white p-4 z-50">
      <div>Logo</div>
       <ul className="flex space-x-7 list-none">
        <li><Link className="text-white no-underline hover:text-gray-300" to={'/dashboard'}>Dashboard</Link></li>
        <li><Link className="text-white no-underline hover:text-gray-300" to={'/stock'}>Stock</Link></li>
        <li><Link className="text-white no-underline hover:text-gray-300 relative" to={'/accounts'}>Accounts</Link></li>
        <li><Link className="text-white no-underline hover:text-gray-300 relative" to={'/addNew'}>Add New</Link></li>
        <li className='text-white'><Button onClick={logOut} type='button'>Logout</Button></li>
       </ul>
    </nav>
  )
}

export default NavbarAdmin