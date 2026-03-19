import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";
import WhyFromSkeleton from "../../../Component/Skeleton/WhyFromSkeleton";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from '../../../utils/getImageUrl';

const WhyFromArtsays = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try {
          const pageRes = await getAPI("/api/homepage/published");
          if (!pageRes) return;
          const homepage = pageRes?.data?.data;
          if (!homepage?._id) return;

          const sectionRes = await getAPI(
            `/api/homepage-sections/why-buy-artsays/${homepage._id}`
          );
          if (!sectionRes?.data?.success || !sectionRes?.data?.data) return;

          setData(sectionRes.data.data);
        } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div><WhyFromSkeleton/></div>;
  if (!data) return null;

  return (
    <div className="w-full bg-gradient-to-b from-white via-gray-50 to-white font-[poppins] py-16 md:py-24 px-4 md:px-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        {/* Header Section - Matching HomeChallenges style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 align-items-center mb-12 md:mb-16">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
              {data.heading}
            </h1>
            <p className="text-gray-500 text-lg max-w-5xl font-medium leading-relaxed">
              {data.description}
            </p>
          </div>
          {data.buttonName && (
            <button
              onClick={() => navigate(data.buttonLink || "/")}
              className="hidden lg:block bg-[#6F4D34] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-all shadow-lg shadow-[#6F4D34]/20 transform active:scale-95"
            >
              {data.buttonName}
            </button>
          )}
        </div>

        {/* Creative Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.cards?.map((card, idx) => (
            <div
              key={idx}
              className={`group relative bg-white rounded-[32px] overflow-hidden transition-all duration-500 cursor-pointer
                ${idx === 0 ? 'md:col-span-2 lg:col-span-1 md:row-span-1' : ''}
                ${hoveredCard === idx ? 'shadow-2xl shadow-[#6F4D34]/20 scale-[1.02] z-10' : 'shadow-lg shadow-gray-200/50'}
              `}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6F4D34]/20 via-transparent to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px]" />
              
              {/* Card Content */}
              <div className="relative p-8 md:p-10 h-full min-h-[320px] flex flex-col">
                {/* Floating Number Badge */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-[#6F4D34] to-[#8B6B4D] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg transform rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* Icon Container */}
                <div className="relative mb-8">
                  <div className="absolute -inset-4 bg-gradient-to-br from-amber-100 to-orange-50 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-50 to-white rounded-3xl flex items-center justify-center shadow-inner border border-gray-100 group-hover:border-[#6F4D34]/20 transition-colors duration-500">
                    <img
                      src={getImageUrl(card.icon)}
                      alt={card.heading}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col">
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 group-hover:text-[#6F4D34] transition-colors duration-300 leading-tight">
                    {card.heading}
                  </h2>
                  
                  <p className="text-gray-600 text-base leading-relaxed font-medium flex-1">
                    {card.description}
                  </p>

                  {/* Bottom Accent Line */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-0 bg-gradient-to-r from-[#6F4D34] to-amber-500 rounded-full group-hover:w-16 transition-all duration-500" />
                      
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#6F4D34]/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-1/2 left-0 w-1 h-0 bg-gradient-to-b from-[#6F4D34] to-amber-500 rounded-r-full group-hover:h-20 transition-all duration-500 -translate-y-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyFromArtsays;
