
import React, { useEffect, useState } from "react";
import getAPI from "../../../api/getAPI";
import { getImageUrl } from '../../../utils/getImageUrl';

const WhoWeAre = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchWhoWeAre = async () => {
      try {
        const pageRes = await getAPI("/api/about-us/published");
        if (!pageRes) throw new Error("No published About Us page found");
        const aboutUsPage = pageRes.data.data;

        if (!aboutUsPage?._id) throw new Error("No published About Us page found");

        const sectionRes = await getAPI(`/api/about-us-sections/who-we-are/${aboutUsPage._id}`);
        if (!sectionRes || !sectionRes.data.success) throw new Error("Who We Are section not found");

        setData(sectionRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWhoWeAre();
  }, []);

  if (loading) return <div>{WhoWeAreSkeleton()}</div>;
  if (!data) return null;

  return (
    <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
      <div className="flex flex-col lg:flex-row gap-10 items-center">
        <div className="w-full lg:w-2/5 aspect-[4/3] overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center">
          {data.image1 ? (
            <img
              src={getImageUrl(data.image1)}
              alt="Who We Are"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="text-gray-300">No Image</div>
          )}
        </div>
        <div className="w-full lg:w-3/5 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
            {data.heading || "Who We Are"}
          </h2>
          <div className="w-16 h-1 bg-[#6F4D34] rounded-full" />
          <p className="text-lg text-gray-600 leading-relaxed font-medium">
            {data.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            {data.stats?.map((s, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-[#6F4D34]/5">
                <div className="text-2xl md:text-3xl font-bold text-[#6F4D34] mb-1">
                  {s.number}
                </div>
                <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;



// WhoWeAreSkeleton.jsx
function WhoWeAreSkeleton() {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="max-w-[1440px] mx-auto py-3 animate-pulse">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-3 sm:px-6 my-5">
          
          {/* Image Skeleton */}
          <div className="content-center justify-items-center">
            <div className="w-full h-[220px] md:h-[300px] bg-gray-300 rounded-lg"></div>
          </div>

          {/* Text Skeleton */}
          <div className="col-span-2 content-center">
            <div className="h-8 w-1/3 bg-gray-300 rounded mx-3"></div>

            <hr className="my-3 border-dark opacity-30" />

            <div className="space-y-2 mt-3 px-3">
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
              <div className="h-4 w-3/6 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 my-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`content-center justify-items-center ${
                i < 4 ? "md:border-r-2 md:border-[#6F4D34]" : ""
              }`}
            >
              <div className="h-10 w-16 bg-gray-300 rounded mb-3"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
