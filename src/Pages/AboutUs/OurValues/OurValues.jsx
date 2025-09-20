const OurValues = () => {
  return (
    <div className="max-w-[1440px] mx-auto py-3">
      <div className="col-span-2 content-center">
        <h1 className="text-lg md:text-4xl font-bold text-orange-500 px-3">
          Our Values
        </h1>

        <hr className="my-3 border-dark" />

        <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
          ArtSays is a creator-first platform built for artists of every style,
          from digital dreamers to traditional painters. We believe that art is
          more than visuals — it’s stories, emotions, and connections. Our
          mission? To make sure every artist finds their stage and every
          audience finds art that speaks to them.
        </p>
        <div className="my-5">
          <main className="md:col-span-3 px-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:!gap-6">
              <div className="w-full mx-auto border rounded-2xl shadow-2xl p-3">
                {/* Premium Label */}
                <div className="relative">
                  {/* Product Image */}
                  <img
                    src="/herosectionimg/value1.svg"
                    alt="Beauty of Joseon Mandala Art"
                    className="w-full h-28 sm:h-44 object-contain rounded-t-2xl product-img"
                  />
                </div>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                  Celebrating every style & idea
                </h2>
              </div>

              <div className="w-full mx-auto border rounded-2xl shadow-2xl p-3">
                {/* Premium Label */}
                <div className="relative">
                  {/* Product Image */}
                  <img
                    src="/herosectionimg/value2.svg"
                    alt="Beauty of Joseon Mandala Art"
                    className="w-full h-28 sm:h-44 object-contain rounded-t-2xl product-img"
                  />
                </div>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                  Uplifting each other with respect
                </h2>
              </div>

              <div className="w-full mx-auto border rounded-2xl shadow-2xl p-3">
                {/* Premium Label */}
                <div className="relative">
                  {/* Product Image */}
                  <img
                    src="/herosectionimg/value3.svg"
                    alt="Beauty of Joseon Mandala Art"
                    className="w-full h-28 sm:h-44 object-contain rounded-t-2xl product-img"
                  />
                </div>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                  Real stories, real growth
                </h2>
              </div>

              <div className="w-full mx-auto border rounded-2xl shadow-2xl p-3">
                {/* Premium Label */}
                <div className="relative">
                  {/* Product Image */}
                  <img
                    src="/herosectionimg/value4.svg"
                    alt="Beauty of Joseon Mandala Art"
                    className="w-full h-28 sm:h-44 object-contain rounded-t-2xl product-img"
                  />
                </div>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                  Making art open to all
                </h2>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default OurValues;
