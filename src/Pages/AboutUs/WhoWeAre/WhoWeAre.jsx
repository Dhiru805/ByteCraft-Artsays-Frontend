// const WhoWeAre = () => {
//   return (
//     <div className="bg-[#F8F8F8]">
//       <div className="max-w-[1440px] mx-auto py-3">

//         {/* Main Layout */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-3 sm:px-6 my-5">
//           <div className="content-center justify-items-center">
//             <img src="/herosectionimg/whoweare.svg" alt="" />
//           </div>
//           <div className="col-span-2 content-center">
//             <h1 className="text-lg md:text-4xl font-bold text-orange-500 px-3">
//               Who We Are
//             </h1>

//             <hr className="my-3 border-dark" />

//             <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//               ArtSays is a creator-first platform built for artists of every
//               style, from digital dreamers to traditional painters. We believe
//               that art is more than visuals — it’s stories, emotions, and
//               connections. Our mission? To make sure every artist finds their
//               stage and every audience finds art that speaks to them.
//             </p>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 my-5">
//           <div className="content-center justify-items-center md:border-r-2 md:border-[#6F4D34]">
//             <h1 className="text-3xl md:text-6xl font-bold text-[#6F4D34] px-3">
//               229+
//             </h1>
//             <h1 className="text-lg md:text-2xl font-semibold text-dark px-3 pt-1 md:pt-3">
//               Happy Clients
//             </h1>
//           </div>
//           <div className="content-center justify-items-center md:border-r-2 md:border-[#6F4D34]">
//             <h1 className="text-3xl md:text-6xl font-bold text-[#6F4D34] px-3">
//               109+
//             </h1>
//             <h1 className="text-lg md:text-2xl font-semibold text-dark px-3 pt-1 md:pt-3">
//               Completed Projects
//             </h1>
//           </div>
//           <div className="content-center justify-items-center md:border-r-2 md:border-[#6F4D34]">
//             <h1 className="text-3xl md:text-6xl font-bold text-[#6F4D34] px-3">
//               22+
//             </h1>
//             <h1 className="text-lg md:text-2xl font-semibold text-dark px-3 pt-1 md:pt-3">
//               Awesome Staff
//             </h1>
//           </div>
//           <div className="content-center justify-items-center">
//             <h1 className="text-3xl md:text-6xl font-bold text-[#6F4D34] px-3">
//               11+
//             </h1>
//             <h1 className="text-lg md:text-2xl font-semibold text-dark px-3 pt-1 md:pt-3">
//               Winning Awards
//             </h1>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default WhoWeAre;


import React, { useEffect, useState } from "react";
import getAPI from "../../../api/getAPI";

const WhoWeAre = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  useEffect(() => {
    const fetchWhoWeAre = async () => {
      try {
        const pageRes = await getAPI("/api/about-us/published");
        const aboutUsPage = pageRes.data.data;

        if (!aboutUsPage?._id) throw new Error("No published About Us page found");

        const sectionRes = await getAPI(`/api/about-us-sections/who-we-are/${aboutUsPage._id}`);
        if (!sectionRes.data.success) throw new Error("Who We Are section not found");

        setData(sectionRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWhoWeAre();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Who We Are section not available</div>;

  return (
    <div className="bg-[#F8F8F8]">
      <div className="max-w-[1440px] mx-auto py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-3 sm:px-6 my-5">
          <div className="content-center justify-items-center">
            {data.image1 && (
              <img
                src={`${imageBaseURL}/${data.image1}`}
                alt="Who We Are"
                className="w-full h-auto object-contain rounded-lg"
              />
            )}
          </div>
          <div className="col-span-2 content-center">
            <h1 className="text-lg md:text-4xl font-bold text-orange-500 px-3">
              {data.heading}
            </h1>
            <hr className="my-3 border-dark" />
            <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
              {data.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 my-5">
          {data.stats?.map((s, idx) => (
            <div
              key={idx}
              className={`content-center justify-items-center ${
                idx < 3 ? "md:border-r-2 md:border-[#6F4D34]" : ""
              }`}
            >
              <h1 className="text-3xl md:text-6xl font-bold text-[#6F4D34] px-3">
                {s.number}
              </h1>
              <h1 className="text-lg md:text-2xl font-semibold text-dark px-3 pt-1 md:pt-3">
                {s.label}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
