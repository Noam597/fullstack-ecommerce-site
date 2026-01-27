import { Navigate, useNavigate } from "react-router-dom"
import { useUser } from "../../contexts/UserContexts"
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Button from "../../components/button/Button";

const CheckOut = () => {

    const {user} = useUser()

    const cart = useSelector((state: RootState) => state.cart.items);
    const cart_total = useSelector((state: RootState) => state.cart.total);
    const navigate = useNavigate()
    

    if(!user){
       return <Navigate to={'/cart'}/>
    }
  return (
    
    <div>
        <Button onClick={()=>navigate('/cart')}>Back to Cart</Button>
        {cart.length > 0 ?
        <>
        <table className="border-collapse border-solid border-blue-500 border-2">
            <thead>
            <tr>
                <th className="p-1 border-collapse border-solid border-blue-500 border-2">Item</th>
                <th className="p-1 border-collapse border-solid border-blue-500 border-2">Item Description</th>
                <th className="p-1 border-collapse border-solid border-blue-500 border-2">Image</th>
                <th className="p-1 border-collapse border-solid border-blue-500 border-2">Quantity</th>
                <th className="p-1 border-collapse border-solid border-blue-500 border-2">Total</th>
            </tr>
            </thead>
            <tbody>
        {cart.map((item)=>
            
            <tr className="border-collapse border-solid border-blue-500 border-2 transition hover:bg-blue-200 hover:text-black">
                <td className="p-1 border-collapse border-solid border-blue-500 border-2">{item.name}</td>
                <td className="p-1 border-collapse border-solid border-blue-500 border-2">{item.description}</td>
                <td className="p-1 border-collapse border-solid border-blue-500 border-2"><img className="w-24 h-24 " src={item.img} alt={item.description}/></td>
                <td className="p-1 border-collapse border-solid border-blue-500 border-2">{item.quantity}</td>
                <td className="p-1 border-collapse border-solid border-blue-500 border-2">{item.subtotal}$</td>
            </tr>
            
        )}
            <tr>
                <td  className="p-1 items-center" colSpan={5}>TOTAL: {cart_total.toFixed(2)} $</td>
            </tr>
            </tbody>
            </table>
            <Button onClick={()=>navigate('/payment')} disabled={cart.length <= 0}>Payment</Button>
            
            </>
            
            :<h1>Cart is Empty</h1>}
    </div>
  )
}

export default CheckOut