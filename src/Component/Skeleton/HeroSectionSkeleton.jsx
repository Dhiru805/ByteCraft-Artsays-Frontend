import React from "react";

const HeroSectionSkeleton = () => {
  return (
    <div className="w-full">
      {/* ── Hero Banner ── */}
      <div className="relative w-full min-h-[420px] sm:min-h-[480px] md:min-h-[640px] overflow-hidden bg-[#1a1210]">
        {/* shimmer sweep across the dark bg */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "heroShimmer 2s linear infinite",
          }}
        />

        {/* gradient overlay matching the real hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/90 via-[#000000]/60 to-transparent" />

        {/* Content grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 md:px-0 my-3 max-w-[1440px] mx-auto h-full items-center py-8 md:py-12">
          {/* Left col */}
          <div className="col-span-2 flex flex-col gap-5">
            {/* Badge pill */}
            <div className="h-6 w-36 rounded-full bg-white skeleton-wave" />

            {/* Static title — 2 lines */}
            <div className="flex flex-col gap-2">
              <div className="h-10 md:h-16 w-3/4 rounded-xl bg-white skeleton-wave" />
              <div className="h-10 md:h-16 w-1/2 rounded-xl bg-white skeleton-wave" style={{ animationDelay: "0.1s" }} />
            </div>

            {/* Typing headline */}
            <div className="h-14 md:h-24 w-2/3 rounded-xl bg-[#FF725E]/25 skeleton-wave" style={{ animationDelay: "0.2s" }} />

            {/* Search bar */}
            <div className="flex items-center w-full max-w-2xl rounded-xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm">
              <div className="flex-1 h-12 skeleton-wave bg-white/10" />
              <div className="w-24 h-12 bg-[#6F4D34]/70 flex-shrink-0" />
            </div>

            {/* Description lines */}
            <div className="flex flex-col gap-2 max-w-xl">
              <div className="h-4 w-full rounded bg-white/15 skeleton-wave" style={{ animationDelay: "0.15s" }} />
              <div className="h-4 w-5/6 rounded bg-white/10 skeleton-wave" style={{ animationDelay: "0.25s" }} />
              <div className="h-4 w-2/3 rounded bg-white/10 skeleton-wave hidden md:block" style={{ animationDelay: "0.35s" }} />
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 flex-wrap">
              <div className="h-12 w-32 rounded-2xl bg-[#6F4D34]/60 skeleton-wave" style={{ animationDelay: "0.1s" }} />
              <div className="h-12 w-40 rounded-2xl bg-white/15 border border-white/20 skeleton-wave" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>

          {/* Right col — visible on lg+ */}
          <div className="hidden lg:flex items-center justify-center h-[550px]">
            <div className="w-[460px] h-full rounded-2xl bg-white/10 skeleton-wave overflow-hidden relative">
              {/* art-frame inner accent */}
              <div className="absolute inset-6 rounded-xl border border-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tags bar ── */}
      <div className="bg-white py-6 shadow-md">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-wrap justify-center gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl bg-gray-200 skeleton-wave"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
              <div
                className="h-4 w-24 rounded bg-gray-200 skeleton-wave"
                style={{ animationDelay: `${i * 0.08 + 0.04}s` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* keyframe + wave styles injected once */}
      <style>{`
        @keyframes heroShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes skeletonWave {
          0%   { opacity: 1; }
          50%  { opacity: 0.45; }
          100% { opacity: 1; }
        }
        .skeleton-wave {
          animation: skeletonWave 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSectionSkeleton;
