import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import getAPI from "../../../../api/getAPI";
import ConfirmationDialog from "../../ConfirmationDialog";
import deleteAPI from "../../../../api/deleteAPI";
import { toast } from "react-toastify";
import axios from "axios";

function Celebrities() {

    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState("")
    const [celebratiesPerPage, setCelebratiesPerPage] = useState(10)
    const [celebratiesData, setCelebratiesData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedCelebrityToDelete, setSelectedCelebrityToDelete] = useState(null)

    const handleCelebratiesPerPage = (e) => {
        setCelebratiesPerPage(Number(e.target.value))
        setCurrentPage(1)
    };

    // Fetching celebrities data
    const fetchCelebratiesData = async () => {
        try {
            const response = await getAPI("/api/celebrities")

            if (response?.hasError === false) {
                console.log(response)
                setCelebratiesData(response?.data?.data || [])
            }
            else {
                console.log(response)
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchCelebratiesData()
    }, []);

    // Handle filter celebrities
    const filterCelebrities = celebratiesData.filter(celebrity =>
        celebrity.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        celebrity.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        celebrity.yearsActiveInArt.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filterCelebrities.length / celebratiesPerPage);
    const displayedCelebrities = filterCelebrities.slice(
        (currentPage - 1) * celebratiesPerPage,
        currentPage * celebratiesPerPage
    )

    // Handle previous page button
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    };

    // Handle next page button
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    };

    // Handle to open delete modal
    const openDeleteDialog = (celebrity) => {
        setSelectedCelebrityToDelete(celebrity);
        setIsDeleteDialogOpen(true);
    };

    // Handle to close delete modal
    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false);
        setSelectedCelebrityToDelete(null);
    };

    // confirm delete (call API + update UI)
    const handleDeleteConfirmed = async (id) => {
        try {
            const response = await axios.delete(`/api/remove-celebrity/${id}`);
            if(response?.hasError === false){
                toast.success(response.message)
                fetchCelebratiesData()
            }
            else {
                console.log(response)
            }
            // setCelebratiesData((prev) => prev.filter((celebrity) => celebrity._id !== id));
        } catch (error) {
            if(error?.status == 404){
                toast.error(error?.response?.data?.message)
            }
            console.error("Error deleting celebrity:", error);
        }
        setIsDeleteDialogOpen(false);
        setSelectedCelebrityToDelete(null);
    };

    return (
        <div className="container-fluid">

            {/* Header */}
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Celebrities</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span
                                    onClick={() => navigate("/super-admin/dashboard")}
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Celebrities</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex flex-row-reverse">
                            <div className="page_action">
                                <button
                                    type="button"
                                    className="btn btn-secondary mr-2"
                                    onClick={() => navigate("/super-admin/celebrities/create")}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* */}
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">

                        {/* Recodrs per page & Search functionality */}
                        <div className="header d-flex justify-content-between align-items-center">
                            <div className="d-none d-md-flex align-items-center mb-2 mb-md-0">
                                <label className="mb-0 mr-2">Show</label>
                                <select
                                    className="form-control form-control-sm"
                                    value={celebratiesPerPage}
                                    onChange={handleCelebratiesPerPage}
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

                        {/* Celebraties data */}
                        <div className="body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Profession</th>
                                            <th>Experience</th>
                                            <th>ArtWorks</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterCelebrities.length > 0 ? (
                                            displayedCelebrities.map((celebrity, index) => (
                                                <tr key={celebrity._id}>
                                                    <td>{(currentPage - 1) * celebratiesPerPage + index + 1}</td>
                                                    <td>{celebrity.artistName}</td>
                                                    <td>{celebrity.profession}</td>
                                                    <td>{celebrity.yearsActiveInArt}</td>
                                                    <td>{celebrity.artWorkCollected}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm"
                                                            title="View"
                                                            onClick={() => navigate("/super-admin/celebrities/view-celebrity", { state: { celebrity } })}
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-info btn-sm mx-2"
                                                            title="Edit"
                                                            onClick={() => navigate("/super-admin/celebrities/update-celebrity", { state: { celebrity } })}
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm"
                                                            title="Delete"
                                                            onClick={() => openDeleteDialog(celebrity)}
                                                        >
                                                            <i className="fa fa-trash-o"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>No Celebrities found</tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="pagination d-flex justify-content-between mt-4">

                                {/* Left side content */}
                                <span className="d-none d-sm-inline-block text-truncate w-100 mx-1">
                                    Showing {(filterCelebrities.length === 0 ? 0 : (currentPage - 1) * celebratiesPerPage + 1)} to {Math.min(currentPage * celebratiesPerPage, filterCelebrities.length)} of {filterCelebrities.length} entries
                                </span>

                                {/* Previous & Next buttons */}
                                <ul className="pagination d-flex justify-content-end w-100">
                                    <li
                                        className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}
                                        onClick={handlePreviousPage}
                                    >
                                        <button className="page-link">Previous</button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                                        <li
                                            key={pageNum}
                                            className={`paginate_button page-item ${currentPage === pageNum ? "active" : ""}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            <button className="page-link">{pageNum}</button>
                                        </li>
                                    ))}
                                    <li
                                        className={`paginate_button page-item ${currentPage === totalPages ? "disabled" : ""}`}
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

            {/* Delete Confirmation Modal */}
            {isDeleteDialogOpen && (
                <ConfirmationDialog
                    onClose={handleDeleteCancel}
                    deleteType="celebrity"
                    id={selectedCelebrityToDelete?._id}
                    onDeleted={handleDeleteConfirmed}
                />
            )}

        </div>
    )
}

export default Celebrities;