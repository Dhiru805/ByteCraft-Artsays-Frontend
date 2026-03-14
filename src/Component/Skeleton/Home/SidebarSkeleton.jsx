const SidebarSkeleton = () => {
  return (
    <div className="w-[260px] h-screen bg-white border-r animate-pulse flex flex-col">
      {/* Profile Section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-gray-300 rounded" />
            <div className="h-3 w-16 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between px-4 py-3 border-b">
        <div className="h-4 w-14 bg-gray-300 rounded" />
        <div className="h-5 w-5 bg-gray-300 rounded-full" />
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-300 rounded" />
            <div className="h-4 w-32 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      {/* Settings Section */}
      <div className="px-4 py-4 border-t space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-3 w-28 bg-gray-300 rounded" />
            <div className="w-10 h-5 bg-gray-300 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarSkeleton;
