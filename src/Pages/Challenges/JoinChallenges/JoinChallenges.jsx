import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { 
  ChevronRight, 
  Trophy, 
  Calendar, 
  Layers, 
  Tag, 
  ArrowLeft,
  UploadCloud,
  User,
  Mail,
  Phone,
  Layout,
  FileText,
} from "lucide-react";
import postAPI from "../../../api/postAPI";
import getAPI from "../../../api/getAPI";
import JoinChallengeSkeleton from "../../../Component/Skeleton/JoinChallengeSkeleton";
import "./JoinChallenges.css";
import SponsoredProducts from "../../../Component/Common/SponsoredProducts";

const JoinChallenges = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const challengeDetails = location?.state;

  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    userName: "",
    category: "",
    challengeName: challengeDetails?.title || "",
    description: "",
    guidelines: false,
    entryFee:challengeDetails?.entryFee
  });
  const [works, setWorks] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleApplicationData = (e) => {
    const { value, name, type, checked } = e.target;
    setApplicationData({
      ...applicationData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleWorkFile = (e) => {
    e.preventDefault();
    setWorks(e.target.files[0]);
  };

  const fetchCategories = async () => {
    try {
      const response = await getAPI("/api/main-category");
      if (response?.hasError === false) {
        setCategories(response.data.data);
      }
      } catch (error) {
        console.log("Error while fetching categories", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCategories();
    if (!challengeDetails) {
        navigate('/challenge');
    }
  }, [challengeDetails, navigate]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    if (!works) {
      toast.warning("Please upload your work");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(applicationData.contactNumber)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", applicationData.fullName);
    formData.append("email", applicationData.email);
    formData.append("contactNumber", applicationData.contactNumber);
    formData.append("userName", applicationData.userName);
    formData.append("category", applicationData.category);
    formData.append("challengeName", applicationData.challengeName);
    formData.append("description", applicationData.description);
    formData.append("guidelines", applicationData.guidelines);
    formData.append("works", works);
    formData.append("entryFee", challengeDetails?.entryFee );



    try {
        const response = await postAPI(
          "/api/join-challenge",
          formData,
          {},
          false
        );
        
        if (response?.hasError === false) {
          if (response?.data?.data?.paymentUrl) {
            window.location.href = response.data.data.paymentUrl;
          } else {
            toast.success(response?.message || "Application submitted successfully!");
            setApplicationData({
              fullName: "",
              email: "",
              contactNumber: "",
              userName: "",
              category: "",
              challengeName: challengeDetails?.title || "",
              description: "",
              guidelines: false,
            });
            setWorks(null);
            navigate('/challenge');
          }
        } else {
          toast.error(response?.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error submitting application: ", error);
        toast.error(error?.response?.data?.message || "Failed to submit application");
      } finally {
        setLoading(false);
      }
  };

  // const SidebarCard = ({ title, icon: Icon, children }) => (
  //   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
  //     <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
  //       <Icon size={18} className="text-[#6F4D34]" />
  //       {title}
  //     </h3>
  //     <div className="space-y-4">{children}</div>
  //   </div>
  // );

  if (loading) {
    return <JoinChallengeSkeleton />;
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins] py-8 px-4 md:px-6">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://artsays.in/" },
              { "@type": "ListItem", "position": 2, "name": "Challenges", "item": "https://artsays.in/challenges" },
              { "@type": "ListItem", "position": 3, "name": challengeDetails?.title || "Join Challenge", "item": window.location.href }
            ]
          })}
        </script>
      </Helmet>
      <div className="max-w-[1440px] mx-auto">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
          <ChevronRight size={14} />
          <a href="/challenges" className="hover:text-[#6F4D34] transition-colors">Challenges</a>
          <ChevronRight size={14} />
          <span className="text-[#6F4D34] font-semibold" aria-current="page">{challengeDetails?.title || "Join Challenge"}</span>
        </nav>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Header Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <button 
                onClick={() => navigate('/challenge')}
                className="flex items-center gap-2 text-[#6F4D34] font-bold text-sm hover:underline mb-4"
              >
                <ArrowLeft size={16} /> Back to Challenges
              </button>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Apply for: {challengeDetails?.title}
              </h1>
              <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                Submit your best work and stand a chance to win exciting prizes. Make sure to read the guidelines and requirements carefully.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Challenge Details Column */}
              <div className="space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <Trophy className="text-amber-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Challenge Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                        <FileText className="text-[#6F4D34]" size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Theme & Description</h4>
                        <p className="text-gray-700 font-medium leading-relaxed mt-1">{challengeDetails?.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                          <Calendar className="text-[#6F4D34]" size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Deadline</h4>
                          <p className="text-gray-900 font-bold">
                            {challengeDetails?.submissionDeadline
                              ? format(new Date(challengeDetails.submissionDeadline), "do MMMM, yyyy")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                          <Tag className="text-[#6F4D34]" size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Entry Fee</h4>
                          <p className="text-gray-900 font-bold">{challengeDetails?.entryFee || "Free Entry"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                        <Layers className="text-[#6F4D34]" size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Eligibility & Criteria</h4>
                        <p className="text-gray-700 font-medium mt-1">{challengeDetails?.judgingCriteria}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                      <h4 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2">Grand Prizes</h4>
                      <p className="text-amber-900 font-bold text-lg">{challengeDetails?.prizeDetails}</p>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Official Rules</h4>
                      <div 
                        className="text-sm text-gray-600 space-y-2 rules-text-container"
                        dangerouslySetInnerHTML={{ __html: challengeDetails?.rules }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Form Column */}
              <div>
                <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border-t-10 border-[#6F4D34] transition-all hover:shadow-xl">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Submission Form</h2>
                    <p className="text-gray-500 mt-2">Fill in your details and upload your artwork</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmitApplication}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <User size={16} className="text-[#6F4D34]" /> Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={applicationData.fullName}
                          onChange={handleApplicationData}
                          placeholder="Your full name"
                          className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Mail size={16} className="text-[#6F4D34]" /> Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={applicationData.email}
                          onChange={handleApplicationData}
                          placeholder="your@email.com"
                          className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Phone size={16} className="text-[#6F4D34]" /> Contact Number
                        </label>
                        <input
                          type="tel"
                          name="contactNumber"
                          value={applicationData.contactNumber}
                          onChange={handleApplicationData}
                          placeholder="Mobile number"
                          className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Tag size={16} className="text-[#6F4D34]" /> Artist Username
                        </label>
                        <input
                          type="text"
                          name="userName"
                          value={applicationData.userName}
                          onChange={handleApplicationData}
                          placeholder="@username"
                          className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Layout size={16} className="text-[#6F4D34]" /> Category
                      </label>
                      <select
                        name="category"
                        value={applicationData.category}
                        onChange={handleApplicationData}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] outline-none transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>Choose your Category</option>
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat.mainCategoryName}>{cat.mainCategoryName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FileText size={16} className="text-[#6F4D34]" /> Entry Description
                      </label>
                      <textarea
                        name="description"
                        value={applicationData.description}
                        onChange={handleApplicationData}
                        placeholder="Tell us about your submission..."
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] outline-none transition-all min-h-[120px] resize-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <UploadCloud size={16} className="text-[#6F4D34]" /> Upload Artwork
                      </label>
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleWorkFile}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`p-8 border-2 border-dashed ${works ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 group-hover:border-[#6F4D34] group-hover:bg-[#6F4D34]/5'} rounded-2xl transition-all text-center`}>
                          <UploadCloud size={32} className={`mx-auto mb-2 ${works ? 'text-green-500' : 'text-gray-400 group-hover:text-[#6F4D34]'}`} />
                          <p className={`text-sm font-bold ${works ? 'text-green-700' : 'text-gray-600'}`}>
                            {works ? works.name : 'Click or drag files to upload'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id="guidelines"
                        name="guidelines"
                        checked={applicationData.guidelines}
                        onChange={handleApplicationData}
                        className="w-5 h-5 rounded border-gray-300 text-[#6F4D34] focus:ring-[#6F4D34] cursor-pointer"
                        required
                      />
                      <label htmlFor="guidelines" className="text-sm text-gray-600 font-medium cursor-pointer">
                        I agree to the challenge rules & community guidelines.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#6F4D34] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#5a3e2a] hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      Submit Application
                      <ChevronRight size={20} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
        <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
      </div>
    </div>
  );
};

export default JoinChallenges;
