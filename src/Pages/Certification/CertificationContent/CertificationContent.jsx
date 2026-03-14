import React, { useState, useEffect } from "react";
import { Search, ChevronRight, HelpCircle, Shield, Award, CheckCircle2, FileCheck } from "lucide-react";
import getAPI from "../../../api/getAPI";
import CertificationSkeleton from "../../../Component/Skeleton/CertificationSkeleton";
import "../../store/products/product.css";

const CertificationContent = () => {
    const [pageData, setPageData] = useState(null);
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const imageBaseURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [publishedRes, settingsRes] = await Promise.all([
                    getAPI("/api/certificate/published"),
                    getAPI("/api/get-certification-setting")
                ]);

                if (publishedRes.data && publishedRes.data.data) {
                    setPageData(publishedRes.data.data);
                }

                if (settingsRes.data && settingsRes.data.data) {
                    const names = settingsRes.data.data
                        .map((item) => item.certificationName)
                        .filter(Boolean);
                    setCertifications(names);
                }
            } catch (error) {
                console.error("Error fetching Certification data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="w-full bg-gray-50 min-h-screen p-4">
            <div className="max-w-[1440px] mx-auto">
                <CertificationSkeleton />
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

    // Filter cards from section 2 (Path) based on search term
    const pathCards = pageData.section2?.cards || [];
    const filteredPathCards = pathCards.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fallbackCertifications = [
        "Certificate of Authenticity",
        "Certificate of Ownership",
        "Artist Verification",
        "Provenance Certificate",
    ];
    const itemsToRender = certifications.length > 0 ? certifications : fallbackCertifications;

    return (
        <div className="w-full bg-gray-50 min-h-screen font-[poppins] py-8">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="w-full lg:w-[300px] shrink-0">
                        <div className="sticky top-6 space-y-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Certification Info</h2>
                                <nav className="flex items-center text-sm text-gray-500 mt-2">
                                    <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
                                    <ChevronRight size={14} className="mx-2" />
                                    <span className="text-[#6F4D34] font-medium">Certification</span>
                                </nav>
                            </div>

                            <SidebarCard title="Why Certify?" icon={Shield}>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Certification ensures the provenance and authenticity of your artwork, protecting your investment and reputation as a collector or artist.
                                </p>
                            </SidebarCard>

                            <SidebarCard title="Available Types" icon={Award}>
                                <div className="flex flex-wrap gap-2">
                                    {itemsToRender.slice(0, 4).map((name, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-semibold text-gray-600 border border-gray-200">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </SidebarCard>

                            <SidebarCard title="Support" icon={HelpCircle}>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                                        <span className="text-sm font-semibold">Verification Help</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </SidebarCard>

                            <div className="bg-[#6F4D34] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Get Certified</h3>
                                    <p className="text-sm opacity-90 mb-4">Protect your masterpiece today.</p>
                                    <a href={pageData.buttonLink || "#"} target="_blank" rel="noopener noreferrer">
                                        <button className="w-full py-3 bg-white text-[#6F4D34] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                                            {pageData.buttonName || "Apply Now"}
                                        </button>
                                    </a>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-grow min-w-0 space-y-8">
                        {/* Search and Header */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search certification steps..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
                                />
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                    {pageData.webpageHeading || "Certification"}
                                </h1>
                                <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                                    {pageData.webpageDescription || "Showcase authenticity and build trust with verified certifications."}
                                </p>
                            </div>
                        </div>

                        {/* Verified Certificates Section */}
                        <div className="space-y-6 overflow-hidden">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#6F4D34]/10 rounded-xl flex items-center justify-center">
                                        <Award className="text-[#6F4D34]" size={24} />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                                        Verified Certificates
                                    </h2>
                                </div>
                                <div className="hidden md:block h-px flex-grow mx-8 bg-gray-100" />
                            </div>

                            <div
                                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6
                scrollbar-hide [scrollbar-width:none]"
                            >
                                {itemsToRender.map((name, index) => (
                                    <div
                                        key={index}
                                        className="snap-center shrink-0
                        w-[85%] sm:w-[48%] lg:w-[23%]
                        group relative bg-white p-8 rounded-[32px]
                        border border-gray-100 shadow-sm
                        hover:shadow-2xl hover:-translate-y-2
                        transition-all duration-500
                        flex flex-col items-center text-center overflow-hidden"
                                    >
                                        {/* Premium Background Pattern */}
                                        <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                            <svg className="w-full h-full" viewBox="0 0 60 60">
                                                <pattern
                                                    id={`cert-pattern-${index}`}
                                                    x="0"
                                                    y="0"
                                                    width="20"
                                                    height="20"
                                                    patternUnits="userSpaceOnUse"
                                                >
                                                    <path
                                                        d="M10 0 L20 10 L10 20 L0 10 Z"
                                                        fill="none"
                                                        stroke="#6F4D34"
                                                        strokeWidth="0.5"
                                                    />
                                                </pattern>
                                                <rect
                                                    width="60"
                                                    height="60"
                                                    fill={`url(#cert-pattern-${index})`}
                                                />
                                            </svg>
                                        </div>

                                        {/* Seal/Icon Container */}
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-[#6F4D34]/10 rounded-full scale-150 blur-2xl group-hover:bg-[#6F4D34]/20 transition-all duration-500" />
                                            <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-50 group-hover:border-[#6F4D34]/20 transition-all duration-500">
                                                <Shield
                                                    size={32}
                                                    className="text-[#6F4D34] group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Verified Check */}
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                                                <CheckCircle2 size={12} strokeWidth={3} />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="relative z-10 font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors text-base md:text-lg leading-tight mb-4">
                                            {name}
                                        </h3>

                                        {/* Badge */}
                                        <div className="relative z-10 mt-auto flex items-center gap-2 px-5 py-2 rounded-full bg-gray-50 text-[#6F4D34]
                        hover:!text-white text-[10px] font-bold uppercase tracking-[0.15em]
                        border border-gray-100
                        group-hover:bg-[#6F4D34]
                        group-hover:text-[#ffffff]
                        group-hover:border-[#6F4D34]
                        transition-all duration-300">
                                            <span>Official Seal</span>
                                        </div>

                                        {/* Decorative Side Accent */}
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#6F4D34]/20 rounded-r-full group-hover:h-20 transition-all duration-500" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits Section (Grid) */}
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                                        {pageData.section1Heading || "Benefits of Certification"}
                                    </h2>
                                    <p className="text-gray-500 mt-1">{pageData.section1Description || "Ultimate protection for your masterpieces"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(pageData.section1?.cards || []).map((card, index) => (
                                    <div key={index} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center group">
                                        <div className="mb-6 flex justify-center">
                                            {card.image ? (
                                                <img
                                                    src={card.image.startsWith("http") ? card.image : `${imageBaseURL}/${card.image}`}
                                                    alt={card.title}
                                                    className="h-24 object-contain group-hover:scale-110 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-[#6F4D34]/5 rounded-2xl flex items-center justify-center text-[#6F4D34]">
                                                    <CheckCircle2 size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Path Section (Redesigned as Alternating Articles like Commission) */}
                        <div className="space-y-12">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
                                    {pageData.section2Heading || "Your Path to Certification"}
                                </h2>
                                <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
                                <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed">
                                    {pageData?.section2Description ||
                                        "Showcase authenticity and build trust with verified certifications."}
                                </p>
                            </div>

                            <div className="space-y-12">
                                {filteredPathCards.length > 0 ? (
                                    filteredPathCards.map((card, index) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col lg:flex-row gap-8 items-center bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-xl group ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                                }`}
                                        >
                                            {/* Visual Container */}
                                            <div className="w-full lg:w-2/5 aspect-[4/3] overflow-hidden rounded-2xl flex items-center justify-center">
                                                {card.image ? (
                                                    <img
                                                        src={`${imageBaseURL}/${card.image}`}
                                                        alt={card.title}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-[24px]">
                                                        <FileCheck size={64} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="w-full lg:w-3/5 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#6F4D34]/10 text-[#6F4D34] font-bold text-sm">
                                                        {index + 1}
                                                    </span>
                                                    <div className="h-px flex-grow bg-gray-100" />
                                                </div>

                                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors leading-tight">
                                                    {card.title}
                                                </h3>
                                                <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                                                    {card.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                                        <Search size={32} className="text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900">No matching steps found</h3>
                                        <p className="text-gray-500 mt-2">Try searching for something else.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Example Showcase Section */}
                        <div className="bg-[#6F4D34] rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden">
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                                        {pageData.certificateSection?.heading || "How Your Certificate Will Shine"}
                                    </h2>
                                    <p className="text-white/80 text-lg md:text-xl font-medium">
                                        {pageData.certificateSection?.description || "A glimpse of what your verified certificate will look like."}
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                                            <CheckCircle2 size={18} />
                                            <span className="text-sm font-semibold">QR Verified</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                                            <Shield size={18} />
                                            <span className="text-sm font-semibold">Tamper Proof</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white backdrop-blur-sm rounded-[32px] p-3 border border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                                    {pageData.certificateSection?.image ? (
                                        <img
                                            src={`${imageBaseURL}/${pageData.certificateSection.image}`}
                                            alt="Certificate Preview"
                                            className="w-full h-auto rounded-xl shadow-2xl"
                                        />
                                    ) : (
                                        <img src="/herosectionimg/certificate.svg" alt="Certificate Placeholder" className="w-full h-auto" />
                                    )}
                                </div>
                            </div>
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CertificationContent;
