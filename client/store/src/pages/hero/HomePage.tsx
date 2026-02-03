import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../contexts/UserContexts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersAsync } from '../../redux/orders/ordersThunks';
import type { RootState, AppDispatch } from '../../redux/store';
import { FiDownload } from 'react-icons/fi';
import { downloadReceipt } from '../../utils/downloadReceipt';
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner';

const HomePage: React.FC = () => {
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);

  // Redirect if not logged in
  if (!user) return <Navigate to="/login" />;

  useEffect(() => {
    dispatch(fetchOrdersAsync({ customerId: user.id }));
  }, [dispatch, user.id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center mt-4">Error: {error}</p>;

  return (
    <div className="min-h-screen pt-[120px] px-4 md:px-8 pb-24 bg-gray-900 text-white">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome {user.name} {user.surname}!
        </h1>
        <p>Email: {user.email}</p>
      </div>

      {/* Purchase History */}
      <h2 className="text-3xl font-semibold mb-4 text-center">Purchase History</h2>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-3 py-2 text-left">Order Code</th>
              <th className="px-3 py-2 text-left">Item</th>
              <th className="px-3 py-2 text-left">Price</th>
              <th className="px-3 py-2 text-left">Quantity</th>
              <th className="px-3 py-2 text-left">Subtotal</th>
              <th className="px-3 py-2 text-left">Total</th>
              <th className="px-3 py-2 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="odd:bg-gray-700 even:bg-gray-600 text-white">
                <td className="px-3 py-2 align-top">{order.order_code}</td>

                {/* Item names */}
                <td className="px-3 py-2 align-top">
                  {order.items.map((item) => (
                    <div key={item.product_id}>{item.product_name}</div>
                  ))}
                </td>

                {/* Unit price */}
                <td className="px-3 py-2 align-top">
                  {order.items.map((item) => (
                    <div key={item.product_id}>${item.price}</div>
                  ))}
                </td>

                {/* Quantity */}
                <td className="px-3 py-2 align-top">
                  {order.items.map((item) => (
                    <div key={item.product_id}>{item.quantity}</div>
                  ))}
                </td>

                {/* Subtotal */}
                <td className="px-3 py-2 align-top">
                  {order.items.map((item) => (
                    <div key={item.product_id}>${item.subtotal}</div>
                  ))}
                </td>

                {/* Order total */}
                <td className="px-3 py-2 font-semibold align-top">${order.order_total}</td>

                {/* Download PDF */}
                <td className="px-3 py-2 text-center align-top">
                  <button
                    onClick={() => downloadReceipt(order.order_id, order.order_code)}
                    className="hover:text-indigo-400"
                  >
                    <FiDownload size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Outlet />
    </div>
  );
};

export default HomePage;
