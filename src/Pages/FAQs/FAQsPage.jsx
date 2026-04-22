import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Plus, Minus, Search, Tag, ChevronRight, Info, HelpCircle } from "lucide-react";
import axiosInstance from "../../api/axiosConfig";

const FAQsPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [faqTypes, setFaqTypes] = useState([]);
  const [activeType, setActiveType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axiosInstance.get("/api/get-FAQ");
        if (!response.data.hasError && Array.isArray(response.data.data)) {
          setFaqs(response.data.data);
          const types = [...new Set(response.data.data.map((faq) => faq.faqType))];
          setFaqTypes(types);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesType = activeType === "All" || faq.faqType === activeType;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      (faq.keywords && faq.keywords.some((k) => k.toLowerCase().includes(query)));
    return matchesType && matchesSearch;
  });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const SidebarCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Icon size={18} className="text-[#6F4D34]" />
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  return (
    <div className="w-full font-[poppins]">
      <Helmet>
        <title>FAQs | Artsays</title>
        <script type="application/ld+json">
          {JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://artsays.in/" }, { "@type": "ListItem", "position": 2, "name": "FAQs", "item": "https://artsays.in/faqs" }] })}
        </script>
      </Helmet>
      {/* Hero Section */}
      <div className="relative w-full h-[300px] sm:h-[250px] md:h-[300px] overflow-hidden flex items-center justify-center">
        <img
          src="/banners/commission.png"
          alt="FAQ Hero"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/90 to-transparent flex items-center">
          <div className="container mx-auto px-6 md:px-12 max-w-[1440px]">
            <div className="w-full">
              <span className="inline-block px-3 py-1 bg-white text-[#000000] backdrop-blur-md rounded-full text-[10px] md:text-sm font-bold tracking-widest uppercase mb-4 animate-fade-in">
                Help Center
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 text-white leading-tight drop-shadow-lg">
                Frequently Asked Questions
              </h1>
              <p className="text-sm sm:text-lg md:text-xl font-medium text-white leading-relaxed opacity-90 line-clamp-3 md:line-clamp-none">
                Find answers to your questions about our platform, services, and policies.
              </p>
            </div>
          </div>
        </div>
      </div>
      <nav aria-label="breadcrumb" className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center gap-2 text-sm text-gray-500 py-3">
        <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
        <ChevronRight size={14} />
        <span className="text-[#6F4D34] font-semibold" aria-current="page">FAQs</span>
      </nav>

      {/* Content */}
      <div className="w-full bg-gray-50 min-h-screen font-[poppins] py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-[300px] shrink-0">
              <div className="sticky top-6 space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">FAQ Categories</h2>
                  <nav className="flex items-center text-sm text-gray-500 mt-2">
                    <Link to="/" className="hover:text-[#6F4D34] transition-colors">Home</Link>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="text-[#6F4D34] font-medium">FAQs</span>
                  </nav>
                </div>

                {/* FAQ Type Navigation */}
                {faqTypes.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Info size={18} className="text-[#6F4D34]" />
                      Browse by Type
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => { setActiveType("All"); setOpenIndex(null); }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl focus:outline-none text-sm font-semibold transition-all ${
                          activeType === "All"
                            ? "bg-[#6F4D34] text-white shadow-md"
                            : "bg-gray-50 text-gray-700 hover:bg-[#6F4D34]/5 hover:text-[#6F4D34]"
                        }`}
                      >
                        <span>All Categories</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activeType === "All" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                        }`}>
                          {faqs.length}
                        </span>
                      </button>
                      {faqTypes.map((type) => {
                        const count = faqs.filter((f) => f.faqType === type).length;
                        return (
                          <button
                            key={type}
                            onClick={() => { setActiveType(type); setOpenIndex(null); }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl focus:outline-none text-sm font-semibold transition-all ${
                              activeType === type
                                ? "bg-[#6F4D34] text-white shadow-md"
                                : "bg-gray-50 text-gray-700 hover:bg-[#6F4D34]/5 hover:text-[#6F4D34]"
                            }`}
                          >
                            <span>{type}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              activeType === type ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <SidebarCard title="Need Help?" icon={HelpCircle}>
                  <div className="space-y-3">
                    <Link to="/contact-us" className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                      <span className="text-sm font-semibold">Contact Support</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/track-your-order" className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#6F4D34]/5 text-gray-700 hover:text-[#6F4D34] transition-all group">
                      <span className="text-sm font-semibold">Track Your Order</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </SidebarCard>

                <div className="bg-[#6F4D34] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Still Have Questions?</h3>
                    <p className="text-sm opacity-90 mb-4">Can't find what you're looking for? Reach out to us.</p>
                    <Link to="/contact-us">
                      <button className="w-full py-3 bg-white text-[#6F4D34] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                        Contact Us
                      </button>
                    </Link>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow space-y-3">
              {/* Search */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search questions, answers, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
                />
              </div>

              {/* Header */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  {activeType === "All" ? "All Questions" : activeType}
                </h1>
                <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                  {activeType === "All"
                    ? "Browse through our frequently asked questions to find the answers you need."
                    : `Showing all questions related to "${activeType}".`}
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-[#6F4D34] rounded-full animate-spin"></div>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredFaqs.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No FAQs found</h3>
                  <p className="text-gray-500 mt-2">Try searching for something else or select a different category.</p>
                </div>
              )}

                {/* FAQ Accordion List */}
                {!loading && filteredFaqs.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                    {filteredFaqs.map((faq, index) => {
                      const isOpen = openIndex === index;
                      return (
                        <div key={faq._id || index} className="transition-colors duration-200">
                          <button
                            onClick={() => toggleAccordion(index)}
                            className={`w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left focus:outline-none transition-colors duration-200 ${
                              isOpen ? "bg-[#6F4D34]/[0.03]" : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isOpen ? "bg-[#6F4D34] text-white" : "bg-gray-100 text-gray-500"
                              }`}>
                                {index + 1}
                              </span>
                              <span className={`text-sm md:text-[15px] font-semibold leading-snug ${isOpen ? "text-[#6F4D34]" : "text-gray-800"}`}>
                                {faq.question}
                              </span>
                            </div>
                            <span
                              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isOpen
                                  ? "bg-[#6F4D34] text-white"
                                  : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                              }`}
                            >
                              {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </span>
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="px-5 md:px-6 pb-4 pl-[52px] md:pl-[60px]">
                              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line pt-3">
                                {faq.answer}
                              </p>

                              {faq.keywords && faq.keywords.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-dashed border-gray-200">
                                  <Tag className="w-3 h-3 text-gray-400 mr-0.5" />
                                  {faq.keywords.map((keyword, kIndex) => (
                                    <span
                                      key={kIndex}
                                      className="inline-block px-2.5 py-0.5 bg-[#6F4D34]/5 text-[#6F4D34] rounded-full text-[11px] font-medium"
                                    >
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
