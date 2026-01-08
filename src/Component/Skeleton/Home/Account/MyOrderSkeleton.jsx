export const MyOrderSkeleton = () => {
  return (
    <div className="w-full max-w-[1076px] mx-auto px-4 space-y-6">

      {/* HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="relative">
            <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* ORDER CARD SKELETONS */}
      {[1, 2, 3].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          {/* TOP BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-gray-300/30 p-3 animate-pulse">
            <div className="space-y-1">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* PRODUCT ROW */}
          <div className="p-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>

              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-28 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="flex-1 text-right space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse ml-auto"></div>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 px-3 py-3">
            <div className="flex gap-2">
              <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
