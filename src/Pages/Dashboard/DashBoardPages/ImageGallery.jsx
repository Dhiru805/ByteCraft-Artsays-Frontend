import React, { useEffect, useState } from 'react';
import Navbar from '../../../Component/Dashboard/Dashboardcomponents/Navbar';
import UserAccount from '../../../Component/Dashboard/Dashboardcomponents/Sidebar/LeftSide';
import RightIconBar from '../../../Component/Dashboard/Dashboardcomponents/RightIconBar';
const loadStyle = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };
  
  // Utility function to dynamically load scripts
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };
function ImageGallery() {
    const [loading, setLoading] = useState(true);

    // Simulate loading effect and load scripts/styles after component mounts
    useEffect(() => {
      setTimeout(() => {
        setLoading(false); // Set loading to false after the timeout
      }, 2000); // Example delay of 2 seconds
  
       // Load CSS files
       loadStyle('/DashboardAssets/assets/vendor/bootstrap/css/bootstrap.min.css');
       loadStyle('/DashboardAssets/assets/vendor/font-awesome/css/font-awesome.min.css');
       loadStyle('/DashboardAssets/assets/vendor/light-gallery/css/lightgallery.css');
       loadStyle('/DashboardAssets/assets/css/main.css');
  
      // Dynamically load external JS files from public folder
      Promise.all([
        loadScript('/DashboardAssets/assets/bundles/libscripts.bundle.js'),
        loadScript('/DashboardAssets/assets/bundles/vendorscripts.bundle.js'),
        loadScript('/DashboardAssets/assets/vendor/light-gallery/js/lightgallery-all.min.js'),
        // loadScript('/DashboardAssets/js/pages/medias/image-gallery.js'),
        // loadScript('/DashboardAssets/assets/bundles/mainscripts.bundle.js'),
      ]).then(() => {
        const email = sessionStorage.getItem('email'); // Fetch email from session storage
        if (email) {
          // toastr.success(`Welcome, ${email}!`, 'Hello!'); // Show welcome message with toastr
        }
      }).catch(err => console.error('Failed to load script:', err));
    }, []);
  return (
    <div id="wrapper" className="theme-cyan">
    <Navbar/>
    <UserAccount/>
    <RightIconBar/>
      <div id="main-content">
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Image Gallery 2</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>                            
                            <li className="breadcrumb-item">Extra</li>
                            <li className="breadcrumb-item active">Gallery</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex flex-row-reverse">
                            <div className="page_action">
                                <button type="button" className="btn btn-primary"><i className="fa fa-download"></i> Download report</button>
                                <button type="button" className="btn btn-secondary"><i className="fa fa-send"></i> Send report</button>
                            </div>
                            <div className="p-2 d-flex">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header">
                            <h2>Light Gallery <small>All pictures taken from pexels.com</small></h2>
                        </div>
                        <div className="body">
                            <div id="aniimated-thumbnials" className="list-unstyled row clearfix">
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/1.jpg"> <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/1.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/2.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/2.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/3.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/3.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/4.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/4.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/5.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/5.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/6.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/6.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/7.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/7.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/8.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/8.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/9.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/9.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/10.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/10.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/11.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/11.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/12.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/12.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/13.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/13.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/14.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/14.jpg" alt=""/> </a> </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 m-b-30"> <a href="DashboardAssets/assets/images/image-gallery/15.jpg" > <img className="img-fluid img-thumbnail" src="DashboardAssets/assets/images/image-gallery/15.jpg" alt=""/> </a> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default ImageGallery
