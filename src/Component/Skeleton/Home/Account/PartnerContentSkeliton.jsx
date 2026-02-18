import React from "react";

const PartnerContentSkeliton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* SIDEBAR SKELETON */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="h-7 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
          </div>

          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded w-full"></div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-gray-200 h-48 rounded-2xl shadow-sm"></div>
        </aside>

        {/* MAIN CONTENT SKELETON */}
        <main className="flex-grow space-y-3">
          {/* Search Bar Skeleton */}
          <div className="h-14 bg-white border border-gray-200 rounded-2xl shadow-sm mb-3"></div>

          {/* Header Skeleton */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100/50 space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            <div className="w-20 h-1.5 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          </div>

          {/* Content Sections Skeleton */}
          <div className="space-y-12">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100/50 space-y-6"
              >
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-64 bg-gray-100 rounded-2xl w-full"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PartnerContentSkeliton;
