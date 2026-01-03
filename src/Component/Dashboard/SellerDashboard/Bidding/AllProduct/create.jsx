import React, { useState, useEffect } from "react";
import getAPI from "../../../../../api/getAPI";
import axiosInstance from "../../../../../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateBiddingProduct = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [activePass, setActivePass] = useState(null);
  const [passDetails, setPassDetails] = useState(null);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [productQuery, setProductQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProducts, setShowProduct] = useState([]);
  const [finallProduct, setFinalProduct] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchActivePass = async () => {
    try {
      const response = await getAPI(
        `/api/bidding/pass-orders/my?userId=${userId}`
      );

      const passes = response?.data?.data || [];

      const active = passes.find((p) => p.active === true);

      if (!active) {
        toast.error("No active bidding pass. Purchase a pass first.");
        return;
      }

      setActivePass(active);

      const passId = active.pass?._id;

      if (!passId) {
        toast.error("Pass data is invalid.");
        return;
      }

      const passRes = await getAPI(`/api/bidding/passes/${passId}`);
      setPassDetails(passRes?.data?.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pass details");
    } finally {
      setLoading(false);
    }
  };
  const fetchProducts = async () => {
    try {
      const userType = localStorage.getItem("userType");

      let endpoint = "";

      if (userType === "Artist") {
        endpoint = "/api/getstatusapprovedproduct";
      } else if (userType === "Seller") {
        endpoint = "/api/getstatusapprovedproductforSELLER";
      } else {
        toast.error("User type not recognized!");
        return;
      }

      const res = await getAPI(endpoint, {}, true, false);

      console.log("API RESPONSE:", res);

      let list = [];

      if (Array.isArray(res?.data?.data)) list = res.data.data;
      else if (Array.isArray(res?.data?.products)) list = res.data.products;
      else if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res)) list = res;
      else list = [];
      list = list.filter(
        (p) => p.userId === userId || p.userId?._id === userId
      );

      setProducts(list);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };
  const [alreadyBidded, setAlreadyBidded] = useState([]);

  const fetchAlreadyBidded = async () => {
    try {
      const res = await getAPI(
        `/api/bidding/products/user/${userId}`,
        {},
        true,
        false
      );

      let list = [];

      if (Array.isArray(res)) list = res;
      else if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.data?.data)) list = res.data.data;

      setAlreadyBidded(list.map((b) => b.product));
    } catch (err) {
      console.error(err);
      setAlreadyBidded([]);
    }
  };

  useEffect(() => {
    fetchActivePass();
    fetchProducts();
    fetchAlreadyBidded();
  }, []);

  useEffect(() => {
    setShowProduct(products?.filter((p) => !alreadyBidded?.includes(p._id)));
  }, [products, alreadyBidded]);

  useEffect(() => {
    setFinalProduct(
      showProducts?.filter((p) =>
        p?.productName.toLowerCase().includes(productQuery.toLowerCase())
      )
    );
  }, [productQuery, showProducts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formValidation = () => {
    return Object.values(form).every((v) => {
      if (v === undefined || v === null) return false;
      if (typeof v === "string" && v.trim() === "") return false;
      return true;
    });
  };
  const handleSubmit = async () => {
    if (!passDetails) {
      toast.error("Pass validation failed");
      return;
    }
    if (!formValidation()) {
      toast.error("All fields are require");
      return;
    }
    const [minPrice, maxPrice] = passDetails.basePriceRange
      .split("-")
      .map(Number);
    const basePrice = Number(form.basePrice);

    if (basePrice < minPrice || basePrice > maxPrice) {
      toast.error(
        `Base price must be between ₹${minPrice} and ₹${maxPrice} as per your pass`
      );
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/api/bidding/products/create",
        form
      );
      toast.success("Product added to bidding successfully!");
      navigate("/seller/bidding-products-table");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create bidding product"
      );
    }
  };
  console.log("formmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", form);
  if (loading) return <p>Loading...</p>;
  return (
    <div className="container-fluid">
      {/* HEADER */}
      <div className="block-header">
        <div className="row">
          <div className="col-lg-8 col-md-8 col-sm-12">
            <h2>Add Bidding Product</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/seller/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Bidding</li>
              <li className="breadcrumb-item">Create</li>
            </ul>
          </div>
        </div>
      </div>

      {!activePass ? (
        <div className="alert alert-danger">
          You do not have an active bidding pass.
        </div>
      ) : (
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card p-4">
              <h5>Bidding Product Form</h5>

              {/* PRODUCT SELECT */}
              {/* <div className="form-group mt-3">
                <label>Artwork</label>
                <select
                  className="form-control"
                  name="product"
                  onChange={(e) => {
                    const p = products.find((x) => x._id === e.target.value);

                    if (p?.status !== "Approved") {
                      toast.error("This product is not approved yet.");
                      return;
                    }

                    setForm({
                      ...form,
                      product: p._id,
                      artworkName: p.productName,
                    });
                  }}
                >
                  <option value="">Select a Product</option>

                  {loadingProducts ? (
                    <option>Loading...</option>
                  ) : (
                    products.map((p) => (
                      <option
                        key={p._id}
                        value={p._id}
                        style={{
                          color: p.status === "Approved" ? "black" : "grey",
                        }}
                      >
                        {p.productName} — {p.status}
                      </option>
                    ))
                  )}
                </select>
              </div> */}
              <div className="form-group mt-3" style={{ position: "relative" }}>
                <label>Artwork Name</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder={
                    loadingProducts ? "loading" : "Type product name..."
                  }
                  value={productQuery}
                  onChange={(e) => {
                    setProductQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 150);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />

                {/* SUGGESTION LIST */}
                {showSuggestions && finallProduct?.length > 0 && (
                  <div
                    className="absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto
               rounded-md border border-gray-200 bg-white shadow-lg z-50
               list-none p-0 m-0"
                  >
                    {finallProduct.map((p) => (
                      <ul
                        key={p._id}
                        className="px-3 py-2 text-sm flex justify-between items-center
                   cursor-pointer transition-all duration-150
                   hover:bg-blue-100 hover:pl-4 cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault(); // VERY IMPORTANT
                          setForm({
                            ...form,
                            product: p._id,
                            artworkName: p.productName,
                          });
                          setProductQuery(p.productName);
                          setShowSuggestions(false);
                        }}
                      >
                        <span className="truncate">{p.productName}</span>
                      </ul>
                    ))}
                  </div>
                )}
              </div>

              {/* Base Price */}
              <div className="form-group">
                <label>Base Price (₹)</label>
                <input
                  name="basePrice"
                  type="number"
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
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label>Bid Start</label>
                <input
                  name="bidStart"
                  type="datetime-local"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* End Date */}
              <div className="form-group">
                <label>Bid End</label>
                <input
                  name="bidEnd"
                  type="datetime-local"
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
                  onChange={handleChange}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Hot Deal">Hot Deal</option>
                  <option value="Ending Soon">Ending Soon</option>
                </select>
              </div> */}

              <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                Finalize & Add
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

export default CreateBiddingProduct;
