import { ClipboardCheck, ClipboardList, Box, Truck, BadgeCheck } from "lucide-react";

const steps = [
    { label: "Order Placed", icon: <ClipboardList size={34} />, status: "complete" },
    { label: "Accepted", icon: <ClipboardCheck size={34} />, status: "pending" },
    { label: "In Progress", icon: <Box size={34} />, status: "pending" },
    { label: "On the Way", icon: <Truck size={34} />, status: "pending" },
    { label: "Delivered", icon: <BadgeCheck size={34} />, status: "pending" },
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
        <div className="">
            <h2 className="text-xl font-semibold mb-1">Order Status</h2>
            <p className="text-gray-500 mb-6 text-sm">
                Order ID : <span className="font-medium">#SDGT1254FD</span>
            </p>

            {/* Order Progress */}
            <div className="bg-white border-[0.6px] rounded-[12px] py-10 px-4 mb-8">
                {/* UPPER: Steps with icons */}
                <div className="flex justify-between mb-6">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center w-1/5">
                            <div
                                className="text-[40px] "
                            >
                                {/* className={`w-10 h-10 flex items-center justify-center rounded-full ${step.status === "complete" ? "bg-[#6F4D34] text-white" : "bg-gray-100 text-gray-400"}`} */}
                                {step.icon}
                            </div>
                            <p className="mt-2 text-sm">{step.label}</p>
                        </div>
                    ))}
                </div>

                {/* LOWER: Progress Bar */}
                <div className="relative h-1">
                    {/* Base Line */}
                    <div className="absolute left-28 right-28 top-0 h-1 bg-gray-300 rounded-full z-0" />

                    {/* Progress Line */}
                    <div
                        className="absolute left-28 top-0 h-1 bg-[#6F4D34] rounded-full z-10 transition-all duration-500"
                        style={{
                            width: `calc(${(lastCompleteIndex / (steps.length - 1)) * 100}% + ${(100 / (steps.length - 1)) / 2}%)`,
                        }}
                    />
                </div>
            </div>

            {/* Product List */}
            <div className="bg-white border-[0.6px] rounded-[12px] p-4">
                <h3 className="text-sm font-medium mb-4">Products</h3>

                {/* Horizontal line above the first product */}
                <hr className="border-t border-gray-300 mb-2" />

                <div className="divide-y">
                    {products.map((product, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={product.image}
                                    alt="Product"
                                    className="w-12 h-12 p-1 border border-gray-300 rounded-md object-cover"
                                />
                                <div>
                                    <p className="text-sm font-medium">{product.title}</p>
                                    <p className="text-xs text-gray-500">Owned by {product.owner}</p>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-800">{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default OrderStatus;
