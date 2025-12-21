import "../../store/products/product.css";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosConfig";

const HowToResellContent = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  useEffect(() => {
    const fetchPublishedPage = async () => {
      try {
        const res = await axiosInstance.get("/api/how-to-resell/published");
        if (res.data.success && res.data.data) {
          setPageData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching HowToResell page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedPage();
  }, []);

  if (loading) return <p className="text-center py-6">{HowToResellcontentSkeleton()}</p>;
  if (!pageData) return <p className="text-center py-6">No content found</p>;

  return (
    <div className="max-w-[1440px] mx-auto mb-4">
      <div className="w-full py-3 px-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex text-sm text-gray-600 space-x-2 overflow-x-auto">
            <a href="/" className="hover:text-red-500">
              Home
            </a>
            <span>/</span>
            <span className="font-medium text-gray-900">How To Resell</span>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
        <h1 className="md:col-span-3 text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
          {pageData.webpageHeading}
        </h1>
        <button className="hidden md:block flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow buy-now">
          Start Reselling
        </button>
      </div>

      <hr className="my-3 border-dark" />

      <p className="mt-3 text-xs md:text-lg md:text-dark font-medium text-black leading-relaxed px-3">
        {pageData.webpageDescription}
      </p>

      <div className="grid grid-cols-1 gap-6 px-3 sm:px-6 my-3">
        {pageData.articles.map((article, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 my-3 items-center"
          >
            {article.bannerImage && (
              <aside className="md:col-span-1 flex justify-center rounded-xl filter-sidebar content-center justify-items-center bg-transparent">
                <img
                  src={`${imageBaseURL}/${article.bannerImage}`}
                  alt={article.articleHeading}
                  className="w-full h-full object-cover rounded-lg"
                />
              </aside>
            )}

            <main className="md:col-span-3 flex flex-col justify-center">
              <h2 className="text-sm md:text-xl font-bold text-orange-500">
                {article.articleHeading}
              </h2>
              <hr className="my-3 border-dark" />
              <p className="text-xs md:text-lg md:text-dark font-medium text-black leading-relaxed whitespace-pre-wrap">
                {article.articleContent}
              </p>
            </main>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToResellContent;

const HowToResellcontentSkeleton = () => {
  return (
    <>
      {/* SKELETON START */}
      <div className="animate-pulse">
        {/* Heading + Button Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3 px-3">
          {/* Heading skeleton */}
          <div className="md:col-span-3">
            <div className="h-8 md:h-12 bg-gray-300 rounded w-3/4"></div>
          </div>

          {/* Desktop Button skeleton */}
          <div className="hidden md:flex justify-end">
            <div className="h-10 w-36 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <hr className="my-3 border-gray-300" />

        {/* Description skeleton */}
        <div className="px-3 mt-3 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-4/5"></div>
        </div>

        {/* Articles skeleton */}
        <div className="grid grid-cols-1 gap-6 px-3 sm:px-6 my-3">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 my-3 items-center"
            >
              {/* Image skeleton */}
              <aside className="md:col-span-1 flex justify-center">
                <div className="w-full h-[180px] md:h-[240px] bg-gray-300 rounded-xl"></div>
              </aside>

              {/* Content skeleton */}
              <main className="md:col-span-3">
                {/* Article heading */}
                <div className="h-5 bg-gray-300 rounded w-1/2"></div>

                <hr className="my-3 border-gray-300" />

                {/* Paragraph lines */}
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </main>
            </div>
          ))}
        </div>
      </div>
      {/* SKELETON END */}
    </>
  );
};
