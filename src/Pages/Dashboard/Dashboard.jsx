import React, { useEffect, useState } from 'react';
import Navbar from '../../Component/Dashboard/Dashboardcomponents/Navbar';
import UserAccount from '../../Component/Dashboard/Dashboardcomponents/Sidebar/LeftSide';
import RightIconBar from '../../Component/Dashboard/Dashboardcomponents/RightIconBar';
import BlockHeader from '../../Component/Dashboard/Dashboardcomponents/MainContent';
import toastr from 'toastr'; // Import toastr for notifications
// Utility function to dynamically load CSS
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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading effect and load scripts/styles after component mounts
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set loading to false after the timeout
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
      // loadScript('/DashboardAssets/assets/bundles/mainscripts.bundle.js'),
      // loadScript('/DashboardAssets/js/index.js') // Assuming your JS is inside `DashboardAssets/js`
    ]).then(() => {
        const email = sessionStorage.getItem('email'); // Fetch email from session storage
        if (email) {
          toastr.success(`Welcome, ${email}!`, 'Hello!'); // Show welcome message with toastr
        }
      }).catch(err => console.error('Failed to load script:', err));
    }, []);

  return (
    <div data-theme="light" className="font-nunito theme-cyan">
      {/* Page Loader */}
      {loading ? (
        <div className="page-loader-wrapper">
          <div className="loader">
            <div className="m-t-30">
              {/* <img
                src="/DashboardAssets/assets/images/logo-icon.svg" // Image path from public folder
                width="48"
                height="48"
                alt="Iconic"
              /> */}
            </div>
            <p>Please wait...</p>
          </div>
        </div>
      ) : (
        <div id="wrapper">
        <Navbar></Navbar>
        <UserAccount></UserAccount>
        <RightIconBar></RightIconBar>
        <BlockHeader></BlockHeader>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
