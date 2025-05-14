import React from 'react';

const PaymentMethod = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center border p-3 rounded">
          <span>Paytm UPI</span>
          <button className="text-blue-600">Link Account</button>
        </div>
        <div className="flex justify-between items-center border p-3 rounded">
          <span>Visa **** 0223</span>
          <button className="text-red-500">Delete</button>
        </div>
        <div className="flex justify-between items-center border p-3 rounded">
          <span>Google Pay</span>
          <button className="text-blue-600">Link Account</button>
        </div>
        <div className="flex justify-between items-center border p-3 rounded">
          <span>Phone Pay</span>
          <button className="text-blue-600">Link Account</button>
        </div>
      </div>

      <div className="border p-4 rounded space-y-4">
        <div className="flex items-center space-x-2">
          <input type="radio" />
          <span className="font-medium">Add New Credit/Debit Card</span>
        </div>
        <input className="border p-2 rounded w-full" placeholder="Card Holder Name" defaultValue="Nelson" />
        <input className="border p-2 rounded w-full" placeholder="Card Number" defaultValue="4715 2256 3598 3654" />
        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Expiry Date" defaultValue="02/30" />
          <input className="border p-2 rounded" placeholder="CVV" defaultValue="000" />
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" />
          <label>Save card for future payments</label>
        </div>
        <button className="bg-[#5F3E2D] text-white px-6 py-2 rounded">Add Card</button>
      </div>
    </div>
  );
};

export default PaymentMethod;
