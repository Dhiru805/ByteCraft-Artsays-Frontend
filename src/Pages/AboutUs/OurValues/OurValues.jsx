// const OurValues = () => {
//   return (
//     <div className="max-w-[1440px] mx-auto py-3">
//       <div className="col-span-2 content-center">
//         <h1 className="text-lg md:text-4xl font-bold text-orange-500 px-3">
//           Our Values
//         </h1>

//         <hr className="my-3 border-dark" />

//         <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//           ArtSays is a creator-first platform built for artists of every style,
//           from digital dreamers to traditional painters. We believe that art is
//           more than visuals — it’s stories, emotions, and connections. Our
//           mission? To make sure every artist finds their stage and every
//           audience finds art that speaks to them.
//         </p>
//         <div className="my-5">
//           <main className="md:col-span-3 px-3">
//             <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:!gap-6">
//               <div className="w-full mx-auto border rounded-2xl shadow-2xl p-3">
//                 {/* Premium Label */}
//                 <div className="relative">
//                   {/* Product Image */}
//                   <img
//                     src="/herosectionimg/value1.svg"
//                     alt="Beauty of Joseon Mandala Art"
//                     className="w-full h-28 sm:h-44 object-contain rounded-t-2xl product-img"
//                   />
//                 </div>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   Celebrating every style & idea
//                 </h2>
//               </div>

//               <div className="w-full mx-auto border rounded-2xl shadow-2xl p-3">
//                 {/* Premium Label */}
//                 <div className="relative">
//                   {/* Product Image */}
//                   <img
//                     src="/herosectionimg/value2.svg"
//                     alt="Beauty of Joseon Mandala Art"
//                     className="w-full h-28 sm:h-44 object-contain rounded-t-2xl product-img"
//                   />
//                 </div>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   Uplifting each other with respect
//                 </h2>
//               </div>

//               <div className="w-full mx-auto border rounded-2xl shadow-2xl p-3">
//                 {/* Premium Label */}
//                 <div className="relative">
//                   {/* Product Image */}
//                   <img
//                     src="/herosectionimg/value3.svg"
//                     alt="Beauty of Joseon Mandala Art"
//                     className="w-full h-28 sm:h-44 object-contain rounded-t-2xl product-img"
//                   />
//                 </div>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   Real stories, real growth
//                 </h2>
//               </div>

//               <div className="w-full mx-auto border rounded-2xl shadow-2xl p-3">
//                 {/* Premium Label */}
//                 <div className="relative">
//                   {/* Product Image */}
//                   <img
//                     src="/herosectionimg/value4.svg"
//                     alt="Beauty of Joseon Mandala Art"
//                     className="w-full h-28 sm:h-44 object-contain rounded-t-2xl product-img"
//                   />
//                 </div>
//                 <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
//                   Making art open to all
//                 </h2>
//               </div>

//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default OurValues;



import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const OurValues = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

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
            cardImage: card.cardImage ? `${imageBaseURL}/${card.cardImage}` : null,
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

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Our Values section not available</div>;

  return (
    <div className="max-w-[1440px] mx-auto py-3">
      <div className="col-span-2 content-center">
        <h1 className="text-lg md:text-4xl font-bold text-orange-500 px-3">
          {data.heading || "Our Values"}
        </h1>

        <hr className="my-3 border-dark" />

        <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
          {data.description}
        </p>

        <div className="my-5">
          <main className="md:col-span-3 px-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:!gap-6">
              {data.cards?.map((card, idx) => (
                <div key={idx} className="w-full mx-auto border rounded-2xl shadow-2xl p-3">
                  <div className="relative">
                    {card.cardImage ? (
                      <img
                        src={card.cardImage}
                        alt={card.cardTitle}
                        className="w-full h-28 sm:h-44 object-contain rounded-t-2xl product-img"
                      />
                    ) : (
                      <div className="w-full h-28 sm:h-44 bg-gray-100 rounded-t-2xl flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg text-dark font-semibold mt-1 p-3 text-center">
                    {card.cardTitle}
                  </h2>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OurValues;
