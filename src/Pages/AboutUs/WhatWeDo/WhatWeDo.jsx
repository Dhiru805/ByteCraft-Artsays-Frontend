// import { useState } from "react";
// import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

// const WhatWeDo = () => {
//   const [openIndex, setOpenIndex] = useState(0); // start with first open

//   const toggle = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   const items = [
//     {
//       title: "Connect Artists Across World",
//       content:
//         "To succeed you must believe. When you believe, you sill succeed. Surround yourself with angels, positive energy, beautiful people, beautiful souls, clean heart, angel. Let me be clear, ypu have to make it through the jungle to make it ti paradise, that’s they the key, Lion! Lion!",
//     },
//     {
//       title: "We build your Dream",
//       content:
//         "To succeed you must believe. When you believe, you sill succeed. Surround yourself with angels, positive energy, beautiful people, beautiful souls, clean heart, angel. Let me be clear, ypu have to make it through the jungle to make it ti paradise, that’s they the key, Lion! Lion!",
//     },
//     {
//       title: "Provide creator storefronts for selling originals & prints",
//       content:
//         "To succeed you must believe. When you believe, you sill succeed. Surround yourselfjxiskj Let me be clear, ypu have to make it through the jungle to make it ti paradise, that’s they the key, Lion! Lion!",
//     },
//     {
//       title: "Enable Global Art Bidding",
//       content:
//         "To succeed you must believe. When you believe, you sill succeed. Surround yourself with angels, positive energy, beautiful people, beautiful souls, clean heart, angel. Let me be clear, ypu have to make it through the jungle to make it ti paradise, that’s they the key, Lion! Lion!",
//     },
//   ];

//   return (
//     <div className="max-w-[1440px] mx-auto py-3 my-5">
//       <div>
//         <h1 className="text-lg md:text-4xl font-bold text-orange-500 px-3">
//           Who We Are
//         </h1>

//         <hr className="my-3 border-dark" />

//         <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
//           ArtSays is a creator-first platform built for artists of every style,
//           from digital dreamers to traditional painters. We believe that art is
//           more than visuals — it’s stories, emotions, and connections. Our
//           mission? To make sure every artist finds their stage and every
//           audience finds art that speaks to them.
//         </p>
//       </div>
//      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-3 sm:px-6 my-5">
//         <div className="order-2 md:!order-1 content-center justify-items-center">
//           <div className="space-y-3">
//             {items.map((item, index) => (
//               <div key={index} className="border rounded-lg shadow">
//                 <button
//                   onClick={() => toggle(index)}
//                   className="w-full flex justify-between items-center p-4 text-lg font-bold text-left"
//                 >
//                   {item.title}
//                   <span>
//                     {openIndex === index ? (
//                       <IoIosArrowUp />
//                     ) : (
//                       <IoIosArrowDown />
//                     )}
//                   </span>
//                 </button>

//               
//                 <div
//                   className={`transition-all duration-500 ease-in-out overflow-hidden ${
//                     openIndex === index
//                       ? "max-h-96 opacity-100"
//                       : "max-h-0 opacity-0"
//                   }`}
//                 >
//                   <div className="px-4 pb-4 text-gray-600">{item.content}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="order-1 md:!order-2 content-center justify-items-center">
//           <img src="/herosectionimg/whatwedo.svg" alt="" />
//         </div>
//       </div>
//     </div>
//   );
// };
// export default WhatWeDo;




import { useState, useEffect } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import getAPI from "../../../api/getAPI";

const WhatWeDo = () => {
  const [openIndex, setOpenIndex] = useState(0); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchWhatWeDo = async () => {
      try {
        const pageRes = await getAPI("/api/about-us/published");
        const aboutUsPage = pageRes.data.data;

        if (!aboutUsPage?._id) throw new Error("No published About Us page found");

        const sectionRes = await getAPI(
          `/api/about-us-sections/what-we-do/${aboutUsPage._id}`
        );
        if (!sectionRes.data.success) throw new Error("What We Do section not found");

        setData(sectionRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWhatWeDo();
  }, []);

  if (loading) return <div>{WhatWeDoSkeleton() }</div>;
  if (!data) return <div>What We Do section not available</div>;

  return (
    <div className="max-w-[1440px] mx-auto py-3 my-5">
    
      <div>
        <h1 className="text-lg md:text-4xl font-bold text-orange-500 px-3">
          {data.heading || "What We Do"}
        </h1>
        <hr className="my-3 border-dark" />
        <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed px-3">
          {data.description || "Description not available for this section."}
        </p>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-3 sm:px-6 my-5">
    
        {/* <div className="order-2 md:!order-1 content-center justify-items-center">
          <div className="space-y-3">
            {data.cards?.map((card, index) => (
              <div key={index} className="border rounded-lg shadow">
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex justify-between items-center p-4 text-lg font-bold text-left"
                >
                  {card.cardHeading}
                  <span>
                    {openIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </button>*/}

        
        {/*<div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 pb-4 text-gray-600">{card.cardDescription}</div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
        <div className="order-2 md:!order-1 flex flex-col items-center space-y-3 w-full">
          {data.cards?.map((card, index) => (
            <div
              key={index}
              className="border rounded-lg shadow w-full max-w-[1000px]" 
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-4 text-lg font-bold text-left"
              >
                {card.cardHeading}
                <span>
                  {openIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </span>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="px-4 pb-4 text-gray-600">{card.cardDescription}</div>
              </div>
            </div>
          ))}
        </div>



        <div className="order-1 md:!order-2 content-center justify-items-center">
          {data.image && (
            <img
              src={`${imageBaseURL}/${data.image}`}
              alt="What We Do"
              className="w-full h-auto object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;

// WhatWeDoSkeleton.jsx
 function WhatWeDoSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto py-3 my-5 animate-pulse">
      
      {/* Heading + Description */}
      <div>
        <div className="h-8 w-1/3 bg-gray-300 rounded mx-3"></div>

        <hr className="my-3 border-dark opacity-30" />

        <div className="px-3 space-y-2 mt-3">
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Cards + Image Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-3 sm:px-6 my-5">
        
        {/* Left: Accordion Skeletons */}
        <div className="order-2 md:!order-1 flex flex-col items-center space-y-3 w-full">

          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg shadow w-full max-w-[1000px] p-4">
              <div className="flex justify-between items-center">
                <div className="h-6 w-2/3 bg-gray-300 rounded"></div>
                <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}

        </div>

        {/* Right: Image Skeleton */}
        <div className="order-1 md:!order-2 content-center justify-items-center">
          <div className="w-full h-[250px] md:h-[350px] bg-gray-300 rounded-lg"></div>
        </div>

      </div>
    </div>
  );
}
