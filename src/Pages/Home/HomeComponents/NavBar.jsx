import React, { useEffect, useRef, useState } from "react";
import "./Headerstyle.css";
import artLogo from "./artlogo.png";
import AIcon from "./AIcon.png";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, Search, X, ChevronDown, ShoppingCart, Plus,
  Home, Compass, Users, User, Video, ArrowRight,
  Zap, TrendingUp, Star, Package, Bell, Bookmark,
  Settings, Radio, LogOut
} from "lucide-react";
import { RiAuctionFill, RiMapPin2Line, RiMoneyRupeeCircleLine, RiLockPasswordLine } from "react-icons/ri";
import { MdLibraryAdd, MdVerified, MdOutlineSecurity } from "react-icons/md";
import { BiLogOut, BiCart } from "react-icons/bi";
import { IoWalletOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";
import { HiOutlineHeart } from "react-icons/hi";
import { PiHandbagBold } from "react-icons/pi";
import { FaUser, FaTools, FaShareAlt, FaVideo } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import getAPI from "../../../api/getAPI";
import { DEFAULT_PROFILE_IMAGE } from "../../../Constants/ConstantsVariables";
import HeaderSkeleton from "../../../Component/Skeleton/Home/HeaderSkeleton";
import NotificationDropdown from "../../../Component/Notifications/NotificationDropdown";
import SellerNotificationDropdown from "../../../Component/Notifications/SellerNotificationDropdown";
import SuperAdminNotificationDropdown from "../../../Component/Notifications/SuperAdminNotificationDropdown";
import { useAuth } from "../../../AuthContext";
import axiosInstance from "../../../api/axiosConfig";
import { getImageUrl } from '../../../utils/getImageUrl';

// ─────────────────────────────────────────────────────────────
// MEGA AD SLIDER
// Fetches all available campaign ads (tries specific placement
// first, falls back to homepage, then static). No arrows —
// auto-slide + dots only.
// ─────────────────────────────────────────────────────────────
const STATIC_ADS_FALLBACK = [
  { image: "/assets/home/biditemurl.jpg", badge: "Featured", badgeColor: "#7c3aed", tag: "Sponsored", title: "Discover Amazing Art", sub: "Artsays Collection", price: "", cta: "Explore", href: "/art-gallery" },
  { image: "/assets/home/biditemurl.jpg", badge: "New", badgeColor: "#0ea5e9", tag: "Sponsored", title: "Bid on Rare Pieces", sub: "Live Auctions", price: "", cta: "Bid Now", href: "/bid" },
];


// Shared cache so all 5 mega menus don't each fire separate requests
let _megaAdsCache = null;
let _megaAdsFetching = null;

// Shared product cache for fallback when no ads exist
let _megaProductsCache = null;
let _megaProductsFetching = null;

const fetchMegaProducts = () => {
  if (_megaProductsCache) return Promise.resolve(_megaProductsCache);
  if (_megaProductsFetching) return _megaProductsFetching;
  _megaProductsFetching = Promise.all([
    getAPI("/api/getstatusapprovedproduct", {}, true, false),
    getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
  ])
    .then(([r1, r2]) => {
      const p1 = r1?.data?.data?.filter(p => p.status === "Approved") || [];
      const p2 = r2?.data?.data?.filter(p => p.status === "Approved") || [];
      const all = [...p1, ...p2].reverse().slice(0, 5);
      _megaProductsCache = all.length > 0 ? all : null;
      return _megaProductsCache;
    })
    .catch(() => { _megaProductsCache = null; return null; })
    .finally(() => { _megaProductsFetching = null; });
  return _megaProductsFetching;
};

const MegaProductGrid = () => {
  const [products, setProducts] = useState(null);
  const [idx, setIdx] = useState(0);
  const [slideDir, setSlideDir] = useState("right");
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    fetchMegaProducts().then(data => {
      if (!cancelled) setProducts(data || []);
    });
    return () => { cancelled = true; };
  }, []);

  const total = products ? products.length : 0;

  useEffect(() => {
    if (total <= 1 || hovered) return;
    timerRef.current = setInterval(() => {
      setSlideDir("right");
      setIdx(p => (p + 1) % total);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [total, hovered]);

  const goTo = (i) => { setSlideDir(i > idx ? "right" : "left"); setIdx(i); };

  if (products === null) return <div className="mad-card mad-skeleton" />;
  if (products.length === 0) return null;

  const p = products[idx];
  const img = p.mainImage ? getImageUrl(p.mainImage) : "/assets/home/biditemurl.jpg";
  const name = p.productName || "Artwork";
  const seller = p.userId?.name ? `${p.userId.name}${p.userId.lastName ? " " + p.userId.lastName : ""}` : "";
  const finalPrice = p.finalPrice || p.price;
  const marketPrice = p.marketPrice;
  const price = finalPrice ? `₹${Number(finalPrice).toLocaleString()}` : "";
  const hasDiscount = finalPrice && marketPrice && finalPrice < marketPrice;
  const discountPct = hasDiscount ? Math.round(((marketPrice - finalPrice) / marketPrice) * 100) : 0;
  const href = `/product-details/${name.toLowerCase().replace(/\s+/g, "-")}/${p._id}`;

  return (
    <div
      className="mad-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(href)}
    >
      <div className="mad-img-wrap">
        <img
          key={idx}
          src={img}
          alt={name}
          className="mad-img"
          style={{ animation: total > 1 ? `madSlide${slideDir === "right" ? "R" : "L"} 0.35s ease-out` : "none" }}
          draggable={false}
        />
        <span className="mad-badge" style={{ background: "#48372d" }}>Product</span>
        {hasDiscount && <span className="mad-discount-badge">{discountPct}% OFF</span>}
      </div>
      <div className="mad-body">
        <p className="mad-title">{name}</p>
        {seller && <p className="mad-sub">{seller}</p>}
        <div className="mad-row">
          <span className="mad-price">{price}</span>
          <button className="mad-cta" onClick={e => { e.stopPropagation(); navigate(href); }}>
            View <ArrowRight size={11} />
          </button>
        </div>
        {total > 1 && (
          <div className="mad-dots">
            {products.map((_, i) => (
              <button
                key={i}
                className={`mad-dot-btn${i === idx ? " mad-dot-on" : ""}`}
                onClick={e => { e.stopPropagation(); goTo(i); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const fetchMegaAds = () => {
  if (_megaAdsCache) return Promise.resolve(_megaAdsCache);
  if (_megaAdsFetching) return _megaAdsFetching;
  _megaAdsFetching = getAPI(`/api/campaigns/ads/placement?placement=homepage`, {}, true, false)
    .then(res => {
      const data = res?.data?.data || [];
      _megaAdsCache = data.length > 0 ? data : null;
      return _megaAdsCache;
    })
    .catch(() => { _megaAdsCache = null; return null; })
    .finally(() => { _megaAdsFetching = null; });
  return _megaAdsFetching;
};

// Each menu gets a slice of real ads offset by menuIndex so menus show different ads when possible
const MegaAdSlider = ({ menuIndex = 0 }) => {
  const [ads, setAds] = useState([]);
  const [hasAds, setHasAds] = useState(true);
  const [idx, setIdx] = useState(0);
  const [slideDir, setSlideDir] = useState("right");
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    fetchMegaAds().then(rawAds => {
      if (cancelled) return;
      if (rawAds && rawAds.length > 0) {
        // rotate the list so each menu starts at a different ad
        const rotated = [...rawAds.slice(menuIndex % rawAds.length), ...rawAds.slice(0, menuIndex % rawAds.length)];
        setAds(rotated.map(ad => ({
          image: getImageUrl(ad.mainImage),
          badge: "Ad",
          badgeColor: "#48372d",
          tag: ad.category || "Sponsored",
          title: ad.productName || "Discover",
          sub: ad.userId ? `${ad.userId.name || ""}${ad.userId.lastName ? ` ${ad.userId.lastName}` : ""}` : "",
          price: ad.finalPrice ? `₹${Number(ad.finalPrice).toLocaleString()}` : "",
          marketPrice: ad.marketPrice,
          finalPrice: ad.finalPrice,
          cta: "Buy Now",
          href: `/product-details/${(ad.productName || "product").toLowerCase().replace(/\s+/g, "-")}/${ad._id}`,
          _raw: ad,
        })));
        setHasAds(true);
      } else {
        setHasAds(false);
      }
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, [menuIndex]);

  const total = ads.length;

  // auto-slide every 4s, pause on hover
  useEffect(() => {
    if (total <= 1 || hovered) return;
    timerRef.current = setInterval(() => {
      setSlideDir("right");
      setIdx(p => (p + 1) % total);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [total, hovered]);

  const goTo = (i) => { setSlideDir(i > idx ? "right" : "left"); setIdx(i); };

  const handleClick = async (ad) => {
    if (ad._raw) {
      try {
        const postAPImod = (await import("../../../api/postAPI")).default;
        await postAPImod("/api/campaigns/ads/click", {
          campaignId: ad._raw.campaignId,
          productId: ad._raw._id,
          placement: "homepage",
        }, {}, false);
      } catch {}
      navigate(ad.href);
    } else {
      window.location.href = ad.href;
    }
  };

  const cur = ads[idx];
  if (!loaded) return <div className="mad-card mad-skeleton" />;
  if (!hasAds) return <MegaProductGrid />;
  if (!cur) return <div className="mad-card mad-skeleton" />;

  const hasDiscount = cur.finalPrice && cur.marketPrice && cur.finalPrice < cur.marketPrice;
  const discountPct = hasDiscount ? Math.round(((cur.marketPrice - cur.finalPrice) / cur.marketPrice) * 100) : 0;

  return (
    <div
      className="mad-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => handleClick(cur)}
    >
      {/* image */}
      <div className="mad-img-wrap">
        <img
          key={idx}
          src={cur.image || "/assets/home/biditemurl.jpg"}
          alt={cur.title}
          className="mad-img"
          style={{ animation: total > 1 ? `madSlide${slideDir === "right" ? "R" : "L"} 0.35s ease-out` : "none" }}
          draggable={false}
        />
        <span className="mad-badge" style={{ background: cur.badgeColor || "#1a1a1a" }}>{cur.badge}</span>
        {hasDiscount && <span className="mad-discount-badge">{discountPct}% OFF</span>}
      </div>

      {/* body */}
      <div className="mad-body">
        <p className="mad-title">{cur.title}</p>
        <p className="mad-sub">{cur.sub}</p>
        <div className="mad-row">
          <span className="mad-price">{cur.price}</span>
          <button className="mad-cta" onClick={e => { e.stopPropagation(); handleClick(cur); }}>
            {cur.cta} <ArrowRight size={11} />
          </button>
        </div>
        {/* dot indicators */}
        {total > 1 && (
          <div className="mad-dots">
            {ads.map((_, i) => (
              <button
                key={i}
                className={`mad-dot-btn${i === idx ? " mad-dot-on" : ""}`}
                onClick={e => { e.stopPropagation(); goTo(i); }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes madSlideR { from { transform: translateX(18px); opacity: 0.3; } to { transform: translateX(0); opacity: 1; } }
        @keyframes madSlideL { from { transform: translateX(-18px); opacity: 0.3; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MEGA MENUS
// ─────────────────────────────────────────────────────────────
const ArtMega = () => (
  <div className="mp">
    <div className="mp-body">
      <div className="mp-col">
        <span className="mp-head">Browse Art</span>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />All Artworks</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />Paintings</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />Digital Art</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />Sculpture</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />Photography</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />NFTs</a>
      </div>
      <div className="mp-col">
        <span className="mp-head">By Style</span>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />Abstract</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />Contemporary</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />Traditional</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />Minimal</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />Mandala / Dot Art</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" />Tribal</a>
      </div>
      <div className="mp-col">
        <span className="mp-head">Curated</span>
        <a className="mp-link" href="/artist-card"><span className="mp-dot" style={{ background: "#f5a623" }} />Featured Artists</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" style={{ background: "#f5a623" }} />Trending Now</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" style={{ background: "#f5a623" }} />New Arrivals</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" style={{ background: "#f5a623" }} />Investment Art</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" style={{ background: "#f5a623" }} />Editor's Picks</a>
        <a className="mp-link" href="/art-gallery"><span className="mp-dot" style={{ background: "#f5a623" }} />Awarded Artworks</a>
      </div>
        <MegaAdSlider menuIndex={0} />
    </div>
    <div className="mp-foot">
      <a href="/art-gallery" className="mp-cta">
        <TrendingUp size={14} /> Explore Art Gallery
      </a>
    </div>
  </div>
);

const BidMega = () => (
  <div className="mp">
    <div className="mp-body">
      <div className="mp-col">
        <span className="mp-head">Live Auctions</span>
        <a className="mp-link" href="/bid"><span className="mp-dot" style={{ background: "#ef4444" }} />All Auctions</a>
        <a className="mp-link" href="/bid"><span className="mp-dot" style={{ background: "#ef4444" }} />Ending Soon</a>
        <a className="mp-link" href="/bid"><span className="mp-dot" style={{ background: "#ef4444" }} />Upcoming</a>
        <a className="mp-link" href="/how-to-bid"><span className="mp-dot" style={{ background: "#ef4444" }} />How to Bid</a>
      </div>
      <div className="mp-col">
        <span className="mp-head">Categories</span>
        <a className="mp-link" href="/bid"><span className="mp-dot" />Paintings</a>
        <a className="mp-link" href="/bid"><span className="mp-dot" />Antiques</a>
        <a className="mp-link" href="/bid"><span className="mp-dot" />Sculptures</a>
        <a className="mp-link" href="/bid"><span className="mp-dot" />Photography</a>
        <a className="mp-link" href="/bid"><span className="mp-dot" />Rare Prints</a>
      </div>
      <div className="mp-col">
        <span className="mp-head">For Bidders</span>
        <a className="mp-link" href="/bid"><span className="mp-dot" />New Bidders Guide</a>
        <a className="mp-link" href="/bid"><span className="mp-dot" />My Bids</a>
        <a className="mp-link" href="/bid"><span className="mp-dot" />Won Items</a>
        <a className="mp-link" href="/bid"><span className="mp-dot" />Watchlist</a>
      </div>
        <MegaAdSlider menuIndex={1} />
    </div>
    <div className="mp-foot">
      <a href="/bid" className="mp-cta"><Zap size={14} /> Enter Bidding Arena</a>
    </div>
  </div>
);

const StoresMega = () => (
  <div className="mp">
    <div className="mp-body">
      <div className="mp-col">
        <span className="mp-head">Shop by Category</span>
        <a className="mp-link" href="/store"><span className="mp-dot" />All Stores</a>
        <a className="mp-link" href="/store"><span className="mp-dot" />Paintings & Prints</a>
        <a className="mp-link" href="/store"><span className="mp-dot" />Sculptures</a>
        <a className="mp-link" href="/store"><span className="mp-dot" />Jewellery</a>
        <a className="mp-link" href="/store"><span className="mp-dot" />Handmade Crafts</a>
        <a className="mp-link" href="/store"><span className="mp-dot" />Digital Downloads</a>
      </div>
      <div className="mp-col">
        <span className="mp-head">By Seller</span>
        <a className="mp-link" href="/store"><span className="mp-dot" style={{ background: "#10b981" }} />Verified Sellers</a>
        <a className="mp-link" href="/store"><span className="mp-dot" style={{ background: "#10b981" }} />Trusted Stores</a>
        <a className="mp-link" href="/store"><span className="mp-dot" style={{ background: "#10b981" }} />Rising Creators</a>
        <a className="mp-link" href="/commission"><span className="mp-dot" style={{ background: "#10b981" }} />Custom Orders</a>
      </div>
      <div className="mp-col">
        <span className="mp-head">Deals & Orders</span>
        <a className="mp-link" href="/store"><span className="mp-dot" />Offers & Deals</a>
        <a className="mp-link" href="/store"><span className="mp-dot" />Flash Sales</a>
        <a className="mp-link" href="/track-your-order"><span className="mp-dot" />Track Order</a>
        <a className="mp-link" href="/store"><span className="mp-dot" />Bundle Packs</a>
      </div>
        <MegaAdSlider menuIndex={2} />
    </div>
    <div className="mp-foot">
      <a href="/store" className="mp-cta"><Package size={14} /> Browse All Stores</a>
    </div>
  </div>
);

const CommunityMega = () => (
  <div className="mp">
    <div className="mp-body">
      <div className="mp-col">
        <span className="mp-head">Explore</span>
        <a className="mp-link" href="/artsays-community"><span className="mp-dot" style={{ background: "#8b5cf6" }} />Feed</a>
        <a className="mp-link" href="/artsays-community/explore"><span className="mp-dot" style={{ background: "#8b5cf6" }} />Explore Creators</a>
        <a className="mp-link" href="/artsays-community/live"><span className="mp-dot" style={{ background: "#8b5cf6" }} />Live Sessions</a>
        <a className="mp-link" href="/challenge"><span className="mp-dot" style={{ background: "#8b5cf6" }} />Challenges</a>
      </div>
      <div className="mp-col">
        <span className="mp-head">Membership</span>
        <a className="mp-link" href="/artsays-community"><span className="mp-dot" />Free Tier</a>
        <a className="mp-link" href="/artsays-community"><span className="mp-dot" />Creator Pro</a>
        <a className="mp-link" href="/artsays-community"><span className="mp-dot" />Collector Club</a>
      </div>
      <div className="mp-col">
        <span className="mp-head">Create</span>
        <a className="mp-link" href="/artsays-community/create-post"><span className="mp-dot" style={{ background: "#f59e0b" }} />Create Post</a>
        <a className="mp-link" href="/artsays-community/create-live"><span className="mp-dot" style={{ background: "#f59e0b" }} />Go Live</a>
        <a className="mp-link" href="/artsays-community"><span className="mp-dot" style={{ background: "#f59e0b" }} />Collab Request</a>
        <a className="mp-link" href="/artsays-community"><span className="mp-dot" style={{ background: "#f59e0b" }} />Promote Content</a>
      </div>
        <MegaAdSlider menuIndex={3} />
    </div>
    <div className="mp-foot">
      <a href="/artsays-community" className="mp-cta"><Users size={14} /> Enter Community</a>
    </div>
  </div>
);

const LearnMega = () => (
  <div className="mp">
    <div className="mp-body">
      <div className="mp-col">
        <span className="mp-head">Guides</span>
        <a className="mp-link" href="/how-to-buy"><span className="mp-dot" />How to Buy</a>
        <a className="mp-link" href="/how-to-sell"><span className="mp-dot" />How to Sell</a>
        <a className="mp-link" href="/how-to-resell"><span className="mp-dot" />How to Resell</a>
        <a className="mp-link" href="/how-to-bid"><span className="mp-dot" />How to Bid</a>
      </div>
      <div className="mp-col">
        <span className="mp-head">Resources</span>
        <a className="mp-link" href="/blogs"><span className="mp-dot" />Blog</a>
        <a className="mp-link" href="/faqs"><span className="mp-dot" />FAQs</a>
        <a className="mp-link" href="/why-artsays"><span className="mp-dot" />Why Artsays</a>
        <a className="mp-link" href="/policy"><span className="mp-dot" />Privacy Policy</a>
      </div>
      <div className="mp-col">
        <span className="mp-head">Support</span>
        <a className="mp-link" href="/policy"><span className="mp-dot" />Help Center</a>
        <a className="mp-link" href="/faqs"><span className="mp-dot" />Contact Support</a>
        <a className="mp-link" href="/faqs"><span className="mp-dot" />Report an Issue</a>
      </div>
        <MegaAdSlider menuIndex={4} />
    </div>
    <div className="mp-foot">
      <a href="/blogs" className="mp-cta"><Star size={14} /> Visit Blog</a>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// SEARCH DROPDOWN
// ─────────────────────────────────────────────────────────────
const SEARCH_TABS = ["Artworks", "Artists", "Stores", "Community"];
const TRENDING = ["Abstract Paintings", "Digital Sculpture", "Mandala Art", "Tribal Crafts", "NFT Art"];

const SearchDropdown = ({ visible, query, setQuery, tab, setTab, onSubmit }) => {
  if (!visible) return null;
  return (
    <div className="sdrop">
      <div className="sdrop-tabs">
        {SEARCH_TABS.map(t => (
          <button key={t} className={`sdrop-tab ${tab === t ? "sdrop-tab-on" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
        <form className="sdrop-input-row" onSubmit={onSubmit}>
          <label htmlFor="search-input" className="sr-only">Search {tab}</label>
          <Search size={14} className="sdrop-icon" />
          <input
            autoFocus
            id="search-input"
            type="text"
            placeholder={`Search ${tab}...`}
            className="sdrop-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && <button type="button" className="sdrop-clear" onClick={() => setQuery("")} aria-label="Clear search"><X size={12} /></button>}
        </form>
      <div className="sdrop-trending">
        <span className="sdrop-trend-label">Trending</span>
        {TRENDING.map(t => (
          <a key={t} href={`/search?q=${encodeURIComponent(t)}`} className="sdrop-tag">{t}</a>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CREATE DROPDOWN (Artist / Seller)
// ─────────────────────────────────────────────────────────────
const CreateDrop = ({ usertype, onClose }) => (
  <div className="cdrop">
    <div className="cdrop-arrow" />
    <a href="/artsays-community/create-post" className="cdrop-item" onClick={onClose}>
      <Plus size={15} /> Create Post
    </a>
    <a href="/artsays-community/create-live" className="cdrop-item" onClick={onClose}>
      <Video size={15} /> Go Live
    </a>
    {(usertype === "Artist" || usertype === "Seller") && (
      <a
        href={usertype === "Artist" ? "/artist/product/product-upload" : "/seller/product/product-upload"}
        className="cdrop-item"
        onClick={onClose}
      >
        <ShoppingCart size={15} /> Upload Product
      </a>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "art", label: "Gallery", Mega: null, href: "/art-gallery" },
  { key: "bid", label: "BID", Mega: null, href: "/bid" },
  { key: "stores", label: "STORES", Mega: null, href: "/store" },
  { key: "community", label: "COMMUNITY", Mega: CommunityMega, href: "/artsays-community" },
  { key: "learn", label: "LEARN", Mega: LearnMega, href: "/blogs" },
];

// ─────────────────────────────────────────────────────────────
// MAIN NAVBAR
// ─────────────────────────────────────────────────────────────
const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [Usertype, setUserType] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAvatarDrop, setShowAvatarDrop] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showCommCreate, setShowCommCreate] = useState(false);
  const [showCommMenu, setShowCommMenu] = useState(false);
  const [showRegCreate, setShowRegCreate] = useState(false);
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTab, setSearchTab] = useState("Artworks");
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const megaTimer = useRef(null);
  const searchRef = useRef(null);
  const avatarRef = useRef(null);
  const createRef = useRef(null);
  const commCreateRef = useRef(null);
  const regCreateRef = useRef(null);
  const navInnerRef = useRef(null);
  const navItemRefs = useRef({});

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const userrole = localStorage.getItem("userrole");
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const isOnCommunity = location.pathname.startsWith("/artsays-community");

  const hasValidUsername =
    typeof username === "string" &&
    username.trim() !== "" &&
    username !== "undefined" &&
    username !== "null";

  const isBuyer = Usertype === "Buyer";

  // Community nav items
  const allCommItems = [
    { key: "home", icon: <Home size={22} />, label: "Home", link: "/artsays-community/" },
    { key: "search", icon: <Search size={22} />, label: "Search", link: "/artsays-community/search" },
    { key: "explore", icon: <Compass size={22} />, label: "Explore", link: "/artsays-community/explore" },
    { key: "notification", icon: <Bell size={22} />, label: "Notification", link: "/artsays-community/notification" },
    { key: "create", icon: <Plus size={22} />, label: "Create", link: "/artsays-community/create-post" },
    { key: "live", icon: <Radio size={22} />, label: "Live", link: "/artsays-community/create-live" },
    { key: "profile", icon: <User size={22} />, label: "Profile", link: `/artsays-community/profile/${hasValidUsername ? username : `${firstName}_${lastName}_${userId}`}` },
    { key: "saved", icon: <Bookmark size={22} />, label: "Saved", link: "/artsays-community/saved" },
    { key: "settings", icon: <Settings size={22} />, label: "Settings", link: "/artsays-community/setting" },
    { key: "logout", icon: <LogOut size={22} />, label: "Logout", link: "/artsays-community/logout" },
  ];
  const commItems = isBuyer ? allCommItems.filter(i => i.key !== "create") : allCommItems;

  // scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // auth
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setUserType(localStorage.getItem("userType"));
  }, []);

  // user data
  useEffect(() => {
    if (!userId) { setUser({}); setProfile({}); return; }
    (async () => {
      setLoading(true);
      try {
        const r = await getAPI(`/auth/userid/${userId}`, {}, true, false);
        setUser(r.data.user);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
    if (localStorage.getItem("userType") !== "Super-Admin") {
      getAPI(`/api/social-media/profile/${userId}`, {}, false, true)
        .then(r => setProfile(r.data.profile))
        .catch(() => { });
    }
  }, [userId]);

  // unread notifications
  useEffect(() => {
    if (!userId) return;
    const fetchUnread = async () => {
      try {
        const res = await getAPI(`/api/notifications/${userId}?filter=all&page=1&limit=1`, {}, true, true);
        if (res?.data?.success) setUnreadCount(res.data.unreadCount || 0);
      } catch { }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (location.pathname === "/artsays-community/notification") setUnreadCount(0);
  }, [location.pathname]);

  // cart count (Buyer only)
  useEffect(() => {
    if (!userId || localStorage.getItem("userType") !== "Buyer") return;
    const fetchCartCount = async () => {
      try {
        const res = await getAPI(`/api/cart/${userId}`, {}, true, false);
        const items = res?.data?.items || res?.data?.cartItems || res?.data?.cart || [];
        setCartCount(Array.isArray(items) ? items.length : 0);
      } catch { }
    };
    fetchCartCount();
  }, [userId, location.pathname]);

  // click outside
  useEffect(() => {
    const h = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setShowAvatarDrop(false);
      if (createRef.current && !createRef.current.contains(e.target)) setShowCreate(false);
      if (commCreateRef.current && !commCreateRef.current.contains(e.target)) setShowCommCreate(false);
      if (regCreateRef.current && !regCreateRef.current.contains(e.target)) setShowRegCreate(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const dashboardRoute = () => {
    if (Usertype === "Artist") navigate("/artist/dashboard");
    else if (Usertype === "Seller") navigate("/seller/dashboard");
    else if (Usertype === "Super-Admin") navigate("/Super-Admin/dashboard");
  };

  const handleSignOut = async () => {
    try {
      await axiosInstance.post("/user/logout");
    } catch (e) {
      console.warn("Backend logout failed", e);
    }
    logout();
    navigate("/login", { replace: true });
  };

  const [megaLeft, setMegaLeft] = useState(0);
  const MEGA_WIDTH = 740;

  const openMega = (key) => {
    clearTimeout(megaTimer.current);
    setActiveMega(key);
    const itemEl = navItemRefs.current[key];
    if (itemEl) {
      const itemRect = itemEl.getBoundingClientRect();
      const viewW = window.innerWidth;
      // ideal: centre the menu on the button
      let ideal = itemRect.left + itemRect.width / 2 - MEGA_WIDTH / 2;
      // clamp: never go past viewport edges (16px margin), never past 1440px container
      const maxLeft = Math.min(viewW - MEGA_WIDTH - 16, (viewW - Math.min(viewW, 1440)) / 2 + Math.min(viewW, 1440) - MEGA_WIDTH - 16);
      const clamped = Math.max(16, Math.min(ideal, maxLeft));
      setMegaLeft(clamped);
    }
  };
  const closeMega = () => { megaTimer.current = setTimeout(() => setActiveMega(null), 150); };
  const keepMega = () => clearTimeout(megaTimer.current);

  const avatarSrc = user.profilePhoto
    ? getImageUrl(user.profilePhoto)
    : DEFAULT_PROFILE_IMAGE;

  const isSuperAdminSub = Usertype === "Super-Admin" && userrole !== "super-admin";

  if (loading) return <HeaderSkeleton />;

  return (
    <div className="nav-root">

      {/* ══════════════════ DESKTOP HEADER ══════════════════ */}
      <header className={`nav-header ${scrolled ? "nav-header-scrolled" : ""}`}>
        <div className="nav-inner">

          {/* ── LEFT: nav links */}
          <nav className="nav-links">
            {NAV_ITEMS.map(({ key, label, Mega, href }) => (
                <div
                  key={key}
                  ref={el => navItemRefs.current[key] = el}
                  className={`nav-item ${activeMega === key ? "nav-item-active" : ""}`}
                  onMouseEnter={() => Mega && openMega(key)}
                  onMouseLeave={() => Mega && closeMega()}
                >
                  <a href={href} className="nav-btn">
                    {label}
                    {Mega && <ChevronDown size={10} className={`nav-chev ${activeMega === key ? "nav-chev-open" : ""}`} />}
                  </a>
                  {Mega && activeMega === key && (
                    <div className="mega-wrap" style={{ left: megaLeft }} onMouseEnter={keepMega} onMouseLeave={closeMega}>
                      <Mega />
                    </div>
                  )}
                </div>
              ))}
          </nav>

            {/* ── CENTER: logo */}
            <a href="/" className="nav-logo" aria-label="Artsays Home">
              <img src="/assets/home/logo.svg" alt="Artsays Logo" width="150" height="42" />
            </a>

          {/* ── RIGHT: search + actions */}
          <div className="nav-actions">

              {/* Search */}
              <div className="nav-search-wrap" ref={searchRef}>
                <button
                  className={`nav-search-btn ${showSearch ? "nav-search-open" : ""}`}
                  onClick={() => setShowSearch(s => !s)}
                  aria-label="Search"
                >
                  <Search size={16} />
                  <span className="nav-search-label">Search</span>
                </button>
                <SearchDropdown
                  visible={showSearch}
                  query={searchQuery}
                  setQuery={setSearchQuery}
                  tab={searchTab}
                  setTab={setSearchTab}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowSearch(false);
                    navigate(searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery.trim())}` : "/search");
                  }}
                />
              </div>

            {/* ── Guest */}
            {!isLoggedIn && (
              <>
                <button className="nav-icon-btn" onClick={() => toast.info("Please login to access your cart.")} title="Cart">
                  <ShoppingCart size={18} />
                </button>
                <a href="/login" className="nav-cta-btn">Get Started</a>
              </>
            )}

              {/* ── Buyer: cart + notifications */}
              {isLoggedIn && Usertype === "Buyer" && (
                <>
                  <NotificationDropdown
                    userId={userId}
                    onUnreadChange={(count) => setUnreadCount(count)}
                  />
                  <div style={{ position: "relative", display: "inline-flex" }}>
                    <button className="nav-icon-btn" onClick={() => navigate(`/my-account/my-cart/${userId}`)} title="Cart">
                      <ShoppingCart size={18} />
                    </button>
                    {cartCount > 0 && (
                      <span className="nav-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                    )}
                  </div>
                </>
              )}

              {/* ── Artist / Seller: CREATE + BELL */}
              {isLoggedIn && (Usertype === "Artist" || Usertype === "Seller") && (
                <>
                  <div className="nav-create-wrap" ref={createRef}>
                    <button className="nav-create-btn" onClick={() => setShowCreate(s => !s)}>
                      <Plus size={14} /> Create
                    </button>
                    {showCreate && <CreateDrop usertype={Usertype} onClose={() => setShowCreate(false)} />}
                  </div>
                    <SellerNotificationDropdown />
                </>
              )}

              {/* ── Super-Admin: bell + blog */}
              {isLoggedIn && Usertype === "Super-Admin" && (
                <>
                  <SuperAdminNotificationDropdown />
                  <a href="/blogs" className="nav-blog-link">Blog</a>
                </>
              )}

            {/* ── Avatar dropdown */}
            {isLoggedIn && (
                <div className="nav-avatar-wrap" ref={avatarRef}>
                  <button className="nav-avatar-btn focus:outline-none" onClick={() => setShowAvatarDrop(s => !s)} aria-label="Toggle profile menu">
                    <img src={avatarSrc} className="nav-avatar-img" alt="Profile" width="32" height="32" />
                    <ChevronDown size={12} className={`nav-av-chev ${showAvatarDrop ? "nav-chev-open" : ""}`} />
                  </button>

                {showAvatarDrop && (
                  <div className="av-drop">
                    <div className="av-drop-arrow" />

                    {/* profile row */}
                    <div className="av-profile">
                      <img src={avatarSrc} className="av-avatar" alt="" />
                      <div>
                        <p className="av-name">{user.name} {user.lastName}</p>
                        <p className="av-role">{Usertype}</p>
                      </div>
                    </div>
                    <div className="av-sep" />

                    {/* Buyer */}
                    {Usertype === "Buyer" && (<>
                      <Link to="/my-account" className="av-item" onClick={() => setShowAvatarDrop(false)}><FaUser size={13} /> My Account</Link>
                      <Link to="/my-account/my-orders" className="av-item" onClick={() => setShowAvatarDrop(false)}><BsBoxSeam size={13} /> Orders</Link>
                      <Link to={`/my-account/wishlist/${userId}`} className="av-item" onClick={() => setShowAvatarDrop(false)}><HiOutlineHeart size={13} /> Wishlist</Link>
                      <Link to="/my-account/buyer-wallet" className="av-item" onClick={() => setShowAvatarDrop(false)}><IoWalletOutline size={13} /> Wallet</Link>
                      <Link to="/my-account/notifications" className="av-item" onClick={() => setShowAvatarDrop(false)}><IoMdNotificationsOutline size={13} /> Notifications</Link>
                    </>)}

                    {/* Artist / Seller */}
                    {(Usertype === "Artist" || Usertype === "Seller") && (<>
                      <div className="av-item" onClick={() => { dashboardRoute(); setShowAvatarDrop(false); }}><FaUser size={13} /> My Dashboard</div>
                      <Link to={`/artsays-community/profile/${userId}`} className="av-item" onClick={() => setShowAvatarDrop(false)}><Users size={13} /> Community Profile</Link>
                      <Link to={Usertype === "Artist" ? "/artist/dashboard" : "/seller/dashboard"} className="av-item" onClick={() => setShowAvatarDrop(false)}><IoWalletOutline size={13} /> Wallet / Earnings</Link>
                      <Link to="/artsays-community/notification" className="av-item" onClick={() => setShowAvatarDrop(false)}><IoMdNotificationsOutline size={13} /> Notifications</Link>
                    </>)}

                    {/* Super-Admin */}
                    {Usertype === "Super-Admin" && (<>
                      <div className="av-item" onClick={() => { dashboardRoute(); setShowAvatarDrop(false); }}><FaUser size={13} /> Dashboard</div>
                      <Link to="/artsays-community/notification" className="av-item" onClick={() => setShowAvatarDrop(false)}><IoMdNotificationsOutline size={13} /> Notifications</Link>
                    </>)}

                    <div className="av-sep" />

                    {/* Community switch */}
                    {!isSuperAdminSub && (
                      <Link
                        to={isOnCommunity ? "/" : "/artsays-community"}
                        className="av-item av-community"
                        onClick={() => setShowAvatarDrop(false)}
                      >
                        <img src={isOnCommunity ? AIcon : artLogo} alt="" style={{ width: 14, height: 14, objectFit: "contain" }} />
                        {isOnCommunity ? "Switch to Artsays" : "Switch to Community"}
                      </Link>
                    )}

                    <div className="av-item av-logout" onClick={handleSignOut}><BiLogOut size={13} /> Logout</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

        {/* ══════════════════ MOBILE TOP BAR ══════════════════ */}
        <nav className="mob-bar">
          <a href={isOnCommunity ? "/artsays-community/" : "/"} className="mob-logo" aria-label="Artsays Home">
            <img src="/assets/home/logo.svg" alt="Artsays Logo" width="115" height="32" />
          </a>
          <div className="mob-bar-right">
            {isLoggedIn && isOnCommunity && (
              <Link to="/artsays-community/notification" className="mob-icon-btn" style={{ position: "relative" }} aria-label="Notifications">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="mob-notif-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
                )}
              </Link>
            )}
            {isLoggedIn && !isOnCommunity && (
              <button className="mob-icon-btn" onClick={() => navigate("/artsays-community/notification")} aria-label="Notifications">
                <IoMdNotificationsOutline size={22} />
              </button>
            )}
            {isLoggedIn ? (
              <button className="mob-menu-btn" onClick={() => setShowSidebar(true)} aria-label="Open sidebar">
                <img src={avatarSrc} className="mob-av-img" alt="Profile" width="32" height="32" />
              </button>
            ) : (
              <>
                <a href="/login" className="nav-cta-btn" style={{ fontSize: 12, padding: "6px 14px" }}>Get Started</a>
                <button className="mob-menu-btn" onClick={() => setShowSidebar(true)} aria-label="Open Menu">
                  <Menu size={22} />
                </button>
              </>
            )}
          </div>
        </nav>

        {/* ══════════════════ MOBILE SIDEBAR ══════════════════ */}
        <div className={`mob-sidebar ${showSidebar ? "mob-sidebar-open" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          {/* sidebar header */}
            <div className="mob-sb-head">
              <button className="mob-sb-close" onClick={() => setShowSidebar(false)} aria-label="Close sidebar">
                <X size={20} />
              </button>
            <img src={avatarSrc} className="mob-sb-av" alt="Profile" width="80" height="80" />
          {isLoggedIn ? (
            <div className="mob-sb-info">
              <span className="mob-sb-name">{user.name} {user.lastName}</span>
              {profile.verified?.length > 0 && (
                <img
                  src={getImageUrl(profile.verified[profile.verified.length - 1]?.badgeImage)}
                  style={{ width: 18, height: 18, objectFit: "contain" }}
                  alt="Verified Badge"
                  width="18"
                  height="18"
                />
              )}
              <span className="mob-sb-role">{Usertype}</span>
            </div>
          ) : (
            <p className="mob-sb-name" style={{ marginTop: 8 }}>Welcome to Artsays</p>
          )}
        </div>

        {/* sidebar body */}
        <div className="mob-sb-body">

          {/* ── COMMUNITY SIDEBAR (when on /artsays-community) ── */}
          {isOnCommunity && isLoggedIn && (
            <>
              {commItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.link}
                  className={`mob-item ${location.pathname === item.link ? "mob-item-active" : ""} ${item.key === "logout" ? "mob-item-logout" : ""}`}
                  onClick={() => setShowSidebar(false)}
                >
                  <span className="mob-icon">{item.icon}</span>
                  {item.label}
                  {item.key === "notification" && unreadCount > 0 && (
                    <span className="mob-badge-inline">{unreadCount > 99 ? "99+" : unreadCount}</span>
                  )}
                </Link>
              ))}
              <div className="mob-sep" />
              <Link to="/" className="mob-item mob-item-comm" onClick={() => setShowSidebar(false)}>
                <img src={AIcon} style={{ width: 18, marginRight: 12 }} alt="" />
                Switch to Artsays
              </Link>
            </>
          )}

          {/* ── REGULAR SIDEBAR ── */}
          {!isOnCommunity && (<>
            {/* Guest */}
            {!isLoggedIn && (<>
              <a href="/art-gallery" className="mob-item" onClick={() => setShowSidebar(false)}><MdLibraryAdd className="mob-icon" /> Art Gallery</a>
              <a href="/bid" className="mob-item" onClick={() => setShowSidebar(false)}><RiAuctionFill className="mob-icon" /> Bid</a>
              <a href="/store" className="mob-item" onClick={() => setShowSidebar(false)}><PiHandbagBold className="mob-icon" /> Store</a>
              <a href="/artsays-community" className="mob-item" onClick={() => setShowSidebar(false)}><img src={artLogo} className="mob-icon" alt="" style={{ width: 18, height: 18 }} /> Community</a>
              <a href="/blogs" className="mob-item" onClick={() => setShowSidebar(false)}><Star size={18} className="mob-icon" /> Blog</a>
              <div className="mob-sep" />
              <a href="/login" className="mob-item mob-item-login" onClick={() => setShowSidebar(false)}><FaUser className="mob-icon" /> Login / Sign Up</a>
            </>)}

            {/* Buyer */}
              {isLoggedIn && Usertype === "Buyer" && (<>
                <Link to="/my-account" className="mob-item" onClick={() => setShowSidebar(false)}><FaUser className="mob-icon" /> My Account</Link>
                <Link to="/art-gallery" className="mob-item" onClick={() => setShowSidebar(false)}><MdLibraryAdd className="mob-icon" /> Art Gallery</Link>
                <Link to="/bid" className="mob-item" onClick={() => setShowSidebar(false)}><RiAuctionFill className="mob-icon" /> Bid</Link>
                <Link to="/store" className="mob-item" onClick={() => setShowSidebar(false)}><PiHandbagBold className="mob-icon" /> Store</Link>
                <Link to={`/my-account/my-cart/${userId}`} className="mob-item" onClick={() => setShowSidebar(false)}><BiCart className="mob-icon" /> Cart</Link>
                <Link to="/my-account/my-orders" className="mob-item" onClick={() => setShowSidebar(false)}><BsBoxSeam className="mob-icon" /> Orders</Link>
                <Link to="/my-account/notifications" className="mob-item" onClick={() => setShowSidebar(false)}><IoMdNotificationsOutline className="mob-icon" /> Notifications</Link>
                <Link to="/my-account/buyer-wallet" className="mob-item" onClick={() => setShowSidebar(false)}><IoWalletOutline className="mob-icon" /> Wallet</Link>
              <Link to={`/my-account/wishlist/${userId}`} className="mob-item" onClick={() => setShowSidebar(false)}><HiOutlineHeart className="mob-icon" /> Wishlist</Link>
              <Link to="/my-account/manage-address" className="mob-item" onClick={() => setShowSidebar(false)}><RiMapPin2Line className="mob-icon" /> Manage Address</Link>
              <Link to="/my-account/payment-method" className="mob-item" onClick={() => setShowSidebar(false)}><RiMoneyRupeeCircleLine className="mob-icon" /> Payment Methods</Link>
              <Link to="/my-account/password-manager" className="mob-item" onClick={() => setShowSidebar(false)}><MdOutlineSecurity className="mob-icon" /> Password Manager</Link>
              <Link to="/my-account/account-verification" className="mob-item" onClick={() => setShowSidebar(false)}><MdVerified className="mob-icon" /> Account Verification</Link>
              <Link to="/my-account/bank-payment-details" className="mob-item" onClick={() => setShowSidebar(false)}><CiCreditCard1 className="mob-icon" /> Bank Payment Details</Link>
              <Link to="my-account/social-media-promotion" className="mob-item" onClick={() => setShowSidebar(false)}><FaShareAlt className="mob-icon" /> Social Media Promotion</Link>
              <Link to="my-account/custom-request" className="mob-item" onClick={() => setShowSidebar(false)}><FaTools className="mob-icon" /> Custom Request</Link>
              <Link to="my-account/security-agreements" className="mob-item" onClick={() => setShowSidebar(false)}><RiLockPasswordLine className="mob-icon" /> Security & Agreements</Link>
              <div className="mob-sep" />
              <Link to="/artsays-community" className="mob-item mob-item-comm" onClick={() => setShowSidebar(false)}>
                  <img src={artLogo} style={{ width: 18, height: 18, marginRight: 10 }} alt="" />
                  Switch to Community
                </Link>
                <div className="mob-item mob-item-logout" onClick={handleSignOut}><BiLogOut className="mob-icon" /> Logout</div>
              </>)}

              {/* Artist / Seller */}
              {isLoggedIn && (Usertype === "Artist" || Usertype === "Seller") && (<>
                <div className="mob-item" onClick={() => { dashboardRoute(); setShowSidebar(false); }}><FaUser className="mob-icon" /> My Dashboard</div>
                <Link to="/artsays-community/create-post" className="mob-item" onClick={() => setShowSidebar(false)}><Plus size={18} className="mob-icon" /> Create Post</Link>
                <Link to={Usertype === "Artist" ? "/artist/product/product-upload" : "/seller/product/product-upload"} className="mob-item" onClick={() => setShowSidebar(false)}><ShoppingCart size={18} className="mob-icon" /> Upload Product</Link>
                <Link to="/artsays-community/create-live" className="mob-item" onClick={() => setShowSidebar(false)}><FaVideo size={18} className="mob-icon" /> Go Live</Link>
                  <Link to="/artsays-community" className="mob-item" onClick={() => setShowSidebar(false)}><img src={artLogo} className="mob-icon" alt="" style={{ width: 18, height: 18 }} /> Community</Link>
                <Link to="/artsays-community/explore" className="mob-item" onClick={() => setShowSidebar(false)}><Compass size={18} className="mob-icon" /> Explore Creators</Link>
                <Link to="/blogs" className="mob-item" onClick={() => setShowSidebar(false)}><MdLibraryAdd className="mob-icon" /> Blog</Link>
                <div className="mob-sep" />
                {!isSuperAdminSub && (
                  <Link to="/artsays-community" className="mob-item mob-item-comm" onClick={() => setShowSidebar(false)}>
                    <img src={artLogo} style={{ width: 18, height: 18, marginRight: 10 }} alt="" />
                    Switch to Community
                  </Link>
                )}
                <div className="mob-item mob-item-logout" onClick={handleSignOut}><BiLogOut className="mob-icon" /> Logout</div>
              </>)}

              {/* Super-Admin */}
              {isLoggedIn && Usertype === "Super-Admin" && (<>
                <div className="mob-item" onClick={() => { dashboardRoute(); setShowSidebar(false); }}><FaUser className="mob-icon" /> My Dashboard</div>
                <Link to="/blogs" className="mob-item" onClick={() => setShowSidebar(false)}><MdLibraryAdd className="mob-icon" /> Blog</Link>
                <div className="mob-sep" />
                {!isSuperAdminSub && (
                  <Link to="/artsays-community" className="mob-item mob-item-comm" onClick={() => setShowSidebar(false)}>
                    <img src={artLogo} style={{ width: 18, height: 18, marginRight: 10 }} alt="" />
                  Switch to Community
                </Link>
              )}
              <div className="mob-item mob-item-logout" onClick={handleSignOut}><BiLogOut className="mob-icon" /> Logout</div>
            </>)}

            </>)}
        </div>
      </div>

      {/* Overlay */}
      <div className={`mob-overlay ${showSidebar ? "mob-overlay-on" : ""}`} onClick={() => setShowSidebar(false)} />

      {/* ══════════════ COMMUNITY MOBILE BOTTOM NAV ══════════════ */}
      {isOnCommunity && (
        <nav className="mob-bottom comm-bottom">
          {/* Home */}
          <Link to="/artsays-community/" className={`mbn ${location.pathname === "/artsays-community/" ? "mbn-on" : ""}`}>
            <Home size={20} /><span>Home</span>
          </Link>
          {/* Search */}
          <Link to="/artsays-community/search" className={`mbn ${location.pathname === "/artsays-community/search" ? "mbn-on" : ""}`}>
            <Search size={20} /><span>Search</span>
          </Link>
          {/* CREATE — centre raised button (hidden for buyers) */}
          {!isBuyer ? (
            <div className="mbn-create-wrap" ref={commCreateRef}>
              <button
                className="mbn-create-btn"
                onClick={(e) => { e.stopPropagation(); setShowCommCreate(p => !p); }}
              >
                <Plus size={26} />
              </button>
              {showCommCreate && (
                <div className="mbn-create-pop">
                  <Link to="/artsays-community/create-post" className="mbn-create-opt" onClick={() => setShowCommCreate(false)}>
                    <Plus size={16} /><span>Post</span>
                  </Link>
                  <Link to="/artsays-community/create-live" className="mbn-create-opt" onClick={() => setShowCommCreate(false)}>
                    <Radio size={16} /><span>Live</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <button
              className="mbn-create-btn"
              onClick={() => navigate(`/artsays-community/create-live`)}
              aria-label="Cart"
            >
              <Video size={22} />
            </button>
          )}
          {/* Explore */}
          <Link to="/artsays-community/explore" className={`mbn ${location.pathname === "/artsays-community/explore" ? "mbn-on" : ""}`}>
            <Compass size={20} /><span>Explore</span>
          </Link>
            {/* Profile → opens sidebar */}
            <button className="mbn" onClick={() => setShowSidebar(true)} aria-label="Profile">
              {isLoggedIn
                ? <img src={avatarSrc} className="mbn-av" alt="" width="20" height="20" />
                : <User size={20} />
              }
              <span>Profile</span>
            </button>
          </nav>
        )}

        {/* ══════════════ REGULAR MOBILE BOTTOM NAV ══════════════ */}
        {!isOnCommunity && (
          <nav className="mob-bottom">
            {/* Slot 1 — Home */}
            <a href="/" className={`mbn ${location.pathname === "/" ? "mbn-on" : ""}`} aria-label="Home">
              <Home size={20} /><span>Home</span>
            </a>

            {/* Slot 2 — Explore */}
            <a href="/art-gallery" className={`mbn ${["/art-gallery", "/bid", "/store"].some(p => location.pathname.startsWith(p)) ? "mbn-on" : ""}`} aria-label="Explore">
              <Compass size={20} /><span>Explore</span>
            </a>

            {/* Slot 3 — Raised Cart (Buyer) / Raised Create (Artist|Seller) / Community (Guest|Super-Admin) */}
            {isLoggedIn && Usertype === "Buyer" && (
              <div className="mbn-create-wrap">
                <div style={{ position: "relative", display: "inline-flex" }}>
                  <button
                    className="mbn-create-btn"
                    onClick={() => navigate(`/my-account/my-cart/${userId}`)}
                    aria-label="Cart"
                  >
                    <ShoppingCart size={22} />
                  </button>
                  {cartCount > 0 && (
                    <span className="nav-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                  )}
                </div>
              </div>
            )}
            {isLoggedIn && (Usertype === "Artist" || Usertype === "Seller") && (
              <div className="mbn-create-wrap" ref={regCreateRef}>
                <button
                  className={`mbn-create-btn${showRegCreate ? " mbn-create-btn-on" : ""}`}
                  onClick={() => setShowRegCreate(v => !v)}
                  aria-label="Create New"
                >
                  <Plus size={24} style={{ transition: "transform 0.2s", transform: showRegCreate ? "rotate(45deg)" : "none" }} />
                </button>
                {showRegCreate && (
                  <div className="mbn-create-pop">
                    <Link to="/artsays-community/create-post" className="mbn-create-opt" onClick={() => setShowRegCreate(false)}>
                      <Plus size={15} /> Create Post
                    </Link>
                    <Link to="/artsays-community/create-live" className="mbn-create-opt" onClick={() => setShowRegCreate(false)}>
                      <Video size={15} /> Go Live
                    </Link>
                  </div>
                )}
              </div>
            )}


            {/* Slot 3 — Blog (Super-Admin/Guest) / empty spacer for logged-in roles */}
            {(!isLoggedIn || Usertype === "Super-Admin") && (
              <div className="mbn-create-wrap">
                <button
                  className={`mbn-create-btn ${location.pathname.startsWith("/blogs") ? "mbn-on" : ""
                    }`}
                  onClick={() => navigate("/blogs")}
                  aria-label="Blog"
                >
                  <MdLibraryAdd size={20} />
                </button>
              </div>

            )}
            {(!isLoggedIn || Usertype === "Super-Admin") && (
              <a href="/artsays-community" className={`mbn ${location.pathname.startsWith("/artsays-community") ? "mbn-on" : ""}`} aria-label="Community">
                <Users size={20} /><span>Community</span>
              </a>
            )}
            {isLoggedIn && (Usertype === "Buyer" || Usertype === "Artist" || Usertype === "Seller") && (
              <a href="/artsays-community" className={`mbn ${location.pathname.startsWith("/artsays-community") ? "mbn-on" : ""}`} aria-label="Community">
                <Users size={20} /><span>Community</span>
              </a>
            )}

            {/* Slot 5 — Profile / Login */}
            <button className="mbn" onClick={() => isLoggedIn ? setShowSidebar(true) : navigate("/login")} aria-label="Profile">
              {isLoggedIn
                ? <img src={avatarSrc} className="mbn-av" alt="" width="20" height="20" />
                : <User size={20} />
              }
              <span>{isLoggedIn ? "Profile" : "Login"}</span>
            </button>
        </nav>
      )}
    </div>
  );
};

export default NavBar;
