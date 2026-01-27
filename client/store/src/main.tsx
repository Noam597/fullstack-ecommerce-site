import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import HomePage from './pages/hero/HomePage.tsx';
import { UserProvider } from './contexts/UserContexts.tsx';
import LoginPage from './pages/login-page/LoginPage.tsx';
import SignUpPage from './pages/signup-page/SignUpPage.tsx';
import "./index.css";
import Layout from './Layout.tsx';
import { store } from './redux/store.ts';
import { ErrorPage404 } from './pages/error-page/ErrorPage404.tsx';
import ProductsPage from './pages/products/ProductsPage.tsx';
import Shop from './pages/shop/Shop.tsx';
import ProtectedRoutes from './routes/ProtectedRoutes.tsx';
import AdminProtectedRoutes from './routes/AdminProtectedRoutes.tsx';
import AdminDashBoard from './pages/admin-page/AdminDashBoard.tsx';
import AboutPage from './pages/about-page/AboutPage.tsx';
import Cart from './pages/cart-page/Cart.tsx';
import CheckOut from './pages/checkout-page/CheckOut.tsx';
import PaymentPage from './pages/payment-page/PaymentPage.tsx';
import StockPage from './pages/admin-page/stock/StockPage.tsx';
import AccountsPage from './pages/admin-page/accounts/AccountsPage.tsx';
import AddingPage from './pages/admin-page/adding/AddingPage.tsx';

const router = createBrowserRouter([
  { element: <Layout/>,
    children:
  [
  {path:'/', element:<App/>},
  {path:'/login', element:<LoginPage/>},
  {path:'/signup', element:<SignUpPage/>},
  {path:'/products', element:<ProductsPage/>},
  {path:'/about', element:<AboutPage/>},
  {element: <ProtectedRoutes/>,
    children:[
      {path:'home', element:<HomePage/>},
      {path:'shop', element:<Shop/>},
      {path:'cart', element:<Cart/>},
      {path:'checkout', element:<CheckOut/>},
      {path:'payment', element:<PaymentPage/>}
    ]
  } , 
  {element: <AdminProtectedRoutes/>,
    children:[
      {path:'dashboard', element:<AdminDashBoard/>},
      {path:'stock', element:<StockPage/>},
      {path:'accounts', element:<AccountsPage/>},
      {path:'addNew', element:<AddingPage/>},
    ]
  } , 
  
  {path:'*', element:<ErrorPage404/>},
  ]
},
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <UserProvider>
        <RouterProvider router={router}/>
      </UserProvider>
    </Provider>
  </StrictMode>,
)
