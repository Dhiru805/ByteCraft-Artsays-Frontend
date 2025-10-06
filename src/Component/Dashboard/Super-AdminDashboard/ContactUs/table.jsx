
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../api/getAPI";
import ConfirmationDialog from "../../ConfirmationDialog";
import axiosInstance from "../../../../api/axiosConfig";

const ContactUsTable = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesPerPage, setPagesPerPage] = useState(10);
  const [deleteType, setDeleteType] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPageToDelete, setSelectedPageToDelete] = useState(null);
  const location = useLocation();

  const fetchPages = async () => {
    try {
      const response = await getAPI("/api/contactus");
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setPages(data);
    } catch (error) {
      console.error("Error fetching Contact Us pages:", error);
      toast.error(error.response?.data?.message || "Failed to fetch pages");
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

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPageToDelete(null);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await axiosInstance.delete(`/api/contactus/delete/${id}`);
      setPages((prevPages) => prevPages.filter((page) => page._id !== id));
      toast.success("Page deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete page.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPageToDelete(null);
    }
  };

  const openDeleteDialog = (page) => {
    setSelectedPageToDelete(page);
    setIsDeleteDialogOpen(true);
    setDeleteType("contactus");
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
            <h2>Contact Us Pages</h2>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/super-admin/contactus/create")}
              >
                <i className="fa fa-plus"></i> Create
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
                      <th className="text-center">Cards Count</th>
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
                        <td className="text-center">{page.cards?.length || 0}</td>
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
                              navigate("/super-admin/contactus/update", {
                                state: { page },
                              })
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
                    className={`paginate_button page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`paginate_button page-item ${
                        currentPage === pageNumber ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      <button className="page-link">{pageNumber}</button>
                    </li>
                  ))}
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

export default ContactUsTable;
