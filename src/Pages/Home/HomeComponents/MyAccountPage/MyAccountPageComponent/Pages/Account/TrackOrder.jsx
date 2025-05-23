import OrderStatus from "./OrderStatus";
import { useState } from "react";

const TrackOrder = () => {
    const [showOrderStatus, setShowOrderStatus] = useState(false);
    return (
        <>
        {!showOrderStatus ? (
        <div className="flex justify-center items-center   ">
            <div className="w-full bg-white  rounded-lg space-y-6 ">
                <p className=" text-gray-500 text-lg font-medium">
                    To track your order please enter your Order ID in the box below and press the
                    "Track Order" button. This was given to you on your receipt and in the
                    confirmation email you should have received.
                </p>

                <div className="space-y-6">
                    <div className="space-y-1">
                        <label htmlFor="orderId" className="block text-lg font-medium text-gray-700 mb-1">
                            Order ID *
                        </label>
                        <input
                            type="text"
                            id="orderId"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl "
                            placeholder="Enter Your Order ID"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">
                            Billing Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl "
                            placeholder="Enter Email Address"
                        />
                    </div>

                    <button 
                    className=" bg-[#6F4D34] text-white py-2 px-4 rounded-full text-[17px] font-semibold transition"
                    onClick={() => setShowOrderStatus(true)}
                    >
                        Track Order
                    </button>
                </div>
            </div>
        </div>) : (

        <OrderStatus />
        )}
        </>
    );
};

export default TrackOrder;
