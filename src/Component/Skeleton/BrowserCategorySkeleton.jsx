import React from "react";

const BrowserCategorySkeleton = () => {
  return (
    <div className="w-full bg-gray-50/50 py-12">
      <div className="max-w-[1440px] mx-auto px-4 md:!px-0">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-3">
          <div className="flex flex-col gap-4">
            {/* Heading */}
            <div className="h-10 md:h-14 w-64 md:w-96 rounded-xl bg-gray-200 skeleton-shimmer" />
            {/* Sub-description */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full max-w-lg rounded bg-gray-200 skeleton-shimmer" style={{ animationDelay: "0.07s" }} />
              <div className="h-4 w-4/5 max-w-md rounded bg-gray-200 skeleton-shimmer" style={{ animationDelay: "0.14s" }} />
            </div>
          </div>
          {/* CTA button — hidden on mobile, visible on lg */}
          <div className="hidden lg:block h-14 w-40 rounded-2xl bg-[#6F4D34]/20 skeleton-shimmer flex-shrink-0" />
        </div>

        {/* ── Search + Category pills row ── */}
        <div className="flex flex-col lg:flex-row gap-3 mb-12 items-center">
          {/* Search bar */}
          <div className="relative flex-1 w-full h-14 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>

          {/* Category pill chips */}
          <div className="flex gap-3 overflow-hidden w-full lg:w-auto">
            {[120, 100, 140, 90, 130, 110].map((w, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-12 rounded-2xl bg-white border-2 border-gray-100 skeleton-shimmer"
                style={{ width: w, animationDelay: `${i * 0.06}s` }}
              />
            ))}
          </div>
        </div>

        {/* ── Product cards ── */}
        <div className="flex gap-3 overflow-x-hidden snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
          {Array.from({ length: 8 }).map((_, i) => {
            const delay = i * 100;
            return (
              <div
                key={i}
                className="flex flex-col bg-white rounded-[24px] overflow-hidden border border-gray-100/50 shadow-sm min-w-[77%] snap-start sm:min-w-0"
                style={{ animationDelay: `${delay}ms` }}
              >
                {/* Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 skeleton-shimmer" />
                  {/* floating badge top-left */}
                  <div className="absolute top-4 left-4 h-6 w-20 rounded-full bg-white/80 skeleton-shimmer" style={{ animationDelay: `${delay + 80}ms` }} />
                  {/* heart top-right */}
                  <div className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/80 skeleton-shimmer" style={{ animationDelay: `${delay + 120}ms` }} />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-4 gap-3">
                  {/* Artist row */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#6F4D34]/25 skeleton-pulse" />
                    <div className="h-3 w-28 rounded bg-gray-200 skeleton-shimmer" style={{ animationDelay: `${delay + 60}ms` }} />
                  </div>

                  {/* Title */}
                  <div className="h-5 w-4/5 rounded-md bg-gray-200 skeleton-shimmer" style={{ animationDelay: `${delay + 80}ms` }} />

                  {/* Rating row */}
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 rounded-lg bg-gray-100 skeleton-shimmer" style={{ animationDelay: `${delay + 100}ms` }} />
                    <div className="h-3 w-20 rounded bg-gray-100 skeleton-shimmer" style={{ animationDelay: `${delay + 120}ms` }} />
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 border-t border-gray-50 pt-3 mt-auto">
                    <div className="h-5 w-20 rounded bg-gray-200 skeleton-shimmer" style={{ animationDelay: `${delay + 140}ms` }} />
                    <div className="h-7 w-28 rounded bg-gray-200 skeleton-shimmer" style={{ animationDelay: `${delay + 150}ms` }} />
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-5 gap-2 mt-1">
                    <div className="col-span-1 h-12 rounded-2xl bg-gray-100 skeleton-shimmer" style={{ animationDelay: `${delay + 160}ms` }} />
                    <div className="col-span-4 h-12 rounded-2xl bg-[#6F4D34]/20 skeleton-shimmer" style={{ animationDelay: `${delay + 170}ms` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shimmer keyframes */}
      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #f3f4f6 25%,
            #e9eaec 50%,
            #f3f4f6 75%
          );
          background-size: 400px 100%;
          animation: skeletonShimmer 1.4s ease-in-out infinite;
        }
        .skeleton-pulse {
          animation: skeletonPulse 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BrowserCategorySkeleton;
