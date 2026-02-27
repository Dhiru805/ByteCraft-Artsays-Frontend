import React, { useState, useEffect } from "react";
import { Search, ChevronRight, Info, HelpCircle } from "lucide-react";
import axiosInstance from "../../../api/axiosConfig";
import PartnerContentSkeliton from "../../../Component/Skeleton/Home/Account/PartnerContentSkeliton";
import PartnerTypes from "../PartnerTypes/PartnerTypes";
import SuccessPartner from "../SuccessPartner/SuccessPartner";
import HowToPartner from "../HowToPartner/HowToPartner";

const PartnerContent = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPartnerData = async () => {
            try {
                const res = await axiosInstance.get("/api/partner");
                if (res.data.success && res.data.data) {
                    const data = Array.isArray(res.data.data)
                        ? res.data.data.find((p) => p.status === "published") || res.data.data[0]
                        : res.data.data;
                    setPageData(data);
                }
            } catch (error) {
                console.error("Error fetching Partner page:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPartnerData();
    }, []);

    if (loading) return (
        <div className="w-full bg-gray-50 min-h-screen p-4">
            <div className="max-w-[1440px] mx-auto">
                <PartnerContentSkeliton />
            </div>
        </div>
    );

    if (!pageData) return (
        <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center">
            <p className="text-xl font-bold text-gray-500">No content found</p>
        </div>
    );

    const SidebarCard = ({ title, icon: Icon, children }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Icon size={18} className="text-[#6F4D34]" />
                {title}
            </h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );

    return (
        <div className="w-full bg-gray-50 min-h-screen font-[poppins] py-8">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar */}
                    <aside className="w-full lg:w-[300px] shrink-0">
                        <div className="sticky top-6 space-y-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Partner Info</h2>
                                <nav className="flex items-center text-sm text-gray-500 mt-2">
                                    <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
                                    <ChevronRight size={14} className="mx-2" />
                                    <span className="text-[#6F4D34] font-medium">Partner</span>
                                </nav>
                            </div>

                            <SidebarCard title="Why Partner?" icon={Info}>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Partnering with Artsays connects you with a global community of artists and art enthusiasts, fostering creativity and mutual growth.
                                </p>
                            </SidebarCard>

                            <SidebarCard title="Need Help?" icon={HelpCircle}>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                                        <span className="text-sm font-semibold">Contact Support</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                                        <span className="text-sm font-semibold">Partnership Guide</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </SidebarCard>

                            <div className="bg-[#6F4D34] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Ready to Partner?</h3>
                                    <p className="text-sm opacity-90 mb-4">Start your journey with us today.</p>
                                    <button 
                                        onClick={() => {
                                            if (pageData.buttonLink) {
                                                window.location.href = pageData.buttonLink;
                                            }
                                        }}
                                        className="w-full py-3 bg-white text-[#6F4D34] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                                    >
                                        Join Now
                                    </button>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-grow space-y-3">
                        {/* Search and Header */}
                        <div className="space-y-3">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search partnership types..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                    {pageData.mainHeading || "Partner with Artsays"}
                                </h1>
                                <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
                                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                                    {pageData.mainDescription || "Let’s create meaningful experiences together."}
                                </p>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-6">
                            <PartnerTypes searchTerm={searchTerm} />
                            <SuccessPartner />
                            <HowToPartner />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PartnerContent;
