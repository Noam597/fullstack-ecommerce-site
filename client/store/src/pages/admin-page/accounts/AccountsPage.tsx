import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../../redux/store"
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner"
import Inputs from "../../../components/inputs/Inputs"
import type { User } from "../../../redux/admin/accounts/types"
import { fetchOrdersAsync } from "../../../redux/orders/ordersThunks"
import { fetchUsers, toggleBanUser } from "../../../redux/admin/accounts/accountsThunks"
import { downloadReceipt } from "../../../utils/downloadReceipt"
import { Outlet } from "react-router-dom"
import { FiDownload } from "react-icons/fi"
import Button from "../../../components/button/Button"

const AccountsPage = () => {


  const users = useSelector((state:RootState)=> state.users.users)
  const loading = useSelector((state:RootState)=> state.users.status === "idle")
  const { orders } = useSelector((state: RootState) => state.orders);
  
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   useEffect(() => {
     
    dispatch(fetchUsers())
     
   }, [dispatch])
   
   const selectSingleUser = (user:User)=>{
    if(!user){
      return
    }
    setSelectedUser(user)
    console.log(`${user} Selected`)
    dispatch(fetchOrdersAsync({customerId: user.id!}));
   }

   const banUser = async (user:User)=>{
    if(user.id == null){
      return
    }
    await dispatch(toggleBanUser({id:user.id,reason:"Violated Terms of Use"}))
    dispatch(fetchUsers())
   }
  return (
    <div>
      <h1>User List</h1>
      {loading && <LoadingSpinner/>}
      <Inputs name='searchBar' placeholder='Search By User Name..' label='Search' value={searchTerm} onChange={e=>{setSearchTerm(e.target.value)}}/><button onClick={()=>{setSearchTerm("")}}>clear</button>
      <div className="flex flex-col">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Status</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {!loading && filteredUsers.map((user)=>(
          <tr key={user.id} 
              onClick={() => selectSingleUser(user)}
              className="cursor-pointer hover:bg-blue-200 text-blue-400"
               >
            <td >{user.id}</td>
            <td>{user.name}</td>
            <td>{user.surname}</td>
            <td>{user.email}</td> 
            <td>{user.is_banned?<p className="text-red-500">Banned</p> : "Allowed"}</td>
            <td>{user.is_banned && "Violated Terms of Use"}</td>
            <td><Button type="button" onClick={() => banUser(user)}>{user.is_banned?"Unban":"Ban"}</Button></td>
          </tr>
          ))}
        </tbody>
      </table>
          {selectedUser && <div>
            <h2>{selectedUser.name}</h2>
            <h1 className='text-3xl m-2'>Purchase History</h1>
            {orders.length === 0? <h1>No Purchases made</h1>:
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
    </table>}
      <Outlet/>
          </div>}
    </div>
    </div>
  )
}

export default AccountsPage