import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../api/getAPI"
import ConfirmationDialog from '../../ConfirmationDialog';
import CreateAdminModal from "./Createmodal";
import { DEFAULT_PROFILE_IMAGE } from "../../../../Constants/ConstantsVariables";



function AdminManageTable() {
    const [admins, setAdmins] = useState([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedAdminToDelete, setSelectedAdminToDelete] = useState(null);
    const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(admins.length / itemsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };



    const fetchAdmins = async () => {
        try {
            const response = await getAPI("/api/getadmin", {}, true);
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false);
        setSelectedAdminToDelete(null);
    };

    const handleDeleteConfirmed = (id) => {
        setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
        setIsDeleteDialogOpen(false);
    };

    const openDeleteDialog = (admin) => {
        setSelectedAdminToDelete(admin);
        setIsDeleteDialogOpen(true);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="block-header">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <h2>Admin Management</h2>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                        <i className="fa fa-dashboard"></i>
                                    </span>
                                </li>
                                <li className="breadcrumb-item">Admin Management</li>
                            </ul>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="d-flex flex-row-reverse">
                                <button
                                    type="button"
                                    className="btn btn-secondary mr-2"
                                    onClick={() => setIsCreateAdminModalOpen(true)}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="header d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <label className="mb-0 mr-2">Show</label>
                                    <select
                                        name="DataTables_Table_0_length"
                                        aria-controls="DataTables_Table_0"
                                        className="form-control form-control-sm"
                                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                                        value={itemsPerPage}
                                    >
                                        <option value="10">5</option>
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                    <label className="mb-0 ml-2">entries</label>
                                </div>
                            </div>
                            <div className="body">
                                <div className="table-responsive">
                                    <table className="table table-hover js-basic-example dataTable table-custom m-b-0 c_list">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>User Role</th>
                                                {/* <th>Phone</th> */}
                                                <th>Phone</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {admins.length === 1 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No data available
                                                    </td>
                                                </tr>
                                            ) : (
                                                admins
                                                    .filter((admin) => admin.email !== localStorage.getItem("email") && admin.email !== "shantu131201@gmail.com")
                                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                    .map((admin, index) => (
                                                        <tr key={admin._id}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <img
                                                                    src={admin.profilePhoto ? `${BASE_URL}${admin.profilePhoto}` : DEFAULT_PROFILE_IMAGE}
                                                                    className="rounded-circle avatar"
                                                                    alt=""
                                                                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                                />
                                                                <p className="c_name">{admin.name} {admin.lastName}</p>
                                                            </td>
                                                            <td>{admin.email}</td>
                                                            <td>{admin.userrole}</td>
                                                            {/* <td>{admin.phone}</td> */}
                                                            <td>{admin.phone}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary btn-sm mr-2"
                                                                    title="View"
                                                                    onClick={() => navigate('/super-admin/admin/viewprofile', { state: { admin } })}
                                                                >
                                                                    <i className="fa fa-eye"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-info btn-sm mr-2"
                                                                    title="Edit"
                                                                    onClick={() => navigate('/super-admin/admin/editprofile', { state: { admin } })}
                                                                >
                                                                    <i className="fa fa-pencil"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    title="Delete"
                                                                    onClick={() => openDeleteDialog(admin)}
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
                                <div className="pagination d-flex justify-content-end mt-4">
                                    <ul className="pagination">
                                        <li
                                            className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`}
                                            onClick={handlePrevious}
                                        >
                                            <button className="page-link">Previous</button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, index) => index + 1)
                                            .filter((pageNumber) =>
                                                // pageNumber >= currentPage &&
                                                // pageNumber < currentPage + 3
                                                pageNumber === currentPage
                                            )
                                            .map((pageNumber) => (
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
            </div>

            {isDeleteDialogOpen && (
                <ConfirmationDialog
                    onClose={handleDeleteCancel}
                    deleteType="admin"
                    id={selectedAdminToDelete._id}
                    onDeleted={handleDeleteConfirmed}
                />
            )}

            {isCreateAdminModalOpen && (
                <CreateAdminModal onClose={() => setIsCreateAdminModalOpen(false)} fetchAdmins={fetchAdmins} />
            )}
        </>
    );
}

export default AdminManageTable;
