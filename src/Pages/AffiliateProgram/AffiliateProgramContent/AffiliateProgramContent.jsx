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
//       <h1 className="text-lg md:text-4xl font-bold text-orange-500 px-3">
//         ArtSays Social Media & Affiliate Program Benifits
//       </h1>

//       <hr className="my-3 border-dark" />

//       {/* Subtitle */}
//       <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//         Turn your creativity and influence into income by joining the ArtSays
//         Affiliate Program. Whether you’re an artist, blogger, content creator,
//         or simply an art enthusiast, you can earn rewards for sharing the beauty
//         of art with the world.
//       </p>

//       {/* Main Layout */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 mt-3">
//         {/* Sidebar Filters (hidden on mobile, toggleable) */}
//         <aside className="rounded-xl filter-sidebar content-center">
//           <img src="/herosectionimg/Shrug-bro 1.png" alt="" />
//         </aside>

//         {/* <!-- Product Grid --> */}
//         <main className="md:col-span-3 content-center">
//           <div>
//             {/* title */}
//             <h1 className="text-sm md:text-xl font-bold text-orange-500">
//               Why Join?
//             </h1>
//             <hr className="my-3 border-dark" />
//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
//               <strong>Earn Commission - </strong>Get a percentage of every
//               successful sale made through your unique affiliate link.
//               <br />
//               <br />
//               <strong> Support Artists - </strong> Every purchase you promote
//               directly supports independent creators.
//               <br />
//               <br />
//               <strong>Exclusive Perks - </strong>Access early product releases,
//               discounts, and affiliate-only campaigns.
//               <br />
//               <br />
//               <strong>Flexible Income - </strong>No limits—earn as much as you
//               promote.
//             </p>
//           </div>
//         </main>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 mt-3">
//         {/* <!-- Product Grid --> */}
//         <main className="md:col-span-3 content-center text-right !order-2 md:!order-1">
//           <div>
//             {/* title */}
//             <h1 className="text-sm md:text-xl font-bold text-orange-500">
//               How It Works
//             </h1>
//             <hr className="my-3 border-dark" />
//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
//               <strong>1. Sign Up – </strong>Complete the quick affiliate
//               registration form.
//               <br />
//               <br />
//               <strong>2. Get Your Link – </strong>Receive your unique tracking
//               link and affiliate dashboard.
//               <br />
//               <br />
//               <strong>3. Promote – </strong>Share ArtSays artworks, collections,
//               and challenges on your blog, socials, or website.
//               <br />
//               <br />
//               <strong>4. Earn – </strong>Receive commissions on every qualified
//               sale made through your referral.
//             </p>
//           </div>
//         </main>

//         {/* Sidebar Filters (hidden on mobile, toggleable) */}
//         <aside className="rounded-xl filter-sidebar content-center !order-1 md:!order-2">
//           <img src="/herosectionimg/Audit-pana 1.png" alt="" />
//         </aside>
//       </div>

//       <div className="my-5">
//         <h1 className="text-lg md:text-4xl font-bold text-orange-500 px-3 text-center">
//           Why Choose ArtSays Social?
//         </h1>
//         <hr className="my-3 border-dark" />
//         {/* Subtitle */}
//         <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3 mb-5 text-center">
//           Whether you’re an artist, blogger, content creator, or simply an art
//           enthusiast, you can earn rewards for sharing the beauty of art with
//           the world.
//         </p>

//         <main className="md:col-span-3 px-3">
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//             {/* <!-- Product Card --> */}

//             <div className="mx-auto border rounded-2xl shadow-2xl">
//               {/* Premium Label */}
//               <div className="relative">
//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/art-focused.png"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                 />
//               </div>
//                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   100% Art-Focused
//                 </h2>
//             </div>

//             <div className="mx-auto border rounded-2xl shadow-2xl">
//               {/* Premium Label */}
//               <div className="relative">
//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/art-focused.png"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                 />
//               </div>
//                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   100% Art-Focused
//                 </h2>
//             </div>

//             <div className="mx-auto border rounded-2xl shadow-2xl">
//               {/* Premium Label */}
//               <div className="relative">
//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/art-focused.png"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                 />
//               </div>
//                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   100% Art-Focused
//                 </h2>
//             </div>

//             <div className="mx-auto border rounded-2xl shadow-2xl">
//               {/* Premium Label */}
//               <div className="relative">
//                 {/* Product Image */}
//                 <img
//                   src="/herosectionimg/art-focused.png"
//                   alt="Beauty of Joseon Mandala Art"
//                   className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
//                 />
//               </div>
//                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   100% Art-Focused
//                 </h2>
//             </div>

//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
// export default CommissionContent;














import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosConfig";

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

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (!pageData) return <p className="text-center py-6">No content found</p>;

  const filteredArticles = pageData.articles?.filter((a) =>
    a.articleHeading.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
      <div className="w-full py-3 px-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
            <a href="#" className="hover:text-red-500">Home</a>
            <span>/</span>
            <a href="#" className="hover:text-red-500">Store</a>
            <span>/</span>
            <span className="font-medium text-gray-900">Affiliate</span>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="text-lg md:text-4xl font-bold text-orange-500 px-3">
        {pageData.webpageHeading}
      </h1>
      <hr className="my-3 border-dark" />

      <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
        {pageData.webpageDescription}
      </p>

      <div className="grid grid-cols-1 gap-6 px-3 sm:px-6 mt-6">
        {filteredArticles.map((article, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 mt-3">
            {article.bannerImage && (
              <aside className={`rounded-xl filter-sidebar content-center ${index % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
                <img src={`${imageBaseURL}/${article.bannerImage}`} alt={article.articleHeading} className="w-full h-full object-cover rounded-lg" />
              </aside>
            )}

            <main className={`md:col-span-3 flex flex-col justify-center ${index % 2 === 1 ? "md:text-right md:order-1" : "md:text-left md:order-2"}`}>
              <h2 className="text-sm md:text-xl font-bold text-orange-500">{article.articleHeading}</h2>
              <hr className="my-3 border-dark" />
              <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">{article.articleContent}</p>
            </main>
          </div>
        ))}
      </div>

      {pageData.cards?.length > 0 && (
        <div className="my-10 px-3 sm:px-6">
        
          {pageData.cardsHeading && (
            <h2 className="text-lg md:text-4xl font-bold text-orange-500 text-center mb-5">
              {pageData.cardsHeading}
              <hr className="my-3 border-dark" />
            </h2>
            
          )}
         
          {pageData.cardsDescription && (
            <p className="mt-2 text-sm md:text-base font-medium text-black text-center mb-5">
              {pageData.cardsDescription}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pageData.cards.map((card, idx) => (
              <div
                key={idx}
                className="mx-auto border rounded-2xl shadow-2xl bg-white hover:scale-105 transition-transform duration-300 ease-in-out"
              >
              
                <div className="relative flex items-center justify-center">
                  <img
                    src={`${imageBaseURL}/${card.cardImage}`}
                    alt={card.cardTitle}
                    className="w-full h-28 sm:h-44 object-contain rounded-t-2xl p-5 pb-0 product-img"
                  />
                </div>

              
                <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                  {card.cardTitle}
                </h2>
              </div>
            ))}
          </div>
        </div>
      )}



    </div>
  );
};

export default AffiliateContent;
