import React from 'react';

const CustomRequest = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Custom Request</h2>
        <button className="bg-[#5F3E2D] text-white px-4 py-2 rounded">+ Add Request</button>
      </div>
      <div className="border rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Buyer Request List</span>
          <input type="text" placeholder="Search" className="border p-2 rounded" />
        </div>
        <table className="w-full text-sm text-left border">
          <thead>
            <tr className="border-b">
              <th className="p-2">#</th>
              <th className="p-2">Product Name</th>
              <th className="p-2">Artist Name</th>
              <th className="p-2">Max Budget</th>
              <th className="p-2">Min Budget</th>
              <th className="p-2">Negotiated</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">1</td>
              <td className="p-2">Test</td>
              <td className="p-2">Nayan Raje</td>
              <td className="p-2">₹ 40.00</td>
              <td className="p-2">₹ 40.00</td>
              <td className="p-2">₹ NaN</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomRequest;
