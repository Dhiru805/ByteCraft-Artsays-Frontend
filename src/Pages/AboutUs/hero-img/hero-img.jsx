const HeroImgAboutUs = () => {
  return (
    // Banner
    <div className="max-w-[1440px] mx-auto banner">
      <img
        src="/herosectionimg/store.png"
        className="w-full max-h-[200px] "
        alt="Banner"
      />

      <div className="w-full py-3 px-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
            <a href="#" className="hover:text-red-500">
              Home
            </a>
            <span>/</span>
            <a href="#" className="hover:text-red-500">
              Store
            </a>
            <span>/</span>
            <a href="#" className="hover:text-red-500">
              Paintings
            </a>
            <span>/</span>
            <span className="font-medium text-gray-900">Abstract</span>
          </nav>
        </div>
      </div>
    </div>
  );
};
export default HeroImgAboutUs;
