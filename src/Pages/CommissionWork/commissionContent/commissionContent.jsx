// import "../../store/products/product.css";
// import React, { useState } from "react";

// const CommissionContent = () => {
//   const [showFilters, setShowFilters] = useState(false);

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">
//       {/* Top Section: Breadcrumb + Search */}
//       <div className="w-full py-3 px-3">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           {/* Breadcrumb */}
//           <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//             <a href="#" className="hover:text-red-500">
//               Home
//             </a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">
//               Store
//             </a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">
//               Paintings
//             </a>
//             <span>/</span>
//             <span className="font-medium text-gray-900">Abstract</span>
//           </nav>

//           {/* Search Bar */}
//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
//             />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* title */}
//       <h1 className="text-sm md:text-4xl font-bold text-orange-500 px-3">
//         How to Commission Art works
//       </h1>

//       <hr className="my-3 border-dark" />

//       {/* Subtitle */}
//       <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//         At ArtSays, we make it simple for you to collaborate directly with
//         talented artists and bring your creative vision to life. Commissioning
//         custom artwork is a personalized process designed to give you a unique
//         piece that reflects your ideas, style, and story.
//       </p>

//       {/* Main Layout */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 mt-3">
//         {/* Sidebar Filters (hidden on mobile, toggleable) */}
//         <aside className="rounded-xl filter-sidebar content-center">
//           <img src="/herosectionimg/Audit-pana 1.png" alt="" />
//         </aside>

//         {/* <!-- Product Grid --> */}
//         <main className="md:col-span-3 content-center">
//           <div>
//             {/* title */}
//             <h1 className="text-sm md:text-xl font-bold text-orange-500">
//               1. Submit Your Request
//             </h1>
//             <hr className="my-3 border-dark" />
//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
//               Fill out the Commission Request Form with details about your
//               concept, size, medium, and budget. <br />
//               Provide references or inspiration images (optional) to help the
//               artist understand your vision.
//             </p>
//             <button className="flex-1 bg-red-500 text-white py-2 px-3 mt-2 rounded-full font-semibold shadow buy-now">
//               Commission Form
//             </button>
//           </div>
//         </main>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 mt-3">
//         {/* <!-- Product Grid --> */}
//         <main className="md:col-span-3 content-center text-right !order-2 md:!order-1">
//           <div>
//             {/* title */}
//             <h1 className="text-sm md:text-xl font-bold text-orange-500">
//               1. Submit Your Request
//             </h1>
//             <hr className="my-3 border-dark" />
//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
//               Fill out the Commission Request Form with details about your
//               concept, size, medium, and budget. <br />
//               Provide references or inspiration images (optional) to help the
//               artist understand your vision.
//             </p>
//             <button className="flex-1 bg-red-500 text-white py-2 px-3 mt-2 rounded-full font-semibold shadow buy-now">
//               Commission Form
//             </button>
//           </div>
//         </main>

//         {/* Sidebar Filters (hidden on mobile, toggleable) */}
//         <aside className="rounded-xl filter-sidebar content-center !order-1 md:!order-2">
//           <img src="/herosectionimg/Audit-pana 1.png" alt="" />
//         </aside>
//       </div>
//     </div>
//   );
// };
// export default CommissionContent;










// import "../../store/products/product.css";
// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../../api/axiosConfig";

// const CommissionContent = () => {
//   const [pageData, setPageData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

//   useEffect(() => {
//     const fetchPublishedPage = async () => {
//       try {
//         const res = await axiosInstance.get("/api/commission/published");
//         if (res.data.success && res.data.data) {
//           setPageData(res.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching Commission page:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPublishedPage();
//   }, []);

//   if (loading) return <p className="text-center py-6">Loading...</p>;
//   if (!pageData) return <p className="text-center py-6">No content found</p>;

//   return (
//     <div className="max-w-[1440px] mx-auto mb-4">
//       {/* Breadcrumb + Search */}
//       <div className="w-full py-3 px-3">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
//             <a href="#" className="hover:text-red-500">Home</a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">Store</a>
//             <span>/</span>
//             <a href="#" className="hover:text-red-500">Paintings</a>
//             <span>/</span>
//             <span className="font-medium text-gray-900">Commission</span>
//           </nav>

//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
//             />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Page Heading */}
//       <h1 className="text-sm md:text-4xl font-bold text-orange-500 px-3">
//         {pageData.webpageHeading}
//       </h1>
//       <hr className="my-3 border-dark" />

//       {/* Page Description */}
//       <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//         {pageData.webpageDescription}
//       </p>

//       {/* Articles */}
//       <div className="grid grid-cols-1 gap-6 px-3 sm:px-6 mt-6">
//         {pageData.articles.map((article, index) => (
//           <div
//             key={index}
//             className={`flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-white rounded-xl shadow-md ${
//               index % 2 === 1 ? "md:flex-row-reverse" : ""
//             }`}
//           >
//             {/* Image */}
//             {article.bannerImage && (
//               <img
//                 src={`${imageBaseURL}/${article.bannerImage}`}
//                 alt={article.articleHeading}
//                 className="w-full md:w-1/3 max-h-[200px] object-contain rounded-lg"
//               />
//             )}

//             {/* Text Content */}
//             <div className={`flex-1 ${index % 2 === 1 ? "text-right" : "text-left"}`}>
//               <h2 className="text-sm md:text-xl font-bold text-orange-500">
//                 {article.articleHeading}
//               </h2>
//               <hr className="my-3 border-dark" />
//               <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
//                 {article.articleContent}
//               </p>

//               {article.buttonName && article.buttonPath && (
//                 <a href={article.buttonPath}>
//                   <button className="flex-1 bg-red-500 text-white py-2 px-3 mt-2 rounded-full font-semibold shadow buy-now">
//                     {article.buttonName}
//                   </button>
//                 </a>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CommissionContent;

















import "../../store/products/product.css";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosConfig";

const CommissionContent = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  useEffect(() => {
    const fetchPublishedPage = async () => {
      try {
        const res = await axiosInstance.get("/api/commission/published");
        if (res.data.success && res.data.data) {
          setPageData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching Commission page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedPage();
  }, []);

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (!pageData) return <p className="text-center py-6">No content found</p>;

  const filteredArticles = pageData.articles.filter((article) =>
    article.articleHeading.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
     
      <div className="w-full py-3 px-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
      
          <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
            <a href="#" className="hover:text-red-500">Home</a>
            <span>/</span>
            <a href="#" className="hover:text-red-500">Dashboard</a>
            <span>/</span>
            <span className="font-medium text-gray-900">Commission</span>
          </nav>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="text-sm md:text-4xl font-bold text-orange-500 px-3">
        {pageData.webpageHeading}
      </h1>
      <hr className="my-3 border-dark" />

      <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
        {pageData.webpageDescription}
      </p>

      <div className="grid grid-cols-1 gap-6 px-3 sm:px-6 mt-3">
        {filteredArticles.map((article, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center"
          >
            {article.bannerImage && (
              <aside
                className={`rounded-xl filter-sidebar content-center ${
                  index % 2 === 1 ? "md:order-2" : "md:order-1"
                }`}
              >
                <img
                  src={`${imageBaseURL}/${article.bannerImage}`}
                  alt={article.articleHeading}
                  className="w-full h-full object-cover rounded-lg"
                />
              </aside>
            )}

            <main
              className={`md:col-span-3 flex flex-col justify-center ${
                index % 2 === 1 ? "md:text-right md:order-1" : "md:text-left md:order-2"
              }`}
            >
              <h2 className="text-sm md:text-xl font-bold text-orange-500">
                {article.articleHeading}
              </h2>
              <hr className="my-3 border-dark" />
              <p className="text-xs md:text-base font-medium text-black leading-relaxed">
                {article.articleContent}
              </p>

              {article.buttonName && article.buttonPath && (
                <a href={article.buttonPath}>
                  <button className="flex-1 bg-red-500 text-white py-2 px-3 mt-3 rounded-full font-semibold shadow buy-now">
                    {article.buttonName}
                  </button>
                </a>
              )}
            </main>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommissionContent;
