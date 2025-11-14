
// const MeetTeam = () => {
//   return (
//     <div className="max-w-[1440px] mx-auto py-3 my-5">
//       <div>
//         <h1 className="text-lg md:text-4xl font-bold text-center text-orange-500 px-3">
//           Meet Our Founders
//         </h1>

//         <hr className="my-3 border-dark" />

//         <p className="mt-3 text-xs md:text-base text-center font-medium text-black leading-relaxed px-3">
//           ArtSays is a creator-first platform built for artists of every style,
//           from digital dreamers to traditional painters. We believe that art is
//           more than visuals — it’s stories, emotions, and connections. Our
//           mission? To make sure every artist finds their stage and every
//           audience finds art that speaks to them.
//         </p>
//       </div>
//       <div>
//         <section className="py-16 bg-white text-center">
//           {/* Team Members */}
//           <div className="flex flex-wrap justify-center gap-16 max-w-6xl mx-auto">
//             {/* Member 1 */}
//             <div className="flex flex-col items-center">
//               <div className="w-64 h-64 rounded-full border-8 border-[#6F4D34] overflow-hidden">
//                 <img
//                   src="/herosectionimg/shraddha.jpg"
//                   alt="Shraddha Lohar"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <h3 className="mt-6 text-2xl font-bold text-red-600">
//                 Shraddha Lohar
//               </h3>
//               <p className="text-black mt-1 text-lg">Co-Founder &amp; CEO</p>
//             </div>

//             {/* Member 2 */}
//             <div className="flex flex-col items-center">
//               <div className="w-64 h-64 rounded-full border-8 border-[#6F4D34] overflow-hidden">
//                 <img
//                   src="/herosectionimg/dhiraj.jpg"
//                   alt="Dhiraj Zope"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <h3 className="mt-6 text-2xl font-bold text-red-600">
//                 Dhiraj Zope
//               </h3>
//               <p className="text-black mt-1 text-lg">
//                 Co-Founder &amp; CTO &amp; COO
//               </p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };
// export default MeetTeam;







import React, { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const MeetTeam = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE ;

  useEffect(() => {
    const fetchMeetTeam = async () => {
      try {
        const pageRes = await getAPI("/api/about-us/published");
        const aboutUsPage = pageRes.data.data;

        if (!aboutUsPage?._id) throw new Error("No published About Us page found");

        
        const sectionRes = await getAPI(
          `/api/about-us-sections/meet-team/${aboutUsPage._id}`
        );
        if (!sectionRes.data.success) throw new Error("Meet Team section not found");

        setData(sectionRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetTeam();
  }, []);

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (!data) return <p className="text-center py-6">Meet Team section not available</p>;

  return (
    <div className="max-w-[1440px] mx-auto py-3 my-5">
    
      <div>
        <h1 className="text-lg md:text-4xl font-bold text-center text-orange-500 px-3">
          {data.mainHeading}
        </h1>
        <hr className="my-3 border-dark" />
        <p className="mt-3 text-xs md:text-base text-center font-medium text-black leading-relaxed px-3">
          {data.mainDescription}
        </p>
      </div>

      <section className="py-16 bg-white text-center">
        <div className="flex flex-wrap justify-center gap-16 max-w-6xl mx-auto">
          {data.teamMembers.map((member, index) => (
            <div key={member._id} className="flex flex-col items-center">
              <div className="w-64 h-64 rounded-full border-8 border-[#6F4D34] overflow-hidden">
                {(() => {
                  const base = (imageBaseURL || "").replace(/\/+$/, "");
                  const rawPath = (member.image || "").replace(/\\/g, "/");
                 
                  const pathSansUploads = rawPath.replace(/^uploads\//, "");
                  const finalSrc = base.includes("/uploads")
                    ? `${base}/${pathSansUploads}`
                    : `${base}/${rawPath}`;
                  return (
                    <img
                      src={finalSrc}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  );
                })()}
              </div>
              <h3 className="mt-6 text-2xl font-bold text-red-600">{member.name}</h3>
              <p className="text-black mt-1 text-lg">{member.role}</p>
              {member.description && (
                <p className="text-gray-600 mt-1 text-sm">{member.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MeetTeam;
