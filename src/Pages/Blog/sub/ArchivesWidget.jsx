import React from 'react';

const ArchivesWidget = ({ archives }) => {
  return (
    <section className="widget overflow-hidden mb-md-9 mb-6">
      <h3 className="headingVII fwEbold text-uppercase mb-2">Post By Admin</h3>
      <ul className="list-unstyled recentPostList mb-0">
        {archives.map((archive, index) => (
          <li key={index} className="mb-3"><a href="#" className="py-2 d-block">{archive}</a></li>
        ))}
      </ul>
    </section>
  );
};

export default ArchivesWidget;
