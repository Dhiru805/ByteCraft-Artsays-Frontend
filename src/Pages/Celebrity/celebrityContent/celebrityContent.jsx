import ProductGrid from "../../../Component/ProductCard/ProductCard";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Search,
  ListFilter,
  X,
  ChevronRight,
  ChevronLeft,
  Tag,
  SortAsc,
  DollarSign,
  Maximize,
  ShoppingCart,
  Star,
} from "lucide-react";
import "./CelebrityContent.css";
import "../../store/hero-img/hero-img.css";
import "../../store/products/product.css";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import deleteAPI from "../../../api/deleteAPI";
import { toast } from "react-toastify";
import CelebrityContentSkeleton from "../../../Component/Skeleton/products/CelebrityContentSkeleton";

const CelebrityContent = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [celebrity, setCelebrity] = useState(location?.state?.celebrity);
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const [celebrityDetails, setCelebrityDetails] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [socialProfile, setSocialProfile] = useState(null);
  const [follow, setFollow] = useState(false);
  const [artistProDetails, setArtistProDetails] = useState(null);
  const [celebrityProducts, setCelebrityProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({});
  const [likedProducts, setLikedProducts] = useState({});

  const [filters, setFilters] = useState({
    sortBy: "New Arrivals",
    specialTags: [],
    priceRange: 89700,
    priceBuckets: [],
    size: [],
    mainCategory: [],
    category: [],
    subCategory: [],
    productType: [],
    productMedium: [],
    productMaterial: [],
    productEditionType: [],
    productSurfaceType: [],
    framing: [],
    handmade: [],
    periodEra: [],
    search: "",
  });

  const [options, setOptions] = useState({
    categories: [],
    productTypes: [],
    productMediums: [],
    productMaterials: [],
    productEditionTypes: [],
    productSurfaceTypes: [],
    periodEras: [],
  });

  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;

  const toggleExpand = (category) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const normalizeIds = (arr) =>
    Array.isArray(arr)
      ? arr
          .map((f) => (typeof f === "object" ? f?._id || f?.id || f : f))
          .filter(Boolean)
          .map(String)
      : [];

  const slugify = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const fetchFilterOptions = async () => {
    try {
      const [
        catRes,
        typeRes,
        mediumRes,
        materialRes,
        editionRes,
        surfaceRes,
        eraRes,
      ] = await Promise.all([
        getAPI("/api/all-complete", {}, true, false),
        getAPI("/api/getproducttype", {}, true, false),
        getAPI("/api/getproductmedium", {}, true, false),
        getAPI("/api/getproductmaterials", {}, true, false),
        getAPI("/api/getproducteditiontypes", {}, true, false),
        getAPI("/api/getproductsurfacetypes", {}, true, false),
        getAPI("/api/getperioderas", {}, true, false),
      ]);

      setOptions({
        categories: catRes?.data?.data?.flattened || [],
        productTypes: typeRes?.data || [],
        productMediums: mediumRes?.data || [],
        productMaterials: materialRes?.data || [],
        productEditionTypes: editionRes?.data || [],
        productSurfaceTypes: surfaceRes?.data || [],
        periodEras: eraRes?.data || [],
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const findCelebrityBySlug = async () => {
      if (celebrity) return;
      try {
        const response = await getAPI("/api/celebrities");
        if (response?.data?.data) {
          const found = response.data.data.find(
            (c) => slugify(c.artistName) === slug
          );
          if (found) {
            setCelebrity(found);
          }
        }
      } catch (error) {
        console.error("Error fetching celebrity by slug:", error);
      }
    };
    findCelebrityBySlug();
  }, [slug, celebrity]);

  const fetchCelebrityDetails = async () => {
    try {
      const response = await getAPI(`/artist/artists/${celebrity.artistId}`);
      setCelebrityDetails(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const result = await getAPI(
        `/auth/userid/${celebrity.artistId}`,
        {},
        true,
        false
      );
      if (result?.data?.user) {
        setUserProfile(result.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSocialProfile = async (targetId) => {
    const id = targetId || userProfile?._id;
    if (!id) return;
    try {
      const result = await getAPI(
        `/api/social-media/profile/${id}`,
        {},
        true,
        false
      );
      if (result?.data?.profile) {
        setSocialProfile(result.data.profile);
        const followers = normalizeIds(result.data.profile.followers || []);
        setFollow(userId && followers.includes(String(userId)));
      }
    } catch (error) {
      console.error("Error fetching social profile:", error);
    }
  };

  const fetchArtistProfessionalDetails = async () => {
    try {
      const result = await getAPI(
        `/auth/getartistdetails/${celebrity.artistId}`,
        {},
        true,
        false
      );
      setArtistProDetails(result?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCelebrityProducts = async () => {
    setLoading(true);
    try {
      const [res1, res2, ratingRes, badgeRes] = await Promise.all([
        getAPI("/api/getstatusapprovedproduct", {}, true, false),
        getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
        getAPI("/api/reviews/aggregated", {}, true, false),
        getAPI("/api/products/approved-with-badges", {}, true, false),
      ]);

      const products1 = res1?.data?.data || [];
      const products2 = res2?.data?.data || [];
      const allProducts = [...products1, ...products2];

      const ratings = ratingRes?.data?.data || [];
      const badgeData = badgeRes?.data?.data || [];

      const filtered = allProducts
        .filter((p) => {
          const pid = typeof p.userId === "object" ? p.userId?._id : p.userId;
          return pid === userProfile?._id;
        })
        .map((p) => {
          const matchedRating = ratings.find((r) => r.productId === p._id);
          const matchBadge = badgeData.find((b) => b._id === p._id);
          return {
            ...p,
            averageRating: matchedRating?.averageRating
              ? Number(matchedRating.averageRating)
              : null,
            reviewCount: matchedRating?.reviewCount ?? 0,
            badges: matchBadge?.badges || [],
          };
        });

      setCelebrityProducts(filtered);
      setFilteredProducts(filtered);
    } catch (error) {
      console.log("Error fetching celebrity products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!celebrity?.artistId) return;
    fetchCelebrityDetails();
    fetchUserProfile();
    fetchArtistProfessionalDetails();
  }, [celebrity]);

  useEffect(() => {
    if (!userProfile?._id) return;
    fetchCelebrityProducts();
    fetchWishlist();
    fetchSocialProfile(userProfile._id);
  }, [userProfile]);

  const fetchWishlist = async () => {
    if (!userId) return;
    try {
      const res = await getAPI(`/api/wishlist/${userId}`, {}, true, false);
      const wishlistArray = res?.data?.wishlist || [];
      const obj = {};
      wishlistArray.forEach((item) => {
        obj[item._id] = true;
      });
      setLikedProducts(obj);
    } catch (error) {
      console.log("Error loading wishlist:", error);
    }
  };

  useEffect(() => {
    let result = [...celebrityProducts];

    if (filters.search) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.specialTags.length > 0) {
      result = result.filter((p) => {
        return filters.specialTags.some((tag) => {
          if (tag === "Limited Edition")
            return p.editionType === "Limited Edition";
          if (tag === "Exclusive") return p.editionType === "Exclusive";
          if (tag === "Verified Seller") return p.userId?.status === "Verified";
          if (tag === "Bestseller") return p.reviewCount > 10;
          return false;
        });
      });
    }

    result = result.filter((p) => (p.finalPrice || p.sellingPrice) <= filters.priceRange);

    if (filters.priceBuckets.length > 0) {
      result = result.filter((p) => {
        const displayPrice = p.finalPrice || p.sellingPrice;
        return filters.priceBuckets.some((bucket) => {
          if (bucket === "Under ₹5,000") return displayPrice < 5000;
          if (bucket === "₹5,000 – ₹10,000")
            return displayPrice >= 5000 && displayPrice <= 10000;
          if (bucket === "₹10,000 – ₹25,000")
            return displayPrice > 10000 && displayPrice <= 25000;
          if (bucket === "Above ₹25,000") return displayPrice > 25000;
          return false;
        });
      });
    }

    if (filters.size.length > 0) {
      result = result.filter((p) => {
        const width = p.dimensions?.width || 0;
        const height = p.dimensions?.height || 0;
        const maxDim = Math.max(width, height);
        return filters.size.some((s) => {
          if (s === "Small (<12in)") return maxDim < 12;
          if (s === "Medium (12–24in)") return maxDim >= 12 && maxDim <= 24;
          if (s === "Large (24–48in)") return maxDim > 24 && maxDim <= 48;
          if (s === "Oversized (48in+)") return maxDim > 48;
          return false;
        });
      });
    }

    const mainCategoryMap = Object.fromEntries(
      options.categories
        .filter((c) => c.mainCategoryId)
        .map((c) => [c.mainCategoryId, c.mainCategoryName])
    );
    const categoryMap = Object.fromEntries(
      options.categories
        .filter((c) => c.categoryId)
        .map((c) => [c.categoryId, c.categoryName])
    );
    const subCategoryMap = Object.fromEntries(
      options.categories
        .filter((c) => c.subCategoryId)
        .map((c) => [c.subCategoryId, c.subCategoryName])
    );

    if (filters.mainCategory.length > 0) {
      result = result.filter((p) => {
        const name = mainCategoryMap[p.mainCategory] || p.mainCategory;
        return filters.mainCategory.includes(name);
      });
    }
    if (filters.category.length > 0) {
      result = result.filter((p) => {
        const name = categoryMap[p.category] || p.category;
        return filters.category.includes(name);
      });
    }
    if (filters.subCategory.length > 0) {
      result = result.filter((p) => {
        const name = subCategoryMap[p.subCategory] || p.subCategory;
        return filters.subCategory.includes(name);
      });
    }

    if (filters.productType.length > 0) {
      result = result.filter((p) => {
        if (Array.isArray(p.productType)) {
          return p.productType.some((type) => filters.productType.includes(type));
        }
        return filters.productType.includes(p.productType);
      });
    }

    if (filters.productMedium.length > 0) {
      result = result.filter((p) => filters.productMedium.includes(p.medium));
    }

    if (filters.productMaterial.length > 0) {
      result = result.filter((p) => {
        if (Array.isArray(p.materials)) {
          return p.materials.some((mat) => filters.productMaterial.includes(mat));
        }
        return filters.productMaterial.includes(p.materials);
      });
    }

    if (filters.productEditionType.length > 0) {
      result = result.filter((p) =>
        filters.productEditionType.includes(p.editionType)
      );
    }

    if (filters.productSurfaceType.length > 0) {
      result = result.filter((p) =>
        filters.productSurfaceType.includes(p.surfaceType)
      );
    }

    if (filters.periodEra.length > 0) {
      result = result.filter((p) => filters.periodEra.includes(p.periodEra));
    }

    if (filters.handmade.length > 0) {
      result = result.filter((p) => filters.handmade.includes(p.handmade));
    }

    if (filters.framing.length > 0) {
      result = result.filter((p) => filters.framing.includes(p.framing));
    }

    if (filters.sortBy === "Price Low to High") {
      result.sort((a, b) => (a.finalPrice || a.sellingPrice) - (b.finalPrice || b.sellingPrice));
    } else if (filters.sortBy === "Price High to Low") {
      result.sort((a, b) => (b.finalPrice || b.sellingPrice) - (a.finalPrice || a.sellingPrice));
    } else if (filters.sortBy === "New Arrivals") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === "Trending") {
      result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    setFilteredProducts(result);
  }, [celebrityProducts, filters, options.categories]);

  const handleFilterChange = (category, value, isChecked) => {
    setFilters((prev) => {
      if (
        category === "sortBy" ||
        category === "priceRange" ||
        category === "search"
      ) {
        return { ...prev, [category]: value };
      }

      let updatedFilters = { ...prev };
      const currentList = prev[category] || [];

      if (isChecked) {
        updatedFilters[category] = [...currentList, value];
      } else {
        updatedFilters[category] = currentList.filter((item) => item !== value);
      }

      return updatedFilters;
    });
  };

  const handleFollowToggle = async () => {
    const targetUserId = userProfile?._id;

    try {
      if (!userId) {
        toast.error("Please login to follow artist");
        return;
      }

      if (!targetUserId) {
        toast.error("Artist profile not fully loaded. Please wait.");
        return;
      }

      let response;
      if (follow) {
        response = await postAPI(
          `/api/social-media/unfollow/${targetUserId}`,
          { userId },
          {},
          true
        );
        if (response?.data?.status === 200) {
          toast.warn("Unfollowed artist");
          setFollow(false);
        }
      } else {
        response = await postAPI(
          `/api/social-media/follow/${targetUserId}`,
          { userId },
          {},
          true
        );
        if (response?.data?.status === 200) {
          toast.success("Following artist");
          setFollow(true);
        }
      }

      // Refresh profiles to stay in sync
      fetchUserProfile();
      fetchSocialProfile(targetUserId);
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      toast.error("Failed to update follow status");
    }
  };

  const handleWishlist = async (productId, e) => {
    e.stopPropagation();
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature");
      return;
    }

    const isLiked = likedProducts[productId];
    try {
      if (isLiked) {
        await deleteAPI("/api/wishlist/remove", { params: { userId, productId } });
        toast.warn("Removed from Wishlist");
      } else {
        await postAPI("/api/wishlist/add", { userId, productId });
        toast.success("Added to Wishlist");
      }
      setLikedProducts((prev) => ({ ...prev, [productId]: !isLiked }));
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const addToCart = async (productId, e) => {
    e.stopPropagation();
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature");
      return;
    }
    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, {}, true);
      toast.success("Added to Cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  const renderStars = (avg) => {
    const filled = Math.round(avg || 0);
    return [1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={
          s <= filled
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-200 fill-gray-200"
        }
      />
    ));
  };

  const FilterSection = ({
    title,
    icon: Icon,
    children,
    id,
    optionsLength,
    onExpand,
  }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 animate-slide-up">
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Icon size={18} className="text-[#6F4D34]" />
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
      {optionsLength > 5 && (
        <button
          onClick={onExpand}
          className="text-[#6F4D34] text-sm font-bold mt-4 hover:underline block"
        >
          {expandedFilters[id] ? "Show Less" : `+ ${optionsLength - 5} More`}
        </button>
      )}
    </div>
  );

  const CheckboxItem = ({ label, checked, onChange }) => (
    <label className="flex items-center group cursor-pointer">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center ${
            checked
              ? "border-[#6F4D34] bg-[#6F4D34]"
              : "border-gray-300 group-hover:border-[#6F4D34]"
          }`}
        >
          {checked && (
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <span
        className={`ml-3 text-sm font-medium transition-colors ${
          checked ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"
        }`}
      >
        {label}
      </span>
    </label>
  );

  const RadioItem = ({ label, checked, onChange, name }) => (
    <label className="flex items-center group cursor-pointer">
      <div className="relative flex items-center">
        <input
          type="radio"
          name={name}
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`w-5 h-5 border-2 rounded-full transition-all ${
            checked
              ? "border-[#6F4D34] bg-[#6F4D34]"
              : "border-gray-300 group-hover:border-[#6F4D34]"
          }`}
        >
          <div
            className={`w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${
              checked ? "scale-100" : "scale-0"
            }`}
          />
        </div>
      </div>
      <span
        className={`ml-3 text-sm font-medium transition-colors ${
          checked ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"
        }`}
      >
        {label}
      </span>
    </label>
  );

  const mainCategories = [
    ...new Set(options.categories.map((c) => c.mainCategoryName)),
  ];
  const availableCategories =
    filters.mainCategory.length > 0
      ? [
          ...new Set(
            options.categories
              .filter((c) => filters.mainCategory.includes(c.mainCategoryName))
              .map((c) => c.categoryName)
          ),
        ]
      : [...new Set(options.categories.map((c) => c.categoryName))];

  const availableSubCategories =
    filters.category.length > 0
      ? [
          ...new Set(
            options.categories
              .filter((c) => filters.category.includes(c.categoryName))
              .map((c) => c.subCategoryName)
          ),
        ]
      : filters.mainCategory.length > 0
      ? [
          ...new Set(
            options.categories
              .filter((c) => filters.mainCategory.includes(c.mainCategoryName))
              .map((c) => c.subCategoryName)
          ),
        ]
      : [...new Set(options.categories.map((c) => c.subCategoryName))];

  if (loading || !celebrity)
    return <CelebrityContentSkeleton />;

  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins]">
      {/* ---------------- CELEBRITY HERO SECTION ---------------- */}
      <div className="relative w-full min-h-[400px] md:h-[500px] overflow-hidden flex items-center bg-[#1a1a1a]">
        {/* Background Overlay / Image */}
        <div className="absolute inset-0 opacity-40">
          <img
            src={celebrity?.profilePicture || "/herosectionimg/1.jpg"}
            alt="Hero Background"
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 md:px-12 max-w-[1440px] relative z-10 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Left Content */}
            <div className="flex-1 text-white text-center md:!text-left">
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs md:text-sm font-bold tracking-widest uppercase mb-6 animate-fade-in border border-white/20">
                Featured Art Icon
              </span>
              <div className="items-center md:items-end gap-4 mb-6">
                <h1 className="text-4xl md:text-7xl font-black text-white leading-tight drop-shadow-xl mb-3">
                  {celebrity?.artistName || ""}
                </h1>
                  <button
                    onClick={handleFollowToggle}
                    className={`mb-2 px-6 py-2 rounded-full font-bold transition-all transform active:scale-95 ${
                      follow
                        ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                        : "bg-[#6F4D34] text-white hover:!text-[#6F4D34] hover:bg-[#ffffff] shadow-lg shadow-[#6F4D34]/20"
                    }`}
                  >
                    {follow ? "Unfollow" : "Follow"}
                  </button>
              </div>

              <div className="max-w-2xl mb-6 space-y-4">
                <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed italic border-l-4 border-[#ffffff] pl-6 py-2">
                  {artistProDetails?.description ||
                    userProfile?.description ||
                    celebrityDetails?.description ||
                    "No description available."}
                </p>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-12">
                <div className="text-center md:text-left">
                  <div className="text-4xl font-black text-[#ffffff]">
                    {celebrity?.artWorkCollected || 0}
                  </div>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-widest">
                    Collected
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10 hidden md:block" />
                <div className="text-center md:text-left">
                  <div className="text-4xl font-black text-[#ffffff]">
                    {celebrity?.yearsActiveInArt || 0}
                  </div>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-widest">
                    Years Active
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10 hidden md:block" />
                <div className="text-center md:text-left">
                  <div className="text-4xl font-black text-[#ffffff]">
                    {celebrity?.exhibitionFeatured || 0}
                  </div>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-widest">
                    Exhibitions
                  </div>
                </div>
              </div>
            </div>

            {/* Right Profile Image */}
            <div className="w-64 h-64 md:w-96 md:h-96 shrink-0 relative animate-fade-in-up">
              <div className="absolute inset-0 bg-[#6F4D34] rounded-[40px] rotate-6 scale-95 opacity-50" />
              <img
                src={celebrity?.profilePicture || "/herosectionimg/1.jpg"}
                alt={celebrity?.artistName}
                className="w-full h-full object-cover rounded-[40px] shadow-2xl relative z-10 border-4 border-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 gap-2 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <span
            className="hover:text-[#6F4D34] cursor-pointer font-medium"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <ChevronRight size={14} />
          <span
            className="hover:text-[#6F4D34] cursor-pointer font-medium"
            onClick={() => navigate("/celebrity")}
          >
            Celebrities
          </span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-bold">
            {celebrity?.artistName}
          </span>
        </nav>

        {/* Highlights Section */}
        {celebrity?.highlightsOfJourney && (
          <div className="mb-12 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6F4D34]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-[#6F4D34] rounded-full" />
              Journey Highlights
            </h2>
            <div
              dangerouslySetInnerHTML={{
                __html: celebrity.highlightsOfJourney,
              }}
              className="prose prose-brown max-w-none highlights-of-journey"
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-3">
          {/* ---------------- SIDEBAR FILTERS ---------------- */}
          <aside className="w-full lg:w-[320px] shrink-0">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm font-bold text-[#6F4D34]"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={20} />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </span>
                {showFilters ? <X size={20} /> : <ChevronRight size={20} />}
              </button>
            </div>

            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block sticky top-6 space-y-4`}
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Collection Filters
                </h2>
                <p className="text-sm text-gray-500">Refine the masterpieces</p>
              </div>

              {/* Sort Section */}
              <FilterSection title="Sort By" icon={SortAsc} id="sort">
                {[
                  "New Arrivals",
                  "Trending",
                  "Price Low to High",
                  "Price High to Low",
                ].map((option) => (
                  <RadioItem
                    key={option}
                    label={option}
                    name="sortBy"
                    checked={filters.sortBy === option}
                    onChange={() => handleFilterChange("sortBy", option)}
                  />
                ))}
              </FilterSection>

              {/* Price Range */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slide-up">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign size={18} className="text-[#6F4D34]" />
                  Price Range
                </h3>
                <input
                  type="range"
                  min="295"
                  max="100000"
                  value={filters.priceRange}
                  onChange={(e) =>
                    handleFilterChange("priceRange", Number(e.target.value))
                  }
                  className="w-full accent-[#6F4D34] mb-4"
                />
                <div className="flex justify-between text-sm font-bold text-[#6F4D34] mb-6">
                  <span>₹295</span>
                  <span>₹{filters.priceRange.toLocaleString()}</span>
                </div>
              </div>

              {/* Product Type */}
              {options.productTypes.length > 0 && (
                <FilterSection
                  title="Product Type"
                  icon={Tag}
                  id="productType"
                  optionsLength={options.productTypes.length}
                  onExpand={() => toggleExpand("productType")}
                >
                  {(expandedFilters["productType"]
                    ? options.productTypes
                    : options.productTypes.slice(0, 5)
                  ).map((item) => (
                    <CheckboxItem
                      key={item._id}
                      label={item.name}
                      checked={filters.productType.includes(item.name)}
                      onChange={(e) =>
                        handleFilterChange(
                          "productType",
                          item.name,
                          e.target.checked
                        )
                      }
                    />
                  ))}
                </FilterSection>
              )}

              {/* Handmade */}
              <FilterSection title="Creation" icon={Tag} id="handmade">
                {["Handmade", "Digital", "Machine Made"].map((h) => (
                  <CheckboxItem
                    key={h}
                    label={h}
                    checked={filters.handmade.includes(h)}
                    onChange={(e) =>
                      handleFilterChange("handmade", h, e.target.checked)
                    }
                  />
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* ---------------- MAIN CONTENT ---------------- */}
          <main className="flex-grow">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Celebrity Collection
              </h2>
              <p className="text-gray-500 font-medium">
                Showing {filteredProducts.length} unique pieces curated by{" "}
                {celebrity?.artistName}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3 group">
              <input
                type="text"
                placeholder="Search within this collection..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full p-4 pl-14 bg-white border border-gray-100 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[#6F4D34]/5 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
              />
            </div>

            {/* Products Grid */}
            <div className="mb-12">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredProducts.map((product, index) => {
                      const displayPrice = product.finalPrice || product.sellingPrice;
                      const hasDiscount = displayPrice < product.marketPrice;
                      const discountPercent = hasDiscount
                        ? Math.round(
                            ((product.marketPrice - displayPrice) /
                              product.marketPrice) *
                              100
                          )
                        : 0;

                      return (
                        <div
                          key={product._id}
                          className="group flex flex-col h-full bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 relative"
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => {
                            const slug = slugify(product.productName);
                            navigate(
                              `/product-details/${slug}/${product._id}`
                            );
                          }}
                        >
                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden bg-[#F8F9FA]">
                          <img
                            src={`${imageBaseURL}${product.mainImage}`}
                            alt={product.productName}
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                              !product.quantity || product.quantity === 0
                                ? "blur-[2px]"
                                : ""
                            }`}
                          />

                          {/* Heart Button */}
                          <button
                            onClick={(e) => handleWishlist(product._id, e)}
                            className="absolute top-5 right-5 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-all transform hover:scale-110 z-10"
                          >
                            <Heart
                              size={20}
                              className={`transition-colors ${
                                likedProducts[product._id]
                                  ? "text-red-500 fill-red-500"
                                  : "text-gray-900"
                              }`}
                            />
                          </button>

                          {/* Status Badge */}
                          {(!product.quantity || product.quantity === 0) && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                              <div className="bg-white px-6 py-2 rounded-xl shadow-2xl transform -rotate-6">
                                <span className="text-red-600 font-black text-xl uppercase tracking-wider">
                                  Sold Out
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-grow p-6 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-[#6F4D34]/5 px-3 py-1 rounded-full">
                              <Star
                                size={12}
                                className="text-[#6F4D34] fill-[#6F4D34] mr-1"
                              />
                              <span className="text-[#6F4D34] text-[10px] font-black uppercase tracking-widest">
                                {product.userId?.name || "Premium Artist"}
                              </span>
                            </div>
                            <div className="flex -space-x-1">
                              {product.badges?.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={`${imageBaseURL}${img}`}
                                  className="w-4 h-4 rounded-full border border-white"
                                  alt="Badge"
                                />
                              ))}
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[#6F4D34] transition-colors">
                            {product.productName}
                          </h3>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                              {hasDiscount && (
                                <span className="text-sm text-gray-400 line-through font-bold">
                                  ₹{product.marketPrice.toLocaleString()}
                                </span>
                              )}
                                <span className="text-2xl font-black text-gray-900 tracking-tighter">
                                  ₹{displayPrice.toLocaleString()}
                                </span>
                            </div>
                            {hasDiscount && (
                              <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-black">
                                {discountPercent}% OFF
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-5 gap-3 pt-2">
                            <button
                              onClick={(e) => addToCart(product._id, e)}
                              disabled={
                                !product.quantity || product.quantity === 0
                              }
                              className="col-span-1 h-12 bg-gray-50 text-gray-900 rounded-2xl hover:bg-[#6F4D34] hover:text-white transition-all flex items-center justify-center disabled:opacity-30"
                            >
                              <ShoppingCart size={20} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (userType !== "Buyer") {
                                  toast.warn("Register as a Buyer to shop");
                                  return;
                                }
                                navigate(
                                  `/my-account/check-out/${userId}?productId=${product._id}`
                                );
                              }}
                              disabled={
                                !product.quantity || product.quantity === 0
                              }
                              className="col-span-4 h-12 bg-[#6F4D34] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#5a3e2a] transition-all disabled:bg-gray-200"
                            >
                              {(!product.quantity || product.quantity === 0)
                                ? "Sold Out"
                                : "Buy Now"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-24 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6 text-gray-300">
                    <Search size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No matching pieces found
                  </h3>
                  <p className="text-gray-500 max-w-xs mx-auto mb-8">
                    Try adjusting your filters to explore the rest of this
                    exclusive collection.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        sortBy: "New Arrivals",
                        specialTags: [],
                        priceRange: 100000,
                        priceBuckets: [],
                        size: [],
                        mainCategory: [],
                        category: [],
                        subCategory: [],
                        productType: [],
                        productMedium: [],
                        productMaterial: [],
                        productEditionType: [],
                        productSurfaceType: [],
                        search: "",
                      })
                    }
                    className="text-[#6F4D34] font-bold hover:underline px-8 py-3 border-2 border-[#6F4D34] rounded-full transition-all hover:bg-[#6F4D34] hover:text-white"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CelebrityContent;
