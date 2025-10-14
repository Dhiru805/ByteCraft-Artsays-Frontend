import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import { ImArrowUpRight2 } from "react-icons/im";
import { MdVerified } from "react-icons/md";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { Heart } from "lucide-react";
import "./CelebrityContent.css";
import getAPI from "../../../api/getAPI";

const CelebrityContent = () => {

  const location = useLocation()
  const celebrity = location?.state?.celebrity;

  const [showFilters, setShowFilters] = useState(false);
  const [celebrityDetails, setCelebrityDetails] = useState({})
  const [userProfile, setUserProfile] = useState(null)
  const [artistProDetails, setArtistProDetails] = useState(null)

  const fetchCelebrityDetails = async () => {
    try {
      const response = await getAPI(`/artist/artists/${celebrity.artistId}`)
      console.log(response?.data)
      setCelebrityDetails(response?.data)
    }
    catch (error) {
      console.log(error)
    }
  };

  const fetchUserProfile = async () => {
    try {
      const result = await getAPI(`/auth/userid/${celebrity.artistId}`, {}, true, false)
      if (result?.data?.user) {
        setUserProfile(result.data.user)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchArtistProfessionalDetails = async () => {
    try {
      const result = await getAPI(`/auth/getartistdetails/${celebrity.artistId}`, {}, true, false)
      if (result?.data) {
        setArtistProDetails(result.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (celebrity.artistId) {
      fetchCelebrityDetails()
      fetchUserProfile()
      fetchArtistProfessionalDetails()
    }
  }, [celebrity]);

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
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-3 sm:px-6">
        <div className="content-center">
          <div className="flex justify-between">
            <h2 className="text-lg md:text-5xl text-dark font-bold">
              {celebrity?.artistName || ""}
            </h2>
            <button className="bg-red-500 text-white text-md px-3 py-1 rounded-xl font-semibold shadow buy-now">
              Follow
            </button>
          </div>
          <div className="py-3">
            <h2 className="text-sm md:text-3xl font-bold text-dark">About</h2>
            <p className="text-xs md:text-lg text-dark leading-normal py-2">
              {/* Known for her iconic fashion statements, Sonam Kapoor has always
              seen art as an extension of her personality. Her collection
              bridges traditional Indian craftsmanship with contemporary global
              styles. From investing in young Indian painters to acquiring
              pieces from European modernists, Sonam curates with a
              storyteller’s eye. */}
              {artistProDetails?.description
                || userProfile?.description
                || celebrityDetails?.description
                || "No description available for this artist."}
            </p>
          </div>
          <div className="py-3">
            <h2 className="text-sm md:text-3xl font-bold text-dark">
              Highlights of her journey:
            </h2>
            {celebrity && (
              <div
                dangerouslySetInnerHTML={{ __html: celebrity.highlightsOfJourney }}
                className="highlights-of-journey"
              >

              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="border rounded-2xl px-2 py-3 hover:shadow-2xl">
              <h2 className="text-[#48372D] font-bold text-lg text-center">{celebrity?.artWorkCollected || 0}</h2>
              <hr className="my-2 border-dark mx-5" />
              <h6 className="text-[#48372D] text-lg font-semibold text-center">Artwork Collected</h6>
            </div>
            <div className="border rounded-2xl px-2 py-3 hover:shadow-2xl">
              <h2 className="text-[#48372D] font-bold text-lg text-center">{celebrity?.yearsActiveInArt || 0}</h2>
              <hr className="my-2 border-dark mx-5" />
              <h6 className="text-[#48372D] text-lg font-semibold text-center">Years Active in Art</h6>
            </div>
            <div className="border rounded-2xl px-2 py-3 hover:shadow-2xl">
              <h2 className="text-[#48372D] font-bold text-lg text-center">{celebrity?.exhibitionFeatured || 0}</h2>
              <hr className="my-2 border-dark mx-5" />
              <h6 className="text-[#48372D] text-lg font-semibold text-center">Exhibitions Featured</h6>
            </div>

          </div>
        </div>
        <div className="content-center">
          <img
            src={celebrity?.profilePicture || "/herosectionimg/1.jpg"}
            alt={celebrity?.artistName || ""}
            className="w-full h-40 sm:h-[600px] object-contain border bg-[#EBEBEB] rounded-t-2xl product-img"
          />
        </div>
      </div>

      <div className="py-5">
        <div className="py-3">
          <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
            Featured Collections
          </h1>
          <hr className="my-3 border-dark" />

          {/* Subtitle */}
          <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
            At ArtSays, we make it simple for you to collaborate directly with
            talented artists and bring your creative vision to life.
            Commissioning custom artwork is a personalized process designed to
            give you a unique piece that reflects your ideas, style, and story.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-3 my-5">
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
                <span className="text-lg font-bold text-gray-900">₹9,749</span>
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
                <span className="text-lg font-bold text-gray-900">₹9,749</span>
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
                <span className="text-lg font-bold text-gray-900">₹9,749</span>
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
                <span className="text-lg font-bold text-gray-900">₹9,749</span>
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
                <span className="text-lg font-bold text-gray-900">₹9,749</span>
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
                <span className="text-lg font-bold text-gray-900">₹9,749</span>
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
                <span className="text-lg font-bold text-gray-900">₹9,749</span>
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
                <span className="text-lg font-bold text-gray-900">₹9,749</span>
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
      </div>
    </div>
  );
};
export default CelebrityContent;



