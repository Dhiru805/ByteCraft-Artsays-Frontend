import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toastr from 'toastr'; 




const ArtistDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;


  // Simulate loading effect and load scripts/styles after component mounts
  useEffect(() => {
    // Page loading timeout
    setTimeout(() => {
      setPageLoading(false); // Set loading to false after the timeout
    }, 2000); // Example delay of 2 seconds

    // Dynamically load external CSS files from public folder
    // loadStyle('/DashboardAssets/assets/vendor/bootstrap/css/bootstrap.min.css');
    // loadStyle('/DashboardAssets/assets/vendor/font-awesome/css/font-awesome.min.css');
    // loadStyle('/DashboardAssets/assets/vendor/toastr/toastr.min.css');
    // loadStyle('/DashboardAssets/assets/vendor/charts-c3/plugin.css');
    // loadStyle('/DashboardAssets/assets/css/main.css');

    // Dynamically load external JS files from public folder
    Promise.all([
      // loadScript('/DashboardAssets/assets/bundles/libscripts.bundle.js'),
      // loadScript('/DashboardAssets/assets/bundles/vendorscripts.bundle.js'),
      // loadScript('/DashboardAssets/assets/vendor/toastr/toastr.js'),
      // loadScript('/DashboardAssets/assets/bundles/c3.bundle.js'),
    ]).then(() => {
      const email = sessionStorage.getItem('email'); // Fetch email from session storage
      if (email) {
        toastr.success(`Welcome, ${email}!`, 'Hello!'); // Show welcome message with toastr
      }
    }).catch(err => console.error('Failed to load script:', err));
  }, []);

 




  return (
    
   
            <div className="container-fluid">
              <div className="block-header">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <h2>eCommerce</h2>
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>
                      <li className="breadcrumb-item">Dashboard</li>
                      <li className="breadcrumb-item active">eCommerce</li>
                    </ul>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="d-flex flex-row-reverse">
                      <div className="page_action">
                        <button type="button" className="btn btn-primary mx-2"><i className="fa fa-download"></i> Download report</button>
                        <button type="button" className="btn btn-secondary"><i className="fa fa-send"></i> Send report</button>
                      </div>
                      <div className="p-2 d-flex">

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row clearfix">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="card">
                    <div className="header">
                      <h2>Total</h2>
                    </div>
                    <div className="body">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead>
                            <tr>
                              <th style={{ width: "60px" }}>Image</th>
                              <th>ProductName</th>
                              <th>Size</th>
                              <th>Description</th>
                              <th>NumOfPurchases</th>
                              <th>Status</th>
                              <th>NewPrice</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr><td colSpan="7">Loading...</td></tr>
                            ) : (
                              products.map((product) => (
                                <tr key={product._id}>
                                  <td>
                                    <img
                                      src={`${BASE_URL}${product.images[0] || "uploads/products/default.jpg"}`}
                                      alt="Product img"
                                      style={{ width: "60px", height: "50px" }}
                                    />
                                  </td>
                                  <td>{product.productName}</td>
                                  <td>{product.size}</td>
                                  <td>{product.description}</td>
                                  <td>{product.numOfPurchases}</td>
                                  <td><span className="badge badge-success">{product.numOfPurchases > 0 ? 'DONE' : 'PENDING'}</span></td>
                                  <td>{product.newPrice}rs.</td>
                                  <td>
                                    <button type="button" className="btn btn-info" title="Edit" >
                                      <i className="fa fa-edit"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger js-sweetalert" title="Delete">
                                      <i className="fa fa-trash-o"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
      
  );
};

export default ArtistDetail;
