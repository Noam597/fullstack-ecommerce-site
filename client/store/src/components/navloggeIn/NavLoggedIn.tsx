import React,{ useEffect }from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Button from '../button/Button';
import { useUser } from '../../contexts/UserContexts';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../redux/store';
import { fetchCartAsync } from '../../redux/cart/cartThunks';
import { api } from '../../axios';

const NavLoggedIn: React.FC = () => {

    const { user, setUser } = useUser()
    const navigate = useNavigate()
    
    const cart = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
      if (user?.id){
        dispatch(fetchCartAsync({customerId:user.id}));
      }

    }, [dispatch,user?.id, ]);
    


    const logOut = async () =>{
      await api.post('/users/logout',{},{
        withCredentials: true
      }).catch(err=>console.log(err.message))
        console.log("logout button works");
        setUser(null)
        navigate('/login')
    }
  return (

    


    <nav  className="flex justify-between fixed top-0 left-0 w-full bg-black text-white p-4 z-50">
      <div>Logo <p><Link className="text-white no-underline hover:text-gray-300" to={'/dashboard'}>{user?.name} {user?.surname}</Link></p></div>
       <ul className="flex space-x-7 list-none">
        <li><Link className="text-white no-underline hover:text-gray-300" to={'/dashboard'}>Profile</Link></li>
        <li><Link className="text-white no-underline hover:text-gray-300" to={'/shop'}>Shop</Link></li>
        <li><Link className="text-white no-underline hover:text-gray-300 relative" to={'/cart'}>🛒{cart.length > 0 && <span className='text-xs  bg-opacity-70 w-6 h-auto absolute top-3 left-5 p-1 rounded-full bg-blue-400'>{cart.length}</span>}</Link></li>
        <li className='text-white'><Button onClick={logOut} type='button'>Logout</Button></li>
       </ul>
    </nav>
  )
}

export default NavLoggedIn