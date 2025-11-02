import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import BlockchainNetworkTable from "./BlockchainNetworkTable";
import CreateBlockchainNetworkModal from "./CreateBlockchainNetwork";
import { useNavigate } from 'react-router-dom';

const BlockchainNetwork = () => {
    const [blockchainNetworks, setBlockchainNetworks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchBlockchainNetworks = async () => {
        try {
            const response = await getAPI("/api/getblockchainnetworks");
            setBlockchainNetworks(response.data);
        } catch (error) {
            console.error("Error fetching blockchain networks:", error);
        }
    };
    
    useEffect(() => {
        fetchBlockchainNetworks();
    }, []);

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Blockchain Network</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Blockchain Network</li>
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
            <BlockchainNetworkTable
                setBlockchainNetworks={setBlockchainNetworks}
                blockchainNetworks={blockchainNetworks}
                refreshBlockchainNetworks={fetchBlockchainNetworks}
            />
            {showModal && <CreateBlockchainNetworkModal onClose={() => setShowModal(false)} refreshBlockchainNetworks={fetchBlockchainNetworks} />}
        </div>
    );
};

export default BlockchainNetwork;