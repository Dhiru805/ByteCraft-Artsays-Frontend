// import { useState, useEffect, useRef } from "react";
// import "../../store/products/product.css";

// const SuccessPartner = () => {
//     const slides = [
//         "/herosectionimg/how1.svg",
//         "/herosectionimg/artsays.png",
//         "/herosectionimg/how1.svg",
//         "/herosectionimg/how1.svg",
//         "/herosectionimg/how1.svg",
//         "/herosectionimg/how1.svg",
//         "/herosectionimg/how1.svg",
//     ];

//     const [current, setCurrent] = useState(0);
//     const [isDragging, setIsDragging] = useState(false);
//     const [startX, setStartX] = useState(0);
//     const [scrollLeft, setScrollLeft] = useState(0);
//     const sliderRef = useRef(null);

//     // Auto-slide every 3s
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrent((prev) => (prev + 1) % slides.length);
//         }, 3000);
//         return () => clearInterval(interval);
//     }, [slides.length]);

//     // Responsive auto-slide behavior (1 slide on mobile, multiple on desktop)
//     useEffect(() => {
//         const slider = sliderRef.current;
//         if (slider) {
//             const slideWidth =
//                 window.innerWidth < 768 ? slider.offsetWidth : 220; // full width on mobile, fixed width desktop
//             slider.scrollTo({
//                 left: current * slideWidth,
//                 behavior: "smooth",
//             });
//         }
//     }, [current]);

//     // Mouse dragging
//     const handleMouseDown = (e) => {
//         setIsDragging(true);
//         setStartX(e.pageX - sliderRef.current.offsetLeft);
//         setScrollLeft(sliderRef.current.scrollLeft);
//     };
//     const handleMouseLeave = () => setIsDragging(false);
//     const handleMouseUp = () => setIsDragging(false);
//     const handleMouseMove = (e) => {
//         if (!isDragging) return;
//         e.preventDefault();
//         const x = e.pageX - sliderRef.current.offsetLeft;
//         const walk = (x - startX) * 1.5;
//         sliderRef.current.scrollLeft = scrollLeft - walk;
//     };

//     // Touch dragging (mobile)
//     const handleTouchStart = (e) => {
//         setIsDragging(true);
//         setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
//         setScrollLeft(sliderRef.current.scrollLeft);
//     };
//     const handleTouchMove = (e) => {
//         if (!isDragging) return;
//         const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
//         const walk = (x - startX) * 1.5;
//         sliderRef.current.scrollLeft = scrollLeft - walk;
//     };
//     const handleTouchEnd = () => setIsDragging(false);

//     return (
//         <div className="max-w-[1440px] mx-auto py-4">
//             <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//                 Success Stories
//             </h1>
//             <hr className="my-3 border-dark" />
//             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//                 Safeguard your creativity, confidence, and investment — every brushstroke matters.
//             </p>

//             <div className="relative w-full overflow-hidden">
//                 <div
//                     ref={sliderRef}
//                     className="flex gap-6 px-3 sm:px-6 my-3 overflow-x-scroll scroll-smooth scrollbar-hide select-none cursor-grab active:cursor-grabbing"
//                     onMouseDown={handleMouseDown}
//                     onMouseLeave={handleMouseLeave}
//                     onMouseUp={handleMouseUp}
//                     onMouseMove={handleMouseMove}
//                     onTouchStart={handleTouchStart}
//                     onTouchMove={handleTouchMove}
//                     onTouchEnd={handleTouchEnd}
//                 >
//                     {slides.map((src, index) => (
//                         <div
//                             key={index}
//                             className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[220px] border border-gray-700 rounded-2xl p-3 bg-white transition-transform duration-300"
//                         >
//                             <aside className="w-full h-[190px] rounded-xl flex justify-center items-center">
//                                 <img
//                                     src={src}
//                                     alt={`Slide ${index + 1}`}
//                                     className="max-w-full max-h-full object-contain"
//                                 />
//                             </aside>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SuccessPartner;







import { useState, useEffect, useRef } from "react";
import "../../store/products/product.css";
import getAPI from "../../../api/getAPI";

const SuccessPartner = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [current, setCurrent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const sliderRef = useRef(null);

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

    const slides = data ? (data.section1Images || []).map(img => img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}/${img}`) : [];

    useEffect(() => {
        if (slides.length > 0) {
            const interval = setInterval(() => {
                setCurrent((prev) => (prev + 1) % slides.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [slides.length]);
    useEffect(() => {
        const slider = sliderRef.current;
        if (slider && slides.length > 0) {
            const slideWidth =
                window.innerWidth < 768 ? slider.offsetWidth : 220; 
            slider.scrollTo({
                left: current * slideWidth,
                behavior: "smooth",
            });
        }
    }, [current, slides.length]);

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
    if (!data) return <div className="text-center py-4">No data available</div>;

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };
    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };
    const handleTouchEnd = () => setIsDragging(false);

    return (
        <div className="max-w-[1440px] mx-auto py-4">
            <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
                {data.section1Heading || "Success Stories"}
            </h1>
            <hr className="my-3 border-dark" />
            <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
                {data.section1Description || "Safeguard your creativity, confidence, and investment — every brushstroke matters."}
            </p>

            <div className="relative w-full overflow-hidden">
                <div
                    ref={sliderRef}
                    className="flex gap-6 px-3 sm:px-6 my-3 overflow-x-scroll scroll-smooth scrollbar-hide select-none cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {slides.map((src, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[220px] border border-gray-700 rounded-2xl p-3 bg-white transition-transform duration-300"
                        >
                            <aside className="w-full h-[190px] rounded-xl flex justify-center items-center">
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/220x190'}
                                />
                            </aside>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuccessPartner;
