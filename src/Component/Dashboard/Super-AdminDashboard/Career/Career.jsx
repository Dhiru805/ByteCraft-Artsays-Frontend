import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from '../../../../api/getAPI';
// import ConfirmationDialog from '../../ConfirmationDialog';
import postAPI from '../../../../api/postAPI';
import ConfirmationDialog from '../../ConfirmationDialog';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Career = () => {
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [careersPerPage, setCareersPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCareerToDelete, setSelectedCareerToDelete] = useState(null);

  const fetchCareers = async () => {
    try {
      const response = await getAPI("/api/get-career");
      console.log("API Response:", response);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setCareers(data);
    } catch (error) {
      console.error("Error fetching careers:", error);
      setCareers([]);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCareerToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setCareers((prevCareers) => prevCareers.filter((career) => career._id !== id));
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (career) => {
    setSelectedCareerToDelete(career);
    setIsDeleteDialogOpen(true);
  };

  const filteredCareers = careers.filter((career) =>
    career.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.workMode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCareers.length / careersPerPage);
  const displayedCareers = filteredCareers.slice(
    (currentPage - 1) * careersPerPage,
    currentPage * careersPerPage
  );

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

  const handleCareersPerPageChange = (event) => {
    setCareersPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCareerForStatus, setSelectedCareerForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const openStatusModal = (career) => {
    setSelectedCareerForStatus(career);
    setNewStatus(career.status || "");
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedCareerForStatus(null);
    setNewStatus("");
  };

const handleStatusUpdate = async () => {
  if (!newStatus || !selectedCareerForStatus) return;

  try {
    const response = await postAPI(`/api/update-career-status/${selectedCareerForStatus._id}`, {
      status: newStatus,
    });

    if (response?.data?.hasError) {
      toast.error(response.data.message || "Failed to update status.");
    } else {
      toast.success("Status updated successfully!");
      await fetchCareers();
      closeStatusModal();
    }
  } catch (error) {
    console.error("Status update error:", error);
    toast.error("An error occurred while updating the status.");
  }
};

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Career</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate('/admin/dashboard')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Career</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate(`/super-admin/career/creer-job-post`)}
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
                  value={careersPerPage}
                  onChange={handleCareersPerPageChange}
                  style={{ minWidth: '70px' }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>
              <div className="w-100 w-md-auto d-flex justify-content-end">
                <div className="input-group" style={{ maxWidth: '150px' }}>
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
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  ></i>
                </div>
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Job Title</th>
                      <th>Department</th>
                      <th>Work Mode</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedCareers.map((career, index) => (
                      <tr key={career._id}>
                        <td>{(currentPage - 1) * careersPerPage + index + 1}</td>
                        <td>{career.jobTitle || '-'}</td>
                        <td>{career.department || '-'}</td>
                        <td>{career.workMode || '-'}</td>
                        <td>{career.status || '-'}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mr-1"
                            title="View"
                            onClick={() => navigate(`/super-admin/career/view-job-post`, { state: { career } })}
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-info btn-sm mr-2"
                            title="Edit"
                            onClick={() => navigate(`/super-admin/career/update-job-post`, { state: { career } })}
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-warning btn-sm mr-2"
                            title="Update Status"
                            onClick={() => openStatusModal(career)}
                          >
                            <i className="fa fa-refresh"></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            title="Delete"
                            onClick={() => openDeleteDialog(career)}
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
                  Showing {(filteredCareers.length === 0 ? 0 : (currentPage - 1) * careersPerPage + 1)} to {Math.min(currentPage * careersPerPage, filteredCareers.length)} of {filteredCareers.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`paginate_button page-item ${currentPage === pageNumber ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      <button className="page-link">{pageNumber}</button>
                    </li>
                  ))}
                  <li
                    className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`}
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
          deleteType="career"
          id={selectedCareerToDelete?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}

      {isStatusModalOpen && selectedCareerForStatus && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Job Status</h5>
                <button type="button" className="close" onClick={closeStatusModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Job Title:</strong> {selectedCareerForStatus.jobTitle}</p>
                <div className="form-group">
                  <label htmlFor="newStatus">Select New Status</label>
                  <select
                    id="newStatus"
                    className="form-control"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Paused">Paused</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeStatusModal}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleStatusUpdate}>Update Status</button>
              </div>
            </div>
          </div>
        </div>
      )}
<ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default Career;