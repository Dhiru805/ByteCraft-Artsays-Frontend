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
function SearchResult() {
    const [loading, setLoading] = useState(true);

    // Simulate loading effect and load scripts/styles after component mounts
    useEffect(() => {
      setTimeout(() => {
        setLoading(false); // Set loading to false after the timeout
      }, 2000); // Example delay of 2 seconds
  
       // Load CSS files
       loadStyle('/DashboardAssets/assets/vendor/bootstrap/css/bootstrap.min.css');
       loadStyle('/DashboardAssets/assets/vendor/font-awesome/css/font-awesome.min.css');
       loadStyle('/DashboardAssets/assets/css/main.css');
  
      // Dynamically load external JS files from public folder
      Promise.all([
        loadScript('/DashboardAssets/assets/bundles/libscripts.bundle.js'),
        loadScript('/DashboardAssets/assets/bundles/vendorscripts.bundle.js'),
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
                        <h2>Search Results</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>                            
                            <li className="breadcrumb-item">Extra</li>
                            <li className="breadcrumb-item active">Search Results</li>
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
                <div className="col-md-12">
                    <div className="card">
                        <div className="body">
                            <div className="input-group" id="adv-search">
                                <input type="text" className="form-control" placeholder="Search here..." />
                                <div className="input-group-btn">
                                    <div className="btn-group" role="group">
                                        <div className="dropdown dropdown-lg">
                                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span className="caret"></span></button>
                                            <div className="dropdown-menu dropdown-menu-right" role="menu">
                                                <form className="form-horizontal" role="form">
                                                    <div className="form-group">
                                                    <label for="filter">Filter by</label>
                                                    <select className="form-control">
                                                        <option value="0" selected>All Iconic</option>
                                                        <option value="1">Featured</option>
                                                        <option value="2">Most popular</option>
                                                        <option value="3">Top rated</option>
                                                        <option value="4">Most commented</option>
                                                    </select>
                                                    </div>
                                                    <div className="form-group">                                                        
                                                        <input className="form-control" type="text" placeholder="Author" />
                                                    </div>
                                                    <div className="form-group">                                                        
                                                        <input className="form-control" type="text" placeholder="Contains the words" />
                                                    </div>
                                                    <button type="submit" className="btn btn-primary btn-block">Search</button>
                                                </form>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary"><span className="icon-magnifier" aria-hidden="true"></span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="body">
                            <ul className="nav nav-tabs-new m-b-20">
                                <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#Web">Web</a></li>
                                <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#Images">Images</a></li>
                                <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#Videos">Videos</a></li>                                
                            </ul>                        
                            <p className="mb-0">Search Result For "Bootstrap 4 admin"</p>
                            <strong> About 16,853 result ( 0.13 seconds)</strong>
                        </div>
                    </div>
                    <div className="tab-content padding-0">
                        <div className="tab-pane card active" id="Web">
                            <div className="body">
                                <h6 className="mb-0"><a target="_blank" href="javascript:void(0);">sQuare - Bootstrap 4 Light & Dark Admin with Free Angular5 + UI Kit</a></h6>
                                <small>https://themeforest.net/user/wraptheme/portfolio</small>
                                <p className="m-t-10">sQuare Admin is Material Design premium admin dashboard theme. It’s builded on popular Twitter Bootstrap4 framework. sQuare is fully based on HTML5 + CSS3 Standards. Is fully responsive and clean on every device and every browser.</p>
                                <a className="m-r-20" target="_blank" href="javascript:void(0);">AdminCC</a>
                                <a className="m-r-20" target="_blank" href="javascript:void(0);">Swift Admin</a>
                            </div>
                            <hr/>
                            <div className="body">
                                <h6 className="mb-0"><a target="_blank" href="javascript:void(0);">InfiniO - Bootstrap 4 Admin Dashboard Template </a></h6>
                                <small>https://themeforest.net/user/wraptheme/portfolio</small>
                                <p className="m-t-10">InfiniO is fully professional, responsive, modern, multi-purpose and featured Admin template which can be used to create various website, Admin templates, Admin dashboards, Backend Websites, CMS, CRM or one can aldo build Blog, Business website and time line as well as portfolio. InfiniO Admin makes the development process easy and fast for you and aims to help you implement your idea to real time.</p>
                                <a className="m-r-20" target="_blank" href="javascript:void(0);">Oakleaf Admin</a>
                                <a className="m-r-20" target="_blank" href="javascript:void(0);">sQuare</a>
                            </div>
                            <hr/>
                            <div className="body">
                                <h6 className="mb-0"><a target="_blank" href="javascript:void(0);">Compass - The ultimate Bootstrap 4 Admin Dashboard </a></h6>
                                <small>https://themeforest.net/user/wraptheme/portfolio</small>
                                <p className="m-t-10">Compass Admin is Material Design premium admin dashboard theme. It’s builded on popular Twitter Bootstrap4 framework. Compass is fully based on HTML5 + CSS3 Standards. Is fully responsive and clean on every device and every browser.</p>
                                <a className="m-r-20" target="_blank" href="javascript:void(0);">AdminCC</a>
                                <a className="m-r-20" target="_blank" href="javascript:void(0);">Oakleaf Admin</a>
                                <a className="m-r-20" target="_blank" href="javascript:void(0);">sQuare</a>
                            </div>
                            <hr/>
                            <div className="body">
                                <h6 className="mb-0"><a target="_blank" href="javascript:void(0);">Alpino - Bootstrap 4 Admin Dashboard Template</a></h6>
                                <small>https://themeforest.net/user/wraptheme/portfolio</small>
                                <p className="m-t-10">15+ Dashboard, 100+ Integrated Plugins, 400+ Pages, Light and Dark Menu, The Multistep Form, Timeline view, Summermnote Editor, Image Cropping Tool, Easy to access Menu Styles</p>
                                <a className="m-r-20" target="_blank" href="javascript:void(0);">Oakleaf Admin</a>
                                <a className="m-r-20" target="_blank" href="javascript:void(0);">sQuare</a>
                                <a className="m-r-20" target="_blank" href="javascript:void(0);">AdminCC</a>
                            </div>
                            <hr/>
                            <ul className="body pagination pagination-primary">
                                <li className="page-item"><a className="page-link" href="javascript:void(0);">Previous</a></li>
                                <li className="page-item active"><a className="page-link" href="javascript:void(0);">1</a></li>
                                <li className="page-item"><a className="page-link" href="javascript:void(0);">2</a></li>
                                <li className="page-item"><a className="page-link" href="javascript:void(0);">3</a></li>
                                <li className="page-item"><a className="page-link" href="javascript:void(0);">Next</a></li>
                            </ul>
                        </div>
                        <div className="tab-pane card" id="Images">
                            <div className="body text-center">
                                <div className="not_found">
                                    <h4 className="mb-0">Sorry No result found.</h4>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane card" id="Videos">
                            <div className="body text-center">
                                <div className="not_found">
                                    <h4 className="mb-0">Sorry No result found.</h4>
                                </div>
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

export default SearchResult
