import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div data-theme="light" className="font-nunito">
      <div id="wrapper" className="theme-cyan">
        <div className="vertical-align-wrap">
          <div className="vertical-align-middle auth-main">
            <div className="auth-box">
              <div className="top">
                <img src="assets/images/logo-white.svg" alt="Iconic" />
              </div>
              <div className="card">
                <div className="header">
                  <h3>
                    <span className="clearfix title">
                      <span className="number left">404</span>{' '}
                      <span className="text">
                        Oops! <br />Page Not Found
                      </span>
                    </span>
                  </h3>
                </div>
                <div className="body">
                  <p>
                    The page you were looking for could not be found, please{' '}
                    <a href="javascript:void(0);">contact us</a> to report this issue.
                  </p>
                  <div className="margin-top-30">
                    <button onClick={() => window.history.back()} className="btn btn-default">
                      <i className="fa fa-arrow-left"></i> <span>Go Back</span>
                    </button>
                    <Link to="/" className="btn btn-primary mx-2">
                      <i className="fa fa-home"></i> <span>Home</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;