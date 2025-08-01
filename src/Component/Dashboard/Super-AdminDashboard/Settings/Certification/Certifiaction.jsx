import React, { useEffect, useState } from "react";
import CertificationTable  from "./CertificationTable";
import AddCertification from "./CreateCertifiaction";
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from 'react-router-dom';

const CertificationSetting = () => {
  const [certifications, setCertifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [subCertifications, setSubCertifications] = useState([]);
  const [selectedSubCertification, setSelectedSubCertification] = useState(null);

  const fetchSubCertificationData = async () => {
    try {
      const response = await getAPI(`/api/get-certification-setting`, {}, true);
      if (
        !response.hasError &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setSubCertifications(response.data.data);
      } else {
        console.error("Invalid response format or error in response");
      }
    } catch (err) {
      console.error("Error fetching certification List:", err);
    }
  };

  useEffect(() => {
    fetchSubCertificationData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Certification Setting</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Certification Setting</li>
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
      <CertificationTable
        certifications={certifications}
        setSelectedSubCertification={setSelectedSubCertification}
        setSubCertifications={setSubCertifications}
        subCertifications={subCertifications}
        selectedSubCertification={selectedSubCertification}
        fetchSubCertificationData={fetchSubCertificationData}
      />

      {showModal && (
        <AddCertification
          onClose={() => setShowModal(false)}
          fetchSubCertificationData={fetchSubCertificationData}
        />
      )}
    </div>
  );
};

export default CertificationSetting;