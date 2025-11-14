
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import getAPI from "../../../../api/getAPI";
// import deleteAPI from "../../../../api/deleteAPI";
// import { toast } from "react-toastify";

// function ArtsaysGalleryTable() {
//   const navigate = useNavigate();
//   const [galleries, setGalleries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchGalleries = async () => {
//     try {
//       const response = await getAPI("/api/CMS-artsays-gallery");
//       if (response?.hasError === false) {
//         setGalleries(response.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Error fetching galleries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGalleries();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this gallery?")) return;
//     try {
//       const response = await deleteAPI(`/api/CMS-artsays-gallery/delete/${id}`);
//       if (response?.hasError === false) {
//         toast.success("Gallery deleted successfully");
//         fetchGalleries();
//       } else {
//         toast.error(response?.message || "Failed to delete gallery");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Error deleting gallery");
//     }
//   };

//   if (loading) return <div className="text-center mt-5">Loading Galleries...</div>;

//   return (
//     <div className="container-fluid">
//       <div className="block-header d-flex justify-content-between align-items-center mb-3">
//         <h2>Artsays Gallery</h2>
//         <button
//           className="btn btn-secondary"
//           onClick={() => navigate("/super-admin/CMS-artsays-gallery/create")}
//         >
//           <i className="fa fa-plus"></i> Add Gallery
//         </button>
//       </div>

//       <div className="card">
//         <div className="body">
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="thead-dark">
//                 <tr>
//                   <th>#</th>
//                   <th>Title</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {galleries.length ? (
//                   galleries.map((gallery, index) => (
//                     <tr key={gallery._id}>
//                       <td>{index + 1}</td>
//                       <td>{gallery.title}</td>
//                       <td>
//                         <span
//                           className={`badge ${
//                             gallery.status === "published"
//                               ? "bg-success"
//                               : "bg-secondary"
//                           }`}
//                         >
//                           {gallery.status}
//                         </span>
//                       </td>
//                       <td>
//                         <button
//                           className="btn btn-outline-info btn-sm mx-1"
//                           onClick={() =>
//                             navigate(`/super-admin/CMS-artsays-gallery/edit/${gallery._id}`)
//                           }
//                         >
//                           <i className="fa fa-pencil"></i>
//                         </button>
//                         <button
//                           className="btn btn-outline-danger btn-sm"
//                           onClick={() => handleDelete(gallery._id)}
//                         >
//                           <i className="fa fa-trash-o"></i>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="text-center">
//                       No Galleries found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ArtsaysGalleryTable;





// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import getAPI from "../../../../api/getAPI";
// import deleteAPI from "../../../../api/deleteAPI";
// import ConfirmationDialog from "../../ConfirmationDialog";
// import { toast } from "react-toastify";

// function ArtGalleryCMS() {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [galleriesPerPage, setGalleriesPerPage] = useState(10);
//   const [galleryData, setGalleryData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [deleteType, setDeleteType] = useState("");
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedGalleryToDelete, setSelectedGalleryToDelete] = useState(null);

//   const fetchGalleryData = async () => {
//     try {
//       const response = await getAPI("/api/CMS-artsays-gallery");
//       console.log("TABLE - API Response:", response);
//       if (response?.hasError === false) {
//         const data = response?.data || [];
//         console.log("TABLE - Gallery data:", data);
//         setGalleryData(data);
//       } else {
//         console.log("TABLE - Error response:", response);
//       }
//     } catch (error) {
//       console.log("TABLE - Error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchGalleryData();
//   }, []);

//   useEffect(() => {
//     const handleFocus = () => {
//       fetchGalleryData();
//     };

//     window.addEventListener('focus', handleFocus);
//     return () => window.removeEventListener('focus', handleFocus);
//   }, []);

//   const filteredGallery = galleryData.filter((item) =>
//     item.title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredGallery.length / galleriesPerPage);
//   const displayedGallery = filteredGallery.slice(
//     (currentPage - 1) * galleriesPerPage,
//     currentPage * galleriesPerPage
//   );

//   const handlePreviousPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const handleGalleriesPerPage = (e) => {
//     setGalleriesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const openDeleteDialog = (gallery) => {
//     setSelectedGalleryToDelete(gallery);
//     setIsDeleteDialogOpen(true);
//     setDeleteType("cmsartgallery");
//   };

//   const handleDeleteCancel = () => {
//     setIsDeleteDialogOpen(false);
//     setSelectedGalleryToDelete(null);
//   };

//   const handleDeleteConfirmed = async (id) => {
//     try {
//       const response = await deleteAPI(`/api/CMS-artsays-gallery/delete/${id}`);
//       if (response?.hasError === false) {
//         toast.success(response?.message || "Deleted successfully");
//         fetchGalleryData();
//       } else {
//         console.log(response);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Error deleting");
//     }
//     setIsDeleteDialogOpen(false);
//     setSelectedGalleryToDelete(null);
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>Art Gallery CMS</h2>
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <span
//                   onClick={() => navigate("/super-admin/dashboard")}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <i className="fa fa-dashboard"></i>
//                 </span>
//               </li>
//               <li className="breadcrumb-item">Art Gallery CMS</li>
//             </ul>
//           </div>

//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <div className="d-flex flex-row-reverse">
//               <div className="page_action">
//                 <button
//                   type="button"
//                   className="btn btn-secondary mr-2"
//                   onClick={() => navigate("/super-admin/CMS-art-gallery/create")}
//                 >
//                   <i className="fa fa-plus"></i>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="header d-flex justify-content-between align-items-center">
//               <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
//                 <label className="mb-0 mr-2">Show</label>
//                 <select
//                   className="form-control form-control-sm"
//                   value={galleriesPerPage}
//                   onChange={handleGalleriesPerPage}
//                   style={{ minWidth: "70px" }}
//                 >
//                   <option value="10">10</option>
//                   <option value="25">25</option>
//                   <option value="50">50</option>
//                   <option value="100">100</option>
//                 </select>
//                 <label className="mb-0 ml-2">entries</label>
//               </div>

//               <div className="w-100 w-md-auto d-flex justify-content-end">
//                 <div className="input-group" style={{ maxWidth: "180px" }}>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     placeholder="Search title"
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
//                 <table className="table table-hover">
//                   <thead className="thead-dark text-center">
//                     <tr>
//                       <th>Serial No.</th>
//                       <th>Title</th>
//                       <th>Status</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-center">
//                     {filteredGallery.length > 0 ? (
//                       displayedGallery.map((gallery, index) => (
//                         <tr key={gallery._id}>
//                           <td>
//                             {(currentPage - 1) * galleriesPerPage + index + 1}
//                           </td>
//                           <td>{gallery.title}</td>
//                           {/* <td>
//                             <span
//                               className={`badge ${
//                                 gallery.status === "published"
//                                   ? "badge-success"
//                                   : "badge-warning"
//                               }`}
//                             >
//                               {gallery.status}
//                             </span>
//                           </td> */}

//                           <td>
//                           {gallery.status === "published" ? (
//                             <span className="badge badge-success">Published</span>
//                           ) : (
//                             <span className="badge badge-secondary">Draft</span>
//                           )}
//                         </td>
//                           <td>
//                             <button
//                               type="button"
//                               className="btn btn-outline-info btn-sm mx-1"
//                               title="Edit"
//                               onClick={() =>
//                                 navigate(
//                                   `/super-admin/CMS-art-gallery/edit/${gallery._id}`
//                                 )
//                               }
//                             >
//                               <i className="fa fa-pencil"></i>
//                             </button>
//                             <button
//                               type="button"
//                               className="btn btn-outline-danger btn-sm"
//                               title="Delete"
//                               onClick={() => openDeleteDialog(gallery)}
//                             >
//                               <i className="fa fa-trash-o"></i>
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="4" className="text-center">
//                           No records found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="pagination d-flex justify-content-between mt-4">
//                 <span className="d-none d-sm-inline-block text-truncate w-100 mx-1">
//                   Showing{" "}
//                   {filteredGallery.length === 0
//                     ? 0
//                     : (currentPage - 1) * galleriesPerPage + 1}{" "}
//                   to{" "}
//                   {Math.min(
//                     currentPage * galleriesPerPage,
//                     filteredGallery.length
//                   )}{" "}
//                   of {filteredGallery.length} entries
//                 </span>

//                 <ul className="pagination d-flex justify-content-end w-100">
//                   <li
//                     className={`paginate_button page-item ${
//                       currentPage === 1 ? "disabled" : ""
//                     }`}
//                     onClick={handlePreviousPage}
//                   >
//                     <button className="page-link">Previous</button>
//                   </li>
//                   {Array.from({ length: totalPages }, (_, index) => index + 1).map(
//                     (pageNum) => (
//                       <li
//                         key={pageNum}
//                         className={`paginate_button page-item ${
//                           currentPage === pageNum ? "active" : ""
//                         }`}
//                         onClick={() => setCurrentPage(pageNum)}
//                       >
//                         <button className="page-link">{pageNum}</button>
//                       </li>
//                     )
//                   )}
//                   <li
//                     className={`paginate_button page-item ${
//                       currentPage === totalPages ? "disabled" : ""
//                     }`}
//                     onClick={handleNextPage}
//                   >
//                     <button className="page-link">Next</button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isDeleteDialogOpen && (
//         <ConfirmationDialog
//           onClose={handleDeleteCancel}
//           deleteType={deleteType}
//           id={selectedGalleryToDelete?._id}
//           onDeleted={handleDeleteConfirmed}
//         />
//       )}
//     </div>
//   );
// }

// export default ArtGalleryCMS;












import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import getAPI from "../../../../api/getAPI";
import deleteAPI from "../../../../api/deleteAPI";
import ConfirmationDialog from "../../ConfirmationDialog";
import { toast } from "react-toastify";

function ArtGalleryCMS() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [galleriesPerPage, setGalleriesPerPage] = useState(10);
  const [galleryData, setGalleryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteType, setDeleteType] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGalleryToDelete, setSelectedGalleryToDelete] = useState(null);

  const fetchGalleryData = async () => {
    try {
      const response = await getAPI("/api/CMS-artsays-gallery");
      if (response?.hasError === false) {
        setGalleryData(response?.data?.data || []);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const filteredGallery = galleryData.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGallery.length / galleriesPerPage);
  const displayedGallery = filteredGallery.slice(
    (currentPage - 1) * galleriesPerPage,
    currentPage * galleriesPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleGalleriesPerPage = (e) => {
    setGalleriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const openDeleteDialog = (gallery) => {
    setSelectedGalleryToDelete(gallery);
    setIsDeleteDialogOpen(true);
    setDeleteType("cmsartgallery");
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedGalleryToDelete(null);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      const response = await deleteAPI(`/api/CMS-artsays-gallery/delete/${id}`);
      if (response?.hasError === false) {
        toast.success(response?.message || "Deleted successfully");
        fetchGalleryData();
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting");
    }
    setIsDeleteDialogOpen(false);
    setSelectedGalleryToDelete(null);
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Art Gallery CMS</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Art Gallery CMS</li>
            </ul>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate("/super-admin/CMS-art-gallery/create")}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={galleriesPerPage}
                  onChange={handleGalleriesPerPage}
                  style={{ minWidth: "70px" }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>

              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: "180px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search title"
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
                <table className="table table-hover">
                  <thead className="thead-dark text-center">
                    <tr>
                      <th>Serial No.</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {filteredGallery.length > 0 ? (
                      displayedGallery.map((gallery, index) => (
                        <tr key={gallery._id}>
                          <td>
                            {(currentPage - 1) * galleriesPerPage + index + 1}
                          </td>
                          <td>{gallery.title}</td>
                          <td>
                            <span
                              className={`badge ${
                                gallery.status === "published"
                                  ? "badge-success"
                                  : "badge-warning"
                              }`}
                            >
                              {gallery.status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mx-1"
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  `/super-admin/CMS-art-gallery/edit/${gallery._id}`
                                )
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => openDeleteDialog(gallery)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination d-flex justify-content-between mt-4">
                <span className="d-none d-sm-inline-block text-truncate w-100 mx-1">
                  Showing{" "}
                  {filteredGallery.length === 0
                    ? 0
                    : (currentPage - 1) * galleriesPerPage + 1}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * galleriesPerPage,
                    filteredGallery.length
                  )}{" "}
                  of {filteredGallery.length} entries
                </span>

                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={handlePreviousPage}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNum) => (
                      <li
                        key={pageNum}
                        className={`paginate_button page-item ${
                          currentPage === pageNum ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        <button className="page-link">{pageNum}</button>
                      </li>
                    )
                  )}
                  <li
                    className={`paginate_button page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                    onClick={handleNextPage}
                  >
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType={deleteType}
          id={selectedGalleryToDelete?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}

export default ArtGalleryCMS;