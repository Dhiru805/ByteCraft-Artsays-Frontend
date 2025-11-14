import React, { useState } from "react";

const LifeAtArtsays = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
        {/* title */}
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
          Life at ArtSays
        </h1>
      </div>

      <hr className="my-3 border-dark" />

      {/* Subtitle */}
      <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
        At Artsays, we’re more than just a team — we’re a creative family. Every
        day, we celebrate imagination, innovation, and inclusivity. Whether
        you’re coding a new feature, designing a fresh interface, or
        brainstorming the next big art challenge, you’ll find yourself
        surrounded by people who truly believe in the power of art.
      </p>

      <div className="my-5">
        <main className="md:col-span-3 px-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            <div className="order-2 sm:order-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
            <div className="order-1 sm:!order-2 flex justify-center items-center">
              <img src="/herosectionimg/lifeAt.svg" alt="" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default LifeAtArtsays;
