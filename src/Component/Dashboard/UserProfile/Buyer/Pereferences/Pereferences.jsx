import React, { useState } from 'react';

const Preferences = () => {

  return (
    <div className="tab-pane" id="preferences">
    <div className="row clearfix">
      <div className="col-lg-6 col-md-12">
        <div className="body">
          <h6>Your Login Sessions</h6>
          <ul className="list-unstyled list-login-session">
            <li>
              <div className="login-session">
                <i className="fa fa-laptop device-icon" />
                <div className="login-info">
                  <h3 className="login-title">
                    Mac - New York, United States
                  </h3>
                  <span className="login-detail">
                    Chrome -{" "}
                    <span className="text-success">Active Now</span>
                  </span>
                </div>
              </div>
            </li>
            <li>
              <div className="login-session">
                <i className="fa fa-desktop device-icon" />
                <div className="login-info">
                  <h3 className="login-title">
                    Windows 10 - New York, United States
                  </h3>
                  <span className="login-detail">
                    Firefox - about an hour ago
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-link btn-logout"
                  data-container="body"
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Close this login session"
                >
                  <i className="fa fa-times-circle text-danger" />
                </button>
              </div>
            </li>
            <li>
              <div className="login-session">
                <i className="fa fa-mobile fa-fw device-icon" />
                <div className="login-info">
                  <h3 className="login-title">
                    Android - New York, United States
                  </h3>
                  <span className="login-detail">
                    Android Browser - yesterday
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-link btn-logout"
                  data-container="body"
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Close this login session"
                >
                  <i className="fa fa-times-circle text-danger" />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-lg-6 col-md-12">
        <div className="body">
          <h6>Connected Social Media</h6>
          <ul className="list-unstyled list-connected-app">
            <li>
              <div className="connected-app">
                <i className="fa fa-facebook app-icon" />
                <div className="connection-info">
                  <h3 className="app-title">FaceBook</h3>
                  <span className="actions">
                    <a href="javascript:void(0);">View Permissions</a>{" "}
                    <a
                      href="javascript:void(0);"
                      className="text-danger"
                    >
                      Revoke Access
                    </a>
                  </span>
                </div>
              </div>
            </li>
            <li>
              <div className="connected-app">
                <i className="fa fa-twitter app-icon" />
                <div className="connection-info">
                  <h3 className="app-title">Twitter</h3>
                  <span className="actions">
                    <a href="javascript:void(0);">View Permissions</a>{" "}
                    <a
                      href="javascript:void(0);"
                      className="text-danger"
                    >
                      Revoke Access
                    </a>
                  </span>
                </div>
              </div>
            </li>
            <li>
              <div className="connected-app">
                <i className="fa fa-instagram app-icon" />
                <div className="connection-info">
                  <h3 className="app-title">Instagram</h3>
                  <span className="actions">
                    <a href="javascript:void(0);">View Permissions</a>{" "}
                    <a
                      href="javascript:void(0);"
                      className="text-danger"
                    >
                      Revoke Access
                    </a>
                  </span>
                </div>
              </div>
            </li>
            <li>
              <div className="connected-app">
                <i className="fa fa-linkedin app-icon" />
                <div className="connection-info">
                  <h3 className="app-title">Linkedin</h3>
                  <span className="actions">
                    <a href="javascript:void(0);">View Permissions</a>{" "}
                    <a
                      href="javascript:void(0);"
                      className="text-danger"
                    >
                      Revoke Access
                    </a>
                  </span>
                </div>
              </div>
            </li>
            <li>
              <div className="connected-app">
                <i className="fa fa-vimeo app-icon" />
                <div className="connection-info">
                  <h3 className="app-title">Vimeo</h3>
                  <span className="actions">
                    <a href="javascript:void(0);">View Permissions</a>{" "}
                    <a
                      href="javascript:void(0);"
                      className="text-danger"
                    >
                      Revoke Access
                    </a>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Preferences;
