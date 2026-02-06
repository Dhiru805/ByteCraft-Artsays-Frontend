import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import getAPI from "../../../../api/getAPI";
import axiosInstance from "../../../../api/axiosConfig";
import ConfirmationDialog from "../../ConfirmationDialog";
import ProductRequestSkeleton from "../../../Skeleton/artist/ProductRequestSkeleton";

const NewsletterTable = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteSubscriber, setDeleteSubscriber] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      const response = await getAPI("/api/newsletter");
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setSubscribers(data);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error(error.response?.data?.message || "Failed to fetch subscribers");
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDeleteConfirmed = (id) => {
    setSubscribers(prev => prev.filter(sub => sub._id !== id));
    setIsDeleteDialogOpen(false);
    setDeleteSubscriber(null);
  };

  const openDeleteDialog = (subscriber) => {
    setDeleteSubscriber(subscriber);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteSubscriber(null);
  };

  const filtered = subscribers.filter(s =>
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const displayed = filtered.slice(startIndex, startIndex + perPage);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  if (loading) return <ProductRequestSkeleton />;

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Newsletter Subscribers</h2>
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
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <label className="mb-0 ml-2">entries</label>
              </div>

              <div className="w-100 w-md-auto d-flex justify-content-end">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search by email"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ maxWidth: "200px" }}
                />
              </div>
            </div>

            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>#</th>
                      <th>Email</th>
                      <th>Subscribed At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center">No subscribers found.</td>
                      </tr>
                    ) : (
                      displayed.map((sub, index) => (
                        <tr key={sub._id}>
                          <td>{startIndex + index + 1}</td>
                          <td>{sub.email || "-"}</td>
                          <td>{formatDate(sub.createdAt)}</td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => openDeleteDialog(sub)}
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
                  Showing {filtered.length === 0 ? 0 : startIndex + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} entries
                </span>

                <ul className="pagination d-flex justify-content-end w-100">
                  <li className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                    <button className="page-link">Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <li key={pageNumber} className={`paginate_button page-item ${currentPage === pageNumber ? "active" : ""}`} onClick={() => setCurrentPage(pageNumber)}>
                      <button className="page-link">{pageNumber}</button>
                    </li>
                  ))}
                  <li className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""}`} onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
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
          deleteType="newsletter subscriber"
          id={deleteSubscriber?._id}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </div>
  );
};

export default NewsletterTable;
