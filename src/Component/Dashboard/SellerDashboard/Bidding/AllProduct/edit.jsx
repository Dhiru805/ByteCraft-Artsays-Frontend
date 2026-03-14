
import React, { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import axiosInstance from "../../../../../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EditBiddingProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const userId = localStorage.getItem("userId");

  const [activePass, setActivePass] = useState(null);
  const [passDetails, setPassDetails] = useState(null);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [productQuery, setProductQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [form, setForm] = useState({
    product: "",
    artworkName: "",
    basePrice: "",
    reservePrice: "",
    bidStart: "",
    bidEnd: "",
    //bidProdStatus: "Upcoming",
    user: userId,
  });

  const fetchExisting = async () => {
    try {
      const res = await getAPI(`/api/bidding/products/${id}`, {}, true, false);

      const data =
        res?.data?.data ||
        res?.data ||
        res ||
        null;

      if (!data) {
        toast.error("Could not load bidding product");
        return;
      }

      setForm({
        product: data.product?._id || "",
        artworkName: data.artworkName || "",
        basePrice: data.basePrice || "",
        reservePrice: data.reservePrice || "",
        bidStart: data.bidStart?.slice(0, 16) || "",
        bidEnd: data.bidEnd?.slice(0, 16) || "",
        //bidProdStatus: data.bidProdStatus || "Upcoming",
        user: userId,
      });

      setProductQuery(data.artworkName || "");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product details");
    }
  };

  const fetchActivePass = async () => {
    try {
      const response = await getAPI(`/api/bidding/pass-orders/my?userId=${userId}`);

      const passes = response?.data?.data || [];
      const active = passes.find((p) => p.active);

      if (!active) {
        toast.error("You do not have an active bidding pass");
        return;
      }

      setActivePass(active);

      const passId = active.pass?._id;
      const passRes = await getAPI(`/api/bidding/passes/${passId}`);

      setPassDetails(passRes?.data?.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pass details");
    }
  };

  const fetchProducts = async () => {
    try {
      const userType = localStorage.getItem("userType");
      let endpoint =
        userType === "Artist"
          ? "/api/getstatusapprovedproduct"
          : "/api/getstatusapprovedproductforSELLER";

      const res = await getAPI(endpoint, {}, true, false);
      let list =
        Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

      list = list.filter((p) => p.userId === userId || p.userId?._id === userId);

      setProducts(list);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchExisting();
    fetchActivePass();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!passDetails) return toast.error("Invalid bidding pass");

    const [minPrice, maxPrice] = passDetails.basePriceRange.split("-").map(Number);

    if (form.basePrice < minPrice || form.basePrice > maxPrice) {
      return toast.error(
        `Base price must be between ₹${minPrice} and ₹${maxPrice}`
      );
    }

    try {
      await axiosInstance.put(`/api/bidding/products/update/${id}`, form);
      toast.success("Bidding product updated!");
      navigate("/seller/bidding-products-table");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-8 col-md-8 col-sm-12">
            <h2>Edit Bidding Product</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/seller/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Bidding</li>
              <li className="breadcrumb-item">Edit</li>
            </ul>
          </div>
        </div>
      </div>

      {!activePass ? (
        <div className="alert alert-danger">You do not have an active bidding pass.</div>
      ) : (
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card p-4">
              <h5>Edit Bidding Product</h5>

              {/* Artwork Field (non-editable OR editable via dropdown) */}
              <div className="form-group mt-3" style={{ position: "relative" }}>
                <label>Artwork Name</label>

                <input
                  type="text"
                  className="form-control"
                  value={productQuery}
                  onChange={(e) => {
                    setProductQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onFocus={() => setShowSuggestions(true)}
                />

                {showSuggestions && productQuery && (
                  <ul
                    className="list-group"
                    style={{
                      position: "absolute",
                      top: "100%",
                      width: "100%",
                      zIndex: 10,
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {products
                      .filter((p) =>
                        p.productName.toLowerCase().includes(productQuery.toLowerCase())
                      )
                      .map((p) => (
                        <li
                          key={p._id}
                          className="list-group-item"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setForm({ ...form, product: p._id, artworkName: p.productName });
                            setProductQuery(p.productName);
                            setShowSuggestions(false);
                          }}
                        >
                          {p.productName} — {p.status}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {/* Base Price */}
              <div className="form-group">
                <label>Base Price (₹)</label>
                <input
                  name="basePrice"
                  type="number"
                  value={form.basePrice}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Reserve Price */}
              <div className="form-group">
                <label>Reserve Price (₹)</label>
                <input
                  name="reservePrice"
                  type="number"
                  value={form.reservePrice}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Start */}
              <div className="form-group">
                <label>Bid Start</label>
                <input
                  name="bidStart"
                  type="datetime-local"
                  value={form.bidStart}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* End */}
              <div className="form-group">
                <label>Bid End</label>
                <input
                  name="bidEnd"
                  type="datetime-local"
                  value={form.bidEnd}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Status */}
              {/* <div className="form-group">
                <label>Status</label>
                <select
                  name="bidProdStatus"
                  className="form-control"
                  value={form.bidProdStatus}
                  onChange={handleChange}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Hot Deal">Hot Deal</option>
                  <option value="Ending Soon">Ending Soon</option>
                </select>
              </div> */}

              {/* Buttons */}
              <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                Save Changes
              </button>

              <button
                className="btn btn-secondary mt-3 ml-2"
                onClick={() => navigate("/seller/bidding-products-table")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBiddingProduct;
