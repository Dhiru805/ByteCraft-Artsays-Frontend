const MyCartListSkeleton = () => {
  return (
    <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 pt-10 text-lg animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* CART TABLE SKELETON */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-200 text-left">
                {[1, 2, 3, 4].map((h) => (
                  <th
                    key={h}
                    className="py-4 px-4 font-medium"
                  >
                    <div className="w-24 h-4 bg-gray-300 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row} className="border-b">
                  {/* PRODUCT */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">

                      {/* REMOVE BTN */}
                      <div className="w-5 h-5 bg-gray-300 rounded"></div>

                      {/* IMAGE */}
                      <div className="w-12 h-12 bg-gray-300 rounded"></div>

                      {/* NAME */}
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-gray-300 rounded"></div>
                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="py-4 px-4">
                    <div className="w-16 h-4 bg-gray-300 rounded"></div>
                  </td>

                  {/* QUANTITY */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    </div>
                  </td>

                  {/* SUBTOTAL */}
                  <td className="py-4 px-4">
                    <div className="w-20 h-4 bg-gray-300 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY SKELETON */}
        <div className="w-full lg:w-[350px] border rounded-3xl p-4 text-lg h-fit">
          <div className="w-40 h-5 bg-gray-300 rounded mb-4"></div>

          <hr className="my-2" />

          {/* ITEM LIST */}
          <div className="space-y-3 mb-4">
            {[1, 2].map(i => (
              <div key={i} className="flex justify-between">
                <div className="w-40 h-4 bg-gray-300 rounded"></div>
                <div className="w-10 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>

          <hr className="my-2" />

          {/* TOTAL ITEMS */}
          <div className="flex justify-between mt-2">
            <div className="w-24 h-4 bg-gray-300 rounded"></div>
            <div className="w-6 h-4 bg-gray-300 rounded"></div>
          </div>

          {/* TOTAL PRICE */}
          <div className="flex justify-between mt-3">
            <div className="w-24 h-5 bg-gray-300 rounded"></div>
            <div className="w-16 h-5 bg-gray-300 rounded"></div>
          </div>

          {/* BUTTON */}
          <div className="w-full h-10 bg-gray-300 rounded-full mt-4"></div>
        </div>

      </div>

      {/* CLEAR CART BUTTON SKELETON */}
      <div className="mt-6">
        <div className="w-40 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default MyCartListSkeleton;
