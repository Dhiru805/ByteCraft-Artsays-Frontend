import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationTemplatesMain from "./NotificationTemplatesMain";

const NotificationTemplates = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Notification Email Templates</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Settings</li>
              <li className="breadcrumb-item">Notification Templates</li>
            </ul>
          </div>
        </div>
      </div>
      <NotificationTemplatesMain />
    </div>
  );
};

export default NotificationTemplates;
