const BuyerWalletSkeleton = () => {
  return (
    <div className="w-full px-4 py-6 animate-pulse">

      {/* Header */}
      <div className="w-40 h-6 bg-gray-300 rounded mb-6"></div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-200 rounded-lg p-4 shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <div className="w-24 h-3 bg-gray-300 mb-2 rounded"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Money + Withdraw */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* Add Money */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-40 h-5 bg-gray-300 rounded mb-4"></div>
          <div className="w-full h-10 bg-gray-200 rounded mb-4"></div>

          <div className="flex gap-3">
            <div className="w-24 h-10 bg-gray-300 rounded"></div>
            <div className="w-32 h-10 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Withdraw */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-40 h-5 bg-gray-300 rounded mb-4"></div>

          {/* Amount */}
          <div className="w-full h-10 bg-gray-200 rounded mb-4"></div>

          {/* Method Dropdown */}
          <div className="w-full h-10 bg-gray-200 rounded mb-4"></div>

          {/* Dynamic Inputs */}
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-10 bg-gray-200 rounded"></div>
            ))}
          </div>

          <div className="w-full h-10 bg-gray-300 rounded mt-4"></div>
          <div className="w-48 h-3 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">

        {/* Header with page size */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="w-40 h-5 bg-gray-300 rounded"></div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-4 bg-gray-300 rounded"></div>
            <div className="w-20 h-8 bg-gray-300 rounded"></div>
            <div className="w-10 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="p-3">
                    <div className="w-20 h-4 bg-gray-300 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5].map(row => (
                <tr key={row}>
                  {Array.from({ length: 6 }).map((_, col) => (
                    <td key={col} className="p-3">
                      <div className="w-full h-4 bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BuyerWalletSkeleton;
