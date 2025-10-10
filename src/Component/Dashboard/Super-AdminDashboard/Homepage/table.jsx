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

  useEffect(() => {
    fetchPages();
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

  return (
    <div className="container-fluid">
      <div className="block-header d-flex justify-content-between align-items-center">
        <h2>Homepages</h2>
        {/* <button
          className="btn btn-secondary"
          onClick={() => navigate("/super-admin/homepage/create")}
        >
          <i className="fa fa-plus"></i> Create / Edit Homepage
        </button> */}
      </div>

      <div className="row clearfix mt-3">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              {pages && pages.length ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="thead-dark">
                      <tr>
                        <th className="text-center">#</th>
                        <th className="text-center">Title</th>
                        <th className="text-center">Status</th>
                        {/* <th className="text-center">Created</th>
                        <th className="text-center">Updated</th> */}
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pages.map((p, idx) => (
                        <tr key={p._id || idx}>
                          <td className="text-center">{idx + 1}</td>
                          <td className="text-center">{p.title || "-"}</td>
                          <td className="text-center ">{p.status === "published" ? (
                            <span className="badge badge-success">Published</span>
                          ) : (
                            <span className="badge badge-danger">Draft</span>
                          )}</td>
                          {/* <td className="text-center">{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                          <td className="text-center">{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-"}</td> */}
                          <td className="text-center">
                            <button
                              className="btn btn-outline-info btn-sm mr-1"
                              title="Open Sections"
                              onClick={() => navigate("/super-admin/homepage/create", { state: { homepageId: p._id, reload: true } })}
                            >
                              <i className="fa fa-pencil"></i>
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
    </div>
  );
};

export default HomepageSectionsTable;
