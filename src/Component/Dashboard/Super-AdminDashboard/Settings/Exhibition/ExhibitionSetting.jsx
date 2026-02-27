// ExhibitionSetting.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import getAPI from "../../../../../api/getAPI";
import ExhibitionTable from "./ExhibitionTable";
import AddExhibitionPlan from "./Addexhibition";
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";

const ExhibitionSetting = () => {
  const [plans, setPlans] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchExhibitionPlans = async () => {
    try {
      const response = await getAPI("/api/get-exhibition-plans", {}, true);
      if (!response.hasError && Array.isArray(response.data?.data)) {
        setPlans(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching exhibition plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitionPlans();
  }, []);

  if (loading) return <ProductRequestSkeleton />;

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Exhibition Promotion Plans</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate('/super-admin/dashboard')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Exhibition Plans</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddModal(true)}
              >
                <i className="fa fa-plus"></i> Add New Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      <ExhibitionTable
        plans={plans}
        setPlans={setPlans}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        fetchExhibitionPlans={fetchExhibitionPlans}
        setShowAddModal={setShowAddModal}
      />

      {showAddModal && (
        <AddExhibitionPlan
          onClose={() => setShowAddModal(false)}
          fetchExhibitionPlans={fetchExhibitionPlans}
        />
      )}
    </div>
  );
};

export default ExhibitionSetting;