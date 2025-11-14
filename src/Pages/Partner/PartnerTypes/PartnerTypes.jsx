// import "../../store/products/product.css";
// import React, { useState } from "react";

// const smallCards = [
//     { id: 0, title: "Sponsorships", img: "/herosectionimg/choose.svg" },
//     { id: 1, title: "Collaborations", img: "/herosectionimg/choose.svg" },
//     { id: 2, title: "Exhibitions", img: "/herosectionimg/choose.svg" },
//     { id: 3, title: "Partnerships", img: "/herosectionimg/choose.svg" },
// ];

// const slides = [
//     {
//         id: 0,
//         title: "Bring your space into the digital world.",
//         text:
//             "We partner with art galleries, museums, and curators to create immersive virtual or hybrid experiences. From curated art tours to online showcases, we make sure your collection reaches a global audience — beautifully and interactively.",
//         img: "/herosectionimg/choose.svg",
//     },
//     {
//         id: 1,
//         title: "Curate and Exhibit Virtually.",
//         text: "Curated tours, virtual opening nights and interactive showcases to expand your reach.",
//         img: "/herosectionimg/choose.svg",
//     },
//     {
//         id: 2,
//         title: "Showcase to Global Audience.",
//         text: "Make your exhibitions discoverable worldwide with guided virtual walkthroughs.",
//         img: "/herosectionimg/choose.svg",
//     },
//     {
//         id: 3,
//         title: "Empower Artists and Collectors.",
//         text: "Tools for artists to present, sell, and get discovered in an immersive format.",
//         img: "/herosectionimg/choose.svg",
//     },
// ];

// const PartnerTypes = () => {
//     const [activeIndex, setActiveIndex] = useState(0);

//     return (
//         <div className="max-w-[1440px] mx-auto py-4">
//             {/* Top Section: Breadcrumb + Search */}
//             <div className="w-full py-3 px-3">
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                     {/* Breadcrumb */}
//                     <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//                         <a href="#" className="hover:text-red-500">
//                             Home
//                         </a>
//                         <span>/</span>
//                         <a href="#" className="hover:text-red-500">
//                             Store
//                         </a>
//                         <span>/</span>
//                         <a href="#" className="hover:text-red-500">
//                             Paintings
//                         </a>
//                         <span>/</span>
//                         <span className="font-medium text-gray-900">Abstract</span>
//                     </nav>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//                 {/* title */}
//                 <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//                     Partner with Artsays
//                 </h1>
//                 <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
//                     Become A Brand Partner
//                 </button>
//             </div>

//             <hr className="my-3 border-dark" />

//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//                 Let’s create meaningful experiences together.
//             </p>

//             {/* Main Layout */}
//             <div className="px-3 sm:px-6 my-3">
//                 {/* Top small cards (triggers) */}
//                 <div className="grid grid-cols-2 md:flex justify-center gap-4">
//                     {smallCards.map((c) => {
//                         const active = c.id === activeIndex;
//                         return (
//                             <button
//                                 key={c.id}
//                                 onClick={() => setActiveIndex(c.id)}
//                                 className={`w-full md:w-1/4 border-2 p-3 rounded-2xl flex flex-col items-center gap-3
//                                             transition-shadow duration-200 focus:outline-none
//                                             ${active ? "border-[#48372D] shadow-2xl shadow-[0_10px_5px_-4px_rgba(0,0,0,0.3)]" : "border-gray-700"}`}
//                                 aria-pressed={active}
//                             >
//                                 <aside className="rounded-xl flex justify-center items-center bg-transparent w-20 h-20">
//                                     <img src={c.img} alt={c.title} className="max-w-full max-h-full" />
//                                 </aside>
//                                 <div>
//                                     <h1 className={`text-sm md:text-xl text-center font-bold ${active ? "text-[#48372D]" : "text-[#48372D]/80"}`}>
//                                         {c.title}
//                                     </h1>
//                                 </div>
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* Sliding area */}
//                 <div className="relative overflow-hidden">
//                     {/* The wide flex track */}
//                     <div
//                         className="flex transition-transform duration-700 ease-in-out"
//                         style={{ transform: `translateX(-${activeIndex * 100}%)` }}
//                     >
//                         {slides.map((s) => (
//                             <section
//                                 key={s.id}
//                                 className="w-full flex-shrink-0 md:flex md:items-center md:justify-center"
//                             >
//                                 <div className="md:flex justify-center my-3 border-2 border-[#48372D] rounded-[50px] md:rounded-tl-none md:rounded-bl-none w-full transition-all duration-700">

//                                     {/* Left Side - Content */}
//                                     <div className="w-full md:w-4/6 bg-[#48372D] rounded-[50px] md:rounded-tl-none md:rounded-bl-none p-6 md:p-10 mb-6 md:mb-0 content-center">
//                                         <main>
//                                             <h2 className="text-sm md:text-4xl font-bold text-white">{s.title}</h2>
//                                             <hr className="my-3 border-dark" />
//                                             <p className="mt-3 text-xs md:text-lg font-medium text-white leading-relaxed">
//                                                 {s.text}
//                                             </p>
//                                         </main>
//                                     </div>

//                                     {/* Right Side - Image */}
//                                     <div className="w-full md:w-2/6 p-4 mb-6 md:mb-0 flex items-center justify-center rounded-2xl">
//                                         <aside className="rounded-2xl flex justify-center items-center bg-transparent mb-3 w-48 h-48 md:w-64 md:h-64">
//                                             <img src={s.img} alt={s.title} className="max-w-full max-h-full object-contain" />
//                                         </aside>
//                                     </div>
//                                 </div>
//                             </section>
//                         ))}
//                     </div>
//                 </div>


//                 {/* Optional indicators */}
//                 {/* <div className="flex justify-center gap-3 mt-4">
//                     {slides.map((_, i) => (
//                         <button
//                             key={i}
//                             onClick={() => setActiveIndex(i)}
//                             aria-label={`Go to slide ${i + 1}`}
//                             className={`w-3 h-3 rounded-full transition-all ${i === activeIndex ? "scale-125 bg-[#48372D]" : "bg-gray-300"}`}
//                         />
//                     ))}
//                 </div> */}
//             </div>

//         </div >
//     );
// };
// export default PartnerTypes;





import "../../store/products/product.css";
import React, { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const PartnerTypes = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAPI("/api/partner");
                const partnerData = Array.isArray(res.data.data) ? res.data.data.find(p => p.status === "published") || res.data.data[0] : res.data.data;
                setData(partnerData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
    if (!data) return <div className="text-center py-4">No data available</div>;

    const smallCards = data.cards?.map((card, index) => ({
        id: index,
        title: card.title,
        img: card.image.startsWith('http') ? card.image : `${process.env.REACT_APP_API_URL}/${card.image}`,
    })) || [];

    const slides = data.cards?.map((card, index) => ({
        id: index,
        title: card.sectionHeading,
        text: card.sectionDescription,
        img: card.sectionImage.startsWith('http') ? card.sectionImage : `${process.env.REACT_APP_API_URL}/${card.sectionImage}`,
    })) || [];

    return (
        <div className="max-w-[1440px] mx-auto py-4">
            <div className="w-full py-3 px-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  
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
            
                <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
                    {data.mainHeading || "Partner with Artsays"}
                </h1>
                <button
                    className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now"
                    onClick={() => {
                        if (data.buttonLink) {
                            window.location.href = data.buttonLink;
                        }
                    }}
                >
                    {data.buttonName || "Become A Brand Partner"}
                </button>
            </div>

            <hr className="my-3 border-dark" />

            <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
                {data.mainDescription || "Let’s create meaningful experiences together."}
            </p>

            <div className="px-3 sm:px-6 my-3">
                <div className="grid grid-cols-2 md:flex justify-center gap-4">
                    {smallCards.map((c) => {
                        const active = c.id === activeIndex;
                        return (
                            <button
                                key={c.id}
                                onClick={() => setActiveIndex(c.id)}
                                className={`w-full md:w-1/4 border-2 p-3 rounded-2xl flex flex-col items-center gap-3
                                            transition-shadow duration-200 focus:outline-none
                                            ${active ? "border-[#48372D] shadow-2xl shadow-[0_10px_5px_-4px_rgba(0,0,0,0.3)]" : "border-gray-700"}`}
                                aria-pressed={active}
                            >
                                <aside className="rounded-xl flex justify-center items-center bg-transparent w-20 h-20">
                                    <img src={c.img} alt={c.title} className="max-w-full max-h-full" onError={(e) => e.target.src = 'https://via.placeholder.com/80'} />
                                </aside>
                                <div>
                                    <h1 className={`text-sm md:text-xl text-center font-bold ${active ? "text-[#48372D]" : "text-[#48372D]/80"}`}>
                                        {c.title}
                                    </h1>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                    >
                        {slides.map((s) => (
                            <section
                                key={s.id}
                                className="w-full flex-shrink-0 md:flex md:items-center md:justify-center"
                            >
                                <div className="md:flex justify-center my-3 border-2 border-[#48372D] rounded-[50px] md:rounded-tl-none md:rounded-bl-none w-full transition-all duration-700">

                                    <div className="w-full md:w-4/6 bg-[#48372D] rounded-[50px] md:rounded-tl-none md:rounded-bl-none p-6 md:p-10 mb-6 md:mb-0 content-center">
                                        <main>
                                            <h2 className="text-sm md:text-4xl font-bold text-white">{s.title}</h2>
                                            <hr className="my-3 border-dark" />
                                            <p className="mt-3 text-xs md:text-lg font-medium text-white leading-relaxed">
                                                {s.text}
                                            </p>
                                        </main>
                                    </div>

                                    <div className="w-full md:w-2/6 p-4 mb-6 md:mb-0 flex items-center justify-center rounded-2xl">
                                        <aside className="rounded-2xl flex justify-center items-center bg-transparent mb-3 w-48 h-48 md:w-64 md:h-64">
                                            <img src={s.img} alt={s.title} className="max-w-full max-h-full object-contain" onError={(e) => e.target.src = 'https://via.placeholder.com/300'} />
                                        </aside>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                </div>


            </div>

        </div >
    );
};
export default PartnerTypes;


