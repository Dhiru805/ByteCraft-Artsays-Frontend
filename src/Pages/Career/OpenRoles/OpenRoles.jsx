import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Search, Briefcase } from "lucide-react";
import getAPI from "../../../api/getAPI";

const OpenRoles = ({ searchTerm = "" }) => {
  const [jobs, setJobs] = useState([]);
  const [careersPage, setCareersPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOpenJobs = async () => {
    try {
      const response = await getAPI("/api/get-career");
      if (response?.data) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching open jobs:", error);
    }
  };

  const fetchCareersCMS = async () => {
    try {
      const res = await getAPI("/api/career-CMS/published");
      if (res?.data?.data) {
        setCareersPage(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load careers CMS:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenJobs();
    fetchCareersCMS();
  }, []);

  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const section2 = careersPage?.section2;

  const filteredJobs = jobs.filter((job) =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <OpenRolesSkeleton />;

  return (
    <div className="max-w-[1440px] mx-auto space-y-8">
      {/* Section Header */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {section2?.heading || "Open Roles"}
            </h2>
            <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full" />
          </div>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
          {section2?.description ||
            "Join our mission to empower artists worldwide. Discover the right role for you."}
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-4 py-1.5 bg-[#6F4D34]/5 text-[#6F4D34] text-xs font-bold uppercase tracking-wider rounded-full">
                  {job.category}
                </span>
                <Briefcase size={20} className="text-gray-300 group-hover:text-[#6F4D34] transition-colors" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#6F4D34] transition-colors">
                {job.jobTitle}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                {job.summary}
              </p>

              <button
                onClick={() => navigate(`/careers/${slugify(job.jobTitle)}-${job._id}`)}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#6F4D34] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-[#5a3e2a] transition-all active:scale-95 group/btn"
              >
                Apply Now
                <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No matching roles found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const OpenRolesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
        <div className="h-6 w-24 bg-gray-100 rounded-full mb-4" />
        <div className="h-7 w-3/4 bg-gray-100 rounded-lg mb-3" />
        <div className="h-4 w-full bg-gray-100 rounded-lg mb-2" />
        <div className="h-4 w-[90%] bg-gray-100 rounded-lg mb-6" />
        <div className="h-12 w-full bg-gray-100 rounded-2xl" />
      </div>
    ))}
  </div>
);

export default OpenRoles;
