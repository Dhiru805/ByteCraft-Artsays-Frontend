import { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { FaCrown } from "react-icons/fa";
import getAPI from "../../../api/getAPI";
import { differenceInDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";


const ChallengesContent = () => {

  const [showDetails, setShowDetails] = useState({});
  const [challengesData, setChallengesData] = useState([])

  const navigate = useNavigate()

  const fetchChallenges = async () => {
    try {
      const response = await getAPI('/api/getchallengedata')
      if (response?.hasError === false) {
        setChallengesData(response?.data.challenges)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [])

  const daysLeft = (targetDate) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffDays = differenceInDays(target, today)
    return diffDays > 0 ? `${diffDays} Days Left` : "Expired";
  }

  const handleShowDetails = (index) => {
    setShowDetails((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const slugUrl = (theme) => {
    return theme
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, '')
  }

  return (
    <div className="mb-4">

      <div>

        {/* Top Section: Breadcrumb + Search */}
        <div className="w-full py-3 px-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Breadcrumb */}
            <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
              <a href="#" className="hover:text-red-500">
                Home
              </a>
              <span>/</span>
              <a href="#" className="hover:text-red-500">
                Store
              </a>
              <span>/</span>
              <a href="#" className="hover:text-red-500">
                Paintings
              </a>
              <span>/</span>
              <span className="font-medium text-gray-900">Abstract</span>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
          {/* title */}
          <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
            Challenges
          </h1>
        </div>

        <hr className="my-3 border-dark" />

        {/* Subtitle */}
        <p className="mt-3 text-xs md:text-base font-medium text-dark leading-relaxed px-3">
          At ArtSays, we make it simple for you to collaborate directly with
          talented artists and bring your creative vision to life. Commissioning
          custom artwork is a personalized process designed to give you a unique
          piece that reflects your ideas, style, and story.
        </p>

      </div>

      {challengesData.length > 0 ? (
        challengesData.map((challenge, index) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-3 sm:px-6 my-3">

            {/* LEFT SIDE */}
            <div className={`md:p-4 content-center order-2 ${(index + 1) % 2 === 0 ? 'md:!order-2' : 'md:!order-1'}`}>
              {!showDetails[index] ? (
                // ---------------- Main Container ----------------
                <div>
                  <div className="inline-block border border-red rounded-full py-2 px-3 bg-[#48372D] text-white my-3 font-bold">
                    <p className="flex gap-2 items-center">
                      <GoDotFill /> {daysLeft(challenge?.endDate)}
                    </p>
                  </div>

                  <h2 className="text-[#48372D] text-2xl md:text-5xl font-bold">
                    {challenge?.title || "Challenge Title"}
                  </h2>
                  <hr className="my-3 border-dark" />

                  <p className="text-xs md:text-base font-medium text-black leading-relaxed line-clamp-2">
                    {challenge?.description || "Challenge Description"}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {challenge?.tags.map((tag, index) => (
                      <span
                        key={index}
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
                        {challenge?.prizeDetails || "Challenge Prize Details"}
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    <button
                      className="flex items-center bg-[#48372D] justify-center border !border-[#48372D] rounded-full text-white py-2 
                        font-semibold hover:bg-[#ffffff] hover:!text-[#48372D]"
                      onClick={() => navigate(`/challenge/${slugUrl(challenge?.title)}`, { state: challenge })}
                    >
                      Join The Challenge
                    </button>
                    <button
                      onClick={() => handleShowDetails(index)}
                      className="flex-1 border !border-[#48372D] py-2 px-6 rounded-full font-semibold text-[#48372D] transition-colors 
                        duration-200 hover:bg-[#48372D] hover:!text-[#ffffff]"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ) : (
                // ---------------- Detailed Container ----------------
                <div className="detailed-container">
                  <h2 className="text-[#48372D] text-2xl md:text-4xl font-bold mb-3">
                    {challenge?.title || "Challenge Title"}
                  </h2>
                  <p className="text-sm md:text-base text-dark mb-4 leading-relaxed line-clamp-2">
                    {challenge?.description || "Challenge Description"}
                  </p>

                  <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-dark">
                    <li>Theme: {challenge?.type || "Challenge Type"}</li>
                    <li>
                      Mediums: {challenge?.tags.join(", ")}
                    </li>
                    <li>Entry Fee: {challenge?.entryFee || ""}</li>
                    <li>
                      Submission Deadline: {challenge?.submissionDeadline ? format(new Date(challenge.submissionDeadline), "dd MMMM, yyyy") : "N/A"}
                    </li>
                  </ul>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 py-4">
                    <button className="flex items-center bg-[#48372D] justify-center border !border-[#48372D] rounded-full text-white py-2 
                      font-semibold hover:bg-[#ffffff] hover:!text-[#48372D]"
                      onClick={() => navigate(`/challenge/${slugUrl(challenge?.title)}`, { state: challenge })}
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

            {/* RIGHT SIDE (Image) */}
            <aside
              className={`${(index + 1) % 2 === 0 ? 'md:!order-1' : 'md:!order-2'} order-1 rounded-2xl content-center justify-items-center bg-[#EBEBEB]`}
            >
              <img
                // src="/herosectionimg/1.jpg"
                src={challenge?.bannerImage}
                alt="Challenge banner image"
                className="w-full h-60 sm:h-[700px] object-contain"
              />
            </aside>

          </div>
        ))

      ) : (
        <div>No Challenges data</div>
      )}
    </div>
  );
};
export default ChallengesContent;
