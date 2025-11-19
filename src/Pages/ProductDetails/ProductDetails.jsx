//  import { MdVerified } from "react-icons/md";
//  import { Star, Truck, Gift, Banknote, CreditCard } from "lucide-react";
//  import React, { useState } from "react";
//  import { ChevronLeft, ChevronRight } from "lucide-react";
//  import { HiMiniPercentBadge } from "react-icons/hi2";
//  import { Heart, MapPin, ArrowRight, ShoppingCart, Zap } from "lucide-react";
//  import { BsTelegram } from "react-icons/bs";
//  import { FaChevronCircleRight } from "react-icons/fa";
//  import { FaChevronCircleLeft } from "react-icons/fa";

//  const offersData = [
//      {
//          title: "Cashback",
//          description: "Upto ₹50.00 cashback as Google Pay Balance when...",
//          offers: "3 offers",
//      },
//      {
//          title: "Bank Offer",
//          description: "Upto ₹1,000.00 discount on SBI Credit Cards",
//          offers: "8 offers",
//      },
//      {
//          title: "EMI Offers",
//          description: "Get GST invoice and save up to 28% on business purchases",
//          offers: "1 offer",
//      },
//      {
//          title: "Festival Offer",
//          description: "Flat ₹500 off on selected paintings during the festival sale",
//          offers: "2 offers",
//      },
//  ];

//  const ProductDetails = () => {
//      const [quantity, setQuantity] = useState(1);
//      const [protection, setProtection] = useState(true);
//      const [giftOption, setGiftOption] = useState(true);
//      const [index, setIndex] = useState(0);
//      const [activeTab, setActiveTab] = useState("description");

//      const images = [
//          "/herosectionimg/12.jpg",
//          "/herosectionimg/13.jpg",
//          "/herosectionimg/14.jpg",
//          "/herosectionimg/11.jpg",
//          "/herosectionimg/1.jpg",
//          "/herosectionimg/2.png",
//          "/herosectionimg/shraddha.jpg",
//      ];

//      const [selectedImage, setSelectedImage] = useState(images[0]);

//      const nextSlide = () => {
//          if (index < offersData.length - 3) setIndex(index + 1);
//      };

//      const ProductImages = () => {
//          const roomBackgrounds = [
//              "/artimages/viewintheroom.jpg",
//              "/artimages/wall3.jpg",
//              "/artimages/wall4.webp",
//          ];

//          const [selectedImage, setSelectedImage] = useState(images[0]);
//          const [selectedRoom, setSelectedRoom] = useState(roomBackgrounds[0]);
//          const [showPopup, setShowPopup] = useState(false);

//          // Example artwork size (in inches or cm)
//          const artworkSize = { width: 100, height: 70 };

//          const changeImage = (direction) => {
//              const currentIndex = images.indexOf(selectedImage);
//              if (direction === 'next') {
//                  setSelectedImage(images[(currentIndex + 1) % images.length]);
//              } else {
//                  setSelectedImage(images[(currentIndex - 1 + images.length) % images.length]);
//              }
//          };

//          const handleShare = () => {
//              if (navigator.share) {
//                  navigator
//                      .share({
//                          title: 'Check out this artwork!',
//                          text: 'I found this amazing art on Artsays!',
//                          url: window.location.href,
//                      })
//                      .then(() => console.log('Shared successfully'))
//                      .catch((err) => console.log('Error sharing', err));
//              } else {
//                  alert('Share not supported in this browser');
//              }
//          };

//          const [pinCode, setPinCode] = useState("");
//          const [address, setAddress] = useState("");

//          const addresses = {
//              "110017": "23 Aurum Lane, Sector 17, Vasant Vibe, New Delhi",
//              "560001": "MG Road, Bangalore, Karnataka",
//          };

//          const handleSubmit = (e) => {
//              e.preventDefault();

//              if (addresses[pinCode]) {
//                  setAddress(addresses[pinCode]);
//              } else {
//                  alert("Invalid PIN code");
//                  setAddress("");
//              }
//          };

//          const prevSlide = () => {
//              if (index > 0) setIndex(index - 1);
//          };
//          return (
//              <div className="max-w-[1440px] mx-auto font-[Poppins] bg-[#ffffff] text-[#111] p-6">
//                  {/* ====== Top Section ====== */}
//                  <p className="text-sm text-gray-500">Art / Painting / Abstract</p>
//                  <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
//                      <div className="col-span-8">
//                          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
//                              {/* ===== Left: Image Gallery ===== */}

//                              <div className="flex flex-col lg:flex-row-reverse col-span-5 gap-3 relative">
//                                  {/* ===== Main Image ===== */}
//                                  <div className="relative w-full h-auto align-content-center product-card">
//                                      <img
//                                          src={selectedImage}
//                                          alt="Main"
//                                          className="w-full h-[550px] object-contain product-img transition-all duration-300"
//                                      />

//                                      {/* ===== View in Room Button ===== */}
//                                      <button
//                                          onClick={() => setShowPopup(true)}
//                                          className="absolute bottom-5 bg-dark text-[#ffffff] text-sm px-3 py-1 rounded-2xl shadow flex justify-self-center gap-1"
//                                      >
//                                          👁️ View in Room
//                                      </button>

//                                      {/* ===== Share Button ===== */}
//                                      <button
//                                          onClick={handleShare}
//                                          className="absolute top-3 right-3 text-[#48372D] text-4xl py-1"
//                                      >
//                                          <BsTelegram />
//                                      </button>

//                                      <button
//                                          onClick={handleShare}
//                                          className="absolute top-3 left-3 bg-[#48372D] text-white text-md px-2 rounded-full"
//                                      >
//                                          .Sponsored
//                                      </button>

//                                      {/* ===== Right Side Vertical Arrow Buttons ===== */}
//                                      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex flex-col gap-2">
//                                          <button
//                                              onClick={() => changeImage('prev')}
//                                              className="text-[#48372D] text-4xl"
//                                          >
//                                              <FaChevronCircleLeft />
//                                          </button>
//                                          <button
//                                              onClick={() => changeImage('next')}
//                                              className="text-[#48372D] text-4xl"
//                                          >
//                                              <FaChevronCircleRight />
//                                          </button>
//                                      </div>
//                                  </div>

//                                  {/* ===== Thumbnails ===== */}
//                                  <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[550px] scrollbar-hide">
//                                      {images.map((img, index) => (
//                                          <img
//                                              key={index}
//                                              src={img}
//                                              alt={`thumb-${index}`}
//                                              onClick={() => setSelectedImage(img)}
//                                              className={`w-24 h-24 object-contain rounded-lg product-img product-card cursor-pointer border-2 transition-all duration-200 ${selectedImage === img ? "border-dark" : "border-transparent"
//                                                  }`}
//                                          />
//                                      ))}
//                                  </div>
//                              </div>

//                              {/* ======= POPUP MODAL ======= */}
//                              {showPopup && (
//                                  <div className="fixed inset-0 bg-opacity-60 backdrop-blur-md flex items-center justify-center z-[999]" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
//                                      <div className="relative bg-white rounded-xl shadow-lg max-w-5xl w-full p-4">
//                                          {/* Close Button */}
//                                          <button
//                                              onClick={() => setShowPopup(false)}
//                                              className="absolute top-3 right-3 text-gray-700 text-xl font-bold"
//                                          >
//                                              ✕
//                                          </button>

//                                          {/* Room Background + Artwork */}
//                                          <div className="relative w-full h-[550px] overflow-hidden rounded-lg">
//                                              <img
//                                                  src={selectedRoom}
//                                                  alt="room"
//                                                  className="w-full h-full object-contain"
//                                              />

//                                              {/* Overlayed Artwork */}
//                                              <div className="absolute bottom-[200px] inset-0 flex justify-center items-center">
//                                                  <div className="relative">
//                                                      <img
//                                                          src={selectedImage}
//                                                          alt="art"
//                                                          className="object-contain rounded-lg mb-3"
//                                                          style={{
//                                                              width: `${artworkSize.width * 3}px`, // scale for visibility
//                                                              height: `${artworkSize.height * 3}px`,
//                                                          }}
//                                                      />
//                                                      {/* Dimensions Label */}
//                                                      <div className="absolute -bottom-6 w-full text-center text-sm font-medium bg-[#ffffff] py-1 rounded-md">
//                                                          {artworkSize.width} × {artworkSize.height} cm
//                                                      </div>
//                                                  </div>
//                                              </div>
//                                          </div>

//                                          {/* Room Selector */}
//                                          <div className="flex justify-center gap-3 mt-4">
//                                              {roomBackgrounds.map((room, i) => (
//                                                  <img
//                                                      key={i}
//                                                      src={room}
//                                                      alt={`room-${i}`}
//                                                      onClick={() => setSelectedRoom(room)}
//                                                      className={`w-24 h-20 object-cover rounded-lg cursor-pointer border-2 ${selectedRoom === room ? "border-dark" : "border-transparent"
//                                                          }`}
//                                                  />
//                                              ))}
//                                          </div>
//                                      </div>
//                                  </div>
//                              )}

//                              {/* ===== Right: Product Info ===== */}
//                              <div className="col-span-5">
//                                  <h1 className="text-lg md:text-3xl font-semibold leading-snug">
//                                      Dreamcatcher – Lotus with moon Stained glass and glass leaves
//                                  </h1>
//                                  <div className="flex flex-wrap gap-2 text-xs mt-2">
//                                      <span className="bg-gray-200 px-2 py-1 rounded-md">#Abstract</span>
//                                      <span className="bg-gray-200 px-2 py-1 rounded-md">#Contemporary</span>
//                                      <span className="bg-gray-200 px-2 py-1 rounded-md">#Oil Painting</span>
//                                      <span className="bg-gray-200 px-2 py-1 rounded-md">#Modern Art</span>
//                                  </div>
//                                  <div className="flex flex-wrap gap-2 text-xs mt-2">
//                                      <span className="bg-gray-200 px-2 py-1 rounded-md">Original Artwork</span>
//                                  </div>

//                                  <div className="flex items-center justify-between">
//                                      <div>
//                                          <p className="text-dark font-bold text-lg flex mr-3 mt-2 items-center">MystiqSoul <MdVerified className="ml-1 text-blue-600 w-4 h-4" /></p>
//                                          <div className="flex items-center text-yellow-500 mt-2">
//                                              {[...Array(5)].map((_, i) => (
//                                                  <Star key={i} size={16} fill="#facc15" stroke="#facc15" />
//                                              ))}
//                                              <span className="text-dark ml-1 text-sm">(2,592)</span>
//                                              <span className="text-dark text-sm ml-2"><strong>600+</strong> bought this month</span>
//                                          </div>
//                                      </div>

//                                  </div>

//                                  {/* Price Section */}
//                                  <div className="flex items-center gap-3 mt-2">
//                                      <span className="bg-[#DC3545] px-2 py-1 rounded-md text-white font-bold text-md">-67%</span>
//                                      <p className="text-3xl font-bold">₹8,035</p>
//                                      <p className="text-dark line-through text-lg">₹19,820</p>
//                                  </div>
//                                  <div className="flex items-center gap-3 mt-2">
//                                      <div className="text-gray-500 text-xs">M.R.P.:<span className="line-through"> ₹12,299</span></div>
//                                      <div className="text-gray-500 text-xs"> Inclusive of all taxes</div>
//                                  </div>
//                                  <div className="flex gap-2 pt-2 justify-between">
//                                      <div className="p-2">
//                                          <img
//                                              src="/herosectionimg/limited edition.png"
//                                              alt="limited edition"
//                                              className="w-full h-10 object-contain" />
//                                          <p className="text-dark text-center text-xs mt-2 rounded">
//                                              Limited Edition
//                                          </p>
//                                      </div>
//                                      {/* <div className="p-2">
//                              <img
//                                  src="/herosectionimg/original.png"
//                                  alt="original"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Original
//                              </p>
//                          </div>
//                          <div className="p-2">
//                              <img
//                                  src="/herosectionimg/premium.png"
//                                  alt="premium"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Premium
//                              </p>
//                          </div>
//                          <div className="p-2">
//                              <img
//                                  src="/herosectionimg/open edition.png"
//                                  alt="open edition"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Open Edition
//                              </p>
//                          </div> */}
//                                      <div className="p-2">
//                                          <img
//                                              src="/herosectionimg/free delivery.png"
//                                              alt="free delivery"
//                                              className="w-full h-10 object-contain" />
//                                          <p className="text-dark text-center text-xs mt-2 rounded">
//                                              Free Delivery
//                                          </p>
//                                      </div>
//                                      <div className="p-2">
//                                          <img
//                                              src="/herosectionimg/framed.png"
//                                              alt="framed"
//                                              className="w-full h-10 object-contain" />
//                                          <p className="text-dark text-center text-xs mt-2 rounded">
//                                              Framed
//                                          </p>
//                                      </div>
//                                      <div className="p-2">
//                                          <img
//                                              src="/herosectionimg/handmade.png"
//                                              alt="handemade"
//                                              className="w-full h-10 object-contain" />
//                                          <p className="text-dark text-center text-xs mt-2 rounded">
//                                              Handmade
//                                          </p>
//                                      </div>
//                                      {/* <div className="p-2">
//                              <img
//                                  src="/herosectionimg/glass material.png"
//                                  alt="glass material"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Glass Material
//                              </p>
//                          </div>
//                          <div className="p-2">
//                              <img
//                                  src="/herosectionimg/gifting.png"
//                                  alt="gifting options"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Gifting Options
//                              </p>
//                          </div>
//                          <div className="p-2">
//                              <img
//                                  src="/herosectionimg/certified.png"
//                                  alt="certified"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Certified
//                              </p>
//                          </div> */}
//                                  </div>

//                                  {/* In Stocks / Details */}
//                                  <div className="w-full max-w-sm d-block d-md-none">
//                                      {/* Address */}
//                                      <div className="flex items-start gap-2 mt-2 text-sm text-dark">
//                                          <MapPin size={18} className="text-dark mt-1" />
//                                          <p>23 Aurum Lane, Sector 17, Vasant Vibe, New Delhi</p>
//                                      </div>

//                                      {/* Stock and Seller Info */}
//                                      <div className="mt-3">
//                                          <p className="text-green-600 font-semibold">In Stock</p>
//                                          <table className="mt-2 w-full text-sm">
//                                              <tbody>
//                                                  <tr className="border-b border-gray-100">
//                                                      <td className="text-xs font-semibold py-1">Delivered by</td>
//                                                      <td className="text-left text-xs py-1">Artsays</td>
//                                                  </tr>

//                                                  <tr className="border-b border-gray-100">
//                                                      <td className="text-xs font-semibold py-1">Sold by</td>
//                                                      <td className="text-left text-xs text-orange-600 font-medium py-1 flex items-center gap-1">
//                                                          MystiqSoul <MdVerified className="text-blue-600 w-4 h-4" />
//                                                      </td>
//                                                  </tr>

//                                                  <tr className="border-b border-gray-100">
//                                                      <td className="text-xs font-semibold py-1">Artist</td>
//                                                      <td className="text-left text-xs text-orange-600 font-medium py-1">Neha Joshi</td>
//                                                  </tr>

//                                                  <tr>
//                                                      <td className="text-xs font-semibold py-1">Payment</td>
//                                                      <td className="text-left text-xs py-1">Secure Transaction</td>
//                                                  </tr>
//                                              </tbody>
//                                          </table>

//                                      </div>

//                                  </div>

//                                  {/* Offers Section */}
//                                  <div className="w-full mx-auto">
//                                      {/* Header */}
//                                      <div className="flex items-center justify-between">
//                                          <div className="flex items-center gap-2">
//                                              <HiMiniPercentBadge className="text-red-500 text-xl" />
//                                              <h2 className="text-lg font-semibold">Offers</h2>
//                                          </div>
//                                          <div className="flex gap-2">
//                                              <button
//                                                  onClick={prevSlide}
//                                                  className={`p-2 rounded-full focus:bg-none transition ${index === 0 ? "opacity-40 cursor-not-allowed" : ""
//                                                      }`}
//                                              >
//                                                  <ChevronLeft />
//                                              </button>
//                                              <button
//                                                  onClick={nextSlide}
//                                                  className={`p-2 rounded-full focus:bg-none transition ${index >= offersData.length - 3 ? "opacity-40 cursor-not-allowed" : ""
//                                                      }`}
//                                              >
//                                                  <ChevronRight />
//                                              </button>
//                                          </div>
//                                      </div>

//                                      {/* Slider Container */}
//                                      <div className="overflow-hidden">
//                                          <div
//                                              className="flex transition-transform duration-500 ease-out"
//                                              style={{ transform: `translateX(-${index * 33.3333}%)` }}
//                                          >
//                                              {offersData.map((offer, i) => (
//                                                  <div
//                                                      key={i}
//                                                      className="min-w-[33.3333%] p-1"
//                                                  >
//                                                      <div className="border rounded-xl px-1 md:!px-3 py-2 h-full shadow-sm hover:shadow-md transition">
//                                                          <h3 className="font-bold text-md md:text-lg mb-2">{offer.title}</h3>
//                                                          <p className="text-xs text-gray-600 mb-2">{offer.description}</p>
//                                                          <p className="text-sm font-medium text-gray-800">{offer.offers}</p>
//                                                      </div>
//                                                  </div>
//                                              ))}
//                                          </div>
//                                      </div>
//                                  </div>

//                                  {/* Protection/ Buttons */}
//                                  <div className="w-full max-w-sm d-block d-md-none">
//                                      {/* Protection Plans */}
//                                      <div className="mt-3">
//                                          <p className="font-semibold text-lg">Add a protection plan</p>

//                                          <div className="mt-2 space-y-2">
//                                              <div className="flex items-start gap-2 text-sm cursor-pointer">
//                                                  <input
//                                                      type="checkbox"
//                                                      checked={protection}
//                                                      onChange={() => setProtection(!protection)}
//                                                      className="mt-1 accent-black"
//                                                  />
//                                                  <span>
//                                                      Screen Damage Protection while delivery for{" "}
//                                                      <span className="font-semibol">₹2,749.00</span>
//                                                  </span>
//                                              </div>

//                                              <div className="flex items-start gap-2 text-sm cursor-pointer">
//                                                  <input
//                                                      type="checkbox"
//                                                      checked={giftOption}
//                                                      onChange={() => setGiftOption(!giftOption)}
//                                                      className="mt-1 accent-black"
//                                                  />
//                                                  <span>
//                                                      Gift options for <span className="font-semibold">₹2,749.00</span>
//                                                  </span>
//                                              </div>
//                                          </div>
//                                      </div>

//                                      {/* Quantity */}
//                                      <div className="mt-3 flex items-center justify-around">
//                                          <span className="font-semibold text-sm">Quantity :</span>
//                                          <select
//                                              value={quantity}
//                                              onChange={(e) => setQuantity(e.target.value)}
//                                              className="border border-dark rounded-md px-3 py-1 text-sm focus:outline-none"
//                                          >
//                                              {[...Array(10)].map((_, i) => (
//                                                  <option key={i + 1} value={i + 1}>
//                                                      {i + 1}
//                                                  </option>
//                                              ))}
//                                          </select>
//                                      </div>

//                                      {/* Buttons */}
//                                      <div className="mt-3 flex flex-col gap-3">
//                                          <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart">
//                                              <ShoppingCart size={18} /> Add to Cart
//                                          </button>
//                                          <button className="flex items-center justify-center gap-2 flex-1 hover:border-dark rounded-full bg-red-500 text-white py-2 font-semibold buy-now">
//                                              <Zap size={18} /> Buy Now
//                                          </button>
//                                      </div>
//                                  </div>

//                              </div>

//                          </div>

//                          <div className="mt-12 border-b">
//                              {/* ===== Tabs ===== */}
//                              <div
//                                  className="flex gap-8 text-[#48372D] font-medium text-lg border-b border-gray-200
//                                              overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth select-none"
//                                  onMouseDown={(e) => {
//                                      const el = e.currentTarget;
//                                      el.isDown = true;
//                                      el.startX = e.pageX - el.offsetLeft;
//                                      el.scrollLeftStart = el.scrollLeft;
//                                  }}
//                                  onMouseLeave={(e) => {
//                                      e.currentTarget.isDown = false;
//                                  }}
//                                  onMouseUp={(e) => {
//                                      e.currentTarget.isDown = false;
//                                  }}
//                                  onMouseMove={(e) => {
//                                      const el = e.currentTarget;
//                                      if (!el.isDown) return;
//                                      e.preventDefault();
//                                      const x = e.pageX - el.offsetLeft;
//                                      const walk = (x - el.startX) * 1.5; // scroll speed
//                                      el.scrollLeft = el.scrollLeftStart - walk;
//                                  }}
//                              >
//                                  {["description", "details", "artist", "reviews"].map((tab) => (
//                                      <button
//                                          key={tab}
//                                          onClick={() => setActiveTab(tab)}
//                                          className={`pb-2 flex-shrink-0 transition-all duration-200 whitespace-nowrap ${activeTab === tab
//                                              ? "border-b-4 border-[#48372D] font-semibold text-[#48372D] focus:outline-none"
//                                              : "font-semibold text-[#48372D] focus:outline-none"
//                                              }`}
//                                      >
//                                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                      </button>
//                                  ))}
//                              </div>

//                              {/* ===== Tab Content ===== */}
//                              <div className="py-6 text-gray-700 leading-relaxed text-sm">
//                                  {activeTab === "description" && (
//                                      <p>
//                                          Inspired by the harmony of dreams and divine awakening, Dreamcatcher
//                                          Lotus blends the protective symbolism of a dreamcatcher with the
//                                          spiritual purity of the lotus flower. Handmade with intricate care, this
//                                          piece channels positive energy, making it a beautiful and meaningful
//                                          addition to any space. Ideal for gifting or personal zen corners.
//                                      </p>
//                                  )}

//                                  {activeTab === "details" && (
//                                      <div className="space-y-2">
//                                          <h2 className="text-xl font-semibold">Artwork Specifications</h2>
//                                          <p><span className="font-semibold">Material:</span> Cotton Thread & Beads</p>
//                                          <p><span className="font-semibold">Dimensions:</span> 40 x 20 cm</p>
//                                          <p><span className="font-semibold">Weight:</span> 350g</p>
//                                          <p><span className="font-semibold">Care:</span> Wipe gently with a soft dry cloth</p>
//                                      </div>
//                                  )}

//                                  {activeTab === "artist" && (
//                                      <div>
//                                          <p className="font-semibold text-lg">Artist: Neha Joshi</p>
//                                          <p className="mt-2">
//                                              Neha Joshi is a contemporary Indian artist specializing in spiritual
//                                              and symbolic artworks. Her creations explore the connection between
//                                              mindfulness and modern living, using handcrafted natural materials.
//                                          </p>
//                                      </div>
//                                  )}

//                                  {activeTab === "reviews" && (
//                                      <div className="space-y-4">
//                                          <div className="border p-3 rounded-lg shadow-sm">
//                                              <p className="font-semibold">Aarav Patel ⭐⭐⭐⭐⭐</p>
//                                              <p className="text-sm mt-1">
//                                                  Beautifully crafted! The attention to detail is stunning and it
//                                                  brings a calming energy to my home.
//                                              </p>
//                                          </div>
//                                          <div className="border p-3 rounded-lg shadow-sm">
//                                              <p className="font-semibold">Priya Mehta ⭐⭐⭐⭐☆</p>
//                                              <p className="text-sm mt-1">
//                                                  Loved it! Just wished it came in a slightly bigger size.
//                                              </p>
//                                          </div>
//                                      </div>
//                                  )}
//                              </div>
//                          </div>

//                      </div>
//                      {/* ===== Right: Product Price ===== */}
//                      <div className="col-span-2 d-none d-md-block">
//                          <div className="sticky top-10">
//                              <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-dark px-3 py-3">
//                                  {/* Price and Wishlist */}
//                                  <div className="flex justify-between items-center">
//                                      <div>
//                                          <p className="text-3xl font-bold">₹ 8,035</p>
//                                      </div>
//                                      <button>
//                                          <Heart className="text-dark text-lg" />
//                                      </button>
//                                  </div>
//                                  <p className="text-sm mt-1">
//                                      FREE delivery <span className="font-semibold">Sunday, 10 August</span>.{" "}
//                                      <span className="text-orange-600 cursor-pointer">Details</span>
//                                  </p>

//                                  {/* Address */}
//                                  <div className="max-w-md">
//                                      {!address && (
//                                          <form onSubmit={handleSubmit} className="relative w-full">
//                                              {/* Left icon */}
//                                              <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

//                                              {/* Input field */}
//                                              <input
//                                                  type="text"
//                                                  placeholder="Enter Pin Code"
//                                                  value={pinCode}
//                                                  onChange={(e) => setPinCode(e.target.value)}
//                                                  className="w-full !border-b-2 py-2 pl-4 pr-10 text-gray-400 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                                              />

//                                              {/* Submit arrow button (inside input) */}
//                                              <button
//                                                  type="submit"
//                                                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400"
//                                              >
//                                                  <ArrowRight size={20} />
//                                              </button>
//                                          </form>
//                                      )}

//                                      {/* Address display */}
//                                      {address && (
//                                          <div className="flex items-start gap-2 mt-2 text-sm text-dark">
//                                              <MapPin className="text-dark text-xl" />
//                                              <p>{address}</p>
//                                          </div>
//                                      )}
//                                  </div>

//                                  {/* Stock and Seller Info */}
//                                  <div className="mt-2">
//                                      <p className="text-green-600 font-semibold">In Stock</p>
//                                      <table className="mt-2 w-full text-sm">
//                                          <tbody>
//                                              <tr className="border-b border-gray-100">
//                                                  <td className="text-xs font-semibold py-1">Delivered by</td>
//                                                  <td className="text-left text-xs py-1">Artsays</td>
//                                              </tr>

//                                              <tr className="border-b border-gray-100">
//                                                  <td className="text-xs font-semibold py-1">Sold by</td>
//                                                  <td className="text-left text-xs text-orange-600 font-medium py-1 flex items-center gap-1">
//                                                      MystiqSoul <MdVerified className="text-blue-600 w-4 h-4" />
//                                                  </td>
//                                              </tr>

//                                              <tr className="border-b border-gray-100">
//                                                  <td className="text-xs font-semibold py-1">Artist</td>
//                                                  <td className="text-left text-xs text-orange-600 font-medium py-1">Neha Joshi</td>
//                                              </tr>

//                                              <tr>
//                                                  <td className="text-xs font-semibold py-1">Payment</td>
//                                                  <td className="text-left text-xs py-1">Secure Transaction</td>
//                                              </tr>
//                                          </tbody>
//                                      </table>

//                                  </div>

//                                  {/* Protection Plans */}
//                                  <div className="mt-3">
//                                      <p className="font-semibold text-lg">Add a protection plan</p>

//                                      <div className="mt-2 space-y-2">
//                                          <div className="flex items-start gap-2 text-sm cursor-pointer">
//                                              <input
//                                                  type="checkbox"
//                                                  checked={protection}
//                                                  onChange={() => setProtection(!protection)}
//                                                  className="mt-1 accent-black"
//                                              />
//                                              <span>
//                                                  Screen Damage Protection while delivery for{" "}
//                                                  <span className="font-semibol">₹2,749.00</span>
//                                              </span>
//                                          </div>

//                                          <div className="flex items-start gap-2 text-sm cursor-pointer">
//                                              <input
//                                                  type="checkbox"
//                                                  checked={giftOption}
//                                                  onChange={() => setGiftOption(!giftOption)}
//                                                  className="mt-1 accent-black"
//                                              />
//                                              <span>
//                                                  Gift options for <span className="font-semibold">₹2,749.00</span>
//                                              </span>
//                                          </div>
//                                      </div>
//                                  </div>

//                                  {/* Quantity */}
//                                  <div className="mt-3 flex items-center justify-around">
//                                      <span className="font-semibold text-sm">Quantity :</span>
//                                      <select
//                                          value={quantity}
//                                          onChange={(e) => setQuantity(e.target.value)}
//                                          className="border border-dark rounded-md px-3 py-1 text-sm focus:outline-none"
//                                      >
//                                          {[...Array(10)].map((_, i) => (
//                                              <option key={i + 1} value={i + 1}>
//                                                  {i + 1}
//                                              </option>
//                                          ))}
//                                      </select>
//                                  </div>

//                                  {/* Buttons */}
//                                  <div className="mt-3 flex flex-col gap-3">
//                                      <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart">
//                                          <ShoppingCart size={18} /> Add to Cart
//                                      </button>
//                                      <button className="flex items-center justify-center gap-2 flex-1 hover:border-dark rounded-full bg-red-500 text-white py-2 font-semibold buy-now">
//                                          <Zap size={18} /> Buy Now
//                                      </button>
//                                  </div>
//                              </div>
//                          </div>
//                      </div>
//                  </div>

//              </div>
//          );
//      };

//      return <ProductImages />;
//  };

//  export default ProductDetails;

//  import React, { useState, useEffect } from "react";
//  import { MdVerified } from "react-icons/md";
//  import { Star, Truck, Gift, Banknote, CreditCard } from "lucide-react";
//  import { useParams } from "react-router-dom";
//  import { ChevronLeft, ChevronRight } from "lucide-react";
//  import { HiMiniPercentBadge } from "react-icons/hi2";
//  import { Heart, MapPin, ArrowRight, ShoppingCart, Zap } from "lucide-react";
//  import { BsTelegram } from "react-icons/bs";
//  import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";
//  import getAPI from "../../api/getAPI";

//  const offersData = [
//    {
//      title: "Cashback",
//      description: "Upto ₹50.00 cashback as Google Pay Balance when...",
//      offers: "3 offers",
//    },
//    {
//      title: "Bank Offer",
//      description: "Upto ₹1,000.00 discount on SBI Credit Cards",
//      offers: "8 offers",
//    },
//    {
//      title: "EMI Offers",
//      description: "Get GST invoice and save up to 28% on business purchases",
//      offers: "1 offer",
//    },
//    {
//      title: "Festival Offer",
//      description: "Flat ₹500 off on selected paintings during the festival sale",
//      offers: "2 offers",
//    },
//  ];

//  const ProductDetails = () => {
//    const { productId } = useParams();
//    const id = productId;

//    const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;
//    console.log("useParams() output:", useParams());

//    // -------------------- ALL HOOKS MUST BE AT TOP ---------------------
//    const [product, setProduct] = useState(null);
//    const [images, setImages] = useState([]);
//    const [loading, setLoading] = useState(true);

//    const [quantity, setQuantity] = useState(1);
//    const [protection, setProtection] = useState(true);
//    const [giftOption, setGiftOption] = useState(true);
//    const [index, setIndex] = useState(0);
//    const [activeTab, setActiveTab] = useState("description");

//    const [selectedImage, setSelectedImage] = useState(null);

//    const roomBackgrounds = [
//      "/artimages/viewintheroom.jpg",
//      "/artimages/wall3.jpg",
//      "/artimages/wall4.webp",
//    ];

//    const [selectedRoom, setSelectedRoom] = useState(roomBackgrounds[0]);
//    const [showPopup, setShowPopup] = useState(false);

//    const artworkSize = { width: 100, height: 70 };
//    const handleShare = () => {
//      if (navigator.share) {
//        navigator
//          .share({
//            title: "Check out this artwork!",
//            text: "I found this amazing art on Artsays!",
//            url: window.location.href,
//          })
//          .then(() => console.log("Shared successfully"))
//          .catch((err) => console.log("Error sharing", err));
//      } else {
//        alert("Share not supported in this browser");
//      }
//    };
//   const [pinCode, setPinCode] = useState("");
//          const [address, setAddress] = useState("");

//          const addresses = {
//              "110017": "23 Aurum Lane, Sector 17, Vasant Vibe, New Delhi",
//              "560001": "MG Road, Bangalore, Karnataka",
//          };

//          const handleSubmit = (e) => {
//              e.preventDefault();

//              if (addresses[pinCode]) {
//                  setAddress(addresses[pinCode]);
//              } else {
//                  alert("Invalid PIN code");
//                  setAddress("");
//              }
//          };

//    useEffect(() => {
//      const fetchProduct = async () => {
//        try {
//          const [res1, res2, ratingRes, badgeRes] = await Promise.all([
//            getAPI("/api/getstatusapprovedproduct", {}, true, false),
//            getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
//            getAPI("/api/reviews/aggregated", {}, true, false),
//            getAPI("/api/products/approved-with-badges", {}, true, false),
//          ]);

//          const products1 =
//            res1?.data?.data?.filter((p) => p.status === "Approved") || [];

//          const products2 =
//            res2?.data?.data?.filter((p) => p.status === "Approved") || [];

//          let allProducts = [...products1, ...products2];

//          const ratings = ratingRes?.data?.data || [];

//          allProducts = allProducts.map((product) => {
//            const matchedRating = ratings.find(
//              (r) => String(r.productId) === String(product._id)
//            );

//            return {
//              ...product,
//              averageRating: matchedRating?.averageRating
//                ? Number(matchedRating.averageRating)
//                : null,
//              reviewCount: matchedRating?.reviewCount ?? 0,
//            };
//          });

//          const badgeData = badgeRes?.data?.data || [];

//          allProducts = allProducts.map((p) => {
//            const match = badgeData.find((b) => String(b._id) === String(p._id));
//            return {
//              ...p,
//              seller: match?.seller || p.seller,
//              badges: match?.badges || [],
//            };
//          });

//          console.log("URL Param:", id);
//          console.log(
//            "All Products:",
//            allProducts.map((p) => p._id)
//          );

//          const found = allProducts.find((p) => String(p._id) === String(id));

//          if (!found) {
//            console.log("❌ Product not found for given ID");
//            setLoading(false);
//            return;
//          }

//          const gallery = [
//            `${imageBaseURL}${found.mainImage}`,
//            ...(found.otherImages || []).map((img) => `${imageBaseURL}${img}`),
//          ];

//          setProduct(found);
//          setImages(gallery);
//          setSelectedImage(gallery[0]);
//          setLoading(false);
//        } catch (error) {
//          console.error("Error loading product:", error);
//          setLoading(false);
//        }
//      };

//      fetchProduct();
//    }, [id]);

//    const calculateDiscount = (sell, market) => {
//      if (sell == null || market == null) return 0;
//      if (sell >= market) return 0;
//      return Math.round(((market - sell) / market) * 100);
//    };

//    if (loading) {
//      return (
//        <div className="max-w-[1440px] mx-auto p-10 text-center text-xl font-semibold">
//          Loading product…
//        </div>
//      );
//    }

//    if (!product) {
//      return (
//        <div className="max-w-[1440px] mx-auto p-10 text-center text-xl font-semibold">
//          Product not found.
//        </div>
//      );
//    }

//    const discountPercent = calculateDiscount(
//      product.sellingPrice,
//      product.marketPrice
//    );

//    const nextSlide = () => {
//      if (index < images.length - 1) setIndex(index + 1);
//    };

//    const prevSlide = () => {
//      if (index > 0) setIndex(index - 1);
//    };

//    const changeImage = (direction) => {
//      const currentIndex = images.indexOf(selectedImage);
//      if (direction === "next") {
//        setSelectedImage(images[(currentIndex + 1) % images.length]);
//      } else {
//        setSelectedImage(
//          images[(currentIndex - 1 + images.length) % images.length]
//        );
//      }
//    };

//    const username = `${product?.userId?.username || ""}`.trim();
//    const artistName = `${product?.userId?.name || ""} ${
//      product?.userId?.lastName || ""
//    }`.trim();

//    return (
//      <div className="max-w-[1440px] mx-auto font-[Poppins] bg-[#ffffff] text-[#111] p-6">
//        <p className="text-sm text-gray-500">
//          Art / {product.mainCategory || "Painting"} / {product.category || ""}
//        </p>

//        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
//          <div className="col-span-8">
//            <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
//              {/* ---------------------- Image Section ------------------------ */}
//              <div className="flex flex-col lg:flex-row-reverse col-span-5 gap-3 relative">
//                <div className="relative w-full h-auto align-content-center product-card">
//                  <img
//                    src={selectedImage}
//                    alt={product.productName || "Product Image"}
//                    className="w-full h-[550px] object-contain product-img transition-all duration-300"
//                  />

//                  {/* View in Room */}
//                  <button
//                    onClick={() => setShowPopup(true)}
//                    className="absolute bottom-5 bg-dark text-white text-sm px-3 py-1 rounded-2xl shadow flex justify-self-center gap-1"
//                  >
//                    👁️ View in Room
//                  </button>

//                  {/* Share */}
//                  <button
//                    onClick={handleShare}
//                    className="absolute top-3 right-3 text-[#48372D] text-4xl py-1"
//                  >
//                    <BsTelegram />
//                  </button>

//                  {/* Arrows */}
//                  <div className="absolute top-1/2 right-3 -translate-y-1/2 flex flex-col gap-2">
//                    <button
//                      onClick={() => changeImage("prev")}
//                      className="text-[#48372D] text-4xl"
//                    >
//                      <FaChevronCircleLeft />
//                    </button>
//                    <button
//                      onClick={() => changeImage("next")}
//                      className="text-[#48372D] text-4xl"
//                    >
//                      <FaChevronCircleRight />
//                    </button>
//                  </div>
//                </div>

//                {/* Thumbnails */}
//                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[550px] scrollbar-hide">
//                  {images.map((img, i) => (
//                    <img
//                      key={i}
//                      src={img}
//                      alt={`thumb-${i}`}
//                      onClick={() => setSelectedImage(img)}
//                      className={`w-24 h-24 object-contain rounded-lg product-img product-card cursor-pointer border-2 transition-all duration-200 ${
//                        selectedImage === img
//                          ? "border-dark"
//                          : "border-transparent"
//                      }`}
//                    />
//                  ))}
//                </div>
//              </div>

//              {/* ---------------------- Product Info Section ------------------------ */}
//              <div className="col-span-5">
//                <h1 className="text-lg md:text-3xl font-semibold leading-snug">
//                  {product.productName}
//                </h1>

//                <div className="flex flex-wrap gap-2 text-xs mt-2">
//                  {product.tags?.length ? (
//                    product.tags.map((tag, i) => (
//                      <span
//                        key={i}
//                        className="bg-gray-200 px-2 py-1 rounded-md text-xs"
//                      >
//                        #{tag}
//                      </span>
//                    ))
//                  ) : (
//                    <span className="bg-gray-200 px-2 py-1 rounded-md text-xs">
//                      #Art
//                    </span>
//                  )}
//                </div>

//                {product.editionType && (
//                  <div className="flex gap-2 mt-2 text-xs">
//                    <span className="bg-gray-200 px-2 py-1 rounded-md">
//                      {product.editionType}
//                    </span>
//                  </div>
//                )}

//                {/* Artist Name */}
//                <p className="text-dark font-bold text-lg flex mt-2 items-center gap-1">
//                  {username || "Unknown"}

//                  {/* Dynamic badges */}
//                  {product.badges?.map((img, index) => (
//                    <img
//                      key={index}
//                      src={`${imageBaseURL}${img}`}
//                      className="w-5 h-5 rounded-full object-contain"
//                    />
//                  ))}
//                </p>

//                {/* Rating Placeholder */}
//                <div className="flex items-center text-yellow-500 mt-1">
//                  {[...Array(5)].map((_, i) => (
//                    <Star key={i} size={16} fill="#facc15" stroke="#facc15" />
//                  ))}
//                  <span className="text-dark ml-1 text-sm">(2,592)</span>
//                  <span className="text-dark text-sm ml-2">
//                    <strong>600+</strong> bought this month
//                  </span>
//                </div>

//                {/* PRICE */}
//                <div className="flex items-center gap-3 mt-3">
//                  {discountPercent > 0 && (
//                    <span className="bg-[#DC3545] px-2 py-1 rounded-md text-white font-bold">
//                      -{discountPercent}%
//                    </span>
//                  )}

//                  <p className="text-3xl font-bold">
//                    ₹{product.sellingPrice?.toLocaleString()}
//                  </p>

//                </div>

//                {/* Delivery Info */}
//                <div className="flex items-center mt-2 text-xs text-gray-500">
//                  {discountPercent > 0 && (
//                    <p className="text-dark text-lg text-xs">
//                      M.R.P.:{" "}
//                      <span className="line-through">
//                        ₹{product.marketPrice?.toLocaleString()}
//                      </span>
//                    </p>
//                  )}
//                  <span className="ml-2">Inclusive of all taxes</span>
//                </div>
//              </div>
//            </div>
//            <div className="flex gap-2 pt-2 justify-between">
//              <div className="p-2">
//                <img
//                  src="/herosectionimg/limited edition.png"
//                  alt="limited edition"
//                  className="w-full h-10 object-contain"
//                />
//                <p className="text-dark text-center text-xs mt-2 rounded">
//                  Limited Edition
//                </p>
//              </div>
//              {/* <div className="p-2">
//                              <img
//                                  src="/herosectionimg/original.png"
//                                  alt="original"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Original
//                              </p>
//                          </div>
//                          <div className="p-2">
//                              <img
//                                  src="/herosectionimg/premium.png"
//                                  alt="premium"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Premium
//                              </p>
//                          </div>
//                          <div className="p-2">
//                              <img
//                                  src="/herosectionimg/open edition.png"
//                                  alt="open edition"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Open Edition
//                              </p>
//                          </div> */}
//              <div className="p-2">
//                <img
//                  src="/herosectionimg/free delivery.png"
//                  alt="free delivery"
//                  className="w-full h-10 object-contain"
//                />
//                <p className="text-dark text-center text-xs mt-2 rounded">
//                  Free Delivery
//                </p>
//              </div>
//              <div className="p-2">
//                <img
//                  src="/herosectionimg/framed.png"
//                  alt="framed"
//                  className="w-full h-10 object-contain"
//                />
//                <p className="text-dark text-center text-xs mt-2 rounded">
//                  Framed
//                </p>
//              </div>
//              <div className="p-2">
//                <img
//                  src="/herosectionimg/handmade.png"
//                  alt="handemade"
//                  className="w-full h-10 object-contain"
//                />
//                <p className="text-dark text-center text-xs mt-2 rounded">
//                  Handmade
//                </p>
//              </div>
//              {/* <div className="p-2">
//                              <img
//                                  src="/herosectionimg/glass material.png"
//                                  alt="glass material"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Glass Material
//                              </p>
//                          </div>
//                          <div className="p-2">
//                              <img
//                                  src="/herosectionimg/gifting.png"
//                                  alt="gifting options"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Gifting Options
//                              </p>
//                          </div>
//                          <div className="p-2">
//                              <img
//                                  src="/herosectionimg/certified.png"
//                                  alt="certified"
//                                  className="w-full h-10 object-contain" />
//                              <p className="text-dark text-center text-xs mt-2 rounded">
//                                  Certified
//                              </p>
//                          </div> */}
//                          {/* Offers Section */}
//            <div className="w-full mx-auto">
//              {/* Header */}
//                                      <div className="flex items-center justify-between">
//                                          <div className="flex items-center gap-2">
//                                              <HiMiniPercentBadge className="text-red-500 text-xl" />
//                                              <h2 className="text-lg font-semibold">Offers</h2>
//                                          </div>
//                                          <div className="flex gap-2">
//                                              <button
//                                                  onClick={prevSlide}
//                                                  className={`p-2 rounded-full focus:bg-none transition ${index === 0 ? "opacity-40 cursor-not-allowed" : ""
//                                                      }`}
//                                              >
//                                                  <ChevronLeft />
//                                              </button>
//                                              <button
//                                                  onClick={nextSlide}
//                                                  className={`p-2 rounded-full focus:bg-none transition ${index >= offersData.length - 3 ? "opacity-40 cursor-not-allowed" : ""
//                                                      }`}
//                                              >
//                                                  <ChevronRight />
//                                              </button>
//                                          </div>
//                                      </div>

//                                      {/* Slider Container */}
//                                      <div className="overflow-hidden">
//                                          <div
//                                              className="flex transition-transform duration-500 ease-out"
//                                              style={{ transform: `translateX(-${index * 33.3333}%)` }}
//                                          >
//                                              {offersData.map((offer, i) => (
//                                                  <div
//                                                      key={i}
//                                                      className="min-w-[33.3333%] p-1"
//                                                  >
//                                                      <div className="border rounded-xl px-1 md:!px-3 py-2 h-full shadow-sm hover:shadow-md transition">
//                                                          <h3 className="font-bold text-md md:text-lg mb-2">{offer.title}</h3>
//                                                          <p className="text-xs text-gray-600 mb-2">{offer.description}</p>
//                                                          <p className="text-sm font-medium text-gray-800">{offer.offers}</p>
//                                                      </div>
//                                                  </div>
//                                              ))}
//                                          </div>
//                                      </div>
//                                  </div>

//                                    {/* Protection/ Buttons */}
//                                  <div className="w-full max-w-sm d-block d-md-none">
//                                      {/* Protection Plans */}
//                                      <div className="mt-3">
//                                          <p className="font-semibold text-lg">Add a protection plan</p>

//                                          <div className="mt-2 space-y-2">
//                                              <div className="flex items-start gap-2 text-sm cursor-pointer">
//                                                  <input
//                                                      type="checkbox"
//                                                      checked={protection}
//                                                      onChange={() => setProtection(!protection)}
//                                                      className="mt-1 accent-black"
//                                                  />
//                                                  <span>
//                                                      Screen Damage Protection while delivery for{" "}
//                                                      <span className="font-semibol">₹2,749.00</span>
//                                                  </span>
//                                              </div>

//                                              <div className="flex items-start gap-2 text-sm cursor-pointer">
//                                                  <input
//                                                      type="checkbox"
//                                                      checked={giftOption}
//                                                      onChange={() => setGiftOption(!giftOption)}
//                                                      className="mt-1 accent-black"
//                                                  />
//                                                  <span>
//                                                      Gift options for <span className="font-semibold">₹2,749.00</span>
//                                                  </span>
//                                              </div>
//                                          </div>
//                                      </div>
//            </div>

//            {/* ---------------- POPUP: VIEW IN ROOM ---------------- */}
//            {showPopup && (
//              <div
//                className="fixed inset-0 bg-opacity-60 backdrop-blur-md flex items-center justify-center z-[999]"
//                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
//              >
//                <div className="relative bg-white rounded-xl shadow-lg max-w-5xl w-full p-4">
//                  {/* Close BTN */}
//                  <button
//                    onClick={() => setShowPopup(false)}
//                    className="absolute top-3 right-3 text-gray-700 text-xl font-bold"
//                  >
//                    ✕
//                  </button>

//                  {/* Room Background */}
//                  <div className="relative w-full h-[550px] overflow-hidden rounded-lg">
//                    <img
//                      src={selectedRoom}
//                      alt="room"
//                      className="w-full h-full object-contain"
//                    />

//                    {/* Artwork Over Room */}
//                    <div className="absolute bottom-[200px] inset-0 flex justify-center items-center">
//                      <div className="relative">
//                        <img
//                          src={selectedImage}
//                          alt="art"
//                          className="object-contain rounded-lg mb-3"
//                          style={{
//                            width: `${artworkSize.width * 3}px`,
//                            height: `${artworkSize.height * 3}px`,
//                          }}
//                        />

//                        <div className="absolute -bottom-6 w-full text-center text-sm font-medium bg-white py-1 rounded-md">
//                          {artworkSize.width} × {artworkSize.height} cm
//                        </div>
//                      </div>
//                    </div>
//                  </div>

//                  {/* Room Selector */}
//                  <div className="flex justify-center gap-3 mt-4">
//                    {roomBackgrounds.map((room, i) => (
//                      <img
//                        key={i}
//                        src={room}
//                        alt={`room-${i}`}
//                        onClick={() => setSelectedRoom(room)}
//                        className={`w-24 h-20 object-cover rounded-lg cursor-pointer border-2 ${
//                          selectedRoom === room
//                            ? "border-dark"
//                            : "border-transparent"
//                        }`}
//                      />
//                    ))}
//                  </div>
//                </div>
//              </div>
//            )}
//            <div className="col-span-2 d-none d-md-block">
//            <div className="sticky top-10">
//              <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-dark px-3 py-3">
//                {/* Price + Wishlist */}
//                <div className="flex justify-between items-center">
//                  <p className="text-3xl font-bold">
//                    ₹{product.sellingPrice?.toLocaleString()}
//                  </p>
//                  <Heart className="text-dark text-lg" />
//                </div>

//                <p className="text-sm mt-1">
//                  FREE delivery{" "}
//                  <span className="font-semibold">
//                    {product.estimatedDelivery || "2–5 days"}
//                  </span>
//                </p>

//                {/* ADDRESS + PIN CHECK */}
//                <div className="max-w-md mt-4">
//                  <MapPin className="text-gray-400 mb-1" />

//                  <input
//                    type="text"
//                    placeholder="Enter Pin Code"
//                    className="w-full border-b-2 py-2 text-gray-600 placeholder-dark-400 focus:outline-none"
//                  />
//                </div>

//                {/* STOCK + SELLER DETAILS */}
//                <div className="mt-3">
//                  <p className="text-green-600 font-semibold">In Stock</p>

//                  <table className="mt-2 w-full text-sm">
//                    <tbody>
//                      <tr className="border-b border-gray-100">
//                        <td className="text-xs font-semibold py-1">
//                          Delivered by
//                        </td>
//                        <td className="text-left text-xs py-1">Artsays</td>
//                      </tr>

//                      <tr className="border-b border-gray-100">
//                        <td className="text-xs font-semibold py-1">Sold by</td>
//                        <td className="text-left text-xs text-orange-600 font-medium py-1 flex items-center gap-1">
//                          {username || "Unknown"}

//  {product.badges?.map((img, index) => (
//    <img
//      key={index}
//      src={`${imageBaseURL}${img}`}
//      className="w-4 h-4 rounded-full object-contain"
//    />
//  ))}
//                        </td>
//                      </tr>

//                      <tr className="border-b border-gray-100">
//                        <td className="text-xs font-semibold py-1">Artist</td>
//                        <td className="text-left text-xs text-orange-600 font-medium py-1">
//                          {artistName || "N/A"}
//                        </td>
//                      </tr>

//                      <tr>
//                        <td className="text-xs font-semibold py-1">Payment</td>
//                        <td className="text-left text-xs py-1">
//                          Secure Transaction
//                        </td>
//                      </tr>
//                    </tbody>
//                  </table>
//                </div>

//                {/* QUANTITY */}
//                <div className="mt-3 flex items-center justify-between">
//                  <span className="font-semibold text-sm">Quantity:</span>
//                  <select
//                    value={quantity}
//                    onChange={(e) => setQuantity(e.target.value)}
//                    className="border border-dark rounded-md px-3 py-1 text-sm"
//                  >
//                    {[...Array(10)].map((_, i) => (
//                      <option key={i + 1} value={i + 1}>
//                        {i + 1}
//                      </option>
//                    ))}
//                  </select>
//                </div>

//                {/* BUTTONS */}
//                <div className="mt-3 flex flex-col gap-3">
//                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart">
//                    <ShoppingCart size={18} /> Add to Cart
//                  </button>

//                  <button className="flex items-center justify-center gap-2 flex-1 bg-red-500 text-white rounded-full py-2 font-semibold buy-now">
//                    <Zap size={18} /> Buy Now
//                  </button>
//                </div>
//              </div>
//            </div>
//          </div>
//          </div>

//          <div className="mt-12 border-b">
//                                      {/* ===== Tabs ===== */}
//                                      <div
//                                          className="flex gap-8 text-[#48372D] font-medium text-lg border-b border-gray-200
//                                                      overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth select-none"
//                                          onMouseDown={(e) => {
//                                              const el = e.currentTarget;
//                                              el.isDown = true;
//                                              el.startX = e.pageX - el.offsetLeft;
//                                              el.scrollLeftStart = el.scrollLeft;
//                                          }}
//                                          onMouseLeave={(e) => {
//                                              e.currentTarget.isDown = false;
//                                          }}
//                                          onMouseUp={(e) => {
//                                              e.currentTarget.isDown = false;
//                                          }}
//                                          onMouseMove={(e) => {
//                                              const el = e.currentTarget;
//                                              if (!el.isDown) return;
//                                              e.preventDefault();
//                                              const x = e.pageX - el.offsetLeft;
//                                              const walk = (x - el.startX) * 1.5; // scroll speed
//                                              el.scrollLeft = el.scrollLeftStart - walk;
//                                          }}
//                                      >
//                                          {["description", "details", "artist", "reviews"].map((tab) => (
//                                              <button
//                                                  key={tab}
//                                                  onClick={() => setActiveTab(tab)}
//                                                  className={`pb-2 flex-shrink-0 transition-all duration-200 whitespace-nowrap ${activeTab === tab
//                                                      ? "border-b-4 border-[#48372D] font-semibold text-[#48372D] focus:outline-none"
//                                                      : "font-semibold text-[#48372D] focus:outline-none"
//                                                      }`}
//                                              >
//                                                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                              </button>
//                                          ))}
//                                      </div>

//                                      {/* ===== Tab Content ===== */}
//                                      <div className="py-6 text-gray-700 leading-relaxed text-sm">
//                                          {activeTab === "description" && (
//                                              <p>
//                                                  Inspired by the harmony of dreams and divine awakening, Dreamcatcher
//                                                  Lotus blends the protective symbolism of a dreamcatcher with the
//                                                  spiritual purity of the lotus flower. Handmade with intricate care, this
//                                                  piece channels positive energy, making it a beautiful and meaningful
//                                                  addition to any space. Ideal for gifting or personal zen corners.
//                                              </p>
//                                          )}

//                                          {activeTab === "details" && (
//                                              <div className="space-y-2">
//                                                  <h2 className="text-xl font-semibold">Artwork Specifications</h2>
//                                                  <p><span className="font-semibold">Material:</span> Cotton Thread & Beads</p>
//                                                  <p><span className="font-semibold">Dimensions:</span> 40 x 20 cm</p>
//                                                  <p><span className="font-semibold">Weight:</span> 350g</p>
//                                                  <p><span className="font-semibold">Care:</span> Wipe gently with a soft dry cloth</p>
//                                              </div>
//                                          )}

//                                          {activeTab === "artist" && (
//                                              <div>
//                                                  <p className="font-semibold text-lg">Artist: Neha Joshi</p>
//                                                  <p className="mt-2">
//                                                      Neha Joshi is a contemporary Indian artist specializing in spiritual
//                                                      and symbolic artworks. Her creations explore the connection between
//                                                      mindfulness and modern living, using handcrafted natural materials.
//                                                  </p>
//                                              </div>
//                                          )}

//                                          {activeTab === "reviews" && (
//                                              <div className="space-y-4">
//                                                  <div className="border p-3 rounded-lg shadow-sm">
//                                                      <p className="font-semibold">Aarav Patel ⭐⭐⭐⭐⭐</p>
//                                                      <p className="text-sm mt-1">
//                                                          Beautifully crafted! The attention to detail is stunning and it
//                                                          brings a calming energy to my home.
//                                                      </p>
//                                                  </div>
//                                                  <div className="border p-3 rounded-lg shadow-sm">
//                                                      <p className="font-semibold">Priya Mehta ⭐⭐⭐⭐☆</p>
//                                                      <p className="text-sm mt-1">
//                                                          Loved it! Just wished it came in a slightly bigger size.
//                                                      </p>
//                                                  </div>
//                                              </div>
//                                          )}
//                                      </div>
//                                  </div>

//                              </div>

//              </div>

//      </div>
//    );
//  };

//  export default ProductDetails;

import React, { useState, useEffect } from "react";
import { MdVerified } from "react-icons/md";
import { Star } from "lucide-react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HiMiniPercentBadge } from "react-icons/hi2";
import { Heart, MapPin, ArrowRight, ShoppingCart, Zap } from "lucide-react";
import { BsTelegram } from "react-icons/bs";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";
import getAPI from "../../api/getAPI";

const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

const offersData = [
  {
    title: "Cashback",
    description: "Upto ₹50.00 cashback as Google Pay Balance when...",
    offers: "3 offers",
  },
  {
    title: "Bank Offer",
    description: "Upto ₹1,000.00 discount on SBI Credit Cards",
    offers: "8 offers",
  },
  {
    title: "EMI Offers",
    description: "Get GST invoice and save up to 28% on business purchases",
    offers: "1 offer",
  },
  {
    title: "Festival Offer",
    description: "Flat ₹500 off on selected paintings during the festival sale",
    offers: "2 offers",
  },
];

const ProductDetails = () => {
  const { productId } = useParams();
  const id = productId;

  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const ratingValue = Number(product?.averageRating ?? 0);
  const reviewCount = Number(product?.reviewCount ?? 0);

  const [quantity, setQuantity] = useState(1);
  const [protection, setProtection] = useState(true);
  const [giftOption, setGiftOption] = useState(true);
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const [mainCategoryName, setMainCategoryName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
    categories: [],
    subCategories: [],
  });

  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const addresses = {
    110017: "23 Aurum Lane, Sector 17, Vasant Vibe, New Delhi",
    560001: "MG Road, Bangalore, Karnataka",
  };

  const artworkSize = { width: 100, height: 70 };
  const roomBackgrounds = [
    "/artimages/viewintheroom.jpg",
    "/artimages/wall3.jpg",
    "/artimages/wall4.webp",
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [res1, res2, ratingRes, badgeRes, reviewRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
          getAPI("/api/reviews/aggregated", {}, true, false),
          getAPI("/api/products/approved-with-badges", {}, true, false),
          getAPI("/api/reviews/all-reviews", {}, true, false),
        ]);

        setReviews(reviewRes?.data?.data || []);

        const products1 =
          res1?.data?.data?.filter((p) => p.status === "Approved") || [];
        const products2 =
          res2?.data?.data?.filter((p) => p.status === "Approved") || [];
        let allProducts = [...products1, ...products2];

        const ratings = ratingRes?.data?.data || [];
        allProducts = allProducts.map((product) => {
          const matchedRating = ratings.find(
            (r) => String(r.productId) === String(product._id)
          );
          return {
            ...product,
            averageRating: matchedRating?.averageRating
              ? Number(matchedRating.averageRating)
              : null,
            reviewCount: matchedRating?.reviewCount ?? 0,
          };
        });

        const badgeData = badgeRes?.data?.data || [];
        allProducts = allProducts.map((p) => {
          const match = badgeData.find((b) => String(b._id) === String(p._id));
          return {
            ...p,
            seller: match?.seller || p.seller,
            badges: match?.badges || [],
          };
        });

        const found = allProducts.find((p) => String(p._id) === String(id));
        if (!found) {
          console.warn("Product not found for id:", id);
          setLoading(false);
          return;
        }

        const gallery = [
          found.mainImage
            ? `${imageBaseURL}${found.mainImage}`
            : "/herosectionimg/placeholder.png",
          ...(found.otherImages || []).map((img) => `${imageBaseURL}${img}`),
        ];

        setProduct(found);
        setImages(gallery);
        setLoading(false);
      } catch (err) {
        console.error("Failed load:", err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, imageBaseURL]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAPI("/api/all-complete", {}, true, false);

        const data = res?.data?.data || {};

        setCategoryData({
          mainCategories: data.mainCategories || [],
          categories: data.categories || [],
          subCategories: data.subCategories || [],
        });
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const getMainCategoryById = (id) =>
    categoryData.mainCategories.find((c) => String(c._id) === String(id));

  const getCategoryById = (id) =>
    categoryData.categories.find((c) => String(c._id) === String(id));

  const getSubCategoryById = (id) =>
    categoryData.subCategories.find((c) => String(c._id) === String(id));

  useEffect(() => {
    if (!product || categoryData.mainCategories.length === 0) return;

    const mainCat = getMainCategoryById(product.mainCategory);
    const cat = getCategoryById(product.category);
    const subCat = getSubCategoryById(product.subCategory);

    setMainCategoryName(mainCat?.mainCategoryName || "N/A");
    setCategoryName(cat?.categoryName || "N/A");
    setSubCategoryName(subCat?.subCategoryName || "N/A");
  }, [product, categoryData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addresses[pinCode]) setAddress(addresses[pinCode]);
    else {
      alert("Invalid PIN code");
      setAddress("");
    }
  };

  const calculateDiscount = (sell, market) => {
    if (sell == null || market == null) return 0;
    if (sell >= market) return 0;
    return Math.round(((market - sell) / market) * 100);
  };

  const nextSlide = () => {
    if (index < offersData.length - 3) setIndex(index + 1);
  };
  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this artwork!",
          text: "I found this amazing art on Artsays!",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      alert("Share not supported in this browser");
    }
  };

  if (loading)
    return (
      <div className="max-w-[1440px] mx-auto p-10 text-center text-xl font-semibold">
        Loading product…
      </div>
    );
  if (!product)
    return (
      <div className="max-w-[1440px] mx-auto p-10 text-center text-xl font-semibold">
        Product not found.
      </div>
    );

  const discountPercent = calculateDiscount(
    product.sellingPrice,
    product.marketPrice
  );
  const username = `${
    product?.userId?.username ||
    `${product?.userId?.name || ""} ${product?.userId?.lastName || ""}`
  }`.trim();
  const artistName = `${product?.userId?.name || ""} ${
    product?.userId?.lastName || ""
  }`.trim();

  const ProductImages = ({ imagesProp, initialImage }) => {
    const [selectedImage, setSelectedImage] = useState(
      initialImage || imagesProp[0] || "/herosectionimg/placeholder.png"
    );
    const [selectedRoom, setSelectedRoom] = useState(roomBackgrounds[0]);
    const [showPopup, setShowPopup] = useState(false);

    const changeImage = (direction) => {
      if (!imagesProp || imagesProp.length === 0) return;
      const currentIndex = imagesProp.indexOf(selectedImage);
      if (currentIndex === -1) return setSelectedImage(imagesProp[0]);
      if (direction === "next")
        setSelectedImage(imagesProp[(currentIndex + 1) % imagesProp.length]);
      else
        setSelectedImage(
          imagesProp[(currentIndex - 1 + imagesProp.length) % imagesProp.length]
        );
    };
    const Section = ({ title, children }) => (
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    );

    const Grid = ({ children }) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-10">
        {children}
      </div>
    );

    const Field = ({ label, value }) => {
      if (!value || value === "N/A" || value === "") return null;

      const values = Array.isArray(value) ? value : [value];

      const isImage = values.some((val) =>
        /\.(jpg|jpeg|png|webp|gif)$/i.test(val)
      );

      return (
        <div className="text-sm mb-2">
          <strong>{label}:</strong>

          {isImage ? (
            <div className="mt-2 flex gap-2 flex-wrap">
              {values.map((img, idx) => {
                const fullURL = img.startsWith("http")
                  ? img
                  : `${imageBaseURL}${img}`;

                const dialogId = `dialog-${label.replace(/\s/g, "_")}-${idx}`;

                return (
                  <div key={idx}>
                    {/* Thumbnail */}
                    <img
                      src={fullURL}
                      alt={label}
                      className="w-40 h-40 object-cover rounded border cursor-pointer hover:scale-105 transition"
                      onClick={() => {
                        document.getElementById(dialogId).showModal();
                      }}
                    />

                    {/* Popup dialog */}
                    <dialog
                      id={dialogId}
                      className="rounded-lg p-0 bg-transparent"
                    >
                      <div
                        className="fixed inset-0 breadcrumb-item active flex justify-center items-center"
                        onClick={() =>
                          document.getElementById(dialogId).close()
                        }
                      >
                        <img
                          src={fullURL}
                          className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </dialog>
                  </div>
                );
              })}
            </div>
          ) : (
            <> {value}</>
          )}
        </div>
      );
    };

    const hasAnyValue = (obj) =>
      Object.values(obj).some(
        (v) => v !== undefined && v !== null && v !== "" && v !== "N/A"
      );

    return (
      <div className="max-w-[1440px] mx-auto font-[Poppins] bg-[#ffffff] text-[#111] p-6">
        {/* <p className="text-sm text-gray-500">
          {mainCategoryName}/ {categoryName}/ {subCategoryName} / {product.productName}
        </p> */}
        <p className="text-sm text-gray-500">
          {[
            mainCategoryName,
            categoryName,
            subCategoryName,
            product.productName,
          ]
            .filter((v) => v && v !== "N/A") // remove empty + N/A
            .join(" / ")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
          <div className="col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
              {/* ===== Left: Image Gallery ===== */}
              <div className="flex flex-col lg:flex-row-reverse col-span-5 gap-3 relative">
                <div className="relative w-full h-auto align-content-center product-card">
                  <img
                    src={selectedImage}
                    alt="Main"
                    className="w-full h-[550px] object-contain product-img transition-all duration-300"
                  />

                  <button
                    onClick={() => setShowPopup(true)}
                    className="absolute bottom-5 bg-[#48372D] text-white text-sm px-3 py-1 rounded-2xl shadow flex justify-self-center gap-1"
                  >
                    👁️ View in Room
                  </button>

                  <button
                    onClick={handleShare}
                    className="absolute top-3 right-3 text-[#48372D] text-4xl py-1"
                  >
                    <BsTelegram />
                  </button>

                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex flex-col gap-2">
                    <button
                      onClick={() => changeImage("prev")}
                      className="text-[#48372D] text-4xl"
                    >
                      <FaChevronCircleLeft />
                    </button>
                    <button
                      onClick={() => changeImage("next")}
                      className="text-[#48372D] text-4xl"
                    >
                      <FaChevronCircleRight />
                    </button>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[550px] scrollbar-hide">
                  {imagesProp.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`thumb-${i}`}
                      onClick={() => setSelectedImage(img)}
                      className={`w-24 h-24 object-contain rounded-lg product-img product-card cursor-pointer border-2 transition-all duration-200 ${
                        selectedImage === img
                          ? "border-[#48372D]"
                          : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* POPUP */}
              {showPopup && (
                <div
                  className="fixed inset-0 bg-opacity-60 backdrop-blur-md flex items-center justify-center z-[999]"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                  <div className="relative bg-white rounded-xl shadow-lg max-w-5xl w-full p-4">
                    <button
                      onClick={() => setShowPopup(false)}
                      className="absolute top-3 right-3 text-gray-700 text-xl font-bold"
                    >
                      ✕
                    </button>
                    <div className="relative w-full h-[550px] overflow-hidden rounded-lg">
                      <img
                        src={selectedRoom}
                        alt="room"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-[200px] inset-0 flex justify-center items-center">
                        <div className="relative">
                          <img
                            src={selectedImage}
                            alt="art"
                            className="object-contain rounded-lg mb-3"
                            style={{
                              width: `${artworkSize.width * 3}px`,
                              height: `${artworkSize.height * 3}px`,
                            }}
                          />
                          <div className="absolute -bottom-6 w-full text-center text-sm font-medium bg-white py-1 rounded-md">
                            {artworkSize.width} × {artworkSize.height} cm
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 mt-4">
                      {roomBackgrounds.map((room, i) => (
                        <img
                          key={i}
                          src={room}
                          alt={`room-${i}`}
                          onClick={() => setSelectedRoom(room)}
                          className={`w-24 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                            selectedRoom === room
                              ? "border-[#48372D]"
                              : "border-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== Right: Product Info ===== */}
              <div className="col-span-5">
                <h1 className="text-lg md:text-3xl font-semibold leading-snug">
                  {product.productName}
                </h1>

                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  {product.tags?.length ? (
                    product.tags.map((t, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 px-2 py-1 rounded-md"
                      >
                        #{t}
                      </span>
                    ))
                  ) : (
                    <span className="bg-gray-200 px-2 py-1 rounded-md">
                      #Art
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  <span className="bg-gray-200 px-2 py-1 rounded-md">
                    {product.editionType || "Original Artwork"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark font-bold text-lg flex mr-3 mt-2 items-center">
                      {username}{" "}
                      {product?.userId?.verified && (
                        <MdVerified className="ml-1 text-blue-600 w-4 h-4" />
                      )}{" "}
                      {product.badges?.map((img, index) => (
                        <img
                          key={index}
                          src={`${imageBaseURL}${img}`}
                          className="w-4 h-4 rounded-full object-contain"
                        />
                      ))}
                    </p>
                    {/* <div className="flex items-center text-yellow-500 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill="#facc15"
                          stroke="#facc15"
                        />
                      ))}
                      <span className="text-dark ml-1 text-sm">
                        ({product?.reviewCount 
 ?? 0})
                      </span>
                      <span className="text-dark text-sm ml-2">
                        <strong>600+</strong> bought this month
                      </span>
                    </div> */}

                    <div className="flex items-center mt-2">
                      <span className="text-dark ml-2 text-sm font-medium px-2">
                        {ratingValue.toFixed(1)}
                      </span>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < ratingValue ? "#facc15" : "none"}
                          stroke="#facc15"
                        />
                      ))}
                      <span className="text-dark ml-2 text-sm">
                        ({reviewCount})
                      </span>

                      <span className="text-dark text-sm ml-3">
                        <strong>{Math.max(50, reviewCount * 10)}+</strong>{" "}
                        bought this month
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  {discountPercent > 0 && (
                    <span className="bg-[#DC3545] px-2 py-1 rounded-md text-white font-bold text-md">
                      -{discountPercent}%
                    </span>
                  )}
                  <p className="text-3xl font-bold">
                    ₹{product.sellingPrice?.toLocaleString()}
                  </p>
                  {product.marketPrice && (
                    <p className="text-dark line-through text-lg">
                      ₹{product.marketPrice?.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <div className="text-gray-500 text-xs">
                    M.R.P.:{" "}
                    <span className="line-through">
                      ₹{product.marketPrice?.toLocaleString() || "—"}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    Inclusive of all taxes
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 justify-between">
                  <div className="p-2">
                    <img
                      src="/herosectionimg/free delivery.png"
                      alt="free"
                      className="w-full h-10 object-contain"
                    />
                    <p className="text-dark text-center text-xs mt-2">
                      Free Delivery
                    </p>
                  </div>

                {product.editionType?.toLowerCase().includes("limited") && (
  <div className="p-2">
    <img
      src="/herosectionimg/limited edition.png"
      alt="limited"
      className="w-full h-10 object-contain"
    />
    <p className="text-dark text-center text-xs mt-2">Limited Edition</p>
  </div>
)}

{product.editionType?.toLowerCase().includes("original") && (
  <div className="p-2">
    <img
      src="/herosectionimg/original.png"
      alt="original"
      className="w-full h-10 object-contain"
    />
    <p className="text-dark text-center text-xs mt-2 rounded">Original</p>
  </div>
)}

{product.editionType?.toLowerCase().includes("premium") && (
  <div className="p-2">
    <img
      src="/herosectionimg/premium.png"
      alt="premium"
      className="w-full h-10 object-contain"
    />
    <p className="text-dark text-center text-xs mt-2 rounded">Premium</p>
  </div>
)}

{product.editionType?.toLowerCase().includes("open") && (
  <div className="p-2">
    <img
      src="/herosectionimg/open edition.png"
      alt="open edition"
      className="w-full h-10 object-contain"
    />
    <p className="text-dark text-center text-xs mt-2 rounded">Open Edition</p>
  </div>
)}


{product.materials?.some(mat => mat.toLowerCase() === "glass") && (
  <div className="p-2">
    <img
      src="/herosectionimg/glass material.png"
      alt="glass material"
      className="w-full h-10 object-contain"
    />
    <p className="text-dark text-center text-xs mt-2 rounded">
      Glass Material
    </p>
  </div>
)}



{product.framing?.toLowerCase() === "framed" && (
  <div className="p-2">
    <img
      src="/herosectionimg/framed.png"
      alt="framed"
      className="w-full h-10 object-contain"
    />
    <p className="text-dark text-center text-xs mt-2">Framed</p>
  </div>
)}

{product.framing?.toLowerCase() === "unframed" && (
  <div className="p-2">
    <img
      src="/herosectionimg/framed.png"
      alt="unframed"
      className="w-full h-10 object-contain"
    />
    <p className="text-dark text-center text-xs mt-2">Unframed</p>
  </div>
)}

{product.handmade === "Yes" && (
  <div className="p-2">
    <img
      src="/herosectionimg/handmade.png"
      alt="handmade"
      className="w-full h-10 object-contain"
    />
    <p className="text-dark text-center text-xs mt-2">Handmade</p>
  </div>
)}
{product.giftWrapping  && (
  <div className="p-2">
    <img
      src="/herosectionimg/gifting.png"
      alt="gifting options"
      className="w-full h-10 object-contain"
    />
    <p className="text-dark text-center text-xs mt-2 rounded">Gifting Options</p>
  </div>
)}

{product.artistSignature  && (
  <div className="p-2">
    <img
      src="/herosectionimg/certified.png"
      alt="certified"
      className="w-full h-10 object-contain"
    />
    <p className="text-dark text-center text-xs mt-2 rounded">Certified</p>
  </div>
)}
                </div>

                {/* Mobile / small screen stock info (template) */}
                <div className="w-full max-w-sm d-block d-md-none mt-3">
                  <div className="flex items-start gap-2 mt-2 text-sm text-dark">
                    <MapPin size={18} className="text-dark mt-1" />
                    <p>
                      {product.addressLine1 ||
                        "23 Aurum Lane, Sector 17, Vasant Vibe, New Delhi"}
                    </p>
                  </div>

                  <div className="mt-3">
                    <p className="text-green-600 font-semibold">In Stock</p>
                    <table className="mt-2 w-full text-sm">
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="text-xs font-semibold py-1">
                            Delivered by
                          </td>
                          <td className="text-left text-xs py-1">Artsays</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="text-xs font-semibold py-1">
                            Sold by
                          </td>
                          <td className="text-left text-xs text-orange-600 font-medium py-1 flex items-center gap-1">
                            {username}{" "}
                            {product?.userId?.verified && (
                              <MdVerified className="text-blue-600 w-4 h-4" />
                            )}
                            {product.badges?.map((img, index) => (
                              <img
                                key={index}
                                src={`${imageBaseURL}${img}`}
                                className="w-4 h-4 rounded-full object-contain"
                              />
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-xs font-semibold py-1">Artist</td>
                          <td className="text-left text-xs text-orange-600 font-medium py-1">
                            {artistName || "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Offers block (left column) */}
                <div className="w-full mx-auto mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HiMiniPercentBadge className="text-red-500 text-xl" />
                      <h2 className="text-lg font-semibold">Offers</h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={prevSlide}
                        className={`p-2 rounded-full focus:bg-none ${
                          index === 0 ? "opacity-40 cursor-not-allowed" : ""
                        }`}
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        onClick={nextSlide}
                        className={`p-2 rounded-full focus:bg-none ${
                          index >= offersData.length - 3
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden mt-3">
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${index * 33.3333}%)` }}
                    >
                      {offersData.map((offer, i) => (
                        <div key={i} className="min-w-[33.3333%] p-1">
                          <div className="border rounded-xl px-1 md:!px-3 py-2 h-full shadow-sm hover:shadow-md transition">
                            <h3 className="font-bold text-md md:text-lg mb-2">
                              {offer.title}
                            </h3>
                            <p className="text-xs text-gray-600 mb-2">
                              {offer.description}
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                              {offer.offers}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs (left column area) */}
            <div className="mt-12 border-b">
              <div className="flex gap-8 text-[#48372D] font-medium text-lg border-b border-gray-200 overflow-x-auto no-scrollbar">
                {["description", "details", "artist", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 flex-shrink-0 transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab
                        ? "border-b-4 border-[#48372D] font-semibold text-[#48372D]"
                        : "font-semibold text-[#48372D]"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="py-6 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap break-words w-full">
                {activeTab === "description" && (
                  <p>{product.description || "No description available."}</p>
                )}

                {activeTab === "details" && (
                  <div className="space-y-10 text-sm">
                    {/* SECTION: Artwork Basics */}
                    <Section title="Artwork Basics">
                      <Grid>
                        <Field label="Main Category" value={mainCategoryName} />
                        <Field label="Category" value={categoryName} />

                        <Field label="Sub Category" value={subCategoryName} />
                        <Field
                          label="Product Type"
                          value={product.productType?.join(", ")}
                        />

                        <Field
                          label="Edition Type"
                          value={product.editionType}
                        />
                        <Field
                          label="Edition Number"
                          value={product.editionNumber}
                        />

                        <Field label="Year" value={product.year} />
                        <Field label="Medium" value={product.medium} />

                        <Field
                          label="Materials"
                          value={product.materials?.join(", ")}
                        />
                        <Field
                          label="Surface Type"
                          value={product.surfaceType}
                        />

                        <Field
                          label="Cultural Region"
                          value={product.culturalRegion}
                        />
                        <Field
                          label="Biological Material"
                          value={product.biologicalMaterial}
                        />

                        <Field
                          label="Inspiration Source"
                          value={product.inspirationSource}
                        />

                        <Field
                          label="Functional Use"
                          value={product.functionalUse}
                        />
                        <Field
                          label="Craft Technique"
                          value={product.craftTechnique}
                        />
                        <Field
                          label="Tool Usage"
                          value={product.toolUsage?.join(", ")}
                        />
                        <Field
                          label="Material Source"
                          value={product.materialSource}
                        />

                        <Field
                          label="Print Resolution"
                          value={product.printResolution}
                        />

                        <Field
                          label="Cultural Region"
                          value={product.culturalRegion}
                        />
                        <Field
                          label="Biological Material"
                          value={product.biologicalMaterial}
                        />
                      </Grid>
                    </Section>

                    {/* SECTION: Dimensions */}
                    <Section title="Dimensions & Build">
                      <Grid>
                        <Field
                          label="Dimensions"
                          value={
                            product.dimensions?.width
                              ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
                              : ""
                          }
                        />
                        <Field
                          label="Weight"
                          value={product.weight ? `${product.weight}g` : ""}
                        />

                        <Field label="Framing" value={product.framing} />
                        <Field label="Handmade" value={product.handmade} />

                        <Field
                          label="Resin Covered"
                          value={product.isResinCovered ? "Yes" : "No"}
                        />
                        <Field
                          label="Signed"
                          value={product.isSigned ? "Yes" : "No"}
                        />

                        <Field label="Condition" value={product.condition} />
                        <Field label="HSN Code" value={product.hsnCode} />
                      </Grid>
                    </Section>

                    {/* SECTION: Pricing */}
                    <Section title="Pricing & Sales">
                      <Grid>
                        <Field
                          label="Selling Price"
                          value={`₹${product.sellingPrice}`}
                        />
                        <Field
                          label="Market Price"
                          value={`₹${product.marketPrice}`}
                        />

                        <Field
                          label="Final Price"
                          value={`₹${product.finalPrice}`}
                        />
                        <Field
                          label="Discount"
                          value={`${product.discount}%`}
                        />

                        <Field
                          label="Installments"
                          value={product.allowInstallments ? "Yes" : "No"}
                        />
                        <Field
                          label="Installment Duration"
                          value={product.installmentDuration}
                        />

                        <Field
                          label="GST Included"
                          value={product.includeGst ? "Yes" : "No"}
                        />
                        <Field
                          label="GST Percentage"
                          value={`${product.gstPercentage}%`}
                        />
                      </Grid>
                    </Section>

                    {/* SECTION: Shipping */}
                    <Section title="Shipping & Packaging">
                      <Grid>
                        <Field
                          label="Shipping Charges"
                          value={`₹${product.shippingCharges}`}
                        />
                        <Field
                          label="Handling Time"
                          value={product.handlingTime}
                        />

                        <Field
                          label="Estimated Delivery"
                          value={product.estimatedDelivery}
                        />
                        <Field
                          label="Packaging Type"
                          value={product.packagingType}
                        />

                        <Field
                          label="Insurance Coverage"
                          value={product.insuranceCoverage ? "Yes" : "No"}
                        />
                        <Field
                          label="Self Shipping"
                          value={product.selfShipping ? "Yes" : "No"}
                        />

                        <Field
                          label="Return Policy"
                          value={product.returnPolicy}
                        />
                        <Field
                          label="Export Restriction"
                          value={product.exportRestriction ? "Yes" : "No"}
                        />
                      </Grid>
                    </Section>

                    {/* SECTION: Legal */}
                    <Section title="Legal & Compliance">
                      <Grid>
                        <Field
                          label="Ownership Confirmation"
                          value={product.ownershipConfirmation ? "Yes" : "No"}
                        />
                        <Field
                          label="Copyright"
                          value={product.copyrightRights}
                        />

                        <Field
                          label="COA Available"
                          value={product.coaAvailable ? "Yes" : "No"}
                        />
                        <Field
                          label="Certificate Type"
                          value={product.certificateType}
                        />

                        <Field label="Issuer Name" value={product.issuerName} />
                        <Field
                          label="Verification Number"
                          value={product.verificationNumber}
                        />

                        <Field label="Provenance" value={product.provenance} />
                        <Field
                          label="Signature Type"
                          value={product.signatureType}
                        />

                        <Field label="COA Document" value={product.coaFile} />
                       
                        <Field label="Certificate Document" value={product.certificateFile} />

                      </Grid>
                    </Section>

                    {/* SECTION: Address */}
                    <Section title="Seller Address">
                      <Grid>
                        <Field
                          label="Address Line 1"
                          value={product.addressLine1}
                        />
                        <Field
                          label="Address Line 2"
                          value={product.addressLine2}
                        />

                        <Field label="Landmark" value={product.landmark} />
                        <Field label="City" value={product.city} />

                        <Field label="State" value={product.state} />
                        <Field label="Country" value={product.country} />

                        <Field label="Pincode" value={product.pincode} />
                      </Grid>
                    </Section>

                    {hasAnyValue({
                      originRegion: product.originRegion,
                      periodEra: product.periodEra,
                      antiqueCondition: product.antiqueCondition,
                      conservationStatus: product.conservationStatus,
                      restorationHistory: product.restorationHistory,
                      restorationDocumentation: product.restorationDocumentation,
                      provenanceHistory: product.provenanceHistory,
                      culturalSignificance: product.culturalSignificance,
                      appraisalDetails: product.appraisalDetails,
                      engravingMarkings: product.engravingMarkings,
                      patinaWear: product.patinaWear,
                      isHandmade: product.isHandmade,
                      originalReproduction: product.originalReproduction,
                      museumExhibitionHistory: product.museumExhibitionHistory,
                      maintenanceRequired: product.maintenanceRequired,
                      customEngravingAvailable: product.customEngravingAvailable,
                      certification: product.certification,
                    }) && (
                      <Section title="Antique & Vintage Details">
                        <Grid>
                          <Field
                            label="Origin Region"
                            value={product.originRegion}
                          />
                          <Field
                            label="Period / Era"
                            value={product.periodEra}
                          />
                          <Field
                            label="Antique Condition"
                            value={product.antiqueCondition}
                          />
                          <Field
                            label="Conservation Status"
                            value={product.conservationStatus}
                          />

                          <Field
                            label="Provenance History"
                            value={product.provenanceHistory}
                          />
                          <Field
                            label="Cultural Significance"
                            value={product.culturalSignificance}
                          />

                          <Field
                            label="Appraisal Details"
                            value={product.appraisalDetails}
                          />
                          <Field
                            label="Engravings / Markings"
                            value={product.engravingMarkings}
                          />

                          <Field
                            label="Patina / Wear"
                            value={product.patinaWear}
                          />
                          <Field
                            label="Handmade (Antique Context)"
                            value={product.isHandmade ? "Yes" : "No"}
                          />

                          <Field
                            label="Original / Reproduction"
                            value={product.originalReproduction}
                          />

                          <Field
                            label="Museum Exhibition History"
                            value={product.museumExhibitionHistory}
                          />

                          <Field
                            label="Maintenance Required"
                            value={product.maintenanceRequired}
                          />
                          <Field
                            label="Custom Engraving Available"
                            value={
                              product.customEngravingAvailable ? "Yes" : "No"
                            }
                          />

                          <Field
                            label="Restoration Documentation"
                            value={product.restorationDocumentation}
                          />
                          <Field
                            label="Certification"
                            value={product.certification}
                          />
                          <Field
                            label="Restoration History"
                            value={product.restorationHistory}
                          />
                        </Grid>
                      </Section>
                    )}
                  </div>
                )}

                {activeTab === "artist" && (
                  <div>
                    <p className="font-semibold text-lg">
                      Artist: {artistName || "N/A"}
                    </p>
                    <p className="mt-2">
                      {product.artistBio || "Artist details not available."}
                    </p>
                  </div>
                )}

                {/* {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <div className="border p-3 rounded-lg shadow-sm">
                      <p className="font-semibold">Aarav Patel ⭐⭐⭐⭐⭐</p>
                      <p className="text-sm mt-1">
                        Beautifully crafted! The attention to detail is stunning
                        and it brings a calming energy to my home.
                      </p>
                    </div>
                    <div className="border p-3 rounded-lg shadow-sm">
                      <p className="font-semibold">Priya Mehta ⭐⭐⭐⭐☆</p>
                      <p className="text-sm mt-1">
                        Loved it! Just wished it came in a slightly bigger size.
                      </p>
                    </div>
                  </div>
                )} */}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {productReviews.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No reviews yet for this product.
                      </p>
                    )}

                    {productReviews.map((review, idx) => (
                      <div
                        key={idx}
                        className="border p-4 rounded-lg shadow-sm bg-white"
                      >
                        <div className="flex items-center justify-between">
                          {/* User Name */}
                          <p className="font-semibold text-md">
                            {review?.userId?.name} {review?.userId?.lastName}
                          </p>

                          {/* Stars */}
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                fill="#facc15"
                                stroke="#facc15"
                              />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star key={i} size={18} stroke="#d1d5db" />
                            ))}
                          </div>
                        </div>

                        {/* Review Title */}
                        <p className="font-medium mt-1">{review.title}</p>

                        {/* Description */}
                        <p className="text-sm text-gray-700 mt-1">
                          {review.description}
                        </p>

                        {/* Review Photos */}
                        {review.photos?.length > 0 && (
                          <div className="flex gap-3 mt-3">
                            {review.photos.map((img, i) => (
                              <img
                                key={i}
                                src={`${imageBaseURL}${img}`}
                                className="w-20 h-20 rounded-lg object-cover border"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Price Card (2 cols) */}
          <div className="col-span-2 d-none d-md-block">
            <div className="sticky top-10">
              <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-dark px-3 py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-bold">
                      ₹ {product.sellingPrice?.toLocaleString() || "—"}
                    </p>
                  </div>
                  <button>
                    <Heart className="text-dark text-lg" />
                  </button>
                </div>

                <p className="text-sm mt-1">
                  FREE delivery{" "}
                  <span className="font-semibold">
                    {product.estimatedDelivery || "2–5 days"} days.
                  </span>
                  <br />
                  <span className="text-orange-600 cursor-pointer">
                    Details
                  </span>
                </p>

                <div className="max-w-md mt-3">
                  {!address ? (
                    <form onSubmit={handleSubmit} className="relative w-full">
                      <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="text"
                        placeholder="Enter Pin Code"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="w-full !border-b-2 py-2 pl-6 pr-10 text-gray-400 placeholder-dark-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-start gap-2 mt-2 text-sm text-dark">
                      <MapPin className="text-dark text-xl" />
                      <p>{address}</p>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <p className="text-green-600 font-semibold">In Stock</p>
                  <table className="mt-2 w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="text-xs font-semibold py-1">
                          Delivered by
                        </td>
                        <td className="text-left text-xs py-1">Artsays</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="text-xs font-semibold py-1">Sold by</td>
                        <td className="text-left text-xs text-orange-600 font-medium py-1 flex items-center gap-1">
                          {username}{" "}
                          {product?.userId?.verified && (
                            <MdVerified className="text-blue-600 w-4 h-4" />
                          )}
                          {product.badges?.map((img, index) => (
                            <img
                              key={index}
                              src={`${imageBaseURL}${img}`}
                              className="w-4 h-4 rounded-full object-contain"
                            />
                          ))}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="text-xs font-semibold py-1">Artist</td>
                        <td className="text-left text-xs text-orange-600 font-medium py-1">
                          {artistName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-xs font-semibold py-1">Payment</td>
                        <td className="text-left text-xs py-1">
                          Secure Transaction
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-3">
                  <p className="font-semibold text-lg">Add a protection plan</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={protection}
                        onChange={() => setProtection(!protection)}
                        className="mt-1 accent-black"
                      />
                      <span>
                        Screen Damage Protection while delivery for{" "}
                        <span className="font-semibol">₹2,749.00</span>
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftOption}
                        onChange={() => setGiftOption(!giftOption)}
                        className="mt-1 accent-black"
                      />
                      <span>
                        Gift options for{" "}
                        <span className="font-semibold">₹2,749.00</span>
                      </span>
                    </div>
                  </div>
                </div>

                {product.quantity > 1 && (
                  <div className="mt-3 flex items-center justify-around">
                    <span className="font-semibold text-sm">Quantity :</span>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-dark rounded-md px-3 py-1 text-sm focus:outline-none"
                    >
                      {[...Array(product.quantity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-3">
                  <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart">
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                  <button className="flex items-center justify-center gap-2 flex-1 hover:border-dark rounded-full bg-red-500 text-white py-2 font-semibold buy-now">
                    <Zap size={18} /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // const productReviews = reviews.filter(
  //   (r) => String(r.productId?._id) === String(product?._id)
  // );
const productReviews = reviews.filter((review) => {
  const buyerRequest = review.productId;
  if (!buyerRequest) return false;

  
  const reviewProductName = buyerRequest.ProductName?.trim()?.toLowerCase();
  const currentProductName = product.productName?.trim()?.toLowerCase();

  return reviewProductName === currentProductName;
});




  return <ProductImages imagesProp={images} initialImage={images[0]} />;
};

export default ProductDetails;
