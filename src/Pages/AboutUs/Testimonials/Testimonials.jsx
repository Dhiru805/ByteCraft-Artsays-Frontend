// import TestimonialCard from "./TestimonialCard";

// export default function Testimonials() {
//   const testimonials = [
//     {
//       text: `What I love most is the community—everyone hypes each other up and gives constructive feedback. It’s not just a platform, it’s like a creative fam!`,
//       name: "Sophia Fernandes",
//       bg: "bg-[#FFF3ED]",
//     },
//     {
//       text: `I used to struggle getting eyes on my art, but on ArtSays, people actually engage and appreciate the process behind my creations.`,
//       name: "Rohit Sharma",
//       bg: "bg-white",
//     },
//     {
//       text: `It feels like my art finally speaks to the right audience.`,
//       name: "Ananya Mehta",
//       bg: "bg-[#FFF3ED]",
//     },
//   ];

//   return (
//     <section className="py-16 bg-[#F8F8F8]">
//       <div className="max-w-[1440px] mx-auto py-3 my-5 px-6 text-center">
//         <h2 className="text-3xl md:text-4xl font-bold text-[#2E2B26] mb-4">
//           Testimonials
//         </h2>
//         <p className="text-[#2E2B26] max-w-3xl mx-auto mb-12">
//           All of these people are becoming your ideal workplaces for your team
//           meeting, corporate events, press & influencers
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {testimonials.map((t, i) => (
//             <TestimonialCard key={i} text={t.text} name={t.name} bg={t.bg} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import React, { useState, useEffect } from "react";
import getAPI from "../../../api/getAPI";

const Testimonials = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const pageRes = await getAPI("/api/about-us/published");
        const aboutUsPage = pageRes.data.data;

        if (!aboutUsPage?._id)
          throw new Error("No published About Us page found");

        const sectionRes = await getAPI(
          `/api/about-us-sections/testimonials/${aboutUsPage._id}`
        );

        if (!sectionRes.data.success)
          throw new Error("Testimonials section not found");

        setData(sectionRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) return <TestimonialsSkeleton />;
  if (!data)
    return <p className="text-center py-6">Testimonials not available</p>;

  return (
    <div className="w-full bg-gray-50 font-[poppins] py-8 px-4">
      <div className="max-w-[1440px] mx-auto bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-gray-100 m-8 transition-all hover:shadow-xl group">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">
              {data.mainHeading || "Testimonials"}
            </h2>
            <div className="w-16 h-1 bg-[#6F4D34] rounded-full mx-auto" />
            <p className="text-lg text-gray-600 leading-relaxed font-medium mx-auto">
              {data.mainDescription || "Hear what people are saying about us."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            {data.testimonials?.map((t, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm relative transition-all hover:bg-white hover:shadow-md hover:-translate-y-1 group/testi">
                <div className="absolute top-4 right-4 text-[#6F4D34]/10 group-hover/testi:text-[#6F4D34]/20 transition-colors">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H12.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.017C5.46472 8 5.017 8.44772 5.017 9V12C5.017 12.5523 4.56929 13 4.017 13H3.017V21H5.017Z" />
                  </svg>
                </div>
                <div className="relative z-10 space-y-6">
                  <p className="text-gray-600 text-lg leading-relaxed italic">
                    "{t.description}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#6F4D34]/10 flex items-center justify-center text-[#6F4D34] font-bold text-xl">
                      {t.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover/testi:text-[#6F4D34] transition-colors">{t.name}</h4>
                      <p className="text-sm text-gray-400">Verified User</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

const TestimonialsSkeleton = () => {
  return (
    <>
      {/* TESTIMONIALS SKELETON */}
      <section className="py-16 bg-[#F8F8F8] animate-pulse">
        <div className="max-w-[1440px] mx-auto py-3 my-5 px-6 text-center">
          {/* Heading Skeleton */}
          <div className="h-8 w-56 bg-gray-300 rounded mx-auto mb-4"></div>

          {/* Description Skeleton */}
          <div className="h-4 w-3/4 bg-gray-300 rounded mx-auto mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto mb-12"></div>

          {/* Testimonial Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                {/* Quote Icon Placeholder */}
                <div className="h-10 w-10 bg-gray-300 rounded-full mx-auto mb-4"></div>

                {/* Text Placeholder */}
                <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-4/6 bg-gray-300 rounded mb-4"></div>

                {/* Name Placeholder */}
                <div className="h-5 w-32 bg-gray-300 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
