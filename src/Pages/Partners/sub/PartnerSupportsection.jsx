import React from "react";
import "./partnersupportsection.css";

const PartnerSupportsection = () => {
  return (
    <>
      <section>
        <div className="partner-support-section">
          <div className="support-content">
            <div className="support-text">
              <h1>Get our full support</h1>
              <p className="supportsection-title2">
                The Services Partner Program has you covered
              </p>
              <ul>
                <li>
                  <i className="fa fa-check-circle"></i> Receive dialed-in
                  expertise from a dedicated partner manager
                </li>
                <li>
                  <i className="fa fa-check-circle"></i> Stay updated with
                  Airtable technical training and resources
                </li>
                <li>
                  <i className="fa fa-check-circle"></i> Amplify lead generation
                  with support from Airtable sales and marketing teams
                </li>
              </ul>
            </div>
            <div className="support-image">
              <img src="partnerimgs/section3img1.jpeg" alt="Support" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="partner-support-section-two">
          <div className="support-content-two">
            <div className="support-image-two">
              <img src="partnerimgs/section3img1.jpeg" alt="Support" />
            </div>
            <div className="support-text-two">
              <h1>Get our full support</h1>
              <p className="supportsection-title2">
                {" "}
                The Services Partner Program has you covered
              </p>
              <ul>
                <li>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Fugit error officia blanditiis eligendi! Veniam
                    reprehenderit, deleniti blanditiis nemo perferendis nulla!
                  </p>
                </li>
                <li>
                  <a href="#" className="text-area-btn">
                    View all integrations{" "}
                    <i className="fas fa-arrow-right p-2"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnerSupportsection;
