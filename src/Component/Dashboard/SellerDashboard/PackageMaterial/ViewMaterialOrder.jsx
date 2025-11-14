import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getAPI from "../../../../api/getAPI";

const ViewMaterialOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [selectedProduct, setSelectedProduct] = useState("");
  const [address, setAddress] = useState("");

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
        const deliveryAddress = `${parsedAddress.line1 || ""}, ${
          parsedAddress.line2 || ""
        }, ${parsedAddress.city || ""}, ${parsedAddress.state || ""}, ${
          parsedAddress.country || ""
        }, ${parsedAddress.pincode || ""}`;

        // Step 3: Set to state
        setFormData((prev) => ({
          ...prev,
          deliveryAddress: deliveryAddress,
        }));
        setAddress(deliveryAddress);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    getUser();
  }, []);

 
   useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await getAPI(`/api/package-material/seller/order/${userId}/${id}`);
        console.log("Fetched order details:", res);

        if (res.data && res.data.data) {
          const order = res.data.data;

          let orderDeliveryAddress = "";
          if (
            order.deliveryAddress &&
            typeof order.deliveryAddress === "object" &&
            order.deliveryAddress.address
          ) {
            const a = order.deliveryAddress.address;
            const addressFields = [
              a.line1,
              a.line2,
              a.city,
              a.state,
              a.country,
              a.pincode,
            ];
            if (addressFields.every((field) => !field)) {
              orderDeliveryAddress = address; // always fallback to user profile address
            } else {
              orderDeliveryAddress = addressFields.filter(Boolean).join(", ");
            }
          } else if (
            order.deliveryAddress &&
            typeof order.deliveryAddress === "string"
          ) {
            orderDeliveryAddress = order.deliveryAddress;
          } else {
            orderDeliveryAddress = address; // always fallback to user profile address
          }

          setFormData({
            userId: order.userId || localStorage.getItem("userId") || "",
            material: order.material || "",
            stamp: order.stamp || "",
            stickers: order.stickers || "",
            vouchers: order.vouchers || "",
            card: order.card || "",
            quantity: order.quantity || "",
            deliveryAddress: orderDeliveryAddress,
            totalPrice: order.totalPrice || "",
          });
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
      }
    };

    if (id) fetchOrderDetails();
  }, [id, formData.deliveryAddress]);
  

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>View Order</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/seller/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item active">
                <span
                  onClick={() => navigate("/seller/packaging-material")}
                  style={{ cursor: "pointer" }}
                >
                  Packaging Material Order
                </span>
              </li>
              <li className="breadcrumb-item">View Order</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form>
                <div className="form-group">
                    <>
                      <label className="mt-2 mb-0">Material</label>
                      <select
                        className="form-control mt-2"
                        name="material"
                        value={formData.material?.materialName?._id || ""}
                        disabled
                      >
                        <option value="">-- Select Type --</option>
                        {formData.material && (
                          <option key={formData.material?.materialName?._id} value={formData.material?.materialName?._id}>
                            {formData.material?.materialName?.materialName}
                          </option>
                        )}
                      </select>
                      {formData.material && (
                        <div className="mt-3">
                          <div className="form-group mt-3">
                            <label>Material Image</label>
                            <div className="mt-2">
                              <img
                                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE
                                  }/${formData.material?.materialName?.materialNameImage?.replace(
                                    /\\/g,
                                    "/"
                                  )}`}
                                alt="Material Name Preview"
                                className="img-thumbnail"
                                style={{ maxHeight: "200px" }}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Size</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.material?.size?.materialSize}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Capacity</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                formData.material?.capacity?.materialCapacity
                              }
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Price / Unit</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.material?.price}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Stock Quantity Available</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.material?.stockAvailable}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Minimum Order Quantity(MOQ)</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.material?.minimumOrder}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Vendor / Supplier Info</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.material?.vendorSupplier}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Eco-friendly</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                formData.material?.ecoFriendly ? "Yes" : "No"
                              }
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Delivery Estimation Days</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.material?.deliveryEstimation}
                              disabled
                            />
                          </div>
                        </div>
                      )}
                    </>
                    <>
                      <label className="mt-2 mb-0">Stamp</label>
                      <select
                        className="form-control mt-2"
                        name="stamp"
                        value={formData.stamp?._id || ""}
                        disabled
                      >
                        <option value="">-- Select Type --</option>
                        {formData.stamp && (
                          <option key={formData.stamp._id} value={formData.stamp._id}>
                            {formData.stamp.materialStamp}
                          </option>
                        )}
                      </select>
                      {formData.stamp && (
                        <div className="mt-3">
                          <div className="form-group mt-3">
                            <label>Stamp Image</label>
                            <div className="mt-2">
                              <img
                                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE
                                  }/${formData.stamp?.materialStampImage?.replace(
                                    /\\/g,
                                    "/"
                                  )}`}
                                alt="Material Name Preview"
                                className="img-thumbnail"
                                style={{ maxHeight: "200px" }}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Price / Unit</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.stamp?.price}
                              disabled
                            />
                          </div>
                        </div>
                      )}
                    </>
                    <>
                      <label className="mt-2 mb-0">Sticker</label>
                      <select
                        className="form-control mt-2"
                        name="stickers"
                        value={formData.stickers?._id || ""}
                        disabled
                      >
                        <option value="">-- Select Type --</option>
                        {formData.stickers && (
                          <option key={formData.stickers._id} value={formData.stickers._id}>
                            {formData.stickers.materialStickers}
                          </option>
                        )}
                      </select>
                      {formData.stickers && (
                        <div className="mt-3">
                          <div className="form-group mt-3">
                            <label>Sticker Image</label>
                            <div className="mt-2">
                              <img
                                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE
                                  }/${formData.stickers?.materialStickersImage?.replace(
                                    /\\/g,
                                    "/"
                                  )}`}
                                alt="Material Name Preview"
                                className="img-thumbnail"
                                style={{ maxHeight: "200px" }}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Price / Unit</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.stickers?.price}
                              disabled
                            />
                          </div>
                        </div>
                      )}
                    </>
                    <>
                      <label className="mt-2 mb-0">Voucher</label>
                      <select
                        className="form-control mt-2"
                        name="vouchers"
                        value={formData.vouchers?._id || ""}
                        disabled
                      >
                        <option value="">-- Select Type --</option>
                        {formData.vouchers && (
                          <option key={formData.vouchers._id} value={formData.vouchers._id}>
                            {formData.vouchers.materialVouchers}
                          </option>
                        )}
                      </select>
                      {formData.vouchers && (
                        <div className="mt-3">
                          <div className="form-group mt-3">
                            <label>Voucher Image</label>
                            <div className="mt-2">
                              <img
                                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE
                                  }/${formData.vouchers?.materialVouchersImage?.replace(
                                    /\\/g,
                                    "/"
                                  )}`}
                                alt="Material Name Preview"
                                className="img-thumbnail"
                                style={{ maxHeight: "200px" }}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Price / Unit</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.vouchers?.price}
                              disabled
                            />
                          </div>
                        </div>
                      )}
                    </>
                    <>
                      <label className="mt-2 mb-0">Card</label>
                      <select
                        className="form-control mt-2"
                        name="card"
                        value={formData.card?._id || ""}
                        disabled
                      >
                        <option value="">-- Select Type --</option>
                        {formData.card && (
                          <option
                            key={formData.card._id}
                            value={formData.card._id}
                          >
                            {formData.card.materialCard}
                          </option>
                        )}
                      </select>
                      {formData.card && (
                        <div className="mt-3">
                          <div className="form-group mt-3">
                            <label>Card Image</label>
                            <div className="mt-2">
                              <img
                                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE
                                  }/${formData.card?.materialCardImage?.replace(
                                    /\\/g,
                                    "/"
                                  )}`}
                                alt="Material Name Preview"
                                className="img-thumbnail"
                                style={{ maxHeight: "200px" }}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Price / Unit</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.card?.price}
                              disabled
                            />
                          </div>
                        </div>
                      )}
                    </>
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="text"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Total Price</label>
                  <input
                    type="text"
                    className="form-control"
                    name="totalPrice"
                    value={formData.totalPrice}
                    disabled
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMaterialOrder;