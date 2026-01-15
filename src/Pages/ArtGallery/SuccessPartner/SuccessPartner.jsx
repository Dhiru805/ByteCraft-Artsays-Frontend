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




//cards have name and other data +profile image

// import { useState, useEffect, useRef } from "react";
// import getAPI from "../../../api/getAPI";
// import { toast } from "react-toastify";
// import "../../store/products/product.css";

// const SuccessPartner = () => {
//   const [slides, setSlides] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);
//   const sliderRef = useRef(null);

//   const API_IMG_BASE = process.env.REACT_APP_API_URL_FOR_IMAGE;

//   useEffect(() => {
//     const fetchPartners = async () => {
//       try {
//         const response = await getAPI("/api/CMS-artsays-gallery/profile-pic");

//         if (response?.data && !response.data.hasError && Array.isArray(response.data.data)) {
//           setSlides(response.data.data);
//         } else {
//           toast.error("No success partners found.");
//         }
//       } catch (error) {
//         console.error("Error fetching success partners:", error);
//         toast.error("Failed to load success partners.");
//       }
//     };

//     fetchPartners();
//   }, []);

//   useEffect(() => {
//     if (!slides.length) return;
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % slides.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   useEffect(() => {
//     const slider = sliderRef.current;
//     if (slider && slides.length > 0) {
//       const slideWidth = window.innerWidth < 768 ? slider.offsetWidth : 220;
//       slider.scrollTo({
//         left: current * slideWidth,
//         behavior: "smooth",
//       });
//     }
//   }, [current, slides]);

//   const handleMouseDown = (e) => {
//     setIsDragging(true);
//     setStartX(e.pageX - sliderRef.current.offsetLeft);
//     setScrollLeft(sliderRef.current.scrollLeft);
//   };
//   const handleMouseLeave = () => setIsDragging(false);
//   const handleMouseUp = () => setIsDragging(false);
//   const handleMouseMove = (e) => {
//     if (!isDragging) return;
//     e.preventDefault();
//     const x = e.pageX - sliderRef.current.offsetLeft;
//     const walk = (x - startX) * 1.5;
//     sliderRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const handleTouchStart = (e) => {
//     setIsDragging(true);
//     setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
//     setScrollLeft(sliderRef.current.scrollLeft);
//   };
//   const handleTouchMove = (e) => {
//     if (!isDragging) return;
//     const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
//     const walk = (x - startX) * 1.5;
//     sliderRef.current.scrollLeft = scrollLeft - walk;
//   };
//   const handleTouchEnd = () => setIsDragging(false);

//   if (!slides.length) {
//     return (
//       <div className="max-w-[1440px] mx-auto py-4 text-center">
//         <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34]">
//           Success Stories
//         </h1>
//         <p className="mt-3 text-gray-500">No success partners found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-[1440px] mx-auto py-4">
//    <div className="relative w-full overflow-hidden">
//         <div
//           ref={sliderRef}
//           className="flex gap-6 px-3 sm:px-6 my-3 overflow-x-scroll scroll-smooth scrollbar-hide select-none cursor-grab active:cursor-grabbing"
//           onMouseDown={handleMouseDown}
//           onMouseLeave={handleMouseLeave}
//           onMouseUp={handleMouseUp}
//           onMouseMove={handleMouseMove}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//         >
//           {slides.map((partner, index) => (
//             <div
//               key={partner._id || index}
//               className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[220px] border border-gray-700 rounded-2xl p-3 bg-white transition-transform duration-300 hover:scale-105"
//             >
//               <aside className="w-full h-[190px] rounded-xl flex justify-center items-center bg-gray-50">
//                 <img
//                   src={
//                     partner.profilePhoto
//                       ? `${API_IMG_BASE}${partner.profilePhoto}`
//                       : "/default-profile.png"
//                   }
//                   alt={partner.userName || "Partner"}
//                   className="w-[100px] h-[100px] rounded-full object-cover border-2 border-gray-300"
//                 />
//               </aside>
//               <h3 className="text-center text-sm font-semibold mt-2">
//                 {partner.userName}
//               </h3>
//               <p className="text-center text-xs text-gray-500">{partner.type}</p>
//               {partner.curator && (
//                 <p className="text-center text-[10px] text-gray-400">
//                   Curator: {partner.curator}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuccessPartner;






























//cards have only image


import { useState, useEffect, useRef } from "react";
import getAPI from "../../../api/getAPI";
import { toast } from "react-toastify";
import "../../store/products/product.css";

const SuccessPartner = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef(null);

  const API_IMG_BASE = process.env.REACT_APP_API_URL_FOR_IMAGE;

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await getAPI("/api/CMS-artsays-gallery/profile-pic");
        if (response?.data && !response.data.hasError && Array.isArray(response.data.data)) {
          setSlides(response.data.data);
        } else {
          toast.error("No success partners found.");
        }
      } catch (error) {
        console.error("Error fetching success partners:", error);
        toast.error("Failed to load success partners.");
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider && slides.length > 0) {
      const slideWidth = window.innerWidth < 768 ? slider.offsetWidth : 220;
      slider.scrollTo({
        left: current * slideWidth,
        behavior: "smooth",
      });
    }
  }, [current, slides]);

  // Mouse drag
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

  // Touch drag
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

  if (!slides.length) {
    return (
      <div className="max-w-[1440px] mx-auto py-4 text-center">
        <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34]">
          Success Stories
        </h1>
        <p className="mt-3 text-gray-500">No success partners found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto py-4">
     

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
          {slides.map((partner, index) => (
            <div
              key={partner._id || index}
              className="flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-[220px] border border-gray-700 rounded-2xl p-3 bg-white transition-transform duration-300"
            >
              <aside className="w-full h-[190px] rounded-xl flex justify-center items-center">
                <img
                  src={
                    partner.profilePhoto
                      ? `${API_IMG_BASE}${partner.profilePhoto}`
                      : "/default-profile.png"
                  }
                  alt={partner.userName || "Partner"}
                  className="max-w-full max-h-full object-contain rounded-xl"
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
