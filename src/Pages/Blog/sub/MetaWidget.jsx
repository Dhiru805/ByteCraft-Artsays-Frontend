import React from 'react';

const MetaWidget = ({ metaItems }) => {
  return (
    <section className="widget overflow-hidden mb-md-9 mb-6">
      <h3 className="headingVII fwEbold text-uppercase mb-4">META</h3>
      <ul className="list-unstyled archiveList mb-0">
        {metaItems.map((item, index) => (
          <li key={index} className="mb-3"><a href="#" className="d-block">{item}</a></li>
        ))}
      </ul>
    </section>
  );
};

export default MetaWidget;
