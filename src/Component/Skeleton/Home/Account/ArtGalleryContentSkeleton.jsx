const ArtGalleryContentSkeleton = () => {
  return (
    <div className="max-w-[1440px] mx-auto mb-4 animate-pulse">

      {/* Breadcrumb Skeleton */}
      <div className="w-full py-3 px-3">
        <div className="flex text-sm space-x-3 overflow-x-auto">
          <div className="h-4 w-10 bg-gray-300 rounded"></div>
          <span>/</span>
          <div className="h-4 w-10 bg-gray-300 rounded"></div>
          <span>/</span>
          <div className="h-4 w-14 bg-gray-300 rounded"></div>
          <span>/</span>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3 px-3">
        <div className="md:col-span-3">
          <div className="h-8 w-40 bg-gray-300 rounded"></div>
        </div>
      </div>

      <hr className="my-3 border-dark" />

      {/* Body Skeleton */}
      <div className="px-3">

        {/* Description Skeleton */}
        <div className="mt-3 space-y-3">
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map((item) => (
            <div
              key={item}
              className="border p-3 rounded shadow space-y-3"
            >
              <div className="h-5 w-32 bg-gray-300 rounded"></div>
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-5 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

        {/* Section Title Skeleton */}
        <div className="mt-10">
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
        </div>

        <hr className="my-3 border-dark" />

        {/* Section Description Skeleton */}
        <div className="space-y-3 mt-3">
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-4/5 bg-gray-300 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ArtGalleryContentSkeleton;