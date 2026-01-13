import React, { useState, useEffect } from "react";
import { Heart, Search, ListFilter, X, ChevronRight, ChevronLeft, Tag, SortAsc, DollarSign, Maximize, ShoppingCart, Star } from "lucide-react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import postAPI from "../../../api/postAPI";
import deleteAPI from "../../../api/deleteAPI";
import { toast } from "react-toastify";
import ProductsSkeliton from "../../../Component/Skeleton/products/ProductsSkeliton";
import "./product.css";

const Product = () => {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

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


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const [likedProducts, setLikedProducts] = useState({});
  const [expandedFilters, setExpandedFilters] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!userId || userType !== "Buyer") return;
    try {
      const res = await getAPI(`/api/cart/${userId}`);
      setCartItems(res?.data?.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId, userType]);

  const toggleExpand = (category) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          catRes,
          typeRes,
          mediumRes,
            materialRes,
            editionRes,
            surfaceRes,
            eraRes
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
    fetchOptions();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (filters.search) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.userId?.name && p.userId.name.toLowerCase().includes(filters.search.toLowerCase())) ||
        (p.userId?.lastName && p.userId.lastName.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    if (filters.specialTags.length > 0) {
      result = result.filter((p) => {
        return filters.specialTags.some((tag) => {
          if (tag === "Limited Edition") return p.editionType === "Limited Edition";
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
        const price = p.finalPrice || p.sellingPrice;
        return filters.priceBuckets.some((bucket) => {
          if (bucket === "Under ₹5,000") return price < 5000;
          if (bucket === "₹5,000 – ₹10,000") return price >= 5000 && price <= 10000;
          if (bucket === "₹10,000 – ₹25,000") return price > 10000 && price <= 25000;
          if (bucket === "Above ₹25,000") return price > 25000;
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

    const mainCategoryMap = Object.fromEntries(options.categories.filter(c => c.mainCategoryId).map(c => [c.mainCategoryId, c.mainCategoryName]));
    const categoryMap = Object.fromEntries(options.categories.filter(c => c.categoryId).map(c => [c.categoryId, c.categoryName]));
    const subCategoryMap = Object.fromEntries(options.categories.filter(c => c.subCategoryId).map(c => [c.subCategoryId, c.subCategoryName]));

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
          return p.productType.some(type => filters.productType.includes(type));
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
          return p.materials.some(mat => filters.productMaterial.includes(mat));
        }
        return filters.productMaterial.includes(p.materials);
      });
    }

    if (filters.productEditionType.length > 0) {
      result = result.filter((p) => filters.productEditionType.includes(p.editionType));
    }

    if (filters.productSurfaceType.length > 0) {
      result = result.filter((p) => filters.productSurfaceType.includes(p.surfaceType));
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
    setCurrentPage(1);
  }, [products, filters, options.categories]);

  const handleFilterChange = (category, value, isChecked) => {
    setFilters((prev) => {
      if (category === "sortBy" || category === "priceRange" || category === "search") {
        return { ...prev, [category]: value };
      }

      let updatedFilters = { ...prev };
      const currentList = prev[category] || [];

      if (isChecked) {
        updatedFilters[category] = [...currentList, value];
      } else {
        updatedFilters[category] = currentList.filter((item) => item !== value);

        if (category === "mainCategory") {
          const categoriesToKeep = options.categories
            .filter(c => updatedFilters.mainCategory.includes(c.mainCategoryName))
            .map(c => c.categoryName);
          updatedFilters.category = updatedFilters.category.filter(c => categoriesToKeep.includes(c));

          const subCategoriesToKeep = options.categories
            .filter(c => updatedFilters.category.includes(c.categoryName))
            .map(c => c.subCategoryName);
          updatedFilters.subCategory = updatedFilters.subCategory.filter(sc => subCategoriesToKeep.includes(sc));
        }

        if (category === "category") {
          const subCategoriesToKeep = options.categories
            .filter(c => updatedFilters.category.includes(c.categoryName))
            .map(c => c.subCategoryName);
          updatedFilters.subCategory = updatedFilters.subCategory.filter(sc => subCategoriesToKeep.includes(sc));
        }
      }

      return updatedFilters;
    });
  };

  const mainCategories = [...new Set(options.categories.map(c => c.mainCategoryName))];
  const availableCategories = filters.mainCategory.length > 0
    ? [...new Set(options.categories.filter(c => filters.mainCategory.includes(c.mainCategoryName)).map(c => c.categoryName))]
    : [...new Set(options.categories.map(c => c.categoryName))];

  const availableSubCategories = filters.category.length > 0
    ? [...new Set(options.categories.filter(c => filters.category.includes(c.categoryName)).map(c => c.subCategoryName))]
    : (filters.mainCategory.length > 0
      ? [...new Set(options.categories.filter(c => filters.mainCategory.includes(c.mainCategoryName)).map(c => c.subCategoryName))]
      : [...new Set(options.categories.map(c => c.subCategoryName))]);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const goToPage = (page) => { setCurrentPage(page); };

  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature, Register as a Buyer to continue.");
      return false;
    }
    return true;
  };

  const slugify = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const handleWishlist = async (productId) => {
    if (!ensureBuyer()) return;
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

  const addToCart = async (productId) => {
    if (!userId) {
      toast.warn("You must be logged in to add items to cart");
      return;
    }
    try {
      await postAPI(`/api/cart/addcart/${productId}`, {}, true);
      toast.success("Added to Cart!");
      fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err);
      const errorMessage = err.response?.data?.message || "Failed to add to cart";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const [res1, res2, ratingRes, badgeRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
          getAPI("/api/reviews/aggregated", {}, true, false),
          getAPI("/api/products/approved-with-badges", {}, true, false),
        ]);

        const products1 = res1?.data?.data?.filter((p) => p.status === "Approved") || [];
        const products2 = res2?.data?.data?.filter((p) => p.status === "Approved") || [];
        const allProducts = [...(products1 || []), ...(products2 || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const ratings = ratingRes?.data?.data || [];
        const productsWithRatings = allProducts.map((product) => {
          const matchedRating = ratings.find((r) => r.productId === product._id);
          const avg = matchedRating?.averageRating ? Number(matchedRating.averageRating) : null;
          const reviewCount = matchedRating?.reviewCount ?? 0;
          return { ...product, averageRating: avg, reviewCount };
        });

        const badgeData = badgeRes?.data?.data || [];
        const finalProducts = productsWithRatings.map((p) => {
          const match = badgeData.find((b) => b._id === p._id);
          return { ...p, seller: match?.seller || p.seller, badges: match?.badges || [] };
        });

        setProducts(finalProducts);
      } catch (error) {
        console.error("Error fetching products or badges:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;
      try {
        const res = await getAPI(`/api/wishlist/${userId}`, {}, true, false);
        const wishlistArray = res?.data?.wishlist || [];
        const obj = {};
        wishlistArray.forEach((item) => { obj[item._id] = true; });
        setLikedProducts(obj);
      } catch (error) {
        console.log("Error loading wishlist:", error);
      }
    };
    fetchWishlist();
  }, [userId]);

  const renderStars = (averageRating) => {
    if (averageRating == null) return [1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} className="text-gray-200 fill-gray-200" />);
    const filled = Math.round(averageRating);
    return [1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={14} className={s <= filled ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
    ));
  };

  const FilterSection = ({ title, icon: Icon, children, id, optionsLength, onExpand }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 animate-slide-up">
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Icon size={18} className="text-[#6F4D34]" />
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
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
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center ${checked ? "border-[#6F4D34] bg-[#6F4D34]" : "border-gray-300 group-hover:border-[#6F4D34]"
          }`}>
          {checked && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className={`ml-3 text-sm font-medium transition-colors ${checked ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"
        }`}>
        {label}
      </span>
    </label>
  );

  const RadioItem = ({ label, checked, onChange, name }) => (
    <label className="flex items-center group cursor-pointer">
      <div className="relative flex items-center">
        <input type="radio" name={name} className="sr-only" checked={checked} onChange={onChange} />
        <div className={`w-5 h-5 border-2 rounded-full transition-all ${checked ? "border-[#6F4D34] bg-[#6F4D34]" : "border-gray-300 group-hover:border-[#6F4D34]"
          }`}>
          <div className={`w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${checked ? "scale-100" : "scale-0"
            }`} />
        </div>
      </div>
      <span className={`ml-3 text-sm font-medium transition-colors ${checked ? "text-[#6F4D34]" : "text-gray-600 group-hover:text-gray-900"
        }`}>
        {label}
      </span>
    </label>
  );

  if (loading) return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins]">
      <div className="max-w-[1440px] mx-auto p-4">
        <ProductsSkeliton />
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins]">
      <div className="w-full max-w-[1440px] mx-auto p-3">
        <div className="flex flex-col lg:flex-row gap-3">

          {/* ---------------- SIDEBAR FILTERS ---------------- */}
          <aside className="w-full lg:w-[300px] shrink-0">
            <div className="lg:hidden">
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

            <div className={`${showFilters ? "block" : "hidden"} lg:block sticky top-6 space-y-4`}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Filter by</h2>
                <p className="text-sm text-gray-500">Refine your art search</p>
              </div>

              {/* Sort Section */}
              <FilterSection title="Sort Results" icon={SortAsc} id="sort">
                {["New Arrivals", "Trending", "Price Low to High", "Price High to Low", "Relevance"].map((option) => (
                  <RadioItem
                    key={option}
                    label={option}
                    name="sortBy"
                    checked={filters.sortBy === option}
                    onChange={() => handleFilterChange("sortBy", option)}
                  />
                ))}
              </FilterSection>

              {/* Special Tags */}
              <FilterSection title="Special Tags" icon={Tag} id="tags">
                {["Limited Edition", "Bestseller", "Verified Seller", "Exclusive"].map((tag) => (
                  <CheckboxItem
                    key={tag}
                    label={tag}
                    checked={filters.specialTags.includes(tag)}
                    onChange={(e) => handleFilterChange("specialTags", tag, e.target.checked)}
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
                  max="89700"
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange("priceRange", Number(e.target.value))}
                  className="w-full accent-[#6F4D34] mb-4"
                />
                <div className="flex justify-between text-sm font-bold text-[#6F4D34] mb-6">
                  <span>₹295</span>
                  <span>₹{filters.priceRange.toLocaleString()}</span>
                </div>
                <div className="space-y-4">
                  {["Under ₹5,000", "₹5,000 – ₹10,000", "₹10,000 – ₹25,000", "Above ₹25,000"].map((bucket) => (
                    <CheckboxItem
                      key={bucket}
                      label={bucket}
                      checked={filters.priceBuckets.includes(bucket)}
                      onChange={(e) => handleFilterChange("priceBuckets", bucket, e.target.checked)}
                    />
                  ))}
                </div>
              </div>

              {/* Size Section */}
              <FilterSection title="Dimensions" icon={Maximize} id="size">
                {["Small (<12in)", "Medium (12–24in)", "Large (24–48in)", "Oversized (48in+)"].map((s) => (
                  <CheckboxItem
                    key={s}
                    label={s}
                    checked={filters.size.includes(s)}
                    onChange={(e) => handleFilterChange("size", s, e.target.checked)}
                  />
                ))}
              </FilterSection>

                {/* Categories */}
                <FilterSection
                  title="Main Category"
                  icon={Tag}
                  id="mainCategory"
                  optionsLength={mainCategories.length}
                  onExpand={() => toggleExpand('mainCategory')}
                >
                  {(expandedFilters['mainCategory'] ? mainCategories : mainCategories.slice(0, 5)).map((name) => (
                    <CheckboxItem
                      key={name}
                      label={name}
                      checked={filters.mainCategory.includes(name)}
                      onChange={(e) => handleFilterChange("mainCategory", name, e.target.checked)}
                    />
                  ))}
                </FilterSection>

                {/* Category */}
                {availableCategories.length > 0 && (
                  <FilterSection
                    title="Category"
                    icon={Tag}
                    id="category"
                    optionsLength={availableCategories.length}
                    onExpand={() => toggleExpand('category')}
                  >
                    {(expandedFilters['category'] ? availableCategories : availableCategories.slice(0, 5)).map((name) => (
                      <CheckboxItem
                        key={name}
                        label={name}
                        checked={filters.category.includes(name)}
                        onChange={(e) => handleFilterChange("category", name, e.target.checked)}
                      />
                    ))}
                  </FilterSection>
                )}

                {/* Sub Category */}
                {availableSubCategories.length > 0 && (
                  <FilterSection
                    title="Sub Category"
                    icon={Tag}
                    id="subCategory"
                    optionsLength={availableSubCategories.length}
                    onExpand={() => toggleExpand('subCategory')}
                  >
                    {(expandedFilters['subCategory'] ? availableSubCategories : availableSubCategories.slice(0, 5)).map((name) => (
                      <CheckboxItem
                        key={name}
                        label={name}
                        checked={filters.subCategory.includes(name)}
                        onChange={(e) => handleFilterChange("subCategory", name, e.target.checked)}
                      />
                    ))}
                  </FilterSection>
                )}

                {/* Product Type */}
                {options.productTypes.length > 0 && (
                  <FilterSection
                    title="Product Type"
                    icon={Tag}
                    id="productType"
                    optionsLength={options.productTypes.length}
                    onExpand={() => toggleExpand('productType')}
                  >
                    {(expandedFilters['productType'] ? options.productTypes : options.productTypes.slice(0, 5)).map((item) => (
                      <CheckboxItem
                        key={item._id}
                        label={item.name}
                        checked={filters.productType.includes(item.name)}
                        onChange={(e) => handleFilterChange("productType", item.name, e.target.checked)}
                      />
                    ))}
                  </FilterSection>
                )}

                {/* Product Medium */}
                {options.productMediums.length > 0 && (
                  <FilterSection
                    title="Medium"
                    icon={Tag}
                    id="productMedium"
                    optionsLength={options.productMediums.length}
                    onExpand={() => toggleExpand('productMedium')}
                  >
                    {(expandedFilters['productMedium'] ? options.productMediums : options.productMediums.slice(0, 5)).map((item) => (
                      <CheckboxItem
                        key={item._id}
                        label={item.name}
                        checked={filters.productMedium.includes(item.name)}
                        onChange={(e) => handleFilterChange("productMedium", item.name, e.target.checked)}
                      />
                    ))}
                  </FilterSection>
                )}

                {/* Product Material */}
                {options.productMaterials.length > 0 && (
                  <FilterSection
                    title="Material"
                    icon={Tag}
                    id="productMaterial"
                    optionsLength={options.productMaterials.length}
                    onExpand={() => toggleExpand('productMaterial')}
                  >
                    {(expandedFilters['productMaterial'] ? options.productMaterials : options.productMaterials.slice(0, 5)).map((item) => (
                      <CheckboxItem
                        key={item._id}
                        label={item.name}
                        checked={filters.productMaterial.includes(item.name)}
                        onChange={(e) => handleFilterChange("productMaterial", item.name, e.target.checked)}
                      />
                    ))}
                  </FilterSection>
                )}

                {/* Product Edition Type */}
                {options.productEditionTypes.length > 0 && (
                  <FilterSection
                    title="Edition Type"
                    icon={Tag}
                    id="productEditionType"
                    optionsLength={options.productEditionTypes.length}
                    onExpand={() => toggleExpand('productEditionType')}
                  >
                    {(expandedFilters['productEditionType'] ? options.productEditionTypes : options.productEditionTypes.slice(0, 5)).map((item) => (
                      <CheckboxItem
                        key={item._id}
                        label={item.name}
                        checked={filters.productEditionType.includes(item.name)}
                        onChange={(e) => handleFilterChange("productEditionType", item.name, e.target.checked)}
                      />
                    ))}
                  </FilterSection>
                )}

                {/* Period / Era */}
                {options.periodEras.length > 0 && (
                  <FilterSection
                    title="Period / Era"
                    icon={Tag}
                    id="periodEra"
                    optionsLength={options.periodEras.length}
                    onExpand={() => toggleExpand('periodEra')}
                  >
                    {(expandedFilters['periodEra'] ? options.periodEras : options.periodEras.slice(0, 5)).map((item) => (
                      <CheckboxItem
                        key={item._id}
                        label={item.name}
                        checked={filters.periodEra.includes(item.name)}
                        onChange={(e) => handleFilterChange("periodEra", item.name, e.target.checked)}
                      />
                    ))}
                  </FilterSection>
                )}

                {/* Product Surface Type */}
                {options.productSurfaceTypes.length > 0 && (
                  <FilterSection
                    title="Surface Type"
                    icon={Tag}
                    id="productSurfaceType"
                    optionsLength={options.productSurfaceTypes.length}
                    onExpand={() => toggleExpand('productSurfaceType')}
                  >
                    {(expandedFilters['productSurfaceType'] ? options.productSurfaceTypes : options.productSurfaceTypes.slice(0, 5)).map((item) => (
                      <CheckboxItem
                        key={item._id}
                        label={item.name}
                        checked={filters.productSurfaceType.includes(item.name)}
                        onChange={(e) => handleFilterChange("productSurfaceType", item.name, e.target.checked)}
                      />
                    ))}
                  </FilterSection>
                )}

                {/* Framing */}
                <FilterSection title="Framing" icon={Tag} id="framing">
                  {["Framed", "Unframed", "Stretched Canvas"].map((f) => (
                    <CheckboxItem
                      key={f}
                      label={f}
                      checked={filters.framing.includes(f)}
                      onChange={(e) => handleFilterChange("framing", f, e.target.checked)}
                    />
                  ))}
                </FilterSection>

                {/* Handmade */}
                <FilterSection title="Creation" icon={Tag} id="handmade">
                  {["Handmade", "Digital", "Machine Made"].map((h) => (
                    <CheckboxItem
                      key={h}
                      label={h}
                      checked={filters.handmade.includes(h)}
                      onChange={(e) => handleFilterChange("handmade", h, e.target.checked)}
                    />
                  ))}
                </FilterSection>


              {/* Additional dynamic filters could go here, following the same pattern */}
            </div>
          </aside>

          {/* ---------------- MAIN CONTENT ---------------- */}
          <main className="flex-grow">
            {/* Search Bar */}
            <div className="relative mb-3 group">
              <input
                type="text"
                placeholder="Search masterpieces, artists, or styles..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
              />
            </div>

            {/* Products Grid */}
            <div className="mb-6">
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {currentProducts.map((product, index) => {
                    const displayPrice = product.finalPrice || product.sellingPrice;
                    const hasDiscount = displayPrice < product.marketPrice;
                    const discountPercent = hasDiscount ? Math.round(((product.marketPrice - displayPrice) / product.marketPrice) * 100) : 0;

                    return (
                      <div
                        key={product._id}
                        className="group flex flex-col h-full bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 animate-fade-in-up relative"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => { const slug = slugify(product.productName); navigate(`/product-details/${slug}/${product._id}`); }}
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[5/5] overflow-hidden bg-[#F8F9FA]">
                          <img
                            src={`${imageBaseURL}${product.mainImage}`}
                            alt={product.productName}
                            className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 ${(!product.quantity || product.quantity === 0) ? 'blur-[2px]' : ''}`}
                          />

                          {/* Sold Out Overlay */}
                          {(!product.quantity || product.quantity === 0) && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                              <div className="bg-white px-6 py-2 rounded-lg shadow-2xl border border-white/50 transform -rotate-12">
                                <span className="text-red-600 font-black text-xl uppercase tracking-wider">Sold Out</span>
                              </div>
                            </div>
                          )}

                          {/* Floating Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                            {product.editionType && (
                              <div className="bg-white backdrop-blur-md text-[#6F4D34] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white/20">
                                {product.editionType}
                              </div>
                            )}
                          </div>

                          {/* Heart Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleWishlist(product._id); }}
                            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-all transform hover:scale-110 group/heart z-10"
                          >
                            <Heart
                              size={18}
                              className={`transition-colors ${likedProducts[product._id] ? "text-red-500 fill-red-500" : "text-gray-900 group-hover/heart:text-red-500"}`}
                            />
                          </button>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-grow p-3 gap-3">
                          {/* Artist Info & Badges */}
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#6F4D34] animate-pulse" />
                              <span className="text-[#6F4D34] text-[10px] font-black uppercase tracking-widest">
                                {product.userId?.name || "Independent Artist"}
                              </span>
                            </div>
                            <div className="flex -space-x-1.5">
                              {product.badges?.map((img, idx) => (
                                <div key={idx}>
                                  <img src={`${imageBaseURL}${img}`} className="w-4 h-4 rounded-full" alt="Badge" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#6F4D34] transition-colors tracking-tight">
                            {product.productName}
                          </h3>

                          {/* Rating & Review Count */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                              <div className="flex items-center mr-1.5">
                                {renderStars(product.averageRating)}
                              </div>
                              <span className="text-[11px] font-black text-gray-900">
                                {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                              • {product.reviewCount || 0} reviews
                            </span>
                            {hasDiscount && (
                              <div className="flex items-center justify-center bg-red-50 text-[#E74C3C] px-2 py-1 rounded-2xl border border-red-100/50 shadow-sm">
                                <span className="text-[8px] font-black uppercase tracking-tighter leading-none">{discountPercent}% Save</span>
                              </div>
                            )}
                          </div>

                          {/* Pricing & Discount */}
                          <div className="flex items-center justify-between mt-auto border-t border-gray-50">
                            <div className="flex items-center gap-2">
                              {hasDiscount && (
                                <span className="text-lg text-gray-400 line-through font-bold">
                                  ₹{product.marketPrice.toLocaleString()}
                                </span>
                              )}
                                <span className="text-2xl font-black text-gray-900 tracking-tighter">
                                  ₹{(product.finalPrice || product.sellingPrice).toLocaleString()}
                                </span>
                            </div>

                            
                          </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-5 gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); if (!ensureBuyer()) return; addToCart(product._id); }}
                                disabled={!product.quantity || product.quantity === 0}
                                className="col-span-1 h-[48px] bg-gray-50 text-gray-900 hover:text-[#ffffff] rounded-2xl hover:bg-[#6F4D34] hover:text-white transition-all duration-300 disabled:opacity-50 border border-gray-100 flex items-center justify-center group/cart shadow-sm"
                                title="Add to Cart"
                              >
                                <div className="relative">
                                  <ShoppingCart size={20} className="transition-transform group-hover/cart:scale-110" />
                                  {(() => {
                                    const cartItem = cartItems.find((item) => item.product?._id === product._id);
                                    return cartItem && cartItem.quantity > 0 ? (
                                      <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg border-2 border-white flex items-center justify-center">
                                        {cartItem.quantity}
                                      </span>
                                    ) : null;
                                  })()}
                                </div>
                              </button>

                              <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!ensureBuyer()) return;
                                if (!product.quantity || product.quantity === 0) return;
                                await addToCart(product._id);
                                navigate(`/my-account/check-out/${userId}?productId=${product._id}`);
                              }}
                              disabled={!product.quantity || product.quantity === 0}
                              className="col-span-4 h-[48px] bg-[#6F4D34] text-white hover:!text-[#6F4D34] rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] transition-all duration-300 shadow-sm hover:!bg-[#ffffff] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed border border-gray-100 transform active:scale-95 flex items-center justify-center overflow-hidden relative"
                            >
                              <span className="relative z-10">
                                {(!product.quantity || product.quantity === 0) ? "Sold Out" : "Shop Now"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6 text-gray-400">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No masterpieces found</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-8">
                    Try adjusting your filters or search term to discover more incredible art.
                  </p>
                    <button
                      onClick={() => setFilters({
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
                      search: "",
                    })}
                    className="text-[#6F4D34] font-bold hover:underline px-6 py-2 border-2 border-[#6F4D34] rounded-full"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* ---------------- STYLISH PAGINATION ---------------- */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2 p-1 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <button
                    disabled={currentPage === 1}
                    onClick={goToPrevPage}
                    className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <div className="flex items-center px-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      if (totalPages > 7) {
                        if (page !== 1 && page !== totalPages && (page < currentPage - 1 || page > currentPage + 1)) {
                          if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="px-1 text-gray-400">...</span>;
                          return null;
                        }
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === currentPage
                              ? "bg-[#6F4D34] text-white shadow-md shadow-[#6F4D34]/20"
                              : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={goToNextPage}
                    className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </nav>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Product;
