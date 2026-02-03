import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContexts";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Button from "../../components/button/Button";

const CheckOut: React.FC = () => {
  const { user } = useUser();
  const cart = useSelector((state: RootState) => state.cart.items);
  const cart_total = useSelector((state: RootState) => state.cart.total);
  const navigate = useNavigate();

  if (!user) return <Navigate to={"/cart"} />;

  return (
    <div className="min-h-screen pt-[120px] px-4 md:px-8 pb-24 bg-gray-900 text-white">
      {/* Back to Cart Button */}
      <div className="mb-6">
        <Button onClick={() => navigate("/cart")}>← Back to Cart</Button>
      </div>

      {cart.length > 0 ? (
        <>
          {/* Responsive Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-blue-500 table-auto">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-2 py-1 border border-blue-500 text-left">Item</th>
                  <th className="px-2 py-1 border border-blue-500 text-left">Description</th>
                  <th className="px-2 py-1 border border-blue-500 text-left">Image</th>
                  <th className="px-2 py-1 border border-blue-500 text-left">Quantity</th>
                  <th className="px-2 py-1 border border-blue-500 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item.id}
                    className="odd:bg-gray-700 even:bg-gray-600 hover:bg-blue-500 transition-colors"
                  >
                    <td className="px-2 py-1 border border-blue-500">{item.name}</td>
                    <td className="px-2 py-1 border border-blue-500">{item.description}</td>
                    <td className="px-2 py-1 border border-blue-500">
                      <img
                        className="w-20 h-20 object-cover rounded"
                        src={item.img}
                        alt={item.description}
                      />
                    </td>
                    <td className="px-2 py-1 border border-blue-500">{item.quantity}</td>
                    <td className="px-2 py-1 border border-blue-500">
                      {(Number(item.subtotal) || 0).toFixed(2)}$
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                  data-testid="cart-total"
                    colSpan={5}
                    className="text-center font-bold px-2 py-2 border border-blue-500"
                  >
                    TOTAL: {(Number(cart_total) || 0).toFixed(2)}$
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Button */}
          <div className="text-center">
            <Button
              onClick={() => navigate("/payment")}
              disabled={cart.length <= 0}
              className="px-6 py-2"
            >
              Proceed to Payment
            </Button>
          </div>
        </>
      ) : (
        <h1 className="text-center text-2xl mt-10">Cart is Empty</h1>
      )}
    </div>
  );
};

export default CheckOut;
