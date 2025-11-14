// import React, { useState } from "react";
// import { GoDotFill } from "react-icons/go";
// import { FaCrown } from "react-icons/fa";

// const HomeChallenges = () => {
//   const [showFilters, setShowFilters] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
  
//     return (
//     <div className="max-w-[1440px] mx-auto py-4 px-3">
//       <div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//           {/* title */}
//           <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//             Challenges
//           </h1>
//         </div>

//         <hr className="my-3 border-dark" />

//         {/* Subtitle */}
//         <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//           At ArtSays, we make it simple for you to collaborate directly with
//           talented artists and bring your creative vision to life.
//         </p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-3 sm:px-6 my-3">
//               {/* LEFT SIDE */}
//               <div className="order-2 md:!order-1 md:p-4 content-center">
//                 {!showDetails ? (
//                   // ---------------- Main Container ----------------
//                   <div>
//                     <div className="inline-block border border-red rounded-full py-2 px-3 bg-[#48372D] text-white my-3 font-bold">
//                       <p className="flex gap-2 items-center">
//                         <GoDotFill /> 15 Days Left
//                       </p>
//                     </div>
      
//                     <h2 className="text-[#48372D] text-2xl md:text-5xl font-bold">
//                       Celebrate the spirit of Diwali through art
//                     </h2>
//                     <hr className="my-3 border-dark" />
      
//                     <p className="text-xs md:text-base font-medium text-black leading-relaxed">
//                       At ArtSays, we make it simple for you to collaborate directly
//                       with talented artists and bring your creative vision to life.
//                     </p>
      
//                     {/* Tags */}
//                     <div className="flex flex-wrap gap-2 pt-4">
//                       {[
//                         "Handmade",
//                         "Oil",
//                         "Acrylic",
//                         "Watercolor Paintings",
//                         "Photography",
//                       ].map((tag) => (
//                         <span
//                           key={tag}
//                           className="bg-[#3a2a23] text-white px-4 py-1 rounded-full text-sm"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
      
//                     {/* Prize */}
//                     <div className="flex items-center gap-4 py-4 rounded-xl max-w-md">
//                       <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#4b362f] text-white">
//                         <FaCrown className="text-xl" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Prize</p>
//                         <p className="text-[#4b362f] font-semibold">
//                           Spotlight on ArtSays Homepage <br />
//                           Limited Edition Print Feature
//                         </p>
//                       </div>
//                     </div>
      
//                     {/* Buttons */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                       <button className="flex items-center bg-[#48372D] justify-center border !border-[#48372D] rounded-full text-white py-2 font-semibold hover:bg-[#ffffff] hover:!text-[#48372D]">
//                         Join The Challenge
//                       </button>
//                       <button
//                         onClick={() => setShowDetails(true)}
//                         className="flex-1 border !border-[#48372D] py-2 px-6 rounded-full font-semibold text-[#48372D] transition-colors duration-200 hover:bg-[#48372D] hover:!text-[#ffffff]"
//                       >
//                         Learn More
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   // ---------------- Detailed Container ----------------
//                   <div className="detailed-container">
//                     <h2 className="text-[#48372D] text-2xl md:text-4xl font-bold mb-3">
//                       Diwali Challenge – Full Details
//                     </h2>
//                     <p className="text-sm md:text-base text-dark mb-4 leading-relaxed">
//                       Welcome to the ArtSays Diwali Challenge! Share your creativity
//                       with the community and stand a chance to win exciting prizes.
//                     </p>
      
//                     <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-dark">
//                       <li>Theme: Diwali Celebration</li>
//                       <li>
//                         Mediums: Handmade, Oil, Acrylic, Watercolor, Photography
//                       </li>
//                       <li>Entry Fee: ₹199</li>
//                       <li>Submission Deadline: 25th Oct</li>
//                       <li>Winner Announcement: 5th Nov</li>
//                     </ul>
      
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 py-4">
//                       <button className="flex items-center bg-[#48372D] justify-center border !border-[#48372D] rounded-full text-white py-2 font-semibold hover:bg-[#ffffff] hover:!text-[#48372D]">
//                         Join The Challenge
//                       </button>
//                       <button
//                         onClick={() => setShowDetails(false)}
//                         className="flex-1 border !border-[#48372D] py-2 px-6 rounded-full font-semibold text-[#48372D] transition-colors duration-200 hover:bg-[#48372D] hover:!text-[#ffffff] transition-all"
//                       >
//                         Back
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
      
//               {/* RIGHT SIDE (Image) */}
//               <aside className="order-1 md:!order-2 rounded-2xl content-center justify-items-center bg-[#EBEBEB]">
//                 <img
//                   src="/herosectionimg/1.jpg"
//                   className="w-full h-60 sm:h-[550px] object-contain"
//                 />
//               </aside>
//             </div>
//     </div>
//   );
// };
// export default HomeChallenges;












// import { useState, useEffect } from "react";
// import getAPI from "../../../api/getAPI";

// const HomeChallenges = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {


import { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { FaCrown } from "react-icons/fa";
import getAPI from "../../../api/getAPI";
import { differenceInDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";

const HomeChallenges = () => {
  const [homepageChallenges, setHomepageChallenges] = useState(null);
  const [detailedChallenges, setDetailedChallenges] = useState([]);
  const [showDetails, setShowDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const pageRes = await getAPI("/api/homepage/published");
        const homepage = pageRes.data.data;
        if (!homepage?._id) throw new Error("No published homepage found");

      //   const challengesRes = await getAPI(`/api/homepage-sections/challenges/${homepage._id}`);
      //   if (!challengesRes.data.success || !challengesRes.data.data)
      //     throw new Error("Challenges section not found");

      //   setData(challengesRes.data.data);
      // } catch (err) {
      //   console.error("Error fetching challenges:", err);
        const challengesRes = await getAPI(
          `/api/homepage-sections/challenges/${homepage._id}`
        );
        if (challengesRes.data.success && challengesRes.data.data) {
          setHomepageChallenges(challengesRes.data.data);
        } else {
          console.log("Homepage challenges section not found");
        }

        const detailedRes = await getAPI("/api/getchallengedata");
        if (detailedRes?.hasError === false) {
          const allChallenges = detailedRes?.data?.challenges || [];
          // Filter for live challenges only
          const liveChallenges = allChallenges.filter(challenge => challenge.status === "live");
          // Sort by createdAt descending to get the latest challenge first
          const sortedChallenges = liveChallenges.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          // Use only the latest live challenge for homepage
          setDetailedChallenges(sortedChallenges.length > 0 ? [sortedChallenges[0]] : []);
        }
        
        else {
          console.log("Detailed challenges fetch error", detailedRes);
        }
      } catch (err) {
        console.error("Error fetching HomeChallenges data:", err);
      } finally {
        setLoading(false);
      }
    };

  //   fetchData();
  // }, []);

  // if (loading) return <div>Loading...</div>;
  // if (!data) return <div>No Challenges section available</div>;

  // return (
  //   <div className="max-w-[1440px] mx-auto py-4 px-3">
  //     <div>
  //       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
        
  //         <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
  //           {data.heading}
  //         </h1>
  //       </div>

  //       <hr className="my-3 border-dark" />

  //       <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
  //         {data.description}
  //       </p>
  //     </div>
    fetchAllData();
  }, []);


  const daysLeft = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffDays = differenceInDays(target, today);
    return diffDays > 0 ? `${diffDays} Days Left` : "Expired";
  };

  const handleShowDetails = (index) => {
    setShowDetails((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const slugUrl = (theme) => {
    return theme
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-[1440px] mx-auto py-4 px-3">
    
      {homepageChallenges && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
            <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
              {homepageChallenges.heading}
            </h1>
          </div>

          <hr className="my-3 border-dark" />

          <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
            {homepageChallenges.description}
          </p>
        </div>
      )}

      {detailedChallenges.length > 0 ? (
        detailedChallenges.map((challenge, index) => (
          <div
            key={challenge._id || index}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-3 sm:px-6 my-3"
          >
          
            <div
              className={`md:p-4 content-center order-2 ${(index + 1) % 2 === 0 ? "md:!order-2" : "md:!order-1"
                }`}
            >
              {!showDetails[index] ? (
                <div>
                  <div className="inline-block border border-red rounded-full py-2 px-3 bg-[#48372D] text-white my-3 font-bold">
                    <p className="flex gap-2 items-center">
                      <GoDotFill /> {daysLeft(challenge?.endDate)}
                    </p>
                  </div>

                  <h2 className="text-[#48372D] text-2xl md:text-5xl font-bold">
                    {challenge?.title}
                  </h2>
                  <hr className="my-3 border-dark" />

                  <p className="text-xs md:text-base font-medium text-black leading-relaxed line-clamp-2">
                    {challenge?.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {challenge?.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#3a2a23] text-white px-4 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 py-4 rounded-xl max-w-md">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#4b362f] text-white">
                      <FaCrown className="text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prize</p>
                      <p className="text-[#4b362f] font-semibold">
                        {challenge?.prizeDetails}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    <button
                      className="flex items-center bg-[#48372D] justify-center border !border-[#48372D] rounded-full text-white py-2 font-semibold hover:bg-[#ffffff] hover:!text-[#48372D]"
                      onClick={() =>
                        navigate(`/challenge/${slugUrl(challenge?.title)}`, {
                          state: challenge,
                        })
                      }
                    >
                      Join The Challenge
                    </button>
                    <button
                      onClick={() => handleShowDetails(index)}
                      className="flex-1 border !border-[#48372D] py-2 px-6 rounded-full font-semibold text-[#48372D] transition-colors duration-200 hover:bg-[#48372D] hover:!text-[#ffffff]"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ) : (
                <div className="detailed-container">
                  <h2 className="text-[#48372D] text-2xl md:text-4xl font-bold mb-3">
                    {challenge?.title}
                  </h2>
                  <p className="text-sm md:text-base text-dark mb-4 leading-relaxed line-clamp-2">
                    {challenge?.description}
                  </p>

                  <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-dark">
                    <li>Theme: {challenge?.type}</li>
                    <li>Mediums: {challenge?.tags?.join(", ")}</li>
                    <li>Entry Fee: {challenge?.entryFee}</li>
                    <li>
                      Submission Deadline:{" "}
                      {challenge?.submissionDeadline
                        ? format(
                          new Date(challenge.submissionDeadline),
                          "dd MMMM, yyyy"
                        )
                        : "N/A"}
                    </li>
                  </ul>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 py-4">
                    <button
                      className="flex items-center bg-[#48372D] justify-center border !border-[#48372D] rounded-full text-white py-2 font-semibold hover:bg-[#ffffff] hover:!text-[#48372D]"
                      onClick={() =>
                        navigate(`/challenge/${slugUrl(challenge?.title)}`, {
                          state: challenge,
                        })
                      }
                    >
                      Join The Challenge
                    </button>
                    <button
                      onClick={() => handleShowDetails(index)}
                      className="flex-1 border !border-[#48372D] py-2 px-6 rounded-full font-semibold text-[#48372D] transition-colors duration-200 hover:bg-[#48372D] hover:!text-[#ffffff] transition-all"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>

            <aside
              className={`${(index + 1) % 2 === 0 ? "md:!order-1" : "md:!order-2"
                } order-1 rounded-2xl content-center justify-items-center bg-[#EBEBEB]`}
            >
              <img
                src={challenge?.bannerImage}
                alt="Challenge banner"
                className="w-full h-60 sm:h-[700px] object-contain"
              />
            </aside>
          </div>
        ))
      ) : (
        <div>No Detailed Challenges available</div>
      )}
    </div>
  );
};
export default HomeChallenges;
