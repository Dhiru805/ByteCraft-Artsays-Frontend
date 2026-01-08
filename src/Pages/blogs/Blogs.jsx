import { useState, useEffect } from "react";
import "./Blogs.css";
import { ListFilter, ChevronLeft, ChevronRight, Search, Clock, Tag, SortAsc, X } from "lucide-react";
import getAPI from "../../api/getAPI";

import mainImage from "../../assets/blogGrid/blog-grid-main.png";
import BlogCard from "./BlogCard";
import { BlogGridSkeleton } from "../../Component/Skeleton/Blog/BlogSkeleton";

function Blogs() {

    const [showFilters, setShowFilters] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [cmsData, setCmsData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSort, setSelectedSort] = useState("newest");
    const [search, setSearch] = useState("");
    const [selectedReadingTime, setSelectedReadingTime] = useState("");

    const ITEMS_PER_PAGE = 12;

    // ---------------- FETCH BLOGS ----------------
    const fetchBlogsData = async () => {
        setLoading(true);
        try {
            let url = "/Blog-Post/statusapproved-blogs";
            const params = new URLSearchParams();
            if (selectedCategory) params.append("category", selectedCategory);
            if (selectedSort) params.append("sort", selectedSort);
            if (search) params.append("search", search);
            if (selectedReadingTime) params.append("readingTime", selectedReadingTime);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await getAPI(url);
            if (response?.data?.blogs) {
                setBlogs(response.data.blogs);
                setTotalPages(Math.ceil(response.data.blogs.length / ITEMS_PER_PAGE));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- FETCH CATEGORIES ----------------
    const fetchCategories = async () => {
        try {
            const response = await getAPI("/api/getblogcategory");
            if (response?.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.log("Category Fetch Error:", error);
        }
    };

    // ---------------- FETCH CMS ----------------
    const fetchCMS = async () => {
        try {
            const response = await getAPI("/api/blog-CMS/published");
            if (response?.data?.data) {
                setCmsData(response.data.data);
            }
        } catch (error) {
            console.log("CMS Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetchBlogsData();
    }, [selectedCategory, selectedSort, search, selectedReadingTime]);

    useEffect(() => {
        fetchCMS();
        fetchCategories();
    }, []);

    // ---------------- PAGINATION LOGIC ----------------
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentBlogs = blogs.slice(startIndex, endIndex);

    const handleToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    // Reset page if blogs change
    useEffect(() => {
        setCurrentPage(1);
    }, [blogs]);

    const handleSortChange = (sortType) => {
        setSelectedSort(sortType);
    };

    const handleCategoryChange = (categoryName) => {
        setSelectedCategory(prev => prev === categoryName ? "" : categoryName);
    };

    const handleReadingTimeChange = (range) => {
        setSelectedReadingTime(prev => prev === range ? "" : range);
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            {/* ---------------- STUNNING HERO SECTION ---------------- */}
            <div className="relative w-full h-[300px] sm:h-[250px] md:h-[300px] overflow-hidden flex items-center justify-center">
                <img
                    src={mainImage}
                    alt="Blog Hero"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/90 to-transparent flex items-center">
                    <div className="container mx-auto px-6 md:px-12 max-w-[1440px]">
                        <div className="w-full">
                            <span className="inline-block px-3 py-1 bg-white text-[#000000] backdrop-blur-md rounded-full text-[10px] md:text-sm font-bold tracking-widest uppercase mb-4 animate-fade-in">
                                Explore Our Stories
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 text-white leading-tight drop-shadow-lg">
                                {cmsData?.heading || "ArtSays Blog"}
                            </h1>
                            <p className="text-sm sm:text-lg md:text-xl font-medium text-white leading-relaxed opacity-90 line-clamp-3 md:line-clamp-none">
                                {cmsData?.description || "Dive into the world of creativity, techniques, and the stories behind the masterpieces."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1440px] mx-auto p-4">
                <div className="flex flex-col lg:flex-row gap-4">

                    {/* ---------------- MODERN SIDEBAR ---------------- */}
                    <aside className="w-full lg:w-[280px] shrink-0">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full flex items-center justify-between px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm font-bold text-[#6F4D34]"
                            >
                                <span className="flex items-center gap-2">
                                    <ListFilter size={20} />
                                    {showFilters ? "Hide Filters" : "Show Filters"}
                                </span>
                                {showFilters ? <X size={20} /> : <ChevronRight size={20} />}
                            </button>
                        </div>

                        <div className={`${showFilters ? "block" : "hidden"} lg:block sticky top-10 space-y-4 animate-slide-up`}>
                            {/* Sort By Section */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <SortAsc size={18} className="text-[#6F4D34]" />
                                    Sort Results
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { id: "newest", label: "Newest First" },
                                        { id: "oldest", label: "Oldest First" },
                                        { id: "trending", label: "Trending" },
                                        { id: "mostLiked", label: "Most Liked" }
                                    ].map((option) => (
                                        <label key={option.id} className="flex items-center group cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name="sort" 
                                                    className="sr-only"
                                                    checked={selectedSort === option.id} 
                                                    onChange={() => handleSortChange(option.id)} 
                                                />
                                                <div className={`w-5 h-5 border-2 rounded-full transition-all ${
                                                    selectedSort === option.id ? "border-[#6F4D34] bg-[#6F4D34]" : "border-gray-300 group-hover:border-[#6F4D34]"
                                                }`}>
                                                    <div className={`w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${
                                                        selectedSort === option.id ? "scale-100" : "scale-0"
                                                    }`} />
                                                </div>
                                            </div>
                                            <span className={`ml-3 text-sm font-medium transition-colors ${
                                                selectedSort === option.id ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"
                                            }`}>
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Categories Section */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Tag size={18} className="text-[#6F4D34]" />
                                    Categories
                                </h3>
                                <div className="space-y-4">
                                    {categories.map((cat) => (
                                        <label key={cat._id} className="flex items-center group cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only"
                                                    checked={selectedCategory === cat.name} 
                                                    onChange={() => handleCategoryChange(cat.name)} 
                                                />
                                                <div className={`w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center ${
                                                    selectedCategory === cat.name ? "border-[#6F4D34] bg-[#6F4D34]" : "border-gray-300 group-hover:border-[#6F4D34]"
                                                }`}>
                                                    {selectedCategory === cat.name && (
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`ml-3 text-sm font-medium transition-colors ${
                                                selectedCategory === cat.name ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"
                                            }`}>
                                                {cat.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Reading Time Section */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Clock size={18} className="text-[#6F4D34]" />
                                    Reading Time
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { id: "0-5", label: "Under 5 mins" },
                                        { id: "5-10", label: "5 - 10 mins" },
                                        { id: "10-0", label: "10+ mins" }
                                    ].map((range) => (
                                        <label key={range.id} className="flex items-center group cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only"
                                                    checked={selectedReadingTime === range.id} 
                                                    onChange={() => handleReadingTimeChange(range.id)} 
                                                />
                                                <div className={`w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center ${
                                                    selectedReadingTime === range.id ? "border-[#6F4D34] bg-[#6F4D34]" : "border-gray-300 group-hover:border-[#6F4D34]"
                                                }`}>
                                                    {selectedReadingTime === range.id && (
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`ml-3 text-sm font-medium transition-colors ${
                                                selectedReadingTime === range.id ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"
                                            }`}>
                                                {range.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ---------------- MAIN CONTENT ---------------- */}
                    <main className="flex-grow">
                        {/* Search Section */}
                        <div className="relative mb-4 group">
                            <input
                                type="text"
                                placeholder="Search our knowledge base..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/20 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
                            />
                        </div>

                        {/* Blog Grid */}
                        <div className="mb-8">
                            {loading ? (
                                <BlogGridSkeleton />
                            ) : currentBlogs.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {currentBlogs.map((blog, index) => (
                                        <div key={blog._id || index} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                            <BlogCard blog={blog} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6 text-gray-400">
                                        <Search size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No blogs found</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto">
                                        We couldn't find any articles matching your current filters. Try adjusting your search or category selection.
                                    </p>
                                    <button 
                                        onClick={() => {
                                            setSelectedCategory("");
                                            setSelectedSort("newest");
                                            setSearch("");
                                            setSelectedReadingTime("");
                                        }}
                                        className="mt-8 text-[#6F4D34] font-bold hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ---------------- STYLISH PAGINATION ---------------- */}
                        {totalPages > 1 && (
                            <div className="mt-4 flex justify-center">
                                <nav className="flex items-center gap-2 p-1 bg-white border border-gray-200 rounded-2xl shadow-sm">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={handleToPreviousPage}
                                        className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <div className="flex items-center px-2">
                                        {Array.from({ length: totalPages }).map((_, i) => {
                                            const page = i + 1;
                                            // Show limited pages if there are many
                                            if (totalPages > 7) {
                                                if (page !== 1 && page !== totalPages && (page < currentPage - 1 || page > currentPage + 1)) {
                                                    if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="px-1 text-gray-400">...</span>;
                                                    return null;
                                                }
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                                                        page === currentPage
                                                            ? "bg-[#6F4D34] text-white shadow-md shadow-[#6F4D34]/20"
                                                            : "text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={handleToNextPage}
                                        className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </nav>
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}

export default Blogs;