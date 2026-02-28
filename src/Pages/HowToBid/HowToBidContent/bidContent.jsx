import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { Search, ChevronRight, HelpCircle, Gavel } from "lucide-react";
=======
import { Search, ChevronRight, Info, HelpCircle, Gavel } from "lucide-react";
>>>>>>> 19f2e96d4d8e2d03c71436e644200f6cb02386e1
import axiosInstance from "../../../api/axiosConfig";
import CommissionContentSkeliton from "../../../Component/Skeleton/Home/Account/CommissionContentSkeliton";
import "../../store/products/product.css";

const HowToBidContent = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

    useEffect(() => {
        const fetchPublishedPage = async () => {
            try {
                const res = await axiosInstance.get("/api/how-to-bid/published");
                if (res.data.success && res.data.data) {
                    setPageData(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching How to Bid page:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPublishedPage();
    }, []);

    if (loading) return (
        <div className="w-full bg-gray-50 min-h-screen p-4">
            <div className="max-w-[1440px] mx-auto">
                <CommissionContentSkeliton />
            </div>
        </div>
    );

    if (!pageData) return (
        <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center">
            <p className="text-xl font-bold text-gray-500">No content found</p>
        </div>
    );

    const filteredArticles = pageData.articles.filter((article) =>
        article.articleHeading.toLowerCase().includes(searchTerm.toLowerCase())
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
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Bidding Info</h2>
                                <nav className="flex items-center text-sm text-gray-500 mt-2">
                                    <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
                                    <ChevronRight size={14} className="mx-2" />
                                    <span className="text-[#6F4D34] font-medium">How to Bid</span>
                                </nav>
                            </div>

                            <SidebarCard title="Bidding Rules" icon={Gavel}>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Fair play is at the heart of Artsays. Ensure you understand the bidding increments and timelines before participating.
                                </p>
                            </SidebarCard>

                            <SidebarCard title="Need Help?" icon={HelpCircle}>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                                        <span className="text-sm font-semibold">Contact Support</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                                        <span className="text-sm font-semibold">Bidding FAQ</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </SidebarCard>

                            <div className="bg-[#6F4D34] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Ready to Win?</h3>
                                    <p className="text-sm opacity-90 mb-4">Check out our latest live auctions.</p>
                                    <a href="/store">
                                        <button className="w-full py-3 bg-white text-[#6F4D34] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                                            Go to Store
                                        </button>
                                    </a>
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
                                    placeholder="Search bidding topics..."
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
                                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                                    {pageData.webpageDescription}
                                </p>
                            </div>
                        </div>

                        {/* Articles */}
                        <div className="space-y-12">
                            {filteredArticles.length > 0 ? (
                                filteredArticles.map((article, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col lg:flex-row gap-6 items-center bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-xl group ${
                                            index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                        }`}
                                    >
                                        {article.bannerImage && (
                                            <div className="w-full lg:w-2/5 aspect-[4/3] overflow-hidden rounded-2xl">
                                                <img
                                                    src={`${imageBaseURL}/${article.bannerImage}`}
                                                    alt={article.articleHeading}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                        )}

                                        <div className="w-full lg:w-3/5 space-y-3">
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
                                                {article.articleHeading}
                                            </h2>
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
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HowToBidContent;
