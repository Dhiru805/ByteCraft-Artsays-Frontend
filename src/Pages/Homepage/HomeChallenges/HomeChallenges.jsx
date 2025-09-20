import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { FaCrown } from "react-icons/fa";

const HomeChallenges = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
    return (
    <div className="max-w-[1440px] mx-auto py-4 px-3">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
          {/* title */}
          <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
            Challenges
          </h1>
        </div>

        <hr className="my-3 border-dark" />

        {/* Subtitle */}
        <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
          At ArtSays, we make it simple for you to collaborate directly with
          talented artists and bring your creative vision to life.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-3 sm:px-6 my-3">
              {/* LEFT SIDE */}
              <div className="order-2 md:!order-1 md:p-4 content-center">
                {!showDetails ? (
                  // ---------------- Main Container ----------------
                  <div>
                    <div className="inline-block border border-red rounded-full py-2 px-3 bg-[#48372D] text-white my-3 font-bold">
                      <p className="flex gap-2 items-center">
                        <GoDotFill /> 15 Days Left
                      </p>
                    </div>
      
                    <h2 className="text-[#48372D] text-2xl md:text-5xl font-bold">
                      Celebrate the spirit of Diwali through art
                    </h2>
                    <hr className="my-3 border-dark" />
      
                    <p className="text-xs md:text-base font-medium text-black leading-relaxed">
                      At ArtSays, we make it simple for you to collaborate directly
                      with talented artists and bring your creative vision to life.
                    </p>
      
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      {[
                        "Handmade",
                        "Oil",
                        "Acrylic",
                        "Watercolor Paintings",
                        "Photography",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#3a2a23] text-white px-4 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
      
                    {/* Prize */}
                    <div className="flex items-center gap-4 py-4 rounded-xl max-w-md">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#4b362f] text-white">
                        <FaCrown className="text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Prize</p>
                        <p className="text-[#4b362f] font-semibold">
                          Spotlight on ArtSays Homepage <br />
                          Limited Edition Print Feature
                        </p>
                      </div>
                    </div>
      
                    {/* Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <button className="flex items-center bg-[#48372D] justify-center border !border-[#48372D] rounded-full text-white py-2 font-semibold hover:bg-[#ffffff] hover:!text-[#48372D]">
                        Join The Challenge
                      </button>
                      <button
                        onClick={() => setShowDetails(true)}
                        className="flex-1 border !border-[#48372D] py-2 px-6 rounded-full font-semibold text-[#48372D] transition-colors duration-200 hover:bg-[#48372D] hover:!text-[#ffffff]"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                ) : (
                  // ---------------- Detailed Container ----------------
                  <div className="detailed-container">
                    <h2 className="text-[#48372D] text-2xl md:text-4xl font-bold mb-3">
                      Diwali Challenge – Full Details
                    </h2>
                    <p className="text-sm md:text-base text-dark mb-4 leading-relaxed">
                      Welcome to the ArtSays Diwali Challenge! Share your creativity
                      with the community and stand a chance to win exciting prizes.
                    </p>
      
                    <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-dark">
                      <li>Theme: Diwali Celebration</li>
                      <li>
                        Mediums: Handmade, Oil, Acrylic, Watercolor, Photography
                      </li>
                      <li>Entry Fee: ₹199</li>
                      <li>Submission Deadline: 25th Oct</li>
                      <li>Winner Announcement: 5th Nov</li>
                    </ul>
      
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 py-4">
                      <button className="flex items-center bg-[#48372D] justify-center border !border-[#48372D] rounded-full text-white py-2 font-semibold hover:bg-[#ffffff] hover:!text-[#48372D]">
                        Join The Challenge
                      </button>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="flex-1 border !border-[#48372D] py-2 px-6 rounded-full font-semibold text-[#48372D] transition-colors duration-200 hover:bg-[#48372D] hover:!text-[#ffffff] transition-all"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
      
              {/* RIGHT SIDE (Image) */}
              <aside className="order-1 md:!order-2 rounded-2xl content-center justify-items-center bg-[#EBEBEB]">
                <img
                  src="/herosectionimg/1.jpg"
                  className="w-full h-60 sm:h-[550px] object-contain"
                />
              </aside>
            </div>
    </div>
  );
};
export default HomeChallenges;
