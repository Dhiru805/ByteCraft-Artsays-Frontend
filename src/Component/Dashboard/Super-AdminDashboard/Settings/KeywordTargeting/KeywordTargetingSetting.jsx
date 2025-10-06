import React, { useEffect, useState } from "react";
import KeywordTargetingTable from "./KeywordTargetingTable";
import AddKeywordTargeting from "./AddKeywordTargeting";
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from 'react-router-dom';

const KeywordTargetingSetting = () => {
  const [keywordTargetings, setKeywordTargetings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedKeywordTargeting, setSelectedKeywordTargeting] = useState(null);
  const navigate = useNavigate();

  const fetchKeywordTargetingData = async () => {
    try {
      const response = await getAPI(`/api/get-keyword-targetings`, {}, true);
      if (
        !response.hasError &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setKeywordTargetings(response.data.data);
      } else {
        console.error("Invalid response format or error in response");
      }
    } catch (err) {
      console.error("Error fetching keyword targeting list:", err);
    }
  };

  useEffect(() => {
    fetchKeywordTargetingData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Keyword Targeting Setting</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Keyword Targeting Setting</li>
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
                  <i className="fa fa-plus"></i> Add Keyword Targeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <KeywordTargetingTable
        setSelectedKeywordTargeting={setSelectedKeywordTargeting}
        setKeywordTargetings={setKeywordTargetings}
        keywordTargetings={keywordTargetings}
        selectedKeywordTargeting={selectedKeywordTargeting}
        fetchKeywordTargetingData={fetchKeywordTargetingData}
        setShowAddModal={setShowAddModal}
      />

      {showAddModal && (
        <AddKeywordTargeting
          onClose={() => setShowAddModal(false)}
          fetchKeywordTargetingData={fetchKeywordTargetingData}
        />
      )}
    </div>
  );
};

export default KeywordTargetingSetting;