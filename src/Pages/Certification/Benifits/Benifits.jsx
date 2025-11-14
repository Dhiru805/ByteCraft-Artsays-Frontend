// import "../../store/products/product.css";
// import { useRef, useState, useEffect } from "react";
// import getAPI from "../../../api/getAPI";

// const Benifits = () => {
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
//             <div className="flex mt-3 justify-evenly gap-2 md:gap-3 px-2 md:px-0 py-2">
//                 <div className="border !border-[#FB5934] !rounded-tr-[100px] !rounded-tl-[100px] !rounded-sm p-2 md:!p-12 text-center">
//                     <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
//                         Certified pieces attract higher prices.
//                     </p>
//                     <h1 className="text-sm md:text-xl font-bold text-dark">
//                         Boosts Artwork Value
//                     </h1>
//                     <img
//                         src='./herosectionimg/boost.svg'
//                         alt="boost"
//                         className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
//                     />
//                 </div>
//                 <div className="border !border-[#FB5934] !rounded-tr-[100px] !rounded-tl-[100px] !rounded-sm p-2 md:!p-12 text-center">
//                     <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
//                         Certified pieces attract higher prices.
//                     </p>
//                     <h1 className="text-sm md:text-xl font-bold text-dark">
//                         Boosts Artwork Value
//                     </h1>
//                     <img
//                         src='./herosectionimg/boost.svg'
//                         alt="boost"
//                         className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
//                     />
//                 </div>
//                 <div className="border !border-[#FB5934] !rounded-tr-[100px] !rounded-tl-[100px] !rounded-sm p-2 md:!p-12 text-center">
//                     <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
//                         Certified pieces attract higher prices.
//                     </p>
//                     <h1 className="text-sm md:text-xl font-bold text-dark">
//                         Boosts Artwork Value
//                     </h1>
//                     <img
//                         src='./herosectionimg/boost.svg'
//                         alt="boost"
//                         className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
//                     />
//                 </div>
//             </div>
//             <div className="flex mt-0 md:!mt-3 justify-evenly gap-2 md:gap-3 px-2 md:px-0">
//                 <div className="border !border-[#FB5934] !rounded-br-[100px] !rounded-bl-[100px] !rounded-sm p-2 md:!p-12 text-center">
//                     <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
//                         Certified pieces attract higher prices.
//                     </p>
//                     <h1 className="text-sm md:text-xl font-bold text-dark">
//                         Boosts Artwork Value
//                     </h1>
//                     <img
//                         src='./herosectionimg/boost.svg'
//                         alt="boost"
//                         className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
//                     />
//                 </div>
//                 <div className="border !border-[#FB5934] !rounded-br-[100px] !rounded-bl-[100px] !rounded-sm p-2 md:!p-12 text-center">
//                     <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
//                         Certified pieces attract higher prices.
//                     </p>
//                     <h1 className="text-sm md:text-xl font-bold text-dark">
//                         Boosts Artwork Value
//                     </h1>
//                     <img
//                         src='./herosectionimg/boost.svg'
//                         alt="boost"
//                         className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
//                     />
//                 </div>
//                 <div className="border !border-[#FB5934] !rounded-br-[100px] !rounded-bl-[100px] !rounded-sm p-2 md:!p-12 text-center">
//                     <p className="text-xs md:text-lg font-medium text-black leading-relaxed mt-3 md:mt-0">
//                         Certified pieces attract higher prices.
//                     </p>
//                     <h1 className="text-sm md:text-xl font-bold text-dark">
//                         Boosts Artwork Value
//                     </h1>
//                     <img
//                         src='./herosectionimg/boost.svg'
//                         alt="boost"
//                         className="w-full h-[50px] md:h-[150px] object-contain product-img transition-all duration-300"
//                     />
//                 </div>
//             </div>

//         </div>
//     );
// };
// export default Benifits;




import "../../store/products/product.css";
import { useRef, useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const Benifits = () => {
  const scroller = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI("/api/certificate/published");
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch certificate data:", err);
      }
    };
    fetchData();
  }, []);

  const renderCard = (card, index) => (
    <div
      key={index}
      className={`border !border-[#FB5934] bg-white text-center shadow-sm
                  p-4 md:p-8 w-[320px] h-[300px] md:w-[360px] md:h-[320px]
                  flex flex-col justify-between items-center
                  ${
                    index < 3
                      ? "!rounded-tr-[100px] !rounded-tl-[100px]"
                      : "!rounded-br-[100px] !rounded-bl-[100px]"
                  }
                  !rounded-sm`}
    >
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xs md:text-lg font-medium text-black leading-relaxed mb-2">
          {card.description || "Certified pieces attract higher prices."}
        </p>
        <h1 className="text-sm md:text-xl font-bold text-dark">
          {card.title || "Boosts Artwork Value"}
        </h1>
      </div>

      {card.image && (
        <div className="h-[100px] md:h-[130px] w-full flex items-center justify-center mt-3">
          <img
            src={
              card.image.startsWith("http")
                ? card.image
                : `${process.env.REACT_APP_API_URL}/${card.image}`
            }
            alt={card.title}
            className="h-full w-auto max-w-[90%] object-contain transition-all duration-300"
          />
        </div>
      )}
    </div>
  );

  const fallbackCards = Array(6).fill({
    title: "Boosts Artwork Value",
    description: "Certified pieces attract higher prices.",
    image: "./herosectionimg/boost.svg",
  });

  const cardsToRender = data?.section1?.cards?.length
    ? data.section1.cards
    : fallbackCards;

  return (
    <div className="max-w-[1440px] mx-auto py-4">
      {/* Title */}
      <h1 className="text-lg md:text-4xl font-bold text-[#6F4D34] px-3">
        {data?.section1Heading || "Benefits of Certification"}
      </h1>

      <hr className="my-3 border-dark" />

      {/* Subtitle */}
      <p className="mt-3 text-xs md:text-lg font-medium text-black leading-relaxed px-3">
        {data?.section1Description ||
          "Ultimate protection for your masterpieces — because your art deserves nothing less"}
      </p>

      {/* Cards Grid */}
      {/* <div className="flex flex-wrap justify-center gap-4 md:gap-6 px-2 md:px-0 py-6"> */}
      <div className="flex flex-wrap justify-center gap-10 md:gap-16 px-2 md:px-0 py-10">


        {cardsToRender.map((card, index) => renderCard(card, index))}
      </div>
    </div>
  );
};

export default Benifits;

