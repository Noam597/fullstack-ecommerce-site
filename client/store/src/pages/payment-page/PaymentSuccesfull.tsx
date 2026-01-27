import React from 'react'
import type { paymentSuccessProps } from './PaymentSuccessful.types'
import { Link } from 'react-router-dom'
import { FiDownload } from "react-icons/fi";

const PaymentSuccesfull:React.FC<paymentSuccessProps> = ({order_code,reciept}) => {

    // api/orders.ts

  
  return (
    <div>
        <h1>Payment Successful!</h1>
        <h1>{order_code}</h1>
        <p>Download reciept</p>
        <p onClick={reciept}><FiDownload/></p>
        <p><Link to={'/shop'}>Back to Shop</Link></p>
    </div>
  )
}

export default PaymentSuccesfull