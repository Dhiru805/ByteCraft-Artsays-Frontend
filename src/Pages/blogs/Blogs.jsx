// import { useState, useEffect } from "react";
// import "./Blogs.css";
// import { Minus, ListFilter, ChevronLeft, ChevronRight } from "lucide-react";
// import getAPI from "../../api/getAPI";

// import mainImage from "../../assets/blogGrid/blog-grid-main.png";
// import BlogCard from "./BlogCard";

// function Blogs() {

//     const [showFilters, setShowFilters] = useState(false)
//     const [blogs, setBlogs] = useState([])
//     const [currentPage, setCurrentPage] = useState(1)
//     const [totalPages, setTotalPages] = useState()

//     // Function to fetch Blogs data
//     const fetchBlogsData = async () => {
//         try {
//             const response = await getAPI("/Blog-Post/statusapproved-blogs")
//             if (response.data) {
//                 setBlogs(response.data.blogs)
//                 setTotalPages(Math.ceil(response.data.blogs.length / 6))
//             }
//             else {
//                 console.log(response)
//             }
//         }
//         catch (error) {
//             console.log(error)
//         }
//     };

//     // useEffect to call the fetchBlogsData function
//     useEffect(() => {
//         fetchBlogsData();
//     }, []);

//     // Function for moving previous page from current page
//     const handleToPreviousPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(prev => prev - 1);
//         }
//     };

//     // Function for moving next page from current page
//     const handleToNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(prev => prev + 1);
//         }
//     };

//     return (
//         <div className="w-full max-w-[1440px] mx-auto overflow-hidden">
//             <div className="w-full">
//                 <img src={mainImage} alt="Blog grid" className="w-100 h-auto max-h-[250px] object-cover" />
//             </div>

//             <div className="my-4 px-2 lg:px-3">
//                 <h1 className="text-[#6F4D34] text-[24px] lg:text-[36px] font-bold">ArtSays Blog</h1>
//                 <h6 className="text-[#E56500] font-semibold text-[14px] lg:text-[16px]">Stories that Speak</h6>

//                 <div className="flex flex-col lg:flex-row py-4 gap-4">

//                     <div className='w-full lg:w-1/5 text-[#000]'>
//                         <div className="flex justify-end">
//                             <button onClick={() => setShowFilters(!showFilters)}
//                                 className="lg:hidden border-2 border-gray-300 rounded px-6 py-1.5 focus:outline-0 flex items-center gap-2 font-semibold">
//                                 <ListFilter size={16} />
//                                 {showFilters ? "Close" : "Filters"}
//                             </button>
//                         </div>

//                         <div className={showFilters ? "mt-3" : "max-lg:hidden"}>
//                             <h5 className="font-medium text-lg">Filter by</h5>
//                             <div className="px-2">
//                                 <h6 className="font-medium text-lg py-4 mt-2 flex items-center gap-2">
//                                     <Minus size={14} /> Sort By
//                                 </h6>
//                                 <ul className="space-y-3">
//                                     <li className="flex items-center gap-2">
//                                         <input type="checkbox" className="scale-125" /> New Arrivals
//                                     </li>
//                                     <li className="flex items-center gap-2">
//                                         <input type="checkbox" className="scale-125" /> Trending
//                                     </li>
//                                     <li className="flex items-center gap-2">
//                                         <input type="checkbox" className="scale-125" /> Price Low to High
//                                     </li>
//                                     <li className="flex items-center gap-2">
//                                         <input type="checkbox" className="scale-125" /> Price High to Low
//                                     </li>
//                                     <li className="flex items-center gap-2">
//                                         <input type="checkbox" className="scale-125" /> Relevance
//                                     </li>
//                                 </ul>
//                             </div>
//                             <hr className="mt-3 bg-gray-300 border-5 dark:bg-gray-700 h-px" />
//                             <div className="px-2">
//                                 <h6 className="text-lg font-medium py-4 flex items-center gap-2">
//                                     <Minus size={14} /> Categories</h6>
//                                 <ul className="space-y-3">
//                                     <li className="flex items-center gap-2">
//                                         <input type="checkbox" className="scale-125" /> Artist Spotlights
//                                     </li>
//                                     <li className="flex items-center gap-2">
//                                         <input type="checkbox" className="scale-125" /> Challenges & Events
//                                     </li>
//                                     <li className="flex items-center gap-2">
//                                         <input type="checkbox" className="scale-125" /> Trends & Inspiration
//                                     </li>
//                                     <li className="flex items-center gap-2">
//                                         <input type="checkbox" className="scale-125" /> Platform Updates
//                                     </li>
//                                 </ul>
//                             </div>
//                             <hr className="mt-3 bg-gray-300 border-5 dark:bg-gray-700 h-px" />
//                         </div>
//                     </div>

//                     <div className="w-full lg:w-4/5">
//                         <div className="w-full grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-5">
//                             {
//                                 blogs.length > 0 ? (
//                                     blogs.map((blog, index) => (
//                                         <BlogCard key={index} blog={blog} />
//                                     ))
//                                 ) : (
//                                     <div>No blogs</div>
//                                 )
//                             }
//                         </div>

//                         {/* Pagination */}
//                         {
//                             blogs.length > 0 && (
//                                 <div className="flex justify-center items-center mt-10 space-x-2">
//                                     <a className={`${currentPage === 1 ? 'cursor-default pointer-events-none opacity-50' : 'cursor-pointer'}`}
//                                         onClick={handleToPreviousPage}>
//                                         <ChevronLeft />
//                                     </a>
//                                     {
//                                         Array.from({ length: Math.ceil(blogs.length / 6) }).map((_, index) => (
//                                             <a key={index}>
//                                                 <button className={`border border-gray-300 w-10 h-10 rounded cursor-pointer
//                                                     ${currentPage === index + 1 ? 'bg-purple-100 text-purple-500 font-semibold' : 'text-gray-500'}`}
//                                                     onClick={() => setCurrentPage(index + 1)}>
//                                                     {index + 1}
//                                                 </button>
//                                             </a>
//                                         ))
//                                     }
//                                     <a className={`${currentPage === totalPages ? 'opacity-50 pointer-events-none cursor-default' : 'cursor-pointer'}`}
//                                         onClick={handleToNextPage}>
//                                         <ChevronRight />
//                                     </a>
//                                 </div>
//                             )
//                         }
//                     </div>

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Blogs;

import { useState, useEffect } from "react";
import "./Blogs.css";
import { Minus, ListFilter, ChevronLeft, ChevronRight } from "lucide-react";
import getAPI from "../../api/getAPI";

import mainImage from "../../assets/blogGrid/blog-grid-main.png";
import BlogCard from "./BlogCard";

function Blogs() {

    const [showFilters, setShowFilters] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [cmsData, setCmsData] = useState(null);

    const ITEMS_PER_PAGE = 12;

    // ---------------- FETCH BLOGS ----------------
    const fetchBlogsData = async () => {
        try {
            const response = await getAPI("/Blog-Post/statusapproved-blogs");
            if (response?.data?.blogs) {
                setBlogs(response.data.blogs);
                setTotalPages(Math.ceil(response.data.blogs.length / ITEMS_PER_PAGE));
            }
        } catch (error) {
            console.log(error);
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
        fetchCMS();
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

    return (
        <div className="w-full max-w-[1440px] mx-auto overflow-hidden">

            {/* ---------------- MAIN IMAGE ---------------- */}
            <div className="w-full">
                <img
                    src={mainImage}
                    alt="Blog grid"
                    className="w-full h-auto max-h-[250px] object-cover"
                />
            </div>

            <div className="my-4 px-2 lg:px-3">

                {/* ---------------- CMS TITLE ---------------- */}
                <h1 className="text-lg md:text-4xl font-bold text-orange-500">
                    {cmsData?.heading || "ArtSays Blog"}
                </h1>
                <hr className="my-3 border-dark" />
                <p className="text-sm md:text-lg md:text-dark font-medium text-black leading-relaxed">
                    {cmsData?.description || "Stories that Speak"}
                </p>

                <div className="flex flex-col lg:flex-row py-4 gap-4">

                    {/* ---------------- FILTERS ---------------- */}
                    <div className="w-full lg:w-1/5 text-[#000]">

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden border-2 border-gray-300 rounded px-6 py-1.5 flex items-center gap-2 font-semibold"
                            >
                                <ListFilter size={16} />
                                {showFilters ? "Close" : "Filters"}
                            </button>
                        </div>

                        <div className={showFilters ? "mt-3" : "max-lg:hidden"}>
                            <h5 className="font-medium text-lg">Filter by</h5>

                            <div className="px-2">
                                <h6 className="font-medium text-lg py-4 mt-2 flex items-center gap-2">
                                    <Minus size={14} /> Sort By
                                </h6>
                                <ul className="space-y-3">
                                    <li><input type="checkbox" /> New Arrivals</li>
                                    <li><input type="checkbox" /> Trending</li>
                                    <li><input type="checkbox" /> Price Low to High</li>
                                    <li><input type="checkbox" /> Price High to Low</li>
                                </ul>
                            </div>

                            <hr className="mt-3 bg-gray-300" />

                            <div className="px-2">
                                <h6 className="text-lg font-medium py-4 flex items-center gap-2">
                                    <Minus size={14} /> Categories
                                </h6>
                                <ul className="space-y-3">
                                    <li><input type="checkbox" /> Artist Spotlights</li>
                                    <li><input type="checkbox" /> Challenges & Events</li>
                                    <li><input type="checkbox" /> Trends & Inspiration</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* ---------------- BLOG GRID ---------------- */}
                    <div className="w-full lg:w-4/5">

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {currentBlogs.length > 0 ? (
                                currentBlogs.map((blog, index) => (
                                    <BlogCard key={index} blog={blog} />
                                ))
                            ) : (
                                <div>No blogs available</div>
                            )}
                        </div>

                        {/* ---------------- PAGINATION ---------------- */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6">
                                <nav className="flex items-center space-x-2 rounded border border-dark px-3 py-2 text-sm sm:text-lg font-semibold">

                                    <button
                                        disabled={currentPage === 1}
                                        onClick={handleToPreviousPage}
                                        className={`flex items-center px-3 py-1 ${currentPage === 1
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:text-red-500"
                                            }`}
                                    >
                                        <ChevronLeft />
                                        <span className="ml-1">Previous</span>
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 rounded ${page === currentPage
                                                    ? "border border-dark"
                                                    : "hover:text-red-500"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={handleToNextPage}
                                        className={`flex items-center px-3 py-1 ${currentPage === totalPages
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:text-red-500"
                                            }`}
                                    >
                                        <span className="mr-1">Next</span>
                                        <ChevronRight />
                                    </button>

                                </nav>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Blogs;
