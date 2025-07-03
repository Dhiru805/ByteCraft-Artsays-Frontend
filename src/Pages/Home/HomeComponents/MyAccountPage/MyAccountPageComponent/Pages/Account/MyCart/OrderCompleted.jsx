import React from "react";

const products = [
  {
    id: 1,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    image: "https://i.imgur.com/A1eDB3M.png",
  },
  {
    id: 2,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    image: "https://i.imgur.com/Ci1YZ4X.png",
  },
  {
    id: 3,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    image: "https://i.imgur.com/EX3Z8Zz.png",
  },
];

const OrderCompleted = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Order Complete Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#5C4033] flex items-center justify-center">
          <span className="text-white text-2xl">✔</span>
        </div>
        <h2 className="text-xl font-semibold">Your order is completed</h2>
        <p className="text-gray-500">Thank you. Your Order has been received</p>
      </div>

      {/* Order Info Box */}
      <div className="bg-yellow-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-sm font-medium">
          <div>
            <p className="text-gray-500">Order ID</p>
            <p className="text-black">#SDGTI254FD</p>
          </div>
          <div>
            <p className="text-gray-500">Payment Method</p>
            <p className="text-black">Paypal</p>
          </div>
          <div>
            <p className="text-gray-500">Transaction ID</p>
            <p className="text-black">TR542SSFE</p>
          </div>
          <div>
            <p className="text-gray-500">Estimated Delivery Date</p>
            <p className="text-black">29 June 2023</p>
          </div>
        </div>
        <button className="bg-[#5C4033] text-white text-sm px-5 py-2 rounded-full self-start md:self-auto">
          Download Invoice
        </button>
      </div>

      {/* Order Details */}
      <div className="border rounded-xl p-4 text-sm">
        <h3 className="text-lg font-medium mb-4">Order Details</h3>

        {/* Products */}
        <div className="border-b pb-4 mb-4">
          <p className="font-semibold mb-2">Products</p>
          <div className="space-y-4">
            {products.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">Owned by {item.owner}</p>
                  </div>
                </div>
                <p>${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>$00.00</p>
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <p>$00.00</p>
          </div>
          <div className="flex justify-between">
            <p>Coupon Discount</p>
            <p className="text-red-500">- $10.00</p>
          </div>
          <hr />
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>$44.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCompleted;
