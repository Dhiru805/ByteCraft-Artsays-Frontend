import React from 'react';

export const PolicySidebarSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className="w-full h-12 bg-gray-100 rounded-xl border border-gray-50 flex items-center justify-between px-4"
        >
          <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded-full w-4"></div>
        </div>
      ))}
    </div>
  );
};

export const PolicyContentSkeleton = () => {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 min-h-[500px] animate-pulse">
      {/* Badge Skeletons */}
      <div className="flex gap-4 mb-8">
        <div className="h-8 w-32 bg-gray-100 rounded-full"></div>
        <div className="h-8 w-40 bg-gray-100 rounded-full"></div>
      </div>

      {/* Title Skeleton */}
      <div className="h-12 md:h-16 w-3/4 bg-gray-100 rounded-2xl mb-8"></div>
      
      {/* Decorative Line Skeleton */}
      <div className="w-20 h-1.5 bg-gray-100 rounded-full mb-12"></div>

      {/* Paragraph Skeletons */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-50 rounded-full"></div>
          <div className="h-4 w-full bg-gray-50 rounded-full"></div>
          <div className="h-4 w-5/6 bg-gray-50 rounded-full"></div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="h-6 w-1/4 bg-gray-100 rounded-lg mb-4"></div>
          <div className="h-4 w-full bg-gray-50 rounded-full"></div>
          <div className="h-4 w-full bg-gray-50 rounded-full"></div>
          <div className="h-4 w-4/6 bg-gray-50 rounded-full"></div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="h-6 w-1/3 bg-gray-100 rounded-lg mb-4"></div>
          <div className="h-4 w-full bg-gray-50 rounded-full"></div>
          <div className="h-4 w-full bg-gray-50 rounded-full"></div>
          <div className="h-4 w-full bg-gray-50 rounded-full"></div>
          <div className="h-4 w-3/4 bg-gray-50 rounded-full"></div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-16 pt-8 border-t border-gray-50 flex justify-between items-center">
        <div className="h-4 w-48 bg-gray-50 rounded-full"></div>
        <div className="h-10 w-32 bg-gray-100 rounded-xl"></div>
      </div>
    </div>
  );
};
