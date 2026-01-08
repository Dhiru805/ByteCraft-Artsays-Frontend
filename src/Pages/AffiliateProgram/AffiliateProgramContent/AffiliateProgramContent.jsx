import React, { useState, useEffect } from "react";
import { Search, ChevronRight, Info, MessageCircle, HelpCircle, Layout, Users, TrendingUp, Gift, DollarSign } from "lucide-react";
import axiosInstance from "../../../api/axiosConfig";
import "../../store/products/product.css";

const AffiliateContent = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

    useEffect(() => {
        const fetchPublishedPage = async () => {
            try {
                const res = await axiosInstance.get("/api/affiliate/published");
                if (res.data.success && res.data.data) {
                    setPageData(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching Affiliate page:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPublishedPage();
    }, []);

    if (loading) return (
        <div className="w-full bg-gray-50 min-h-screen p-4">
            <div className="max-w-[1440px] mx-auto">
                {PageSkeleton()}
            </div>
        </div>
    );

    if (!pageData) return (
        <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center">
            <p className="text-xl font-bold text-gray-500">No content found</p>
        </div>
    );

    const filteredArticles = pageData.articles?.filter((a) =>
        a.articleHeading.toLowerCase().includes(searchTerm.toLowerCase())
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
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Affiliate Info</h2>
                                <nav className="flex items-center text-sm text-gray-500 mt-2">
                                    <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
                                    <ChevronRight size={14} className="mx-2" />
                                    <span className="text-[#6F4D34] font-medium">Affiliate Program</span>
                                </nav>
                            </div>

                            <SidebarCard title="Why Join?" icon={TrendingUp}>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Earn competitive commissions while promoting high-quality, authentic artwork to your audience.
                                </p>
                            </SidebarCard>

                            <SidebarCard title="Support" icon={HelpCircle}>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                                        <span className="text-sm font-semibold">Affiliate FAQ</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                                        <span className="text-sm font-semibold">Contact Partner Team</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </SidebarCard>

                            <div className="bg-[#6F4D34] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Become a Partner</h3>
                                    <p className="text-sm opacity-90 mb-4">Start earning rewards today.</p>
                                    <button className="w-full py-3 bg-white text-[#6F4D34] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                                        Join Now
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
                                    placeholder="Search affiliate topics..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                    {pageData.webpageHeading}
                                </h1>
                                <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
                                <p className="text-lg text-gray-600 leading-relaxed max-w-4xl font-medium">
                                    {pageData.webpageDescription}
                                </p>
                            </div>
                        </div>

                        {/* Articles */}
                        <div className="space-y-8">
                            {filteredArticles.length > 0 ? (
                                filteredArticles.map((article, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col lg:flex-row gap-8 items-center bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-xl group ${
                                            index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                        }`}
                                    >
                                        {article.bannerImage && (
                                            <div className="w-full lg:w-2/5 aspect-square lg:aspect-[4/3] overflow-hidden rounded-2xl bg-gray-50">
                                                <img
                                                    src={`${imageBaseURL}/${article.bannerImage}`}
                                                    alt={article.articleHeading}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 p-4"
                                                />
                                            </div>
                                        )}

                                        <div className="w-full lg:w-3/5 space-y-4">
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
                                                {article.articleHeading}
                                            </h2>
                                            <div className="w-12 h-1 bg-[#6F4D34]/20 rounded-full" />
                                            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                                                {article.articleContent}
                                            </p>

                                            {article.buttonName && article.buttonPath && (
                                                <div className="pt-4">
                                                    <a href={article.buttonPath} target="_blank" rel="noopener noreferrer">
                                                        <button className="px-8 py-3 bg-[#6F4D34] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-[#5a3e2a] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 group/btn">
                                                            {article.buttonName}
                                                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                    </a>
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
                                    <h3 className="text-xl font-bold text-gray-900">No matching articles found</h3>
                                    <p className="text-gray-500 mt-2">Try searching for something else.</p>
                                </div>
                            )}
                        </div>

                        {/* Cards Section */}
                        {pageData.cards?.length > 0 && (
                            <div className="pt-12 pb-8 space-y-8">
                                <div className="text-center space-y-4">
                                    {pageData.cardsHeading && (
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                                            {pageData.cardsHeading}
                                        </h2>
                                    )}
                                    <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mx-auto" />
                                    {pageData.cardsDescription && (
                                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium">
                                            {pageData.cardsDescription}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {pageData.cards.map((card, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col items-center text-center"
                                        >
                                            <div className="w-full aspect-square mb-6 overflow-hidden rounded-2xl bg-gray-50 p-6">
                                                <img
                                                    src={`${imageBaseURL}/${card.cardImage}`}
                                                    alt={card.cardTitle}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors px-2">
                                                {card.cardTitle}
                                            </h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AffiliateContent;

const PageSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 py-8">
            <aside className="w-full lg:w-[300px] space-y-4">
                <div className="h-32 bg-white rounded-2xl animate-pulse" />
                <div className="h-40 bg-white rounded-2xl animate-pulse" />
                <div className="h-40 bg-white rounded-2xl animate-pulse" />
            </aside>
            <main className="flex-grow space-y-6">
                <div className="h-16 bg-white rounded-2xl animate-pulse" />
                <div className="h-48 bg-white rounded-2xl animate-pulse" />
                <div className="h-64 bg-white rounded-[32px] animate-pulse" />
                <div className="h-64 bg-white rounded-[32px] animate-pulse" />
            </main>
        </div>
    );
};
