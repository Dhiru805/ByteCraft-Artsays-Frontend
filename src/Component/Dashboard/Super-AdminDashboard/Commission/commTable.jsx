// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import getAPI from "../../../../api/getAPI";
// import ConfirmationDialog from "../../ConfirmationDialog";
// import axiosInstance from "../../../../api/axiosConfig";

// const CommissionTable = () => {
//   const navigate = useNavigate();
//   const [pages, setPages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pagesPerPage, setPagesPerPage] = useState(10);
//   const [deleteType, setDeleteType] = useState("");
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedPageToDelete, setSelectedPageToDelete] = useState(null);
//   const location = useLocation();

//   const fetchPages = async () => {
//     try {
//       const response = await getAPI("/api/commission");
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       setPages(data);
//     } catch (error) {
//       console.error("Error fetching Commission pages:", error);
//       toast.error(error.response?.data?.message || "Failed to fetch pages");
//       setPages([]);
//     }
//   };

//   useEffect(() => {
//     fetchPages();
//   }, []);

//   useEffect(() => {
//     if (location.state?.reload) {
//       fetchPages();
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state?.reload]);

//   const handleDeleteCancel = () => {
//     setIsDeleteDialogOpen(false);
//     setSelectedPageToDelete(null);
//   };

//   const handleDeleteConfirmed = async (id) => {
//     try {
//       await axiosInstance.delete(`/api/commission/delete/${id}`);
//       setPages((prevPages) => prevPages.filter((page) => page._id !== id));
//       toast.success("Page deleted successfully!");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to delete page.");
//     } finally {
//       setIsDeleteDialogOpen(false);
//       setSelectedPageToDelete(null);
//     }
//   };

//   const openDeleteDialog = (page) => {
//     setSelectedPageToDelete(page);
//     setIsDeleteDialogOpen(true);
//     setDeleteType("commission");
//   };

//   const filteredPages = pages.filter((page) =>
//     page.webpageHeading.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredPages.length / pagesPerPage);
//   const displayedPages = filteredPages.slice(
//     (currentPage - 1) * pagesPerPage,
//     currentPage * pagesPerPage
//   );

//   const handlePrevious = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const handlePagesPerPageChange = (e) => {
//     setPagesPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>Commission</h2>
//           </div>
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <div className="d-flex flex-row-reverse">
//               <button
//                 className="btn btn-secondary"
//                 onClick={() => navigate("/super-admin/commission/create")}
//               >
//                 <i className="fa fa-plus"></i> Add Page
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="header d-flex justify-content-between align-items-center">
//               <div className="d-flex align-items-center mb-2 mb-md-0">
//                 <label className="mb-0 mr-2">Show</label>
//                 <select
//                   className="form-control form-control-sm"
//                   value={pagesPerPage}
//                   onChange={handlePagesPerPageChange}
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
//                 <input
//                   type="text"
//                   className="form-control form-control-sm"
//                   placeholder="Search"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   style={{ maxWidth: "150px" }}
//                 />
//               </div>
//             </div>

//             <div className="body">
//               <div className="table-responsive">
//                 <table className="table table-hover">
//                   <thead className="thead-dark">
//                     <tr>
//                       <th className="text-center">#</th>
//                       <th className="text-center">Heading</th>
//                       <th className="text-center">Articles Count</th>
//                       <th className="text-center">Status</th>
//                       <th className="text-center">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayedPages.map((page, index) => (
//                       <tr key={page._id}>
//                         <td className="text-center">
//                           {(currentPage - 1) * pagesPerPage + index + 1}
//                         </td>
//                         <td className="text-center">{page.webpageHeading || "-"}</td>
//                         <td className="text-center">{page.articles?.length || 0}</td>
//                         <td className="text-center">
//                           {page.status === "published" ? (
//                             <span className="badge badge-success">Published</span>
//                           ) : (
//                             <span className="badge badge-secondary">Draft</span>
//                           )}
//                         </td>
//                         <td className="text-center">
//                           <button
//                             className="btn btn-outline-info btn-sm mr-1"
//                             title="Edit"
//                             onClick={() =>
//                               navigate("/super-admin/commission/update", {
//                                 state: { page },
//                               })
//                             }
//                           >
//                             <i className="fa fa-pencil"></i>
//                           </button>
//                           <button
//                             className="btn btn-outline-danger btn-sm"
//                             title="Delete"
//                             onClick={() => openDeleteDialog(page)}
//                           >
//                             <i className="fa fa-trash-o"></i>
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="pagination d-flex justify-content-between mt-4">
//                 <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
//                   Showing{" "}
//                   {filteredPages.length === 0
//                     ? 0
//                     : (currentPage - 1) * pagesPerPage + 1}{" "}
//                   to {Math.min(currentPage * pagesPerPage, filteredPages.length)} of{" "}
//                   {filteredPages.length} entries
//                 </span>
//                 <ul className="pagination d-flex justify-content-end w-100">
//                   <li
//                     className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}
//                     onClick={handlePrevious}
//                   >
//                     <button className="page-link">Previous</button>
//                   </li>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
//                     <li
//                       key={pageNumber}
//                       className={`paginate_button page-item ${
//                         currentPage === pageNumber ? "active" : ""
//                       }`}
//                       onClick={() => setCurrentPage(pageNumber)}
//                     >
//                       <button className="page-link">{pageNumber}</button>
//                     </li>
//                   ))}
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

//       {isDeleteDialogOpen && (
//         <ConfirmationDialog
//           onClose={handleDeleteCancel}
//           deleteType={deleteType}
//           id={selectedPageToDelete?._id}
//           onDeleted={handleDeleteConfirmed}
//         />
//       )}
//     </div>
//   );
// };

// export default CommissionTable;






import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../api/getAPI";
import ConfirmationDialog from "../../ConfirmationDialog";
import axiosInstance from "../../../../api/axiosConfig";

const CommissionTable = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesPerPage, setPagesPerPage] = useState(10);
  const [deleteType, setDeleteType] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPageToDelete, setSelectedPageToDelete] = useState(null);
  const location = useLocation();


  const [isSEOModalOpen, setIsSEOModalOpen] = useState(false);
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: null,
    _id: null,
  });

  const fetchPages = async () => {
    try {
      const response = await getAPI("/api/commission");
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setPages(data);
    } catch (error) {
      console.error("Error fetching Commission pages:", error);
      toast.error(error.response?.data?.message || "Failed to fetch pages");
      setPages([]);
    }
  };

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/commission/getSEO");
      const meta = response.data?.data || null;
      if (meta) {
        setSeoData({
          metaTitle: meta.metaTitle || "",
          metaDescription: meta.metaDescription || "",
          metaKeywords: (meta.metaKeywords || []).join(", "),
          metaAuthor: meta.metaAuthor || "",
          metaImage: meta.metaImage || null,
          _id: meta._id || null,
        });
      }
    } catch (error) {
      console.error("Error fetching SEO metadata:", error);
    }
  };

  useEffect(() => {
    fetchPages();
    fetchSEOMetadata();
  }, []);

  useEffect(() => {
    if (location.state?.reload) {
      fetchPages();
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.reload]);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPageToDelete(null);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await axiosInstance.delete(`/api/commission/delete/${id}`);
      setPages((prevPages) => prevPages.filter((page) => page._id !== id));
      toast.success("Page deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete page.");
    } finally {
      handleDeleteCancel();
    }
  };

  const openDeleteDialog = (page) => {
    setSelectedPageToDelete(page);
    setIsDeleteDialogOpen(true);
    setDeleteType("commission");
  };

  const handleSEOChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "metaImage") {
      setSeoData((prev) => ({ ...prev, metaImage: files[0] }));
    } else {
      setSeoData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSEOModalClose = () => {
    setIsSEOModalOpen(false);
    setSeoData({
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      metaAuthor: "",
      metaImage: null,
      _id: null,
    });
    fetchSEOMetadata();
  };

  const handleSEOSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("metaTitle", seoData.metaTitle);
      formData.append("metaDescription", seoData.metaDescription);
      formData.append("metaKeywords", seoData.metaKeywords);
      formData.append("metaAuthor", seoData.metaAuthor);
      if (seoData.metaImage) formData.append("metaImage", seoData.metaImage);

      if (seoData._id) {
        await axiosInstance.put(`/api/commission/updateSEO/${seoData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("SEO metadata updated successfully.");
      } else {
        await axiosInstance.post("/api/commission/createSEO", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("SEO metadata created successfully.");
      }

      fetchSEOMetadata();
      setIsSEOModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save SEO.");
    }
  };

  const filteredPages = pages.filter((page) =>
    page.webpageHeading.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPages.length / pagesPerPage);
  const displayedPages = filteredPages.slice(
    (currentPage - 1) * pagesPerPage,
    currentPage * pagesPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePagesPerPageChange = (e) => {
    setPagesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Commission</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse gap-2">
              <button
                className="btn btn-warning mr-2" 
                onClick={() => setIsSEOModalOpen(true)}
              >
                <i className="fa fa-globe"></i> SEO Metadata
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/super-admin/commission/create")}
              >
                <i className="fa fa-plus"></i> Add Page
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={pagesPerPage}
                  onChange={handlePagesPerPageChange}
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
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ maxWidth: "150px" }}
                />
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Heading</th>
                      <th className="text-center">Articles Count</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedPages.map((page, index) => (
                      <tr key={page._id}>
                        <td className="text-center">
                          {(currentPage - 1) * pagesPerPage + index + 1}
                        </td>
                        <td className="text-center">{page.webpageHeading || "-"}</td>
                        <td className="text-center">{page.articles?.length || 0}</td>
                        <td className="text-center">
                          {page.status === "published" ? (
                            <span className="badge badge-success">Published</span>
                          ) : (
                            <span className="badge badge-secondary">Draft</span>
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-info btn-sm mr-1"
                            title="Edit"
                            onClick={() =>
                              navigate("/super-admin/commission/update", { state: { page } })
                            }
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            title="Delete"
                            onClick={() => openDeleteDialog(page)}
                          >
                            <i className="fa fa-trash-o"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing{" "}
                  {filteredPages.length === 0
                    ? 0
                    : (currentPage - 1) * pagesPerPage + 1}{" "}
                  to {Math.min(currentPage * pagesPerPage, filteredPages.length)} of{" "}
                  {filteredPages.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`paginate_button page-item ${currentPage === pageNumber ? "active" : ""
                        }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      <button className="page-link">{pageNumber}</button>
                    </li>
                  ))}
                  <li
                    className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""
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

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType={deleteType}
          id={selectedPageToDelete?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}


      {isSEOModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <h5>Commission SEO Metadata</h5>
              <div className="form-group">
                <label>Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={seoData.metaTitle}
                  onChange={handleSEOChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={seoData.metaDescription}
                  onChange={handleSEOChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Meta Keywords (comma separated)</label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={seoData.metaKeywords}
                  onChange={handleSEOChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Meta Author</label>
                <input
                  type="text"
                  name="metaAuthor"
                  value={seoData.metaAuthor}
                  onChange={handleSEOChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Meta Image</label>
                <input
                  type="file"
                  name="metaImage"
                  onChange={handleSEOChange}
                  className="form-control"
                />
                {/* {seoData.metaImage && (
                  <div className="mt-2">
                    <img
                      src={
                        typeof seoData.metaImage === "string"
                          ? seoData.metaImage
                          : URL.createObjectURL(seoData.metaImage)
                      }
                      alt="SEO Preview"
                      style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover" }}
                    />
                  </div>
                )} */}
                {seoData.metaImage && (
                  <div className="mt-2">
                    <img
                      src={
                        typeof seoData.metaImage === "string"
                         // ? seoData.metaImage
                         ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${seoData.metaImage}`
                          : URL.createObjectURL(seoData.metaImage)
                      }
                      alt="SEO Preview"
                      style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-secondary mr-2" onClick={handleSEOModalClose}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSEOSubmit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionTable;
