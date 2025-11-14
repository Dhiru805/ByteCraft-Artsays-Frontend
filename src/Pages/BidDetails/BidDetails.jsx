import { MdVerified } from "react-icons/md";
import { Star, Truck, Gift, Banknote, CreditCard } from "lucide-react";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HiMiniPercentBadge } from "react-icons/hi2";
import { Heart, MapPin, ArrowRight, ShoppingCart, Zap } from "lucide-react";
import { BsTelegram } from "react-icons/bs";
import { FaChevronCircleRight } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";


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

const BidDetails = () => {
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

        const [showBid, setShowBid] = useState(false);

        const activities = [
            {
                name: "Aarav",
                location: "Mumbai",
                action: "placed",
                amount: "₹8,200",
                time: "1m ago",
            },
            {
                name: "Neha",
                location: "Pune",
                action: "increased bid to",
                amount: "₹9,500",
                time: null,
            },
            {
                name: "Karan",
                location: "Bengaluru",
                action: "joined the auction",
                amount: null,
                time: "1m ago",
            },
            {
                name: "Priya",
                location: "Chandigarh",
                action: "placed",
                amount: "₹12,750",
                time: null,
            },
            {
                name: "Vikram",
                location: "Hyderabad",
                action: "increased bid to",
                amount: "₹13,000",
                time: null,
            },
            {
                name: "Rohan",
                location: "Lucknow",
                action: "placed",
                amount: "₹14,500",
                time: null,
            },
            {
                name: "Ananya",
                location: "Goa",
                action: "joined the auction",
                amount: null,
                time: "6m ago",
            },
            {
                name: "Sahil",
                location: "Bhopal",
                action: "placed",
                amount: "₹16,250",
                time: null,
            },
            {
                name: "Tanya",
                location: "Kolkata",
                action: "placed",
                amount: "₹17,000",
                time: null,
            },
            {
                name: "Ananya",
                location: "Goa",
                action: "joined the auction",
                amount: null,
                time: "30m ago",
            },
        ];

        const [hoveredIndex, setHoveredIndex] = useState(null);


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
                                            <span className="text-[#F97316] text-md">Your Next Masterpiece Awaits</span>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-2 border-gray-400" />

                                {/* Price Section */}
                                <div className="flex items-center gap-3 mt-2">
                                    <p className="text-md">Starting Price: <strong>₹5,000</strong></p>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="text-md"> Minimum Increment: ₹700</div>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="text-2xl font-bold text-[#48372D]"> Current Highest Bid: ₹7,500</div>
                                </div>
                                <div className="items-center gap-3 mt-2">
                                    <p className="text-lg font-semibold">Place Bid</p>
                                    <div className="flex mt-1 gap-2 overflow-x-auto scrollbar-hide sm:flex-wrap">
                                        <p className="bg-[#48372D] text-white text-sm text-center font-semibold px-3 py-1 rounded-full flex-shrink-0 flex items-center"><ImHammer2 className="mr-1" /> ₹300</p>
                                        <p className="bg-[#48372D] text-white text-sm text-center font-semibold px-3 py-1 rounded-full flex-shrink-0 flex items-center"><ImHammer2 className="mr-1" /> ₹500</p>
                                        <p className="bg-[#48372D] text-white text-sm text-center font-semibold px-3 py-1 rounded-full flex-shrink-0 flex items-center"><ImHammer2 className="mr-1" /> ₹1000</p>
                                        <p className="bg-[#48372D] text-white text-sm text-center font-semibold px-3 py-1 rounded-full flex-shrink-0 flex items-center"><ImHammer2 className="mr-1" /> ₹3000</p>
                                        <p className="bg-[#48372D] text-white text-sm text-center font-semibold px-3 py-1 rounded-full flex-shrink-0 flex items-center"><ImHammer2 className="mr-1" /> ₹5000</p>
                                    </div>

                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="text-md text-orange-700"> Ending Soon!</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-md"> Delivery in 5-7 days after payment.</div>
                                </div>

                                <div className="flex gap-2 mt-3 justify-between">
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

                                <div className="d-block d-md-none">
                                    {/* Price and Wishlist */}
                                    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-3 md:py-2 pl-9 md:pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-2">
                                        {/* Left icon circle */}
                                        <div className="absolute left-6 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                            <img
                                                src='/herosectionimg/price.png'
                                                alt="price"
                                                className="w-full h-9 object-contain product-img transition-all duration-300"
                                            />
                                        </div>

                                        {/* Text content */}
                                        <div className="ml-10">
                                            <p className="font-semibold text-md leading-tight">Starting Price:</p>
                                            <p className="text-xs text-gray-800 leading-snug">
                                                Bids begin at the listed base price.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-3 md:py-2 pl-9 md:pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
                                        {/* Left icon circle */}
                                        <div className="absolute left-6 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                            <img
                                                src='/herosectionimg/increment.png'
                                                alt="increment"
                                                className="w-full h-9 object-contain product-img transition-all duration-300"
                                            />
                                        </div>

                                        {/* Text content */}
                                        <div className="ml-10">
                                            <p className="font-semibold text-md leading-tight">Bid Increment:</p>
                                            <p className="text-xs text-gray-800 leading-snug">
                                                Raise the stakes by at least ₹500 each time.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-3 md:py-2 pl-9 md:pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
                                        {/* Left icon circle */}
                                        <div className="absolute left-6 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                            <img
                                                src='/herosectionimg/duration.png'
                                                alt="duration"
                                                className="w-full h-9 object-contain product-img transition-all duration-300"
                                            />
                                        </div>

                                        {/* Text content */}
                                        <div className="ml-10">
                                            <p className="font-semibold text-md leading-tight">Auction Duration:</p>
                                            <p className="text-xs text-gray-800 leading-snug">
                                                Ends when the countdown at 00:00.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-3 md:py-2 pl-9 md:pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
                                        {/* Left icon circle */}
                                        <div className="absolute left-6 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                            <img
                                                src='/herosectionimg/winner.png'
                                                alt="winner"
                                                className="w-full h-9 object-contain product-img transition-all duration-300"
                                            />
                                        </div>

                                        {/* Text content */}
                                        <div className="ml-10">
                                            <p className="font-semibold text-md leading-tight">Winner:</p>
                                            <p className="text-xs text-gray-800 leading-snug">
                                                The top bid at closing time wins the item.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-3 md:py-2 pl-9 md:pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
                                        {/* Left icon circle */}
                                        <div className="absolute left-6 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                            <img
                                                src='/herosectionimg/cancellations.png'
                                                alt="cancellations"
                                                className="w-full h-9 object-contain product-img transition-all duration-300"
                                            />
                                        </div>

                                        {/* Text content */}
                                        <div className="ml-10">
                                            <p className="font-semibold text-md leading-tight">No Cancellations:</p>
                                            <p className="text-xs text-gray-800 leading-snug">
                                                All Bids are Final for Auctions.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative bg-[#FCE9E9] text-black max-w-lg py-3 md:py-2 pl-9 md:pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
                                        {/* Left icon circle */}
                                        <div className="absolute left-6 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                            <img
                                                src='/herosectionimg/deadline.png'
                                                alt="deadline"
                                                className="w-full h-9 object-contain product-img transition-all duration-300"
                                            />
                                        </div>

                                        {/* Text content */}
                                        <div className="ml-10">
                                            <p className="font-semibold text-md leading-tight">Payment Deadline:</p>
                                            <p className="text-xs text-gray-800 leading-snug">
                                                Complete payment within 48 hrs of winning the auction.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="mt-2 flex flex-col gap-2">
                                        <button className="flex items-center justify-center gap-2 flex-1 border border-dark text-lg rounded-full text-dark py-2 font-semibold add-cart">
                                            00:14:36
                                        </button>
                                        <div className="flex justify-center items-center">
                                            <AnimatePresence mode="wait">
                                                {!showBid ? (
                                                    <motion.button
                                                        key="place-bid"
                                                        initial={{ scale: 0.9, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.8, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        onClick={() => setShowBid(true)}
                                                        className="flex items-center justify-center gap-2 flex-1 hover:border-dark rounded-full bg-red-500 text-white py-2 font-semibold buy-now"
                                                    >
                                                        Place Your Bid <ImHammer2 />
                                                    </motion.button>
                                                ) : (
                                                    <motion.div
                                                        key="bid-shape"
                                                        initial={{ width: "150px", opacity: 0 }}
                                                        animate={{ width: "100%", opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                                        className="flex items-center justify-between border border-dark rounded-full pl-4"
                                                    >
                                                        <span className="text-lg font-semibold text-black">₹ 4,00,00,000</span>
                                                        <div className="flex items-center justify-center w-16 h-10 rounded-full border border-dark">
                                                            <ImHammer2 className="text-black text-lg" />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="mt-12">
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
                                {["description", "details", "artist", "bid stream"].map((tab) => (
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

                                {activeTab === "bid stream" && (
                                    <div className="space-y-4">
                                        <div className="w-full rounded-lg">
                                            <div className="overflow-y-auto scrollbar-hide">
                                                {activities.map((activity, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center border-b border-gray-100 py-2 transition-all duration-200 cursor-pointer hover:bg-gray-50"
                                                        onMouseEnter={() => setHoveredIndex(index)}
                                                        onMouseLeave={() => setHoveredIndex(null)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <p className="text-sm text-gray-900">
                                                                <span className="font-semibold">{activity.name}</span> from{" "}
                                                                <span>{activity.location}</span>{" "}
                                                                <span className="text-gray-700">{activity.action}</span>
                                                            </p>
                                                        </div>

                                                        {activity.amount ? (
                                                            hoveredIndex === index ? (
                                                                <p className="text-xs text-gray-500">{activity.time}</p>
                                                            ) : (
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {activity.amount}
                                                                </p>
                                                            )
                                                        ) : (
                                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
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
                                <div className="flex justify-between items-center place-self-center">
                                    <div>
                                        <p className="text-3xl font-bold">Bidding Rules </p>
                                    </div>
                                </div>
                                <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-2">
                                    {/* Left icon circle */}
                                    <div className="absolute left-4 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                        <img
                                            src='/herosectionimg/price.png'
                                            alt="price"
                                            className="w-full h-9 object-contain product-img transition-all duration-300"
                                        />
                                    </div>

                                    {/* Text content */}
                                    <div className="ml-10">
                                        <p className="font-semibold text-md leading-tight">Starting Price:</p>
                                        <p className="text-xs text-gray-800 leading-snug">
                                            Bids begin at the listed base price.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
                                    {/* Left icon circle */}
                                    <div className="absolute left-4 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                        <img
                                            src='/herosectionimg/increment.png'
                                            alt="increment"
                                            className="w-full h-9 object-contain product-img transition-all duration-300"
                                        />
                                    </div>

                                    {/* Text content */}
                                    <div className="ml-10">
                                        <p className="font-semibold text-md leading-tight">Bid Increment:</p>
                                        <p className="text-xs text-gray-800 leading-snug">
                                            Raise the stakes by at least ₹500 each time.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
                                    {/* Left icon circle */}
                                    <div className="absolute left-4 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                        <img
                                            src='/herosectionimg/duration.png'
                                            alt="duration"
                                            className="w-full h-9 object-contain product-img transition-all duration-300"
                                        />
                                    </div>

                                    {/* Text content */}
                                    <div className="ml-10">
                                        <p className="font-semibold text-md leading-tight">Auction Duration:</p>
                                        <p className="text-xs text-gray-800 leading-snug">
                                            Ends when the countdown at 00:00.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
                                    {/* Left icon circle */}
                                    <div className="absolute left-4 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                        <img
                                            src='/herosectionimg/winner.png'
                                            alt="winner"
                                            className="w-full h-9 object-contain product-img transition-all duration-300"
                                        />
                                    </div>

                                    {/* Text content */}
                                    <div className="ml-10">
                                        <p className="font-semibold text-md leading-tight">Winner:</p>
                                        <p className="text-xs text-gray-800 leading-snug">
                                            The top bid at closing time wins the item.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
                                    {/* Left icon circle */}
                                    <div className="absolute left-4 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                        <img
                                            src='/herosectionimg/cancellations.png'
                                            alt="cancellations"
                                            className="w-full h-9 object-contain product-img transition-all duration-300"
                                        />
                                    </div>

                                    {/* Text content */}
                                    <div className="ml-10">
                                        <p className="font-semibold text-md leading-tight">No Cancellations:</p>
                                        <p className="text-xs text-gray-800 leading-snug">
                                            All Bids are Final for Auctions.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative bg-[#FCE9E9] text-black max-w-lg py-2 pl-4 pr-2 clip-path-custom flex items-center shadow-sm mt-1">
                                    {/* Left icon circle */}
                                    <div className="absolute left-4 bg-[#FCE9E9] w-12 h-12 flex items-center justify-center text-[#FF8A00]">
                                        <img
                                            src='/herosectionimg/deadline.png'
                                            alt="deadline"
                                            className="w-full h-9 object-contain product-img transition-all duration-300"
                                        />
                                    </div>

                                    {/* Text content */}
                                    <div className="ml-10">
                                        <p className="font-semibold text-md leading-tight">Payment Deadline:</p>
                                        <p className="text-xs text-gray-800 leading-snug">
                                            Complete payment within 48 hrs of winning the auction.
                                        </p>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="mt-2 flex flex-col gap-2">
                                    <button className="flex items-center justify-center gap-2 flex-1 border border-dark rounded-full text-dark py-2 font-semibold add-cart">
                                        00:14:36
                                    </button>
                                    <div className="flex justify-center items-center">
                                        <AnimatePresence mode="wait">
                                            {!showBid ? (
                                                <motion.button
                                                    key="place-bid"
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.8, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    onClick={() => setShowBid(true)}
                                                    className="flex items-center justify-center gap-2 flex-1 hover:border-dark rounded-full bg-red-500 text-white py-2 font-semibold buy-now"
                                                >
                                                    Place Your Bid <ImHammer2 />
                                                </motion.button>
                                            ) : (
                                                <motion.div
                                                    key="bid-shape"
                                                    initial={{ width: "150px", opacity: 0 }}
                                                    animate={{ width: "100%", opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                                    className="flex items-center justify-between border border-dark rounded-full pl-4"
                                                >
                                                    <span className="text-lg font-semibold text-black">₹ 4,00,00,000</span>
                                                    <div className="flex items-center justify-center w-16 h-10 rounded-full border border-dark">
                                                        <ImHammer2 className="text-black text-lg" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
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


export default BidDetails;
