// import "../../store/products/product.css";

// const HowToPartner = () => {

//     return (
//         <div className="max-w-[1440px] mx-auto py-4">
//             {/* title */}
//             <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//                 How to Partner
//             </h1>

//             <hr className="my-3 border-dark" />

//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//                 Let’s create meaningful experiences together.
//             </p>

//             {/* Main Layout */}
//             <div className="justify-center gap-6 my-3">
//                 <div className="md:flex justify-center gap-6 px-3 md:px-0 my-6">
//                     <div className="w-full md:w-2/4 border border-gray-700 bg-[#FEE2CC] rounded-xl p-4 mb-6 md:mb-0">
//                         <div className="grid grid-cols-1 md:grid-cols-6 h-full gap-6">
//                             <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center place-self-start self-end bg-transparent">
//                                 <img src="/herosectionimg/01.svg" alt="" />
//                             </aside>
//                             <main className="md:col-span-4 content-center">
//                                 <div>
//                                     <h1 className="text-sm md:text-xl font-bold text-[#48372D] text-end">
//                                         Fill the Partnership Form
//                                     </h1>
//                                     <hr className="my-3 border-dark" />
//                                     <p className="mt-3 text-xs md:text-lg font-medium text-[#48372D] leading-relaxed text-end">
//                                         Fill out the Commission Request Form with details about your concept, size, medium, and budget.
//                                     </p>
//                                 </div>
//                             </main>

//                         </div>
//                     </div>
//                     <div className="w-full md:w-2/4 border border-gray-700 bg-[#FEE2CC] rounded-xl p-4 mb-6 md:mb-0">
//                         <div className="grid grid-cols-1 md:grid-cols-6 h-full gap-6">
//                             <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center place-self-start self-end bg-transparent">
//                                 <img src="/herosectionimg/01.svg" alt="" />
//                             </aside>
//                             <main className="md:col-span-4 content-center">
//                                 <div>
//                                     <h1 className="text-sm md:text-xl font-bold text-[#48372D] text-end">
//                                         Fill the Partnership Form
//                                     </h1>
//                                     <hr className="my-3 border-dark" />
//                                     <p className="mt-3 text-xs md:text-lg font-medium text-[#48372D] leading-relaxed text-end">
//                                         Fill out the Commission Request Form with details about your concept, size, medium, and budget.
//                                     </p>
//                                 </div>
//                             </main>

//                         </div>
//                     </div>
//                 </div>
//                 <div className="md:flex justify-center gap-6 px-3 md:px-0 my-6">
//                     <div className="w-full md:w-2/4 border border-gray-700 bg-[#FEE2CC] rounded-xl p-4 mb-6 md:mb-0">
//                         <div className="grid grid-cols-1 md:grid-cols-6 h-full gap-6">
//                             <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center place-self-start self-end bg-transparent">
//                                 <img src="/herosectionimg/01.svg" alt="" />
//                             </aside>
//                             <main className="md:col-span-4 content-center">
//                                 <div>
//                                     <h1 className="text-sm md:text-xl font-bold text-[#48372D] text-end">
//                                         Fill the Partnership Form
//                                     </h1>
//                                     <hr className="my-3 border-dark" />
//                                     <p className="mt-3 text-xs md:text-lg font-medium text-[#48372D] leading-relaxed text-end">
//                                         Fill out the Commission Request Form with details about your concept, size, medium, and budget.
//                                     </p>
//                                 </div>
//                             </main>

//                         </div>
//                     </div>
//                     <div className="w-full md:w-2/4 border border-gray-700 bg-[#FEE2CC] rounded-xl p-4 mb-6 md:mb-0">
//                         <div className="grid grid-cols-1 md:grid-cols-6 h-full gap-6">
//                             <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center place-self-start self-end bg-transparent">
//                                 <img src="/herosectionimg/01.svg" alt="" />
//                             </aside>
//                             <main className="md:col-span-4 content-center">
//                                 <div>
//                                     <h1 className="text-sm md:text-xl font-bold text-[#48372D] text-end">
//                                         Fill the Partnership Form
//                                     </h1>
//                                     <hr className="my-3 border-dark" />
//                                     <p className="mt-3 text-xs md:text-lg font-medium text-[#48372D] leading-relaxed text-end">
//                                         Fill out the Commission Request Form with details about your concept, size, medium, and budget.
//                                     </p>
//                                 </div>
//                             </main>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default HowToPartner;

import "../../store/products/product.css";
import React, { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const HowToPartner = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="text-center py-4"><HowToPartnerSkaliton /></div>;
  if (error)
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-center py-4">No data available</div>;

  const cards = (data.section2Cards || []).map((card) => ({
    ...card,
    image: card.image.startsWith("http")
      ? card.image
      : `${process.env.REACT_APP_API_URL}/${card.image}`,
  }));

  return (
    <div className="max-w-[1440px] mx-auto py-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3 mb-4">
          {data.section2Heading || "How to Partner"}
        </h1>

        <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mb-6"></div>
        <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
          {data.section2Description ||
            "Let’s create meaningful experiences together."}
        </p>
      </div>
      <div className="justify-center gap-6 my-3">
        {cards.length > 0 && (
          <>
            <div className="md:flex justify-center gap-6 px-3 md:px-0 my-6">
              {cards.slice(0, 2).map((card, index) => (
                <div
                  key={index}
                  className="w-full md:w-2/4 border border-gray-700 bg-[#FEE2CC] rounded-xl p-4 mb-6 md:mb-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 h-full gap-6">
                    <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center place-self-start self-end bg-transparent">
                      <img src={card.image} alt={card.title} />
                    </aside>
                    <main className="md:col-span-4 content-center">
                      <div>
                        <h1 className="text-sm md:text-xl font-bold text-[#48372D] text-end">
                          {card.title}
                        </h1>
                        <hr className="my-3 border-dark" />
                        <p className="mt-3 text-xs md:text-lg font-medium text-[#48372D] leading-relaxed text-end">
                          {card.description}
                        </p>
                      </div>
                    </main>
                  </div>
                </div>
              ))}
            </div>
            {cards.length > 2 && (
              <div className="md:flex justify-center gap-6 px-3 md:px-0 my-6">
                {cards.slice(2, 4).map((card, index) => (
                  <div
                    key={index + 2}
                    className="w-full md:w-2/4 border border-gray-700 bg-[#FEE2CC] rounded-xl p-4 mb-6 md:mb-0"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 h-full gap-6">
                      <aside className="md:col-span-2 rounded-xl filter-sidebar flex justify-center place-self-start self-end bg-transparent">
                        <img src={card.image} alt={card.title} />
                      </aside>
                      <main className="md:col-span-4 content-center">
                        <div>
                          <h1 className="text-sm md:text-xl font-bold text-[#48372D] text-end">
                            {card.title}
                          </h1>
                          <hr className="my-3 border-dark" />
                          <p className="mt-3 text-xs md:text-lg font-medium text-[#48372D] leading-relaxed text-end">
                            {card.description}
                          </p>
                        </div>
                      </main>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default HowToPartner;

const HowToPartnerSkaliton = () => {
  return (
    <>
      <div className="max-w-[1440px] mx-auto py-4 animate-pulse">
        {/* Heading Skeleton */}
        <div className="h-6 md:h-10 w-40 md:w-72 bg-gray-300 rounded mx-3"></div>

        <hr className="my-3 border-dark" />

        {/* Description Skeleton */}
        <div className="h-4 md:h-6 w-2/3 bg-gray-300 rounded mx-3 mt-3"></div>

        {/* MAIN CARD SECTIONS */}
        <div className="justify-center gap-6 my-6">
          {/* FIRST ROW – 2 CARDS */}
          <div className="md:flex justify-center gap-6 px-3 md:px-0 my-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="w-full md:w-2/4 border border-gray-300 bg-gray-200 rounded-xl p-4 mb-6 md:mb-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-6 h-full gap-6">
                  {/* Image Skeleton */}
                  <div className="md:col-span-2 rounded-xl bg-gray-300 h-32"></div>

                  {/* Content Skeleton */}
                  <div className="md:col-span-4 flex flex-col justify-center">
                    <div className="h-5 md:h-6 w-1/2 bg-gray-300 rounded self-end"></div>

                    <hr className="my-3 border-dark" />

                    <div className="space-y-2 self-end w-full">
                      <div className="h-3 md:h-4 w-3/4 bg-gray-300 rounded"></div>
                      <div className="h-3 md:h-4 w-2/3 bg-gray-300 rounded"></div>
                      <div className="h-3 md:h-4 w-1/2 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SECOND ROW – 2 CARDS */}
          <div className="md:flex justify-center gap-6 px-3 md:px-0 my-6">
            {[1, 2].map((i) => (
              <div
                key={`row2-${i}`}
                className="w-full md:w-2/4 border border-gray-300 bg-gray-200 rounded-xl p-4 mb-6 md:mb-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-6 h-full gap-6">
                  {/* Image Skeleton */}
                  <div className="md:col-span-2 rounded-xl bg-gray-300 h-32"></div>

                  {/* Content Skeleton */}
                  <div className="md:col-span-4 flex flex-col justify-center">
                    <div className="h-5 md:h-6 w-1/2 bg-gray-300 rounded self-end"></div>

                    <hr className="my-3 border-dark" />

                    <div className="space-y-2 self-end w-full">
                      <div className="h-3 md:h-4 w-3/4 bg-gray-300 rounded"></div>
                      <div className="h-3 md:h-4 w-2/3 bg-gray-300 rounded"></div>
                      <div className="h-3 md:h-4 w-1/2 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
