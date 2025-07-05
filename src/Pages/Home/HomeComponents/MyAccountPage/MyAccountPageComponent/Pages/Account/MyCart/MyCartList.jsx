import React, { useState } from "react";

const initialProducts = [
  {
    id: 1,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    quantity: 1,
    image: "https://i.imgur.com/A1eDB3M.png",
  },
  {
    id: 2,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    quantity: 1,
    image: "https://i.imgur.com/EX3Z8Zz.png",
  },
  {
    id: 3,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    quantity: 1,
    image: "https://i.imgur.com/Ci1YZ4X.png",
  },
  {
    id: 4,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    quantity: 1,
    image: "https://i.imgur.com/Ci1YZ4X.png",
  },
];


const MyCart = () => {
  const [products, setProducts] = useState(initialProducts);
  const [coupon, setCoupon] = useState("");
  const couponDiscount = 10;

  const handleQuantity = (id, delta) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal - couponDiscount;

  return (
    <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 pt-10 text-lg">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-200 text-left">
                <th className="py-4 px-4 font-medium rounded-tl-xl rounded-bl-xl">Product</th>
                <th className="py-4 px-4 font-medium">Prices</th>
                <th className="py-4 px-4 font-medium">Quantity</th>
                <th className="py-4 px-4 font-medium rounded-tr-xl rounded-br-xl">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4 px-4 flex items-center gap-4">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-xl text-gray-600 hover:text-black"
                    >
                      ×
                    </button>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded border border-gray-300 p-2"
                    />
                    <div className="font-semibold">
                      <p className="text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">Owned by {item.owner}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">${item.price.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantity(item.id, -1)}
                        className="w-6 h-6 bg-gray-200 text-black rounded"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity(item.id, 1)}
                        className="w-6 h-6 bg-gray-200 text-black rounded"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[350px] border rounded-3xl p-4 text-lg h-fit text-gray-400 ">
          <h2 className="text-gray-800 text-xl font-semibold">Order Summary</h2>
          <hr className="my-2" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items</span>
              <span>10</span>
            </div>
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>$44.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$00.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$00.00</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Coupon Discount</span>
              <span className="text-red-500">- $10.00</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg text-gray-400">
              <span>Total</span>
              <span>$34.00</span>
            </div>
            <button className="w-full mt-4 bg-[#5C4033] hover:bg-[#4b3327] text-white py-2 rounded-full text-sm">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
      {/* Coupon and Clear */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Coupon Code"
            className="border border-gray-300 rounded-full px-4 py-3 w-full md:w-64 text-sm text-gray-700 bg-gray-100"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm px-4 py-2 rounded-full">
            Apply Coupon
          </button>
        </div>
        <button className="text-sm text-[#5C4033] underline hover:text-[#3e2c1e]">
          Clear Shopping Cart
        </button>
      </div>
    </div>
  );
};


export default MyCart;
