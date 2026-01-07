// const MissionVision = () => {
//   return (
//     <div className="bg-[#F8F8F8]">
//       <div className="max-w-[1440px] mx-auto py-3 my-5">
//         {/* Main Layout */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="order-2 md:!order-1 content-center justify-items-center mx-5">
//             <div className="bg-[#ffffff] p-4 border rounded-2xl shadow">
//               <h1 className="flex text-[#6F4D34] text-2xl font-bold text-center justify-center pb-3 items-center">
//                 <img src="/herosectionimg/micon.svg" className="pr-3" />Our Mission
//               </h1>
//               <p className="text-center">
//                 Empower artists to grow without limits, by giving them a
//                 supportive space to share and sell their work.
//               </p>
//             </div>
//           </div>
//           <div className="order-1 md:!order-2 content-center justify-items-center">
//             <img src="/herosectionimg/mission.svg" alt="" />
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="content-center justify-items-center">
//             <img src="/herosectionimg/vision.svg" alt="" />
//           </div>
//           <div className="content-center justify-items-center mx-5">
//             <div className="bg-[#ffffff] p-4 border rounded-2xl shadow">
//               <h1 className="flex text-[#6F4D34] text-2xl font-bold text-center justify-center pb-3 items-center">
//                 <img src="/herosectionimg/vicon.svg" className="pr-3" />Our Vision
//               </h1>
//               <p className="text-center">
//                 To build the most vibrant online art community — one that
//                 celebrates creativity over algorithms.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default MissionVision;


import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const MissionVision = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || `${window.location.origin}/uploads`;

  useEffect(() => {
    const fetchMissionVision = async () => {
      try {
        const pageRes = await getAPI("/api/about-us/published");
        const aboutUsPage = pageRes.data.data;

        if (!aboutUsPage?._id) throw new Error("No published About Us page found");

        const sectionRes = await getAPI(`/api/about-us-sections/mission-vision/${aboutUsPage._id}`);
        if (!sectionRes.data.success) throw new Error("Mission & Vision section not found");

        setData(sectionRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionVision();
  }, []);

  if (loading) return <div><AlternatingCardsSkeleton /></div>;
  if (!data) return <div>Mission & Vision section not available</div>;

  return (
    <div className="space-y-10">
      {data.cards?.map((card, index) => {
        const isImageLeft = index % 2 === 0; // Alternating with WhoWeAre (img left) and WhatWeDo (img right)

        const base = (imageBaseURL || "").replace(/\/+$/, "");
        const normalize = (p) => (p || "").replace(/\\/g, "/");
        const stripUploads = (p) => p.replace(/^uploads\//, "");
        const buildUrl = (p) => {
          const normalized = normalize(p);
          const withoutUploads = stripUploads(normalized);
          return base.includes("/uploads") ? `${base}/${withoutUploads}` : `${base}/${normalized}`;
        };

        const sideImageURL = card.sideImage ? buildUrl(card.sideImage) : null;
        const iconURL = card.icon ? buildUrl(card.icon) : null;

        return (
          <div
            key={index}
            className={`flex flex-col lg:flex-row gap-10 items-center bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-xl group ${isImageLeft ? "" : "lg:flex-row-reverse"
              }`}
          >
            <div className="w-full lg:w-2/5 aspect-[4/3] overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center">
              {sideImageURL ? (
                <img
                  src={sideImageURL}
                  alt={card.heading}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="text-gray-300">No Image</div>
              )}
            </div>

            <div className="w-full lg:w-3/5 space-y-4">
              <div className="flex items-center gap-4 mb-2">
                {iconURL && (
                  <div className="p-3 bg-[#6F4D34]/5 rounded-xl">
                    <img src={iconURL} alt="icon" className="w-8 h-8 object-contain" />
                  </div>
                )}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
                  {card.heading}
                </h2>
              </div>
              <div className="w-16 h-1 bg-[#6F4D34] rounded-full" />
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MissionVision;


// AlternatingCardsSkeleton.jsx
 function AlternatingCardsSkeleton() {
  return (
    <div className="bg-[#F8F8F8] py-5">
      <div className="max-w-[1440px] mx-auto space-y-10 animate-pulse">

        {[1, 2, 3, 4].map((i) => {
          const isImageLeft = i % 2 === 0;

          return (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
            >
              {/* Left Image (when index is even) */}
              {isImageLeft && (
                <div className="flex justify-center items-center">
                  <div className="w-full h-[250px] md:h-[320px] bg-gray-300 rounded-xl"></div>
                </div>
              )}

              {/* Card Content Skeleton */}
              <div className="mx-5 bg-white p-6 border rounded-2xl shadow flex flex-col justify-center">
                <div className="flex items-center justify-center pb-3 space-x-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <div className="h-6 w-40 bg-gray-300 rounded"></div>
                </div>

                <div className="space-y-2 mt-2 px-4">
                  <div className="h-4 w-full bg-gray-300 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                  <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
                </div>
              </div>

              {/* Right Image (when index is odd) */}
              {!isImageLeft && (
                <div className="flex justify-center items-center">
                  <div className="w-full h-[250px] md:h-[320px] bg-gray-300 rounded-xl"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
