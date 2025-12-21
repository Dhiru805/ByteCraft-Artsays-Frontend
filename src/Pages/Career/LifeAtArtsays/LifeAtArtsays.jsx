// import React, { useState } from "react";

// const LifeAtArtsays = () => {
//   const [showFilters, setShowFilters] = useState(false);

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//         {/* title */}
//         <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//           Life at ArtSays
//         </h1>
//       </div>

//       <hr className="my-3 border-dark" />

//       {/* Subtitle */}
//       <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//         At Artsays, we’re more than just a team — we’re a creative family. Every
//         day, we celebrate imagination, innovation, and inclusivity. Whether
//         you’re coding a new feature, designing a fresh interface, or
//         brainstorming the next big art challenge, you’ll find yourself
//         surrounded by people who truly believe in the power of art.
//       </p>

//       <div className="my-5">
//         <main className="md:col-span-3 px-3">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
//             <div className="order-2 sm:order-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//               {/* <!-- Product Card --> */}

//               <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//                 {/* Premium Label */}
//                 <div className="relative">
//                   {/* Product Image */}
//                   <img
//                     src="/herosectionimg/art-focused.png"
//                     alt="Beauty of Joseon Mandala Art"
//                     className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                   />
//                 </div>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   100% Art-Focused
//                 </h2>
//               </div>

//               <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//                 {/* Premium Label */}
//                 <div className="relative">
//                   {/* Product Image */}
//                   <img
//                     src="/herosectionimg/art-focused.png"
//                     alt="Beauty of Joseon Mandala Art"
//                     className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                   />
//                 </div>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   100% Art-Focused
//                 </h2>
//               </div>

//               <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//                 {/* Premium Label */}
//                 <div className="relative">
//                   {/* Product Image */}
//                   <img
//                     src="/herosectionimg/art-focused.png"
//                     alt="Beauty of Joseon Mandala Art"
//                     className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                   />
//                 </div>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   100% Art-Focused
//                 </h2>
//               </div>

//               <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//                 {/* Premium Label */}
//                 <div className="relative">
//                   {/* Product Image */}
//                   <img
//                     src="/herosectionimg/art-focused.png"
//                     alt="Beauty of Joseon Mandala Art"
//                     className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                   />
//                 </div>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   100% Art-Focused
//                 </h2>
//               </div>

//               <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//                 {/* Premium Label */}
//                 <div className="relative">
//                   {/* Product Image */}
//                   <img
//                     src="/herosectionimg/art-focused.png"
//                     alt="Beauty of Joseon Mandala Art"
//                     className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                   />
//                 </div>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   100% Art-Focused
//                 </h2>
//               </div>

//               <div className="w-full mx-auto border rounded-2xl shadow-xl hover:!shadow-2xl">
//                 {/* Premium Label */}
//                 <div className="relative">
//                   {/* Product Image */}
//                   <img
//                     src="/herosectionimg/art-focused.png"
//                     alt="Beauty of Joseon Mandala Art"
//                     className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                   />
//                 </div>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   100% Art-Focused
//                 </h2>
//               </div>
//             </div>
//             <div className="order-1 sm:!order-2 flex justify-center items-center">
//               <img src="/herosectionimg/lifeAt.svg" alt="" />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
// export default LifeAtArtsays;
import React, { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const LifeAtArtsays = () => {
  const [careersPage, setCareersPage] = useState(null);

  const fetchCareersCMS = async () => {
    try {
      const res = await getAPI("/api/career-CMS/published");
      if (res?.data?.data) {
        setCareersPage(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching careers CMS", error);
    }
  };

  useEffect(() => {
    fetchCareersCMS();
  }, []);

  const section3 = careersPage?.section3;
  const base = process.env.REACT_APP_API_URL_FOR_IMAGE;

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
        {/* Dynamic Section 3 Heading */}
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
          {section3?.heading || "Life at ArtSays"}
        </h1>
      </div>

      <hr className="my-3 border-dark" />

      {/* Dynamic Section 3 Description */}
      <p className="mt-3 text-xs md:text-lg md:text-dark font-medium text-black leading-relaxed px-3">
        {section3?.description ||
          "At Artsays, we’re more than just a team — we’re a creative family."}
      </p>

      <div className="my-5">
        <main className="md:col-span-3 px-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            {/* LEFT SIDE – Dynamic Cards */}
            <div className="order-2 sm:order-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section3?.cards?.length > 0 ? (
                section3.cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="w-full mx-auto border rounded-2xl shadow-xl hover:shadow-2xl
                              flex flex-col items-center justify-content-center p-4"
                  >
                    {/* Image */}
                    <img
                      src={card.image ? `${base}/${card.image}` : "/placeholder.png"}
                      alt=""
                      className="w-full h-24 md:h-32 object-contain"
                    />

                    {/* Text */}
                    <h2 className="text-base sm:text-lg text-dark font-semibold mt-3 text-center">
                      {card.text}
                    </h2>
                  </div>

                ))
              ) : (
                <>
                  <p className="text-gray-500">No cards available.</p>
                </>
              )}
            </div>

            {/* RIGHT SIDE – Dynamic Main Image */}
            <div className="order-1 sm:!order-2 flex justify-center items-center">
              <img
                src={
                  section3?.sectionImage
                    ? `${base}/${section3.sectionImage}`
                    : "/herosectionimg/lifeAt.svg"
                }
                alt="Life At Artsays"
                className="max-w-full object-contain"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LifeAtArtsays;
