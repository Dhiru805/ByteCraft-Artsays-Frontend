import React from 'react';
import Avatar from 'react-avatar';
import './ConversionComponent.css'; // Link to the updated CSS file
import { FaBuilding, FaMountain, FaClipboard, FaTruck, FaFlag, FaUsers } from 'react-icons/fa'; // Import FontAwesome icons

const ConversionComponent = () => {
  return (
    <div className="conversion-container">
      {/* Left Section */}
      <div className="left-section">
        <h1 className="heading">Turn Clicks into Conversions</h1>
        <p className="description">
          With ClickBoost, master the art of online persuasion as we harness data, creativity, and technology to
          transform your digital engagement strategy.
        </p>
        <div className="buttons-container">
          <button className="start-btn">Start Now</button>
          <button className="learn-more-btn">Learn more</button>
        </div>
           {/* Footer Section */}
      <div className="footer">
        <p>Powered by:</p>
        <div className="powered-by-logos">
          <p><FaBuilding className="icon" /> UrbanNest</p>
          <p><FaMountain className="icon" /> Mountana</p>
          <p><FaClipboard className="icon" /> FactFix</p>
          <p><FaTruck className="icon" /> Log Trans</p>
          <p><FaFlag className="icon" /> Excels</p>
          <p><FaUsers className="icon" /> MeetHub</p>
        </div>
      </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="stats-section">
          <Avatar size="50" round={true} name="John Doe" />
          <Avatar size="50" round={true} name="Jane Smith" />
          <Avatar size="50" round={true} name="Alex White" />
          <h3 className="stats-number">124K+</h3>
          <p className="stats-subtext">More than 2,000 people have joined us</p>
        </div>

        <div className="growth-container">
          <div className="growth-text">
            <p>Successful growth</p>
            <img src="https://picsum.photos/80" alt="Growth Chart" className="growth-image" />
          </div>
        </div>

        <div className="metrics-section">
          <div className="metric-box">
            <h3>98%</h3>
            <p>Satisfied rate</p>
          </div>
          <div className="metric-box">
            <h3>14K</h3>
            <p>Successful projects</p>
          </div>
          <div className="metric-box">
            <h3>5.8K</h3>
            <p>Clients served</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionComponent;
