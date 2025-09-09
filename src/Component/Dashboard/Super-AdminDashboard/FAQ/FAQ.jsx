import React, { useEffect, useState } from "react";
import FAQTable from "./FAQTable";
import AddFAQ from "./CreateFAQ";
import getAPI from "../../../../api/getAPI";
import { useNavigate } from 'react-router-dom';

const FAQSetting = () => {
  const [faqs, setFAQs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [subFAQs, setSubFAQs] = useState([]);
  const [selectedSubFAQ, setSelectedSubFAQ] = useState(null);

  const fetchSubFAQData = async () => {
    try {
      const response = await getAPI(`/api/get-FAQ`, {}, true);
      if (!response.hasError && response.data && Array.isArray(response.data.data)) {
        setSubFAQs(response.data.data);
      } else {
        console.error("Invalid response format or error in response");
      }
    } catch (err) {
      console.error("Error fetching FAQ List:", err);
    }
  };

  useEffect(() => {
    fetchSubFAQData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>FAQ</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">FAQ</li>
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
      <FAQTable
        faqs={faqs}
        setSelectedSubFAQ={setSelectedSubFAQ}
        setSubFAQs={setSubFAQs}
        subFAQs={subFAQs}
        selectedSubFAQ={selectedSubFAQ}
        fetchSubFAQData={fetchSubFAQData}
      />
      {showModal && (
        <AddFAQ
          onClose={() => setShowModal(false)}
          fetchSubFAQData={fetchSubFAQData}
        />
      )}
    </div>
  );
};

export default FAQSetting;