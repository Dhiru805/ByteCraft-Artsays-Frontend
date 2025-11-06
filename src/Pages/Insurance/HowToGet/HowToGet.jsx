// import "../../store/products/product.css";
// import { useRef } from "react";

// const HowToGet = () => {
//     const scroller = useRef(null);

//     return (
//         <div className="max-w-[1440px] mx-auto py-4">
//                 {/* title */}
//                 <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
//                     Benefits of Certification
//                 </h1>

//             <hr className="my-3 border-dark" />

//             {/* Subtitle */}
//             <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
//                 Ultimate protection for your masterpieces — because your art deserves nothing less
//             </p>

//             {/* Main Layout */}
//             <div className="grid grid-cols-1 md:grid-cols-4 mt-3 justify-evenly gap-2 md:gap-3 px-2 md:px-0 py-2">
//                 <div className="col-span-1 border !border-[#FB5934] !rounded-tr-[100px] !rounded-bl-[100px] !rounded-sm p-5 !py-24 text-center">
//                     <h1 className="text-sm md:text-xl font-bold text-dark">
//                         Select Your Plan
//                     </h1>
//                     <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
//                         Choose from Basic, Standard, or Premium coverage based on your artwork’s value and protection needs.
//                     </p>
//                 </div>
//                 <div className="col-span-1 border !border-[#FB5934] !rounded-tr-[100px] !rounded-bl-[100px] !rounded-sm p-5 !py-24 text-center">
//                     <h1 className="text-sm md:text-xl font-bold text-dark">
//                         Select Your Plan
//                     </h1>
//                     <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
//                         Choose from Basic, Standard, or Premium coverage based on your artwork’s value and protection needs.
//                     </p>
//                 </div>
//                 <div className="col-span-1 border !border-[#FB5934] !rounded-tr-[100px] !rounded-bl-[100px] !rounded-sm p-5 !py-24 text-center">
//                     <h1 className="text-sm md:text-xl font-bold text-dark">
//                         Select Your Plan
//                     </h1>
//                     <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
//                         Choose from Basic, Standard, or Premium coverage based on your artwork’s value and protection needs.
//                     </p>
//                 </div>
//                 <div className="col-span-1 border !border-[#FB5934] !rounded-tr-[100px] !rounded-bl-[100px] !rounded-sm p-5 !py-24 text-center">
//                     <h1 className="text-sm md:text-xl font-bold text-dark">
//                         Select Your Plan
//                     </h1>
//                     <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
//                         Choose from Basic, Standard, or Premium coverage based on your artwork’s value and protection needs.
//                     </p>
//                 </div>
//             </div>

//         </div>
//     );
// };
// export default HowToGet;




import "../../store/products/product.css";
import { useRef, useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const HowToGet = () => {
  const scroller = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI("/api/insurance/published", {}, false, false);
        const insuranceData = Array.isArray(res.data.data)
          ? res.data.data.find((p) => p.status === "published") ||
            res.data.data[0]
          : res.data.data;
        setData(insuranceData);
      } catch (error) {
        console.error("Error fetching How To Get data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-[1440px] mx-auto py-4">
      {/* title */}
      <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
        {data?.section2Heading || "Benefits of Certification"}
      </h1>

      <hr className="my-3 border-dark" />

      {/* Subtitle */}
      <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
        {data?.section2Description ||
          "Ultimate protection for your masterpieces — because your art deserves nothing less"}
      </p>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 mt-3 justify-evenly gap-2 md:gap-3 px-2 md:px-0 py-2">
        {data?.section2Cards?.map((card, index) => (
          <div
            key={index}
            className="col-span-1 border !border-[#FB5934] !rounded-tr-[100px] !rounded-bl-[100px] !rounded-sm p-5 !py-24 text-center flex flex-col justify-center"
          >
            <h1 className="text-sm md:text-xl font-bold text-dark mb-2">
              {card.title}
            </h1>
            <p
              className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0 line-clamp-3 overflow-hidden text-ellipsis break-words"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {card.description}
            </p>
          </div>

        ))}
      </div>
    </div>
  );
};

export default HowToGet;
