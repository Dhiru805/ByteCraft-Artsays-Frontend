import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";
import HowToBuySkeleton from "../../../Component/Skeleton/HowToBuySkeleton";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from '../../../utils/getImageUrl';

const HowToBuy = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try {
          const pageRes = await getAPI("/api/homepage/published");
          if (!pageRes) return;
          const homepage = pageRes?.data?.data;
          
          if (!homepage?._id) return;

          const sectionRes = await getAPI(
            `/api/homepage-sections/how-to-buy/${homepage._id}`
          );
          if (!sectionRes?.data?.success) return;

          setData(sectionRes.data.data);
        } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div><HowToBuySkeleton/></div>;
  if (!data) return null;

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-white to-amber-50/30 font-[poppins] py-12 md:py-24 px-3 md:px-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#6F4D34]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-6 align-items-center mb-16 md:mb-20">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6F4D34]/10 rounded-full w-fit">
              <div className="w-2 h-2 bg-[#6F4D34] rounded-full animate-pulse" />
              <span className="text-[#6F4D34] text-sm font-bold uppercase tracking-wider">Simple Steps</span>
            </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
                {data.heading}
              </h2>
            <p className="text-gray-500 text-lg max-w-2xl font-medium leading-relaxed">
              {data.description}
            </p>
          </div>
          {data.buttonName && (
            <button
              onClick={() => navigate(data.buttonLink || "/")}
              className="hidden lg:flex items-center gap-2 bg-[#6F4D34] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-all shadow-lg shadow-[#6F4D34]/20 transform active:scale-95"
            >
              {data.buttonName}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          )}
        </div>

        <div className="relative">
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {data.cards?.map((card, idx) => (
              <div
                key={idx}
                className="group relative"
                onMouseEnter={() => setActiveStep(idx)}
                onMouseLeave={() => setActiveStep(null)}
              >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className={`relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-xl border-4 transition-all duration-500 ${
                      activeStep === idx ? 'border-[#6F4D34] scale-110' : 'border-gray-100'
                    }`}>
                      <span className={`text-xl md:text-2xl font-black transition-colors duration-300 ${
                        activeStep === idx ? 'text-[#6F4D34]' : 'text-gray-400'
                      }`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className={`absolute inset-0 rounded-full bg-[#6F4D34]/10 scale-0 group-hover:scale-150 transition-transform duration-700 opacity-50`} />
                    </div>
                  </div>

                  <div className={`relative bg-white rounded-[24px] md:rounded-[32px] pt-12 md:pt-16 pb-6 md:pb-8 px-4 md:px-8 transition-all duration-500 overflow-hidden ${
                    activeStep === idx 
                      ? 'shadow-2xl shadow-[#6F4D34]/15 -translate-y-3' 
                      : 'shadow-lg shadow-gray-200/50 border border-gray-100'
                  }`}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6F4D34] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-tl from-[#6F4D34]/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {card.image && (
                    <div className="relative mb-8 flex justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-50/50 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75" />
                      <div className="relative w-full max-w-[220px] aspect-square flex items-center justify-center">
                        <img
                          src={getImageUrl(card.image)}
                          alt={card.title}
                          className="w-full h-full object-contain drop-shadow-lg transform group-hover:scale-110 group-hover:-rotate-2 transition-all duration-700"
                        />
                      </div>
                    </div>
                  )}

                    <div className="text-center space-y-3">
                      <h3 className={`text-lg md:text-2xl font-black transition-colors duration-300 ${
                        activeStep === idx ? 'text-[#6F4D34]' : 'text-gray-900'
                      }`}>
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-black leading-relaxed font-medium">
                        {card.description}
                      </p>
                    </div>

                  {card.icons?.length > 0 && (
                    <div className="mt-6">
                      <div className="flex justify-center gap-3">
                        {card.icons.map((icon, i) => (
                          <div 
                            key={i} 
                            className="p-3 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group/icon"
                          >
                            <img
                              src={getImageUrl(icon)}
                              alt="payment method"
                              className="h-7 w-auto object-contain grayscale group-hover/icon:grayscale-0 transition-all duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-center">
                    <div className={`flex items-center gap-2 text-[#6F4D34] font-bold text-sm uppercase tracking-wider opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500`}>
                      <span>Step {idx + 1}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* {idx < data.cards.length - 1 && (
                  <div className="hidden lg:flex absolute top-28 -right-5 z-30 items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-100 text-[#6F4D34] group-hover:border-[#6F4D34] group-hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToBuy;
