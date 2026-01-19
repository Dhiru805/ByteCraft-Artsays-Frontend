import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, Briefcase, FileText, Send } from "lucide-react";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import { toast } from "react-toastify";
import "./RolesContent.css";

function LifeAtArtsays() {
  const { slug } = useParams();
  const jobId = slug.split("-").pop();

  const [jobData, setJobData] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    jobPosition: "",
    coverLetter: "",
    condition: false,
    jobId: jobId
  });
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCareersById = async () => {
    try {
      setLoading(true);
      const response = await getAPI(`/api/get-career/${jobId}`);
      if (response?.data) {
        setJobData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchCareersById();
  }, [jobId]);

  useEffect(() => {
    if (jobData?.jobTitle) {
      setFormData(prev => ({ ...prev, jobPosition: jobData.jobTitle }));
    }
  }, [jobData?.jobTitle]);

  const handleFormData = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleResume = (e) => {
    setResume(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.fullName || !formData.email || !formData.contactNumber || !formData.coverLetter || !resume) {
      setMessage("Please fill all required fields and upload your resume.");
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionData = new FormData();
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key]);
      });
      if (resume) {
        submissionData.append("resume", resume);
      }

      const response = await postAPI("/api/apply-career-job", submissionData);

      if (response?.data?.hasError === false) {
        toast.success(response.data.message || "Application submitted successfully!");
        setFormData({
          fullName: "",
          email: "",
          contactNumber: "",
          jobPosition: jobData?.jobTitle || "",
          coverLetter: "",
          condition: false,
          jobId: jobId
        });
        setResume(null);
        setMessage("");
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error submitting application: ", error);
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <RolesContentSkeleton />;
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins] py-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        
        {/* Breadcrumbs & Header Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4">
          <nav className="flex items-center text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
            <ChevronRight size={14} className="mx-2" />
            <a href="/career" className="hover:text-[#6F4D34] transition-colors">Career</a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#6F4D34] font-medium truncate">{jobData?.jobTitle || "Job Detail"}</span>
          </nav>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {jobData?.jobTitle || "Job Opportunity"}
          </h1>
          <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
            Join the Artsays family and help us redefine the intersection of art and technology. 
            We value creativity, passion, and the drive to build something extraordinary.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Main Job Content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 border-l-[12px] border-l-[#6F4D34] overflow-hidden transition-all hover:shadow-xl group">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-[#6F4D34]/10 text-[#6F4D34] rounded-full text-sm font-bold uppercase tracking-wider">
                    {jobData?.category || "Career Opportunity"}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 group-hover:text-[#6F4D34] transition-colors flex items-center gap-3">
                  <Briefcase className="text-[#6F4D34]" />
                  About the Role
                </h2>
                
                <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
                  <p className="font-medium leading-relaxed">
                    {jobData?.summary || "No summary available for this position."}
                  </p>
                  
                  {jobData?.rolesResponsibilities && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Roles & Responsibilities</h3>
                      <div 
                        dangerouslySetInnerHTML={{ __html: jobData.rolesResponsibilities }} 
                        className="jobRoles-text space-y-4 text-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Sidebar Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 border-t-[12px] border-t-[#6F4D34] overflow-hidden sticky top-8">
              <div className="p-4">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Apply Now</h3>
                  <p className="text-gray-500 font-medium">Take the next step in your career</p>
                </div>

                {message && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
                    <span>{message}</span>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleFormSubmit}>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleFormData}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleFormData}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1 uppercase tracking-wide">Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      placeholder="+1 (555) 000-0000"
                      value={formData.contactNumber}
                      onChange={handleFormData}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1 uppercase tracking-wide">Job Position</label>
                    <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-bold cursor-not-allowed">
                      {jobData?.jobTitle || "Select Position"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1 uppercase tracking-wide">Cover Letter</label>
                    <textarea
                      name="coverLetter"
                      rows="4"
                      placeholder="Tell us why you're a great fit..."
                      value={formData.coverLetter}
                      onChange={handleFormData}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-gray-900 placeholder:text-gray-400 font-medium resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1 uppercase tracking-wide">Resume / CV</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleResume}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full px-4 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:bg-gray-100 transition-colors">
                        <FileText className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase">
                          {resume ? resume.name : "Click to upload PDF/DOC"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 py-2">
                    <input
                      type="checkbox"
                      id="condition"
                      name="condition"
                      checked={formData.condition}
                      onChange={handleFormData}
                      className="mt-1 rounded border-gray-300 text-[#6F4D34] focus:ring-[#6F4D34]"
                      required
                    />
                    <label htmlFor="condition" className="text-xs text-gray-500 font-medium leading-relaxed">
                      By submitting, I agree to the storage and handling of my data in accordance with the privacy policy.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#6F4D34] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-[#5a3e2a] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? "Submitting..." : (
                      <>
                        Submit Application
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const RolesContentSkeleton = () => (
  <div className="w-full bg-gray-50 min-h-screen py-8 animate-pulse">
    <div className="max-w-[1440px] mx-auto px-4 md:px-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 space-y-4">
        <div className="h-4 w-48 bg-gray-100 rounded-lg" />
        <div className="h-12 w-3/4 bg-gray-100 rounded-lg" />
        <div className="w-20 h-1.5 bg-gray-100 rounded-full" />
        <div className="h-4 w-full bg-gray-100 rounded-lg" />
        <div className="h-4 w-2/3 bg-gray-100 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 h-[500px] border border-gray-100" />
        <div className="lg:col-span-1 bg-white rounded-[32px] p-8 h-[700px] border border-gray-100" />
      </div>
    </div>
  </div>
);

export default LifeAtArtsays;
