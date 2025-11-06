// import "../../store/products/product.css";
// import { FaStar } from "react-icons/fa6";

// const InsurancePlan = () => {

//     return (
//         <div className="max-w-[1440px] mx-auto py-4">
//             {/* title */}
//             <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//                 Insurance Plans
//             </h1>

//             <hr className="my-3 border-dark" />

//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//                 Safeguard your creativity, confidence, and investment — every brushstroke matters.
//             </p>

//             {/* Main Layout */}
//             <div className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
//                 <div className="w-full md:w-1/3 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0 shadow-lg">
//                         <main className="md:col-span-2 content-end">
//                             <div>
//                                 <h1 className="text-sm md:text-xl font-bold text-dark">
//                                     Basic Cover
//                                 </h1>
//                                 <hr className="my-2 border-dark" />
//                                 <p className="text-xs md:text-lg font-medium text-black leading-relaxed">
//                                     Secure what you collect.
//                                 </p>
//                             </div>
//                             <div className="my-5">
//                                 <h1 className="text-sm md:text-xl font-bold text-dark">
//                                      ₹399/month
//                                 </h1>
//                                 <p className="text-xs md:text-md font-medium text-black leading-relaxed">
//                                     Pause or Cancel anytime
//                                 </p>
//                             </div>
//                             <div className="my-3">
//                                 <h1 className="text-sm md:text-lg font-semibold text-dark">
//                                      Eligibility - For registered Artists, Verified Sellers and Art collectors on Artsays
//                                 </h1>
//                             </div>
//                             <div className="border my-3 p-3 bg-[#FFF2E7] rounded-xl">
//                                 <tr>
//                                     <td><FaStar className="text-[#FF725E]"/></td>
//                                     <td className="pl-2">Covers accidental damage </td>
//                                 </tr>
//                                 <tr>
//                                     <td><FaStar className="text-[#FF725E]"/></td>
//                                     <td className="pl-2">Covers accidental damage </td>
//                                 </tr>
//                                 <tr>
//                                     <td><FaStar className="text-[#FF725E]"/></td>
//                                     <td className="pl-2">Covers accidental damage </td>
//                                 </tr>
//                             </div>
                            
//                         </main>
//                         <button className="w-full flex bg-red-500 text-white py-2 px-6 my-2 rounded-full justify-center font-semibold shadow buy-now">
//                             Get Insurance
//                         </button>
//                 </div>
//                 <div className="w-full md:w-1/3 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0 shadow-lg">
//                         <main className="md:col-span-2 content-end">
//                             <div>
//                                 <h1 className="text-sm md:text-xl font-bold text-dark">
//                                 Standard Cover
//                                 </h1>
//                                 <hr className="my-2 border-dark" />
//                                 <p className="text-xs md:text-lg font-medium text-black leading-relaxed">
//                                     Secure what you collect.
//                                 </p>
//                             </div>
//                             <div className="my-5">
//                                 <h1 className="text-sm md:text-xl font-bold text-dark">
//                                      ₹999/month
//                                 </h1>
//                                 <p className="text-xs md:text-md font-medium text-black leading-relaxed">
//                                     Pause or Cancel anytime
//                                 </p>
//                             </div>
//                             <div className="my-3">
//                                 <h1 className="text-sm md:text-lg font-semibold text-dark">
//                                      Eligibility - For registered Artists, Verified Sellers and Art collectors on Artsays
//                                 </h1>
//                             </div>
//                             <div className="border my-3 p-3 bg-[#FFF2E7] rounded-xl">
//                                 <tr>
//                                     <td><FaStar className="text-[#FF725E]"/></td>
//                                     <td className="pl-2">Covers accidental damage </td>
//                                 </tr>
//                                 <tr>
//                                     <td><FaStar className="text-[#FF725E]"/></td>
//                                     <td className="pl-2">Covers accidental damage </td>
//                                 </tr>
//                                 <tr>
//                                     <td><FaStar className="text-[#FF725E]"/></td>
//                                     <td className="pl-2">Covers accidental damage </td>
//                                 </tr>
//                             </div>
                            
//                         </main>
//                         <button className="w-full flex bg-red-500 text-white py-2 px-6 my-2 rounded-full justify-center font-semibold shadow buy-now">
//                             Get Insurance
//                         </button>
//                 </div>
//                 <div className="w-full md:w-1/3 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0 shadow-lg">
//                         <main className="md:col-span-2 content-end">
//                             <div>
//                                 <h1 className="text-sm md:text-xl font-bold text-dark">
//                                     Premium Cover
//                                 </h1>
//                                 <hr className="my-2 border-dark" />
//                                 <p className="text-xs md:text-lg font-medium text-black leading-relaxed">
//                                     Secure what you collect.
//                                 </p>
//                             </div>
//                             <div className="my-5">
//                                 <h1 className="text-sm md:text-xl font-bold text-dark">
//                                      ₹2999/month
//                                 </h1>
//                                 <p className="text-xs md:text-md font-medium text-black leading-relaxed">
//                                     Pause or Cancel anytime
//                                 </p>
//                             </div>
//                             <div className="my-3">
//                                 <h1 className="text-sm md:text-lg font-semibold text-dark">
//                                      Eligibility - For registered Artists, Verified Sellers and Art collectors on Artsays
//                                 </h1>
//                             </div>
//                             <div className="border my-3 p-3 bg-[#FFF2E7] rounded-xl">
//                                 <tr>
//                                     <td><FaStar className="text-[#FF725E]"/></td>
//                                     <td className="pl-2">Covers accidental damage </td>
//                                 </tr>
//                                 <tr>
//                                     <td><FaStar className="text-[#FF725E]"/></td>
//                                     <td className="pl-2">Covers accidental damage </td>
//                                 </tr>
//                                 <tr>
//                                     <td><FaStar className="text-[#FF725E]"/></td>
//                                     <td className="pl-2">Covers accidental damage </td>
//                                 </tr>
//                             </div>
                            
//                         </main>
//                         <button className="w-full flex bg-red-500 text-white py-2 px-6 my-2 rounded-full justify-center font-semibold shadow buy-now">
//                             Get Insurance
//                         </button>
//                 </div>

//             </div>

//         </div>
//     );
// };
// export default InsurancePlan;
























// import "../../store/products/product.css";
// import { FaStar } from "react-icons/fa6";
// import { useState, useEffect } from "react";
// import getAPI from "../../../api/getAPI";

// const InsurancePlan = () => {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await getAPI("/api/insurance/published", {}, false, false);
//                 const insuranceData = Array.isArray(res.data.data) ? res.data.data.find(p => p.status === "published") || res.data.data[0] : res.data.data;
//                 setData(insuranceData);
//             } catch (error) {
//                 console.error("Error fetching Insurance Plan data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     if (loading) return <div>Loading...</div>;

//     return (
//         <div className="max-w-[1440px] mx-auto py-4">
//             {/* title */}
//             <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//                 {data?.section3Heading || "Insurance Plans"}
//             </h1>

//             <hr className="my-3 border-dark" />

//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//                 {data?.section3Description || "Safeguard your creativity, confidence, and investment — every brushstroke matters."}
//             </p>

//             {/* Main Layout */}
//             <div className="md:flex justify-center gap-6 px-3 sm:px-6 my-3">
//                 {data?.section3Cards?.map((card, index) => (
//                     <div key={index} className="w-full md:w-1/3 border border-gray-700 rounded-2xl p-4 mb-6 md:mb-0 shadow-lg">
//                         <main className="md:col-span-2 content-end">
//                             <div>
//                                 <h1 className="text-sm md:text-xl font-bold text-dark">
//                                     {card.title}
//                                 </h1>
//                                 <hr className="my-2 border-dark" />
//                                 <p className="text-xs md:text-lg font-medium text-black leading-relaxed">
//                                     {card.description}
//                                 </p>
//                             </div>
//                             <div className="my-5">
//                                 <h1 className="text-sm md:text-xl font-bold text-dark">
//                                     {card.price}
//                                 </h1>
//                                 <p className="text-xs md:text-md font-medium text-black leading-relaxed">
//                                     Pause or Cancel anytime
//                                 </p>
//                             </div>
//                             <div className="my-3">
//                                 <h1 className="text-sm md:text-lg font-semibold text-dark">
//                                     {card.eligibility}
//                                 </h1>
//                             </div>
//                             <div className="border my-3 p-3 bg-[#FFF2E7] rounded-xl">
//                                 {card.features?.map((feature, idx) => (
//                                     <tr key={idx}>
//                                         <td><FaStar className="text-[#FF725E]"/></td>
//                                         <td className="pl-2">{feature}</td>
//                                     </tr>
//                                 ))}
//                             </div>

//                         </main>
//                         <button className="w-full flex bg-red-500 text-white py-2 px-6 my-2 rounded-full justify-center font-semibold shadow buy-now">
//                             Get Insurance
//                         </button>
//                     </div>

//                 ))}
//             </div>

        

//         </div>
//     );
// };
// export default InsurancePlan;



















import "../../store/products/product.css";
import { FaStar } from "react-icons/fa6";
import { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const InsurancePlan = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI("/api/insurance/published", {}, false, false);
        const insuranceData = Array.isArray(res.data.data)
          ? res.data.data.find((p) => p.status === "published") || res.data.data[0]
          : res.data.data;
        setData(insuranceData);
      } catch (error) {
        console.error("Error fetching Insurance Plan data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;

  return (
    <div className="max-w-[1440px] mx-auto py-4">
      {/* Title */}
      <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
        {data?.section3Heading || "Insurance Plans"}
      </h1>

      <hr className="my-3 border-dark" />

      {/* Subtitle */}
      <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
        {data?.section3Description ||
          "Safeguard your creativity, confidence, and investment — every brushstroke matters."}
      </p>

      {/* Cards Layout */}
      <div className="md:flex justify-center gap-6 px-3 sm:px-6 my-3 flex-wrap">
        {data?.section3Cards?.length > 0 ? (
          data.section3Cards.map((card, index) => (
            <div
              key={index}
              className="w-full md:w-1/3 border border-gray-700 rounded-2xl p-4 mb-6 shadow-lg"
            >
              <main className="md:col-span-2 content-end">
                {/* Heading + Description */}
                <div>
                  <h1 className="text-sm md:text-xl font-bold text-dark">
                    {card.heading || "Untitled Plan"}
                  </h1>
                  <hr className="my-2 border-dark" />
                  <p className="text-xs md:text-lg font-medium text-black leading-relaxed">
                    {card.description || ""}
                  </p>
                </div>

                {/* Price + Cancel Condition */}
                <div className="my-5">
                  <h1 className="text-sm md:text-xl font-bold text-dark">
                    {card.price || ""}
                  </h1>
                  <p className="text-xs md:text-md font-medium text-black leading-relaxed">
                    {card.cancelCondition || "Pause or Cancel anytime"}
                  </p>
                </div>

                {/* Eligibility */}
                {card.eligibility && (
                  <div className="my-3">
                    <h1 className="text-sm md:text-lg font-semibold text-dark">
                      {card.eligibility}
                    </h1>
                  </div>
                )}

                {/* Pointers */}
                {card.pointers?.length > 0 && (
                  <div className="border my-3 p-3 bg-[#FFF2E7] rounded-xl">
                    {card.pointers.map((point, idx) => (
                      <tr key={idx}>
                        <td>
                          <FaStar className="text-[#FF725E]" />
                        </td>
                        <td className="pl-2">{point}</td>
                      </tr>
                    ))}
                  </div>
                )}
              </main>

              {/* Button */}
              <button
                onClick={() => {
                  if (card.buttonLink) window.open(card.buttonLink, "_blank");
                }}
                className="w-full flex bg-red-500 text-white py-2 px-6 my-2 rounded-full justify-center font-semibold shadow buy-now"
              >
                {card.buttonName || "Get Insurance"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full py-10">
            No insurance plans available.
          </p>
        )}
      </div>
    </div>
  );
};

export default InsurancePlan;
