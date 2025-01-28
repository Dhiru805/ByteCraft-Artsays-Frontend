import React, { useState } from 'react';
// import './HelpPage.css';
import { Link } from 'react-router-dom';
 
const helpData = [
  {
    iconClass: 'fas fa-file-alt',
    title: 'Getting Started',
    description: 'Set up your account and create your first collection in Artsys',
  },
  {
    iconClass: 'fas fa-cogs',
    title: 'Customization',
    description: 'Change how your media looks and feels',
  },
  {
    iconClass: 'fas fa-user-shield',
    title: 'Moderation',
    description: 'Manage UGC posts in your collections',
  },
  {
    iconClass: 'fas fa-user-shield',
    title: 'Moderation',
    description: 'Manage UGC posts in your collections',
  },
  // Add more items here if needed
];
 
const HelpCard = ({ iconClass, title, description, linkTo }) => {
  return (
    <Link to={linkTo} className="help-card">
      <div className="icon">
        <i className={iconClass}></i>
      </div>
      <div className="content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </Link>
  );
};
 
const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
 
  // Filter help data based on search query
  const filteredHelpData = helpData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            <p className="text-center">
              Feel free to use the search to find what you are looking for. If
              you are not able to find what you need, you can always chat with
              us.
            </p>
            <div className="help-section">
              {filteredHelpData.map((item, index) => (
                <HelpCard
                  key={index}
                  iconClass={item.iconClass}
                  title={item.title}
                  description={item.description}
                  linkTo={`/help/${item.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
 
export default HelpPage;