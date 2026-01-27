import React,{ useState, type FormEvent } from "react"
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState ,AppDispatch } from "../../redux/store";
import Inputs from "../../components/inputs/Inputs"
import { useUser } from "../../contexts/UserContexts"
import Button from "../../components/button/Button";
import { payForOrderAsync } from "../../redux/orders/ordersThunks";
import PaymentSuccesfull from "./PaymentSuccesfull";
import { downloadReceipt } from "../../utils/downloadReceipt";




const PaymentPage:React.FC = () => {
  //--> Cart Redux 
  const cart_id = useSelector((state: RootState) => state.cart.cart_id); 
  const cart_total = useSelector((state: RootState) => state.cart.total);

  //Payment Redux
  const orderLoading = useSelector((state: RootState) => state.orders.loading);
  const orderSuccess= useSelector((state: RootState) => state.orders.paymentSuccess);
  const order_code = useSelector((state: RootState) => state.orders.lastOrder?.order_code);
  const order_id = useSelector((state: RootState) => state.orders.lastOrder?.order_id);
  const dispatch = useDispatch<AppDispatch>();
  // -->Delivery Form
  const { user } = useUser();

  const [address, setAddress] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  // --> credit card info states
  const [cardOwner, setCardOwner] = useState<string>("")
  const [cardNumber, setCardNumber] = useState<string>("")
  const [expDate, setExpDate] = useState<string>("");
  const [cvc, setCvc] = useState<string>('');
  const [cardId, setCardId] = useState<string>("");


  const [payForm, setPayForm] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  

  const handleInfoForm = (e:FormEvent)=>{
    e.preventDefault()
    if(!address.trim() || !phoneNumber.trim() || !zipCode.trim()){
      return setError("All fields must be filled")
    }
    setError("");
    setPayForm(true)
  }

  const handlePaymentForm = (e: FormEvent) => {
    e.preventDefault();

    
    if (
      !cardOwner.trim() ||
      !cardNumber.trim() ||
      !expDate.trim() ||
      !cvc.trim() ||
      !cardId.trim()
    ) {
      return setError("Please fill in all fields.");
    }

    if (cardNumber.length < 12 || cardNumber.length > 19) {
      return setError("Card number looks invalid.");
    }

    if (cvc.length !== 3) {
      return setError("CVC must be 3 digits.");
    }
    setError("");
    /* ---> API CALL HERE <---*/
    if(cart_id !== null){
      dispatch(payForOrderAsync())
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (orderSuccess && order_id && order_code) {
    return (
      <PaymentSuccesfull
        order_code={order_code}
        reciept={() => downloadReceipt(order_id, order_code)}
      />
    );
  }

  // ---------------------------
  // Forms
  // ---------------------------

  return (
    <div className="mt-12">
      {!payForm ? (
        <form onSubmit={handleInfoForm}>
          <Inputs name="name" value={user.name} label="First Name" readonly />
          <Inputs name="surname" value={user.surname} label="Last Name" readonly />

          <Inputs
            name="address"
            label="Your Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />

          <Inputs
            name="phone"
            label="Phone Number"
            value={phoneNumber}
            onChange={e => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) setPhoneNumber(value);
            }}
          />

          <Inputs
            name="zipcode"
            label="Zipcode"
            value={zipCode}
            onChange={e => setZipCode(e.target.value)}
          />

          {error && <p>{error}</p>}
          <Button type="submit">To Pay 💳</Button>
        </form>
      ) : (
        <form onSubmit={handlePaymentForm} className="w-[300px] m-auto bg-black p-8 rounded-[20px]">
          <Inputs
            name="total"
            value={String(cart_total)}
            label="Total amount"
            readonly
            className="w-full"
          />

          <Inputs
            name="cardOwner"
            label="Card owner name"
            value={cardOwner}
            onChange={e => setCardOwner(e.target.value)}
            className="w-full"
          />

          <Inputs
            name="cardNumber"
            label="Card Number"
            value={cardNumber}
            onChange={e => {
              const value = e.target.value;
              if (/^\d{0,16}$/.test(value)) setCardNumber(value);
            }}
            className="w-full"
          />
          <div className="flex justify-center">
          <Inputs
            name="expDate"
            label="Expiry Date (MM/YY)"
            value={expDate}
            onChange={e => setExpDate(e.target.value)}
          />

          <Inputs
            name="cvc"
            label="CVC"
            value={cvc}
            onChange={e => {
              const value = e.target.value;
              if (/^\d{0,3}$/.test(value)) setCvc(value);
              
            }}
            className="w-12"
          />
        </div>
          <Inputs
            name="cardId"
            label="ID"
            value={cardId}
            onChange={e => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) setCardId(value);
            }}
            className="w-full"
          />

          {error && <p>{error}</p>}
          <Button type="submit" disabled={orderLoading} className="mx-auto items-center">
            Pay 💳
          </Button>
        </form>
      )}
    </div>
  );
};


export default PaymentPage