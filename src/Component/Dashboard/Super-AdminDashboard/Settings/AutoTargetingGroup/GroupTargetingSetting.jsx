import React, { useEffect, useState } from "react";
import GroupTargetingTable from "./GroupTargetingTable";
import AddGroupTargeting from "./AddGroupTargeting";
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from 'react-router-dom';

const GroupTargetingSetting = () => {
  const [groupTargetings, setGroupTargetings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGroupTargeting, setSelectedGroupTargeting] = useState(null);
  const navigate = useNavigate();

  const fetchGroupTargetingData = async () => {
    try {
      const response = await getAPI(`/api/get-group-targetings`, {}, true);
      if (
        !response.hasError &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setGroupTargetings(response.data.data);
      } else {
        console.error("Invalid response format or error in response");
      }
    } catch (err) {
      console.error("Error fetching group targeting list:", err);
    }
  };

  useEffect(() => {
    fetchGroupTargetingData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Group Targeting Setting</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Group Targeting Setting</li>
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
                  <i className="fa fa-plus"></i> Add Group Targeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GroupTargetingTable
        setSelectedGroupTargeting={setSelectedGroupTargeting}
        setGroupTargetings={setGroupTargetings}
        groupTargetings={groupTargetings}
        selectedGroupTargeting={selectedGroupTargeting}
        fetchGroupTargetingData={fetchGroupTargetingData}
        setShowAddModal={setShowAddModal}
      />

      {showAddModal && (
        <AddGroupTargeting
          onClose={() => setShowAddModal(false)}
          fetchGroupTargetingData={fetchGroupTargetingData}
        />
      )}
    </div>
  );
};

export default GroupTargetingSetting;