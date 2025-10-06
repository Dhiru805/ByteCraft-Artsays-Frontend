// import React, { useEffect, useRef, useState } from "react";

// const steps = [
//   {
//     step: "Step 1",
//     title: "Order Confirmation",
//     desc: "Once you place an order for your favorite artwork, you’ll instantly receive an email confirmation with all details of your purchase. Artists also get notified to begin preparing your piece.",
//   },
//   {
//     step: "Step 2",
//     title: "Artwork Preparation",
//     desc: (
//       <>
//         <strong>For Originals -</strong> The artist carefully packs the artwork
//         using secure, eco-friendly materials to keep it safe during transit.
//         <br />
//         <br />
//         <strong>For Prints/Merch -</strong> High-quality prints are created on
//         premium material and double-checked for color accuracy.
//       </>
//     ),
//   },
//   {
//     step: "Step 3",
//     title: "Quality Check",
//     desc: "Every package goes through a final quality check to ensure your artwork is exactly as promised — flawless, fresh, and gallery-ready.",
//   },
//   {
//     step: "Step 4",
//     title: "Dispatch & Tracking",
//     desc: "As soon as your order is shipped, you’ll receive a tracking ID so you can follow your art’s journey right to your doorstep.",
//   },
//   {
//     step: "Step 5",
//     title: "Estimated Delivery Time",
//     desc: "Domestic orders: 5–7 business days\nInternational orders: 10–15 business days (may vary based on customs)",
//   },
//   {
//     step: "Step 6",
//     title: "Safe Arrival",
//     desc: "Our delivery partners are trained to handle artwork with care. In case of any damage during transit, our Money Back Guarantee & Refund Policy has you covered.",
//   },
// ];

// const DeliveryProcess = () => {
//   const containerRef = useRef(null);
//   const dotRefs = useRef([]);
//   const [activeIndex, setActiveIndex] = useState(-1);
//   const [progressHeight, setProgressHeight] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!containerRef.current) return;

//       const triggerPoint = window.innerHeight - 50; // 50px from bottom
//       let newActiveIndex = -1;
//       let newProgressHeight = 0;

//       dotRefs.current.forEach((dot, idx) => {
//         if (!dot) return;
//         const rect = dot.getBoundingClientRect();

//         // If dot crosses trigger line
//         if (rect.top <= triggerPoint) {
//           newActiveIndex = idx;

//           // Calculate progress line height until this dot
//           const containerRect = containerRef.current.getBoundingClientRect();
//           newProgressHeight = rect.top - containerRect.top + rect.height / 2;
//         }
//       });

//       setActiveIndex(newActiveIndex);
//       setProgressHeight(newProgressHeight);
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll(); // initial run

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="bg-[#F8F8F8]">
//       <div className="max-w-[1440px] mx-auto py-5 my-5">
//         <h1 className="text-lg md:text-4xl text-center font-bold text-orange-500 px-3">
//           Delivery Process
//         </h1>
//         <hr className="my-3 border-dark" />

//         <p className="mt-3 text-xs md:text-base font-medium text-center text-black leading-relaxed px-3">
//           ArtSays is a creator-first platform built for artists of every style,
//           from digital dreamers to traditional painters. We believe that art is
//           more than visuals — it’s stories, emotions, and connections. Our
//           mission? To make sure every artist finds their stage and every
//           audience finds art that speaks to them.
//         </p>

//         <div className="relative mx-auto my-10 px-3" ref={containerRef}>
//        
//           <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gray-300"></div>

//        
//           <div
//             className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 w-1 bg-[#6F4D34] transition-all duration-500 ease-out"
//             style={{ height: `${progressHeight}px` }}
//           ></div>

//           <div className="relative flex flex-col space-y-16">
//             {steps.map((item, idx) => {
//               const isActive = activeIndex === idx;
//               return (
//                 <div
//                   key={idx}
//                   className={`relative flex md:items-center ${
//                     idx % 2 === 0 ? "md:justify-start" : "md:justify-end"
//                   }`}
//                 >
//                  
//                   <div
//                     ref={(el) => (dotRefs.current[idx] = el)}
//                     className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
//                       isActive
//                         ? "bg-[#6F4D34] scale-150 shadow-lg"
//                         : "bg-gray-400"
//                     }`}
//                   ></div>

//                   <div
//                     className={`ml-10 md:ml-0 md:w-[45%] p-6 rounded-xl transition-all duration-300 ${
//                       isActive
//                         ? "bg-white shadow-2xl border-l-[10px] border-[#6F4D34]"
//                         : "bg-white shadow-md"
//                     }`}
//                   >
//                     <p className="absolute top-[-13px] text-sm font-semibold text-white mb-2 bg-orange-600 px-3 py-1 rounded-md justify-self-start">
//                       {item.step}
//                     </p>
//                     <h3 className="text-lg font-bold text-[#6F4D34] mb-2">
//                       {item.title}
//                     </h3>
//                     <p className="text-gray-600 whitespace-pre-line">
//                       {item.desc}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveryProcess;












import React, { useEffect, useRef, useState } from "react";
import getAPI from "../../../api/getAPI";

const DeliveryProcess = () => {
  const containerRef = useRef(null);
  const dotRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [progressHeight, setProgressHeight] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const pageRes = await getAPI("/api/about-us/published");
        const aboutUsPage = pageRes.data.data;
        if (!aboutUsPage?._id) throw new Error("No published About Us page found");

        const sectionRes = await getAPI(
          `/api/about-us-sections/delivery-process/${aboutUsPage._id}`
        );
        if (!sectionRes.data.success) throw new Error("Delivery Process section not found");

        const fetchedData = sectionRes.data.data;

        
        fetchedData.steps = fetchedData.steps.map((s, idx) => ({
          stepNumber: idx + 1,
          title: s.stepTitle,
          desc: s.stepDescription,
          image: s.stepImage,
        }));

        setData(fetchedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const triggerPoint = window.innerHeight - 50;
      let newActiveIndex = -1;
      let newProgressHeight = 0;

      dotRefs.current.forEach((dot, idx) => {
        if (!dot) return;
        const rect = dot.getBoundingClientRect();
        if (rect.top <= triggerPoint) {
          newActiveIndex = idx;
          const containerRect = containerRef.current.getBoundingClientRect();
          newProgressHeight = rect.top - containerRect.top + rect.height / 2;
        }
      });

      setActiveIndex(newActiveIndex);
      setProgressHeight(newProgressHeight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Delivery Process section not available</div>;

  return (
    <div className="bg-[#F8F8F8]">
      <div className="max-w-[1440px] mx-auto py-5 my-5">
        <h1 className="text-lg md:text-4xl text-center font-bold text-orange-500 px-3">
          {data.heading}
        </h1>
        <hr className="my-3 border-dark" />
        <p className="mt-3 text-xs md:text-base font-medium text-center text-black leading-relaxed px-3">
          {data.description}
        </p>

        <div className="relative mx-auto my-10 px-3" ref={containerRef}>
         
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gray-300"></div>

          <div
            className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 w-1 bg-[#6F4D34] transition-all duration-500 ease-out"
            style={{ height: `${progressHeight}px` }}
          ></div>

          <div className="relative flex flex-col space-y-16">
            {data.steps.map((item, idx) => {
              const isActive = activeIndex === idx;
              const isLeft = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`relative flex md:items-center ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
              
                  <div
                    ref={(el) => (dotRefs.current[idx] = el)}
                    className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
                      isActive ? "bg-[#6F4D34] scale-150 shadow-lg" : "bg-gray-400"
                    }`}
                  ></div>

                  <div
                    className={`ml-10 md:ml-0 md:w-[45%] p-6 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-white shadow-2xl border-l-[10px] border-[#6F4D34]"
                        : "bg-white shadow-md"
                    }`}
                  >
                    <p className="absolute top-[-13px] text-sm font-semibold text-white mb-2 bg-orange-600 px-3 py-1 rounded-md">
                      Step: {item.stepNumber}
                    </p>
                    <h3 className="text-lg font-bold text-[#6F4D34] mb-2">{item.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{item.desc}</p>
                    {item.image && (
                      <img
                        src={`${imageBaseURL}/${item.image}`}
                        alt={item.title}
                        className="mt-2 rounded-lg w-full object-contain"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProcess;
