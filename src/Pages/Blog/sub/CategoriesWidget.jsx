import React from 'react';

const CategoriesWidget = ({ categories }) => {
  return (
    <section className="widget overflow-hidden mb-md-9 mb-6">
      <h3 className="headingVII fwEbold text-uppercase mb-4">CATEGORIES</h3>
      <ul className="list-unstyled archiveList mb-0">
        {categories.map((category, index) => (
          <li key={index} className="mb-3"><a href="#" className="d-block">{category}</a></li>
        ))}
      </ul>
    </section>
  );
};

export default CategoriesWidget;
