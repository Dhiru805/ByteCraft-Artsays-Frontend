// import React, { useState } from "react";

// const JoinArtsays = () => {
//   const [showFilters, setShowFilters] = useState(false);

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">
//       {/* Top Section: Breadcrumb + Search */}
//       <div className="w-full py-3 px-3">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           {/* Breadcrumb */}
//           <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//             <a href="#" className="hover:text-red-500">
//               Home
//             </a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">
//               Store
//             </a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">
//               Paintings
//             </a>
//             <span>/</span>
//             <span className="font-medium text-gray-900">Abstract</span>
//           </nav>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//         {/* title */}
//         <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//           Join ArtSays
//         </h1>
//         <button className="hidden md:block w-[200px] place-self-end flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
//           Explore More
//         </button>
//       </div>

//       <hr className="my-3 border-dark" />

//       {/* Subtitle */}
//       <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//         At Artsays, we’re building more than just a platform — we’re shaping the
//         future of how art is shared, discovered, and celebrated. We believe in
//         creativity, collaboration, and growth. If you’re passionate about
//         design, technology, and empowering artists worldwide, this is your
//         place.
//       </p>

//       <div className="my-5">

//         <main className="md:col-span-3 px-3">
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
//             {/* <!-- Product Card --> */}

//             <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//               {/* Premium Label */}
//               <div className="relative">
//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/art-focused.png"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                 />
//               </div>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                 100% Art-Focused
//               </h2>
//             </div>

//             <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//               {/* Premium Label */}
//               <div className="relative">
//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/art-focused.png"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                 />
//               </div>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                 100% Art-Focused
//               </h2>
//             </div>

//             <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//               {/* Premium Label */}
//               <div className="relative">
//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/art-focused.png"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                 />
//               </div>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                 100% Art-Focused
//               </h2>
//             </div>

//             <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//               {/* Premium Label */}
//               <div className="relative">
//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/art-focused.png"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                 />
//               </div>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                 100% Art-Focused
//               </h2>
//             </div>

//             <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//               {/* Premium Label */}
//               <div className="relative">
//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/art-focused.png"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                 />
//               </div>
//               <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                 100% Art-Focused
//               </h2>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
// export default JoinArtsays;



import React, { useEffect, useState } from "react";
import getAPI from "../../../api/getAPI"; 

const JoinArtsays = () => {
  const [page, setPage] = useState(null);
  const base = process.env.REACT_APP_API_URL_FOR_IMAGE;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI("/api/career-CMS/published");
        if (res.data?.data) {
          setPage(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch careers page", err);
      }
    };

    fetchData();
  }, []);

  if (!page) {
    return <div className="p-5 text-center">Loading...</div>;
  }

  const s1 = page.section1;

  return (
    <div className="max-w-[1440px] mx-auto mb-4">

      {/* Title */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
          {s1.heading}
        </h1>

        {s1.buttonName && (
          <a
            href={s1.buttonLink || "#"}
            className="hidden md:block w-[200px] place-self-end flex-1 bg-red-500 text-white text-center py-2 px-6 rounded-full font-semibold shadow buy-now "
          >
            {s1.buttonName}
          </a>
        )}
      </div>

      <hr className="my-3 border-dark" />

      {/* Subtitle / Description */}
      <p className="mt-3 text-xs md:text-lg md:text-dark font-medium text-black leading-relaxed px-3">
        {s1.description}
      </p>

      {/* Cards Section */}
      <div className="my-5">
        <main className="md:col-span-3 px-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">

            {s1.cards.map((card, i) => (
              <div
                key={i}
                className="w-full mx-auto border shadow-xl hover:!shadow-2xl"
              >
                <div className="relative">
                  <img
                    src={`${base}/${card.image}`}
                    alt={card.text}
                    className="w-full h-36 object-contain p-3 product-img"
                  />
                </div>

                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                  {card.text}
                </h2>
              </div>
            ))}

          </div>
        </main>
      </div>
    </div>
  );
};

export default JoinArtsays;
