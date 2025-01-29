import React from 'react';

const RecentPostsWidget = ({ posts }) => {
  return (
    <section className="widget overflow-hidden mb-md-9 mb-6">
      <h3 className="headingVII fwEbold text-uppercase mb-2">Post By Artist</h3>
      <ul className="list-unstyled recentPostList mb-0">
        {posts.map((post, index) => (
          <li key={index}><a href="#" className="py-2 d-block">{post}</a></li>
        ))}
      </ul>
    </section>
  );
};

export default RecentPostsWidget;
