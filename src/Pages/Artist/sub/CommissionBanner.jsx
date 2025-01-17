import React from "react";
import "./CommissionBanner.css"; // Use this for the styling

const CommissionBanner = () => {
  return (
    <>
      <div className="commission-banner">
        <div className="commission-banner-left-section">
          <h1>Turn Clicks into Conversions</h1>
          <p>
            With ClickBoost, master the art of online persuasion as we harness
            data, creativity, and technology to transform your digital
            engagement strategy.
          </p>
          <div className="commission-banner-buttons">
            <button className="commission-banner-start-now">Start Now</button>
            <button className="commission-banner-learn-more">Learn more</button>
          </div>
          <div className="commission-banner-partners">
            <span>Powered by</span>
            <div className="commission-banner-partners-logos">
              <span>UrbanNest</span>
              <span>Moutanna</span>
              <span>FactFix</span>
              <span>Log Trans</span>
              <span>Excels</span>
              <span>MeetHub</span>
            </div>
          </div>
        </div>

        <div className="commission-banner-right-section">
            <div className="commision-banner-circle">
                <div className="banner-circle"> i m developer</div>
            </div>
          <div className="commission-banner-right-section-upper">
            <div className="commission-banner-right-section-upper-left">
              <div className="upper-left-upper">
                <h1>Hello everyone</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut,
                  qui?
                </p>
              </div>
              <div className="upper-left-lower">
                <h1>Hello everyone</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut,
                  qui?
                </p>
              </div>
            </div>
            <div className="commission-banner-right-section-upper-right">
              <img
                className="upper-right-img"
                src="https://media.gettyimages.com/id/1357935536/photo/happy-businesswoman-sitting-on-her-desk-using-her-tablet.jpg?s=612x612&w=gi&k=20&c=-gH7A173qLn-rZDqruRSr53q2a265QEtmM8ZbEu5_fE="
                alt=""
              />
            </div>
          </div>
          <div className="commission-banner-right-section-Lower">
            <img
              className="right-section-Lower-img"
              src="https://t3.ftcdn.net/jpg/06/50/49/08/360_F_650490808_jcE1Bi3hD4WucjJBzxNaUZ5faLYXoqTV.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CommissionBanner;
