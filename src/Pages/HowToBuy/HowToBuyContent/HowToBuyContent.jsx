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
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
//         {/* title */}
//         <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//           From Browse to Buy
//         </h1>
//         <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
//           Discover New Arrivals
//         </button>
//       </div>

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
//         <aside className="rounded-xl filter-sidebar content-center justify-items-center bg-transparent">
//           <img src="/herosectionimg/how1.svg" alt="" />
//         </aside>

//         {/* <!-- Product Grid --> */}
//         <main className="md:col-span-3 content-center">
//           <div>
//             {/* title */}
//             <h1 className="text-sm md:text-xl font-bold text-orange-500">
//               Browse & Discover
//             </h1>
//             <hr className="my-3 border-dark" />
//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
//               Fill out the Commission Request Form with details about your
//               concept, size, medium, and budget. <br />
//               Provide references or inspiration images (optional) to help the
//               artist understand your vision.
//             </p>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
// export default CommissionContent;






import "../../store/products/product.css";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosConfig";

const HowToBuyContent = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  useEffect(() => {
    const fetchPublishedPage = async () => {
      try {
        const res = await axiosInstance.get("/api/howtobuy/published");
        if (res.data.success && res.data.data) {
          setPageData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching HowToBuy page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedPage();
  }, []);

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (!pageData) return <p className="text-center py-6">No content found</p>;

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
      <div className="w-full py-3 px-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
            <a href="#" className="hover:text-red-500">Home</a>
            <span>/</span>
            <a href="#" className="hover:text-red-500">Store</a>
            <span>/</span>
            <a href="#" className="hover:text-red-500">Paintings</a>
            <span>/</span>
            <span className="font-medium text-gray-900">How To Buy</span>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-3">
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
          {pageData.webpageHeading}
        </h1>
        <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
          Discover New Arrivals
        </button>
      </div>

      <hr className="my-3 border-dark" />

      <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
        {pageData.webpageDescription}
      </p>

      <div className="grid grid-cols-1 gap-6 px-3 sm:px-6 my-3">
        {pageData.articles.map((article, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 my-3 items-center"
          >
            {article.bannerImage && (
              <aside className="md:col-span-1 flex justify-center">
                <img
                  src={`${imageBaseURL}/${article.bannerImage}`}
                  alt={article.articleHeading}
                  className="w-full h-full object-cover rounded-lg max-h-[300px]"
                />
              </aside>
            )}

            <main className="md:col-span-3 flex flex-col justify-center">
              <h2 className="text-sm md:text-xl font-bold text-orange-500">
                {article.articleHeading}
              </h2>
              <hr className="my-3 border-dark" />
              <p className="text-xs md:text-base font-medium text-black leading-relaxed">
                {article.articleContent}
              </p>
            </main>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToBuyContent;
