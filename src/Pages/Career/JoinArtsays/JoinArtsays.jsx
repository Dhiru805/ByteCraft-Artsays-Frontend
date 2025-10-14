import React, { useState } from "react";

const JoinArtsays = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
      {/* Top Section: Breadcrumb + Search */}
      <div className="w-full py-3 px-3">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
        {/* title */}
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
          Join ArtSays
        </h1>
        <button className="hidden md:block w-[200px] place-self-end flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
          Explore More
        </button>
      </div>

      <hr className="my-3 border-dark" />

      {/* Subtitle */}
      <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
        At Artsays, we’re building more than just a platform — we’re shaping the
        future of how art is shared, discovered, and celebrated. We believe in
        creativity, collaboration, and growth. If you’re passionate about
        design, technology, and empowering artists worldwide, this is your
        place.
      </p>

      <div className="my-5">

        <main className="md:col-span-3 px-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* <!-- Product Card --> */}

            <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
              {/* Premium Label */}
              <div className="relative">
                {/* Product Image */}
                <img
                  src="/herosectionimg/art-focused.png"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
                />
              </div>
              <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                100% Art-Focused
              </h2>
            </div>

            <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
              {/* Premium Label */}
              <div className="relative">
                {/* Product Image */}
                <img
                  src="/herosectionimg/art-focused.png"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
                />
              </div>
              <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                100% Art-Focused
              </h2>
            </div>

            <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
              {/* Premium Label */}
              <div className="relative">
                {/* Product Image */}
                <img
                  src="/herosectionimg/art-focused.png"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
                />
              </div>
              <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                100% Art-Focused
              </h2>
            </div>

            <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
              {/* Premium Label */}
              <div className="relative">
                {/* Product Image */}
                <img
                  src="/herosectionimg/art-focused.png"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
                />
              </div>
              <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                100% Art-Focused
              </h2>
            </div>

            <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
              {/* Premium Label */}
              <div className="relative">
                {/* Product Image */}
                <img
                  src="/herosectionimg/art-focused.png"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
                />
              </div>
              <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                100% Art-Focused
              </h2>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default JoinArtsays;
