import React, { useState, useEffect } from "react";
import { ChevronRight, HelpCircle, Star } from "lucide-react";
import axiosInstance from "../../api/axiosConfig";
import InsuranceContentSkeliton from "../../Component/Skeleton/Home/Account/InsuranceContentSkeliton";
import "../store/products/product.css";
import { getImageUrl } from '../../utils/getImageUrl';

const InsuranceContent = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPublishedPage = async () => {
            try {
                const res = await axiosInstance.get("/api/insurance/published");
                if (res.data.success && res.data.data) {
                    setPageData(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching Insurance page:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPublishedPage();
    }, []);

    if (loading) return (
        <div className="w-full bg-gray-50 min-h-screen p-4">
            <div className="max-w-[1440px] mx-auto">
                <InsuranceContentSkeliton />
            </div>
        </div>
    );

    if (!pageData) return (
        <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center">
            <p className="text-xl font-bold text-gray-500">No content found</p>
        </div>
    );

    const filteredCards = (pageData.section1Cards || []).filter((card) =>
        (card.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.description || "").toLowerCase().includes(searchTerm.toLowerCase())
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
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Insurance Info</h2>
                                <nav className="flex items-center text-sm text-gray-500 mt-2">
                                    <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
                                    <ChevronRight size={14} className="mx-2" />
                                    <span className="text-[#6F4D34] font-medium">Insurance</span>
                                </nav>
                            </div>

                            <SidebarCard title="How to Get?" icon={HelpCircle}>
                                <div className="space-y-3">
                                    {(pageData.section2Cards || []).map((card, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                            <p className="text-sm font-bold text-gray-900 mb-1">{card.title}</p>
                                            <p className="text-xs text-gray-600 leading-relaxed">{card.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </SidebarCard>

                            <div className="bg-[#6F4D34] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Get Insured Now</h3>
                                    <p className="text-sm opacity-90 mb-4">Secure your masterpieces with Artsays protection.</p>
                                    <button className="w-full py-3 bg-white text-[#6F4D34] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                                        View Plans
                                    </button>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-grow space-y-6">
                        {/* Search and Header */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search insurance topics..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
                                />
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                    {pageData.section1Heading}
                                </h1>
                                <div className="w-24 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl">
                                    {pageData.section1Description}
                                </p>
                            </div>
                        </div>

                        {/* Why Insurance (Section 1 Cards) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredCards.map((card, index) => (
                                <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                                    {card.image && (
                                        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4">
                                            <img 
                                                src={getImageUrl(card.image)} 
                                                alt={card.title} 
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#6F4D34] transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Insurance Plans (Section 3) */}
                        <div className="space-y-6 pt-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm mb-4 border border-gray-100">
                                <h2 className="text-3xl font-bold text-gray-900">{pageData.section3Heading}</h2>
                                <div className="w-24 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
                                <p className="text-gray-600">{pageData.section3Description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(pageData.section3Cards || []).map((card, index) => (
                                    <div key={index} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-extrabold text-gray-900 mb-2">{card.heading}</h3>
                                            <p className="text-sm text-gray-500">{card.description}</p>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-[#6F4D34]">{card.price}</span>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.cancelCondition}</p>
                                        </div>

                                        <div className="flex-grow space-y-4 mb-8">
                                            <p className="text-sm font-bold text-gray-700 italic border-l-4 border-[#6F4D34] pl-3">
                                                {card.eligibility}
                                            </p>
                                            <div className="space-y-3">
                                                {(card.pointers || []).map((point, pIdx) => (
                                                    <div key={pIdx} className="flex items-start gap-3">
                                                        <div className="mt-1 w-5 h-5 rounded-full bg-[#6F4D34]/10 flex items-center justify-center shrink-0">
                                                            <Star size={10} className="text-[#6F4D34] fill-[#6F4D34]" />
                                                        </div>
                                                        <span className="text-sm text-gray-600">{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => card.buttonLink && window.open(card.buttonLink, '_blank')}
                                            className="w-full py-4 bg-[#6F4D34] text-white rounded-2xl font-bold hover:bg-[#5a3e2a] transition-all shadow-lg shadow-[#6F4D34]/20 active:scale-[0.98]"
                                        >
                                            {card.buttonName || "Get Started"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default InsuranceContent;
