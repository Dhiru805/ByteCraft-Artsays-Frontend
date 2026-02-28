import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";
import WhyArtsaysDiffSkeleton from "../../../Component/Skeleton/WhyArtsaysDiffSkeleton";
import { ChevronRight } from "lucide-react";

const WhyArtsaysDifferent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageRes = await getAPI("/api/homepage/published");
        const homepage = pageRes.data.data;
        if (!homepage?._id) throw new Error("No published homepage found");

        const sectionRes = await getAPI(`/api/homepage-sections/why-artsays-different/${homepage._id}`);
        if (!sectionRes.data.success || !sectionRes.data.data)
          throw new Error("Why Artsays Different section not found");

        setData(sectionRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div><WhyArtsaysDiffSkeleton/></div>;
  if (!data) return <div>No "Why Artsays Is Different" section available</div>;

  return (
    <div className="w-full bg-gray-50 font-[poppins] py-16 px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header - Matching HomeChallenges Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
                {data.heading}
              </h2>
              <p className="text-gray-500 text-lg max-w-3xl font-medium leading-relaxed">
                {data.description}
              </p>
            </div>
          {data.buttonName && (
            <a
              href={data.buttonLink || "#"}
              className="hidden lg:flex items-center gap-2 bg-[#6F4D34] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-all shadow-lg shadow-[#6F4D34]/20 transform active:scale-95 group"
            >
              {data.buttonName}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>

        {/* Creative Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {data.cards?.map((card, i) => (
            <div 
              key={i} 
              className="group relative bg-white p-12 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Background Decorative Element */}
              <div 
                className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-5 group-hover:opacity-10 transition-all duration-700 blur-2xl"
                style={{ backgroundColor: card.hexColor }}
              />
              
              {/* Icon Container with Glassmorphism */}
              <div className="relative mb-10 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
                <div 
                  className="w-24 h-24 rounded-[32px] flex items-center justify-center shadow-2xl relative z-10 overflow-hidden"
                  style={{ backgroundColor: card.hexColor }}
                >
                  {/* Inner Glass Glow */}
                  <img 
                    src={`${imageBaseURL}/${card.icon}`} 
                    alt={card.title} 
                    className="w-12 h-12 relative z-20" 
                  />
                </div>
                {/* Outer Glow Effect */}
                <div 
                  className="absolute inset-0 blur-3xl opacity-30 rounded-full scale-125 group-hover:opacity-50 transition-opacity duration-500"
                  style={{ backgroundColor: card.hexColor }}
                />
              </div>

              {/* Text Content */}
              <h3 
                className="text-2xl font-black mb-4 tracking-tight"
                style={{ color: card.hexColor }}
              >
                {card.title}
              </h3>
              
              <p className="text-gray-500 font-medium leading-relaxed text-base">
                {card.description}
              </p>

              {/* Interactive Bottom Border Accent */}
              <div 
                className="absolute bottom-0 left-0 w-full h-1.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
                style={{ backgroundColor: card.hexColor }}
              />

              {/* Hover Floating Dots */}
              <div 
                className="absolute top-8 left-8 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"
                style={{ backgroundColor: card.hexColor }}
              />
              <div 
                className="absolute bottom-20 right-10 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"
                style={{ backgroundColor: card.hexColor }}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WhyArtsaysDifferent;
