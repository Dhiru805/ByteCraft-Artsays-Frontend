import React from "react";

const ProductsSkeliton = () => {
  return (
    <main className="md:col-span-3 animate-pulse">
      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl shadow-md overflow-hidden flex flex-col justify-between m-3"
          >
            {/* Image */}
            <div className="w-full h-40 sm:h-64 bg-gray-300"></div>

            {/* Product Info */}
            <div className="p-3">
              {/* Title */}
              <div className="w-32 h-5 bg-gray-300 rounded mb-2"></div>

              {/* Artist */}
              <div className="w-24 h-4 bg-gray-200 rounded mb-3"></div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                {/* Stars */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-5 h-5 bg-gray-300 rounded"></div>
                  ))}
                </div>

                {/* Avg */}
                <div className="w-10 h-4 bg-gray-300 rounded"></div>

                {/* Review count */}
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mt-3">
                <div className="w-14 h-5 bg-gray-300 rounded"></div>
                <div className="w-20 h-6 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Buttons (Desktop only) */}
            <div className="p-3 hidden md:block">
              <div className="flex justify-between gap-3">
                <div className="flex-1 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 h-10 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION SKELETON */}
      <div className="flex justify-center mt-6">
        <nav className="flex items-center gap-3 border border-dark px-3 py-2 rounded overflow-x-auto no-scrollbar">
          <div className="w-20 h-6 bg-gray-300 rounded"></div>

          {[1, 2, 3].map((p) => (
            <div key={p} className="w-8 h-6 bg-gray-200 rounded"></div>
          ))}

          <div className="w-16 h-6 bg-gray-300 rounded"></div>
        </nav>
      </div>
    </main>
  );
};

export default ProductsSkeliton;
