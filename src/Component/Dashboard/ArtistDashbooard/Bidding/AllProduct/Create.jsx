// // import React, { useState, useEffect } from "react";
// // import getAPI from "../../../../../api/getAPI";
// // import axiosInstance from "../../../../../api/axiosConfig";
// // import { toast } from "react-toastify";
// // import { useNavigate } from "react-router-dom";

// // const CreateProduct = () => {
// //   const navigate = useNavigate();
// //   const userId = localStorage.getItem("userId");

// //   const [activePass, setActivePass] = useState(null);
// //   const [passDetails, setPassDetails] = useState(null);

// //   const [form, setForm] = useState({
// //     artworkName: "",
// //     basePrice: "",
// //     reservePrice: "",
// //     bidStartDate: "",
// //     bidEndDate: "",
// //     bidprodstatus: "Upcoming",
// //     userId,
// //   });

// //   const fetchActivePass = async () => {
// //     const response = await getAPI(`/api/bidding/pass-orders/my?userId=${userId}`);
// //     const passes = response.data.data || [];

// //     const active = passes.find((p) => p.active === true);

// //     if (!active) {
// //       toast.error("No active bidding pass. Purchase a pass.");
// //       return;
// //     }
// //     setActivePass(active);

// //     const passRes = await getAPI(`/api/bidding/passes/${active.pass}`);
// //     setPassDetails(passRes.data.data);
// //   };

// //   useEffect(() => {
// //     fetchActivePass();
// //   }, []);

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       const res = await axiosInstance.post("/api/bidding/products/create", form);
// //       toast.success("Product added!");
// //       navigate("/artist/bidding-products");
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || "Failed");
// //     }
// //   };

// //   return (
// //     <div className="container">
// //       <h3>Add Bidding Product</h3>

// //       {!activePass ? (
// //         <p>No active pass...</p>
// //       ) : (
// //         <div className="card p-4">

// //           <label>Artwork Name</label>
// //           <input name="artworkName" className="form-control" onChange={handleChange} />

// //           <label>Base Price</label>
// //           <input name="basePrice" type="number" className="form-control" onChange={handleChange} />

// //           <label>Reserve Price</label>
// //           <input name="reservePrice" type="number" className="form-control" onChange={handleChange} />

// //           <label>Bid Start Date</label>
// //           <input name="bidStartDate" type="date" className="form-control" onChange={handleChange} />

// //           <label>Bid End Date</label>
// //           <input name="bidEndDate" type="date" className="form-control" onChange={handleChange} />

// //           <label>Status</label>
// //           <select name="bidprodstatus" className="form-control" onChange={handleChange}>
// //             <option>Upcoming</option>
// //             <option>Hot Deal</option>
// //             <option>Ending Soon</option>
// //           </select>

// //           <button className="btn btn-primary mt-3" onClick={handleSubmit}>
// //             Finalise
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CreateProduct;
// import React, { useState, useEffect } from "react";
// import getAPI from "../../../../../api/getAPI";
// import axiosInstance from "../../../../../api/axiosConfig";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const CreateBiddingProduct = () => {
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId");

//   const [activePass, setActivePass] = useState(null);
//   const [passDetails, setPassDetails] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [alreadyBidded, setAlreadyBidded] = useState([]);
//   const [productQuery, setProductQuery] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const [form, setForm] = useState({
//     product: "",        // must be selected
//     artworkName: "",
//     basePrice: 0,
//     reservePrice: 0,
//     bidStart: "",
//     bidEnd: "",
//     bidProdStatus: "Upcoming",
//     user: userId,       // must be sent to backend
//   });

//   // Fetch active pass
//   const fetchActivePass = async () => {
//     try {
//       const res = await getAPI(`/api/bidding/pass-orders/my?userId=${userId}`);
//       const passes = res?.data?.data || [];
//       const active = passes.find((p) => p.active === true);

//       if (!active) return toast.error("No active bidding pass. Purchase a pass first.");
//       setActivePass(active);

//       const passRes = await getAPI(`/api/bidding/passes/${active.pass?._id}`);
//       setPassDetails(passRes?.data?.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load pass details");
//     }
//   };

//   // Fetch approved products
//   const fetchProducts = async () => {
//     try {
//       const userType = localStorage.getItem("userType");
//       let endpoint =
//         userType === "Artist"
//           ? "/api/getstatusapprovedproduct"
//           : userType === "Seller"
//           ? "/api/getstatusapprovedproductforSELLER"
//           : null;

//       if (!endpoint) return toast.error("User type not recognized!");

//       const res = await getAPI(endpoint, {}, true, false);
//       let list = res?.data?.data || res?.data?.products || res?.data || res || [];
//       list = list.filter((p) => p.userId === userId || p.userId?._id === userId);
//       setProducts(list);
//     } catch (err) {
//       console.error(err);
//       setProducts([]);
//     }
//   };

//   // Fetch products already bidded
//   const fetchAlreadyBidded = async () => {
//     try {
//       const res = await getAPI(`/api/bidding/products/user/${userId}`, {}, true, false);
//       let list = res?.data?.data || res?.data || res || [];
//       setAlreadyBidded(list.map((b) => b.product));
//     } catch (err) {
//       console.error(err);
//       setAlreadyBidded([]);
//     }
//   };

//   useEffect(() => {
//     fetchActivePass();
//     fetchProducts();
//     fetchAlreadyBidded();
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
//     setForm({ ...form, [e.target.name]: value });
//   };

//   // Handle product selection from suggestions
//   const handleProductSelect = (p) => {
//     if (p.status !== "Approved") {
//       toast.error("This product is not approved yet.");
//       return;
//     }
//     if (alreadyBidded.includes(p._id)) {
//       toast.error("This product is already added to bidding!");
//       return;
//     }

//     setForm((prev) => ({
//       ...prev,
//       product: p._id,
//       artworkName: p.productName,
//     }));
//     setProductQuery(p.productName);
//     setShowSuggestions(false);
//   };

//   // Submit form
//   const handleSubmit = async () => {
//     const payload = {
//       user: form.user,
//       product: form.product,
//       startingBid: Number(form.basePrice),
//       artworkName: form.artworkName,
//       reservePrice: form.reservePrice,
//       bidStart: form.bidStart,
//       bidEnd: form.bidEnd,
//       bidProdStatus: form.bidProdStatus,
//     };

//     console.log("Payload going to backend:", payload);

//    if (!payload.user) return toast.error("User missing");
// if (!payload.product) return toast.error("Select a product from list");
// if (payload.startingBid <= 0) return toast.error("Base price must be greater than 0");
//  {
//   return toast.error("All fields are required");
// }


//     if (!form.basePrice) return toast.error("Base price is required");
//     if (!form.reservePrice) return toast.error("Reserve price is required");
//     if (!form.bidStart) return toast.error("Bid start is required");
//     if (!form.bidEnd) return toast.error("Bid end is required");
//     if (!passDetails) return toast.error("Pass validation failed");

//     const [minPrice, maxPrice] = passDetails.basePriceRange.split("-").map(Number);
//     if (form.basePrice < minPrice || form.basePrice > maxPrice) {
//       return toast.error(`Base price must be between ₹${minPrice} and ₹${maxPrice}`);
//     }

//     try {
//       await axiosInstance.post("/api/createbid", payload);

//       toast.success("Bid created successfully!");
//       navigate("/artist/bidding-products-table");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to create bidding product");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <h2>Add Bidding Product</h2>

//       {!activePass ? (
//         <div className="alert alert-danger">You do not have an active bidding pass.</div>
//       ) : (
//         <div className="card p-4">
//           <h5>Bidding Product Form</h5>

//           {/* Artwork Name Input with suggestions */}
//           <div className="form-group mt-3" style={{ position: "relative" }}>
//             <label>Artwork Name</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Type product name..."
//               value={productQuery}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setProductQuery(value);
//                 setShowSuggestions(true);

//                 // Reset selection if user types something new
//                 if (form.artworkName !== value) {
//                   setForm({ ...form, product: "", artworkName: value });
//                 }
//               }}
//               onFocus={() => setShowSuggestions(true)}
//               onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
//             />

//             {showSuggestions && productQuery && (
//               <ul
//                 className="list-group"
//                 style={{
//                   position: "absolute",
//                   top: "100%",
//                   width: "100%",
//                   zIndex: 10,
//                   maxHeight: "200px",
//                   overflowY: "auto",
//                 }}
//               >
//                 {products
//                   .filter((p) =>
//                     p.productName.toLowerCase().includes(productQuery.toLowerCase())
//                   )
//                   .filter((p) => !alreadyBidded.includes(p._id))
//                   .map((p) => (
//                     <li
//                       key={p._id}
//                       className="list-group-item"
//                       style={{
//                         cursor: p.status === "Approved" ? "pointer" : "not-allowed",
//                         background: p.status !== "Approved" ? "#f1f1f1" : "white",
//                         color: p.status !== "Approved" ? "#888" : "black",
//                       }}
//                       onMouseDown={() => handleProductSelect(p)} // ✅ fixed selection
//                     >
//                       {p.productName} — {p.status}
//                     </li>
//                   ))}
//               </ul>
//             )}
//           </div>

//           {/* Base Price */}
//           <div className="form-group">
//             <label>Base Price (₹)</label>
//             <input
//               name="basePrice"
//               type="number"
//               className="form-control"
//               value={form.basePrice || ""}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Reserve Price */}
//           <div className="form-group">
//             <label>Reserve Price (₹)</label>
//             <input
//               name="reservePrice"
//               type="number"
//               className="form-control"
//               value={form.reservePrice || ""}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Bid Start / End */}
//           <div className="form-group">
//             <label>Bid Start</label>
//             <input
//               name="bidStart"
//               type="datetime-local"
//               className="form-control"
//               value={form.bidStart}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group">
//             <label>Bid End</label>
//             <input
//               name="bidEnd"
//               type="datetime-local"
//               className="form-control"
//               value={form.bidEnd}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Bid Status */}
//           <div className="form-group">
//             <label>Status</label>
//             <select
//               name="bidProdStatus"
//               className="form-control"
//               value={form.bidProdStatus}
//               onChange={handleChange}
//             >
//               <option>Upcoming</option>
//               <option>Hot Deal</option>
//               <option>Ending Soon</option>
//             </select>
//           </div>

//           <button className="btn btn-primary mt-3" onClick={handleSubmit}>
//             Finalize & Add
//           </button>
//           <button
//             className="btn btn-secondary mt-3 ml-2"
//             onClick={() => navigate("/artist/bidding-products-table")}
//           >
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateBiddingProduct;
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
  const [alreadyBidded, setAlreadyBidded] = useState([]);
  const [productQuery, setProductQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [form, setForm] = useState({
    product: "",        
    artworkName: "",
    basePrice: "",
    reservePrice: "",
    bidStart: "",
    bidEnd: "",
    bidProdStatus: "Upcoming",
    user: userId,       
  });

  // Fetch active pass
  const fetchActivePass = async () => {
    try {
      const res = await getAPI(`/api/bidding/pass-orders/my?userId=${userId}`);
      const passes = res?.data?.data || [];
      const active = passes.find((p) => p.active === true);

      if (!active) return toast.error("No active bidding pass. Purchase a pass first.");
      setActivePass(active);

      const passRes = await getAPI(`/api/bidding/passes/${active.pass?._id}`);
      setPassDetails(passRes?.data?.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pass details");
    }
  };

  // Fetch approved products
  const fetchProducts = async () => {
    try {
      const userType = localStorage.getItem("userType");
      let endpoint =
        userType === "Artist"
          ? "/api/getstatusapprovedproduct"
          : userType === "Seller"
          ? "/api/getstatusapprovedproductforSELLER"
          : null;

      if (!endpoint) return toast.error("User type not recognized!");

      const res = await getAPI(endpoint, {}, true, false);
      let list = res?.data?.data || res?.data?.products || res?.data || res || [];
      list = list.filter((p) => p.userId === userId || p.userId?._id === userId);
      setProducts(list);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  // Fetch products already bidded
  const fetchAlreadyBidded = async () => {
    try {
      const res = await getAPI(`/api/bidding/products/user/${userId}`, {}, true, false);
      let list = res?.data?.data || res?.data || res || [];
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

  // Handle input changes
  const handleChange = (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Handle product selection from suggestions
  const handleProductSelect = (p) => {
    if (p.status !== "Approved") {
      toast.error("This product is not approved yet.");
      return;
    }
    if (alreadyBidded.includes(p._id)) {
      toast.error("This product is already added to bidding!");
      return;
    }

    setForm((prev) => ({
      ...prev,
      product: p._id,
      artworkName: p.productName,
    }));
    setProductQuery(p.productName);
    setShowSuggestions(false);
  };

  // Submit form
  const handleSubmit = async () => {
    const startingBid = Number(form.basePrice);
    const reservePrice = Number(form.reservePrice);

    // ✅ Validation
    if (!form.user) return toast.error("User missing");
    if (!form.product) return toast.error("Select a product from the list");
    if (!form.artworkName.trim()) return toast.error("Artwork name is required");
    if (!startingBid || startingBid <= 0) return toast.error("Base price must be greater than 0");
    if (!reservePrice || reservePrice <= 0) return toast.error("Reserve price must be greater than 0");
    if (!form.bidStart) return toast.error("Bid start date is required");
    if (!form.bidEnd) return toast.error("Bid end date is required");
    if (!passDetails) return toast.error("Pass validation failed");

    const [minPrice, maxPrice] = passDetails.basePriceRange.split("-").map(Number);
    if (startingBid < minPrice || startingBid > maxPrice) {
      return toast.error(`Base price must be between ₹${minPrice} and ₹${maxPrice}`);
    }

    const payload = {
      user: form.user,
      product: form.product,
      startingBid,
      artworkName: form.artworkName,
      reservePrice,
      bidStart: form.bidStart,
      bidEnd: form.bidEnd,
      bidProdStatus: form.bidProdStatus,
    };

    console.log("Payload going to backend:", payload);

    try {
      await axiosInstance.post("/api/createbid", payload);
      toast.success("Bid created successfully!");
      navigate("/artist/bidding-products-table");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create bidding product");
    }
  };

  return (
    <div className="container-fluid">
      <h2>Add Bidding Product</h2>

      {!activePass ? (
        <div className="alert alert-danger">You do not have an active bidding pass.</div>
      ) : (
        <div className="card p-4">
          <h5>Bidding Product Form</h5>

          {/* Artwork Name Input with suggestions */}
          <div className="form-group mt-3" style={{ position: "relative" }}>
            <label>Artwork Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Type product name..."
              value={productQuery}
              onChange={(e) => {
                const value = e.target.value;
                setProductQuery(value);
                setShowSuggestions(true);
                if (form.artworkName !== value) {
                  setForm({ ...form, product: "", artworkName: value });
                }
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
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
                  .filter((p) => !alreadyBidded.includes(p._id))
                  .map((p) => (
                    <li
                      key={p._id}
                      className="list-group-item"
                      style={{
                        cursor: p.status === "Approved" ? "pointer" : "not-allowed",
                        background: p.status !== "Approved" ? "#f1f1f1" : "white",
                        color: p.status !== "Approved" ? "#888" : "black",
                      }}
                      onMouseDown={() => handleProductSelect(p)}
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
              className="form-control"
              value={form.basePrice || ""}
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
              value={form.reservePrice || ""}
              onChange={handleChange}
            />
          </div>

          {/* Bid Start / End */}
          <div className="form-group">
            <label>Bid Start</label>
            <input
              name="bidStart"
              type="datetime-local"
              className="form-control"
              value={form.bidStart}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bid End</label>
            <input
              name="bidEnd"
              type="datetime-local"
              className="form-control"
              value={form.bidEnd}
              onChange={handleChange}
            />
          </div>

          {/* Bid Status */}
          <div className="form-group">
            <label>Status</label>
            <select
              name="bidProdStatus"
              className="form-control"
              value={form.bidProdStatus}
              onChange={handleChange}
            >
              <option>Upcoming</option>
              <option>Hot Deal</option>
              <option>Ending Soon</option>
            </select>
          </div>

          <button className="btn btn-primary mt-3" onClick={handleSubmit}>
            Finalize & Add
          </button>
          <button
            className="btn btn-secondary mt-3 ml-2"
            onClick={() => navigate("/artist/bidding-products-table")}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateBiddingProduct;
