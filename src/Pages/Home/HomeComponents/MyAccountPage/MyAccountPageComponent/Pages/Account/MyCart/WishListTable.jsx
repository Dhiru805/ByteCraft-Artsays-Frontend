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
    <div className="max-w-6xl mx-auto p-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-yellow-200 text-left">
            <th className="py-4 px-4">Product</th>
            <th className="py-4 px-4">Prices</th>
            <th className="py-4 px-4">Quality</th>
            <th className="py-4 px-4">Subtotal</th>
            <th className="py-4 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-4 px-4 flex items-center gap-4">
                <button className="text-xl text-gray-600 hover:text-black">×</button>
                <img src={item.image} alt="product" className="w-12 h-12 object-cover rounded" />
                <div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">Owned by {item.owner}</p>
                </div>
              </td>
              <td className="py-4 px-4">${item.price.toFixed(2)}</td>
              <td className="py-4 px-4">{item.qualityDate}</td>
              <td className="py-4 px-4 text-rose-600">{item.status}</td>
              <td className="py-4 px-4">
                <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white px-5 py-2 rounded-full text-sm">
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">Wishlist link:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-full px-4 py-2 text-sm w-full md:w-80"
            value="https://www.example.com"
            readOnly
          />
          <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm rounded-full px-5 py-2">
            Copy Link
          </button>
        </div>
        <div className="flex items-center gap-4 justify-end">
          <button className="text-sm text-[#5C4033] underline hover:text-[#3e2c1e]">
            Clear Wishlist
          </button>
          <button className="bg-[#5C4033] hover:bg-[#4b3327] text-white text-sm rounded-full px-5 py-2">
            Add All to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistTable;
