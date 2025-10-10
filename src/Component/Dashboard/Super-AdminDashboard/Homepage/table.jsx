// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import getAPI from "../../../../api/getAPI";
// import ConfirmationDialog from "../../ConfirmationDialog";
// import axiosInstance from "../../../../api/axiosConfig";

// const HomepageSectionsTable = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [pages, setPages] = useState([]);
//   const [deleteType, setDeleteType] = useState("");
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedSectionToDelete, setSelectedSectionToDelete] = useState(null);

//   const fetchPages = async () => {
//     try {
//       const response = await getAPI("/api/homepage");
//       const data = Array.isArray(response.data?.data) ? response.data.data : [];
//       setPages(data);
//     } catch (error) {
//       console.error("Error fetching homepages:", error);
//       toast.error(error.response?.data?.message || "Failed to fetch homepages");
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

//   const openDeleteDialog = (section) => {
//     setSelectedSectionToDelete(section);
//     setIsDeleteDialogOpen(true);
//     setDeleteType("homepageSection");
//   };

//   const handleDeleteCancel = () => {
//     setIsDeleteDialogOpen(false);
//     setSelectedSectionToDelete(null);
//   };

//   const handleDeleteConfirmed = async (id) => {
//     try {
//       await axiosInstance.delete(`/api/homepage/section/delete/${id}`);
//       fetchPages();
//       toast.success("Section deleted successfully!");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to delete section.");
//     } finally {
//       setIsDeleteDialogOpen(false);
//       setSelectedSectionToDelete(null);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header d-flex justify-content-between align-items-center">
//         <h2>Homepages</h2>
//         {/* <button
//           className="btn btn-secondary"
//           onClick={() => navigate("/super-admin/homepage/create")}
//         >
//           <i className="fa fa-plus"></i> Create / Edit Homepage
//         </button> */}
//       </div>

//       <div className="row clearfix mt-3">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="body">
//               {pages && pages.length ? (
//                 <div className="table-responsive">
//                   <table className="table table-hover">
//                     <thead className="thead-dark">
//                       <tr>
//                         <th className="text-center">#</th>
//                         <th className="text-center">Title</th>
//                         <th className="text-center">Status</th>
//                         {/* <th className="text-center">Created</th>
//                         <th className="text-center">Updated</th> */}
//                         <th className="text-center">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {pages.map((p, idx) => (
//                         <tr key={p._id || idx}>
//                           <td className="text-center">{idx + 1}</td>
//                           <td className="text-center">{p.title || "-"}</td>
//                           <td className="text-center ">{p.status === "published" ? (
//                             <span className="badge badge-success">Published</span>
//                           ) : (
//                             <span className="badge badge-danger">Draft</span>
//                           )}</td>
//                           {/* <td className="text-center">{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
//                           <td className="text-center">{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-"}</td> */}
//                           <td className="text-center">
//                             <button
//                               className="btn btn-outline-info btn-sm mr-1"
//                               title="Open Sections"
//                               onClick={() => navigate("/super-admin/homepage/create", { state: { homepageId: p._id, reload: true } })}
//                             >
//                               <i className="fa fa-pencil"></i>
//                             </button>
//                             <button
//                               className="btn btn-outline-danger btn-sm"
//                               title="Delete"
//                               onClick={() => openDeleteDialog(p)}
//                             >
//                               <i className="fa fa-trash-o"></i>
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p className="text-center my-3">No homepages found.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {isDeleteDialogOpen && (
//         <ConfirmationDialog
//           onClose={handleDeleteCancel}
//           deleteType={deleteType}
//           id={selectedSectionToDelete?._id}
//           onDeleted={handleDeleteConfirmed}
//         />
//       )}
//     </div>
//   );
// };

// export default HomepageSectionsTable;









import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../api/getAPI";
import ConfirmationDialog from "../../ConfirmationDialog";
import axiosInstance from "../../../../api/axiosConfig";

const HomepageSectionsTable = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [pages, setPages] = useState([]);
  const [deleteType, setDeleteType] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSectionToDelete, setSelectedSectionToDelete] = useState(null);

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
      const response = await getAPI("/api/homepage");
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setPages(data);
    } catch (error) {
      console.error("Error fetching homepages:", error);
      toast.error(error.response?.data?.message || "Failed to fetch homepages");
      setPages([]);
    }
  };

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/homepage/getSEO");
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

  const openDeleteDialog = (section) => {
    setSelectedSectionToDelete(section);
    setIsDeleteDialogOpen(true);
    setDeleteType("homepageSection");
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedSectionToDelete(null);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await axiosInstance.delete(`/api/homepage/section/delete/${id}`);
      fetchPages();
      toast.success("Section deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete section.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedSectionToDelete(null);
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

  const handleSEOChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "metaImage") {
      setSeoData((prev) => ({ ...prev, metaImage: files[0] }));
    } else {
      setSeoData((prev) => ({ ...prev, [name]: value }));
    }
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
        await axiosInstance.put(`/api/homepage/updateSEO/${seoData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("SEO metadata updated successfully.");
      } else {
        await axiosInstance.post("/api/homepage/createSEO", formData, {
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

  return (
    <div className="container-fluid">
      <div className="block-header d-flex justify-content-between align-items-center">
        <h2>Homepages</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-warning" onClick={() => setIsSEOModalOpen(true)}>
            <i className="fa fa-globe"></i> SEO Metadata
          </button>
        </div>
      </div>

      <div className="row clearfix mt-3">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              {pages && pages.length ? (
                <div className="table-responsive">
                  <table className="table table-hover text-center">
                    <thead className="thead-dark">
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pages.map((p, idx) => (
                        <tr key={p._id || idx}>
                          <td>{idx + 1}</td>
                          <td>{p.title || "-"}</td>
                          <td>
                            {p.status === "published" ? (
                              <span className="badge badge-success">Published</span>
                            ) : (
                              <span className="badge badge-danger">Draft</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-info btn-sm mr-1"
                              title="Open Sections"
                              onClick={() =>
                                navigate("/super-admin/homepage/create", { state: { homepageId: p._id, reload: true } })
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => openDeleteDialog(p)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center my-3">No homepages found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType={deleteType}
          id={selectedSectionToDelete?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      {isSEOModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <h5>Homepage SEO Metadata</h5>
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
                      src={typeof seoData.metaImage === "string" ? seoData.metaImage : URL.createObjectURL(seoData.metaImage)}
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

export default HomepageSectionsTable;
