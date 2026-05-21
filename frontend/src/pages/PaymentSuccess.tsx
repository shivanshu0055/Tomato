import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Your order has been placed successfully. The restaurant has received your order and is preparing it right now.
      </p>
      
      <div className="flex gap-4">
        <Link 
          to="/" 
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Go to Home
        </Link>
        <Link 
          to="/account" 
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;