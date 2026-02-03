import React, { useEffect } from "react";
import { useUser } from "../../contexts/UserContexts";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import ProductCard from "../../components/productCard/ProductCard";
import type { CartItem } from "../../redux/cart/types";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import {
  fetchCartAsync,
  addToCartAsync,
  decrementQuantityAsync,
  removeCartItemAsync,
} from "../../redux/cart/cartThunks";

const Cart: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const cart = useSelector((state: RootState) => state.cart.items);
  const cart_id = useSelector((state: RootState) => state.cart.cart_id);

  useEffect(() => {
    if (user) {
      dispatch(fetchCartAsync({ customerId: user.id }));
    }
  }, [user, dispatch]);

  const handleIncrement = async (item: CartItem) => {
    if (!cart_id) return;

    await dispatch(
      addToCartAsync({
        cart_id,
        product_id: item.product_id,
        quantity: 1,
      })
    );
    dispatch(fetchCartAsync({ customerId: user!.id }));
  };

  const handleDecrement = async (item: CartItem) => {
    if (!cart_id) return;

    await dispatch(
      decrementQuantityAsync({
        cart_id,
        product_id: item.product_id,
        decrement: 1,
      })
    );
    dispatch(fetchCartAsync({ customerId: user!.id }));
  };

  const handleRemoveItem = async (item: CartItem) => {
    if (!cart_id) return;

    await dispatch(
      removeCartItemAsync({
        cart_id,
        product_id: item.product_id,
      })
    );
    dispatch(fetchCartAsync({ customerId: user!.id }));
  };

  return (
    <div className="w-full min-h-screen pt-[120px] pb-24 px-4 md:px-8 bg-gray-900">
      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
        🛒 Shopping Cart
      </h1>

      {/* Cart Items */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {cart.length > 0 ? (
          cart.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              img={item.img}
              price={item.subtotal}
              quantity={item.quantity}
              cartQuantity={item.quantity}
              inShop={false}
              inCart={true}
              onIncreaseQty={() => handleIncrement(item)}
              onDecreaseQty={() => handleDecrement(item)}
              onRemoveFromCart={() => handleRemoveItem(item)}
            />
          ))
        ) : (
          <p className="text-center text-gray-300 text-lg w-full">Cart is Empty</p>
        )}
      </div>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="flex justify-center mt-12">
          <Button
            type="button"
            onClick={() => navigate("/checkout")}
            className="px-8 py-3 text-lg md:text-xl"
          >
            Check Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
