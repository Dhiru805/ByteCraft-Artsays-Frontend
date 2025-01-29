import React, { useState } from 'react';
import Marquee from 'react-fast-marquee';
import './IntegrationPartners.css';  // Make sure this path is correct

const partners = [
  [
    { logo: 'Partner-page-logos/slack.png', name: 'Slack', category: 'Communication' },
    { logo: 'Partner-page-logos/code.png', name: 'Github', category: 'Development' },
    { logo: 'Partner-page-logos/gmail.png', name: 'Email', category: 'Communication' },
    { logo: 'Partner-page-logos/f-inside-a-circle.png', name: 'Miro', category: 'Design' },
    { logo: 'Partner-page-logos/f-inside-a-circle.png', name: 'Flipkart', category: 'E-commerce' },
    { logo: 'Partner-page-logos/social.png', name: 'Amazon', category: 'E-commerce' },
  ],
  [
    { logo: 'Partner-page-logos/microsoft-outlook.png', name: 'Outlook Calendar', category: 'Productivity' },
    { logo: 'Partner-page-logos/dashboard.png', name: 'Tableau', category: 'Analytics' },
    { logo: 'Partner-page-logos/figma.png', name: 'Zendesk', category: 'Support' },
    { logo: 'Partner-page-logos/hubspot.png', name: 'Zendesk', category: 'Support' },
    { logo: 'Partner-page-logos/Google Ai Gemini.png', name: 'Zendesk', category: 'Support' },
    { logo: 'Partner-page-logos/salesforce.png', name: 'Salesforce', category: 'CRM' },
  ],
  [
    { logo: 'Partner-page-logos/googledrive.png', name: 'Google Drive', category: 'Cloud Storage' },
    { logo: 'Partner-page-logos/youtube.png', name: 'YouTube', category: 'Media' },
    { logo: 'Partner-page-logos/jira.png', name: 'Jira', category: 'Project Management' },
    { logo: 'Partner-page-logos/jira.png', name: 'Jira', category: 'Project Management' },
    { logo: 'Partner-page-logos/jira.png', name: 'Jira', category: 'Project Management' },
    { logo: 'Partner-page-logos/v982-d5-19.jpg', name: 'Stripe', category: 'Payments' },
  ],
];

const IntegrationPartners = () => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
    document.body.classList.add('blur');
  };

  const handleMouseLeave = () => {
    setHovered(false);
    document.body.classList.remove('blur');
  };

  return (
    <div className="integration-partners">
      <div className="text-section">
        <h2>Meet our Integration Partners</h2>
        <p>
          Airtable seamlessly connects to tools you use every day – like Slack, Salesforce, and Box – syncing workflows across your organization.
        </p>
        <a href="#" className='text-area-btn'>View all integrations <i className="fas fa-arrow-right p-2"></i></a>
      </div>
      <div className={`partners-section ${hovered ? 'blur' : ''}`}>
        {partners.map((row, rowIndex) => (
          <div key={rowIndex} className="looper">
            <Marquee
              gradient={false}
              direction={rowIndex % 2 === 0 ? 'left' : 'right'}
              speed={30}
              play={!hovered}
            >
              {row.map((partner, index) => (
                <button
                  className="partner-btn"
                  key={index}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="button-content">
                    <img src={partner.logo} className='partner-integration-logo' alt={partner.name} />
                    <div className="partner-info">
                      <div className="partner-name">{partner.name} <i className="fas fa-arrow-right p-2"></i></div>
                      <div className="partner-category">{partner.category}</div>
                    </div>
                  </div>
                </button>
              ))}
            </Marquee>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationPartners;
