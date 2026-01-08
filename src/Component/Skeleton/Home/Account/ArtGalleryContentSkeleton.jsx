import React from "react";

const ArtGalleryContentSkeleton = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins] animate-pulse">
      <div className="w-full max-w-[1440px] mx-auto p-3">
        {/* Main Content Skeleton */}
        <main className="w-full">
          {/* Search Bar Skeleton */}
          <div className="h-16 bg-white border border-gray-200 rounded-full mb-8 max-w-4xl mx-auto"></div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm">
                <div className="aspect-square bg-gray-100"></div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-100 rounded"></div>
                    <div className="h-4 w-12 bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-6 w-full bg-gray-100 rounded"></div>
                  <div className="h-4 w-32 bg-gray-100 rounded"></div>
                  <div className="flex justify-between pt-4 border-t border-gray-50">
                    <div className="h-8 w-24 bg-gray-100 rounded"></div>
                    <div className="h-8 w-16 bg-gray-100 rounded"></div>
                  </div>
                  <div className="grid grid-cols-5 gap-3 pt-2">
                    <div className="h-14 bg-gray-100 rounded-2xl"></div>
                    <div className="col-span-4 h-14 bg-gray-100 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArtGalleryContentSkeleton;
