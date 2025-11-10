import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import CopyrightsRightsTable from "./CopyrightsRightsTable";
import CreateCopyrightsRightsModal from "./CreateCopyrightsRights";
import { useNavigate } from 'react-router-dom';

const CopyrightsRights = () => {
    const [copyrightsRights, setCopyrightsRights] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchCopyrightsRights = async () => {
        try {
            const response = await getAPI("/api/getcopyrightsrights");
            setCopyrightsRights(response.data);
        } catch (error) {
            console.error("Error fetching copyrights rights:", error);
        }
    };
    
    useEffect(() => {
        fetchCopyrightsRights();
    }, []);

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Copyrights Rights</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Copyrights Rights</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex flex-row-reverse">
                            <div className="page_action">
                                <button
                                    type="button"
                                    className="btn btn-secondary mr-2"
                                    onClick={() => setShowModal(true)}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CopyrightsRightsTable
                setCopyrightsRights={setCopyrightsRights}
                copyrightsRights={copyrightsRights}
                refreshCopyrightsRights={fetchCopyrightsRights}
            />
            {showModal && <CreateCopyrightsRightsModal onClose={() => setShowModal(false)} refreshCopyrightsRights={fetchCopyrightsRights} />}
        </div>
    );
};

export default CopyrightsRights;