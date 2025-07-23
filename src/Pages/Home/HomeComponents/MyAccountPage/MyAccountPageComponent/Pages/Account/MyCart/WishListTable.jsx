import React from "react";

const products = [
  {
    id: 1,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    qualityDate: "15 June 2023",
    status: "In stock",
    image: "https://i.imgur.com/A1eDB3M.png",
  },
  {
    id: 2,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    qualityDate: "15 June 2023",
    status: "In stock",
    image: "https://i.imgur.com/EX3Z8Zz.png",
  },
  {
    id: 3,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    qualityDate: "15 June 2023",
    status: "In stock",
    image: "https://i.imgur.com/Ci1YZ4X.png",
  },
  {
    id: 4,
    title: "Golden Era Paintings",
    owner: "Celebrated Classics",
    price: 44.0,
    qualityDate: "15 June 2023",
    status: "In stock",
    image: "https://i.imgur.com/Ci1YZ4X.png",
  },
];

const WishlistTable = () => {
  return (
    <div className="max-w-[1464px] w-full px-4 sm:px-6 lg:px-12 pt-10 text-lg overflow-hidden">
      {/* Responsive Scrollable Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-yellow-200 text-left">
              <th className="py-4 px-4 font-medium rounded-tl-xl rounded-bl-xl">Product</th>
              <th className="py-4 px-4 font-medium">Prices</th>
              <th className="py-4 px-4 font-medium">Quality</th>
              <th className="py-4 px-4 font-medium">Subtotal</th>
              <th className="py-4 px-4 rounded-tr-xl rounded-br-xl text-right"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-4 px-4 flex items-center gap-4 min-w-[200px]">
                  <button className="text-xl text-gray-600 hover:text-black">×</button>
                  <img
                    src={item.image}
                    alt="product"
                    className="w-12 h-12 object-cover rounded border border-gray-300 p-2"
                  />
                  <div className="font-semibold">
                    <p className="text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500">Owned by {item.owner}</p>
                  </div>
                </td>
                <td className="py-4 px-4">${item.price.toFixed(2)}</td>
                <td className="py-4 px-4">{item.qualityDate}</td>
                <td className="py-4 px-4">{item.status}</td>
                <td className="py-4 px-4 text-right">
                  <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 gap-4 w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
          <label className="text-sm text-gray-600 whitespace-nowrap underline">
            Wishlist link:
          </label>
          <input
            type="text"
            className="border border-gray-300 text-gray-400 rounded-full px-4 py-3 text-sm w-full sm:w-80"
            value="https://www.example.com"
            readOnly
          />
          <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm rounded-full px-4 py-2">
            Copy Link
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-end w-full md:w-auto">
          <button className="text-sm text-[#5C4033] underline hover:text-[#3e2c1e]">
            Clear Wishlist
          </button>
          <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm rounded-full px-4 py-2">
            Add All to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistTable;
