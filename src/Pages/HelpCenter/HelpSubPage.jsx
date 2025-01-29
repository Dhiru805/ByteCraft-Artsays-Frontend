import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './HelpSubPage.css';
 
const HelpSubPage = () => {
  const { title } = useParams();
  const [expandedCard, setExpandedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
 
  // Array storing information about each section
  const sections = [
    {
      title: 'Getting Started',
      description: 'Set up your account and create your first collection in Artsys.',
    },
    {
      title: 'Customization',
      description: 'Change how your media looks and feels.',
    },
    {
      title: 'Moderation',
      description: 'Manage UGC posts in your collections.',
    },
    {
      title: 'Additional Section',
      description: 'Additional content description.',
    },
    // Add more sections as needed
  ];
 
  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };
 
  // Filter sections based on search query
  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <div className="help-page">
      <header className="help-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <h1 className="help-title">Artsys Help Centre</h1>
              <div className="search-bar">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary">Search</button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container help-main">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/help"><i className="fas fa-home"></i> Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">{title}</li>
              </ol>
            </nav>
            <div className="section-title">{title}</div>
            <p>{sections.find(section => section.title === title)?.description}</p>
            <div className="help-section">
              {filteredSections.map((section, index) => (
                <div
                  key={index}
                  className="help-card"
                  onClick={() => handleCardClick(index)}
                >
                  <div className="content">
                    <div className="header">
                      <div className='help-subpage-tital'>{section.title}</div>
                      <span className="expand-icon">{expandedCard === index ? '-' : '+'}</span>
                    </div>
                    <p className={`description ${expandedCard === index ? 'show' : ''}`}>
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
 
export default HelpSubPage;