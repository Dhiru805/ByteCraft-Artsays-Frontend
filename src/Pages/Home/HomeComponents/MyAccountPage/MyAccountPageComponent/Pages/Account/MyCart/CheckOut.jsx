import React, { useState, useEffect } from "react";
import postAPI from "../../../../../../../../api/postAPI";
import getAPI from "../../../../../../../../api/getAPI";
import deleteAPI from "../../../../../../../../api/deleteAPI";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckOut = () => {
  const userId = localStorage.getItem("userId");
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const quantityParam = Number(searchParams.get("quantity"));
  const directQuantity =
    Number.isFinite(quantityParam) && quantityParam > 0 ? quantityParam : 1;

  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState("same");
  const [userData, setUserData] = useState(null);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [allAddresses, setAllAddresses] = useState([]);
  const [formData, setFormData] = useState({
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

  const PaymentButton = ({ value, label }) => {
    const isSelected = paymentMethod === value;
    return (
      <button
        type="button"
        onClick={() => setPaymentMethod(isSelected ? null : value)}
        className={`w-full py-3 rounded-xl border text-sm font-medium transition-all
          ${
            isSelected
              ? "bg-[#5C4033] text-white border-[#5C4033]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }
        `}
      >
        {label}
      </button>
    );
  };

  const fetchProductById = async (id) => {
    try {
      const artist = await getAPI(`/artist/getproduct/${id}`);
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
            qty: buyNowQty,
            price: p.sellingPrice,
            subtotal: buyNowQty * p.sellingPrice,
          },
        ]);
        return;
      }

      const res = await getAPI(`/api/cart/${userId}`);
      const items = res.data?.items || [];
      const grouped = items
        .filter((item) => item && item.product)
        .map((item) => ({
          productId: item.product._id,
          name: item.product.productName,
          qty: item.quantity,
          price: item.product.sellingPrice,
          subtotal: item.quantity * item.product.sellingPrice,
        }));
      setCartItems(grouped);
    } catch (err) {
      toast.error("Failed to load cart items");
      console.log("Order items load error:", err);
    }
  };

  const loadAllAddresses = async () => {
    try {
      const res = await getAPI(`/auth/userid/${userId}`);
      const user = res.data?.user;
      if (user?.address && Array.isArray(user.address)) {
        setAllAddresses(user.address);
      }
    } catch (err) {
      console.log("Error loading addresses:", err);
    }
  };

  const loadUser = async () => {
    try {
      const res = await getAPI(`/auth/userid/${userId}`);
      const user = res.data?.user;
      if (!user) return;

      setUserData(user);
      const addr =
        user.address?.find((a) => a._id === user.selectedAddress) ||
        user.address?.[0] ||
        null;
      setSelectedAddr(addr);

      setFormData({
        firstName: user.name || "",
        lastName: user.lastName || "",
        company: "",
        email: user.email || "",
        phone: user.phone || "",
        country: addr?.country || "",
        street: `${addr?.line1 || ""} ${addr?.line2 || ""}`.trim(),
        city: addr?.city || "",
        state: addr?.state || "",
        zip: addr?.pincode || "",
      });
    } catch (err) {
      console.log("User load error:", err);
    }
  };

  useEffect(() => {
    loadOrderItems();
    loadAllAddresses();
    loadUser();
  }, [userId, productId, directQuantity]);

  const changeField = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const placeOrder = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (
      !formData.phone ||
      !formData.email ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.zip
    ) {
      toast.error("Please fill all required fields (including phone)");
      return;
    }

    try {
      const itemsWithArtist = await Promise.all(
        cartItems.map(async (item) => {
          let artistId = null;
          let artistName = "Platform";
          let artistLastName = "";

          try {
            const artistRes = await getAPI(
              `/artist/getproduct/${item.productId}`
            );
            if (artistRes?.data?.data?.creator) {
              const art = artistRes.data.data.creator;
              artistId = art._id;
              artistName = art.name || "Artist";
              artistLastName = art.lastName || "";
            }
          } catch (e) {}

          if (!artistId) {
            try {
              const sellerRes = await getAPI(
                `/api/getproduct/${item.productId}`
              );
              if (sellerRes?.data?.data?.userId) {
                const art = sellerRes.data.data.userId;
                artistId = art._id;
                artistName = art.name || "Seller";
                artistLastName = art.lastName || "";
              }
            } catch (e) {}
          }

          return {
            ...item,
            artistId,
            artistName,
            artistLastName,
          };
        })
      );

      const deliveryAddressObj = {
        line1: formData.street.trim(),
        line2: "",
        landmark: "",
        city: formData.city,
        state: formData.state,
        country: formData.country || "India",
        pincode: formData.zip,
      };

      const buyerBlock = {
        id: userId,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
      };

      const firstItemArtist = itemsWithArtist[0];
      const artistBlock = firstItemArtist.artistId
        ? {
            id: firstItemArtist.artistId,
            name: firstItemArtist.artistName,
            lastName: firstItemArtist.artistLastName,
          }
        : null;

      const orderPayload = {
        buyer: buyerBlock,
        artist: artistBlock,
        items: cartItems.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.qty,
          price: i.price,
          subtotal: i.subtotal,
        })),
        deliveryAddress: deliveryAddressObj,
        totalAmount: cartItems.reduce((a, b) => a + b.subtotal, 0),
        paymentMethod: paymentMethod,
      };

      const response = await postAPI(
        "/api/buyer-order-list/create",
        orderPayload
      );

      if (response?.data?.success) {
        const orderData = response.data.data;

        try {
          for (const item of cartItems) {
            if (item.productId) {
              await deleteAPI("/api/cart/remove", {
                params: { userId, productId: item.productId },
              });
            }
          }
        } catch (e) {
          console.log("Cart clear warning:", e);
        }

        if (paymentMethod === "Online" && orderData?.paymentUrl) {
          window.location.href = orderData.paymentUrl;
          return;
        }

        toast.success("Order placed successfully!");
        navigate(`/my-account/order-completed/${userId}`, {
          state: {
            order: orderData,
            items: cartItems,
            productIds: cartItems.map((i) => i.productId),
          },
        });
      } else {
        toast.error(
          response?.data?.message || "Order failed. Please try again."
        );
      }
    } catch (err) {
      console.error("ORDER ERROR:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to place order. Please try again.";
      toast.error(message);
    }
  };

  const totalAmount = cartItems.reduce((a, b) => a + b.subtotal, 0);
  return (
    <div className="max-w-[1464px] px-4 sm:px-6 lg:px-12 py-10">
      <div className="lg:flex lg:gap-8 gap-8">
        {}
        <div className="lg:col-span-2 w-full">
          <h2 className="text-3xl font-semibold mb-6">Shipping Details</h2>

          <form className="space-y-4">
            {}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-medium mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={changeField}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2"
                  placeholder="Enter First Name"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={changeField}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2"
                  placeholder="Enter Last Name"
                />
              </div>
            </div>

            {}
            <div>
              <label className="block text-lg font-medium mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Enter Company Name"
              />
            </div>

            {}
            <div>
              <label className="block text-lg font-medium mb-1">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Country"
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>

            {}
            <div>
              <label className="block text-lg font-medium mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Street Address"
              />
            </div>

            {}
            <div>
              <label className="block text-lg font-medium mb-1">City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="City"
              >
                <option>Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="New York">New York</option>
              </select>
            </div>

            {}
            <div>
              <label className="block text-lg font-medium mb-1">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="State"
              >
                <option>Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="California">California</option>
                <option value="Texas">Texas</option>
              </select>
            </div>

            {}
            <div>
              <label className="block text-lg font-medium mb-1">
                Zip Code *
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Enter Zip Code"
              />
            </div>

            {}
            <div>
              <label className="block text-lg font-medium mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Enter Phone Number"
              />
            </div>

            {}
            <div>
              <label className="block text-lg font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={changeField}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                placeholder="Enter Email Id"
              />
            </div>

            {}
            {}

            {}
            <div>
              <label className="block text-lg font-medium mb-2">
                Delivery Address *
              </label>

              {}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <label className="flex items-center gap-2 border px-4 py-2 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    checked={deliveryAddress === "same"}
                    onChange={() => {
                      setDeliveryAddress("same");

                      if (selectedAddr) {
                        setFormData((f) => ({
                          ...f,
                          country: selectedAddr.country,
                          street: `${selectedAddr.line1} ${selectedAddr.line2}`,
                          city: selectedAddr.city,
                          state: selectedAddr.state,
                          zip: selectedAddr.pincode,
                        }));
                      }
                    }}
                  />
                  Same as shipping address
                </label>

                <label className="flex items-center gap-2 border px-4 py-2 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    checked={deliveryAddress === "different"}
                    onChange={() => setDeliveryAddress("different")}
                  />
                  Use a different billing address
                </label>
              </div>

              {}
              {deliveryAddress === "different" && allAddresses.length > 0 && (
                <div className="border p-4 rounded-2xl space-y-4">
                  {allAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="flex items-start gap-3 p-3 border rounded-xl hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setFormData((f) => ({
                          ...f,
                          country: addr.country,
                          street: `${addr.line1} ${addr.line2}`,
                          city: addr.city,
                          state: addr.state,
                          zip: addr.pincode,
                        }));
                      }}
                    >
                      <input
                        type="radio"
                        name="addressSelect"
                        className="mt-1"
                        onChange={() => {
                          setFormData((f) => ({
                            ...f,
                            country: addr.country,
                            street: `${addr.line1} ${addr.line2}`,
                            city: addr.city,
                            state: addr.state,
                            zip: addr.pincode,
                          }));
                        }}
                      />

                      <div>
                        <p className="font-semibold text-gray-900">
                          {addr.city}, {addr.state}, {addr.country}
                        </p>

                        <p className="text-sm text-gray-600">
                          {addr.line1}, {addr.line2}, {addr.landmark},{" "}
                          {addr.pincode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {}
        <div className="w-full lg:w-[350px] border rounded-3xl p-4 text-lg h-fit text-gray-700">
          <h2 className="text-gray-800 text-xl font-semibold">Order Summary</h2>
          <hr className="my-2" />

          {}

          <div className="space-y-4 mb-4">
            {cartItems.map((g, i) => (
              <div
                key={i}
                className="flex justify-between items-start text-sm border-b pb-2"
              >
                <div>
                  <p className="font-semibold">{g.name}</p>
                  <p className="text-gray-600">MRP: ₹{g.price}</p>
                  <p className="text-gray-600">Qty: {g.qty}</p>
                </div>

                <div className="font-medium text-gray-900">₹{g.subtotal}</div>
              </div>
            ))}
          </div>

          <hr className="my-2" />

          <div className="flex justify-between text-base text-gray-900">
            <span>Total Items</span>
            <span>{cartItems.reduce((a, b) => a + b.qty, 0)}</span>
          </div>

          <div className="flex justify-between font-medium text-base mt-2 text-gray-900">
            <span>Total Price</span>
            <span>₹{cartItems.reduce((a, b) => a + b.subtotal, 0)}</span>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Payment Method *</h2>

            <div className="flex flex-col gap-3">
              <PaymentButton
                value="Cash On Delivery"
                label="Cash On Delivery (COD)"
              />
              <PaymentButton value="Online" label="Online" />
              {}
            </div>

            {paymentMethod === null && (
              <p className="text-red-500 text-sm mt-2">
                Please select a payment method
              </p>
            )}
          </div>

          <button
            onClick={placeOrder}
            className="w-full mt-4 bg-[#5C4033] hover:bg-[#4b3327] text-white py-2 rounded-full text-sm"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
