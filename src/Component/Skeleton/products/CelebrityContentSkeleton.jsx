import React from "react";

const CelebrityContentSkeleton = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen animate-pulse font-[poppins]">
      {/* ---------------- CELEBRITY HERO SECTION SKELETON ---------------- */}
      <div className="relative w-full min-h-[400px] md:h-[500px] overflow-hidden flex items-center bg-gray-200">
        <div className="container mx-auto px-6 md:px-12 max-w-[1440px] relative z-10 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="h-8 w-40 bg-gray-300 rounded-full mx-auto md:mx-0"></div>
              
              <div className="space-y-3">
                <div className="h-16 md:h-20 w-3/4 bg-gray-300 rounded-2xl mx-auto md:mx-0"></div>
                <div className="h-10 w-32 bg-gray-300 rounded-full mx-auto md:mx-0"></div>
              </div>

              <div className="max-w-2xl space-y-3 border-l-4 border-gray-300 pl-6 py-2 mx-auto md:mx-0">
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-12">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center md:text-left space-y-2">
                    <div className="h-10 w-16 bg-gray-300 rounded mx-auto md:mx-0"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded mx-auto md:mx-0"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Profile Image */}
            <div className="w-64 h-64 md:w-96 md:h-96 shrink-0 bg-gray-300 rounded-[40px] shadow-lg"></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto p-6">
        {/* Breadcrumb Skeleton */}
        <div className="h-14 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-4 w-4 bg-gray-100 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-4 bg-gray-100 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>

        {/* Journey Highlights Skeleton */}
        <div className="mb-12 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gray-300 rounded-full" />
            <div className="h-8 w-64 bg-gray-300 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          {/* SIDEBAR FILTERS SKELETON */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-7 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* MAIN CONTENT SKELETON */}
          <main className="flex-grow">
            <div className="mb-8 space-y-2">
              <div className="h-10 w-64 bg-gray-300 rounded"></div>
              <div className="h-5 w-48 bg-gray-200 rounded"></div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="h-14 bg-white border border-gray-100 rounded-3xl shadow-sm mb-8"></div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-6 space-y-4 flex flex-col flex-grow">
                    <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
                    <div className="h-7 w-3/4 bg-gray-200 rounded"></div>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="h-8 w-24 bg-gray-300 rounded"></div>
                      <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-5 gap-3 pt-2">
                      <div className="col-span-1 h-12 bg-gray-100 rounded-2xl"></div>
                      <div className="col-span-4 h-12 bg-gray-200 rounded-2xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CelebrityContentSkeleton;
