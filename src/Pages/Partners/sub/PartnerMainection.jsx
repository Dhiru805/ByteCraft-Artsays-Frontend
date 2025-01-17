import React from "react";

import "./partnermainection.css";

const PartnerMainection = () => {
  return (
    <>
      <div className="partner-main-section">
        <div className="partner-content">
          <div className="main-section">
            <div className="main-section-one">
              <h1>Partner with Airtable</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Aliquam nisi deserunt qui dignissimos vero odit facilis
                obcaecati sapiente, in eum!
              </p>
              <div className="main-section-btn">
                <div className="pat-btn ci-notify-btn btn btn ">Apply now →</div>
                <div
                  type="button"
                  className="ci-notify-btn btn btn pat-btn"
                  data-mdb-ripple-init
                  data-mdb-ripple-color="dark"
                >
                  Find a Services Partner →
                </div>
              </div>
            </div>
            <div className="main-one-image">
              <img
                src="Partner-page-logos/Partner_Hero_2560x1920.webp"
                alt="Partner Main"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerMainection;
