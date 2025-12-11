export default function SectionSkeleton() {
  return (
    <div className="bg-[#F8F8F8] animate-pulse">
      <div className="max-w-[1440px] mx-auto py-4 px-3">
        
        {/* Heading + Button */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
          <div className="md:col-span-3 h-10 bg-gray-300 rounded px-3"></div>

          <div className="hidden md:block h-10 bg-gray-300 rounded-full"></div>
        </div>

        <hr className="my-3 border-dark" />

        {/* Description */}
        <div className="mt-3 space-y-2 px-3">
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-4/6"></div>
          <div className="h-3 bg-gray-300 rounded w-3/6"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-64 bg-gray-200 rounded-xl shadow" />
          ))}
        </div>
      </div>
    </div>
  );
}
