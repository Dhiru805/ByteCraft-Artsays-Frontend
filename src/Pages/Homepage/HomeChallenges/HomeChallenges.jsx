import { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { FaCrown } from "react-icons/fa";
import { 
  ChevronRight, 
  Trophy, 
  Calendar, 
  Layers, 
  Tag, 
  ArrowLeft 
} from "lucide-react";
import getAPI from "../../../api/getAPI";
import { differenceInDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import HomeChallengesSkeleton from "../../../Component/Skeleton/HomeChallengesSkeleton";

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

        const challengesRes = await getAPI(
          `/api/homepage-sections/challenges/${homepage._id}`
        );
        if (challengesRes.data.success && challengesRes.data.data) {
          setHomepageChallenges(challengesRes.data.data);
        }

        const detailedRes = await getAPI("/api/getchallengedata");
        if (detailedRes?.hasError === false && detailedRes?.data?.data?.challenges) {
          const allChallenges = detailedRes?.data?.data?.challenges || [];
          const liveChallenges = allChallenges.filter(challenge => challenge.status === "live");
          const sortedChallenges = liveChallenges.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          setDetailedChallenges(sortedChallenges.length > 0 ? [sortedChallenges[0]] : []);
        }
      } catch (err) {
        console.error("Error fetching HomeChallenges data:", err);
      } finally {
        setLoading(false);
      }
    };

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

  if (loading) return <div><HomeChallengesSkeleton/></div>;

  return (
    <div className="w-full bg-gray-50 font-[poppins] py-12 px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto">
        {homepageChallenges && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 align-items-center mb-10">
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
                {homepageChallenges.heading}
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl font-medium leading-relaxed">
                {homepageChallenges.description}
              </p>
            </div>
            <button
              onClick={() => navigate("/challenge")}
              className="hidden lg:block bg-[#6F4D34] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-all shadow-lg shadow-[#6F4D34]/20 transform active:scale-95"
            >
              Explore More Challenges
            </button>
          </div>
        )}

        <div className="space-y-6">
          {detailedChallenges.length > 0 ? (
            detailedChallenges.map((challenge, index) => (
              <div
                key={challenge._id || index}
                className={`flex flex-col lg:flex-row gap-8 bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-xl group ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image Section */}
                  <div className="w-full lg:w-2/5 aspect-[4/3] overflow-hidden rounded-2xl bg-[#F5F5F5] flex items-center justify-center relative">
                    <img
                      src={challenge?.bannerImage?.startsWith("http") ? challenge.bannerImage : `${process.env.REACT_APP_API_URL_FOR_IMAGE}${challenge.bannerImage}`}
                      alt={challenge?.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  <div className="absolute top-4 right-4 lg:hidden">
                    <span className="flex items-center gap-1 px-3 py-1 bg-[#6F4D34] text-white rounded-full text-xs font-bold shadow-lg">
                      <GoDotFill className="animate-pulse" /> {daysLeft(challenge?.endDate)}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-3/5 flex flex-col justify-center space-y-4">
                  {!showDetails[index] ? (
                    <>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="hidden lg:flex items-center gap-1 px-3 py-1 bg-[#6F4D34] text-white rounded-full text-xs font-bold shadow-md">
                          <GoDotFill className="animate-pulse" /> {daysLeft(challenge?.endDate)}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase">
                          <Trophy size={14} /> {challenge?.status}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
                        {challenge?.title}
                      </h2>
                      
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed line-clamp-2 font-medium">
                        {challenge?.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {challenge?.tags?.map((tag, tIndex) => (
                          <span key={tIndex} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                            <Tag size={12} /> {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100 max-w-sm">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500 text-white shadow-lg">
                          <FaCrown className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-amber-600">Grand Prize</p>
                          <p className="text-gray-900 font-bold text-lg leading-tight">
                            {challenge?.prizeDetails}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          onClick={() => navigate(`/challenge/${slugUrl(challenge?.title)}`, { state: challenge })}
                          className="px-8 py-3.5 bg-[#6F4D34] hover:bg-[#5a3e2a] hover:-translate-y-1 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
                        >
                          Join Challenge
                          <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleShowDetails(index)}
                          className="px-8 py-3.5 bg-white text-[#6F4D34] border-2 border-[#6F4D34] rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#6F4D34] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          Learn More
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="animate-fade-in space-y-5">
                      <button 
                        onClick={() => handleShowDetails(index)}
                        className="flex items-center gap-2 text-[#6F4D34] font-bold text-sm hover:underline mb-2"
                      >
                        <ArrowLeft size={16} /> Back to summary
                      </button>

                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Detailed Information
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                          <Layers size={20} className="text-[#6F4D34] mt-1" />
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Theme</p>
                            <p className="text-gray-900 font-semibold">{challenge?.type}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                          <Calendar size={20} className="text-[#6F4D34] mt-1" />
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Deadline</p>
                            <p className="text-gray-900 font-semibold">
                              {challenge?.submissionDeadline
                                ? format(new Date(challenge.submissionDeadline), "dd MMMM, yyyy")
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                          <Tag size={20} className="text-[#6F4D34] mt-1" />
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Entry Fee</p>
                            <p className="text-gray-900 font-semibold">{challenge?.entryFee || "Free"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                          <Trophy size={20} className="text-[#6F4D34] mt-1" />
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Mediums</p>
                            <p className="text-gray-900 font-semibold">{challenge?.tags?.join(", ")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#6F4D34]/5 rounded-2xl border border-[#6F4D34]/10">
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          {challenge?.description}
                        </p>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={() => navigate(`/challenge/${slugUrl(challenge?.title)}`, { state: challenge })}
                          className="w-full sm:w-auto px-12 py-4 bg-[#6F4D34] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-[#5a3e2a] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          Start Your Submission
                          <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">No live challenges at the moment.</p>
              <button 
                onClick={() => navigate('/challenges')}
                className="mt-4 text-[#6F4D34] font-bold hover:underline"
              >
                View all challenges
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeChallenges;
