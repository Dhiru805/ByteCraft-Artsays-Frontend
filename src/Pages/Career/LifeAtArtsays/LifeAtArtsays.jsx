import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import { getImageUrl } from "../../../utils/getImageUrl";

const LifeAtArtsays = () => {
  const { slug } = useParams();
  const jobId = slug?.split("-").pop();

  const [jobData, setJobData] = useState(null);
  const [careersPage, setCareersPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    jobPosition: "",
    coverLetter: "",
    condition: false,
    jobId: jobId || "",
  });
  const [resume, setResume] = useState(null);
  const [setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const base = getImageUrl(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cmsRes, jobRes] = await Promise.all([
        getAPI("/api/career-CMS/published"),
        jobId ? getAPI(`/api/get-career/${jobId}`) : Promise.resolve(null),
      ]);

      if (cmsRes?.data?.data) setCareersPage(cmsRes.data.data);
      if (jobRes?.data?.data) {
        setJobData(jobRes.data.data);
        setFormData((prev) => ({ ...prev, jobPosition: jobRes.data.data.jobTitle }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const handleFormData = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleResume = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    setResume(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.condition) {
      toast.error("Please agree to the storage and handling of your data.");
      return;
    }

    setSubmitting(true);
    try {
      const submissionData = new FormData();
      Object.keys(formData).forEach((key) => submissionData.append(key, formData[key]));
      if (resume) submissionData.append("resume", resume);

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
          jobId: jobId || "",
        });
        setResume(null);
        setMessage("");
      } else {
        toast.error(response?.data?.message || "Something went wrong, try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LifeAtArtsaysSkeleton />;

  // IF JOB ID EXISTS - SHOW JOB DETAIL VIEW
  if (jobId && jobData) {
    return (
      <div className="max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-700">
        {/* Breadcrumbs */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <nav className="flex items-center text-sm text-gray-500">
            <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
            <ChevronRight size={14} className="mx-2" />
            <a href="/career" className="hover:text-[#6F4D34] transition-colors">Careers</a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#6F4D34] font-medium truncate">{jobData.jobTitle}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-2">
                <span className="px-4 py-1.5 bg-[#6F4D34]/5 text-[#6F4D34] text-xs font-bold uppercase tracking-wider rounded-full">
                  {jobData.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {jobData.jobTitle}
                </h1>
                <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full" />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#6F4D34]" />
                  About the Role
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {jobData.summary}
                </p>
              </div>

              {jobData.rolesResponsibilities && (
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Responsibilities & Requirements</h2>
                  <div 
                    dangerouslySetInnerHTML={{ __html: jobData.rolesResponsibilities }} 
                    className="prose prose-brown max-w-none text-gray-600 leading-relaxed
                      [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:space-y-2 [&>li]:pl-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white p-8 rounded-[32px] shadow-lg border border-gray-100 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Apply Now</h2>
                <p className="text-sm text-gray-500 font-medium">Be part of the Artsays journey!</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    required
                    value={formData.fullName}
                    onChange={handleFormData}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={handleFormData}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="+1 234 567 890"
                    required
                    value={formData.contactNumber}
                    onChange={handleFormData}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">Cover Letter</label>
                  <textarea
                    name="coverLetter"
                    placeholder="Tell us why you're a great fit..."
                    rows="4"
                    value={formData.coverLetter}
                    onChange={handleFormData}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">Resume / CV (PDF)</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResume}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full px-4 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-[#6F4D34] transition-colors">
                      <Upload size={24} className="text-gray-400 group-hover:text-[#6F4D34]" />
                      <span className="text-xs font-medium text-gray-500 text-center">
                        {resume ? resume.name : "Click or drag to upload"}
                      </span>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="condition"
                    checked={formData.condition}
                    onChange={handleFormData}
                    className="mt-1 accent-[#6F4D34]"
                  />
                  <span className="text-xs text-gray-500 leading-tight">
                    I agree to the storage and handling of my data by Artsays.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#6F4D34] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:bg-[#5a3e2a] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // IF NO JOB ID - SHOW "LIFE AT ARTSAYS" SECTION
  const section3 = careersPage?.section3;
  return (
    <div className="max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {section3?.heading || "Life at ArtSays"}
          </h2>
          <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full" />
        </div>
        <p className="text-lg text-gray-600 leading-relaxed max-w-4xl font-medium">
          {section3?.description || "At Artsays, we’re more than just a team — we’re a creative family."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 order-2 lg:order-1">
          {section3?.cards?.map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl">
                <img
                  src={card.image ? `${base}/${card.image}` : "/placeholder.png"}
                  alt={card.text}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors leading-tight">
                {card.text}
              </h3>
            </div>
          ))}
        </div>

        <div className="order-1 lg:order-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
          <img
            src={section3?.sectionImage ? `${base}/${section3.sectionImage}` : "/herosectionimg/lifeAt.svg"}
            alt="Life At Artsays"
            className="max-w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </div>
  );
};

const LifeAtArtsaysSkeleton = () => (
  <div className="w-full space-y-8 animate-pulse">
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
      <div className="space-y-3">
        <div className="h-9 w-48 bg-gray-100 rounded-lg" />
        <div className="w-20 h-1.5 bg-gray-100 rounded-full" />
      </div>
      <div className="h-4 w-full bg-gray-100 rounded-lg" />
      <div className="h-4 w-3/4 bg-gray-100 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-4" />
            <div className="h-4 w-16 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 h-96 bg-gray-100" />
    </div>
  </div>
);

export default LifeAtArtsays;
