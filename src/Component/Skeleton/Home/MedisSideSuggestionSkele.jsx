const MediaSideSuggestionSkele = () => {
  return (
    <div className="sticky top-0 overflow-y-auto lg:h-full hidden lg:block col-span-3 px-2 py-2 my-4 animate-pulse">
      {/* Title */}
      <div className="h-5 w-40 bg-gray-300 rounded mb-4 ml-1" />

      {/* Suggested Users */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex justify-between items-center mb-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gray-300 rounded-full" />
            <div className="space-y-1">
              <div className="h-3 w-24 bg-gray-300 rounded" />
              <div className="h-2 w-16 bg-gray-300 rounded" />
            </div>
          </div>
          <div className="h-7 w-16 bg-gray-300 rounded-lg" />
        </div>
      ))}

      <div className="h-px bg-gray-300 my-3" />

      {/* Ad Section */}
      <div className="space-y-3">
        <div className="h-40 w-full bg-gray-300 rounded-xl" />
        <div className="h-10 w-full bg-gray-300 rounded-xl" />
      </div>
    </div>
  );
};

export default MediaSideSuggestionSkele;
