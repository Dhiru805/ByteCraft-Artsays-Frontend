import React, { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";
import { ChevronRight, ListFilter, X, FileText } from "lucide-react";
import { PolicySidebarSkeleton } from "../../../Component/Skeleton/PolicySkeleton";

const AgreementSidebar = ({ selectedAgreementId, onSelect }) => {
  const [agreements, setAgreements] = useState([]);
  const [activeAgreementId, setActiveAgreementId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgreements = async () => {
      setLoading(true);
      try {
        const res = await getAPI("/api/getArtistSellerAgreements");
        if (!res.hasError && res.data.data) {
          const publishedAgreements = res.data.data.filter(
            (agreement) => agreement.status === "published"
          );
          setAgreements(publishedAgreements);

          if (publishedAgreements.length > 0) {
            const firstId = publishedAgreements[0]._id;
            if (!selectedAgreementId && !activeAgreementId) {
              setActiveAgreementId(firstId);
              onSelect(firstId);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching agreements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgreements();
  }, []);

  useEffect(() => {
    if (selectedAgreementId) {
      setActiveAgreementId(selectedAgreementId);
    }
  }, [selectedAgreementId]);

  const handleSelect = (id) => {
    setActiveAgreementId(id);
    onSelect(id);
    setShowFilters(false);
  };

  const renderAgreementList = () => {
    if (loading) return <PolicySidebarSkeleton />;

    return agreements.length === 0 ? (
      <p className="text-gray-500 text-sm italic p-4">No agreements available.</p>
    ) : (
      <div className="space-y-2">
        {agreements.map((agreement) => (
          <button
            key={agreement._id}
            className={`w-full flex items-center justify-between p-3 rounded-xl focus:outline-none transition-all duration-300 border ${
              activeAgreementId === agreement._id
                ? "bg-[#6F4D34] text-white border-[#6F4D34] shadow-md"
                : "bg-gray-50 text-gray-700 border-gray-100 hover:bg-white hover:shadow-md hover:border-[#6F4D34]/30"
            }`}
            onClick={() => handleSelect(agreement._id)}
          >
            <span
              className={`font-bold text-sm tracking-tight ${
                activeAgreementId === agreement._id ? "text-white" : "text-gray-700"
              }`}
            >
              {agreement.title}
            </span>
            <ChevronRight
              size={16}
              className={`transition-transform duration-300 ${
                activeAgreementId === agreement._id
                  ? "text-white translate-x-1"
                  : "text-gray-400"
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
              <FileText size={20} className="text-[#6F4D34]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Agreements</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Artist &amp; Seller platform agreements
          </p>
          <div className="border-t border-gray-100 pt-6">{renderAgreementList()}</div>
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
            {showFilters ? "Hide Agreement List" : "List of Agreements"}
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
                  <FileText size={20} className="text-[#6F4D34]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Agreements</h2>
              </div>
              <p className="text-sm text-gray-500 mb-8 px-1">
                Select an agreement to read
              </p>

              <div className="space-y-2">{renderAgreementList()}</div>

              <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Last updated: January 2026
                  <br />
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

export default AgreementSidebar;
