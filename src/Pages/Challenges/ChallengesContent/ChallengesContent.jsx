import { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { FaCrown } from "react-icons/fa";
import { 
  Search, 
  ChevronRight, 
  Info, 
  HelpCircle, 
  Trophy, 
  Calendar, 
  Layers, 
  Tag, 
  ArrowLeft, 
  Layout 
} from "lucide-react";
import getAPI from "../../../api/getAPI";
import { differenceInDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ChallengeSkeleton from "../../../Component/Skeleton/ChallengeSkeleton";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ChallengesContent = () => {
  const [showDetails, setShowDetails] = useState({});
  const [challengesData, setChallengesData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const navigate = useNavigate();

    const fetchChallenges = async () => {
      try {
        const response = await getAPI("/api/getchallengedata");
        if (response?.hasError === false && response?.data?.data?.challenges) {
          // Fetch all challenges that are either live or upcoming
          const filtered = response.data.data.challenges.filter(
            (challenge) => challenge?.status === "live" || challenge?.status === "upcoming"
          );
          setChallengesData(filtered);
        }
      } catch (error) {
        console.log("Error fetching challenges:", error);
      }
    };

  const fetchChallengeCMS = async () => {
    try {
      const response = await getAPI("/api/challenge-CMS/published");
      if (response?.data?.data) {
        setCmsData(response.data.data);
      }
    } catch (error) {
      console.log("CMS fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
    fetchChallengeCMS();
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

  const filteredChallenges = challengesData.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || challenge.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const SidebarCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Icon size={18} className="text-[#6F4D34]" />
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  if (loading) {
    return <ChallengeSkeleton />;
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins] py-8 px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-3">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-[300px] shrink-0">
            <div className="sticky top-6 space-y-3">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Challenge Info</h2>
                <nav className="flex items-center text-sm text-gray-500 mt-2">
                  <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
                  <ChevronRight size={14} className="mx-2" />
                  <span className="text-[#6F4D34] font-medium">Challenges</span>
                </nav>
              </div>

                <SidebarCard title="Filter by Status" icon={Layout}>
                  <div className="space-y-2">
                    {["all", "live", "upcoming"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                          selectedStatus === status
                            ? "bg-[#6F4D34] text-white shadow-md"
                            : "bg-gray-50 text-gray-700 hover:bg-[#6F4D34]/5 hover:text-[#6F4D34]"
                        }`}
                      >
                        <span className="text-sm font-semibold capitalize">{status}</span>
                        <ChevronRight
                          size={16}
                          className={`${
                            selectedStatus === status ? "translate-x-1" : "group-hover:translate-x-1"
                          } transition-transform`}
                        />
                      </button>
                    ))}
                  </div>
                </SidebarCard>

                <SidebarCard title="Why Join?" icon={Info}>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Join challenges to sharpen your skills, compete with the best, and win exciting rewards while building your portfolio.
                </p>
              </SidebarCard>

              <SidebarCard title="Need Help?" icon={HelpCircle}>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                    <span className="text-sm font-semibold">Guidelines</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                    <span className="text-sm font-semibold">Support</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </SidebarCard>

              <div className="bg-[#6F4D34] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Ready to Win?</h3>
                  <p className="text-sm opacity-90 mb-4">Start your journey and showcase your art.</p>
                  <button className="w-full py-3 bg-white text-[#6F4D34] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                    Join Community
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden space-y-3">
            {/* Search and Header */}
            <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search challenges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
                  />
                </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  {cmsData?.heading || "Art Challenges"}
                </h1>
                <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  {cmsData?.description || "At ArtSays, we make it simple for you to collaborate directly with talented artists..."}
                </p>
              </div>
            </div>

            {/* Challenges List */}
            <div className="space-y-3">
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((challenge, index) => (
                  <div
                    key={index}
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
                      {/* Timer Overlay on Image for mobile */}
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
                              <span className={`hidden lg:flex items-center gap-1 px-3 py-1 ${challenge?.status === 'upcoming' ? 'bg-blue-600' : 'bg-[#6F4D34]'} text-white rounded-full text-xs font-bold shadow-md`}>
                                <GoDotFill className={challenge?.status === 'live' ? "animate-pulse" : ""} /> {challenge?.status === 'upcoming' ? 'Starts Soon' : daysLeft(challenge?.endDate)}
                              </span>
                              <span className={`flex items-center gap-1 px-3 py-1 ${challenge?.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'} border rounded-full text-xs font-bold uppercase`}>
                                {challenge?.status === 'upcoming' ? <Calendar size={14} /> : <Trophy size={14} />} {challenge?.status}
                              </span>
                            </div>

                            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
                              {challenge?.title}
                            </h2>
                            
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed line-clamp-2 font-medium">
                              {challenge?.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                              {challenge?.tags?.map((tag, tIndex) => (
                                <span key={tIndex} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                                  <Tag size={12} /> {tag}
                                </span>
                              ))}
                            </div>

                            {/* Grand Prize */}
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

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                              <button
                                onClick={() => navigate(`/challenge/${slugUrl(challenge?.title)}`, { state: challenge })}
                                disabled={challenge?.status === 'upcoming'}
                                className={`px-8 py-3.5 ${challenge?.status === 'upcoming' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6F4D34] hover:bg-[#5a3e2a] hover:-translate-y-1'} text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group/btn`}
                              >
                                {challenge?.status === 'upcoming' ? 'Coming Soon' : 'Join Challenge'}
                                {challenge?.status !== 'upcoming' && <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}
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
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    No {selectedStatus !== 'all' ? selectedStatus : ''} challenges found
                  </h3>
                  <p className="text-gray-500 mt-2">Try searching for something else or check back later.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChallengesContent;
