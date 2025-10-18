import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import postAPI from "../../../../api/postAPI";
import getAPI from "../../../../api/getAPI";

const CreateOrder = () => {
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: localStorage.getItem("userId") || "",
    material: "",
    stamp: "",
    stickers: "",
    vouchers: "",
    card: "",
    quantity: "",
    deliveryAddress: "",
    totalPrice: "",
  });
  const [stampData, setStampData] = useState({
    stamp: "",
    price: "",
  });
   const [stickerData, setStickerData] = useState({
    sticker: "",
    price: ""
  })
  const [voucherData, setVoucherData] = useState({
    voucher: "",
    price: ""
  })
  const [cardData, setCardData] = useState({
    card: "",
    price: ""
  })
  const [materialData, setMaterialData] = useState({
    materialName: "",
    size: "",
    capacity: "",
    price: "",
    stockAvailable: "",
    minimumOrder: "",
    vendorSupplier: "",
    ecoFriendly: "",
    deliveryEstimation: ""
  })
  const [materialNameImage, setMaterialNameImage] = useState(null);
  const [materialStampImage, setMaterialStampImage] = useState(null);
  const [materialStickerImage, setMaterialStickerImage] = useState(null);
  const [materialVoucherImage, setMaterialVoucherImage] = useState(null);
  const [materialCardImage, setMaterialCardImage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [selectedStamp, setSelectedStamp] = useState([]);
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [selectedCard, setSelectedCard] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [address, setAddress] = useState("");
  const [quantities, setQuantities] = useState({});
  const [prices, setPrices] = useState({});
  const [currentType, setCurrentType] = useState("");

  useEffect(() => {
  const getUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await getAPI(`/auth/user/${userId}`);
      console.log("User profile data", res);

      let address = res.data.address;

      // Step 1: Parse the address if it's a string
      let parsedAddress = address;
      if (typeof address === "string") {
        try {
          parsedAddress = JSON.parse(address);
        } catch (err) {
          console.error("Error parsing address:", err);
          parsedAddress = {};
        }
      }

      // Step 2: Extract the relevant fields safely
      const deliveryAddress = `${parsedAddress.line1 || ""}, ${parsedAddress.line2 || ""}, ${parsedAddress.city || ""}, ${parsedAddress.state || ""}, ${parsedAddress.country || ""}, ${parsedAddress.pincode || ""}`;

      // Step 3: Set to state
      setFormData((prev) => ({
        ...prev,
        deliveryAddress: deliveryAddress
      }));
      setAddress(deliveryAddress);

    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  getUser();
}, []);


  useEffect(() => {
    const fetchMaterialNames = async () => {
        try {
            const res = await getAPI(`/api/package-material/material`);
            console.log("material names", res);
            if(res.data && Array.isArray(res.data)) {
                setSelectedMaterial(res.data);
            } else if(res.data && res.data.data) {
                setSelectedMaterial(res.data.data);
            } else {
                setSelectedMaterial([]);
            }
        } catch(error) {
            console.error("Error fetching materials", error.message);
        }
    }
    fetchMaterialNames();
  }, [])

  useEffect(() => {
    const fetchMaterialStamp = async () => {
        try {
            const res = await getAPI(`/api/packaging-material-setting/material-stamp/`);
            console.log("material stamp", res);
            if(res.data && Array.isArray(res.data)) {
                setSelectedStamp(res.data);
            } else if(res.data && res.data.data) {
                setSelectedStamp(res.data.data);
            } else {
                setSelectedStamp([]);
            }
        } catch(error) {
            console.error("Error fetching stamp", error.message);
        }
    }
    fetchMaterialStamp();
  }, [])

  useEffect(() => {
    const fetchMaterialStickers = async () => {
        try {
            const res = await getAPI(`/api/packaging-material-setting/material-stickers/`);
            console.log("material stickers", res);
            if(res.data && Array.isArray(res.data)) {
                setSelectedStickers(res.data);
            } else if(res.data && res.data.data) {
                setSelectedStickers(res.data.data);
            } else {
                setSelectedStickers([]);
            }
        } catch(error) {
            console.error("Error fetching stickers", error.message);
        }
    }
    fetchMaterialStickers();
  }, [])

  useEffect(() => {
    const fetchMaterialVouchers = async () => {
        try {
            const res = await getAPI(`/api/packaging-material-setting/material-vouchers/`);
            console.log("material vouchers", res);
            if(res.data && Array.isArray(res.data)) {
                setSelectedVouchers(res.data);
            } else if(res.data && res.data.data) {
                setSelectedVouchers(res.data.data);
            } else {
                setSelectedVouchers([]);
            }
        } catch(error) {
            console.error("Error fetching vouchers", error.message);
        }
    }
    fetchMaterialVouchers();
  }, [])

  useEffect(() => {
    const fetchMaterialCard = async () => {
        try {
            const res = await getAPI(`/api/packaging-material-setting/material-card/`);
            console.log("material card", res);
            if(res.data && Array.isArray(res.data)) {
                setSelectedCard(res.data);
            } else if(res.data && res.data.data) {
                setSelectedCard(res.data.data);
            } else {
                setSelectedCard([]);
            }
        } catch(error) {
            console.error("Error fetching card", error.message);
        }
    }
    fetchMaterialCard();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    console.log("UserId in handlesubmit", userId);

    // Create FormData object for multipart/form-data
    const data = new FormData();
    data.append("userId", userId);
    data.append("material", formData.material);
    data.append("stamp", formData.stamp);
    data.append("stickers", formData.stickers);
    data.append("vouchers", formData.vouchers);
    data.append("card", formData.card);
    data.append("quantity", formData.quantity);
    data.append("deliveryAddress", formData.deliveryAddress);
    data.append("totalPrice", formData.totalPrice);

    try {
      // Send POST request to backend
      const response = await postAPI(
        "/api/package-material/order/create",
        data
      );

      // Handle success
      console.log("In handleSubmit", response);
      navigate("/artist/packaging-material"); // Redirect to material list
    } catch (err) {
      // Handle error
      console.error(
        "Error in postAPI:",
        err.response?.data || err.message || err
      );
      setError(err.response?.data?.message || "Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownChange = async (type, id) => {
  try {
    const userId = localStorage.getItem("userId");

    if (type === "material") {
      setMaterialData(selectedMaterial);
    }
    
    if (type === "stamp") {
      setStampData(selectedStamp);
    }

    if (type === "sticker") {
      setStickerData(selectedStickers);
    }

    if (type === "vouchers") {
      setVoucherData(selectedVouchers);
    }

    if (type === "card") {
      setCardData(selectedCard);
    }

    // Step 2: Find the selected item from respective array
    let selectedItem = null;

    switch (type) {
      case "stamp":
        selectedItem = selectedStamp.find((s) => s._id === id);
        const stampUrl = selectedItem?.materialStampImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${selectedItem?.materialStampImage.replace(/\\/g, "/")}` : null;
        setStampData((prev) => ({
          ...prev,
          stamp: id,
          price: selectedItem?.price || ""
        }));
        setMaterialStampImage(stampUrl);
        break;
      case "stickers":
        selectedItem = selectedStickers.find((s) => s._id === id);
        const stickerUrl = selectedItem?.materialStickersImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${selectedItem?.materialStickersImage.replace(/\\/g, "/")}` : null;
        setStickerData((prev) => ({
          ...prev,
          sticker: id,
          price: selectedItem?.price || ""
        }));
        setMaterialStickerImage(stickerUrl);
        break;
      case "vouchers":
        selectedItem = selectedVouchers.find((s) => s._id === id);
        const VoucherUrl = selectedItem?.materialVouchersImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${selectedItem?.materialVouchersImage.replace(/\\/g, "/")}` : null;
        setVoucherData((prev) => ({
          ...prev,
          voucher: id,
          price: selectedItem?.price || ""
        }));
        setMaterialVoucherImage(VoucherUrl);
        break;
      case "card":
        selectedItem = selectedCard.find((s) => s._id === id);
        const cardUrl = selectedItem?.materialCardImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${selectedItem?.materialCardImage.replace(/\\/g, "/")}` : null;
        setCardData((prev) => ({
          ...prev,
          card: id,
          price: selectedItem?.price || ""
        }));
        setMaterialCardImage(cardUrl);
        break;
      case "material":
        selectedItem = selectedMaterial.find((s) => s._id === id);
        const imageUrl = selectedItem?.materialName?.materialNameImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${selectedItem?.materialName?.materialNameImage.replace(/\\/g, "/")}` : null;
        setMaterialData((prev) => ({
          ...prev,
          materialName: id,
          size: selectedItem?.size?.materialSize || "",
          capacity: selectedItem?.capacity?.materialCapacity || "",
          price: selectedItem?.price || "",
          stockAvailable: selectedItem?.stockAvailable || "",
          minimumOrder: selectedItem?.minimumOrder || "",
          vendorSupplier: selectedItem?.vendorSupplier || "",
          ecoFriendly: selectedItem?.ecoFriendly ? "Yes" : "No" || "",
          deliveryEstimation: selectedItem?.deliveryEstimation || ""
        }));
        setMaterialNameImage(imageUrl);
        break;
      default:
        break;
    }

    // Step 3: Extract price safely
    const price = selectedItem ? selectedItem.price : 0;

    // Step 4: Update price, type, and form data
    setPrices((prev) => ({
      ...prev,
      [type]: price,
    }));

    setCurrentType(type);

    setFormData((prev) => ({
      ...prev,
      [type]: id,
      quantity: "",
    }));
  } catch (error) {
    console.error("Error fetching or updating details:", error);
  }
};


  const handleQuantityChange = (e) => {
    const qty = Number(e.target.value);
    const type = currentType;

    setQuantities((prev) => ({
      ...prev,
      [type]: qty,
    }));

    const total = Object.keys(prices).reduce((acc, key) => {
      const price = prices[key] || 0;
      const quantity = key === type ? qty : quantities[key] || 0;
      return acc + price * quantity;
    }, 0);

    setFormData((prev) => ({
      ...prev,
      quantity: qty,
      totalPrice: total,
    }));
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Create Order</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/artist/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item active">
                <span
                  onClick={() => navigate("/artist/packaging-material")}
                  style={{ cursor: "pointer" }}
                >
                  Packaging Material Order
                </span>
              </li>
              <li className="breadcrumb-item"> Create Order</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Packaging Products</label>
                  <select
                    type="text"
                    className="form-control"
                    name="packageProduct"
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    required
                  >
                    <option value="">-- Select Material --</option>
                      <option value="material">Material</option>
                      <option value="stamp">Stamp</option>
                      <option value="stickers">Stickers</option>
                      <option value="vouchers">Vouchers</option>
                      <option value="card">Card</option>
                  </select>
                  {selectedProduct === "material" && (
                    <>
                    <label className="mt-2 mb-0">Material Type</label>
                    <select
                      className="form-control mt-2"
                      name="material"
                      value={formData.material}
                      onChange={(e) => handleDropdownChange("material", e.target.value)}
                      required
                    >
                      <option value="">-- Select Type --</option>
                      {
                        selectedMaterial.map((mat) => (
                        <>
                        <option key={mat._id} value={mat._id}>{mat.materialName?.materialName}</option>
                        </>
                        ))
                      }
                      </select>
                      {formData.material && (
                          <div className="mt-3">
                            {materialNameImage && (
                              <div className="form-group mt-3">
                                <label>Material Image</label>
                                {materialNameImage && (
                                  <div className="mt-2">
                                    <img
                                      src={materialNameImage}
                                      alt="Material Name Preview"
                                      className="img-thumbnail"
                                      style={{ maxHeight: "200px" }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="form-group">
                            <label>Size</label>
                            <input
                              type="text"
                              className="form-control"
                              value={materialData?.size}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Capacity</label>
                            <input
                              type="text"
                              className="form-control"
                              value={materialData?.capacity}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Price / Unit</label>
                            <input
                              type="text"
                              className="form-control"
                              value={materialData?.price}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Stock Quantity Available</label>
                            <input
                              type="text"
                              className="form-control"
                              value={materialData?.stockAvailable}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Minimum Order Quantity(MOQ)</label>
                            <input
                              type="text"
                              className="form-control"
                              value={materialData?.minimumOrder}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Vendor / Supplier Info</label>
                            <input
                              type="text"
                              className="form-control"
                              value={materialData?.vendorSupplier}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Eco-friendly</label>
                            <input
                              type="text"
                              className="form-control"
                              value={materialData?.ecoFriendly}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Delivery Estimation Days</label>
                            <input
                              type="text"
                              className="form-control"
                              value={materialData?.deliveryEstimation}
                              disabled
                            />
                          </div>
                          </div>
                        )}
                    </>
                  )}
                  {selectedProduct === "stamp" && (
                      <>
                        <label className="mt-2 mb-0">Select Stamp</label>
                        <select
                          className="form-control mt-2"
                          name="stamp"
                          value={formData.stamp}
                          onChange={(e) => handleDropdownChange("stamp", e.target.value)}
                          required
                        >
                          <option value="">-- Select Type --</option>
                          {selectedStamp.map((mat) => (
                            <option key={mat._id} value={mat._id}>
                              {mat?.materialStamp}
                            </option>
                          ))}
                        </select>
                        {formData.stamp && (
                          <div className="mt-3">
                            {materialStampImage && (
                              <div className="form-group mt-3">
                                <label>Stamp Image</label>
                                {materialStampImage && (
                                  <div className="mt-2">
                                    <img
                                      src={materialStampImage}
                                      alt="Material Name Preview"
                                      className="img-thumbnail"
                                      style={{ maxHeight: "200px" }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          <div className="form-group">
                            <label>Price / Unit</label>
                            <input
                              type="text"
                              className="form-control"
                              value={stampData?.price}
                              disabled
                            />
                          </div>
                          </div>
                        )}
                      </>
                    )}

                  {selectedProduct === "stickers" && (
                    <>
                    <label className="mt-2 mb-0">Select Sticker</label>
                    <select
                      className="form-control mt-2"
                      name="stickers"
                      value={formData.stickers}
                      onChange={(e) => handleDropdownChange("stickers", e.target.value)}
                      required
                    >
                      <option value="">-- Select Type --</option>
                      {
                        selectedStickers.map((mat) => (
                        <>
                        <option key={mat._id} value={mat._id}>{mat?.materialStickers}</option>
                        </>
                        ))
                      }
                      </select>
                      {/* Show these details only when a stamp is chosen */}
                        {formData.stickers && (
                          <div className="mt-3">
                            {materialStickerImage && (
                              <div className="form-group mt-3">
                                <label>Sticker Image</label>
                                {materialStickerImage && (
                                  <div className="mt-2">
                                    <img
                                      src={materialStickerImage}
                                      alt="Material Name Preview"
                                      className="img-thumbnail"
                                      style={{ maxHeight: "200px" }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          <div className="form-group">
                            <label>Price / Unit</label>
                            <input
                              type="text"
                              className="form-control"
                              value={stickerData?.price}
                              disabled
                            />
                          </div>
                          </div>
                        )}
                    </>
                  )}
                  {selectedProduct === "vouchers" && (
                    <>
                    <label className="mt-2 mb-0">Select Voucher</label>
                    <select
                      className="form-control mt-2"
                      name="vouchers"
                      value={formData.vouchers}
                      onChange={(e) => handleDropdownChange("vouchers", e.target.value)}
                      required
                    >
                      <option value="">-- Select Type --</option>
                      {
                        selectedVouchers.map((mat) => (
                        <>
                        <option key={mat._id} value={mat._id}>{mat?.materialVouchers}</option>
                        </>
                        ))
                      }
                    </select>
                    {/* Show these details only when a stamp is chosen */}
                        {formData.vouchers && (
                          <div className="mt-3">
                            {materialVoucherImage && (
                              <div className="form-group mt-3">
                                <label>Voucher Image</label>
                                {materialVoucherImage && (
                                  <div className="mt-2">
                                    <img
                                      src={materialVoucherImage}
                                      alt="Material Name Preview"
                                      className="img-thumbnail"
                                      style={{ maxHeight: "200px" }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          <div className="form-group">
                            <label>Price / Unit</label>
                            <input
                              type="text"
                              className="form-control"
                              value={voucherData?.price}
                              disabled
                            />
                          </div>
                          </div>
                        )}
                    </>
                  )}
                  {selectedProduct === "card" && (
                    <>
                    <label className="mt-2 mb-0">Select Card</label>
                    <select
                      className="form-control mt-2"
                      name="card"
                      value={formData.card}
                      onChange={(e) => handleDropdownChange("card", e.target.value)}
                      required
                    >
                      <option value="">-- Select Type --</option>
                      {
                        selectedCard.map((mat) => (
                        <>
                        <option key={mat._id} value={mat._id}>{mat?.materialCard}</option>
                        </>
                        ))
                      }
                    </select>
                    {/* Show these details only when a stamp is chosen */}
                        {formData.card && (
                          <div className="mt-3">
                            {materialCardImage && (
                              <div className="form-group mt-3">
                                <label>Card Image</label>
                                {materialCardImage && (
                                  <div className="mt-2">
                                    <img
                                      src={materialCardImage}
                                      alt="Material Name Preview"
                                      className="img-thumbnail"
                                      style={{ maxHeight: "200px" }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          <div className="form-group">
                            <label>Price / Unit</label>
                            <input
                              type="text"
                              className="form-control"
                              value={cardData?.price}
                              disabled
                            />
                          </div>
                          </div>
                        )}
                    </>
                  )}
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="text"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity || ""}
                    onChange={handleQuantityChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Price</label>
                  <input
                    type="text"
                    className="form-control"
                    name="totalPrice"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value})}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-block btn-primary mt-3"
                  disabled={loading}
                >
                  {loading ? "Creating Order........." : "Create Order"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;