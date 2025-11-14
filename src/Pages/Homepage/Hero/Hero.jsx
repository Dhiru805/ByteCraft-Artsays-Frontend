// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const Hero = () => {
//   const words = ["Value Grows", "Stories Flow", "Dreams Glow"];
//   const images = [
//     "/herosectionimg/Hero1.svg",
//     "/herosectionimg/Hero img.svg",
//     "/herosectionimg/Hero2.svg",
//     "/herosectionimg/Hero img.svg",
//     "/herosectionimg/Hero3.svg",
//   ];

//   const speed = 100;
//   const eraseSpeed = 60;
//   const delayBetween = 1200;

//   const [text, setText] = useState("");
//   const [wordIndex, setWordIndex] = useState(0);
//   const [charIndex, setCharIndex] = useState(0);
//   const [typing, setTyping] = useState(true);
//   const [open, setOpen] = useState(false);

//   // 👉 Slideshow state
//   const [imgIndex, setImgIndex] = useState(0);

//   // Image Slideshow Effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setImgIndex((prev) => (prev + 1) % images.length);
//     }, 3000); // change every 3 sec
//     return () => clearInterval(interval);
//   }, []);

//   // Typing effect
//   useEffect(() => {
//     let timeout;
//     if (typing) {
//       if (charIndex < words[wordIndex].length) {
//         timeout = setTimeout(() => {
//           setText((prev) => prev + words[wordIndex][charIndex]);
//           setCharIndex(charIndex + 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setTyping(false), delayBetween);
//       }
//     } else {
//       if (charIndex > 0) {
//         timeout = setTimeout(() => {
//           setText(words[wordIndex].slice(0, charIndex - 1));
//           setCharIndex(charIndex - 1);
//         }, eraseSpeed);
//       } else {
//         setTyping(true);
//         setWordIndex((wordIndex + 1) % words.length);
//       }
//     }
//     return () => clearTimeout(timeout);
//   }, [charIndex, typing, wordIndex]);

//   return (
//     <div className="bg-[#F8F8F8]">
//       <div
//         className="max-w-[1440px] mx-auto py-3 bg-cover bg-center bg-no-repeat"
//         style={{ backgroundImage: "url('/herosectionimg/hero-bg.jpg')" }}
//       >
//         {/* Main Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-3 sm:px-6 my-3">
//           <div className="col-span-2 flex flex-col align-self-center">
//             {/* Heading */}
//             <div>
//               {/* Static Heading */}
//               <h1 className="text-4xl md:text-7xl lg:text-8xl text-center lg:!text-left font-bold text-[#2b0b0b] leading-tight">
//                 When Art Speaks,
//               </h1>

//               {/* Typing Animation */}
//               <h2 className="text-4xl md:text-9xl text-center lg:!text-left font-extrabold mt-2">
//                 <span
//                   id="typedText"
//                   className="bg-gradient-to-r from-[#48372D] to-[#FF725E] bg-clip-text text-transparent font-[Windhavi]"
//                 >
//                   {text}
//                 </span>
//                 <span
//                   className="inline-block w-[3px] h-[1em] bg-gradient-to-r from-[#48372D] to-[#FF725E] 
//                      align-bottom animate-blink ml-1"
//                 ></span>
//               </h2>
//             </div>

//             {/* Search Bar */}
//             <div className="relative w-full max-w-3xl mt-4">
//               {/* Search Box */}
//               <div className="flex items-center justify-center lg:justify-start w-full rounded-xl border border-gray-300 shadow-lg overflow-hidden">
//                 <input
//                   type="text"
//                   placeholder="Search your next Masterpiece NOW!"
//                   className="flex-1 px-4 py-3 text-md md:text-lg text-gray-600 focus:outline-none"
//                   onFocus={() => setOpen(true)}
//                   onBlur={() => setTimeout(() => setOpen(false), 200)} // closes after losing focus
//                 />
//                 <button className="px-6 py-3 bg-[#f04a2f] text-white font-medium hover:bg-[#d93e27] font-semibold text-md md:text-lg transition">
//                   Search
//                 </button>
//               </div>

//               {/* Dropdown */}
//               {open && (
//                 <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-2 z-50 p-4">
//                   {/* Art List */}
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
//                     {["1015", "1016", "1018", "1019"].map((id, i) => (
//                       <div
//                         key={i}
//                         className="flex flex-col items-center text-sm cursor-pointer hover:scale-105 transition"
//                       >
//                         <img
//                           src={`https://picsum.photos/id/${id}/150/100`}
//                           alt="Art"
//                           className="rounded-md shadow"
//                         />
//                         <span className="mt-2 font-medium text-gray-700">
//                           Modern Art
//                         </span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Search Tags */}
//                   <ul className="flex flex-wrap gap-3 mb-4">
//                     {["Graphic Design", "Illustrations", "Glass Artwork"].map(
//                       (tag, i) => (
//                         <li
//                           key={i}
//                           className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
//                         >
//                           <svg
//                             className="mr-2"
//                             width="18"
//                             height="18"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             aria-hidden
//                           >
//                             <path
//                               d="M3 13 L9 7 L13 11 L21 3"
//                               stroke="#2BB673"
//                               strokeWidth="2.2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                             <path
//                               d="M21 3 L21 9"
//                               stroke="#2BB673"
//                               strokeWidth="2.2"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                           {tag}
//                           <span className="ml-2 cursor-pointer text-gray-500 hover:text-red-500">
//                             ×
//                           </span>
//                         </li>
//                       )
//                     )}
//                   </ul>

//                   {/* Trend Section */}
//                   <div className="border-t pt-3">
//                     <div className="font-bold flex items-center text-gray-800 mb-2">
//                       <svg
//                         className="mr-2"
//                         width="18"
//                         height="18"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         aria-hidden
//                       >
//                         <path
//                           d="M3 13 L9 7 L13 11 L21 3"
//                           stroke="#2BB673"
//                           strokeWidth="2.2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M21 3 L21 9"
//                           stroke="#2BB673"
//                           strokeWidth="2.2"
//                           strokeLinecap="round"
//                         />
//                       </svg>
//                       TREND NOW
//                     </div>
//                     <div className="flex flex-wrap gap-4 text-sm text-[#f04a2f] font-medium">
//                       <a href="#">Fine Art Ceramics</a>
//                       <a href="#">Sculpture</a>
//                       <a href="#">Glass Art</a>
//                       <a href="#">4+ More trends</a>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Subtext */}
//             <p className="mt-4 max-w-2xl text-sm md:text-base text-dark text-center lg:!text-left">
//               Where artistry finds its audience. A refined marketplace
//               connecting visionary creators with discerning collectors through
//               seamless discovery and acquisition.
//             </p>

//             {/* Buttons */}
//             <div className="mt-4 flex gap-4 justify-center lg:justify-start">
//               <button className="bg-red-500 text-white py-2 md:!py-3 px-4 md:!px-8 rounded-full font-bold shadow buy-now">
//                 Explore now
//               </button>
//               <button className="items-center justify-center border border-dark rounded-full text-dark py-2 md:!py-3 px-4 md:!px-8 font-bold add-cart">
//                 Get Started Now
//               </button>
//             </div>
//           </div>
//           <div className="hidden lg:flex h-[600px] align-items-center content-center justify-center relative overflow-hidden">
//             <AnimatePresence mode="wait">
//               <motion.img
//                 key={imgIndex}
//                 src={images[imgIndex]}
//                 alt="Hero Slide"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 1.2, ease: "easeInOut" }}
//               />
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//       <div className="bg-[#ffffff] py-8 rounded-t-[2rem] lg:rounded-t-[6rem] shadow-[0_-10px_10px_rgba(0,0,0,0.15)]">
//         <div className="max-w-[1440px] mx-auto">
//           <div class="w-full">
//             <div class=" flex-col items-center gap-6 lg:flex-row justify-center lg:items-start hidden lg:flex">
//               {/* <!-- Card 1 --> */}
//               <div class="flex items-center gap-2">
//                 <div class="w-10 h-10 flex items-center justify-center rounded-full bg-[#4B3621] text-white">
//                   {/* <!-- Icon --> */}
//                   📜
//                 </div>
//                 <span class="text-lg font-medium text-gray-800">
//                   Authenticity & Trust
//                 </span>
//               </div>

//               {/* <!-- Card 2 --> */}
//               <div class="flex items-center gap-2">
//                 <div class="w-10 h-10 flex items-center justify-center rounded-full bg-[#4B3621] text-white">
//                   💰
//                 </div>
//                 <span class="text-lg font-medium text-gray-800">
//                   Investment & Value
//                 </span>
//               </div>

//               {/* <!-- Card 3 --> */}
//               <div class="flex items-center gap-2">
//                 <div class="w-10 h-10 flex items-center justify-center rounded-full bg-[#4B3621] text-white">
//                   🌍
//                 </div>
//                 <span class="text-lg font-medium text-gray-800">
//                   Cultural & Emotional Connect
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Hero;

















import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import getAPI from "../../../api/getAPI";

const Hero = () => {
  const [heroData, setHeroData] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [open, setOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const pageRes = await getAPI("/api/homepage/published");
        const homepage = pageRes.data.data;
        if (!homepage?._id) throw new Error("No published homepage found");

        const heroRes = await getAPI(`/api/homepage-sections/hero/${homepage._id}`);
        if (!heroRes.data.success || !heroRes.data.data)
          throw new Error("Hero section not found");

        setHeroData(heroRes.data.data);

        const tagsRes = await getAPI(`/api/homepage-sections/hero-browse-categories/getTags/${homepage._id}`);
        if (tagsRes.data.success) setTags(tagsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  useEffect(() => {
    if (!heroData?.recurrentTitles?.length) return;
    const titles = heroData.recurrentTitles;
    const currentTitleObj = titles[wordIndex] || {};
    if (!currentTitleObj.title) return;
    const delay = currentTitleObj.duration ? currentTitleObj.duration * 1000 : 1200;

    let timeout;
    if (typing) {
      if (charIndex < currentTitleObj.title.length) {
        timeout = setTimeout(() => {
          setText((prev) => prev + currentTitleObj.title[charIndex]);
          setCharIndex(charIndex + 1);
        }, 100);
      } else {
        timeout = setTimeout(() => setTyping(false), delay);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setText(currentTitleObj.title.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 60);
      } else {
        setTyping(true);
        setWordIndex((wordIndex + 1) % titles.length);
        setImgIndex((wordIndex + 1) % titles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIndex, typing, wordIndex, heroData]);

  useEffect(() => {
    if (!heroData?.recurrentTitles?.length) return;
    setImgIndex(wordIndex);
  }, [wordIndex, heroData]);

  if (loading)
    return <div className="h-[600px] flex items-center justify-center">Loading...</div>;
  if (!heroData)
    return <div className="h-[600px] flex items-center justify-center">No Hero section available</div>;

  const titles = heroData.recurrentTitles || [];
  const currentTitleObj = titles[wordIndex] || {};

  return (
    // <div className="relative bg-[#F8F8F8] overflow-hidden">
    <div
      className="relative overflow-hidden bg-cover "
      style={{ backgroundImage: "url('/herosectionimg/hero-bg.jpg')", backgroundPosition: "center top -130px" }}
    >
      <div className="relative max-w-[1440px] mx-auto py-3 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-3 sm:px-6 my-3">
          <div className="col-span-2 flex flex-col align-self-center">
            <h1 className="text-4xl md:text-7xl lg:text-8xl text-center lg:!text-left font-bold text-[#2b0b0b] leading-tight">
              {heroData.title}
            </h1>

            <h2 className="text-4xl md:text-9xl text-center lg:!text-left font-extrabold mt-2">
              <span className="bg-gradient-to-r from-[#48372D] to-[#FF725E] bg-clip-text text-transparent font-[Windhavi]">
                {text}
              </span>
              <span className="inline-block w-[3px] h-[1em] bg-gradient-to-r from-[#48372D] to-[#FF725E] align-bottom animate-blink ml-1"></span>
            </h2>

            <div className="relative w-full max-w-3xl mt-4">
              <div className="flex items-center justify-center lg:justify-start w-full rounded-xl border border-gray-300 shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search your next Masterpiece NOW!"
                  className="flex-1 px-4 py-3 text-md md:text-lg text-gray-600 focus:outline-none"
                  onFocus={() => setOpen(true)}
                  onBlur={() => setTimeout(() => setOpen(false), 200)}
                />
                <button className="px-6 py-3 bg-[#f04a2f] text-white font-medium transition font-semibold text-md md:text-lg hover:bg-[#d93e27]">
                  Search
                </button>
              </div>

              {open && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-2 z-50 p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                    {["1015", "1016", "1018", "1019"].map((id, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center text-sm cursor-pointer hover:scale-105 transition"
                      >
                        <img
                          src={`https://picsum.photos/id/${id}/150/100`}
                          alt="Art"
                          className="rounded-md shadow"
                        />
                        <span className="mt-2 font-medium text-gray-700">Modern Art</span>
                      </div>
                    ))}
                  </div>
                  <ul className="flex flex-wrap gap-3 mb-4">
                    {["Graphic Design", "Illustrations", "Glass Artwork"].map((tag, i) => (
                      <li
                        key={i}
                        className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
                      >
                        {tag}
                        <span className="ml-2 cursor-pointer text-gray-500 hover:text-red-500">×</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-3">
                    <div className="font-bold flex items-center text-gray-800 mb-2">TREND NOW</div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#f04a2f] font-medium">
                      <a href="#">Fine Art Ceramics</a>
                      <a href="#">Sculpture</a>
                      <a href="#">Glass Art</a>
                      <a href="#">4+ More trends</a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-4 max-w-2xl text-sm md:text-base text-dark text-center lg:!text-left">
              {heroData.description}
            </p>

            <div className="mt-4 flex gap-4 justify-center lg:justify-start">
              {heroData.buttons?.map((btn, i) => (
                <button
                  key={i}
                  className={`py-2 md:!py-3 px-4 md:!px-8 rounded-full font-bold transition-all duration-300 ${i % 2 === 0
                      ? "bg-red-500 text-white py-2 md:!py-3 px-4 md:!px-8 rounded-full font-bold shadow buy-now"
                      : "items-center justify-center border border-dark rounded-full text-dark py-2 md:!py-3 px-4 md:!px-8 font-bold add-cart"
                    // <button className="bg-red-500 text-white py-2 md:!py-3 px-4 md:!px-8 rounded-full font-bold shadow buy-now">
                    //  Explore now
                    // </button>
                    // <button className="items-center justify-center border border-dark rounded-full text-dark py-2 md:!py-3 px-4 md:!px-8 font-bold add-cart">
                    // Get Started Now
                    // </button>
                    }`}
                  onClick={() => (window.location.href = btn.link)}
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex h-[600px] items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              {currentTitleObj.image && (
                <motion.img
                  key={wordIndex}
                  src={`${process.env.REACT_APP_API_URL}/${currentTitleObj.image}`}
                  alt="Hero Slide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-[#ffffff] py-8 rounded-t-[2rem] lg:rounded-t-[6rem] shadow-[0_-10px_10px_rgba(0,0,0,0.15)]">
        <div className="max-w-[1440px] mx-auto flex flex-wrap justify-center gap-6">
          {tags.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#4B3621]">
                <img
                  src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${tag.icon}`}
                  alt={tag.title}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-lg font-medium text-gray-800">{tag.title}</span>
            </div>
          ))}


        </div>
      </div>
    </div>
  );
};

export default Hero;
