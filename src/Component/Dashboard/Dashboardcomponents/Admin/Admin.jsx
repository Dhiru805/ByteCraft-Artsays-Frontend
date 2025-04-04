import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationDialog from '../ConfirmationDialog';
import CreateAdminModal from "./Createmodal";
import useUserType from '../urlconfig';

function AdminManageTable() {
    const [admins, setAdmins] = useState([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedAdminToDelete, setSelectedAdminToDelete] = useState(null);
    const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
    const BASE_URL = 'http://localhost:3001';
    const navigate = useNavigate();
    const userType = useUserType();

    const fetchAdmins = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/getadmin");
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
                                    <a href="index.html">
                                        <i className="fa fa-dashboard"></i>
                                    </a>
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
                                <h2>Admin List</h2>
                                <div className="d-flex">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Search"
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-sm btn-outline-secondary">
                                                <i className="fa fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
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
                                                <th>Phone</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {admins
                                                .filter((admin) => admin.email !== localStorage.getItem("email") || admin.email !== "superadmin@admin.com")
                                                .map((admin, index) => (
                                                    <tr key={admin._id}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img
                                                                src={admin.profilePhoto ? `${BASE_URL}${admin.profilePhoto}` : 'DashboardAssets/assets/images/user.png'}
                                                                className="rounded-circle avatar"
                                                                alt=""
                                                                style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                            />
                                                            <p className="c_name">{admin.name} {admin.lastName}</p>
                                                        </td>
                                                        <td>{admin.email}</td>
                                                        <td>{admin.phone}</td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary btn-sm mr-2"
                                                                title="View"
                                                                onClick={() => navigate(`/${userType}/Dashboard/admin/adminprofileview/${admin._id}`)}
                                                            >
                                                                <i className="fa fa-eye"></i>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-info btn-sm mr-2"
                                                                title="Edit"
                                                                onClick={() => navigate(`/${userType}/Dashboard/admin/adminprofile/${admin._id}`)}
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
                                                ))}
                                        </tbody>

                                    </table>
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
