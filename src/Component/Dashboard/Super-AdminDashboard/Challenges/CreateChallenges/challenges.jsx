import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import { toast } from "react-toastify";
import ConfirmationDialog from '../../../ConfirmationDialog';

const ChallengesTable = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteType, setDeleteType] = useState("");
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChallengeToDelete, setSelectedChallengeToDelete] = useState(null);

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredChallenges.length / productsPerPage);
  const displayedChallenges = filteredChallenges.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedChallengeToDelete(null);
  };

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await getAPI("/api/getchallengedata");
      console.log(data)
      if (!data.hasError) {
        setChallenges(data.data?.challenges || []);
      } else {
        setError(data.message || "Failed to load challenges.");
        toast.error(data.message || "Failed to load challenges.");
      }
    } catch (error) {
      setError("An error occurred while fetching challenges.");
      toast.error("An error occurred while fetching challenges.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      const response = await getAPI(`/api/deleteChallenge/${id}`, { method: 'DELETE' });

      if (!response.hasError) {
        fetchChallenges();
        toast.success('Challenge deleted successfully!');
      } else {
        toast.error(response.message || 'Failed to delete challenge.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the challenge.');
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedChallengeToDelete(null);
    }
  };

  const openDeleteDialog = (challenge) => {
    setSelectedChallengeToDelete(challenge);
    setIsDeleteDialogOpen(true);
    setDeleteType("challenge");
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Challenges</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Challenges</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate("/super-admin/challenges/create-Challenge")}
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
                  value={productsPerPage}
                  onChange={handleProductsPerPageChange}
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
                      <th>Title</th>
                      <th>Theme</th>
                      <th>Entry Fee</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Deadline</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="9" className="text-center text-danger">
                          {error}
                        </td>
                      </tr>
                    ) : filteredChallenges.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No challenges found.
                        </td>
                      </tr>
                    ) : (
                      displayedChallenges.map((challenge, index) => (
                        <tr key={challenge._id}>
                          <td>{index + 1}</td>
                          <td>{challenge.title || "-"}</td>
                          <td>{challenge.type || "-"}</td>
                          <td>{challenge.entryFee || "-"}</td>
                          <td>
                            {challenge.startDate
                              ? new Date(challenge.startDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>
                            {challenge.endDate
                              ? new Date(challenge.endDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>
                            {challenge.submissionDeadline
                              ? new Date(challenge.submissionDeadline).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>{challenge.status || "-"}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm mr-1"
                              title="View"
                              onClick={() => {
                                navigate("/super-admin/challenges/view-challenge", {
                                  state: { id: challenge._id },
                                });
                              }}

                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mr-2"
                              title="Edit"
                              onClick={() => {
                                navigate("/super-admin/challenges/update-challenge", {
                                  state: { id: challenge._id },
                                });
                              }}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => openDeleteDialog(challenge)}
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
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing{" "}
                  {(filteredChallenges.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1)} to{" "}
                  {Math.min(currentPage * productsPerPage, filteredChallenges.length)} of{" "}
                  {filteredChallenges.length} entries
                </span>
                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={handlePrevious}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
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
          id={selectedChallengeToDelete?._id}
          //onDeleted={() => fetchChallenges()}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
};

export default ChallengesTable;
