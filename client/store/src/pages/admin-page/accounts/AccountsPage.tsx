import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import Inputs from "../../../components/inputs/Inputs";
import type { User } from "../../../redux/admin/accounts/types";
import { fetchOrdersAsync } from "../../../redux/orders/ordersThunks";
import { fetchUsers, toggleBanUser } from "../../../redux/admin/accounts/accountsThunks";
import { downloadReceipt } from "../../../utils/downloadReceipt";
import { Outlet } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import Button from "../../../components/button/Button";

const AccountsPage = () => {
  const users = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.status === "idle");
  const { orders } = useSelector((state: RootState) => state.orders);
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const selectSingleUser = (user: User) => {
    if (!user) return;
    setSelectedUser(user);
    dispatch(fetchOrdersAsync({ customerId: user.id! }));
  };

  const banUser = async (user: User) => {
    if (!user.id) return;
    await dispatch(toggleBanUser({ id: user.id, reason: "Violated Terms of Use" }));
    dispatch(fetchUsers());
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">User Accounts</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <Inputs
          name="searchBar"
          placeholder="Search by User Name..."
          label="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Button
          type="button"
          onClick={() => setSearchTerm("")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
        >
          Clear
        </Button>
      </div>

      {loading && <LoadingSpinner />}

      {/* Users Table */}
      <div className="overflow-x-auto rounded shadow-lg">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Surname</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              filteredUsers.map(user => (
                <tr
                  key={user.id}
                  onClick={() => selectSingleUser(user)}
                  className="cursor-pointer transition-colors duration-200 hover:bg-blue-100 hover:text-blue-900"
                >
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.surname}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    {user.is_banned ? (
                      <span className="text-red-500 font-semibold">Banned</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Allowed</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {user.is_banned && "Violated Terms of Use"}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      type="button"
                      onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                        e?.stopPropagation();
                        banUser(user);
                      }}
                      className={`px-3 py-1 rounded ${
                        user.is_banned ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {user.is_banned ? "Unban" : "Ban"}
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Selected User Details */}
      {selectedUser && (
        <div className="mt-6 p-4 rounded shadow-lg bg-black">
          <h2 className="text-2xl font-bold text-center mb-2">{selectedUser.name} {selectedUser.surname}</h2>
          <h3 className="text-lg font-semibold text-center mb-4">Purchase History</h3>

          {orders.length === 0 ? (
            <p className="text-center text-gray-900">No purchases made</p>
          ) : (
            <div className="overflow-x-auto rounded shadow-md">
              <table className="min-w-full border-collapse text-center">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-2 py-1">Order Code</th>
                    <th className="px-2 py-1">Item</th>
                    <th className="px-2 py-1">Price</th>
                    <th className="px-2 py-1">Quantity</th>
                    <th className="px-2 py-1">Subtotal</th>
                    <th className="px-2 py-1">Total</th>
                    <th className="px-2 py-1">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr
                      key={order.order_id}
                      className="odd:bg-blue-50 even:bg-blue-100 text-black transition-colors duration-200 hover:bg-blue-200"
                    >
                      <td className="px-2 py-1 text-center">{order.order_code}</td>
                      <td className="px-2 py-1">
                        {order.items.map(item => (
                          <div key={item.product_id}>{item.product_name}</div>
                        ))}
                      </td>
                      <td className="px-2 py-1">
                        {order.items.map(item => (
                          <div key={item.product_id}>${item.price}</div>
                        ))}
                      </td>
                      <td className="px-2 py-1">
                        {order.items.map(item => (
                          <div key={item.product_id}>{item.quantity}</div>
                        ))}
                      </td>
                      <td className="px-2 py-1">
                        {order.items.map(item => (
                          <div key={item.product_id}>${item.subtotal}</div>
                        ))}
                      </td>
                      <td className="px-2 py-1 font-semibold">${order.order_total}</td>
                      <td className="px-2 py-1 items-center text-center cursor-pointer hover:text-indigo-800">
                        <FiDownload onClick={() => downloadReceipt(order.order_id, order.order_code)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
