import "./product.css";
import React, { useState } from "react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import { Heart } from "lucide-react";

const Product = () => {
  const [showFilters, setShowFilters] = useState(false);

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

          {/* Special Tags */}
          <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
            Special Tags
          </p>
          <div className="space-y-2 mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Limited Edition
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Bestseller
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Verified Seller
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Exclusive
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

                {/* Special Tags */}
                <p className="font-bold text-dark mb-2 before:content-['—'] before:mr-2">
                  Special Tags
                </p>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Limited Edition
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Bestseller
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Verified Seller
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Exclusive
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
              </div>
            </div>
          )}
        </div>

        {/* <!-- Product Grid --> */}
        <main className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* <!-- Product Card --> */}

            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Premium
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Heart Icon */}
                <button className="absolute bottom-3 right-3 p-2 rounded-full shadow bg-dark">
                  <Heart className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Pebble Palace Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
                  <span className="text-sm font-bold text-orange-700">4.8</span>
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-500 text-sm">(254 Reviews)</span>
                  <span className="text-orange-500 font-semibold text-sm">
                    Only 2 left!
                  </span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
                    25% OFF
                    <span class="timer"> | 2h:59m</span>
                  </span>
                  <span className="text-gray-400 line-through">₹12,999</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹9,749
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Premium
                </span>

                {/* Product Image */}
                <img
                  src="https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=w64j3fW8C96CfYo3kbi386rs_sHH_6BGe8lAAAFS-y4="
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Heart Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Heart className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Pebble Palace Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
                  <span className="text-sm font-bold text-orange-700">4.8</span>
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-500 text-sm">(254 Reviews)</span>
                  <span className="text-orange-500 font-semibold text-sm">
                    Only 2 left!
                  </span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
                    25% OFF
                    <span class="timer"> | 2h:59m</span>
                  </span>
                  <span className="text-gray-400 line-through">₹12,999</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹9,749
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Premium
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Heart Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Heart className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Pebble Palace Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
                  <span className="text-sm font-bold text-orange-700">4.8</span>
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-500 text-sm">(254 Reviews)</span>
                  <span className="text-orange-500 font-semibold text-sm">
                    Only 2 left!
                  </span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
                    25% OFF
                    <span class="timer"> | 2h:59m</span>
                  </span>
                  <span className="text-gray-400 line-through">₹12,999</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹9,749
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Premium
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/2.png"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Heart Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Heart className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Pebble Palace Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
                  <span className="text-sm font-bold text-orange-700">4.8</span>
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-500 text-sm">(254 Reviews)</span>
                  <span className="text-orange-500 font-semibold text-sm">
                    Only 2 left!
                  </span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
                    25% OFF
                    <span class="timer"> | 2h:59m</span>
                  </span>
                  <span className="text-gray-400 line-through">₹12,999</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹9,749
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Premium
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Heart Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Heart className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Pebble Palace Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
                  <span className="text-sm font-bold text-orange-700">4.8</span>
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-500 text-sm">(254 Reviews)</span>
                  <span className="text-orange-500 font-semibold text-sm">
                    Only 2 left!
                  </span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
                    25% OFF
                    <span class="timer"> | 2h:59m</span>
                  </span>
                  <span className="text-gray-400 line-through">₹12,999</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹9,749
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Premium
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Heart Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Heart className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Pebble Palace Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
                  <span className="text-sm font-bold text-orange-700">4.8</span>
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-500 text-sm">(254 Reviews)</span>
                  <span className="text-orange-500 font-semibold text-sm">
                    Only 2 left!
                  </span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
                    25% OFF
                    <span class="timer"> | 2h:59m</span>
                  </span>
                  <span className="text-gray-400 line-through">₹12,999</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹9,749
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Premium
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Heart Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Heart className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Pebble Palace Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
                  <span className="text-sm font-bold text-orange-700">4.8</span>
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-500 text-sm">(254 Reviews)</span>
                  <span className="text-orange-500 font-semibold text-sm">
                    Only 2 left!
                  </span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
                    25% OFF
                    <span class="timer"> | 2h:59m</span>
                  </span>
                  <span className="text-gray-400 line-through">₹12,999</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹9,749
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto product-card">
              {/* Premium Label */}
              <div className="relative p-img">
                <span className="absolute top-3 left-3 text-white bg-dark text-sm font-semibold px-2 py-0.5 rounded-full shadow">
                  Premium
                </span>

                {/* Product Image */}
                <img
                  src="/herosectionimg/1.jpg"
                  alt="Beauty of Joseon Mandala Art"
                  className="w-full h-40 sm:h-64 object-contain rounded-t-2xl product-img"
                />

                {/* Heart Icon */}
                <button className="absolute bottom-3 bg-dark right-3 p-2 rounded-full shadow">
                  <Heart className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Product Info */}
              <div className="p-3 product-info">
                <p className="text-gray-500 text-xs sm:text-sm">•Sponsored</p>
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1">
                  Beauty of Joseon Mandala Art By SL
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm font-medium flex items-center">
                  Pebble Palace Designs
                  <span className="ml-1 text-blue-600">
                    <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                  </span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 d-none d-md-flex">
                  <span className="text-sm font-bold text-orange-700">4.8</span>
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-500 text-sm">(254 Reviews)</span>
                  <span className="text-orange-500 font-semibold text-sm">
                    Only 2 left!
                  </span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full discount-badge d-none d-md-flex">
                    25% OFF
                    <span class="timer"> | 2h:59m</span>
                  </span>
                  <span className="text-gray-400 line-through">₹12,999</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹9,749
                  </span>
                </div>
              </div>

              <div className="p-3 product-button d-none d-md-block">
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full py-2 font-semibold add-cart">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded-full font-semibold shadow buy-now">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
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
export default Product;
