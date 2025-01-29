import React from 'react';

const RecentCommentsWidget = ({ comments }) => {
  return (
    <section className="widget overflow-hidden mb-md-9 mb-6">
      <h3 className="headingVII fwEbold text-uppercase mb-2">Post By Buyer</h3>
      <ul className="list-unstyled recentPostList mb-0">
        {comments.map((comment, index) => (
          <li key={index}><a href="#" className="py-2 d-block">{comment}</a></li>
        ))}
      </ul>
    </section>
  );
};

export default RecentCommentsWidget;
