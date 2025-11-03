import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../api/getAPI";
import axiosInstance from "../../../../api/axiosConfig";
import ConfirmationDialog from "../../ConfirmationDialog";

const CertificationTable = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteType, setDeleteType] = useState("");
  const [pagesPerPage, setPagesPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPageToDelete, setSelectedPageToDelete] = useState(null);

  const fetchPages = async () => {
    try {
      const res = await getAPI("/api/certificate");
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setPages(data);
    } catch (err) {
      console.error("Error fetching certification pages:", err);
      toast.error(
        err.response?.data?.message || "Failed to fetch certification pages"
      );
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

  const filteredPages = pages.filter((p) =>
    (p.webpageHeading || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPages.length / pagesPerPage);
  const displayedPages = filteredPages.slice(
    (currentPage - 1) * pagesPerPage,
    currentPage * pagesPerPage
  );

  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const openDeleteDialog = (page) => {
    setSelectedPageToDelete(page);
    setIsDeleteDialogOpen(true);
    setDeleteType("certificateCMS");
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPageToDelete(null);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await axiosInstance.delete(`/api/certificate/delete/${id}`);
      setPages((prev) => prev.filter((p) => p._id !== id));
      toast.success("Certification page deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete page.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPageToDelete(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6">
            <h2>Certification Pages</h2>
          </div>
          <div className="col-lg-6">
            <div className="d-flex flex-row-reverse">
              <div className="page_action d-flex">
                <button
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate("/super-admin/certificate/create")}
                >
                  <i className="fa fa-plus"></i> Add Page
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
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <label className="mb-0 mr-2">Show</label>
                <select
                  className="form-control form-control-sm"
                  value={pagesPerPage}
                  onChange={(e) => {
                    setPagesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{ minWidth: "70px" }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
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
                  style={{ maxWidth: "180px" }}
                />
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover text-center">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Heading</th>
                      <th>Section1 Cards</th>
                      <th>Section2 Cards</th>
                      <th>Certificate Image</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedPages.map((page, idx) => (
                      <tr key={page._id}>
                        <td>{(currentPage - 1) * pagesPerPage + idx + 1}</td>
                        <td>{page.webpageHeading || "-"}</td>
                        <td>{page.section1?.cards?.length || 0}</td>
                        <td>{page.section2?.cards?.length || 0}</td>
                        <td>
                          {page.certificateSection?.image ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${page.certificateSection.image}`}
                              alt="cert"
                              style={{
                                width: 60,
                                height: 40,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {page.status === "published" ? (
                            <span className="badge badge-success">
                              Published
                            </span>
                          ) : (
                            <span className="badge badge-secondary">Draft</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-info btn-sm mr-1"
                            onClick={() =>
                              navigate("/super-admin/certificate/edit", {
                                state: { page },
                              })
                            }
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => openDeleteDialog(page)}
                          >
                            <i className="fa fa-trash-o"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {displayedPages.length === 0 && (
                      <tr>
                        <td colSpan={7}>No pages found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination d-flex justify-content-between mt-4">
                <span>
                  Showing{" "}
                  {filteredPages.length === 0
                    ? 0
                    : (currentPage - 1) * pagesPerPage + 1}{" "}
                  to{" "}
                  {Math.min(currentPage * pagesPerPage, filteredPages.length)}{" "}
                  of {filteredPages.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`page-item ${
                          currentPage === pageNumber ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        <button className="page-link">{pageNumber}</button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${
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

export default CertificationTable;
