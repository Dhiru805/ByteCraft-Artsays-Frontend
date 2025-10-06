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

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Mission & Vision section not available</div>;

  return (
    <div className="bg-[#F8F8F8] py-5">
      <div className="max-w-[1440px] mx-auto space-y-10">
        {data.cards?.map((card, index) => {
          const isImageLeft = index % 2 === 1;

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
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {isImageLeft && sideImageURL && (
                <div className="flex justify-center items-center">
                  <img src={sideImageURL} alt={card.heading} className="w-full h-auto object-contain rounded-xl" />
                </div>
              )}

              <div className="mx-5 bg-white p-6 border rounded-2xl shadow flex flex-col justify-center">
                <h2 className="flex items-center text-2xl font-bold text-[#6F4D34] pb-3 justify-center">
                  {iconURL && <img src={iconURL} alt="icon" className="w-6 h-6 mr-3" />}
                  {card.heading}
                </h2>
                <p className="text-center">{card.description}</p>
              </div>

              {!isImageLeft && sideImageURL && (
                <div className="flex justify-center items-center">
                  <img src={sideImageURL} alt={card.heading} className="w-full h-auto object-contain rounded-xl" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MissionVision;
