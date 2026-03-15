
import { useState, useEffect } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import getAPI from "../../../api/getAPI";
import { getImageUrl } from '../../../utils/getImageUrl';

const WhatWeDo = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


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

  if (loading) return <div>{WhatWeDoSkeleton()}</div>;
  if (!data) return null;

  return (
    <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
      <div className="gap-10 items-center">
        <div className="space-y-4 mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
            {data.heading || "What We Do"}
          </h2>
          <div className="w-16 h-1 bg-[#6F4D34] rounded-full" />
          <p className="text-lg text-gray-600 leading-relaxed font-medium">
            {data.description}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row-reverse gap-4">
          <div className="w-full lg:w-2/5 aspect-[4/3] overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center">
            {data.image ? (
              <img
                src={getImageUrl(data.image)}
                alt="What We Do"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="text-gray-300">No Image</div>
            )}
          </div>
          <div className="w-full lg:w-3/5 space-y-6">
            <div className="space-y-3">
              {data.cards?.map((card, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden transition-all hover:border-[#6F4D34]/30"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex justify-between items-center p-4 text-lg font-bold text-left text-gray-800 focus:outline-none group/btn"
                  >
                    <span className="group-hover/btn:text-[#6F4D34] transition-colors">{card.cardHeading}</span>
                    <span className="text-[#6F4D34]">
                      {openIndex === index ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="px-4 pb-4 text-gray-600 text-base leading-relaxed">
                      {card.cardDescription}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
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
