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
function FileDashboard() {
    const [loading, setLoading] = useState(true);

    // Simulate loading effect and load scripts/styles after component mounts
    useEffect(() => {
      setTimeout(() => {
        setLoading(false); // Set loading to false after the timeout
      }, 2000); // Example delay of 2 seconds
  
       // Load CSS files
       loadStyle('/DashboardAssets/assets/vendor/bootstrap/css/bootstrap.min.css');
       loadStyle('/DashboardAssets/assets/vendor/font-awesome/css/font-awesome.min.css');
       loadStyle('/DashboardAssets/assets/vendor/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css');
       loadStyle('/DashboardAssets/assets/vendor/morrisjs/morris.css');
       loadStyle('/DashboardAssets/assets/css/main.css');
  
      // Dynamically load external JS files from public folder
      Promise.all([
        loadScript('/DashboardAssets/assets/bundles/libscripts.bundle.js'),
        loadScript('/DashboardAssets/assets/bundles/vendorscripts.bundle.js'),
        loadScript('/DashboardAssets/assets/bundles/morrisscripts.bundle.js'),
        loadScript('/DashboardAssets/js/pages/file/filemanager.js'),
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
                        <h2>Dashboard</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>                            
                            <li className="breadcrumb-item">App</li>
                            <li className="breadcrumb-item active">File Manager</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex flex-row-reverse">
                            <div className="page_action">
                                <button type="button" className="btn btn-primary">Generate Report</button>
                                <button type="button" className="btn btn-secondary">Upload new</button>
                            </div>
                            <div className="p-2 d-flex">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row clearfix">
                <div className="col-lg-3 col-md-4 col-sm-12">
                    <div className="card">
                        <a href="javascript:void(0);" className="folder">
                            <h6><i className="fa fa-folder m-r-10"></i> Iconic Project</h6>
                        </a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12">
                    <div className="card">
                        <a href="javascript:void(0);" className="folder">
                            <h6><i className="fa fa-folder m-r-10"></i> Themeforest</h6>
                        </a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12">
                    <div className="card">
                        <a href="javascript:void(0);" className="folder">
                            <h6><i className="fa fa-folder m-r-10"></i> New Website</h6>
                        </a>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12">
                    <div className="card">
                        <a href="javascript:void(0);" className="folder">
                            <h6><i className="fa fa-folder m-r-10"></i> My Folder</h6>
                        </a>
                    </div>
                </div>
            </div>

            <div className="row clearfix">
                <div className="col-lg-3 col-md-5 col-sm-12">
                    <div className="card">
                        <div className="body">
                            <h4>1TB <i className="fa fa-server float-right"></i></h4>
                            <p className="mb-0">Storage <small className="text-muted float-right">of 1Tb</small></p>                            
                            <div id="progress-striped progress-xs" className="progress progress-striped mb-0">
                                <div className="progress-bar progress-bar-warning" data-transitiongoal="43" aria-valuenow="43" style={{width: "43%"}}>43%</div>
                            </div>
                        </div>
                    </div>
                    <div className="card modal-open m-b-5">
                        <div className="body">
                            <h6>2GB</h6>
                            <p className="mb-0">Documents <small className="text-muted float-right">of 1Tb</small></p>
                        </div>
                        <div className="progress progress-xs progress-transparent custom-color-blue mb-0">
                            <div className="progress-bar" data-transitiongoal="18"></div>
                        </div>
                    </div>
                    <div className="card modal-open m-b-5">
                        <div className="body">
                            <h6>10GB</h6>
                            <p className="mb-0">Media <small className="text-muted float-right">of 1Tb</small></p>
                        </div>
                        <div className="progress progress-xs progress-transparent custom-color-purple mb-0">
                            <div className="progress-bar" data-transitiongoal="34"></div>
                        </div>
                    </div>
                    <div className="card modal-open">
                        <div className="body">
                            <h6>20GB</h6>
                            <p className="mb-0">Images <small className="text-muted float-right">of 1Tb</small></p>
                        </div>
                        <div className="progress progress-xs progress-transparent custom-color-green mb-0">
                            <div className="progress-bar" data-transitiongoal="67"></div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-9 col-md-7 col-sm-12">
                    <div className="card">
                        <div className="header">
                            <h2>File Reports</h2>                            
                        </div>
                        <div className="body">                        
                            <div id="area_chart"></div>                        
                        </div>                    
                    </div>
                </div>                
            </div>
            
        </div>
    </div>
    </div>
  )
}

export default FileDashboard
