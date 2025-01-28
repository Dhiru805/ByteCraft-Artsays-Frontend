import React from "react";
import AboutPageCard from "./AboutPageCards"
// import "./partnermainection.css";

const PartnerMainection = () => {
  return (
    <>
      <div className="partner-main-section">
        <div className="partner-content">
          <div className="about-main-section">
            <div className="main-section-one">
              <h1>Partner with Airtable</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Aliquam nisi deserunt qui dignissimos vero odit facilis
                obcaecati sapiente, in eum!
              </p>
              <div className="main-section-btn">
                {/* <button className="btn btn-primary btn-lg">Apply now</button>
                <button
                  type="button"
                  className="btn btn-outline-info"
                  data-mdb-ripple-init
                  data-mdb-ripple-color="dark"
                >
                  Find a Services Partner
                </button> */}
                <div className="ci-notify-btn btn btn btn-lg" role="button">Apply →</div>
                <div className="ci-notify-btn btn btn btn-lg" role="button">Buy →</div>
              </div>
            </div>
            <div className="about-main-one-image">
              {/* <img
                src="Partner-page-logos/Partner_Hero_2560x1920.webp"
                alt="Partner Main"
              /> */}
              {/* <AboutPageCard/> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerMainection;
