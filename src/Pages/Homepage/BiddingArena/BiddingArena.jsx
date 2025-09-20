import { MdVerified } from "react-icons/md";
import { Bell } from "lucide-react";
const BiddingArena = () => {
  return (
      <div className="max-w-[1440px] mx-auto py-4 px-3">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
            {/* title */}
            <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
              Bidding Arena
            </h1>
            <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
              Explore More Products
            </button>
          </div>

          <hr className="my-3 border-dark" />

          {/* Subtitle */}
          <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
            At ArtSays, we make it simple for you to collaborate directly with
            talented artists and bring your creative vision to life.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-4">
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 bg-red-500 left-3 text-white text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Upcoming
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Bell Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Dhiraj Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="grid items-center gap-1 mt-2">
                  <br />
                  <span className="text-red-500 font-semibold text-md sm:text-lg">
                    Starting Price: ₹5,000
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-xs text-dark py-2 font-semibold add-cart">
                    2 Day Left
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Remind Me
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Hot Deal
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Bell Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <span className="text-orange-500 font-semibold text-sm">
                  Ending Soon!
                </span>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Dhiraj Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="grid items-center gap-1">
                  <span className="text-black-500 font-semibold text-md sm:text-md">
                    Starting Price: ₹5,000
                  </span>
                  <span className="text-red-500 font-semibold text-md sm:text-lg">
                    Highest Bid: ₹5,000
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-xs rounded-full text-dark py-2 font-semibold add-cart">
                    2 Hrs 46 Mins
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Place Your Bid
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Ending Soon
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Bell Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <span className="text-orange-500 font-semibold text-sm">
                  Ending Soon!
                </span>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Dhiraj Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="grid items-center gap-1">
                  <span className="text-black-500 font-semibold text-md sm:text-md">
                    Starting Price: ₹5,000
                  </span>
                  <span className="text-red-500 font-semibold text-md sm:text-lg">
                    Highest Bid: ₹5,000
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-xs rounded-full text-dark py-2 font-semibold add-cart">
                    2 Hrs 46 Mins
                  </button>
                  {/* Disable button bcoz bid ended */}
                  <button className="flex-1 bg-gray-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Place Your Bid
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 bg-red-500 left-3 text-white text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Upcoming
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Bell Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Dhiraj Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="grid items-center gap-1 mt-2">
                  <br />
                  <span className="text-red-500 font-semibold text-md sm:text-lg">
                    Starting Price: ₹5,000
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-xs text-dark py-2 font-semibold add-cart">
                    2 Day Left
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Remind Me
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Hot Deal
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Bell Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <span className="text-orange-500 font-semibold text-sm">
                  Ending Soon!
                </span>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Dhiraj Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="grid items-center gap-1">
                  <span className="text-black-500 font-semibold text-md sm:text-md">
                    Starting Price: ₹5,000
                  </span>
                  <span className="text-red-500 font-semibold text-md sm:text-lg">
                    Highest Bid: ₹5,000
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-xs rounded-full text-dark py-2 font-semibold add-cart">
                    2 Hrs 46 Mins
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Place Your Bid
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Ending Soon
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Bell Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <span className="text-orange-500 font-semibold text-sm">
                  Ending Soon!
                </span>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Dhiraj Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="grid items-center gap-1">
                  <span className="text-black-500 font-semibold text-md sm:text-md">
                    Starting Price: ₹5,000
                  </span>
                  <span className="text-red-500 font-semibold text-md sm:text-lg">
                    Highest Bid: ₹5,000
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-xs rounded-full text-dark py-2 font-semibold add-cart">
                    2 Hrs 46 Mins
                  </button>
                  {/* Disable button bcoz bid ended */}
                  <button className="flex-1 bg-gray-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Place Your Bid
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 bg-red-500 left-3 text-white text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Upcoming
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Bell Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Dhiraj Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="grid items-center gap-1 mt-2">
                  <br />
                  <span className="text-red-500 font-semibold text-md sm:text-lg">
                    Starting Price: ₹5,000
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-xs text-dark py-2 font-semibold add-cart">
                    2 Day Left
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Remind Me
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Hot Deal
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Bell Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <span className="text-orange-500 font-semibold text-sm">
                  Ending Soon!
                </span>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Dhiraj Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="grid items-center gap-1">
                  <span className="text-black-500 font-semibold text-md sm:text-md">
                    Starting Price: ₹5,000
                  </span>
                  <span className="text-red-500 font-semibold text-md sm:text-lg">
                    Highest Bid: ₹5,000
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-xs rounded-full text-dark py-2 font-semibold add-cart">
                    2 Hrs 46 Mins
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Place Your Bid
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
  );
};
export default BiddingArena;
