import OrderStatus from "./OrderStatus";
import { useState } from "react";
import postAPI from "../../../../../../../api/postAPI";
import { toast } from "react-toastify";

const TrackOrder = () => {
    const [showOrderStatus, setShowOrderStatus] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrackOrder = async () => {
        if (!orderId.trim()) {
            toast.error("Please enter your Order ID");
            return;
        }
        if (!email.trim()) {
            toast.error("Please enter your Billing Email");
            return;
        }

        try {
            setLoading(true);
            const res = await postAPI("/api/buyer-order-list/track", { orderId: orderId.trim(), email: email.trim() }, {}, false);
            if (res?.data?.success && res?.data?.data) {
                setOrderData(res.data.data);
                setShowOrderStatus(true);
            } else {
                toast.error(res?.data?.message || "Order not found");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "No order found with the provided Order ID and email";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setShowOrderStatus(false);
        setOrderData(null);
    };

    return (
        <>
        {!showOrderStatus ? (
        <div className="flex justify-center items-center">
            <div className="w-full bg-white rounded-lg space-y-6 ">
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
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl "
                            placeholder="Enter Email Address"
                        />
                    </div>

                    <button 
                        className="bg-[#6F4D34] text-white py-2 px-4 rounded-full text-[17px] font-semibold transition disabled:opacity-50"
                        onClick={handleTrackOrder}
                        disabled={loading}
                    >
                        {loading ? "Tracking..." : "Track Order"}
                    </button>
                </div>
            </div>
        </div>) : (
            <OrderStatus order={orderData} onBack={handleBack} />
        )}
        </>
    );
};

export default TrackOrder;
