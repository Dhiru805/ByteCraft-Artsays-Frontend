import React from 'react';

const SearchWidget = () => {
  return (
    <section className="widget overflow-hidden mb-6 mb-md-9  search-top ">
      <h3 className="headingVII fwEbold text-uppercase mb-4">Search</h3>
      <form action="#" className="searchForm position-relative border mb-4">
          <input type="search" className="form-controls store-search mr-6" placeholder="Search product..." />
          <button className="position-absolute"><i className="icon-search"></i></button>
      </form>
    </section>
  );
};

export default SearchWidget;
