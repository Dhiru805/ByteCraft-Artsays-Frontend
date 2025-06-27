import React from 'react';
import { FaCreditCard, FaRegCircle } from 'react-icons/fa';
import { BsFillCreditCard2FrontFill } from 'react-icons/bs';

const PaymentMethod = () => {
  return (
  <div className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 lg:px-0 space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>

    {/* Linked / Linkable Accounts */}
    <div className="space-y-5">
      {/* Paytm */}
      <div className="flex justify-between items-center border-2 border-gray-300 p-3 rounded-xl">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2b/Paytm_Logo.png"
          alt="Paytm"
          className="h-6"
        />
        <button className="text-[#6F3E2D] font-semibold">Link Account</button>
      </div>

      {/* Visa */}
      <div className="flex justify-between items-center border-2 border-gray-300 p-3 rounded-xl">
        <div className="flex items-center space-x-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            alt="Visa"
            className="h-5"
          />
          <span>**** **** **** 0223</span>
        </div>
        <button className="text-red-500 font-semibold">Delete</button>
      </div>

      {/* Google Pay */}
      <div className="flex justify-between items-center border-2 border-gray-300 p-3 rounded-xl">
        <div className="flex items-center space-x-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Google_Pay_Logo.svg"
            alt="Google Pay"
            className="h-6"
          />
        </div>
        <button className="text-[#6F3E2D] font-semibold">Link Account</button>
      </div>

      {/* PhonePe */}
      <div className="flex justify-between items-center border-2 border-gray-300 p-3 rounded-xl">
        <div className="flex items-center space-x-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fb/PhonePe_Logo.svg"
            alt="PhonePe"
            className="h-6"
          />
        </div>
        <button className="text-[#6F3E2D] font-semibold">Link Account</button>
      </div>
    </div>

    {/* Add New Card Section */}
    <div className="border-2 border-[#6F3E2D] rounded-3xl p-4 sm:p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <FaRegCircle className="text-[#6F3E2D]" />
        <span className="font-medium text-[#6F3E2D]">Add New Credit/Debit Card</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Card Holder Name</label>
        <input
          className="border p-2 rounded-lg w-full"
          placeholder="Nelson"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Card Number</label>
        <input
          className="border p-2 rounded-lg w-full"
          placeholder="4715 2256 3598 3654"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input
            className="border p-2 rounded-lg w-full"
            placeholder="MM/YY"
            defaultValue="02/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CVV</label>
          <input
            className="border p-2 rounded-lg w-full"
            placeholder="000"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="saveCard"
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="saveCard" className="text-sm text-gray-700">
          Save card for future payments
        </label>
      </div>

      <button className="bg-[#6F4D34] text-white px-6 py-2 rounded-full text-sm">
        Add Card
      </button>
    </div>
  </div>
);

};

export default PaymentMethod;
