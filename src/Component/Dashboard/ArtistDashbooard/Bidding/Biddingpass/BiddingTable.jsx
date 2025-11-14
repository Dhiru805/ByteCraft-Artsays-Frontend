// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import getAPI from "../../../../../api/getAPI";

// const BiddingTable = () => {
//   const [orders, setOrders] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   const fetchOrders = async () => {
//     try {
//       const userId = localStorage.getItem("userId");
//       const res = await getAPI(
//         `/api/bidding/pass-orders/my?userId=${userId}`,
//         {},
//         true
//       );
//       setOrders(Array.isArray(res?.data?.data) ? res.data.data : []);
//     } catch (e) {
//       setOrders([]);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const hasActive = orders.some((o) => o && o.active);
//   const filtered = orders.filter((o) =>
//     (o.pass?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const paginated = filtered.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>My Bidding Passes</h2>
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <span
//                   onClick={() => navigate("/artist/dashboard")}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <i className="fa fa-dashboard"></i>
//                 </span>
//               </li>
//               <li className="breadcrumb-item">Bidding Pass</li>
//             </ul>
//           </div>
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <div className="d-flex flex-row-reverse">
//               <div className="page_action">
//                 {/* <button
//                                     type="button"
//                                     className="btn btn-secondary mr-2"
//                                     onClick={() => navigate(`/artist/bidding-pass-table/bidding-pass`)}
//                                     disabled={hasActive ? true : false}
//                                 > Order
//                                     <i className="fa fa-plus"></i>
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn btn-secondary mr-2"
//                                     onClick={() => navigate(`/artist/bidding-pass-table/upgrade`)}
//                                     disabled={hasActive ? false : true}
//                                 > Upgrade
//                                     <i className="fa fa-arrow-up"></i>
//                                 </button> */}
//                 {hasActive ? (
//                   <button
//                     type="button"
//                     className="btn btn-secondary mr-2"
//                     onClick={() =>
//                       navigate(`/artist/bidding-pass-table/upgrade`)
//                     }
//                   >
//                     {" "}
//                     Upgrade
//                     <i className="fa fa-arrow-up"></i>
//                   </button>
//                 ) : (
//                   <button
//                     type="button"
//                     className="btn btn-secondary mr-2"
//                     onClick={() =>
//                       navigate(`/artist/bidding-pass-table/bidding-pass`)
//                     }
//                   >
//                     {" "}
//                     Order
//                     <i className="fa fa-plus"></i>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="header d-flex justify-content-between align-items-center">
//               <div className="w-100 w-md-auto d-flex justify-content-end">
//                 <div className="input-group" style={{ maxWidth: "150px" }}>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     placeholder="Search"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <i
//                     className="fa fa-search"
//                     style={{
//                       position: "absolute",
//                       right: "10px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       pointerEvents: "none",
//                     }}
//                   ></i>
//                 </div>
//               </div>
//             </div>
//             <div className="body">
//               <div className="table-responsive">
//                 <table className="table table-hover text-nowrap">
//                   <thead className="thead-dark">
//                     <tr>
//                       <th>#</th>
//                       <th>Pass</th>
//                       <th>Purchased On</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginated.length === 0 ? (
//                       <tr>
//                         <td colSpan="5" className="text-center">
//                           No data available
//                         </td>
//                       </tr>
//                     ) : (
//                       paginated.map((order, index) => (
//                         <tr key={order._id}>
//                           <td>
//                             {(currentPage - 1) * itemsPerPage + index + 1}
//                           </td>
//                           <td>{order.pass?.name}</td>
//                           <td>
//                             {order.createdAt
//                               ? new Date(order.createdAt).toLocaleDateString(
//                                   "en-IN",
//                                   {
//                                     year: "numeric",
//                                     month: "long",
//                                     day: "numeric",
//                                   }
//                                 )
//                               : "-"}
//                           </td>
//                           <td>
//                             <span
//                               className={`badge ${
//                                 order.active
//                                   ? "badge-success"
//                                   : "badge-secondary"
//                               }`}
//                             >
//                               {order.active ? "Active" : "Inactive"}
//                             </span>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="pagination d-flex justify-content-between mt-4">
//                 <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
//                   Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                   {Math.min(currentPage * itemsPerPage, filtered.length)} of{" "}
//                   {filtered.length} entries
//                 </span>

//                 <ul className="pagination d-flex justify-content-end w-100">
//                   <li
//                     className={`paginate_button page-item ${
//                       currentPage === 1 ? "disabled" : ""
//                     }`}
//                     onClick={handlePrevious}
//                   >
//                     <button className="page-link">Previous</button>
//                   </li>

//                   <li
//                     className={`paginate_button page-item ${
//                       currentPage === totalPages ? "disabled" : ""
//                     }`}
//                     onClick={handleNext}
//                   >
//                     <button className="page-link">Next</button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BiddingTable;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";

const BiddingTable = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [passFilter, setPassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await getAPI(
        `/api/bidding/pass-orders/my?userId=${userId}`,
        {},
        true
      );
      setOrders(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (e) {
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const hasActive = orders.some((o) => o && o.active);

  const uniqueUsers = Array.from(
    new Set(
      orders.map((o) => `${o.user?.name || ""} ${o.user?.lastName || ""}`)
    )
  ).filter((v) => v.trim() !== "");

  const uniquePasses = Array.from(
    new Set(orders.map((o) => o.pass?.name || ""))
  ).filter((v) => v.trim() !== "");

  const filtered = orders.filter((o) => {
    const uname = `${o.user?.name || ""} ${o.user?.lastName || ""}`.toLowerCase();
    const passName = (o.pass?.name || "").toLowerCase();
    const matchesSearch =
      uname.includes(searchTerm.toLowerCase()) ||
      passName.includes(searchTerm.toLowerCase());
    const matchesUser =
      userFilter === "all" || uname === userFilter.toLowerCase();
    const matchesPass =
      passFilter === "all" || passName === passFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && o.active) ||
      (statusFilter === "inactive" && !o.active);

    return matchesSearch && matchesUser && matchesPass && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>My Bidding Passes</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/artist/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Bidding Pass</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                {hasActive ? (
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={() =>
                      navigate(`/artist/bidding-pass-table/upgrade`)
                    }
                  >
                    Upgrade <i className="fa fa-arrow-up"></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={() =>
                      navigate(`/artist/bidding-pass-table/bidding-pass`)
                    }
                  >
                    Order <i className="fa fa-plus"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center flex-wrap">
     
              <div className="input-group" style={{ maxWidth: "200px" }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search by user or pass"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i
                  className="fa fa-search"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                ></i>
              </div>

              <div className="d-flex align-items-center flex-wrap gap-2 mt-2 mt-md-0">

                <select
                  className="form-control form-control-sm mr-2"
                  style={{ width: "150px" }}
                  value={passFilter}
                  onChange={(e) => {
                    setPassFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Passes</option>
                  {uniquePasses.map((p, i) => (
                    <option key={i} value={p.toLowerCase()}>
                      {p}
                    </option>
                  ))}
                </select>

                <select
                  className="form-control form-control-sm mr-2"
                  style={{ width: "120px" }}
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover text-nowrap">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Pass</th>
                      <th>Price</th>
                      <th className="text-center">Purchased On</th>
                      <th>Validity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      paginated.map((order, index) => (
                        <tr key={order._id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{order.pass?.name}</td>
                          <td>
                            ₹
                            {order.pass?.pricing ??
                              order.pass?.price ??
                              order.pass?.amount ??
                              "-"}
                          </td>
                          <td className="text-center">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleString("en-IN", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </td>
                          <td>
                            {(() => {
                              const purchaseDate = new Date(order.createdAt);
                              const validity =
                                parseInt(
                                  order.pass?.validityPeriod ??
                                    order.pass?.validity ??
                                    order.pass?.duration ??
                                    30, // Default to 30days if not found
                                  10
                                ) || 30;

                              const now = new Date();
                              const diffDays = Math.floor(
                                (now - purchaseDate) / (1000 * 60 * 60 * 24)
                              );
                              const remaining = Math.max(validity - diffDays, 0);
                              return remaining > 0 ? `${remaining} days left` : "Expired";
                            })()}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                order.active
                                  ? "badge-success"
                                  : "badge-secondary"
                              }`}
                            >
                              {order.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filtered.length)} of{" "}
                  {filtered.length} entries
                </span>

                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  <li
                    className={`paginate_button page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                    onClick={handleNext}
                  >
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingTable;
