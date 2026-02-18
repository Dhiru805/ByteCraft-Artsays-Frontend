import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { Star, Heart, MapPin, ArrowRight, ShoppingCart, Zap, ChevronLeft, ChevronRight, Share2, Eye, Box, Ruler, Award, ShieldCheck, Truck, Clock, Gift, MessageCircle, FileText, Download, ExternalLink } from "lucide-react";
import { HiMiniPercentBadge } from "react-icons/hi2";
import getAPI from "../../api/getAPI";
import postAPI from "../../api/postAPI";
import deleteAPI from "../../api/deleteAPI";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../AuthContext";
import SponsoredProducts from "../../Component/Common/SponsoredProducts";

const imageBaseURL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

const resolveMediaUrl = (path) => {
  if (!path || typeof path !== "string") return "/images/placeholder.jpg";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const normalized = path.replace(/\\/g, "/");
  const leadingSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  const base = imageBaseURL.endsWith("/") ? imageBaseURL.slice(0, -1) : imageBaseURL;
  return `${base}${leadingSlash}`;
};

const offersData = [
  { title: "Cashback", description: "Upto ₹50.00 cashback as Google Pay Balance when...", offers: "3 offers" },
  { title: "Bank Offer", description: "Upto ₹1,000.00 discount on SBI Credit Cards", offers: "8 offers" },
  { title: "EMI Offers", description: "Get GST invoice and save up to 28% on business purchases", offers: "1 offer" },
  { title: "Festival Offer", description: "Flat ₹500 off on selected paintings during the festival sale", offers: "2 offers" },
];

const addresses = {
  "110017": "23 Aurum Lane, Sector 17, Vasant Vibe, New Delhi",
  "560001": "MG Road, Bangalore, Karnataka",
};

const ProductDetails = () => {
  const { productId } = useParams();
  const id = productId;
  const navigate = useNavigate();
  const { userId: authUserId, userType } = useAuth();
  const userId = authUserId || localStorage.getItem("userId");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categoryData, setCategoryData] = useState({ mainCategories: [], categories: [], subCategories: [] });
  const [quantity, setQuantity] = useState(1);
  const [protection, setProtection] = useState(true);
  const [giftOption, setGiftOption] = useState(true);
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [offerIndex, setOfferIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [likedProducts, setLikedProducts] = useState({});

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleWishlist = async (productId, e) => {
    if (e) e.stopPropagation();
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

      setLikedProducts((prev) => ({
        ...prev,
        [productId]: !isLiked,
      }));
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const navigateToArtistProfile = (artist) => {

    if (!artist) return;
    const profileSlug = artist.username || `${artist.name}_${artist.lastName}_${artist._id}`;
    navigate(`/artsays-community/profile/${profileSlug}`, { state: { userId: artist._id } });
  };

  const ensureBuyer = () => {
    if (userType !== "Buyer") {
      toast.warn("Only buyers can use this feature. Register as a Buyer to continue.");
      return false;
    }
    return true;
  };

  const addToCart = async (productId, desiredQty = 1) => {
    if (!userId) {
      toast.warn("You must be logged in to add items to cart");
      return;
    }
    try {
      await postAPI(`/api/cart/addcart/${productId}`);
      if (desiredQty > 1) {
        await postAPI("/api/cart/update", { userId, productId, quantity: desiredQty });
      }
      toast.success("Added to Cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [res1, res2, ratingRes, badgeRes, reviewRes] = await Promise.all([
          getAPI("/api/getstatusapprovedproduct", {}, true, false),
          getAPI("/api/getstatusapprovedproductforSELLER", {}, true, false),
          getAPI("/api/reviews/aggregated", {}, true, false),
          getAPI("/api/products/approved-with-badges", {}, true, false),
          getAPI("/api/reviews/all-reviews", {}, true, false),
        ]);

        const reviewPayload = reviewRes?.data?.data || reviewRes?.data?.reviews || [];
        setReviews(Array.isArray(reviewPayload) ? reviewPayload : []);

        const products1 = res1?.data?.data?.filter((p) => p && p.status === "Approved") || [];
        const products2 = res2?.data?.data?.filter((p) => p && p.status === "Approved") || [];
        let allProducts = [...products1, ...products2];

        const ratings = ratingRes?.data?.data || [];
        allProducts = allProducts.map((p) => {
          if (!p) return null;
          const matchedRating = ratings.find((r) => r && String(r.productId) === String(p._id));
          return {
            ...p,
            averageRating: matchedRating?.averageRating ? Number(matchedRating.averageRating) : null,
            reviewCount: matchedRating?.reviewCount ?? 0,
          };
        }).filter(Boolean);

        const badgeData = badgeRes?.data?.data || [];
        allProducts = allProducts.map((p) => {
          const match = badgeData.find((b) => b && String(b._id) === String(p._id));
          return {
            ...p,
            seller: match?.seller || p.seller,
            badges: match?.badges || [],
          };
        });

          let found = allProducts.find((p) => p && String(p._id) === String(id));

          // Fallback: fetch product directly by ID (e.g. sponsored/ad products)
          if (!found) {
            try {
              const directRes = await getAPI(`/api/getproduct/${id}`, {}, true, false);
              const directProduct = directRes?.data?.data || directRes?.data;
              if (directProduct && directProduct._id) {
                const matchedRating = ratings.find((r) => r && String(r.productId) === String(directProduct._id));
                const matchedBadge = badgeData.find((b) => b && String(b._id) === String(directProduct._id));
                found = {
                  ...directProduct,
                  averageRating: matchedRating?.averageRating ? Number(matchedRating.averageRating) : null,
                  reviewCount: matchedRating?.reviewCount ?? 0,
                  seller: matchedBadge?.seller || directProduct.seller,
                  badges: matchedBadge?.badges || [],
                };
              }
            } catch (directErr) {
              console.error("Direct product fetch failed:", directErr);
            }
          }

          if (!found) {
            setLoading(false);
            return;
          }

        const gallery = [
          found.mainImage ? resolveMediaUrl(found.mainImage) : "/herosectionimg/placeholder.png",
          ...(found.otherImages || []).map((img) => resolveMediaUrl(img)),
        ];

        setProduct(found);
        setImages(gallery);
        setLoading(false);
      } catch (err) {
        console.error("Failed load:", err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Track recently viewed product in DB
  useEffect(() => {
    if (!product || !userId) return;
    postAPI("/api/recently-viewed", {
      userId,
      productId: product._id,
    })
      .then((res) => console.log("Recently viewed saved:", res))
      .catch((err) => console.error("Recently viewed error:", err));
  }, [product, userId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAPI("/api/all-complete", {}, true, false);
        const data = res?.data?.data || {};
        setCategoryData({
          mainCategories: data.mainCategories || [],
          categories: data.categories || [],
          subCategories: data.subCategories || [],
        });
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
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
    fetchWishlist();
  }, [userId]);

  const mainCategoryName = useMemo(() =>

    categoryData.mainCategories.find((c) => c && String(c._id) === String(product?.mainCategory))?.mainCategoryName || "N/A"
    , [product, categoryData]);

  const categoryName = useMemo(() =>
    categoryData.categories.find((c) => c && String(c._id) === String(product?.category))?.categoryName || "N/A"
    , [product, categoryData]);

  const subCategoryName = useMemo(() =>
    categoryData.subCategories.find((c) => c && String(c._id) === String(product?.subCategory))?.subCategoryName || "N/A"
    , [product, categoryData]);

  const productReviews = useMemo(() => {
    if (!product || !reviews || reviews.length === 0) return [];
    const currentProductIdStr = product._id?.toString() || product._id;
    const currentProductName = (product.productName || "").trim().toLowerCase();

    return reviews.filter((review) => {
      if (!review) return false;
      const reviewProductId = review.productId;
      if (!reviewProductId) return false;

      const reviewProductIdStr = typeof reviewProductId === "object"
        ? reviewProductId._id?.toString() || reviewProductId.toString()
        : reviewProductId.toString();

      if (reviewProductIdStr === currentProductIdStr) return true;

      const buyerRequest = typeof reviewProductId === "object" ? reviewProductId : null;
      if (buyerRequest && buyerRequest.ProductName) {
        if (buyerRequest.ProductName.trim().toLowerCase() === currentProductName) return true;
      }
      if (review.productNameSnapshot && review.productNameSnapshot.trim().toLowerCase() === currentProductName) return true;
      return false;
    }).sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
  }, [product, reviews]);

  const calculateDiscount = (sell, market) => {
    if (sell == null || market == null || sell >= market) return 0;
    return Math.round(((market - sell) / market) * 100);
  };

  const displayPrice = product?.finalPrice;
  const discountPercent = calculateDiscount(displayPrice, product?.marketPrice);
  const ratingValue = Number(product?.averageRating ?? 0);
  const reviewCount = Number(product?.reviewCount ?? 0);

  if (loading) return <ProductDetailsSkeleton />;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Product not found.</div>;

  return (
    <div className="bg-[#F9F7F5] min-h-screen font-[poppins] text-[#1A1A1A]">
      <Helmet>
        <title>{product.productName} | Artsays</title>
        <meta name="description" content={product.description?.slice(0, 150)} />
        <meta property="og:title" content={`${product.productName} | Artsays`} />
        <meta property="og:description" content={product.description?.slice(0, 150)} />
        <meta property="og:image" content={images[0]} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.productName,
            "image": images[0],
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": "Artsays"
            },
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "INR",
              "price": product.finalPrice,
              "availability": product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "itemCondition": "https://schema.org/NewCondition"
            }
          })}
        </script>
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => navigate("/")} className="hover:text-[#6F4D34] transition-colors">Home</button>
          <ChevronRight size={14} />
          <span className="hover:text-[#6F4D34] cursor-pointer">{mainCategoryName}</span>
          <ChevronRight size={14} />
          <span className="text-[#6F4D34] font-semibold">{product.productName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <ProductGallery
              images={images}
              product={product}
              username={product.userId?.username || "Artist"}
              imageBaseURL={imageBaseURL}
              navigate={navigate}
              navigateToArtistProfile={navigateToArtistProfile}
              resolveMediaUrl={resolveMediaUrl}
              handleShare={handleShare}
              handleWishlist={handleWishlist}
              likedProducts={likedProducts}
            />
          </div>


          {/* Right Column: Info & Purchase */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 space-y-6">
              <ProductInfo
                product={product}
                discountPercent={discountPercent}
                ratingValue={ratingValue}
                reviewCount={reviewCount}
                artistName={`${product.userId?.name || ""} ${product.userId?.lastName || ""}`.trim()}
                username={product.userId?.username || "Artist"}
                imageBaseURL={imageBaseURL}
              />

              <PurchaseCard
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
                protection={protection}
                setProtection={setProtection}
                giftOption={giftOption}
                setGiftOption={setGiftOption}
                pinCode={pinCode}
                setPinCode={setPinCode}
                address={address}
                setAddress={setAddress}
                handleSubmit={(e) => {
                  e.preventDefault();
                  if (addresses[pinCode]) setAddress(addresses[pinCode]);
                  else toast.error("Invalid PIN code");
                }}
                onAddToCart={() => { if (ensureBuyer()) addToCart(product._id, quantity); }}
                onBuyNow={() => {
                  if (ensureBuyer()) {
                    const giftWrapAmount = (product.giftWrapping && giftOption) ? (product.giftWrappingCostAmount || 0) : 0;
                    const params = `productId=${product._id}&quantity=${quantity}&giftWrap=${product.giftWrapping && giftOption ? 'true' : 'false'}&giftWrapAmount=${giftWrapAmount}`;
                    navigate(`/my-account/check-out/${userId}?${params}`);
                  }
                }}
              />

              <OffersBlock
                offersData={offersData}
                index={offerIndex}
                setIndex={setOfferIndex}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs */}
        <div className="mt-16 bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar scroll-smooth">
            {["description", "details", "artist", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-lg font-bold transition-all focus:outline-none relative ${activeTab === tab ? "text-[#6F4D34]" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#6F4D34] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === "description" && (
              <div className="space-y-8">
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.description || "No description available."}
                </div>

                {(product.inspirationSource || product.targetedAudience) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                    {product.inspirationSource && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-black text-[#6F4D34] uppercase tracking-widest">The Inspiration</h4>
                        <p className="text-gray-600 leading-relaxed">{product.inspirationSource}</p>
                      </div>
                    )}
                    {product.targetedAudience && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-black text-[#6F4D34] uppercase tracking-widest">Ideal For</h4>
                        <p className="text-gray-600 leading-relaxed">{product.targetedAudience}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "details" && <DetailsGrid product={product} categoryInfo={{ mainCategoryName, categoryName, subCategoryName }} imageBaseURL={imageBaseURL} resolveMediaUrl={resolveMediaUrl} />}

            {activeTab === "artist" && (
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 shrink-0 border-4 border-white shadow-lg">
                  <img
                    src={product.userId?.profilePhoto ? resolveMediaUrl(product.userId.profilePhoto) : "/assets/profile/default.png"}
                    alt="Artist"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {product.userId?.name} {product.userId?.lastName}
                    </h2>
                    {product.userId?.verified && <MdVerified size={20} className="text-blue-600" />}
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed italic">
                    {product.artistBio || "A passionate artist sharing unique visions through Artsays."}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => navigateToArtistProfile(product.userId)}
                      className="px-6 py-3 bg-[#6F4D34] text-white rounded-xl font-bold hover:bg-[#5a3e2a] transition-all flex items-center gap-2"
                    >
                      View Full Portfolio
                    </button>
                    {(!userId || userType === "Buyer") && (
                      <button
                        onClick={() => navigate(`/my-account/custom-request?artistId=${product.userId?._id}`)}
                        className="px-6 py-3 border-2 border-[#6F4D34] text-[#6F4D34] rounded-xl font-bold hover:bg-[#6F4D34]/5 transition-all flex items-center gap-2"
                      >
                        Request Commission
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && <ReviewsList reviews={productReviews} resolveMediaUrl={resolveMediaUrl} onImageClick={setPreviewImage} />}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl max-h-full flex items-center justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
              className="absolute -top-12 right-0 md:-right-12 w-10 h-10 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all flex items-center justify-center z-50"
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Sponsored Similar Products */}
      <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
        <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const ProductGallery = ({ images, product, username, imageBaseURL, navigate, navigateToArtistProfile, resolveMediaUrl, handleShare, handleWishlist, likedProducts }) => {
  const [selected, setSelected] = useState(images[0]);
  const [showRoom, setShowRoom] = useState(false);
  const [roomBg, setRoomBg] = useState("/artimages/viewintheroom.jpg");
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center', transform: 'scale(1)' });
  const [isZoomed, setIsZoomed] = useState(false);

  const roomBgs = ["/artimages/viewintheroom.jpg", "/artimages/wall3.jpg", "/artimages/wall4.webp"];

  useEffect(() => {
    if (images && images.length > 0) {
      setSelected(images[0]);
    }
  }, [images]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.5)',
    });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square md:aspect-[4/3] bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm group">
        <img
          src={selected}
          alt="Product"
          className={`w-full h-full object-contain bg-[#F8F9FA] transition-transform duration-200 ease-out cursor-zoom-in ${!isZoomed ? 'group-hover:scale-105' : ''}`}
          style={isZoomed ? zoomStyle : {}}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {product.iframeLink && (
          <button
            onClick={() => window.open(product.iframeLink, '_blank')}
            className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl flex items-center gap-2 text-[#6F4D34] font-bold text-xs hover:bg-[#6F4D34] hover:text-white transition-all"
          >
            <Eye size={16} /> Interactive 3D/Media
          </button>
        )}

        <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-600 hover:text-[#6F4D34] transition-all"
          >
            <Share2 size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleWishlist(product._id, e); }}
            className={`w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center transition-all ${likedProducts[product._id] ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
          >
            <Heart size={20} fill={likedProducts[product._id] ? "currentColor" : "none"} />
          </button>
        </div>


        {/* <button 
          onClick={() => setShowRoom(true)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white backdrop-blur-md text-[#6F4D34] px-3 py-2 rounded-2xl font-bold text-sm shadow-xl hidden lg:flex items-center gap-2 hover:!bg-[#6F4D34] hover:text-[#ffffff] transition-all border border-[#6F4D34]/10"
        >
          <Eye size={18} /> View in Room
        </button> */}
      </div>

      <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(img)}
            className={`w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all bg-white ${selected === img ? "border-[#6F4D34] scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
          >
            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div
        onClick={() => navigateToArtistProfile(product.userId)}
        className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 group cursor-pointer hover:border-[#6F4D34]/30 transition-all shadow-sm hover:shadow-md"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md">
          <img
            src={product.userId?.profilePhoto ? resolveMediaUrl(product.userId.profilePhoto) : "/assets/profile/default.png"}
            alt="Artist"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Curated By</p>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors">{username}</span>
            {product.userId?.verified && <MdVerified className="text-blue-600" size={14} />}
            <div className="flex gap-1 ml-1">
              {product.badges?.map((img, i) => (
                <img key={i} src={`${imageBaseURL}${img}`} className="w-4 h-4 rounded-full" alt="Badge" />
              ))}
            </div>
          </div>
        </div>
        <ChevronRight size={18} className="ml-auto text-gray-300 group-hover:text-[#6F4D34] transition-all" />
      </div>

      {showRoom && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl aspect-video bg-[#1a1a1a] rounded-[40px] overflow-hidden shadow-2xl">
            <button onClick={() => setShowRoom(false)} className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all flex items-center justify-center">✕</button>

            <img src={roomBg} alt="Room" className="w-full h-full object-cover opacity-80" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative group">
                <img
                  src={selected}
                  alt="Art"
                  className="max-h-[50vh] object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-[12px] border-white/5"
                  style={{ width: 'auto' }}
                />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-medium">
                  {product.dimensions?.width || 100} x {product.dimensions?.height || 70} cm
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-white/10 backdrop-blur-md p-3 rounded-[28px] border border-white/10">
              {roomBgs.map((bg, i) => (
                <button
                  key={i}
                  onClick={() => setRoomBg(bg)}
                  className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${roomBg === bg ? "border-white" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <img src={bg} alt="Room Option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({ product, discountPercent, ratingValue, reviewCount, artistName, username, imageBaseURL }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {product.productName}
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < Math.round(ratingValue) ? "currentColor" : "none"} />
            ))}
            <span className="text-gray-400 text-sm font-bold ml-2">({reviewCount} Verified Reviews)</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="text-green-600 text-sm font-bold">In Stock</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {product.condition === "Resale" && (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 border border-orange-300 rounded-full text-xs font-bold uppercase tracking-wider">Resale</span>
        )}
        {product.tags?.map((t, i) => (
          <span key={i} className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-500">#{t}</span>
        ))}
        {product.editionType && (
          <span className="px-3 py-1 bg-[#6F4D34]/5 text-[#6F4D34] rounded-full text-xs font-bold uppercase tracking-wider">{product.editionType}</span>
        )}
      </div>

      <div className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6F4D34]/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#6F4D34]/10 transition-colors" />

        <div className="relative space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[#6F4D34] uppercase tracking-[0.2em]">Collector's Investment</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">₹ {(product.finalPrice)?.toLocaleString()}</span>
                <span className="text-sm font-bold text-gray-400">INR</span>
              </div>
            </div>

            {discountPercent > 0 && (
              <div className="text-right">
                <div className="inline-flex flex-col items-center bg-red-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-red-500/20">
                  <span className="text-xs font-black leading-none">SAVE</span>
                  <span className="text-lg font-black leading-none">{discountPercent}%</span>
                </div>
              </div>
            )}
          </div>

          {discountPercent > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 font-medium">Original Value:</span>
              <span className="text-gray-400 line-through font-bold decoration-[#6F4D34]/30">₹ {product.marketPrice?.toLocaleString()}</span>
            </div>
          )}

          <div className="h-px bg-gray-100 w-full" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <ShieldCheck size={16} />
            </div>
            <p className="text-[11px] text-gray-500 font-medium leading-tight">
              <span className="font-bold text-gray-900 block">Fully Insured Delivery</span>
              Price inclusive of all taxes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PurchaseCard = ({ product, quantity, setQuantity, protection, setProtection, giftOption, setGiftOption, pinCode, setPinCode, address, setAddress, handleSubmit, onAddToCart, onBuyNow }) => {
  return (
    <div className="bg-white rounded-[32px] border border-gray-200 shadow-xl overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          {product.quantity > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold"
                >-</button>
                <span className="px-6 py-2 text-sm font-bold bg-gray-50 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity || 10, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold"
                >+</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {product.insuranceCoverage && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-[#6F4D34]/20 transition-all" onClick={() => setProtection(!protection)}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${protection ? "bg-[#6F4D34] border-[#6F4D34]" : "border-gray-300 bg-white"}`}>
                  {protection && <span className="text-white text-[10px]">✓</span>}
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-gray-800 leading-tight">Delivery Protection Plan</p>
                  <p className="text-[10px] text-gray-400">Insures against transit damage for ₹2,749</p>
                </div>
                <ShieldCheck size={18} className="text-[#6F4D34]" />
              </div>
            )}

            {product.giftWrapping && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-[#6F4D34]/20 transition-all" onClick={() => setGiftOption(!giftOption)}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${giftOption ? "bg-[#6F4D34] border-[#6F4D34]" : "border-gray-300 bg-white"}`}>
                  {giftOption && <span className="text-white text-[10px]">✓</span>}
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-gray-800 leading-tight">Premium Gift Wrap</p>
                  <p className="text-[10px] text-gray-400">Luxury packaging & custom note for ₹{product.giftWrappingCostAmount?.toLocaleString() || "2,749"}</p>
                </div>
                <Gift size={18} className="text-[#6F4D34]" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {!address ? (
            <form onSubmit={handleSubmit} className="relative group">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6F4D34] transition-colors" />
              <input
                type="text"
                placeholder="Check Delivery Pin"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full h-12 pl-11 pr-12 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#6F4D34] hover:bg-[#6F4D34] hover:text-white rounded-lg transition-all">
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-[#6F4D34]/5 rounded-2xl border border-[#6F4D34]/10">
              <MapPin size={18} className="text-[#6F4D34] shrink-0 mt-0.5" />
              <div className="flex-grow">
                <p className="text-xs font-bold text-[#6F4D34]">Delivering to</p>
                <p className="text-[10px] text-[#6F4D34]/80 font-medium line-clamp-1">{address}</p>
              </div>
              <button onClick={() => setAddress("")} className="text-[10px] font-black text-[#6F4D34] uppercase underline">Change</button>
            </div>
          )}

          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider px-2">
            <div className="flex items-center gap-1"><Truck size={12} /> Free Express Shipping</div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1"><Clock size={12} /> {product.estimatedDelivery || "2-5"} Days</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onAddToCart}
            disabled={!product.quantity}
            className="h-14 rounded-2xl border-2 border-[#6F4D34] text-[#6F4D34] font-black text-sm uppercase tracking-widest hover:bg-[#6F4D34] hover:text-[#ffffff] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} /> Cart
          </button>
          <button
            onClick={onBuyNow}
            disabled={!product.quantity}
            className="h-14 rounded-2xl bg-[#6F4D34] text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-[#6F4D34]/20 hover:bg-[#5a3e2a] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
          >
            <Zap size={18} /> Buy Now
          </button>
        </div>
      </div>

      {!product.quantity && (
        <div className="bg-red-500 text-white text-center py-2 text-[10px] font-black uppercase tracking-[0.2em]">Currently Sold Out</div>
      )}
    </div>
  );
};

const OffersBlock = ({ offersData, index, setIndex }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <HiMiniPercentBadge className="text-red-500" size={20} />
          <h3 className="font-black text-sm uppercase tracking-widest text-gray-900">Elite Offers</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIndex(Math.max(0, index - 1))}
            className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#6F4D34] transition-all disabled:opacity-30"
            disabled={index === 0}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIndex(Math.min(offersData.length - 1, index + 1))}
            className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#6F4D34] transition-all disabled:opacity-30"
            disabled={index >= offersData.length - 1}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden p-1">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {offersData.map((offer, i) => (
            <div key={i} className="min-w-full px-1">
              <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-100 hover:border-[#6F4D34]/20 transition-all">
                <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6F4D34]" />
                  {offer.title}
                </h4>
                <p className="text-xs text-gray-500 leading-tight mb-2">{offer.description}</p>
                <span className="text-[10px] font-black text-[#6F4D34] uppercase px-2 py-0.5 bg-[#6F4D34]/5 rounded-md">{offer.offers}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DetailsGrid = ({ product, categoryInfo, imageBaseURL, resolveMediaUrl }) => {
  const Section = ({ title, icon: Icon, children }) => {
    // Check if any children are not null
    const hasVisibleChildren = React.Children.toArray(children).some(child => child !== null);
    if (!hasVisibleChildren) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6F4D34]/5 flex items-center justify-center text-[#6F4D34]">
            <Icon size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children}
        </div>
      </div>
    );
  };

  const Item = ({ label, value, isLink, isFile }) => {
    if (value === undefined || value === null || value === "" || value === "N/A" || (Array.isArray(value) && value.length === 0)) return null;

    let displayValue = value;
    if (typeof value === 'boolean') {
      displayValue = value ? "Yes" : "No";
    } else if (Array.isArray(value)) {
      displayValue = value.join(", ");
    }

    if (isLink) {
      return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#6F4D34] hover:underline flex items-center gap-1">
            View Link <ExternalLink size={14} />
          </a>
        </div>
      );
    }

    if (isFile) {
      return (
        <div className="flex items-center justify-between p-4 bg-[#6F4D34]/5 rounded-2xl border border-[#6F4D34]/10">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-[#6F4D34]" />
            <span className="text-sm font-bold text-gray-700">{label}</span>
          </div>
          <a
            href={resolveMediaUrl(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#6F4D34]/20 rounded-xl text-[#6F4D34] text-xs font-bold hover:bg-[#6F4D34] hover:text-white transition-all shadow-sm"
          >
            <Download size={14} /> Download
          </a>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
        <span className="text-sm font-bold text-gray-800 text-right">{typeof displayValue === "object" ? displayValue : String(displayValue)}</span>
      </div>
    );
  };

  const isNFT = categoryInfo.categoryName === "NFT Art" || categoryInfo.subCategoryName === "NFT Art";
  const isAntique = categoryInfo.mainCategoryName === "Antiques & Vintage";

  return (
    <div className="space-y-12">
      <Section title="Artwork Identity" icon={Box}>
        <Item label="Main Category" value={categoryInfo.mainCategoryName} />
        <Item label="Category" value={categoryInfo.categoryName} />
        <Item label="Sub Category" value={categoryInfo.subCategoryName} />
        <Item label="Product Type" value={product.productType} />
        <Item label="Edition Type" value={product.editionType} />
        {product.productType === "Limited Edition" && <Item label="Edition Number" value={product.editionNumber} />}
        <Item label="Year of Creation" value={product.year} />
        <Item
          label="Condition"
          value={
            product.condition === "Resale" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 border border-orange-300 rounded-full text-xs font-bold">
                Resale
              </span>
            ) : (
              product.condition
            )
          }
        />
      </Section>

      <Section title="Technical Details" icon={Award}>
        <Item label="Medium" value={product.medium} />
        <Item label="Surface Type" value={product.surfaceType} />
        <Item label="Materials" value={product.materials} />
        <Item label="Biological Material" value={product.biologicalMaterial} />
        <Item label="Print Resolution" value={product.printResolution} />
        <Item label="HSN Code" value={product.hsnCode} />
        <Item label="Handmade" value={product.handmade} />
        <Item label="Is Signed" value={product.isSigned} />
        <Item label="Resin Covered" value={product.isResinCovered} />
        <Item label="Craft Technique" value={product.craftTechnique} />
        <Item label="Tools Used" value={product.toolUsage} />
        <Item label="Functional Use" value={product.functionalUse} />
        <Item label="Material Source" value={product.materialSource} />
        <Item label="Cultural Region" value={product.culturalRegion} />
        <Item label="Custom Engraving" value={product.customEngravingAvailable} />
      </Section>

      <Section title="Physical Attributes" icon={Ruler}>
        <Item label="Width" value={product.width ? `${product.width} cm` : product.dimensions?.width ? `${product.dimensions.width} cm` : null} />
        <Item label="Height" value={product.height ? `${product.height} cm` : product.dimensions?.height ? `${product.dimensions.height} cm` : null} />
        <Item label="Depth" value={product.depth ? `${product.depth} cm` : product.dimensions?.depth ? `${product.dimensions.depth} cm` : null} />
        <Item label="Weight" value={product.weight ? `${product.weight} g` : null} />
        <Item label="Framing" value={product.framing} />
        <Item label="Packaging Type" value={product.packagingType} />
      </Section>

      <Section title="Trust & Compliance" icon={ShieldCheck}>
        <Item label="Provenance" value={product.provenance} />
        <Item label="COA Available" value={product.coaAvailable} />
        <Item label="COA Issuer" value={product.issuerName} />
        <Item label="COA Verification #" value={product.verificationNumber} />
        <Item label="Certificate Format" value={product.certificateFormat} />
        <Item label="Signature Type" value={product.signatureType} />
        <Item label="Ownership Confirmed" value={product.ownershipConfirmation} />
        <Item label="Copyright Rights" value={product.copyrightRights} />
        <Item label="Royalty Terms" value={product.royaltyTerms} />
        <Item label="Ethical Sourcing" value={product.ethicalSourcing} />
        <Item label="Commercial Use" value={product.commercialUse} />
        <Item label="GST Included" value={product.includeGst} />
        {product.includeGst && <Item label="GST Percentage" value={`${product.gstPercentage}%`} />}
        <Item label="Installments Allowed" value={product.allowInstallments} />
        {product.allowInstallments && <Item label="Installment Duration" value={product.installmentDuration} />}
        <Item label="Auto Cancel Order" value={product.autoCancelOrder} />
      </Section>

      {(product.certificateFile || product.coaFile || product.restorationDocumentation || product.certification) && (
        <Section title="Documents & Files" icon={FileText}>
          <Item label="Certificate File" value={product.certificateFile} isFile />
          <Item label="COA Document" value={product.coaFile} isFile />
          <Item label="Restoration Proof" value={product.restorationDocumentation} isFile />
          <Item label="Certification" value={product.certification} isFile />
        </Section>
      )}

      {isNFT && (
        <Section title="NFT Specifications" icon={Zap}>
          <Item label="Blockchain" value={product.blockchainNetwork} />
          <Item label="Token Standard" value={product.tokenStandard} />
          <Item label="Token ID" value={product.tokenId} />
          <Item label="Creator Wallet" value={product.walletAddress} />
          <Item label="Smart Contract" value={product.smartContractAddress} />
          <Item label="Royalty" value={product.royaltyPercentage ? `${product.royaltyPercentage}%` : null} />
          <Item label="Minting Type" value={product.mintingType} />
          <Item label="License Type" value={product.licenseType} />
          <Item label="IPFS Storage" value={product.ipfsStorage} />
          <Item label="IPFS Link" value={product.ipfsLink} isLink />
          <Item label="Software Version" value={product.softwareVersion} />
          <Item label="Unlockable Content" value={product.unlockableContent} />
          {product.unlockableContent && <Item label="Unlockable Link" value={product.unlockableContentLink} isLink />}
          <Item label="File Format" value={product.fileFormat} />
          <Item label="Collection" value={product.collectionName} />
          <Item label="Edition Size" value={product.editionSize} />
          <Item label="Rarity" value={product.rarityType} />
          <Item label="Traits" value={product.traits} />
        </Section>
      )}

      {isAntique && (
        <Section title="Antique & History" icon={Clock}>
          <Item label="Origin Region" value={product.originRegion} />
          <Item label="Period / Era" value={product.periodEra} />
          <Item label="Antique Condition" value={product.antiqueCondition} />
          <Item label="Conservation" value={product.conservationStatus} />
          <Item label="Original/Reproduction" value={product.originalReproduction} />
          <Item label="Provenance History" value={product.provenanceHistory} />
          <Item label="Appraisal Details" value={product.appraisalDetails} />
          <Item label="Cultural Significance" value={product.culturalSignificance} />
          <Item label="Restoration History" value={product.restorationHistory} />
          <Item label="Museum History" value={product.museumExhibitionHistory} />
          <Item label="Maintenance" value={product.maintenanceRequired} />
          <Item label="Engravings" value={product.engravingMarkings} />
          <Item label="Patina/Wear" value={product.patinaWear} />
        </Section>
      )}

      <Section title="Shipping & Returns" icon={Truck}>
        <Item label="Handling Time" value={product.handlingTime} />
        <Item label="Shipping Charges" value={product.shippingCharges ? `₹${product.shippingCharges}` : "Free"} />
        <Item label="Return Policy" value={product.returnPolicy} />
        <Item label="Insurance Coverage" value={product.insuranceCoverage} />
        <Item label="Self Shipping" value={product.selfShipping} />
        <Item label="Export Restriction" value={product.exportRestriction} />
      </Section>
    </div>
  );
};

const ReviewsList = ({ reviews, resolveMediaUrl, onImageClick }) => {
  if (reviews.length === 0) return (
    <div className="text-center py-12 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
      <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
      <p className="text-lg font-bold text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review, i) => (
        <div key={i} className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6F4D34]/10 flex items-center justify-center text-[#6F4D34] font-bold">
                {review.userId?.name?.[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{review.userId?.name} {review.userId?.lastName}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} fill={j < review.rating ? "#facc15" : "none"} className={j < review.rating ? "text-yellow-400" : "text-gray-200"} />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.description}</p>
          {review.photos?.length > 0 && (
            <div className="flex gap-2">
              {review.photos.map((photo, k) => (
                <img
                  key={k}
                  src={resolveMediaUrl(photo)}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100 cursor-pointer hover:border-[#6F4D34]/50 hover:scale-105 transition-all"
                  alt="Review"
                  onClick={() => onImageClick?.(resolveMediaUrl(photo))}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ProductDetailsSkeleton = () => (
  <div className="max-w-[1440px] mx-auto p-8 animate-pulse space-y-10">
    <div className="h-4 w-64 bg-gray-200 rounded-full" />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7 aspect-[4/3] bg-gray-200 rounded-[40px]" />
      <div className="lg:col-span-5 space-y-6">
        <div className="h-10 w-3/4 bg-gray-200 rounded-2xl" />
        <div className="h-6 w-1/2 bg-gray-200 rounded-xl" />
        <div className="h-32 w-full bg-gray-200 rounded-[32px]" />
        <div className="h-48 w-full bg-gray-200 rounded-[32px]" />
      </div>
    </div>
  </div>
);

export default ProductDetails;
