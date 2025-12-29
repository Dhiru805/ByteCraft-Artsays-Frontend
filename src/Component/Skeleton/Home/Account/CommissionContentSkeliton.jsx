import React from "react";

const CommissionContentSkeliton = () => {
  return (
    <div className="max-w-[1440px] mx-auto mb-4 animate-pulse">

      {/* Breadcrumb + Search */}
      <div className="w-full py-3 px-3">
        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Breadcrumb */}
          <div className="flex space-x-2">
            <div className="w-12 h-4 bg-gray-300 rounded"></div>
            <div className="w-2 h-3 bg-gray-200 rounded"></div>
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
            <div className="w-2 h-3 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <div className="w-full h-10 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="px-3">
        <div className="h-6 md:h-10 w-40 md:w-72 bg-gray-300 rounded"></div>
      </div>
      <hr className="my-3 border-dark" />

      {/* Description */}
      <div className="px-3">
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>

      {/* Articles Skeleton */}
      <div className="grid grid-cols-1 gap-6 px-3 sm:px-6 mt-5">

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center"
          >

            {/* Image */}
            <aside
              className={`rounded-xl w-full h-40 md:h-52 bg-gray-300 ${
                i % 2 === 1 ? "md:order-2" : "md:order-1"
              }`}
            />

            {/* Text Section */}
            <main
              className={`md:col-span-3 flex flex-col justify-center ${
                i % 2 === 1 ? "md:text-right md:order-1" : "md:text-left md:order-2"
              }`}
            >
              <div className="h-5 md:h-7 w-40 bg-gray-300 rounded"></div>

              <hr className="my-3 border-dark" />

              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </div>

              {/* Button Skeleton */}
              <div
                className={`mt-3 ${
                  i % 2 === 1 ? "md:self-end" : "md:self-start"
                }`}
              >
                <div className="h-10 w-32 bg-gray-300 rounded-full"></div>
              </div>
            </main>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CommissionContentSkeliton;
