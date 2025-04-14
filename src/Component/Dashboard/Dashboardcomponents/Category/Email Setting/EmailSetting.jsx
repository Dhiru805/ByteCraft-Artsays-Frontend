import React from "react";
import EmailSettingMain from "./EmailSettingMain";

const EmailSetting = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>Email Setting</h2>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">
                    <i className="fa fa-dashboard"></i>
                  </a>
                </li>
                <li className="breadcrumb-item">Email Setting</li>
              </ul>
            </div>
          </div>
        </div>
        <EmailSettingMain/>
      </div>
    </>
  );
};

export default EmailSetting;
