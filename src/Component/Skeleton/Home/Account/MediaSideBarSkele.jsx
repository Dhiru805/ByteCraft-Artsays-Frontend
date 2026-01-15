const MediaSideBarSkele = () => {
  return (
    <>
      {/* Sidebar */}
      <div className="w-[22%] mx-auto flex animate-pulse">
        {/* Icon column */}
        <div className="flex flex-col items-center gap-4 py-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-lg bg-gray-300"
            />
          ))}
        </div>

        {/* Expanded labels */}
        <div className="ml-4 flex flex-col justify-between w-full py-6">
          <div className="space-y-4">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-full rounded-lg bg-gray-300"
              />
            ))}
          </div>

          {/* Pin button */}
          <div className="h-8 w-10 bg-gray-300 rounded-lg self-end" />
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 animate-pulse">
        <ul className="flex justify-around py-3">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="w-8 h-8 bg-gray-300 rounded-full" />
          ))}
        </ul>
      </nav>

      {/* Profile Slide Menu */}
      <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-lg animate-pulse">
        <div className="flex flex-col items-center p-6 gap-3">
          <div className="w-20 h-20 bg-gray-300 rounded-full" />
          <div className="h-4 w-32 bg-gray-300 rounded" />
          <div className="h-3 w-20 bg-gray-300 rounded" />
        </div>

        <div className="px-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-full bg-gray-300 rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 animate-pulse" />
    </>
  );
};

export default MediaSideBarSkele;
