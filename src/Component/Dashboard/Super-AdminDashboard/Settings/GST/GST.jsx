import React, { useEffect, useState } from "react";
import GSTTable from "./GSTTable";
import AddGST from "./CreateGST";
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from 'react-router-dom';

const GSTSetting = () => {
  const [gstSettings, setGSTSettings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [subGSTSettings, setSubGSTSettings] = useState([]);
  const [selectedSubGST, setSelectedSubGST] = useState(null);

  const fetchSubGSTData = async () => {
    try {
      const response = await getAPI(`/api/get-gst-setting`, {}, true);
      if (
        !response.hasError &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setSubGSTSettings(response.data.data);
      } else {
        console.error("Invalid response format or error in response");
      }
    } catch (err) {
      console.error("Error fetching GST List:", err);
    }
  };

  useEffect(() => {
    fetchSubGSTData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>GST Setting</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">GST Setting</li>
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
      <GSTTable
        gstSettings={gstSettings}
        setSelectedSubGST={setSelectedSubGST}
        setSubGSTSettings={setSubGSTSettings}
        subGSTSettings={subGSTSettings}
        selectedSubGST={selectedSubGST}
        fetchSubGSTData={fetchSubGSTData}
      />

      {showModal && (
        <AddGST
          onClose={() => setShowModal(false)}
          fetchSubGSTData={fetchSubGSTData}
        />
      )}
    </div>
  );
};

export default GSTSetting;