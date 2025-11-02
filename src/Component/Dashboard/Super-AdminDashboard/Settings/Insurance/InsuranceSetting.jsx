import React, { useEffect, useState } from "react";
import InsuranceTable from "./InsuranceTable";
import AddInsuranceSetting from "./AddInsurance";
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from 'react-router-dom';

const InsuranceSetting = () => {
  const [insuranceSettings, setInsuranceSettings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInsuranceSetting, setSelectedInsuranceSetting] = useState(null);
  const navigate = useNavigate();

  const fetchInsuranceSettingData = async () => {
    try {
      const response = await getAPI(`/api/get-insurance-settings`, {}, true);
      if (
        !response.hasError &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setInsuranceSettings(response.data.data);
      } else {
        console.error("Invalid response format or error in response");
      }
    } catch (err) {
      console.error("Error fetching insurance setting list:", err);
    }
  };

  useEffect(() => {
    fetchInsuranceSettingData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Insurance Setting</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Insurance Setting</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => setShowAddModal(true)}
                >
                  <i className="fa fa-plus"></i> Add Insurance Setting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InsuranceTable
        setSelectedInsuranceSetting={setSelectedInsuranceSetting}
        setInsuranceSettings={setInsuranceSettings}
        insuranceSettings={insuranceSettings}
        selectedInsuranceSetting={selectedInsuranceSetting}
        fetchInsuranceSettingData={fetchInsuranceSettingData}
        setShowAddModal={setShowAddModal}
      />

      {showAddModal && (
        <AddInsuranceSetting
          onClose={() => setShowAddModal(false)}
          fetchInsuranceSettingData={fetchInsuranceSettingData}
        />
      )}
    </div>
  );
};

export default InsuranceSetting;