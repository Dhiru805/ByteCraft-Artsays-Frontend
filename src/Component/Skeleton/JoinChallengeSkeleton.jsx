import React from "react";

const JoinChallengeSkeleton = () => {
  return (
    <div className="animate-pulse w-full bg-gray-50 min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Skeleton */}
          <main className="flex-1 space-y-6">
            {/* Header Section Skeleton */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="w-20 h-1.5 bg-gray-200 rounded-full mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Challenge Details Column Skeleton */}
              <div className="space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 h-full space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                  </div>

                  <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-24"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="h-24 bg-amber-50 rounded-2xl border border-amber-100"></div>

                    <div className="border-t border-gray-100 pt-6 space-y-4">
                      <div className="h-3 bg-gray-100 rounded w-32"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Form Column Skeleton */}
              <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
                <div className="text-center space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
                  <div className="h-4 bg-gray-100 rounded w-48 mx-auto"></div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-24"></div>
                        <div className="h-12 bg-gray-50 rounded-xl"></div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-24"></div>
                    <div className="h-12 bg-gray-50 rounded-xl"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-32"></div>
                    <div className="h-32 bg-gray-50 rounded-xl"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-32"></div>
                    <div className="h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl"></div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-100 rounded w-64"></div>
                  </div>

                  <div className="h-14 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default JoinChallengeSkeleton;
