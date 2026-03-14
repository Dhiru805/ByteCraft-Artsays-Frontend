

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

  if (loading) return <div><StepsTimelineSkeleton /></div>;
  if (!data) return null;

  return (
    <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
            {data.heading || "Delivery Process"}
          </h2>
          <div className="w-16 h-1 bg-[#6F4D34] rounded-full mx-auto" />
          <p className="text-lg text-gray-600 leading-relaxed font-medium max-w-3xl mx-auto">
            {data.description}
          </p>
        </div>

        <div className="relative mx-auto my-10 px-3" ref={containerRef}>
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-100"></div>

          <div
            className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 w-0.5 bg-[#6F4D34] transition-all duration-500 ease-out"
            style={{ height: `${progressHeight}px` }}
          ></div>

          <div className="relative flex flex-col space-y-12">
            {data.steps.map((item, idx) => {
              const isActive = activeIndex === idx;
              const isLeft = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`relative flex md:items-center ${isLeft ? "md:justify-start" : "md:justify-end"
                    }`}
                >
                  <div
                    ref={(el) => (dotRefs.current[idx] = el)}
                    className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 rounded-full top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${isActive ? "bg-[#6F4D34] scale-150 shadow-lg ring-4 ring-[#6F4D34]/20" : "bg-gray-200"
                      }`}
                  ></div>

                  <div
                    className={`ml-10 md:ml-0 md:w-[45%] p-6 rounded-2xl transition-all duration-500 bg-gray-50 border border-gray-100 group/step ${isActive
                      ? "bg-white shadow-xl border-[#6F4D34]/30 -translate-y-1"
                      : "opacity-80 grayscale-[0.5]"
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? "bg-[#6F4D34] text-white" : "bg-gray-200 text-gray-500"
                        }`}>
                        Step {item.stepNumber}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 transition-colors ${isActive ? "text-[#6F4D34]" : "text-gray-700"
                      }`}>
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    {item.image && (
                      <div className="overflow-hidden rounded-xl bg-white border border-gray-100">
                        <img
                          src={`${imageBaseURL}/${item.image}`}
                          alt={item.title}
                          className="w-full h-auto object-contain transition-transform group-hover/step:scale-105"
                        />
                      </div>
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


// StepsTimelineSkeleton.jsx
function StepsTimelineSkeleton() {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="max-w-[1440px] mx-auto py-5 my-5 animate-pulse">

        {/* Heading */}
        <div className="text-center">
          <div className="h-8 w-1/3 bg-gray-300 rounded mx-auto"></div>
        </div>

        <hr className="my-3 border-dark opacity-40" />

        {/* Description */}
        <div className="text-center px-3 space-y-2">
          <div className="h-4 w-2/3 bg-gray-300 rounded mx-auto"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto mt-2"></div>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto my-10 px-3 h-full">

          {/* Back timeline line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gray-300"></div>

          {/* Steps list */}
          <div className="relative flex flex-col space-y-16">

            {[1, 2, 3, 4].map((i) => {
              const isLeft = i % 2 === 1; // same alternating pattern

              return (
                <div
                  key={i}
                  className={`relative flex md:items-center ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Step Dot */}
                  <div
                    className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full 
                    bg-gray-300 top-1/2 -translate-y-1/2 z-10"
                  ></div>

                  {/* Step Card */}
                  <div
                    className={`ml-10 md:ml-0 md:w-[45%] p-6 rounded-xl bg-white shadow-md`}
                  >
                    {/* Step Badge */}
                    <div className="absolute top-[-13px] w-20 h-6 bg-gray-300 rounded mx-auto"></div>

                    {/* Title */}
                    <div className="h-5 w-32 bg-gray-300 rounded mb-3"></div>

                    {/* Description lines */}
                    <div className="space-y-2 mb-3">
                      <div className="h-4 w-full bg-gray-300 rounded"></div>
                      <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                    </div>

                    {/* Image placeholder */}
                    <div className="w-full h-28 bg-gray-200 rounded"></div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}
