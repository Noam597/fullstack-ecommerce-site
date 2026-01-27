import React from 'react';
import { Link } from 'react-router-dom';



const NavLoggedOut:React.FC = () => {
  return (
    <nav  className="flex justify-between fixed top-0 left-0 w-full bg-black text-white p-4 z-50">
      <div>Logo</div>
        <ul className="flex space-x-10 list-none">
            <li><Link className="text-white no-underline hover:text-gray-300" to={'/login'}>Home</Link> </li>
            <li><Link className="text-white no-underline hover:text-gray-300" to={'/about'}>About</Link></li>
            <li><Link className="text-white no-underline hover:text-gray-300" to={'/products'}>Products</Link></li>
            <li><Link className="text-white no-underline hover:text-gray-300" to={'/signup'}>Sign Up</Link></li>
        </ul>
    </nav>
  )
}

export default NavLoggedOut