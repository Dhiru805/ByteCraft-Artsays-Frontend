import React, { useEffect, useState } from 'react';
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
function Maintenance() {
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
    <div>
         <div className="vertical-align-wrap">
        <div className="vertical-align-middle maintenance">

        <div className="text-center">
            <article>
                <h1>We&rsquo;ll be back soon!</h1>
                <div>
                    <p>Sorry for the inconvenience<br/> but we&rsquo;re performing some maintenance at the moment.<br/> If you need to you can always <a href="mailto:#">contact us</a>, otherwise we&rsquo;ll be back online shortly!</p>
                    <p>&mdash; The Team</p>
                </div>
            </article>
            <div className="margin-top-30">
                <a href="javascript:history.go(-1)" className="btn btn-default"><i className="fa fa-arrow-left"></i> <span>Go Back</span></a>
                <a href="index.html" className="btn btn-info"><i className="fa fa-home"></i> <span>Home</span></a>
            </div>
        </div>
        </div>
    </div>
    </div>
  )
}

export default Maintenance
