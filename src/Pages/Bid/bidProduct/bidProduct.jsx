import "../../store/products/product.css";
import React, { useState, useEffect } from "react";
import { Heart, Search, ListFilter, X, ChevronRight, ChevronLeft, Tag, SortAsc, DollarSign, Maximize, Bell, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../api/getAPI";
import { toast } from "react-toastify";
import ProductsSkeliton from "../../../Component/Skeleton/products/ProductsSkeliton";

const BidProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE;
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  const [highestLiveBid, setHighestLiveBid] = useState({});

  const [filters, setFilters] = useState({
    sortBy: "New Arrivals",
    specialTags: [],
    priceRange: 1000000,
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
    periodEra: [],
    auctionType: [],
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
  const [expandedFilters, setExpandedFilters] = useState({});
  const navigate = useNavigate();

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

  const getFinalStatus = (item) => {
    const now = Date.now();
    const start = new Date(item.bidStart).getTime();
    const end = new Date(item.bidEnd).getTime();

    if (now >= end) return "Ended";
    if (now < start) return "Upcoming";
    const minutesLeft = (end - now) / 1000 / 60;
    if (minutesLeft <= 1440) return "Ending Soon";
    return "Hot Deal";
  };

  useEffect(() => {
    let result = [...products];

    if (filters.search) {
      result = result.filter((item) =>
        item.artworkName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.product?.userId?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.product?.userId?.lastName?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.auctionType.length > 0) {
      result = result.filter((item) => {
        const status = getFinalStatus(item);
        if (filters.auctionType.includes("Live Auction")) {
          return status === "Hot Deal" || status === "Ending Soon";
        }
        if (filters.auctionType.includes("Upcoming Auction")) {
          return status === "Upcoming";
        }
        if (filters.auctionType.includes("Ended Auction")) {
          return status === "Ended";
        }
        return false;
      });
    }

    if (filters.specialTags.length > 0) {
      result = result.filter((item) => {
        const p = item.product;
        return filters.specialTags.some((tag) => {
          if (tag === "Limited Edition") return p?.editionType === "Limited Edition";
          if (tag === "Exclusive") return p?.editionType === "Exclusive";
          if (tag === "Verified Seller") return p?.userId?.status === "Verified";
          return false;
        });
      });
    }

    result = result.filter((item) => (highestLiveBid[item._id] || item.basePrice) <= filters.priceRange);

    if (filters.priceBuckets.length > 0) {
      result = result.filter((item) => {
        const price = highestLiveBid[item._id] || item.basePrice;
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
      result = result.filter((item) => {
        const p = item.product;
        const width = p?.dimensions?.width || 0;
        const height = p?.dimensions?.height || 0;
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
      result = result.filter((item) => {
        const p = item.product;
        const name = mainCategoryMap[p?.mainCategory] || p?.mainCategory;
        return filters.mainCategory.includes(name);
      });
    }
    if (filters.category.length > 0) {
      result = result.filter((item) => {
        const p = item.product;
        const name = categoryMap[p?.category] || p?.category;
        return filters.category.includes(name);
      });
    }
    if (filters.subCategory.length > 0) {
      result = result.filter((item) => {
        const p = item.product;
        const name = subCategoryMap[p?.subCategory] || p?.subCategory;
        return filters.subCategory.includes(name);
      });
    }

    if (filters.productType.length > 0) {
      result = result.filter((item) => {
        const p = item.product;
        if (Array.isArray(p?.productType)) {
          return p.productType.some(type => filters.productType.includes(type));
        }
        return filters.productType.includes(p?.productType);
      });
    }

    if (filters.productMedium.length > 0) {
      result = result.filter((item) => filters.productMedium.includes(item.product?.medium));
    }

    if (filters.productMaterial.length > 0) {
      result = result.filter((item) => {
        const p = item.product;
        if (Array.isArray(p?.materials)) {
          return p.materials.some(mat => filters.productMaterial.includes(mat));
        }
        return filters.productMaterial.includes(p?.materials);
      });
    }

    if (filters.productEditionType.length > 0) {
      result = result.filter((item) => filters.productEditionType.includes(item.product?.editionType));
    }

    if (filters.productSurfaceType.length > 0) {
      result = result.filter((item) => filters.productSurfaceType.includes(item.product?.surfaceType));
    }

    if (filters.periodEra.length > 0) {
      result = result.filter((item) => filters.periodEra.includes(item.product?.periodEra));
    }

    if (filters.sortBy === "Price Low to High") {
      result.sort((a, b) => (highestLiveBid[a._id] || a.basePrice) - (highestLiveBid[b._id] || b.basePrice));
    } else if (filters.sortBy === "Price High to Low") {
      result.sort((a, b) => (highestLiveBid[b._id] || b.basePrice) - (highestLiveBid[a._id] || a.basePrice));
    } else if (filters.sortBy === "New Arrivals") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, filters, options.categories, highestLiveBid]);

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

  const slugify = (text = "") =>
    text
      ?.toString()
      ?.toLowerCase()
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/(^-|-$)+/g, "") || "artwork";

  const getTimeRemaining = (end) => {
    const now = new Date().getTime();
    const endTime = new Date(end).getTime();
    const diff = endTime - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) return `${days} Days`;
    return `${hours} Hrs ${mins} Mins`;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [bidRes, badgeRes] = await Promise.all([
        getAPI(`/api/bidding/products/all`, {}, true, false),
        getAPI(`/api/products/approved-with-badges`, {}, true, false),
      ]);

      const list = Array.isArray(bidRes?.data) ? bidRes.data : [];
      const badgeData = badgeRes?.data?.data || [];

      const finalList = list
        .filter((item) => item?.product)
        .map((item) => {
          const p = item.product;
          const realProductId = p?._id || p?.productId || p?.product || null;
          const match = realProductId ? badgeData.find((b) => b && b._id === realProductId) : null;

          return {
            ...item,
            product: {
              ...p,
              seller: match?.seller || p?.seller || null,
              badges: match?.badges || p?.badges || [],
            },
          };
        });

      setProducts(finalList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      await fetchLiveHighestBids(finalList);
    } catch (err) {
      console.error("Error fetching bidding products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveHighestBids = async (productsList) => {
    try {
      const highestMap = {};
      await Promise.all(
        productsList.map(async (item) => {
          const bidId = item._id;
          const res = await getAPI(`/api/bidding/all/${bidId}`, {}, true, false).catch(() => null);
          const allBids = res?.data?.bids || [];
          const highestAmount = allBids.length > 0 ? Math.max(...allBids.map((b) => b.amount)) : item.basePrice;
          highestMap[bidId] = highestAmount;
        })
      );
      setHighestLiveBid(highestMap);
    } catch (err) {
      console.log("Live bid fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      fetchLiveHighestBids(products);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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

  if (loading && products.length === 0) return (
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
                <h2 className="text-xl font-bold text-gray-900 mb-1">Filter Auctions</h2>
                <p className="text-sm text-gray-500">Find your next masterpiece</p>
              </div>

              {/* Sort Section */}
              <FilterSection title="Sort Results" icon={SortAsc} id="sort">
                {["New Arrivals", "Price Low to High", "Price High to Low", "Relevance"].map((option) => (
                  <RadioItem
                    key={option}
                    label={option}
                    name="sortBy"
                    checked={filters.sortBy === option}
                    onChange={() => handleFilterChange("sortBy", option)}
                  />
                ))}
              </FilterSection>

              {/* Auction Type */}
              <FilterSection title="Auction Status" icon={Tag} id="auctionType">
                {["Live Auction", "Upcoming Auction", "Ended Auction"].map((type) => (
                  <CheckboxItem
                    key={type}
                    label={type}
                    checked={filters.auctionType.includes(type)}
                    onChange={(e) => handleFilterChange("auctionType", type, e.target.checked)}
                  />
                ))}
              </FilterSection>

              {/* Special Tags */}
              <FilterSection title="Special Tags" icon={Tag} id="tags">
                {["Limited Edition", "Verified Seller", "Exclusive"].map((tag) => (
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
                  max="1000000"
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

              {/* Dimensions */}
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

              {/* Main Category */}
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

            </div>
          </aside>

          {/* ---------------- MAIN CONTENT ---------------- */}
          <main className="flex-grow">
            {/* Search Bar */}
            <div className="relative mb-3 group">
              <input
                type="text"
                placeholder="Search auctions, artists, or styles..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
              />
            </div>

            {/* Products Grid */}
            <div className="mb-6">
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {currentProducts.map((item, index) => {
                    const status = getFinalStatus(item);
                    const timeRemaining = getTimeRemaining(item.bidEnd);
                    const isEnded = timeRemaining === "Ended";
                    const currentHighestBid = highestLiveBid[item._id] || item.basePrice;

                    return (
                      <div
                        key={item._id}
                        className="group flex flex-col h-full bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100/50 animate-fade-in-up relative"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => { const slug = slugify(item.artworkName); navigate(`/bid-details/${slug}/${item._id}`); }}
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[5/5] overflow-hidden bg-[#F8F9FA]">
                            <img
                              src={`${imageBaseURL}${item.product?.mainImage}`}
                              alt={item.artworkName}
                              className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 ${isEnded ? 'grayscale-[0.5] blur-[2px]' : ''}`}
                            />

                            {/* Bid Ended Overlay */}
                            {isEnded && (
                              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                                <div className="bg-white/90 px-6 py-2 rounded-lg shadow-2xl border border-white/50 transform -rotate-12">
                                  <span className="text-red-600 font-black text-xl uppercase tracking-wider">Bid Ended</span>
                                </div>
                              </div>
                            )}

                          {/* Status Badge */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                            <div className={`backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white/20 
                              ${status === 'Upcoming' ? 'bg-blue-500' : status === 'Ending Soon' ? 'bg-orange-500' : status === 'Ended' ? 'bg-gray-500' : 'bg-green-500'}`}>
                              {status}
                            </div>
                          </div>

                          {/* Bell Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); toast.info("Reminder Set!"); }}
                            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm hover:bg-white hover:text-[#6F4D34] transition-all transform hover:scale-110 z-10"
                          >
                            <Bell size={18} className="text-gray-900" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-grow p-3 gap-3">
                          {/* Artist Info */}
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#6F4D34] animate-pulse" />
                              <span className="text-[#6F4D34] text-[10px] font-black uppercase tracking-widest">
                                {item.product?.userId?.name || "Independent Artist"}
                              </span>
                            </div>
                            <div className="flex -space-x-1.5">
                              {item.product?.badges?.map((img, idx) => (
                                <div key={idx}>
                                  <img src={`${imageBaseURL}${img}`} className="w-4 h-4 rounded-full border border-white" alt="Badge" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#6F4D34] transition-colors tracking-tight">
                            {item.artworkName}
                          </h3>

                          {/* Bidding Info */}
                          <div className="flex flex-col gap-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Starting Price</span>
                              <span className="text-sm font-bold text-gray-900">₹{item.basePrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-[#6F4D34] uppercase tracking-tighter">Highest Bid</span>
                              <span className="text-lg font-black text-[#6F4D34]">₹{currentHighestBid.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-5 gap-2">
                            <div className="col-span-2 flex flex-col justify-center">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Time Left</span>
                              <span className={`text-lg font-black tracking-tight ${status === 'Ending Soon' ? 'text-orange-500' : 'text-gray-900'}`}>
                                {timeRemaining}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const slug = slugify(item.artworkName);
                                navigate(`/bid-details/${slug}/${item._id}`);
                              }}
                              disabled={isEnded}
                              className={`col-span-3 h-[48px] rounded-2xl font-black text-[11px] hover:!text-[#6F4D34] hover:!bg-[#ffffff] uppercase tracking-[0.1em] transition-all duration-300 shadow-sm border border-gray-100 transform active:scale-95 flex items-center justify-center
                                ${isEnded 
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                  : "bg-[#6F4D34] text-white hover:bg-white hover:text-[#6F4D34]"}`}
                            >
                              {status === 'Upcoming' ? 'Remind Me' : isEnded ? 'Ended' : 'Place Bid'}
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No auctions found</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-8">
                    Try adjusting your filters or search term to discover more incredible art auctions.
                  </p>
                    <button
                      onClick={() => setFilters({
                        sortBy: "New Arrivals",
                        specialTags: [],
                      priceRange: 1000000,
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
                      periodEra: [],
                      auctionType: [],
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

export default BidProduct;
