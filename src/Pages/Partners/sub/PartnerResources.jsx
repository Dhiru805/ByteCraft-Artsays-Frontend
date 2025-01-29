import React from 'react';
import './partnerresources.css'; // Import the CSS file

const PartnerResources = () => {
  return (
    <div className="partner-resources">
      <div className='partner-resources-container'>
        <h1>Discover our Partner Resources</h1>
        <div className="cards-container">
          <div className="pat-card">
            <img src="Partnerimgs/section3img1.jpeg" alt="Application" className="card-icon" />
            <h2>Become an accredited Airtable Services Partner</h2>
            <p>Application</p>
            <a href="#" className="card-link">
              Apply now 
            </a>
          </div>
          <div className="pat-card">
            <img src="Partnerimgs/section3img1.jpeg" alt="Directory" className="card-icon" />
            <h2>See our Services Partner Directory</h2>
            <p>Directory</p>
            <a href="#" className="card-link">
              Explore directory 
            </a>
          </div>
          <div className="pat-card">
            <img src="Partnerimgs/section3img1.jpeg" alt="Directory" className="card-icon" />
            <h2>Connect with our Integration Partners</h2>
            <p>Directory</p>
            <a href="#" className="card-link">
              View integrations 
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerResources;
