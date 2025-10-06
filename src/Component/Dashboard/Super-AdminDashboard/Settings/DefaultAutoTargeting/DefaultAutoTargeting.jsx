import React, { useEffect, useState } from "react";
import AutoTargetingTable from "./DefaultAutoTargetingTable";
import AddAutoTargeting from "./CreateDefaultAutoTargeting";
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from 'react-router-dom';

const AutoTargetingSetting = () => {
  const [autoTargetings, setAutoTargetings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAutoTargeting, setSelectedAutoTargeting] = useState(null);
  const navigate = useNavigate();

  const fetchAutoTargetingData = async () => {
    try {
      const response = await getAPI(`/api/get-auto-targeting`, {}, true);
      if (
        !response.hasError &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setAutoTargetings(response.data.data);
      } else {
        console.error("Invalid response format or error in response");
      }
    } catch (err) {
      console.error("Error fetching auto-targeting list:", err);
    }
  };

  useEffect(() => {
    fetchAutoTargetingData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Auto-Targeting Setting</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Auto-Targeting Setting</li>
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
      <AutoTargetingTable
        setSelectedAutoTargeting={setSelectedAutoTargeting}
        setAutoTargetings={setAutoTargetings}
        autoTargetings={autoTargetings}
        selectedAutoTargeting={selectedAutoTargeting}
        fetchAutoTargetingData={fetchAutoTargetingData}
      />

      {showModal && (
        <AddAutoTargeting
          onClose={() => setShowModal(false)}
          fetchAutoTargetingData={fetchAutoTargetingData}
        />
      )}
    </div>
  );
};

export default AutoTargetingSetting;