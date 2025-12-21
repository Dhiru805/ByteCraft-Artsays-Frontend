const ProductRequestSkeleton = () => {
  return (
    <div className="p-4 animate-pulse">
      
      {/* Header */}
      <div className="mb-6">
        <div className="h-7 w-48 bg-gray-300 rounded mb-3"></div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-6 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>

        <div className="flex justify-end mt-4">
          <div className="h-9 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded shadow p-5">

        {/* Show Entries Dropdown */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-4 w-14 bg-gray-300 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-14 bg-gray-300 rounded"></div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className="px-4 py-3">
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="border-b">
                  
                  {/* # */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </td>

                  {/* Name with Avatar */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                      <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-300 rounded"></div>
                      <div className="h-8 w-8 bg-gray-300 rounded"></div>
                      <div className="h-8 w-8 bg-gray-300 rounded"></div>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-6">
          <div className="flex gap-3">
            <div className="h-9 w-20 bg-gray-300 rounded"></div>
            <div className="h-9 w-10 bg-gray-300 rounded"></div>
            <div className="h-9 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductRequestSkeleton