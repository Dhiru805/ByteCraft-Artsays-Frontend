
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import getAPI from "../../../../api/getAPI";
import axiosInstance from "../../../../api/axiosConfig";
import ConfirmationDialog from "../../ConfirmationDialog";

const EnquiryTable = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteType, setDeleteType] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const location = useLocation();

  const fetchEnquiries = async () => {
    try {
      const response = await getAPI("/api/enquiry");
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setEnquiries(data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error(error.response?.data?.message || "Failed to fetch enquiries");
      setEnquiries([]);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    if (location.state?.reload) {
      fetchEnquiries();
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.reload]);

  const handleDeleteConfirmed = async (id) => {
    try {
      await axiosInstance.delete(`/api/enquiry/delete/${id}`);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
      toast.success("Enquiry deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete enquiry.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedEnquiry(null);
    }
  };

  const openDeleteDialog = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDeleteDialogOpen(true);
    setDeleteType("enquiry");
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedEnquiry(null);
  };

  const filtered = enquiries.filter((e) =>
    e.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const displayed = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="container-fluid">

      <div className={selectedEnquiry ? "blur-background" : ""}>
        <div className="block-header">
          <h2>Enquiries</h2>
        </div>

        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center mb-2 mb-md-0">
                  <label className="mb-0 mr-2">Show</label>
                  <select
                    className="form-control form-control-sm"
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
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
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              </div>

              <div className="body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="thead-dark">
                      <tr>
                        <th className="text-center">#</th>
                        <th className="text-center">Name</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Contact Number</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.map((enquiry, index) => (
                        <tr key={enquiry._id}>
                          <td className="text-center">{(currentPage - 1) * perPage + index + 1}</td>
                          <td className="text-center">{enquiry.name || "-"}</td>
                          <td className="text-center">{enquiry.email || "-"}</td>
                          <td className="text-center">{enquiry.contactNumber || "-"}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-outline-info btn-sm mr-1"
                              title="View"
                              onClick={() => setSelectedEnquiry(enquiry)}
                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => openDeleteDialog(enquiry)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {displayed.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No enquiries found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

          
                <div className="pagination d-flex justify-content-between mt-4">
                  <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                    Showing{" "}
                    {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}{" "}
                    to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} entries
                  </span>
                  <ul className="pagination d-flex justify-content-end w-100">
                    <li
                      className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    >
                      <button className="page-link">Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`paginate_button page-item ${currentPage === pageNumber ? "active" : ""}`}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        <button className="page-link">{pageNumber}</button>
                      </li>
                    ))}
                    <li
                      className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""}`}
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
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

      {selectedEnquiry && (
        <div className="modal show d-block" tabIndex="-1" role="dialog"  style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enquiry Details</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {selectedEnquiry.name}</p>
                <p><strong>Email:</strong> {selectedEnquiry.email}</p>
                <p><strong>Contact Number:</strong> {selectedEnquiry.contactNumber}</p>
                <p><strong>Category:</strong> {selectedEnquiry.categoryName || "-"}</p>
                <p><strong>Message:</strong> {selectedEnquiry.message}</p>
                <p><strong>Received At:</strong> {new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          onClose={handleDeleteCancel}
          deleteType={deleteType}
          id={selectedEnquiry?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
};

export default EnquiryTable;
