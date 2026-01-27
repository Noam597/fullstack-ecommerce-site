import React from 'react'
import { useUser } from '../../contexts/UserContexts'
import NavLoggedOut from '../../components/navLoggedout/NavLoggedOut'
import NavLoggedIn from '../../components/navloggeIn/NavLoggedIn'
import NavbarAdmin from '../../components/navbar-admin/NavbarAdmin'

const Navbar:React.FC = () => {


    const { user } = useUser()



    if (!user) {
      return <NavLoggedOut />
    }
  
  
    return (
      <>
        {user?.role === "admin" ? <NavbarAdmin /> : <NavLoggedIn />}
      </>
    )
  }


export default Navbar