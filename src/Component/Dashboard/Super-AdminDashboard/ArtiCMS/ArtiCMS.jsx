import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArtiCMSTable from "./ArtiCMSTable";
import AddCompanyModal from "./AddCompanyModal";
import ArtyAIConfig from "./ArtyAIConfig";
import getAPI from "../../../../api/getAPI";

const ArtiCMS = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [showModal, setShowModal] = useState(false);
  const [companyInfo, setCompanyInfo] = useState([]);
  const navigate = useNavigate();

  const handleCloseModal = () => setShowModal(false);

  // Fetch all company info
  const fetchCompanyInfo = async () => {
    try {
      const response = await getAPI("/api/company-info/get");

      if (!response.hasError && response.data && response.data.data) {
        setCompanyInfo(response.data.data);
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

      <div className="card-body">
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <span
              className={`nav-link ${activeTab === "company" ? "active" : ""}`}
              onClick={() => setActiveTab("company")}
              style={{ cursor: "pointer" }}
            >
              Company Information
            </span>
          </li>
          <li className="nav-item">
            <span
              className={`nav-link ${activeTab === "arty" ? "active" : ""}`}
              onClick={() => setActiveTab("arty")}
              style={{ cursor: "pointer" }}
            >
              Arty AI Settings
            </span>
          </li>
        </ul>

        {activeTab === "company" ? (
          <>
            {/* <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(true)}
              >
                <i className="fa fa-plus"></i> Add Company
              </button>
            </div> */}
            <ArtiCMSTable
              companyInfo={companyInfo}
              fetchCompanyInfo={fetchCompanyInfo}
            />
          </>
        ) : (
          <ArtyAIConfig />
        )}
      </div>

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
