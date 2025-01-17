import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <div className="pageWrapper">
        <main>
          <section
            className="introBannerHolder d-flex w-100 bgCover"
            style={{ backgroundImage: "url(images/b-bg7.jpg)" }}
          >
            <div className="container store-container">
              <div className="row">
                <div className="col-12 pt-lg-23 pt-md-15 pt-sm-10 pt-6 text-center">
                  <h1 className="headingIV fwEbold playfair mb-4">
                    {pathnames[pathnames.length - 1]
                      .replace(/-/g, " ")
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </h1>
                  <ul className="list-unstyled breadCrumbs d-flex justify-content-center">
                    <li className="mr-2">
                      <Link to="/">Home</Link>
                    </li>
                    {pathnames.map((value, index) => {
                      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                      const isLast = index === pathnames.length - 1;
                      return (
                        <React.Fragment key={to}>
                          <li className="mr-2 active">
                            /
                            {isLast ? (
                              value
                                .replace(/-/g, " ")
                                .replace(/^\w/, (c) => c.toUpperCase())
                            ) : (
                              <Link to={to}>
                                {value
                                  .replace(/-/g, " ")
                                  .replace(/^\w/, (c) => c.toUpperCase())}
                              </Link>
                            )}
                          </li>
                          {!isLast && <li className="mr-2">/</li>}
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Breadcrumb;
