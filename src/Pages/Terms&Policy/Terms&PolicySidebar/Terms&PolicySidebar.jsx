import React, { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";
import { ChevronRight, ListFilter, X, Shield } from "lucide-react";
import { PolicySidebarSkeleton } from "../../../Component/Skeleton/PolicySkeleton";

const TermsPolicySidebar = ({ selectedPolicyId, onSelect }) => {
  const [policies, setPolicies] = useState([]);
  const [activePolicyId, setActivePolicyId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const res = await getAPI("/api/getPolicies");
        if (!res.hasError && res.data.data) {
          const publishedPolicies = res.data.data.filter(
            (policy) => policy.status === "published"
          );
          setPolicies(publishedPolicies);

          if (publishedPolicies.length > 0) {
            const firstId = publishedPolicies[0]._id;
            if (!selectedPolicyId && !activePolicyId) {
              setActivePolicyId(firstId);
              onSelect(firstId);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching policies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  useEffect(() => {
    if (selectedPolicyId) {
      setActivePolicyId(selectedPolicyId);
    }
  }, [selectedPolicyId]);

  const handleSelect = (id) => {
    setActivePolicyId(id);
    onSelect(id);
    setShowFilters(false);
  };

  const renderPolicyList = () => {
    if (loading) return <PolicySidebarSkeleton />;
    
    return policies.length === 0 ? (
      <p className="text-gray-500 text-sm italic p-4">No policies available.</p>
    ) : (
      <div className="space-y-2">
        {policies.map((policy) => (
          <button
            key={policy._id}
            className={`w-full flex items-center justify-between p-3 rounded-xl focus:outline-none transition-all duration-300 border ${
              activePolicyId === policy._id
                ? "bg-[#6F4D34] text-white border-[#6F4D34] shadow-md"
                : "bg-gray-50 text-gray-700 border-gray-100 hover:bg-white hover:shadow-md hover:border-[#6F4D34]/30"
            }`}
            onClick={() => handleSelect(policy._id)}
          >
            <span className={`font-bold text-sm tracking-tight ${activePolicyId === policy._id ? "text-white" : "text-gray-700"}`}>
              {policy.title}
            </span>
            <ChevronRight 
              size={16} 
              className={`transition-transform duration-300 ${
                activePolicyId === policy._id ? "text-white translate-x-1" : "text-gray-400"
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="font-[poppins]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block sticky top-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#6F4D34]/10 rounded-lg">
              <Shield size={20} className="text-[#6F4D34]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Legal & Policies</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">Important information about our platform</p>
          <div className="border-t border-gray-100 pt-6">
            {renderPolicyList()}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm font-bold text-[#6F4D34] transition-all active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <ListFilter size={20} />
            {showFilters ? "Hide Policy List" : "List of Policies"}
          </span>
          {showFilters ? <X size={20} /> : <ChevronRight size={20} />}
        </button>

        {showFilters && (
          <div className="fixed inset-0 z-[100] flex">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            ></div>

            {/* Sidebar */}
            <div className="relative bg-white w-80 max-w-[85%] h-full shadow-2xl p-6 overflow-y-auto animate-slide-in-left">
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-3 mt-2">
                <div className="p-2 bg-[#6F4D34]/10 rounded-lg">
                  <Shield size={20} className="text-[#6F4D34]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Policies</h2>
              </div>
              <p className="text-sm text-gray-500 mb-8 px-1">Select a document to read</p>
              
              <div className="space-y-2">
                {renderPolicyList()}
              </div>
              
              <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Last updated: January 2026<br/>
                  ArtSays Legal Department
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsPolicySidebar;
