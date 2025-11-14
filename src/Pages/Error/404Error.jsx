import React from 'react';

const Page404 = () => {
  return (
    <section className="page_404 py-5 bg-white " style={{ fontFamily: "'Arvo', serif" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-10 text-center">
            <div
              className="four_zero_four_bg mb-4"
              style={{
                backgroundImage: 'url("/DashboardAssets/assets/images/Error/404.gif")',
                height: '500px',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              <h1 className="display-1">404</h1>
            </div>

            <div className="contant_box_404 mt-n5">
              <h3 className="h1">Looks like you're lost</h3>
              <p>The page you are looking for is not available!</p>
              <button className="btn btn-success mt-3" onClick={() => window.history.back()}>
                Go Back
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page404;
