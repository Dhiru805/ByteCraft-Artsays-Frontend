import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../api/getAPI";
import ConfirmationDialog from "../../ConfirmationDialog";
import axiosInstance from "../../../../api/axiosConfig";

const AboutUsTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [aboutUsPages, setAboutUsPages] = useState([]);
  const [deleteType, setDeleteType] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPageToDelete, setSelectedPageToDelete] = useState(null);

  const fetchAboutUsPage = async () => {
    try {
      const response = await getAPI("/api/about-us");
      const pages = Array.isArray(response.data.data) ? response.data.data : [];
      setAboutUsPages(pages);
    } catch (error) {
      console.error("Error fetching About Us page:", error);
      toast.error(error.response?.data?.message || "Failed to fetch About Us page");
      setAboutUsPages([]);
    }
  };

  useEffect(() => {
    fetchAboutUsPage();
  }, []);

  useEffect(() => {
    if (location.state?.reload) {
      fetchAboutUsPage();
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.reload]);

  const openDeleteDialog = (page) => {
    setSelectedPageToDelete(page);
    setIsDeleteDialogOpen(true);
    setDeleteType("aboutus");
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPageToDelete(null);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await axiosInstance.delete(`/api/about-us/delete/${id}`);
      setAboutUsPages((prev) => (Array.isArray(prev) ? prev.filter((p) => p?._id !== id) : []));
 
      fetchAboutUsPage();
      toast.success("About Us page deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete page.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPageToDelete(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header d-flex justify-content-between align-items-center">
        <h2>About Us Page</h2>
        {/* <button
          className="btn btn-secondary"
          onClick={() => navigate("/super-admin/about-us/create")}
        >
          <i className="fa fa-plus"></i>  Create / Edit Page
        </button> */}
      </div>

      <div className="row clearfix mt-3">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              {aboutUsPages && aboutUsPages.length ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="thead-dark">
                      <tr>
                        <th className="text-center">#</th>
                        <th className="text-center">Title</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aboutUsPages.map((page, idx) => (
                        <tr key={page._id || idx}>
                          <td className="text-center">{idx + 1}</td>
                          <td className="text-center">{page.title || "-"}</td>
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
                                navigate("/super-admin/about-us/create", {
                                  state: { page },
                                })
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            {/* <button
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => openDeleteDialog(page)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center my-3">No About Us page created yet.</p>
              )}
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
    </div>
  );
};

export default AboutUsTable;

