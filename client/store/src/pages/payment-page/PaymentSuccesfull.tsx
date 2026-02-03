import React from "react";
import type { paymentSuccessProps } from "./PaymentSuccessful.types";
import { Link } from "react-router-dom";
import { FiDownload } from "react-icons/fi";

const PaymentSuccesfull: React.FC<paymentSuccessProps> = ({ order_code, reciept }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Payment Successful!</h1>
      <p className="mb-4 text-lg text-center">Order Code: <span className="font-mono">{order_code}</span></p>
      <button
        onClick={reciept}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4 transition"
      >
        <FiDownload size={20} /> Download Receipt
      </button>
      <Link
        to="/shop"
        className="text-blue-400 hover:text-blue-600 underline"
      >
        Back to Shop
      </Link>
    </div>
  );
};

export default PaymentSuccesfull;
