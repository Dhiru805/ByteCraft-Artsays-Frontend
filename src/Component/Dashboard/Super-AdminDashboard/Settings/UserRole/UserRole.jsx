import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import UserRoleTable from "./UserRoleTable";
import CreateRole from "./CreateRole";

const UserRole = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="container-fluid">
                <div className="block-header">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <h2>User Role</h2>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                        <i className="fa fa-dashboard"></i>
                                    </span>
                                </li>
                                <li className="breadcrumb-item">User Role</li>
                            </ul>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="d-flex flex-row-reverse">
                                <div className="page_action">
                                    <button
                                        type="button"
                                        className="btn btn-secondary mr-2"
                                        onClick={() => navigate('/super-admin/settings/create-user-role')}
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <UserRoleTable />
            </div>
        </>
    );
};

export default UserRole;
