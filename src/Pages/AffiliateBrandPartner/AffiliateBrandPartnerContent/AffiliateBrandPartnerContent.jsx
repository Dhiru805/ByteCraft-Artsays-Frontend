import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosConfig";

const AffiliateBPContent = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

    useEffect(() => {
        const fetchPublishedPage = async () => {
            try {
                const res = await axiosInstance.get("/api/affiliate-bp/published");
                if (res.data.success && res.data.data) {
                    setPageData(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching Affiliate BP page:", err);
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
                        <span className="font-medium text-gray-900">Affiliate BP</span>
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
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                        {article.bannerImage && (
                            <aside className={`rounded-xl filter-sidebar content-center ${index % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
                                <img src={`${imageBaseURL}/${article.bannerImage}`} alt={article.articleHeading} className="w-full h-full object-cover rounded-lg" />
                            </aside>
                        )}

                        <main className={`md:col-span-3 flex flex-col justify-center ${index % 2 === 1 ? "md:text-right md:order-1" : "md:text-left md:order-2"}`}>
                            <h2 className="text-sm md:text-xl font-bold text-orange-500">{article.articleHeading}</h2>
                            <hr className="my-3 border-dark" />
                            <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">{article.articleContent}</p>


                            {/* {article.buttonName && article.buttonPath && (
                <a
                  href={article.buttonPath}
                  className="mt-4 inline-block px-5 py-2 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                >
                  {article.buttonName}
                </a>
              )} */}

                            {article.buttonName && article.buttonPath && (
                                <a
                                    href={article.buttonPath}
                                    className="mt-4 inline-block w-auto px-4 py-2 bg-orange-600 text-white font-plain rounded-xl hover:bg-orange-500 transition-colors"
                                    style={{ maxWidth: "fit-content" }}
                                >
                                    {article.buttonName}
                                </a>
                            )}

                        </main>
                    </div>
                ))}
            </div>

            {pageData.cards?.length > 0 && (
                <div className="my-5">

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
                                className="mx-auto border rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out"
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

export default AffiliateBPContent;
