import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <ul className="list-unstyled pagination d-flex justify-content-center align-items-end mt-5">
      <li><a href="#" onClick={() => onPageChange(currentPage - 1)}><i className="fas fa-chevron-left"></i></a></li>
      {pages.map(page => (
        <li key={page} className={page === currentPage ? 'active' : ''}>
          <a href="#" onClick={() => onPageChange(page)}>{page}</a>
        </li>
      ))}
      <li>...</li>
      <li><a href="#" onClick={() => onPageChange(currentPage + 1)}><i className="fas fa-chevron-right"></i></a></li>
    </ul>
  );
};

export default Pagination;
