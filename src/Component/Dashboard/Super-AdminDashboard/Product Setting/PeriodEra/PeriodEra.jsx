import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import PeriodEraTable from "./PeriodEraTable";
import CreatePeriodEraModal from "./CreatePeriodEra";
import { useNavigate } from 'react-router-dom';

const PeriodEra = () => {
    const [periodEras, setPeriodEras] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchPeriodEras = async () => {
        try {
            const response = await getAPI("/api/getperioderas");
            setPeriodEras(response.data);
        } catch (error) {
            console.error("Error fetching periods/eras:", error);
        }
    };
    
    useEffect(() => {
        fetchPeriodEras();
    }, []);

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Period/Era</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Period/Era</li>
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
            <PeriodEraTable
                setPeriodEras={setPeriodEras}
                periodEras={periodEras}
                refreshPeriodEras={fetchPeriodEras}
            />
            {showModal && <CreatePeriodEraModal onClose={() => setShowModal(false)} refreshPeriodEras={fetchPeriodEras} />}
        </div>
    );
};

export default PeriodEra;