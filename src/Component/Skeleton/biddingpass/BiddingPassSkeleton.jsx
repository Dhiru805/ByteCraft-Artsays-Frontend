function BiddingPassSkeleton() {
  return (
    <div className="container-fluid mt-3 animate-pulse">
      {/* Header */}
      <div className="block-header mb-4">
        <div className="h-8 w-48 bg-gray-300 rounded"></div>

        <div className="flex items-center space-x-2 mt-2">
          <div className="h-4 w-6 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="row clearfix">
        {Array(3)
          .fill()
          .map((_, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card shadow-sm rounded-lg p-4">
                {/* Title + Radio */}
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="h-7 w-28 bg-gray-300 rounded"></div>
                  <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                </div>

                {/* Table Rows */}
                <div className="space-y-3">
                  {Array(12)
                    .fill()
                    .map((_, row) => (
                      <div
                        key={row}
                        className="flex justify-between items-start"
                      >
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                      </div>
                    ))}
                </div>

                {/* Price */}
                <div className="text-center mt-6">
                  <div className="h-8 w-24 bg-gray-300 rounded mx-auto"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded mx-auto mt-2"></div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Bottom Button */}
      <div className="pt-2 pb-4 text-center">
        <div className="h-10 w-48 bg-gray-300 rounded mx-auto"></div>
      </div>
    </div>
  );
}
export default BiddingPassSkeleton