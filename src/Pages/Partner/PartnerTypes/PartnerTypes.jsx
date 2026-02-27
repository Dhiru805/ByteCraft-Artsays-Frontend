import "../../store/products/product.css";
import React, { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const PartnerTypes = ({ searchTerm = "" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI("/api/partner");
        const partnerData = Array.isArray(res.data.data)
          ? res.data.data.find((p) => p.status === "published") ||
            res.data.data[0]
          : res.data.data;
        setData(partnerData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-4"><PartnerTypesSkaliton/></div>;
  if (error)
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-center py-4">No data available</div>;

  let smallCards =
    data.cards?.map((card, index) => ({
      id: index,
      title: card.title,
      img: card.image.startsWith("http")
        ? card.image
        : `${process.env.REACT_APP_API_URL}/${card.image}`,
      originalIndex: index,
    })) || [];

  if (searchTerm) {
    smallCards = smallCards.filter(card => 
      card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const slides =
    data.cards?.map((card, index) => ({
      id: index,
      title: card.sectionHeading,
      text: card.sectionDescription,
      img: card.sectionImage.startsWith("http")
        ? card.sectionImage
        : `${process.env.REACT_APP_API_URL}/${card.sectionImage}`,
    })) || [];

  return (
    <div className="w-full py-4">
      {/* Search filtered cards */}
      <div className="px-0 my-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {smallCards.map((c) => {
            const active = c.originalIndex === activeIndex;
            return (
              <button
                key={c.id}
                onClick={() => setActiveIndex(c.originalIndex)}
                className={`w-full border-2 p-4 rounded-2xl flex flex-col items-center gap-3
                                            transition-all duration-300 focus:outline-none bg-white
                                            ${
                                              active
                                                ? "border-[#6F4D34] shadow-lg scale-[1.02]"
                                                : "border-gray-100 hover:border-gray-300"
                                            }`}
                aria-pressed={active}
              >
                <aside className="rounded-xl flex justify-center items-center bg-gray-50 w-20 h-20 group-hover:bg-white transition-colors">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="max-w-[70%] max-h-[70%] object-contain"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/80")
                    }
                  />
                </aside>
                <div>
                  <h1
                    className={`text-sm md:text-lg text-center font-bold ${
                      active ? "text-[#6F4D34]" : "text-gray-600"
                    }`}
                  >
                    {c.title}
                  </h1>
                </div>
              </button>
            );
          })}
        </div>

        {smallCards.length === 0 && (
           <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
             <p className="text-gray-500">No partnership types match your search.</p>
           </div>
        )}

        {/* Sliding area */}
        <div className="relative overflow-hidden mt-8">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((s) => (
              <section
                key={s.id}
                className="w-full flex-shrink-0"
              >
                <div className="flex flex-col md:flex-row items-stretch bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="w-full md:w-3/5 bg-[#6F4D34] p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {s.title}
                    </h2>
                    <div className="w-16 h-1 bg-white/30 rounded-full mb-6" />
                    <p className="text-white/90 text-base md:text-lg leading-relaxed">
                      {s.text}
                    </p>
                  </div>

                  <div className="w-full md:w-2/5 p-8 flex items-center justify-center bg-white">
                    <div className="relative w-full aspect-square max-w-[280px]">
                      <img
                        src={s.img}
                        alt={s.title}
                        className="w-full h-full object-contain"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/300")
                        }
                      />
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PartnerTypes;

const PartnerTypesSkaliton = () => {
  return (
    <>
      <div className="w-full py-4 animate-pulse">
        {/* Small Select Cards */}
        <div className="my-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full border-2 border-gray-100 p-4 rounded-2xl flex flex-col items-center gap-3 bg-white"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-xl"></div>
                <div className="h-4 w-24 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>

          {/* Slider Skeleton */}
          <div className="relative overflow-hidden mt-8">
            <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden h-64 flex flex-col md:flex-row">
                <div className="w-full md:w-3/5 bg-gray-200 p-8 md:p-12"></div>
                <div className="w-full md:w-2/5 p-8 bg-gray-50 flex items-center justify-center">
                    <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
