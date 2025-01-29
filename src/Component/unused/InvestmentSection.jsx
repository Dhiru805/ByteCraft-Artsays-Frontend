import React from 'react';
import './InvestmentSection.css';
 
const InvestmentSection = () => {
  return (
    <div className="investment-section">
      <div className="investment-title">
        <h1>Leaders in Investment Technology</h1>
        <p>
          Use this paragraph to describe what you do. This is a great place to let your visitors know who you are. Click here to add your story.
          John Sites, your site, your story.
        </p>
        <div className="ci-notify-btn btn btn">Store →</div>
        {/* <Cube/> */}
      </div>
      <div className="invest-cards">
        <div className="carde">
          <h3>Our Business Productions</h3>
          <p>
            Use this paragraph to describe what you do. Add information that visitors may find interesting.
          </p>
          <div className="ci-notify-btn btn btn" role="button">Buy →</div>
        </div>
        <div className="carde">
          <h3>Our approach in Investment</h3>
          <p>
            Use this paragraph to describe what you do. Add information that visitors may find interesting.
          </p>
          <div className="ci-notify-btn btn btn" role="button">Resell → </div>
        </div>
      </div>
    </div>
  );
};
 
export default InvestmentSection;