
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

  if (loading) return <div className="text-center py-6">{TeamMembersSkeleton()}</div>;
  if (!data) return <div className="text-center py-6">Meet Team section not available</div>;

  return (
    <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
            {data.mainHeading || "Meet Our Founders"}
          </h2>
          <div className="w-16 h-1 bg-[#6F4D34] rounded-full mx-auto" />
          <p className="text-lg text-gray-600 leading-relaxed font-medium max-w-3xl mx-auto">
            {data.mainDescription}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-12 lg:gap-16 pt-8">
          {data.teamMembers.map((member, index) => (
            <div key={member._id} className="flex flex-col items-center max-w-xs group/member">
              <div className="relative">
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-full border-8 border-gray-50 overflow-hidden shadow-inner group-hover/member:border-[#6F4D34]/20 transition-all duration-500">
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
                        className="w-full h-full object-cover group-hover/member:scale-110 transition-transform duration-700"
                      />
                    );
                  })()}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#6F4D34] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Founder
                </div>
              </div>
              <div className="mt-8 space-y-2 text-center">
                <h3 className="text-2xl font-extrabold text-gray-900 group-hover/member:text-[#6F4D34] transition-colors">
                  {member.name}
                </h3>
                <p className="text-[#6F4D34] font-bold text-sm uppercase tracking-tighter">
                  {member.role}
                </p>
                {member.description && (
                  <p className="text-gray-500 text-sm leading-relaxed italic">
                    "{member.description}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetTeam;


const TeamMembersSkeleton = () => {
  return (
    <div className="max-w-[1440px] mx-auto py-3 my-5 animate-pulse">
      {/* Heading */}
      <div>
        <div className="h-8 w-56 bg-gray-300 rounded mx-auto"></div>
        <div className="h-1 w-40 bg-gray-300 mx-auto my-4"></div>
        <div className="h-4 w-72 bg-gray-300 rounded mx-auto mt-4"></div>
        <div className="h-4 w-64 bg-gray-300 rounded mx-auto mt-2"></div>
      </div>

      {/* Skeleton Cards */}
      <section className="py-16 text-center">
        <div className="flex flex-wrap justify-center gap-16 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Circle Image */}
              <div className="w-64 h-64 rounded-full border-8 border-gray-300 overflow-hidden">
                <div className="w-full h-full bg-gray-300"></div>
              </div>

              {/* Name */}
              <div className="mt-6 h-6 w-40 bg-gray-300 rounded"></div>

              {/* Role */}
              <div className="mt-3 h-5 w-28 bg-gray-300 rounded"></div>

              {/* Description */}
              <div className="mt-2 h-4 w-48 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

