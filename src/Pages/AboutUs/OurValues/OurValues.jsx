

import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";
import { getImageUrl } from '../../../utils/getImageUrl';

const OurValues = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchOurValues = async () => {
      try {
     
        const pageRes = await getAPI("/api/about-us/published");
        const aboutUsPage = pageRes.data.data;

        if (!aboutUsPage?._id) throw new Error("No published About Us page found");

        const sectionRes = await getAPI(
          `/api/about-us-sections/our-values/${aboutUsPage._id}`
        );
        if (!sectionRes.data.success) throw new Error("Our Values section not found");

        const sectionData = sectionRes.data.data;
        if (sectionData.cards?.length) {
          sectionData.cards = sectionData.cards.map((card) => ({
            cardTitle: card.cardTitle,
            cardImage: card.cardImage ? getImageUrl(card.cardImage) : null,
          }));
        }

        setData(sectionData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOurValues();
  }, []);

  if (loading) return <div><ValuesSkeleton /></div>;
  if (!data) return null;

  return (
    <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
            {data.heading || "Our Values"}
          </h2>
          <div className="w-16 h-1 bg-[#6F4D34] rounded-full mx-auto" />
          <p className="text-lg text-gray-600 leading-relaxed font-medium max-w-3xl mx-auto">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.cards?.map((card, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center transition-all hover:bg-white hover:shadow-md hover:border-[#6F4D34]/20 group/card">
              <div className="w-full aspect-square mb-6 overflow-hidden rounded-xl bg-white p-4 flex items-center justify-center border border-gray-50 group-hover/card:scale-105 transition-transform">
                {card.cardImage ? (
                  <img
                    src={card.cardImage}
                    alt={card.cardTitle}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-300">No Image</div>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-800 group-hover/card:text-[#6F4D34] transition-colors">
                {card.cardTitle}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurValues;


// ValuesSkeleton.jsx
 function ValuesSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto py-3 animate-pulse">
      
      {/* Heading */}
      <div className="px-3">
        <div className="h-8 w-1/3 bg-gray-300 rounded"></div>

        <hr className="my-3 border-dark opacity-30" />

        <div className="space-y-2 mt-3">
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="my-5 px-3">
        <main className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:!gap-6">

            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full mx-auto border rounded-2xl shadow-2xl p-3"
              >
                {/* Image block */}
                <div className="w-full h-28 sm:h-44 bg-gray-300 rounded-t-2xl"></div>

                {/* Title */}
                <div className="mt-3 flex justify-center">
                  <div className="h-5 w-24 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}

          </div>
        </main>
      </div>

    </div>
  );
}
