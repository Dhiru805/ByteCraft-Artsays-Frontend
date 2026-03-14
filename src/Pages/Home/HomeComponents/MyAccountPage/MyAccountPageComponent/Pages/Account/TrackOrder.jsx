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
        <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    Track Your Order
                </h1>
            </div>

            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-[#5C4033]/10 rounded-2xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#5C4033]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Order Tracking</h3>
                        <p className="text-sm text-gray-500">
                            To track your order please enter your Order ID in the box below and press the
                            "Track Order" button. This was given to you on your receipt and in the
                            confirmation email you should have received.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="orderId" className="block text-sm font-semibold text-gray-700 mb-2">
                            Order ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="orderId"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                            placeholder="Enter Your Order ID"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Billing Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                            placeholder="Enter Email Address"
                        />
                    </div>

                    <button 
                        className="group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden disabled:opacity-50"
                        onClick={handleTrackOrder}
                        disabled={loading}
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
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
