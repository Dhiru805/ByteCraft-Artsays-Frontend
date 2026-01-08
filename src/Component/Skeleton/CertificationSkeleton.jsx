import React from "react";

const CertificationSkeleton = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins] py-8 animate-pulse">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <aside className="w-full lg:w-[300px] shrink-0">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="h-7 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>

              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                </div>
              ))}

              <div className="bg-gray-200 h-48 rounded-2xl shadow-sm"></div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-grow space-y-8">
            {/* Search and Header Skeleton */}
            <div className="space-y-4">
              <div className="h-14 bg-white border border-gray-200 rounded-2xl shadow-sm"></div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="w-20 h-1.5 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Verified Certificates Skeleton */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="min-w-[280px] md:min-w-[320px] bg-white h-64 rounded-[32px] border border-gray-100 shadow-sm shrink-0"></div>
                ))}
              </div>
            </div>

            {/* Benefits Section Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-2"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white h-56 rounded-[32px] border border-gray-100 shadow-sm p-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Path Section Skeleton */}
            <div className="space-y-12">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                <div className="w-20 h-1.5 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="space-y-12">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col lg:flex-row gap-8 items-center bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <div className="w-full lg:w-2/5 aspect-[4/3] bg-gray-200 rounded-2xl"></div>
                    <div className="w-full lg:w-3/5 space-y-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CertificationSkeleton;
