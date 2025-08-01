import { ClipboardList, ClipboardCheck, Box, Truck, BadgeCheck } from "lucide-react";
import { CiSquareCheck } from "react-icons/ci";
import { FaTruckFast } from "react-icons/fa6";
import { BsCheckLg } from "react-icons/bs";


const steps = [
    { label: "Order Placed", icon: <ClipboardList size={24} />, status: "complete" },
    { label: "Accepted", icon: <ClipboardCheck size={24} />, status: "complete" },
    { label: "In Progress", icon: <Box size={24} />, status: "complete" },
    { label: "On the Way", icon: <FaTruckFast size={24} />, status: "complete" },
    { label: "Delivered", icon: <BadgeCheck size={24} />, status: "pending" },
];

const products = [
    {
        title: "Golden Era Paintings",
        owner: "Celebrated Classics",
        image: "https://via.placeholder.com/48",
        price: "$44.00",
    },
    {
        title: "Golden Era Paintings",
        owner: "Celebrated Classics",
        image: "https://via.placeholder.com/48",
        price: "$44.00",
    },
    {
        title: "Golden Era Paintings",
        owner: "Celebrated Classics",
        image: "https://via.placeholder.com/48",
        price: "$44.00",
    },
];

const OrderStatus = () => {
    // Find the last completed step index
    const lastCompleteIndex = steps.reduce((acc, step, idx) => step.status === "complete" ? idx : acc, -1);

    return (
        <div className="max-w-[1464px] px-0 sm:px-6 lg:px-12 pt-10 text-lg">
            <h2 className="text-xl font-semibold mb-2">Order Status</h2>
            <p className="text-gray-500 mb-6 text-sm">
                Order ID : <span className="font-medium">#SDGT1254FD</span>
            </p>

            {/* Horizontal Order Progress */}
            <div className="hidden sm:block bg-white border border-gray-200 rounded-lg lg:px-[109px] lg:py-[30px] mb-6">
                <div className="flex flex-col items-center lg:px-0 lg:py-0 md:px-10 md:py-10">
                    {/* UPPER: Steps with icons */}
                    <div className="flex justify-between w-full mb-4 ">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div
                                    className={`md:w-[40px] md:h-[40px] flex items-center justify-center bg-white text-[#000000]`}
                                >
                                    {step.icon}
                                </div>
                                <p className="lg:mt-2 text-sm text-gray-800">{step.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* LOWER: Progress Bar with Checkboxes */}
                    <div className="w-full px-8 ">
                        <div className="relative w-full">
                            <div className="flex justify-between items-center">
                                <div className="relative w-full h-1 bg-gray-300">
                                    {/* Progress Fill */}
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-[#6F4D34] transform -translate-y-1/2 rounded-full z-0 transition-all duration-500"
                                        style={{
                                            width: `${((lastCompleteIndex + 1) / steps.length) * 100}%`,
                                        }}
                                    />
                                    {/* Steps */}
                                    {steps.map((step, idx) => (
                                        <div
                                            key={idx}
                                            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                                            style={{ left: `${(idx / (steps.length - 1)) * 100}%` }}
                                        >
                                            <BsCheckLg
                                                className={`text-white w-7 h-7 p-1 font-semibold rounded-[5px] ${step.status === "complete" ? "bg-[#6F4D34]" : "bg-gray-400"
                                                    }`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vertical Order Progress */}
            <div className="relative block sm:hidden bg-white border border-gray-200 rounded-lg mb-6 px-4 py-4">
                {/* Vertical progress bar container */}
                <div className="absolute right-[35px] top-[38px] bottom-[62px] w-[4px] bg-gray-300 ">
                    <div
                        className="bg-[#6F4D34] w-full absolute top-0 rounded z-[0]"
                        style={{
                            height: `${(steps.filter(step => step.status === "complete").length - 1) / (steps.length - 1) * 110}%`,
                        }}
                    ></div>
                </div>

                {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between mb-6">
                        {/* Icon and Label */}
                        <div className="flex items-center gap-3 z-[10]">
                            <div
                                className="w-[40px] h-[40px] flex items-center justify-center text-[#000000] "

                            >
                                {step.icon}
                            </div>
                            <p className="text-sm text-gray-800">{step.label}</p>
                        </div>

                        {/* Check Icon */}
                        <BsCheckLg
                            className={`z-[10] text-white w-7 h-7 p-1 font-semibold rounded-[5px] ${step.status === "complete" ? "bg-[#6F4D34]" : "bg-gray-400"
                                }`}
                        />
                    </div>
                ))}
            </div>




            {/* Product List */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-4">Products</h3>
                <hr className="border-t border-gray-300 mb-4" />
                <div className="space-y-4">
                    {products.map((product, idx) => (
                        <div key={idx}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-md gap-3 pb-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={product.image}
                                        alt="Product"
                                        className="w-16 h-16 p-2 border border-gray-300 rounded-md object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{product.title}</p>
                                        <p className="text-xs text-gray-500 font-semibold">Owned by {product.owner}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-800 sm:text-right">{product.price}</p>
                            </div>
                            {/* Divider between items, except after last item */}
                            {idx !== products.length - 1 && <hr className="border-t border-gray-200" />}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default OrderStatus;
