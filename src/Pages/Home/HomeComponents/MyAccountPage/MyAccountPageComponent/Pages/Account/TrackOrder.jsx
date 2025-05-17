const TrackOrder = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <div className="text-center max-w-2xl w-full pt-10">
                <p className="mb-6 text-gray-700">
                    To track your order, please enter your Order ID in the box below and press the
                    <strong> "Track Order"</strong> button. This was given to you on your receipt and in the
                    confirmation email you should have received.
                </p>

                <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
                    <div>
                        <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                            Order ID *
                        </label>
                        <input
                            type="text"
                            id="orderId"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F4D34]"
                            placeholder="Enter your Order ID"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Billing Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F4D34]"
                            placeholder="Enter your billing email"
                        />
                    </div>

                    <button className="w-full bg-[#6F4D34] text-white py-2 rounded-md hover:bg-[#5c3f29] transition">
                        Track Order
                    </button>
                </div>
            </div>
        </div>


    )
};

export default TrackOrder