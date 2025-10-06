import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import ConfirmationDialog from "./DeleteDialog/ConfirmationDeleteDialog";

const UserRoleTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [roles, setRoles] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  const navigate = useNavigate();

  const handleEdit = (roleData) => {
    navigate("/super-admin/settings/create-user-role", { state: { roleData } });
  };


  const fetchRoles = async () => {
    try {
      const response = await getAPI("/api/get-all-role");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  style={{ minWidth: "70px" }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: "150px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search"
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
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover text-nowrap table-custom m-b-0 c_list">
                  <thead className="thead-dark">
                    <tr>
                      <th>Role</th>
                      <th>Permissions</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoles.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No roles found.
                        </td>
                      </tr>
                    ) : (
                      currentRoles.map((roleObj) => (
                        <tr key={roleObj._id}>
                          <td>{roleObj.role}</td>
                          <td>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                              {[
                                ...roleObj.tabs.map((tab) => tab.title),
                                ...roleObj.tabs.flatMap((tab) =>
                                  tab.subTabs ? tab.subTabs.map((sub) => sub.title) : []
                                ),
                              ].map((title, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {title}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-outline-info btn-sm mr-2" 
                            title="Edit"
                            onClick={() => handleEdit(roleObj)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => confirmDelete(roleObj._id)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                <div>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, filteredRoles.length)} of{" "}
                  {filteredRoles.length} entries
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-secondary mr-2"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmationDialog
          id={deleteId}
          onClose={() => setShowConfirm(false)}
          onDeleteSuccess={fetchRoles}
        />
      )}

    </>
  );
};

export default UserRoleTable;





















// import React, { useState, useEffect, useNavigate  } from "react";
// import getAPI from "../../../../../api/getAPI";
// import ConfirmationDialog from "./DeleteDialog/ConfirmationDeleteDialog";

// const UserRoleTable = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [roles, setRoles] = useState([]);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);


//   const navigate = useNavigate();

//   const handleEdit = (roleData) => {
//     navigate("/create-user-role", { state: { roleData } });
//   };


//   const fetchRoles = async () => {
//     try {
//       const response = await getAPI("/api/get-all-role");
//       setRoles(response.data);
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//     }
//   };

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const filteredRoles = roles.filter((role) =>
//     role.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);

//   const confirmDelete = (id) => {
//     setDeleteId(id);
//     setShowConfirm(true);
//   };

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

//   const handleItemsPerPageChange = (event) => {
//     setItemsPerPage(Number(event.target.value));
//     setCurrentPage(1);
//   };

//   return (
//     <>
//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="header d-flex justify-content-between align-items-center">
//               <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
//                 <label className="mb-0 mr-2">Show</label>
//                 <select
//                   className="form-control form-control-sm"
//                   value={itemsPerPage}
//                   onChange={handleItemsPerPageChange}
//                   style={{ minWidth: "70px" }}
//                 >
//                   <option value="5">5</option>
//                   <option value="10">10</option>
//                   <option value="25">25</option>
//                   <option value="50">50</option>
//                 </select>
//                 <label className="mb-0 ml-2">entries</label>
//               </div>
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
//                 <table className="table table-hover text-nowrap table-custom m-b-0 c_list">
//                   <thead className="thead-dark">
//                     <tr>
//                       <th>Role</th>
//                       <th>Permissions</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentRoles.length === 0 ? (
//                       <tr>
//                         <td colSpan="3" className="text-center">
//                           No roles found.
//                         </td>
//                       </tr>
//                     ) : (
//                       currentRoles.map((roleObj) => (
//                         <tr key={roleObj._id}>
//                           <td>{roleObj.role}</td>
//                           <td>
//                             <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
//                               {[
//                                 ...roleObj.tabs.map((tab) => tab.title),
//                                 ...roleObj.tabs.flatMap((tab) =>
//                                   tab.subTabs ? tab.subTabs.map((sub) => sub.title) : []
//                                 ),
//                               ].map((title, idx) => (
//                                 <span
//                                   key={idx}
//                                   style={{
//                                     backgroundColor: "#28a745",
//                                     color: "white",
//                                     padding: "5px 10px",
//                                     borderRadius: "5px",
//                                     fontSize: "12px",
//                                     whiteSpace: "nowrap",
//                                   }}
//                                 >
//                                   {title}
//                                 </span>
//                               ))}
//                             </div>
//                           </td>
//                           <td>
//                             <button className="btn btn-outline-info btn-sm mr-2" 
//                             title="Edit"
//                             onClick={() => handleEdit(roleObj)}
//                             >
//                               <i className="fa fa-pencil"></i>
//                             </button>
//                             <button
//                               className="btn btn-outline-danger btn-sm"
//                               title="Delete"
//                               onClick={() => confirmDelete(roleObj._id)}
//                             >
//                               <i className="fa fa-trash-o"></i>
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination controls */}
//               <div className="d-flex justify-content-between align-items-center mt-3 px-2">
//                 <div>
//                   Showing {startIndex + 1} to{" "}
//                   {Math.min(startIndex + itemsPerPage, filteredRoles.length)} of{" "}
//                   {filteredRoles.length} entries
//                 </div>
//                 <div>
//                   <button
//                     className="btn btn-sm btn-secondary mr-2"
//                     onClick={handlePrevious}
//                     disabled={currentPage === 1}
//                   >
//                     Previous
//                   </button>
//                   <button
//                     className="btn btn-sm btn-secondary"
//                     onClick={handleNext}
//                     disabled={currentPage === totalPages || totalPages === 0}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showConfirm && (
//         <ConfirmationDialog
//           id={deleteId}
//           onClose={() => setShowConfirm(false)}
//           onDeleteSuccess={fetchRoles}
//         />
//       )}

//     </>
//   );
// };

// export default UserRoleTable;
