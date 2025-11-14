import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../api/getAPI";
import ConfirmationDialog from "../../ConfirmationDialog";

const ExhibitionTable = () => {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [exhibitionsPerPage, setExhibitionsPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExhibitionToDelete, setSelectedExhibitionToDelete] = useState(null);

  const fetchExhibitions = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User Id not found. Please log in again.");
        return;
      }

      const response = await getAPI(`/api/get-exhibition-userId/${userId}`);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setExhibitions(data);
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
      toast.error(error.response?.data?.message || "Failed to fetch exhibitions");
      setExhibitions([]);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedExhibitionToDelete(null);
  };

  const handleDeleteConfirmed = (id) => {
    setExhibitions((prevExhibitions) => prevExhibitions.filter((exhibition) => exhibition._id !== id));
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (exhibition) => {
    setSelectedExhibitionToDelete(exhibition);
    setIsDeleteDialogOpen(true);
  };

  const filteredExhibitions = exhibitions.filter(
    (exhibition) =>
      exhibition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibition.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibition.hostedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExhibitions.length / exhibitionsPerPage);
  const displayedExhibitions = filteredExhibitions.slice(
    (currentPage - 1) * exhibitionsPerPage,
    currentPage * exhibitionsPerPage
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

  const handleExhibitionsPerPageChange = (event) => {
    setExhibitionsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Exhibitions</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/artist/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Exhibitions</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate("/artist/exhibition/create-exhibition")}
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
                  value={exhibitionsPerPage}
                  onChange={handleExhibitionsPerPageChange}
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
                <div className="input-group" style={{ maxWidth: "150px" }}>
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
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
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
                      <th>Type</th>
                      <th>Hosted By</th>
                      <th>Start Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedExhibitions.map((exhibition, index) => (
                      <tr key={exhibition._id}>
                        <td>{(currentPage - 1) * exhibitionsPerPage + index + 1}</td>
                        <td>{exhibition.title || "-"}</td>
                        <td>{exhibition.type || "-"}</td>
                        <td>{exhibition.hostedBy || "-"}</td>
                        <td>{new Date(exhibition.startDate).toLocaleDateString() || "-"}</td>
                        <td>
                          <button className={`btn btn-sm  ${exhibition.status === 'Pending' ? 'btn-outline-warning' : exhibition.status === 'Approved' ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                            {exhibition.status}
                          </button>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mr-1"
                            title="View"
                            onClick={() =>
                              navigate(`/artist/exhibition/view-exhibition`, { state: { exhibition } })
                            }
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                          {exhibition.status !== "Approved" && exhibition.status !== "Rejected" && (

                            <>
                              <button
                                type="button"
                                className="btn btn-outline-info btn-sm mr-2"
                                title="Edit"
                                onClick={() =>
                                  navigate(`/artist/exhibition/update-exhibition`, { state: { exhibition } })
                                }
                              >
                                <i className="fa fa-pencil"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                title="Delete"
                                onClick={() => openDeleteDialog(exhibition)}
                              >
                                <i className="fa fa-trash-o"></i>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination d-flex justify-content-between mt-4">
                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                  Showing{" "}
                  {filteredExhibitions.length === 0
                    ? 0
                    : (currentPage - 1) * exhibitionsPerPage + 1}{" "}
                  to {Math.min(currentPage * exhibitionsPerPage, filteredExhibitions.length)} of{" "}
                  {filteredExhibitions.length} entries
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
          deleteType="exhibition"
          id={selectedExhibitionToDelete?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
};

export default ExhibitionTable;