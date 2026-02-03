import React, { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import Inputs from "../../components/inputs/Inputs";
import { useUser } from "../../contexts/UserContexts";
import Button from "../../components/button/Button";
import { payForOrderAsync } from "../../redux/orders/ordersThunks";
import PaymentSuccesfull from "./PaymentSuccesfull";
import { downloadReceipt } from "../../utils/downloadReceipt";

const PaymentPage: React.FC = () => {
  const cart_id = useSelector((state: RootState) => state.cart.cart_id);
  const cart_total = useSelector((state: RootState) => state.cart.total);
  const orderLoading = useSelector((state: RootState) => state.orders.loading);
  const orderSuccess = useSelector((state: RootState) => state.orders.paymentSuccess);
  const order_code = useSelector((state: RootState) => state.orders.lastOrder?.order_code);
  const order_id = useSelector((state: RootState) => state.orders.lastOrder?.order_id);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();

  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cardOwner, setCardOwner] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardId, setCardId] = useState("");
  const [payForm, setPayForm] = useState(false);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const handleInfoForm = (e: FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !phoneNumber.trim() || !zipCode.trim()) {
      return setError("All fields must be filled");
    }
    setError("");
    setPayForm(true);
  };

  const handlePaymentForm = (e: FormEvent) => {
    e.preventDefault();
    if (!cardOwner.trim() || !cardNumber.trim() || !expDate.trim() || !cvc.trim() || !cardId.trim()) {
      return setError("Please fill in all fields.");
    }
    if (cardNumber.length < 12 || cardNumber.length > 19) return setError("Card number looks invalid.");
    if (cvc.length !== 3) return setError("CVC must be 3 digits.");
    setError("");
    if (cart_id !== null) dispatch(payForOrderAsync());
  };

  if (!user) return <Navigate to="/login" replace />;
  if (orderSuccess && order_id && order_code) {
    return <PaymentSuccesfull order_code={order_code} reciept={() => downloadReceipt(order_id, order_code)} />;
  }

  return (
    <div className="mt-12 px-4 md:px-8">
      {!payForm ? (
        <form onSubmit={handleInfoForm} className="max-w-lg mx-auto bg-gray-800 p-6 md:p-8 rounded-xl space-y-4 shadow-lg">
          <h2 className="text-xl font-semibold text-center text-white mb-4">Delivery Info</h2>
          <Inputs name="name" value={user.name} label="First Name" readonly />
          <Inputs name="surname" value={user.surname} label="Last Name" readonly />
          <Inputs name="address" label="Your Address" value={address} onChange={e => setAddress(e.target.value)} />
          <Inputs
            name="phone"
            label="Phone Number"
            value={phoneNumber}
            onChange={e => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) setPhoneNumber(value);
            }}
          />
          <Inputs name="zipcode" label="Zipcode" value={zipCode} onChange={e => setZipCode(e.target.value)} />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex justify-center">
            <Button type="submit" className="px-6 py-2">
              To Pay 💳
            </Button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handlePaymentForm}
          className="max-w-lg w-full mx-auto bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-xl space-y-5 shadow-xl text-white"
        >
          <h2 className="text-xl font-semibold text-center mb-4">Payment Info</h2>

          {/* Total Amount */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total Amount</p>
            <p className="text-2xl font-bold">{cart_total}$</p>
          </div>

          {/* Card Owner */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Card Owner</label>
            <input
              type="text"
              value={cardOwner}
              onChange={e => setCardOwner(e.target.value)}
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={e => {
                const value = e.target.value;
                if (/^\d{0,16}$/.test(value)) setCardNumber(value);
              }}
              placeholder="XXXX XXXX XXXX XXXX"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest"
            />
          </div>

          {/* Expiry + CVC */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm mb-1 text-gray-300">Expiry Date</label>
              <input
                type="text"
                value={expDate}
                onChange={e => setExpDate(e.target.value)}
                placeholder="MM/YY"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative w-24">
              <label className="block text-sm mb-1 text-gray-300 flex items-center gap-1">
                CVC
                <span
                  className="relative cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setShowTooltip(prev => !prev)}
                >
                  ?
                  <span
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-700 text-white text-xs text-center p-2 rounded z-50 transition-opacity
                      ${showTooltip ? "opacity-100" : "opacity-0"}
                    `}
                  >
                    Enter the 3 digits on the back of your card
                  </span>
                </span>
              </label>
              <input
                type="text"
                value={cvc}
                onChange={e => {
                  const value = e.target.value;
                  if (/^\d{0,3}$/.test(value)) setCvc(value);
                }}
                placeholder="123"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
            </div>
          </div>

          {/* Card ID */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">ID</label>
            <input
              type="text"
              value={cardId}
              onChange={e => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) setCardId(value);
              }}
              placeholder="Your ID"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit */}
          <div className="flex justify-center">
            <Button type="submit" disabled={orderLoading} className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold">
              Pay 💳
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentPage;
