import React, { useState, useEffect } from "react";
import postAPI from "../../../../../../../../api/postAPI";
import getAPI from "../../../../../../../../api/getAPI";
import deleteAPI from "../../../../../../../../api/deleteAPI";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Truck } from "lucide-react";
import { LocationSelector } from "../../../../../../../../Component/Common/LocationSelector";
import CheckOutSkeleton from "../../../../../../../../Component/Skeleton/Home/Account/CheckOutSkeleton.jsx";

const CheckOut = () => {
  const userId = localStorage.getItem("userId");
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const quantityParam = Number(searchParams.get("quantity"));
  const directQuantity =
    Number.isFinite(quantityParam) && quantityParam > 0
      ? quantityParam
      : 1;
  const navigate = useNavigate();

  const [billingChoice, setBillingChoice] = useState("same");
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod] = useState("Online");
    const [allAddresses, setAllAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [couponCode, setCouponCode] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
    const [setAppliedCoupons] = useState([]);
  
    const [wallet, setWallet] = useState(null);
    const [useWallet, setUseWallet] = useState(false);
    const [useArtCoins, setUseArtCoins] = useState(false);
    const [coinSetting, setCoinSetting] = useState({ coinValue: 0.10, currency: "INR" });
  
    // Address selection states

  const [selectedDeliveryAddrId, setSelectedDeliveryAddrId] = useState("");
  const [selectedBillingAddrId, setSelectedBillingAddrId] = useState("");
  const [isAddingNewDelivery, setIsAddingNewDelivery] = useState(false);
  const [isAddingNewBilling, setIsAddingNewBilling] = useState(false);

  const [deliveryFormData, setDeliveryFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [billingFormData, setBillingFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [deliveryLocation, setDeliveryLocation] = useState({
    country: null,
    state: null,
    city: null,
  });

  const [billingLocation, setBillingLocation] = useState({
    country: null,
    state: null,
    city: null,
  });

  const fetchProductById = async (id) => {
    try {
      const artist = await getAPI(`/api/getproduct/${id}`);
      if (artist?.data?.data) return artist.data.data;
    } catch (e) {}

    try {
      const seller = await getAPI(`/api/getproduct/${id}`);
      if (seller?.data?.data) return seller.data.data;
    } catch (e) {}

    throw new Error("Product not found");
  };

  const loadOrderItems = async () => {
    try {
      if (productId) {
        const p = await fetchProductById(productId);
        const availableQty = Number(p?.quantity) || 1;
        const buyNowQty = Math.max(1, Math.min(directQuantity, availableQty));

        setCartItems([
          {
            productId: p._id,
            name: p.productName,
            artistName: `${p.userId?.name || p.creator?.name || ""} ${p.userId?.lastName || p.creator?.lastName || ""}`.trim() || p.userId?.username || p.creator?.username || "Artist",
            qty: buyNowQty,
            price: p.finalPrice || p.sellingPrice,
            marketPrice: p.marketPrice || p.sellingPrice,
            subtotal: buyNowQty * (p.finalPrice || p.sellingPrice),
            marketSubtotal: buyNowQty * (p.marketPrice || p.sellingPrice),
          },
        ]);
        return;
      }

      const res = await getAPI(`/api/cart/${userId}`);
      const items = res.data?.items || [];
      const grouped = items
        .filter(item => item && item.product)
        .map((item) => ({
          productId: item.product._id,
          name: item.product.productName,
          artistName: `${item.product.userId?.name || ""} ${item.product.userId?.lastName || ""}`.trim() || item.product.userId?.username || "Artist",
          qty: item.quantity,
          price: item.product.finalPrice || item.product.sellingPrice,
          marketPrice: item.product.marketPrice || item.product.sellingPrice,
          subtotal: item.quantity * (item.product.finalPrice || item.product.sellingPrice),
          marketSubtotal: item.quantity * (item.product.marketPrice || item.product.sellingPrice),
        }));

      setCartItems(grouped);
    } catch (err) {
      console.log("Order items load error:", err);
    }
  };

    const loadUserAndAddresses = async () => {
      try {
        // 1. Load User Data
        const userRes = await getAPI(`/auth/userid/${userId}`);
        const user = userRes.data?.user;
        if (!user) return;
        setUserData(user);
  
        // 2. Load Multiple Addresses from new endpoint
        const addrRes = await getAPI(`/user-address/get-addresses/${userId}`);
        const addresses = Array.isArray(addrRes.data?.addresses) ? addrRes.data.addresses : [];
        setAllAddresses(addresses);
  
        const defaultAddr = addresses.find((a) => a._id === user.selectedAddress) || addresses[0] || null;
        if (defaultAddr) {
          setSelectedDeliveryAddrId(defaultAddr._id);
          setDeliveryFormData({
            firstName: user.name || "",
            lastName: user.lastName || "",
            company: "",
            email: user.email || "",
            phone: user.phone || "",
            country: defaultAddr.country || "",
            street: defaultAddr.addressLine1 || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            zip: defaultAddr.pincode || "",
            landmark: defaultAddr.landmark || "",
            addressLine2: defaultAddr.addressLine2 || "",
          });
          
          setBillingFormData({
            firstName: user.name || "",
            lastName: user.lastName || "",
            company: "",
            email: user.email || "",
            phone: user.phone || "",
            country: defaultAddr.country || "",
            street: defaultAddr.addressLine1 || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            zip: defaultAddr.pincode || "",
            landmark: defaultAddr.landmark || "",
            addressLine2: defaultAddr.addressLine2 || "",
          });
        } else {
          setIsAddingNewDelivery(true);
          setDeliveryFormData({
            firstName: user.name || "",
            lastName: user.lastName || "",
            company: "",
            email: user.email || "",
            phone: user.phone || "",
            country: "",
            street: "",
            city: "",
            state: "",
            zip: "",
            landmark: "",
            addressLine2: "",
          });
          setBillingFormData({
            firstName: user.name || "",
            lastName: user.lastName || "",
            company: "",
            email: user.email || "",
            phone: user.phone || "",
            country: "",
            street: "",
            city: "",
            state: "",
            zip: "",
            landmark: "",
            addressLine2: "",
          });
        }
  
      } catch (err) {
        console.log("Error loading user data:", err);
        setIsAddingNewDelivery(true);
        setAllAddresses([]);
      }
    };
  
    const loadWalletData = async () => {
      try {
        const walletRes = await getAPI(`/api/wallet/${userId}`);
        setWallet(walletRes.data);
  
        const coinSettingsRes = await getAPI("/api/coin-settings");
        if (coinSettingsRes.data) {
          setCoinSetting(coinSettingsRes.data);
        }
      } catch (err) {
        console.error("Error loading wallet data:", err);
      }
    };
  
    useEffect(() => {
      const init = async () => {
        try {
          await Promise.all([loadOrderItems(), loadUserAndAddresses(), loadWalletData()]);
        } catch (err) {
          console.error("Initialization error:", err);
        } finally {
          setLoading(false);
        }
      };
      init();
    }, [userId]);


    if (loading) return <CheckOutSkeleton />;

    const handleApplyCoupon = async () => {
      if (!couponCode.trim()) {
        toast.error("Please enter a coupon code");
        return;
      }

      setIsApplyingCoupon(true);
      try {
        const productIds = cartItems.map(item => item.productId);
        const response = await postAPI("/api/validate-coupon", {
          couponName: couponCode,
          productIds
        });

        if (response.data.success) {
          const matchedCoupons = response.data.coupons;
          setAppliedCoupons(matchedCoupons);
          
          // Calculate total discount
          let totalDiscount = 0;
          cartItems.forEach(item => {
            const coupon = matchedCoupons.find(c => c.productId === item.productId);
            if (coupon) {
              totalDiscount += (item.price * item.qty * coupon.discountPercentage) / 100;
            }
          });

          setCouponDiscountAmount(totalDiscount);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message || "Invalid coupon");
          setCouponDiscountAmount(0);
          setAppliedCoupons([]);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error applying coupon");
        setCouponDiscountAmount(0);
        setAppliedCoupons([]);
      } finally {
        setIsApplyingCoupon(false);
      }
    };

      const totalMRP = cartItems.reduce((acc, item) => acc + (item.marketSubtotal || item.subtotal), 0);
      const baseSellingPrice = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
      
      const artCoinDiscount = useArtCoins ? Math.min(5, (wallet?.artCoins || 0) * coinSetting.coinValue) : 0;
      const totalSellingPrice = Math.max(0, baseSellingPrice - couponDiscountAmount - artCoinDiscount);
      const totalDiscount = totalMRP - baseSellingPrice + couponDiscountAmount + artCoinDiscount;
  
      const canUseWallet = wallet?.balance >= totalSellingPrice;



  const handleDeliveryAddrChange = (id) => {
    if (id === "new") {
      setIsAddingNewDelivery(true);
      setSelectedDeliveryAddrId("");
    } else {
      setIsAddingNewDelivery(false);
      setSelectedDeliveryAddrId(id);
      const addr = allAddresses.find(a => a._id === id);
      if (addr) {
        setDeliveryFormData(prev => ({
          ...prev,
          country: addr.country,
          street: addr.addressLine1,
          city: addr.city,
          state: addr.state,
          zip: addr.pincode,
          landmark: addr.landmark || "",
          addressLine2: addr.addressLine2 || "",
        }));
      }
    }
  };

  const handleBillingAddrChange = (id) => {
    if (id === "new") {
      setIsAddingNewBilling(true);
      setSelectedBillingAddrId("");
    } else {
      setIsAddingNewBilling(false);
      setSelectedBillingAddrId(id);
      const addr = allAddresses.find(a => a._id === id);
      if (addr) {
        setBillingFormData(prev => ({
          ...prev,
          country: addr.country,
          street: addr.addressLine1,
          city: addr.city,
          state: addr.state,
          zip: addr.pincode,
          landmark: addr.landmark || "",
          addressLine2: addr.addressLine2 || "",
        }));
      }
    }
  };

  const placeOrder = async () => {
    try {
      const requiredFields = ["firstName", "lastName", "email", "phone"];
      if (isAddingNewDelivery) {
        requiredFields.push("country", "street", "city", "state", "zip");
      }

      for (const field of requiredFields) {
        if (!deliveryFormData[field] || deliveryFormData[field].toString().trim() === "") {
          toast.error(`Please fill the delivery ${field} field`);
          return;
        }
      }

      if (billingChoice === "different") {
        const billingRequired = ["firstName", "lastName", "email", "phone"];
        if (isAddingNewBilling) {
          billingRequired.push("country", "street", "city", "state", "zip");
        }
        for (const field of billingRequired) {
          if (!billingFormData[field] || billingFormData[field].toString().trim() === "") {
            toast.error(`Please fill the billing ${field} field`);
            return;
          }
        }
      }

      if (!paymentMethod) {
        toast.error("Please select a payment method.");
        return;
      }

      const itemsWithArtist = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const artistRes = await getAPI(`/api/getproduct/${item.productId}`);
            if (artistRes?.data?.data?.userId) {
              const art = artistRes.data.data.userId;
              return { ...item, artistId: art._id, artistName: art.name || "", artistLastName: art.lastName || "" };
            }
          } catch (e) { }
          try {
            const sellerRes = await getAPI(`/api/getproduct/${item.productId}`);
            if (sellerRes?.data?.data?.userId) {
              const art = sellerRes.data.data.userId;
              return { ...item, artistId: art._id, artistName: art.name || "", artistLastName: art.lastName || "" };
            }
          } catch (e) { }
          return { ...item, artistId: null, artistName: "Unknown", artistLastName: "" };
        })
      );

      const deliveryAddressObj = {
        line1: deliveryFormData.street || "",
        line2: deliveryFormData.addressLine2 || "",
        landmark: deliveryFormData.landmark || "",
        city: deliveryFormData.city || "",
        state: deliveryFormData.state || "",
        country: deliveryFormData.country || "",
        pincode: deliveryFormData.zip || "",
      };

      const billingAddressObj = billingChoice === "same" ? deliveryAddressObj : {
        line1: billingFormData.street || "",
        line2: billingFormData.addressLine2 || "",
        landmark: billingFormData.landmark || "",
        city: billingFormData.city || "",
        state: billingFormData.state || "",
        country: billingFormData.country || "",
        pincode: billingFormData.zip || "",
      };

        const orderPayload = {
          buyer: { id: userId, name: `${deliveryFormData.firstName} ${deliveryFormData.lastName}`, email: deliveryFormData.email },
          artist: { id: itemsWithArtist[0]?.artistId || null, name: itemsWithArtist[0]?.artistName || "Unknown", lastName: itemsWithArtist[0]?.artistLastName || "" },
          items: itemsWithArtist.map((i) => ({ productId: i.productId, name: i.name, quantity: i.qty, price: i.price, subtotal: i.subtotal })),
          deliveryAddress: deliveryAddressObj,
          billingAddress: billingAddressObj,
          totalAmount: totalSellingPrice,
          paymentMethod: useWallet ? "Wallet" : paymentMethod,
          useArtCoins: useArtCoins,
          artCoinDiscount: artCoinDiscount,
        };


      const response = await postAPI("/api/buyer-order-list/create", orderPayload);
      const savedOrder = response?.data?.data;

      if (response?.data?.success) {
          if (!productId) {
            for (const item of cartItems) {
              if (item.productId) await deleteAPI("/api/cart/remove", { params: { userId, productId: item.productId } });
            }
          }
        if (savedOrder?.paymentUrl) {
          window.location.href = savedOrder.paymentUrl;
        } else {
          navigate(`/my-account/order-completed/${userId}`, { state: { order: savedOrder, items: cartItems, productIds: cartItems.map((i) => i.productId) } });
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place order.");
    }
  };

  const AddressForm = ({ data, setData, isNew, location, setLocation }) => {
    if (!isNew) return null;

    const handleCountryChange = (option) => {
      setLocation(prev => ({ ...prev, country: option, state: null, city: null }));
      setData(prev => ({ ...prev, country: option?.label || "", state: "", city: "" }));
    };

    const handleStateChange = (option) => {
      setLocation(prev => ({ ...prev, state: option, city: null }));
      setData(prev => ({ ...prev, state: option?.label || "", city: "" }));
    };

    const handleCityChange = (option) => {
      setLocation(prev => ({ ...prev, city: option }));
      setData(prev => ({ ...prev, city: option?.label || "" }));
    };

    return (
      <div className="space-y-6 pt-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Street Address *</label>
            <input
              type="text"
              value={data.street}
              onChange={(e) => setData({ ...data, street: e.target.value })}
              className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl p-3 transition-all outline-none text-gray-900"
              placeholder="House No, Building, Street Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Address Line 2</label>
            <input
              type="text"
              value={data.addressLine2}
              onChange={(e) => setData({ ...data, addressLine2: e.target.value })}
              className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl p-3 transition-all outline-none text-gray-900"
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Landmark</label>
            <input
              type="text"
              value={data.landmark}
              onChange={(e) => setData({ ...data, landmark: e.target.value })}
              className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl p-3 transition-all outline-none text-gray-900"
              placeholder="Near by..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Zip Code *</label>
            <input
              type="text"
              value={data.zip}
              onChange={(e) => setData({ ...data, zip: e.target.value })}
              className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl px-5 py-4 transition-all outline-none"
              placeholder="000000"
            />
          </div>
        </div>
        <LocationSelector
          selectedCountry={location.country}
          selectedState={location.state}
          selectedCity={location.city}
          onCountryChange={handleCountryChange}
          onStateChange={handleStateChange}
          onCityChange={handleCityChange}
        />
      </div>
    );
  };

  return (
    <div className="max-w-[1464px]">
      <div className="lg:flex gap-6 space-y-6 lg:space-y-0">
        <div className="lg:col-span-2 w-full space-y-8">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#5C4033]"></div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#5C4033]/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#5C4033]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Shipping Details</h2>
                <p className="text-gray-500 text-sm mt-1">Please provide accurate delivery information</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">First Name *</label>
                  <input
                    type="text"
                    value={deliveryFormData.firstName}
                    onChange={(e) => setDeliveryFormData({ ...deliveryFormData, firstName: e.target.value })}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl p-3 transition-all outline-none text-gray-900"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Last Name *</label>
                  <input
                    type="text"
                    value={deliveryFormData.lastName}
                    onChange={(e) => setDeliveryFormData({ ...deliveryFormData, lastName: e.target.value })}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl p-3 transition-all outline-none text-gray-900"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address *</label>
                  <input
                    type="email"
                    value={deliveryFormData.email}
                    onChange={(e) => setDeliveryFormData({ ...deliveryFormData, email: e.target.value })}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl p-3 transition-all outline-none text-gray-900"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Phone Number *</label>
                  <input
                    type="text"
                    value={deliveryFormData.phone}
                    onChange={(e) => setDeliveryFormData({ ...deliveryFormData, phone: e.target.value })}
                    className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl p-3 transition-all outline-none text-gray-900"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

                {/* <div className="grid md:grid-cols-2 gap-6 items-start"> */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Company Name (Optional)</label>
                    <input
                      type="text"
                      value={deliveryFormData.company}
                      onChange={(e) => setDeliveryFormData({ ...deliveryFormData, company: e.target.value })}
                      className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#5C4033] rounded-2xl p-3 transition-all outline-none text-gray-900"
                      placeholder="Your Company"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 ml-1">Select Delivery Address</label>
                    <div className="grid gap-3">
                      {Array.isArray(allAddresses) && allAddresses.map(addr => (
                        <label key={addr._id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedDeliveryAddrId === addr._id ? "border-[#5C4033] bg-[#5C4033]/5" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
                          <input 
                            type="radio" 
                            name="deliveryAddress"
                            checked={selectedDeliveryAddrId === addr._id} 
                            onChange={() => handleDeliveryAddrChange(addr._id)} 
                            className="mt-1 w-4 h-4 accent-[#5C4033]" 
                          />
                          <div className="text-xs">
                            <p className="font-bold text-gray-900">{addr.addressLine1}</p>
                            <p className="text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                        </label>
                      ))}
                      <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isAddingNewDelivery ? "border-[#5C4033] bg-[#5C4033]/5" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
                        <input 
                          type="radio" 
                          name="deliveryAddress"
                          checked={isAddingNewDelivery} 
                          onChange={() => handleDeliveryAddrChange("new")} 
                          className="w-4 h-4 accent-[#5C4033]" 
                        />
                        <span className="text-xs font-bold text-[#5C4033]">+ Add New Address</span>
                      </label>
                    </div>
                  </div>
                {/* </div> */}

              <AddressForm data={deliveryFormData} setData={setDeliveryFormData} isNew={isAddingNewDelivery} location={deliveryLocation} setLocation={setDeliveryLocation} />

              <div className="pt-6 border-t border-gray-100">
                <label className="text-sm font-bold text-gray-700 mb-4 block">Billing Address *</label>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${billingChoice === "same" ? "border-[#5C4033] bg-[#5C4033]/5" : "border-gray-100 bg-gray-50"}`}>
                    <input type="radio" checked={billingChoice === "same"} onChange={() => setBillingChoice("same")} className="w-5 h-5 accent-[#5C4033]" />
                    <span className="font-bold text-gray-900">Same as Delivery</span>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${billingChoice === "different" ? "border-[#5C4033] bg-[#5C4033]/5" : "border-gray-100 bg-gray-50"}`}>
                    <input type="radio" checked={billingChoice === "different"} onChange={() => setBillingChoice("different")} className="w-5 h-5 accent-[#5C4033]" />
                    <span className="font-bold text-gray-900">Use Different Address</span>
                  </label>
                </div>

                {billingChoice === "different" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Billing First Name *</label>
                        <input
                          type="text"
                          value={billingFormData.firstName}
                          onChange={(e) => setBillingFormData({ ...billingFormData, firstName: e.target.value })}
                          className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl p-3 outline-none"
                          placeholder="First Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Billing Last Name *</label>
                        <input
                          type="text"
                          value={billingFormData.lastName}
                          onChange={(e) => setBillingFormData({ ...billingFormData, lastName: e.target.value })}
                          className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl p-3 outline-none"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 ml-1">Select Billing Address</label>
                        <div className="grid gap-3">
                          {Array.isArray(allAddresses) && allAddresses.map(addr => (
                            <label key={addr._id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedBillingAddrId === addr._id ? "border-[#5C4033] bg-[#5C4033]/5" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
                              <input 
                                type="radio" 
                                name="billingAddress"
                                checked={selectedBillingAddrId === addr._id} 
                                onChange={() => handleBillingAddrChange(addr._id)} 
                                className="mt-1 w-4 h-4 accent-[#5C4033]" 
                              />
                              <div className="text-xs">
                                <p className="font-bold text-gray-900">{addr.addressLine1}</p>
                                <p className="text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                              </div>
                            </label>
                          ))}
                          <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isAddingNewBilling ? "border-[#5C4033] bg-[#5C4033]/5" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
                            <input 
                              type="radio" 
                              name="billingAddress"
                              checked={isAddingNewBilling} 
                              onChange={() => handleBillingAddrChange("new")} 
                              className="w-4 h-4 accent-[#5C4033]" 
                            />
                            <span className="text-xs font-bold text-[#5C4033]">+ Add New Address</span>
                          </label>
                        </div>
                      </div>
                    <AddressForm data={billingFormData} setData={setBillingFormData} isNew={isAddingNewBilling} location={billingLocation} setLocation={setBillingLocation} />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="sticky top-10 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  {cartItems.map((g, i) => (
                    <div key={i} className="flex justify-between items-start text-sm border-b border-gray-50 pb-3">
                      <div className="flex-1 pr-4">
                        <p className="font-semibold text-gray-900 line-clamp-1">{g.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">by {g.artistName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {g.qty} × ₹{g.price.toLocaleString()}</p>
                      </div>
                      <div className="font-bold text-gray-900">₹{g.subtotal.toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                  <div className="mb-8 space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C4033]"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode}
                        className="bg-[#5C4033] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#4b3327] transition-all disabled:opacity-50"
                      >
                        {isApplyingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponDiscountAmount > 0 && (
                      <p className="text-green-600 text-xs mt-2 font-medium">
                        Coupon applied! You saved ₹{couponDiscountAmount.toLocaleString()}
                      </p>
                    )}

                    {/* Art Coins Option */}
                    <div className={`p-4 rounded-2xl border transition-all ${useArtCoins ? "border-[#5C4033] bg-[#5C4033]/5" : "border-gray-100 bg-gray-50"}`}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useArtCoins}
                          onChange={(e) => setUseArtCoins(e.target.checked)}
                          disabled={!wallet?.artCoins}
                          className="w-5 h-5 accent-[#5C4033] rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">Use Art Coins</p>
                          <p className="text-[10px] text-gray-500">
                            Available: {wallet?.artCoins || 0} coins (Worth ₹{((wallet?.artCoins || 0) * coinSetting.coinValue).toFixed(2)})
                          </p>
                        </div>
                        {useArtCoins && <span className="font-bold text-green-600 text-sm">-₹{artCoinDiscount.toFixed(2)}</span>}
                      </label>
                    </div>

                    {/* Wallet Payment Option */}
                    <div className={`p-4 rounded-2xl border transition-all ${useWallet ? "border-[#5C4033] bg-[#5C4033]/5" : "border-gray-100 bg-gray-50"} ${!canUseWallet && !useWallet ? "opacity-60 grayscale" : ""}`}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useWallet}
                          onChange={(e) => {
                            if (!canUseWallet && e.target.checked) {
                              toast.warning("Insufficient wallet balance for this order");
                              return;
                            }
                            setUseWallet(e.target.checked);
                          }}
                          disabled={!canUseWallet && !useWallet}
                          className="w-5 h-5 accent-[#5C4033] rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">Pay from Wallet</p>
                          <p className="text-[10px] text-gray-500">Available Balance: ₹{wallet?.balance || 0}</p>
                        </div>
                        {useWallet && <span className="font-bold text-[#5C4033] text-sm">Selected</span>}
                      </label>
                    </div>
                  </div>


                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Total MRP</span>
                    <span className="font-semibold text-gray-900">₹{totalMRP.toLocaleString()}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">- ₹{totalDiscount.toLocaleString()}</span>
                    </div>
                  )}
                    {couponDiscountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span className="font-semibold">- ₹{couponDiscountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {useArtCoins && (
                      <div className="flex justify-between text-green-600">
                        <span>Art Coins Discount</span>
                        <span className="font-semibold">- ₹{artCoinDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {useWallet && (
                      <div className="flex justify-between text-[#5C4033]">
                        <span>Paid by Wallet</span>
                        <span className="font-semibold">- ₹{totalSellingPrice.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-dashed">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-black text-gray-900">₹{useWallet ? "0" : totalSellingPrice.toLocaleString()}</span>
                    </div>
                  </div>



                <button
                  onClick={placeOrder}
                  className="w-full group flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95"
                  disabled={cartItems.length === 0}
                >
                  Place Order
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
