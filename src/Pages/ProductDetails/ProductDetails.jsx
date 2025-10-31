import { MdVerified } from "react-icons/md";
import { Star, Truck, Gift, Banknote, CreditCard } from "lucide-react";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HiMiniPercentBadge } from "react-icons/hi2";
import { Heart, MapPin, ArrowRight, ShoppingCart, Zap } from "lucide-react";
import { BsTelegram } from "react-icons/bs";
import { FaChevronCircleRight } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";

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
    const [quantity, setQuantity] = useState(1);
    const [protection, setProtection] = useState(true);
    const [giftOption, setGiftOption] = useState(true);
    const [index, setIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("description");

    const images = [
        "/herosectionimg/12.jpg",
        "/herosectionimg/13.jpg",
        "/herosectionimg/14.jpg",
        "/herosectionimg/11.jpg",
        "/herosectionimg/1.jpg",
        "/herosectionimg/2.png",
        "/herosectionimg/shraddha.jpg",
    ];

    const [selectedImage, setSelectedImage] = useState(images[0]);

    const nextSlide = () => {
        if (index < offersData.length - 3) setIndex(index + 1);
    };

    const ProductImages = () => {
        const roomBackgrounds = [
            "/artimages/viewintheroom.jpg",
            "/artimages/wall3.jpg",
            "/artimages/wall4.webp",
        ];

        const [selectedImage, setSelectedImage] = useState(images[0]);
        const [selectedRoom, setSelectedRoom] = useState(roomBackgrounds[0]);
        const [showPopup, setShowPopup] = useState(false);

        // Example artwork size (in inches or cm)
        const artworkSize = { width: 100, height: 70 };

        const changeImage = (direction) => {
            const currentIndex = images.indexOf(selectedImage);
            if (direction === 'next') {
                setSelectedImage(images[(currentIndex + 1) % images.length]);
            } else {
                setSelectedImage(images[(currentIndex - 1 + images.length) % images.length]);
            }
        };

        const handleShare = () => {
            if (navigator.share) {
                navigator
                    .share({
                        title: 'Check out this artwork!',
                        text: 'I found this amazing art on Artsays!',
                        url: window.location.href,
                    })
                    .then(() => console.log('Shared successfully'))
                    .catch((err) => console.log('Error sharing', err));
            } else {
                alert('Share not supported in this browser');
            }
        };

        const [pinCode, setPinCode] = useState("");
        const [address, setAddress] = useState("");

        const addresses = {
            "110017": "23 Aurum Lane, Sector 17, Vasant Vibe, New Delhi",
            "560001": "MG Road, Bangalore, Karnataka",
        };

        const handleSubmit = (e) => {
            e.preventDefault();

            if (addresses[pinCode]) {
                setAddress(addresses[pinCode]);
            } else {
                alert("Invalid PIN code");
                setAddress("");
            }
        };

        const prevSlide = () => {
            if (index > 0) setIndex(index - 1);
        };
        return (
            <div className="max-w-[1440px] mx-auto font-[Poppins] bg-[#ffffff] text-[#111] p-6">
                {/* ====== Top Section ====== */}
                <p className="text-sm text-gray-500">Art / Painting / Abstract</p>
                <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
                    <div className="col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-3">
                            {/* ===== Left: Image Gallery ===== */}

                            <div className="flex flex-col lg:flex-row-reverse col-span-5 gap-3 relative">
                                {/* ===== Main Image ===== */}
                                <div className="relative w-full h-auto align-content-center product-card">
                                    <img
                                        src={selectedImage}
                                        alt="Main"
                                        className="w-full h-[550px] object-contain product-img transition-all duration-300"
                                    />

                                    {/* ===== View in Room Button ===== */}
                                    <button
                                        onClick={() => setShowPopup(true)}
                                        className="absolute bottom-5 bg-dark text-[#ffffff] text-sm px-3 py-1 rounded-2xl shadow flex justify-self-center gap-1"
                                    >
                                        👁️ View in Room
                                    </button>

                                    {/* ===== Share Button ===== */}
                                    <button
                                        onClick={handleShare}
                                        className="absolute top-3 right-3 text-[#48372D] text-4xl py-1"
                                    >
                                        <BsTelegram />
                                    </button>

                                    <button
                                        onClick={handleShare}
                                        className="absolute top-3 left-3 bg-[#48372D] text-white text-md px-2 rounded-full"
                                    >
                                        .Sponsored
                                    </button>


                                    {/* ===== Right Side Vertical Arrow Buttons ===== */}
                                    <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex flex-col gap-2">
                                        <button
                                            onClick={() => changeImage('prev')}
                                            className="text-[#48372D] text-4xl"
                                        >
                                            <FaChevronCircleLeft />
                                        </button>
                                        <button
                                            onClick={() => changeImage('next')}
                                            className="text-[#48372D] text-4xl"
                                        >
                                            <FaChevronCircleRight />
                                        </button>
                                    </div>
                                </div>

                                {/* ===== Thumbnails ===== */}
                                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[550px] scrollbar-hide">
                                    {images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`thumb-${index}`}
                                            onClick={() => setSelectedImage(img)}
                                            className={`w-24 h-24 object-contain rounded-lg product-img product-card cursor-pointer border-2 transition-all duration-200 ${selectedImage === img ? "border-dark" : "border-transparent"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* ======= POPUP MODAL ======= */}
                            {showPopup && (
                                <div className="fixed inset-0 bg-opacity-60 backdrop-blur-md flex items-center justify-center z-[999]" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                                    <div className="relative bg-white rounded-xl shadow-lg max-w-5xl w-full p-4">
                                        {/* Close Button */}
                                        <button
                                            onClick={() => setShowPopup(false)}
                                            className="absolute top-3 right-3 text-gray-700 text-xl font-bold"
                                        >
                                            ✕
                                        </button>

                                        {/* Room Background + Artwork */}
                                        <div className="relative w-full h-[550px] overflow-hidden rounded-lg">
                                            <img
                                                src={selectedRoom}
                                                alt="room"
                                                className="w-full h-full object-contain"
                                            />

                                            {/* Overlayed Artwork */}
                                            <div className="absolute bottom-[200px] inset-0 flex justify-center items-center">
                                                <div className="relative">
                                                    <img
                                                        src={selectedImage}
                                                        alt="art"
                                                        className="object-contain rounded-lg mb-3"
                                                        style={{
                                                            width: `${artworkSize.width * 3}px`, // scale for visibility
                                                            height: `${artworkSize.height * 3}px`,
                                                        }}
                                                    />
                                                    {/* Dimensions Label */}
                                                    <div className="absolute -bottom-6 w-full text-center text-sm font-medium bg-[#ffffff] py-1 rounded-md">
                                                        {artworkSize.width} × {artworkSize.height} cm
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Room Selector */}
                                        <div className="flex justify-center gap-3 mt-4">
                                            {roomBackgrounds.map((room, i) => (
                                                <img
                                                    key={i}
                                                    src={room}
                                                    alt={`room-${i}`}
                                                    onClick={() => setSelectedRoom(room)}
                                                    className={`w-24 h-20 object-cover rounded-lg cursor-pointer border-2 ${selectedRoom === room ? "border-dark" : "border-transparent"
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
                                    Dreamcatcher – Lotus with moon Stained glass and glass leaves
                                </h1>
                                <div className="flex flex-wrap gap-2 text-xs mt-2">
                                    <span className="bg-gray-200 px-2 py-1 rounded-md">#Abstract</span>
                                    <span className="bg-gray-200 px-2 py-1 rounded-md">#Contemporary</span>
                                    <span className="bg-gray-200 px-2 py-1 rounded-md">#Oil Painting</span>
                                    <span className="bg-gray-200 px-2 py-1 rounded-md">#Modern Art</span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs mt-2">
                                    <span className="bg-gray-200 px-2 py-1 rounded-md">Original Artwork</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-dark font-bold text-lg flex mr-3 mt-2 items-center">MystiqSoul <MdVerified className="ml-1 text-blue-600 w-4 h-4" /></p>
                                        <div className="flex items-center text-yellow-500 mt-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill="#facc15" stroke="#facc15" />
                                            ))}
                                            <span className="text-dark ml-1 text-sm">(2,592)</span>
                                            <span className="text-dark text-sm ml-2"><strong>600+</strong> bought this month</span>
                                        </div>
                                    </div>

                                </div>

                                {/* Price Section */}
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="bg-[#DC3545] px-2 py-1 rounded-md text-white font-bold text-md">-67%</span>
                                    <p className="text-3xl font-bold">₹8,035</p>
                                    <p className="text-dark line-through text-lg">₹19,820</p>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="text-gray-500 text-xs">M.R.P.:<span className="line-through"> ₹12,299</span></div>
                                    <div className="text-gray-500 text-xs"> Inclusive of all taxes</div>
                                </div>
                                <div className="flex gap-2 pt-2 justify-between">
                                    <div className="p-2">
                                        <img
                                            src="/herosectionimg/limited edition.png"
                                            alt="limited edition"
                                            className="w-full h-10 object-contain" />
                                        <p className="text-dark text-center text-xs mt-2 rounded">
                                            Limited Edition
                                        </p>
                                    </div>
                                    {/* <div className="p-2">
                            <img
                                src="/herosectionimg/original.png"
                                alt="original"
                                className="w-full h-10 object-contain" />
                            <p className="text-dark text-center text-xs mt-2 rounded">
                                Original
                            </p>
                        </div>
                        <div className="p-2">
                            <img
                                src="/herosectionimg/premium.png"
                                alt="premium"
                                className="w-full h-10 object-contain" />
                            <p className="text-dark text-center text-xs mt-2 rounded">
                                Premium
                            </p>
                        </div>
                        <div className="p-2">
                            <img
                                src="/herosectionimg/open edition.png"
                                alt="open edition"
                                className="w-full h-10 object-contain" />
                            <p className="text-dark text-center text-xs mt-2 rounded">
                                Open Edition
                            </p>
                        </div> */}
                                    <div className="p-2">
                                        <img
                                            src="/herosectionimg/free delivery.png"
                                            alt="free delivery"
                                            className="w-full h-10 object-contain" />
                                        <p className="text-dark text-center text-xs mt-2 rounded">
                                            Free Delivery
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <img
                                            src="/herosectionimg/framed.png"
                                            alt="framed"
                                            className="w-full h-10 object-contain" />
                                        <p className="text-dark text-center text-xs mt-2 rounded">
                                            Framed
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <img
                                            src="/herosectionimg/handmade.png"
                                            alt="handemade"
                                            className="w-full h-10 object-contain" />
                                        <p className="text-dark text-center text-xs mt-2 rounded">
                                            Handmade
                                        </p>
                                    </div>
                                    {/* <div className="p-2">
                            <img
                                src="/herosectionimg/glass material.png"
                                alt="glass material"
                                className="w-full h-10 object-contain" />
                            <p className="text-dark text-center text-xs mt-2 rounded">
                                Glass Material
                            </p>
                        </div>
                        <div className="p-2">
                            <img
                                src="/herosectionimg/gifting.png"
                                alt="gifting options"
                                className="w-full h-10 object-contain" />
                            <p className="text-dark text-center text-xs mt-2 rounded">
                                Gifting Options
                            </p>
                        </div>
                        <div className="p-2">
                            <img
                                src="/herosectionimg/certified.png"
                                alt="certified"
                                className="w-full h-10 object-contain" />
                            <p className="text-dark text-center text-xs mt-2 rounded">
                                Certified
                            </p>
                        </div> */}
                                </div>

                                {/* In Stocks / Details */}
                                <div className="w-full max-w-sm d-block d-md-none">
                                    {/* Address */}
                                    <div className="flex items-start gap-2 mt-2 text-sm text-dark">
                                        <MapPin size={18} className="text-dark mt-1" />
                                        <p>23 Aurum Lane, Sector 17, Vasant Vibe, New Delhi</p>
                                    </div>

                                    {/* Stock and Seller Info */}
                                    <div className="mt-3">
                                        <p className="text-green-600 font-semibold">In Stock</p>
                                        <table className="mt-2 w-full text-sm">
                                            <tbody>
                                                <tr className="border-b border-gray-100">
                                                    <td className="text-xs font-semibold py-1">Delivered by</td>
                                                    <td className="text-left text-xs py-1">Artsays</td>
                                                </tr>

                                                <tr className="border-b border-gray-100">
                                                    <td className="text-xs font-semibold py-1">Sold by</td>
                                                    <td className="text-left text-xs text-orange-600 font-medium py-1 flex items-center gap-1">
                                                        MystiqSoul <MdVerified className="text-blue-600 w-4 h-4" />
                                                    </td>
                                                </tr>

                                                <tr className="border-b border-gray-100">
                                                    <td className="text-xs font-semibold py-1">Artist</td>
                                                    <td className="text-left text-xs text-orange-600 font-medium py-1">Neha Joshi</td>
                                                </tr>

                                                <tr>
                                                    <td className="text-xs font-semibold py-1">Payment</td>
                                                    <td className="text-left text-xs py-1">Secure Transaction</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                </div>

                                {/* Offers Section */}
                                <div className="w-full mx-auto">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <HiMiniPercentBadge className="text-red-500 text-xl" />
                                            <h2 className="text-lg font-semibold">Offers</h2>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={prevSlide}
                                                className={`p-2 rounded-full focus:bg-none transition ${index === 0 ? "opacity-40 cursor-not-allowed" : ""
                                                    }`}
                                            >
                                                <ChevronLeft />
                                            </button>
                                            <button
                                                onClick={nextSlide}
                                                className={`p-2 rounded-full focus:bg-none transition ${index >= offersData.length - 3 ? "opacity-40 cursor-not-allowed" : ""
                                                    }`}
                                            >
                                                <ChevronRight />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Slider Container */}
                                    <div className="overflow-hidden">
                                        <div
                                            className="flex transition-transform duration-500 ease-out"
                                            style={{ transform: `translateX(-${index * 33.3333}%)` }}
                                        >
                                            {offersData.map((offer, i) => (
                                                <div
                                                    key={i}
                                                    className="min-w-[33.3333%] p-1"
                                                >
                                                    <div className="border rounded-xl px-1 md:!px-3 py-2 h-full shadow-sm hover:shadow-md transition">
                                                        <h3 className="font-bold text-md md:text-lg mb-2">{offer.title}</h3>
                                                        <p className="text-xs text-gray-600 mb-2">{offer.description}</p>
                                                        <p className="text-sm font-medium text-gray-800">{offer.offers}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Protection/ Buttons */}
                                <div className="w-full max-w-sm d-block d-md-none">
                                    {/* Protection Plans */}
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
                                                    Gift options for <span className="font-semibold">₹2,749.00</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="mt-3 flex items-center justify-around">
                                        <span className="font-semibold text-sm">Quantity :</span>
                                        <select
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="border border-dark rounded-md px-3 py-1 text-sm focus:outline-none"
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Buttons */}
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

                        <div className="mt-12 border-b">
                            {/* ===== Tabs ===== */}
                            <div
                                className="flex gap-8 text-[#48372D] font-medium text-lg border-b border-gray-200 
                                            overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth select-none"
                                onMouseDown={(e) => {
                                    const el = e.currentTarget;
                                    el.isDown = true;
                                    el.startX = e.pageX - el.offsetLeft;
                                    el.scrollLeftStart = el.scrollLeft;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.isDown = false;
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.isDown = false;
                                }}
                                onMouseMove={(e) => {
                                    const el = e.currentTarget;
                                    if (!el.isDown) return;
                                    e.preventDefault();
                                    const x = e.pageX - el.offsetLeft;
                                    const walk = (x - el.startX) * 1.5; // scroll speed
                                    el.scrollLeft = el.scrollLeftStart - walk;
                                }}
                            >
                                {["description", "details", "artist", "reviews"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-2 flex-shrink-0 transition-all duration-200 whitespace-nowrap ${activeTab === tab
                                            ? "border-b-4 border-[#48372D] font-semibold text-[#48372D] focus:outline-none"
                                            : "font-semibold text-[#48372D] focus:outline-none"
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>


                            {/* ===== Tab Content ===== */}
                            <div className="py-6 text-gray-700 leading-relaxed text-sm">
                                {activeTab === "description" && (
                                    <p>
                                        Inspired by the harmony of dreams and divine awakening, Dreamcatcher
                                        Lotus blends the protective symbolism of a dreamcatcher with the
                                        spiritual purity of the lotus flower. Handmade with intricate care, this
                                        piece channels positive energy, making it a beautiful and meaningful
                                        addition to any space. Ideal for gifting or personal zen corners.
                                    </p>
                                )}

                                {activeTab === "details" && (
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-semibold">Artwork Specifications</h2>
                                        <p><span className="font-semibold">Material:</span> Cotton Thread & Beads</p>
                                        <p><span className="font-semibold">Dimensions:</span> 40 x 20 cm</p>
                                        <p><span className="font-semibold">Weight:</span> 350g</p>
                                        <p><span className="font-semibold">Care:</span> Wipe gently with a soft dry cloth</p>
                                    </div>
                                )}

                                {activeTab === "artist" && (
                                    <div>
                                        <p className="font-semibold text-lg">Artist: Neha Joshi</p>
                                        <p className="mt-2">
                                            Neha Joshi is a contemporary Indian artist specializing in spiritual
                                            and symbolic artworks. Her creations explore the connection between
                                            mindfulness and modern living, using handcrafted natural materials.
                                        </p>
                                    </div>
                                )}

                                {activeTab === "reviews" && (
                                    <div className="space-y-4">
                                        <div className="border p-3 rounded-lg shadow-sm">
                                            <p className="font-semibold">Aarav Patel ⭐⭐⭐⭐⭐</p>
                                            <p className="text-sm mt-1">
                                                Beautifully crafted! The attention to detail is stunning and it
                                                brings a calming energy to my home.
                                            </p>
                                        </div>
                                        <div className="border p-3 rounded-lg shadow-sm">
                                            <p className="font-semibold">Priya Mehta ⭐⭐⭐⭐☆</p>
                                            <p className="text-sm mt-1">
                                                Loved it! Just wished it came in a slightly bigger size.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                    {/* ===== Right: Product Price ===== */}
                    <div className="col-span-2 d-none d-md-block">
                        <div className="sticky top-10">
                            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-dark px-3 py-3">
                                {/* Price and Wishlist */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-3xl font-bold">₹ 8,035</p>
                                    </div>
                                    <button>
                                        <Heart className="text-dark text-lg" />
                                    </button>
                                </div>
                                <p className="text-sm mt-1">
                                    FREE delivery <span className="font-semibold">Sunday, 10 August</span>.{" "}
                                    <span className="text-orange-600 cursor-pointer">Details</span>
                                </p>

                                {/* Address */}
                                <div className="max-w-md">
                                    {!address && (
                                        <form onSubmit={handleSubmit} className="relative w-full">
                                            {/* Left icon */}
                                            <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

                                            {/* Input field */}
                                            <input
                                                type="text"
                                                placeholder="Enter Pin Code"
                                                value={pinCode}
                                                onChange={(e) => setPinCode(e.target.value)}
                                                className="w-full !border-b-2 py-2 pl-4 pr-10 text-gray-400 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />

                                            {/* Submit arrow button (inside input) */}
                                            <button
                                                type="submit"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400"
                                            >
                                                <ArrowRight size={20} />
                                            </button>
                                        </form>
                                    )}

                                    {/* Address display */}
                                    {address && (
                                        <div className="flex items-start gap-2 mt-2 text-sm text-dark">
                                            <MapPin className="text-dark text-xl" />
                                            <p>{address}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Stock and Seller Info */}
                                <div className="mt-2">
                                    <p className="text-green-600 font-semibold">In Stock</p>
                                    <table className="mt-2 w-full text-sm">
                                        <tbody>
                                            <tr className="border-b border-gray-100">
                                                <td className="text-xs font-semibold py-1">Delivered by</td>
                                                <td className="text-left text-xs py-1">Artsays</td>
                                            </tr>

                                            <tr className="border-b border-gray-100">
                                                <td className="text-xs font-semibold py-1">Sold by</td>
                                                <td className="text-left text-xs text-orange-600 font-medium py-1 flex items-center gap-1">
                                                    MystiqSoul <MdVerified className="text-blue-600 w-4 h-4" />
                                                </td>
                                            </tr>

                                            <tr className="border-b border-gray-100">
                                                <td className="text-xs font-semibold py-1">Artist</td>
                                                <td className="text-left text-xs text-orange-600 font-medium py-1">Neha Joshi</td>
                                            </tr>

                                            <tr>
                                                <td className="text-xs font-semibold py-1">Payment</td>
                                                <td className="text-left text-xs py-1">Secure Transaction</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>

                                {/* Protection Plans */}
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
                                                Gift options for <span className="font-semibold">₹2,749.00</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="mt-3 flex items-center justify-around">
                                    <span className="font-semibold text-sm">Quantity :</span>
                                    <select
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="border border-dark rounded-md px-3 py-1 text-sm focus:outline-none"
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Buttons */}
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

    return <ProductImages />;
};


export default ProductDetails;
