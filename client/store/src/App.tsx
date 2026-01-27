import './App.css'
import { useUser } from './contexts/UserContexts'
import { Navigate } from 'react-router-dom'
import Navbar from './pages/navbar/Navbar'
import LoadingSpinner from './components/loading-spinner/LoadingSpinner'

import LandingPage from './pages/landing-page/LandingPage'

function App() {

        const {user, loadingUser} = useUser()
  
  if(loadingUser){
    return <LoadingSpinner/>
  }

  return (
    <>
    <Navbar/>
      <div>
        <LandingPage/>
      </div>
      {!user&&
        <Navigate to="/" />
        }
      
     
  
    </>
  )
}

export default App
