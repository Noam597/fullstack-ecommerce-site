import React,{ useEffect } from 'react';
import { Navigate, Outlet} from 'react-router-dom';
import { useUser } from '../../contexts/UserContexts'
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersAsync } from '../../redux/orders/ordersThunks';
import type { RootState, AppDispatch } from '../../redux/store';
import { FiDownload } from "react-icons/fi";
import { downloadReceipt } from '../../utils/downloadReceipt';
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner';

const HomePage:React.FC = () => {

  const { user } = useUser();
 

   if (!user) {
    return <Navigate to="/login" />; // Redirect if not logged in
  }


  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  console.log("Redux Orders State:", orders);


  useEffect(() => {
    dispatch(fetchOrdersAsync({customerId: user.id}));
  }, [dispatch, user.id]);

  if (loading) return <LoadingSpinner/>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h1 className='text-4xl m-2'>Welcome {user?.name} {user?.surname}!</h1>
      <div className='flex flex-wrap justify-center'>
      <p>Email: {user?.email}</p>
      </div>
      <h1 className='text-3xl m-2'>Purchase History</h1>
<table>
  <thead>
    <tr>
      <th className="px-2">order code</th>
      <th className="px-2">Item</th>
      <th className="px-2">Price</th>
      <th className="px-2">Quantity</th>
      <th className="px-2">SubTotal</th>
      <th className="px-2">Total</th>  
    </tr>
  </thead>
  <tbody>
  {orders.map(order => (
    <tr
      key={order.order_id}
      className="odd:bg-blue-100 even:bg-blue-300 text-black"
    >
      <td className="px-2 text-center align-middle">{order.order_code}</td>

      {/* Item names */}
      <td className="px-2">
        {order.items.map(item => (
          <div key={item.product_id}>{item.product_name}</div>
        ))}
      </td>

      {/* Unit price */}
      <td className="px-2">
        {order.items.map(item => (
          <div key={item.product_id}>${item.price}</div>
        ))}
      </td>

      {/* Quantity */}
      <td className="px-2">
        {order.items.map(item => (
          <div key={item.product_id}>{item.quantity}</div>
        ))}
      </td>

      {/* Subtotal */}
      <td className="px-2">
        {order.items.map(item => (
          <div key={item.product_id}>${item.subtotal}</div>
        ))}
      </td>

      {/* Order total */}
      <td className="px-2 font-semibold">
        ${order.order_total}
      </td>
      <td className="px-2"><p className='cursor-pointer hover:text-indigo-800' onClick={()=>downloadReceipt(order.order_id,order.order_code)}><FiDownload/></p></td>
    </tr>
  ))}
</tbody>
    </table>
      <Outlet/>
    </div>
  );
}

export default HomePage