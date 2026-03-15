import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import getAPI from "../../../api/getAPI"; 
import { getImageUrl } from "../../../utils/getImageUrl";

const JoinArtsays = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const base = getImageUrl(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI("/api/career-CMS/published");
        if (res.data?.data) {
          setPage(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch careers page", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <JoinArtsaysSkeleton />;
  }

  if (!page) {
    return null;
  }

  const s1 = page.section1;

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Title & Description Section */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {s1.heading || "Join Artsays"}
            </h2>
            <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full" />
          </div>
          
          {s1.buttonName && (
            <a
              href={s1.buttonLink || "#"}
              className="inline-flex items-center justify-center px-8 py-3 bg-[#6F4D34] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-[#5a3e2a] hover:-translate-y-1 transition-all active:scale-95 group"
            >
              {s1.buttonName}
              <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>

        <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
          {s1.description}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {s1.cards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-xl hover:-translate-y-1 group"
          >
            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl">
              <img
                src={`${base}/${card.image}`}
                alt={card.text}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
              {card.text}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

const JoinArtsaysSkeleton = () => (
  <div className="w-full space-y-6 animate-pulse">
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="h-9 w-48 bg-gray-100 rounded-lg" />
          <div className="w-20 h-1.5 bg-gray-100 rounded-full" />
        </div>
        <div className="h-12 w-40 bg-gray-100 rounded-2xl" />
      </div>
      <div className="h-4 w-full bg-gray-100 rounded-lg" />
      <div className="h-4 w-3/4 bg-gray-100 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-4" />
          <div className="h-5 w-24 bg-gray-100 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export default JoinArtsays;
