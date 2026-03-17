import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import HeroSectionSkeleton from "../../../Component/Skeleton/HeroSectionSkeleton";
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";
import { getImageUrl } from '../../../utils/getImageUrl';

const Hero = ({ homepageId: homepageIdProp, onReady }) => {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [open, setOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("artsays_recent_searches") || "[]");
    } catch {
      return [];
    }
  });
  const searchRef = useRef(null);


  useEffect(() => {
    const fetchHero = async () => {
        try {
          // Use the homepageId passed from parent if available, otherwise fetch it
          let id = homepageIdProp;
          if (!id) {
            const pageRes = await getAPI("/api/homepage/published");
            if (!pageRes) return;
            id = pageRes?.data?.data?._id;
          }
          if (!id) return;

          const heroRes = await getAPI(
            `/api/homepage-sections/hero/${id}`
          );
          if (!heroRes?.data?.success || !heroRes?.data?.data) return;

          setHeroData(heroRes.data.data);

          const tagsRes = await getAPI(
            `/api/homepage-sections/hero-browse-categories/getTags/${id}`
          );
          if (tagsRes?.data?.success) setTags(tagsRes.data.data);
        } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        onReady?.();
      }
    };
    // If homepageIdProp is explicitly passed (even null initially), wait for it
    // Only skip waiting if it's already a valid ID or we have no prop at all
    if (homepageIdProp !== undefined && homepageIdProp === null) return;
    fetchHero();
  }, [homepageIdProp]);

  useEffect(() => {
    if (!heroData?.recurrentTitles?.length) return;
    const titles = heroData.recurrentTitles;
    const currentTitleObj = titles[wordIndex] || {};
    if (!currentTitleObj.title) return;
    const delay = currentTitleObj.duration
      ? currentTitleObj.duration * 1000
      : 1200;

    let timeout;
    if (typing) {
      if (charIndex < currentTitleObj.title.length) {
        timeout = setTimeout(() => {
          setText((prev) => prev + currentTitleObj.title[charIndex]);
          setCharIndex(charIndex + 1);
        }, 100);
      } else {
        timeout = setTimeout(() => setTyping(false), delay);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setText(currentTitleObj.title.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 60);
      } else {
        setTyping(true);
        setWordIndex((wordIndex + 1) % titles.length);
        setImgIndex((wordIndex + 1) % titles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIndex, typing, wordIndex, heroData]);

  useEffect(() => {
    if (!heroData?.recurrentTitles?.length) return;
    setImgIndex(wordIndex);
  }, [wordIndex, heroData]);

  // fetch products + artists for dropdown
  useEffect(() => {
    Promise.all([
      getAPI("/api/getstatusapprovedproduct", {}, true, false),
      getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
    ])
      .then(([res1, res2]) => {
        const p1 = res1?.data?.data?.filter((p) => p.status === "Approved") || [];
        const p2 = res2?.data?.data?.filter((p) => p.status === "Approved") || [];
        const merged = [...p1, ...p2].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllProducts(merged);
      })
      .catch(() => { });

    getAPI("/artist/artists", {}, true, false)
      .then((res) => {
        const list = res?.data?.artists || res?.data?.data || res?.data || [];
        setAllArtists(Array.isArray(list) ? list : []);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = query.trim().toLowerCase();

  // smart filtering: check which type(s) match the query
  const str = (v) => (typeof v === "string" ? v.toLowerCase() : Array.isArray(v) ? v.join(" ").toLowerCase() : "");

  const matchedProducts = q
    ? allProducts.filter((p) =>
      str(p.productName).includes(q) ||
      str(p.title).includes(q) ||
      str(p.description).includes(q) ||
      str(p.mainCategory).includes(q) ||
      str(p.category).includes(q) ||
      str(p.subcategory).includes(q) ||
      str(p.medium).includes(q) ||
      str(p.material).includes(q) ||
      str(p.productType).includes(q) ||
      str(p.artStyle).includes(q) ||
      str(p.subject).includes(q)
    )
    : [];

  const matchedArtists = q
    ? allArtists.filter((a) => {
      const name = `${a.name || a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
      return (
        name.includes(q) ||
        str(a.username).includes(q) ||
        (a.expertise || []).some((e) => str(e).includes(q)) ||
        str(a.userType).includes(q)
      );
    })
    : [];

  // products: only show when actively searching
  const productSuggestions = q ? matchedProducts.slice(0, 8) : [];
  // artists: show top 10 by default, matched when searching
  const artistSuggestions = q ? matchedArtists.slice(0, 10) : allArtists.slice(0, 10);

  const saveSearch = (term) => {
    const t = term.trim();
    if (!t) return;
    setRecentSearches((prev) => {
      const updated = [t, ...prev.filter((s) => s.toLowerCase() !== t.toLowerCase())].slice(0, 7);
      localStorage.setItem("artsays_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = (term) => {
    const t = (term || query).trim();
    if (!t) return;
    saveSearch(t);
    setOpen(false);
    setQuery("");
    navigate(`/search?q=${encodeURIComponent(t)}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <HeroSectionSkeleton />
      </div>
    );
  if (!heroData) return null;

  const titles = heroData.recurrentTitles || [];
  const currentTitleObj = titles[wordIndex] || {};

  return (
    <div>
      {/* Banner Hero — matches public pages style */}
        <div className="relative w-full min-h-[420px] sm:min-h-[480px] md:min-h-[640px] flex items-center overflow-hidden">
        {/* Background: animated slide image or fallback hero-bg */}
        <AnimatePresence mode="wait">
          {currentTitleObj.image ? (
                <motion.img
                  key={wordIndex}
                  src={getImageUrl(currentTitleObj.image)}
                  alt="Hero Background"
                  width="1920"
                  height="1080"
                  fetchpriority="high"
                  className="absolute inset-0 w-full h-full object-cover scale-105"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
            ) : (
              <motion.div
                key="fallback-bg"
                className="absolute inset-0 w-full h-full bg-cover bg-center scale-105"
                style={{ backgroundImage: "url('/herosectionimg/hero-bg.jpg')" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </AnimatePresence>

          {/* Dark gradient overlay — left to transparent, matching public pages */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/90 via-[#000000]/60 to-transparent" />

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 md:px-0 my-3 max-w-[1440px] mx-auto">
            <div className="col-span-2 relative align-content-center">
              <div>
                {/* Badge */}
                <span className="inline-block px-3 py-1 bg-white text-[#000000] backdrop-blur-md rounded-full text-[10px] md:text-sm font-bold tracking-widest uppercase mb-4 animate-fade-in">
                  The Art Marketplace
                </span>

                {/* Static title */}
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-lg mb-2">
                  {heroData.title}
                </h1>

                {/* Typing animation */}
                <h2 className="text-2xl sm:text-3xl md:text-8xl font-extrabold mb-4">
                  <span className="bg-gradient-to-r from-[#FFD59E] to-[#FF725E] bg-clip-text text-transparent !windhavi">
                    {text}
                  </span>
                  <span className="inline-block w-[3px] h-[1em] bg-gradient-to-r from-[#FFD59E] to-[#FF725E] align-bottom animate-blink ml-1"></span>
                </h2>

                {/* Search bar */}
                <div className="relative w-full max-w-2xl mb-4" ref={searchRef}>
                  <div className="flex items-center w-full rounded-xl border border-white/30 shadow-lg overflow-hidden bg-white backdrop-blur-sm">
                    <label htmlFor="hero-search" className="sr-only">Search your next Masterpiece NOW!</label>
                    <input
                      id="hero-search"
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setOpen(true)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Search your next Masterpiece NOW!"
                      className="flex-1 px-4 py-3 text-sm md:text-base text-dark placeholder-white/70 bg-transparent focus:outline-none"
                    />
                    <button
                      onClick={() => handleSearch()}
                      aria-label="Submit search"
                      className="px-4 py-3 bg-[#6F4D34] hover:bg-[#5a3c27] text-white font-semibold text-sm md:text-base transition-colors"
                    >
                      Search
                    </button>
                  </div>

                {open && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-2xl mt-2 z-[99999] p-3 max-h-[520px] overflow-y-auto">

                    {/* ── Products section: only when actively searching ── */}
                    {q && (
                      <>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                          {`Products matching "${query}"`}
                        </p>
                        {productSuggestions.length > 0 ? (
                          <div className="flex flex-col divide-y divide-gray-100 mb-2">
                            {productSuggestions.map((product, i) => (
                              <div
                                key={product._id || i}
                                onClick={() => navigate(`/store/product/${product._id}`)}
                                className="flex items-center gap-3 py-2 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition"
                              >
                                <img
                                  src={
                                    product.mainImage
                                      ? getImageUrl(product.mainImage)
                                      : product.images?.[0]
                                        ? getImageUrl(product.images[0])
                                        : "/assets/home/biditemurl.jpg"
                                  }
                                  alt={product.productName}
                                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                  onError={(e) => { e.target.src = "/assets/home/biditemurl.jpg"; }}
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-semibold text-gray-800 line-clamp-1">
                                    {product.productName}
                                  </span>
                                  <span className="text-xs text-gray-400 line-clamp-1">
                                    {[
                                      product.userId
                                        ? `${product.userId.name || product.userId.firstName || ""} ${product.userId.lastName || ""}`.trim()
                                        : null,
                                      product.medium
                                    ].filter(Boolean).join(" · ")}
                                  </span>
                                </div>
                                {(product.finalPrice || product.price) && (
                                  <span className="ml-auto text-xs font-bold text-[#6F4D34] flex-shrink-0">
                                    ₹{(product.finalPrice || product.price).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          matchedArtists.length === 0 ? null : <p className="text-xs text-gray-400 mb-4">No products found</p>
                        )}
                      </>
                    )}

                    {/* ── Artists section: always show (top 10 default, matched when searching) ── */}
                    {artistSuggestions.length > 0 && (
                      <>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                          {q ? `Artists matching "${query}"` : "Top Artists"}
                        </p>
                        {artistSuggestions.length > 0 ? (
                          <div
                            className="flex gap-3 overflow-x-auto pb-2 mb-2 scroll-smooth"
                            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
                          >
                            {artistSuggestions.map((artist, i) => {
                              const name =
                                `${artist.name || artist.firstName || ""} ${artist.lastName || ""}`.trim() ||
                                artist.username ||
                                "Artist";
                              const avatar = artist.profilePhoto
                                ? getImageUrl(artist.profilePhoto)
                                : artist.profileImage
                                  ? getImageUrl(artist.profileImage)
                                  : DEFAULT_PROFILE_IMAGE;
                              return (
                                <div
                                  key={artist._id || i}
                                  onClick={() => {
                                    setOpen(false);
                                    navigate(`/social-media/profile/product-view?artistId=${artist._id}`);
                                  }}
                                  className="group flex-shrink-0 flex flex-col items-center bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 p-2 cursor-pointer text-center"
                                  style={{ minWidth: "140px", maxWidth: "140px" }}
                                >
                                  <div className="relative mb-2">
                                    <img
                                      src={avatar}
                                      alt={name}
                                      className="w-8 h-8 rounded-full object-cover border-4 border-[#6F4D34]/20 group-hover:border-[#6F4D34] transition-all duration-300"
                                      onError={(e) => { e.target.src = DEFAULT_PROFILE_IMAGE; }}
                                    />
                                    {(artist.status === "Verified" || artist.isVerified) && (
                                      <div className="absolute -bottom-1 -right-1 bg-[#6F4D34] text-white text-[6px] font-black px-1 py-0.5 rounded-full">✓</div>
                                    )}
                                  </div>
                                  <h3 className="text-[10px] font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors line-clamp-1 w-full">{name}</h3>
                                  {artist.userType && (
                                    <span className="mt-1 text-[9px] font-black text-[#6F4D34] uppercase tracking-widest bg-[#6F4D34]/10 px-2 py-0.5 rounded-full line-clamp-1">{artist.userType}</span>
                                  )}
                                  {artist.expertise?.length > 0 && (
                                    <p className="mt-1.5 text-[9px] text-gray-400 line-clamp-1 w-full">{artist.expertise.slice(0, 2).join(", ")}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          q && <p className="text-xs text-gray-400 mb-4">No artists found</p>
                        )}
                      </>
                    )}

                    {/* ── No results at all ── */}
                    {q && productSuggestions.length === 0 && artistSuggestions.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No results found for "{query}"</p>
                    )}

                    {/* ── Artist not found when searching ── */}
                    {q && matchedArtists.length === 0 && matchedProducts.length > 0 && (
                      <p className="text-xs text-gray-400 mb-2">No artists found for "{query}"</p>
                    )}

                    {/* ── Recent Searches / Trend section ── */}
                    <div className="border-t pt-2">
                      <div className="font-bold flex items-center text-gray-800 mb-2 text-sm">
                        <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M3 13 L9 7 L13 11 L21 3" stroke="#2BB673" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M21 3 L21 9" stroke="#2BB673" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                        {recentSearches.length > 0 ? "RECENT SEARCHES" : "TREND NOW"}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-[#f04a2f] font-medium">
                        {recentSearches.length > 0 ? (
                          recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleSearch(term)}
                              className="flex items-center gap-1 hover:underline focus:outline-none"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                              {term}
                            </button>
                          ))
                        ) : (
                          ["Fine Art Ceramics", "Sculpture", "Glass Art", "Paintings"].map((trend) => (
                            <button
                              key={trend}
                              onClick={() => handleSearch(trend)}
                              className="hover:underline focus:outline-none"
                            >
                              {trend}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm md:text-md text-white leading-relaxed mb-3 max-w-xl line-clamp-3 md:line-clamp-none">
                {heroData.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                {heroData.buttons?.map((btn, i) => (
                  <button
                    key={i}
                    className={`px-7 py-3 rounded-2xl font-bold transition-all duration-300 ${i % 2 === 0
                      ? "bg-[#6F4D34] hover:bg-[#5a3c27] text-white shadow buy-now"
                      : "border border-white text-black bg-white hover:text-[#6F4D34] add-cart"
                      }`}
                    onClick={() => (window.location.href = btn.link)}
                  >
                    {btn.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:flex w-full h-[550px] items-center justify-center rounded-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {currentTitleObj.image && (
                  <motion.img
                    key={wordIndex}
                    src={getImageUrl(currentTitleObj.image)}
                      alt="Hero Slide"
                      width="460"
                      height="550"
                      className="w-[460px] h-full object-cover"
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }}
                  />
              )}
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tags bar */}
      <div className="bg-white py-6 shadow-md">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-wrap justify-center gap-6">
          {tags.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100">
                <img
                  src={getImageUrl(tag.icon)}
                  alt={tag.title}
                  width="24"
                  height="24"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-base font-medium text-gray-800">
                {tag.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
