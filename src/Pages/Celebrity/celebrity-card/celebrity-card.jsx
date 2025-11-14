import { useState, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import { ImArrowUpRight2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

import getAPI from "../../../api/getAPI";

const CelebrityCard = () => {

  const navigate = useNavigate()

  const [showFilters, setShowFilters] = useState(false);
  const [celebritiesData, setCelebritiesData] = useState([])

  const fetchCelebritiesData = async () => {
    try {

      const response = await getAPI("/api/celebrities")
      if (response?.hasError === false) {
        setCelebritiesData(response?.data?.data)
        fetchartistsData()
      }
      else {
        console.log(response)
      }
    }
    catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchCelebritiesData()
  }, []);

  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  };

  const fetchartistsData = async () => {
    try {
      const response = await getAPI("/artist/artists")
      console.log(response)
    }
    catch (error) {
      console.log(error)
    }
  };


  return (
    <div className="max-w-[1440px] mx-auto mb-4">

      {/* Top Section: Breadcrumb + Search */}
      <div className="w-full bg-white py-3 px-3 sm:px-6">
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

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6">
        {/* Sidebar Filters (hidden on mobile, toggleable) */}
        <aside className="hidden md:block rounded-xl filter-sidebar">
          {/* All your filter sections here (unchanged) */}
          <h2 className="font-bold text-lg mb-3">Filter by</h2>

          <hr className="mb-3 border-dark" />

          {/* Sort By */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Sort By
          </p>
          <div className="space-y-2 mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> New Arrivals
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Trending
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Price Low to High
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Price High to Low
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Relevance
            </label>
          </div>

          <hr className="mb-3 border-dark" />

          {/* Art Involvement */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Art Involvement
          </p>
          <div className="space-y-2 mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Collector
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Creator (they make art)
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Curator / Collaborator
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Investor / Patron
            </label>
          </div>

          <hr className="mb-3 border-dark" />

          {/* Price */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Price
          </p>
          <input type="range" min="295" max="89700" className="w-full" />
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>₹295</span>
            <span>₹89,700+</span>
          </div>
          <div className="space-y-2 mb-4 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Under ₹5,000
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> ₹5,000 – ₹10,000
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> ₹10,000 – ₹25,000
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Above ₹25,000
            </label>
          </div>

          <hr className="mb-3 border-dark" />

          {/* Size */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Size
          </p>
          <div className="space-y-2 mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Small (&lt;12in)
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Medium (12–24in)
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Large (24–48in)
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Oversized (48in+)
            </label>
          </div>

          <hr className="mb-3 border-dark" />

          {/* Style */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Style
          </p>
          <div className="space-y-2 mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Abstract
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Modern
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Traditional
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Minimalist
            </label>
          </div>

          <hr className="mb-3 border-dark" />

          {/* Medium */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Medium
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Oil
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Acrylic
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Watercolor
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Mixed Media
            </label>
          </div>

          <hr className="mb-3 border-dark" />

          {/* Experience Level */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Experience Level
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Emerging Artist
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Mid-Level Artist
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Established Artist
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Master Artist
            </label>
          </div>
        </aside>

        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4h18M3 12h18M3 20h18"
              />
            </svg>
            Filters
          </button>

          {/* Slide-over sidebar for mobile */}
          {showFilters && (
            <div className="fixed inset-0 z-50 flex">
              {/* Background Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setShowFilters(false)}
              ></div>

              {/* Sidebar */}
              <div className="relative bg-white w-72 max-w-full h-full shadow-xl p-5 overflow-y-auto">
                <button
                  onClick={() => setShowFilters(false)}
                  className="absolute top-3 right-3 text-gray-600"
                >
                  ✕
                </button>

                <h2 className="font-bold text-lg mb-3">Filter by</h2>
                <hr className="mb-3 border-dark" />

                {/* ✅ Place the same filters here */}
                {/* Sort By, Special Tags, Price, Size, Style, Medium */}
                {/* Sort By */}
                <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                  Sort By
                </p>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> New Arrivals
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Trending
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Price Low to High
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Price High to Low
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Relevance
                  </label>
                </div>

                <hr className="mb-3 border-dark" />

                {/* Art Involvement */}
                <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                  Art Involvement
                </p>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Collector
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Creator (they
                    make art)
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Curator /
                    Collaborator
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Investor / Patron
                  </label>
                </div>

                <hr className="mb-3 border-dark" />

                {/* Price */}
                <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                  Price
                </p>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>₹295</span>
                  <span>₹89,700+</span>
                </div>
                <input
                  type="range"
                  min="295"
                  max="89700"
                  className="w-full mb-3"
                />
                <div className="space-y-2 mb-4 text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Under ₹5,000
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> ₹5,000 – ₹10,000
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> ₹10,000 – ₹25,000
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Above ₹25,000
                  </label>
                </div>

                <hr className="mb-3 border-dark" />

                {/* Size */}
                <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                  Size
                </p>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Small (&lt;12in)
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Medium (12–24in)
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Large (24–48in)
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Oversized (48in+)
                  </label>
                </div>

                <hr className="mb-3 border-dark" />

                {/* Style */}
                <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                  Style
                </p>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Abstract
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Modern
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Traditional
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Minimalist
                  </label>
                </div>

                <hr className="mb-3 border-dark" />

                {/* Medium */}
                <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                  Medium
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Oil
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Acrylic
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Watercolor
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Mixed Media
                  </label>
                </div>

                <hr className="mb-3 border-dark" />

                {/* Experience Level */}
                <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                  Experience Level
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Emerging Artist
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Mid-Level Artist
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Established
                    Artist
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Master Artist
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <!-- Product Grid --> */}
        <main className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">

            {celebritiesData.length > 0 ? (
              celebritiesData.map((celebrity, index) => (
                <div key={celebrity._id}
                  className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-[#48372D] bg-[#EBEBEB]">

                  <div className="px-2 py-4 text-center">
                    <h2 className="text-sm md:text-2xl font-extrabold text-[#4A3426]">
                      {celebrity?.artistName || ""}
                    </h2>
                    <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">

                    </p>
                  </div>

                  <div>
                    <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-[#48372D] overflow-hidden flex items-center justify-center">
                      <img
                        src="/herosectionimg/1.jpg"
                        alt={celebrity?.artistName || ""}
                        className="w-full h-40 sm:h-64 object-contain"
                      />
                    </div>
                  </div>

                  <div className="relative hidden md:block">
                    <div className="absolute bottom-6 left-1/3 transform -translate-x-1/2">
                      <button
                        onClick={() => navigate(`/celebrity/${slugify(celebrity.artistName)}`, { state: { celebrity } })}
                        className="flex items-center gap-2 bg-white/70 backdrop-blur-md text-gray-800 font-medium px-3 py-2 rounded-full shadow-md hover:bg-white transition"
                      >
                        View Collection
                        <span className="text-white text-lg">
                          <ImArrowUpRight2 className="bg-black rounded-full h-8 w-8 p-2" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No celebrities data</div>
            )}

            {/* <div className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-[#48372D] bg-[#EBEBEB]">
              <div className="px-2 py-4 text-center">
                <h2 className="text-sm md:text-2xl font-extrabold text-[#4A3426]">
                  Rohan Malhotra
                </h2>
                <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
                  Rohan Collects Urban Art, That Mirrors The Raw Rhythm, And
                  Energy Of His Music.
                </p>
              </div>

              <div>
                <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-[#48372D] overflow-hidden flex items-center justify-center">
                  <img
                    src="/herosectionimg/1.jpg"
                    alt="Collection Artwork"
                    className="w-full h-40 sm:h-64 object-contain"
                  />
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute bottom-6 left-1/3 transform -translate-x-1/2">
                  <button
                    href="#"
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-md text-gray-800 font-medium px-3 py-2 rounded-full shadow-md hover:bg-white transition"
                  >
                    View Collection
                    <span className="text-white text-lg">
                      <ImArrowUpRight2 className="bg-black rounded-full h-8 w-8 p-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div> */}

            {/* <div className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-[#48372D] bg-[#EBEBEB]">
              <div className="px-2 py-4 text-center">
                <h2 className="text-sm md:text-2xl font-extrabold text-[#4A3426]">
                  Rohan Malhotra
                </h2>
                <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
                  Rohan Collects Urban Art, That Mirrors The Raw Rhythm, And
                  Energy Of His Music.
                </p>
              </div>

              <div>
                <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-[#48372D] overflow-hidden flex items-center justify-center">
                  <img
                    src="/herosectionimg/1.jpg"
                    alt="Collection Artwork"
                    className="w-full h-40 sm:h-64 object-contain"
                  />
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute bottom-6 left-1/3 transform -translate-x-1/2">
                  <button
                    href="#"
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-md text-gray-800 font-medium px-3 py-2 rounded-full shadow-md hover:bg-white transition"
                  >
                    View Collection
                    <span className="text-white text-lg">
                      <ImArrowUpRight2 className="bg-black rounded-full h-8 w-8 p-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div> */}

            {/* <div className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-[#48372D] bg-[#EBEBEB]">
              <div className="px-2 py-4 text-center">
                <h2 className="text-sm md:text-2xl font-extrabold text-[#4A3426]">
                  Rohan Malhotra
                </h2>
                <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
                  Rohan Collects Urban Art, That Mirrors The Raw Rhythm, And
                  Energy Of His Music.
                </p>
              </div>

              <div>
                <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-[#48372D] overflow-hidden flex items-center justify-center">
                  <img
                    src="/herosectionimg/1.jpg"
                    alt="Collection Artwork"
                    className="w-full h-40 sm:h-64 object-contain"
                  />
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute bottom-6 left-1/3 transform -translate-x-1/2">
                  <button
                    href="#"
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-md text-gray-800 font-medium px-3 py-2 rounded-full shadow-md hover:bg-white transition"
                  >
                    View Collection
                    <span className="text-white text-lg">
                      <ImArrowUpRight2 className="bg-black rounded-full h-8 w-8 p-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div> */}

            {/* <div className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-[#48372D] bg-[#EBEBEB]">
              <div className="px-2 py-4 text-center">
                <h2 className="text-sm md:text-2xl font-extrabold text-[#4A3426]">
                  Rohan Malhotra
                </h2>
                <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
                  Rohan Collects Urban Art, That Mirrors The Raw Rhythm, And
                  Energy Of His Music.
                </p>
              </div>

              <div>
                <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-[#48372D] overflow-hidden flex items-center justify-center">
                  <img
                    src="/herosectionimg/1.jpg"
                    alt="Collection Artwork"
                    className="w-full h-40 sm:h-64 object-contain"
                  />
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute bottom-6 left-1/3 transform -translate-x-1/2">
                  <button
                    href="#"
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-md text-gray-800 font-medium px-3 py-2 rounded-full shadow-md hover:bg-white transition"
                  >
                    View Collection
                    <span className="text-white text-lg">
                      <ImArrowUpRight2 className="bg-black rounded-full h-8 w-8 p-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div> */}

            {/* <div className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-[#48372D] bg-[#EBEBEB]">
              <div className="px-2 py-4 text-center">
                <h2 className="text-sm md:text-2xl font-extrabold text-[#4A3426]">
                  Rohan Malhotra
                </h2>
                <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
                  Rohan Collects Urban Art, That Mirrors The Raw Rhythm, And
                  Energy Of His Music.
                </p>
              </div>

              <div>
                <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-[#48372D] overflow-hidden flex items-center justify-center">
                  <img
                    src="/herosectionimg/1.jpg"
                    alt="Collection Artwork"
                    className="w-full h-40 sm:h-64 object-contain"
                  />
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute bottom-6 left-1/3 transform -translate-x-1/2">
                  <button
                    href="#"
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-md text-gray-800 font-medium px-3 py-2 rounded-full shadow-md hover:bg-white transition"
                  >
                    View Collection
                    <span className="text-white text-lg">
                      <ImArrowUpRight2 className="bg-black rounded-full h-8 w-8 p-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div> */}

            {/* <div className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-[#48372D] bg-[#EBEBEB]">
              <div className="px-2 py-4 text-center">
                <h2 className="text-sm md:text-2xl font-extrabold text-[#4A3426]">
                  Rohan Malhotra
                </h2>
                <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
                  Rohan Collects Urban Art, That Mirrors The Raw Rhythm, And
                  Energy Of His Music.
                </p>
              </div>

              <div>
                <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-[#48372D] overflow-hidden flex items-center justify-center">
                  <img
                    src="/herosectionimg/1.jpg"
                    alt="Collection Artwork"
                    className="w-full h-40 sm:h-64 object-contain"
                  />
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute bottom-6 left-1/3 transform -translate-x-1/2">
                  <button
                    href="#"
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-md text-gray-800 font-medium px-3 py-2 rounded-full shadow-md hover:bg-white transition"
                  >
                    View Collection
                    <span className="text-white text-lg">
                      <ImArrowUpRight2 className="bg-black rounded-full h-8 w-8 p-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div> */}

            {/* <div className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-[#48372D] bg-[#EBEBEB]">
              <div className="px-2 py-4 text-center">
                <h2 className="text-sm md:text-2xl font-extrabold text-[#4A3426]">
                  Rohan Malhotra
                </h2>
                <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
                  Rohan Collects Urban Art, That Mirrors The Raw Rhythm, And
                  Energy Of His Music.
                </p>
              </div>

              <div>
                <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-[#48372D] overflow-hidden flex items-center justify-center">
                  <img
                    src="/herosectionimg/1.jpg"
                    alt="Collection Artwork"
                    className="w-full h-40 sm:h-64 object-contain"
                  />
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute bottom-6 left-1/3 transform -translate-x-1/2">
                  <button
                    href="#"
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-md text-gray-800 font-medium px-3 py-2 rounded-full shadow-md hover:bg-white transition"
                  >
                    View Collection
                    <span className="text-white text-lg">
                      <ImArrowUpRight2 className="bg-black rounded-full h-8 w-8 p-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div> */}

            {/* <div className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-[#48372D] bg-[#EBEBEB]">
              <div className="px-2 py-4 text-center">
                <h2 className="text-sm md:text-2xl font-extrabold text-[#4A3426]">
                  Rohan Malhotra
                </h2>
                <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
                  Rohan Collects Urban Art, That Mirrors The Raw Rhythm, And
                  Energy Of His Music.
                </p>
              </div>

              <div>
                <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-[#48372D] overflow-hidden flex items-center justify-center">
                  <img
                    src="/herosectionimg/1.jpg"
                    alt="Collection Artwork"
                    className="w-full h-40 sm:h-64 object-contain"
                  />
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute bottom-6 left-1/3 transform -translate-x-1/2">
                  <button
                    href="#"
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-md text-gray-800 font-medium px-3 py-2 rounded-full shadow-md hover:bg-white transition"
                  >
                    View Collection
                    <span className="text-white text-lg">
                      <ImArrowUpRight2 className="bg-black rounded-full h-8 w-8 p-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div> */}

          </div>

          {/* <!-- Pagination --> */}
          <div className="flex justify-center mt-6">
            <nav className="flex flex-wrap sm:flex-nowrap items-center space-x-2 rounded border border-dark px-2 sm:px-3 py-2 text-sm sm:text-lg font-semibold overflow-x-auto no-scrollbar">
              <FiChevronLeft className="self-center flex-shrink-0" />
              <button className="px-1 sm:px-3 py-1">Previous</button>
              <button className="px-3 sm:px-3 py-1 rounded border border-dark text-dark">
                1
              </button>
              <button className="px-1 sm:px-3 py-1">2</button>
              <button className="px-1 sm:px-3 py-1">3</button>
              <button className="px-1 sm:px-3 py-1">. . .</button>
              <button className="px-1 sm:px-3 py-1">10</button>
              <button className="px-1 sm:px-3 py-1">Next</button>
              <FiChevronRight className="self-center flex-shrink-0" />
            </nav>
          </div>

        </main>
      </div>

    </div>
  );
};
export default CelebrityCard;
