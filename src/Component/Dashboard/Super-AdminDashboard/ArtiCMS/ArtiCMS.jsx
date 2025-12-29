import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArtiCMSTable from "./ArtiCMSTable";
import AddCompanyModal from "./AddCompanyModal";
import getAPI from "../../../../api/getAPI";

const ArtiCMS = () => {
  const [showModal, setShowModal] = useState(false);
  const [companyInfo, setCompanyInfo] = useState([]);
  const navigate = useNavigate();

  const handleCloseModal = () => setShowModal(false);

  // Fetch all company info
  const fetchCompanyInfo = async () => {
    try {
      const response = await getAPI("/api/company-info/get");

      if (!response.hasError && response.data) {
        setCompanyInfo(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch company info", err);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Arti CMS</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Arti</li>
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

      {/* Table */}
      <ArtiCMSTable
        companyInfo={companyInfo}
        fetchCompanyInfo={fetchCompanyInfo}
      />

      {/* Add Modal */}
      {showModal && (
        <AddCompanyModal
          onClose={handleCloseModal}
          fetchCompanies={fetchCompanyInfo}
        />
      )}
    </div>
  );
};

export default ArtiCMS;
