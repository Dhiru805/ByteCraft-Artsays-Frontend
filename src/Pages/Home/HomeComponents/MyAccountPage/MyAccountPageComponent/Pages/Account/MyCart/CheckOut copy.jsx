import React, { useState } from "react";

const CheckOut = () => {
  const [deliveryAddress, setDeliveryAddress] = useState("same");

  return (
    <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 py-10">
      <div className="lg:flex lg:gap-8 gap-8">
        {/* Billing Form */}
        <div className="lg:col-span-2 w-full">
          <h2 className="text-3xl font-semibold mb-6">Billing Details</h2>

          <form className="space-y-4">
            {/* Name fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  defaultValue="Nelson"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  defaultValue="Doley"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2"
                />
              </div>
            </div>

            {/* Other fields... */}
            {/* Company name */}
            <div>
              <label className="block text-lg font-medium mb-1">Company Name (Optional)</label>
              <input
                type="text"
                placeholder="Enter Company Name"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-lg font-medium mb-1">Country *</label>
              <select className="w-full border border-gray-300 rounded-xl px-4 py-2">
                <option>Select Country</option>
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
              </select>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-lg font-medium mb-1">Street Address *</label>
              <input
                type="text"
                placeholder="Enter Street Address"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-lg font-medium mb-1">City *</label>
              <select className="w-full border border-gray-300 rounded-xl px-4 py-2">
                <option>Select City</option>
                <option>New York</option>
                <option>Mumbai</option>
                <option>Delhi</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-lg font-medium mb-1">State *</label>
              <select className="w-full border border-gray-300 rounded-xl px-4 py-2">
                <option>Select State</option>
                <option>Maharashtra</option>
                <option>California</option>
                <option>Texas</option>
              </select>
            </div>

            {/* Zip */}
            <div>
              <label className="block text-lg font-medium mb-1">Zip Code *</label>
              <input
                type="text"
                placeholder="Enter Zip Code"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-lg font-medium mb-1">Phone Number *</label>
              <input
                type="text"
                placeholder="Enter Phone Number"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-lg font-medium mb-1">Email *</label>
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-lg font-medium mb-2">Delivery Address *</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryAddress === "same"}
                    onChange={() => setDeliveryAddress("same")}
                  />
                  Same as shipping address
                </label>
                <label className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryAddress === "different"}
                    onChange={() => setDeliveryAddress("different")}
                  />
                  Use a different billing address
                </label>
              </div>
            </div>
          </form>
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
    </div>
  );
};

export default CheckOut;
