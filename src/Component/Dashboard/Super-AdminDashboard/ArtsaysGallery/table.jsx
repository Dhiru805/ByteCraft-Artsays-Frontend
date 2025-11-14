import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import getAPI from "../../../../api/getAPI";
import deleteAPI from "../../../../api/deleteAPI";
import ConfirmationDialog from "../../ConfirmationDialog";
import { toast } from "react-toastify";

function Curations() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [curationsPerPage, setCurationsPerPage] = useState(10);
  const [curationsData, setCurationsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
 const [deleteType, setDeleteType] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCurationToDelete, setSelectedCurationToDelete] = useState(null);

  const fetchCurationsData = async () => {
    try {
      const response = await getAPI("/api/artsays-gallery");
      if (response?.hasError === false) {
        setCurationsData(response?.data?.data || []);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurationsData();
  }, []);

  const filteredCurations = curationsData.filter(
    (curation) =>
      curation.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curation.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curation.curator?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCurations.length / curationsPerPage);
  const displayedCurations = filteredCurations.slice(
    (currentPage - 1) * curationsPerPage,
    currentPage * curationsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCurationsPerPage = (e) => {
    setCurationsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const openDeleteDialog = (curation) => {
    setSelectedCurationToDelete(curation);
    setIsDeleteDialogOpen(true);
    setDeleteType("artsaysgallery");
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCurationToDelete(null);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      const response = await deleteAPI(`/api/artsays-gallery/delete/${id}`);
      if (response?.hasError === false) {
        toast.success(response?.message || "Deleted successfully");
        fetchCurationsData();
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Deleting ");
    }
    setIsDeleteDialogOpen(false);
    setSelectedCurationToDelete(null);
  };

  return (
    <div className="container-fluid">
     
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Art Gallery</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Art Gallery</li>
            </ul>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate("/super-admin/art-gallery/create")}
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
                  value={curationsPerPage}
                  onChange={handleCurationsPerPage}
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
                <div className="input-group" style={{ maxWidth: "180px" }}>
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
                      pointerEvents: "none",
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
                      <th>Name</th>
                      <th>Type</th>
                      <th>Curator</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCurations.length > 0 ? (
                      displayedCurations.map((curation, index) => (
                        <tr key={curation._id}>
                          <td>
                            {(currentPage - 1) * curationsPerPage + index + 1}
                          </td>
                          <td>{curation.userName}</td>
                          <td>{curation.type}</td>
                          <td>{curation.curator}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mx-1"
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  `/super-admin/art-gallery/update/${curation._id}`
                                )
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => openDeleteDialog(curation)}
                            >
                              <i className="fa fa-trash-o"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No Curations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination d-flex justify-content-between mt-4">
                <span className="d-none d-sm-inline-block text-truncate w-100 mx-1">
                  Showing{" "}
                  {filteredCurations.length === 0
                    ? 0
                    : (currentPage - 1) * curationsPerPage + 1}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * curationsPerPage,
                    filteredCurations.length
                  )}{" "}
                  of {filteredCurations.length} entries
                </span>

                <ul className="pagination d-flex justify-content-end w-100">
                  <li
                    className={`paginate_button page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={handlePreviousPage}
                  >
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNum) => (
                      <li
                        key={pageNum}
                        className={`paginate_button page-item ${
                          currentPage === pageNum ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        <button className="page-link">{pageNum}</button>
                      </li>
                    )
                  )}
                  <li
                    className={`paginate_button page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                    onClick={handleNextPage}
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
          id={selectedCurationToDelete?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}

export default Curations;
