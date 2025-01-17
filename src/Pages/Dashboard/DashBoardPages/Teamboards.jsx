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

function Teamboards() {
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
        loadStyle('/DashboardAssets/assets/css/main.css');

        // Dynamically load external JS files from the public folder
        Promise.all([
            // loadScript('https://code.jquery.com/jquery-3.6.0.min.js'), // Ensure jQuery is loaded first
            loadScript('/DashboardAssets/assets/bundles/libscripts.bundle.js'),
            loadScript('/DashboardAssets/assets/bundles/vendorscripts.bundle.js'),
            // loadScript('/DashboardAssets/assets/bundles/mainscripts.bundle.js'),
        ]).then(() => {
            const email = sessionStorage.getItem('email'); // Fetch email from session storage
            if (email) {
                // toastr.success(`Welcome, ${email}!`, 'Hello!'); // Show welcome message with toastr
            }

            // Ensure the progress bar is initialized after the scripts load
            window.$('.progress .progress-bar').progressbar({
                display_text: 'none'
            });
        }).catch(err => console.error('Failed to load script:', err));
    }, []);

    return (
        <div id="wrapper" className="theme-cyan">
            <Navbar />
            <UserAccount />
            <RightIconBar />
            <div id="main-content">
                <div className="container-fluid">
                    <div className="block-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <h2>Teams Board</h2>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>
                                    <li className="breadcrumb-item">Extra</li>
                                    <li className="breadcrumb-item active">Teams Board</li>
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
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <div className="card">
                                <div className="header">
                                    <h2>DS - Design Team <small>Ranking 2th</small></h2>
                                    <ul className="header-dropdown">
                                        <li className="dropdown">
                                            <a href="javascript:void(0);" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>
                                            <ul className="dropdown-menu dropdown-menu-right">
                                                <li><a href="javascript:void(0);">Action</a></li>
                                                <li><a href="javascript:void(0);">Another Action</a></li>
                                                <li><a href="javascript:void(0);">Something else</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="body">
                                    <h6 className="m-b-15">Info about Design Team <span className="badge badge-success float-right">New</span></h6>
                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                                    <ul className="list-unstyled team-info m-t-20">
                                        <li className="m-r-15"><small className="text-muted">Team</small></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar1.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar2.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar3.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar4.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar5.jpg" title="Avatar" alt="Avatar" /></li>
                                    </ul>
                                    <div className="progress progress-xs progress-transparent custom-color-blue">
                                        <div className="progress-bar" data-transitiongoal="87"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-7">
                                            <small>PROJECTS: 12</small>
                                            <h6>BUDGET: 4,870 USD</h6>
                                        </div>
                                        <div className="col-5">
                                            <div className="sparkline text-right m-t-10" data-type="bar" data-width="97%" data-height="26px" data-bar-Width="2" data-bar-Spacing="7" data-bar-Color="#7460ee">2,5,8,3,5,7,1,6</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <div className="card">
                                <div className="header">
                                    <h2>MT - Marketing Team <small>Ranking 4th</small></h2>
                                    <ul className="header-dropdown">
                                        <li className="dropdown">
                                            <a href="javascript:void(0);" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>
                                            <ul className="dropdown-menu dropdown-menu-right">
                                                <li><a href="javascript:void(0);">Action</a></li>
                                                <li><a href="javascript:void(0);">Another Action</a></li>
                                                <li><a href="javascript:void(0);">Something else</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="body">
                                    <h6 className="m-b-15">Info about Marketing Team</h6>
                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                                    <ul className="list-unstyled team-info m-t-20">
                                        <li className="m-r-15"><small className="text-muted">Team</small></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar10.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar9.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar8.jpg" title="Avatar" alt="Avatar" /></li>
                                    </ul>
                                    <div className="progress progress-xs progress-transparent custom-color-purple">
                                        <div className="progress-bar" data-transitiongoal="34"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-7">
                                            <small>PROJECTS: 08</small>
                                            <h6>BUDGET: 2,170 USD</h6>
                                        </div>
                                        <div className="col-5">
                                            <div className="sparkline text-right m-t-10" data-type="bar" data-width="97%" data-height="26px" data-bar-Width="2" data-bar-Spacing="7" data-bar-Color="#f96332">6,2,3,4,8,7,6,2</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <div className="card">
                                <div className="header">
                                    <h2>DT - Developers Team <small>Ranking 5th</small></h2>
                                    <ul className="header-dropdown">
                                        <li className="dropdown">
                                            <a href="javascript:void(0);" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>
                                            <ul className="dropdown-menu dropdown-menu-right">
                                                <li><a href="javascript:void(0);">Action</a></li>
                                                <li><a href="javascript:void(0);">Another Action</a></li>
                                                <li><a href="javascript:void(0);">Something else</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="body">
                                    <h6 className="m-b-15">Info about Developers Team</h6>
                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                                    <ul className="list-unstyled team-info m-t-20">
                                        <li className="m-r-15"><small className="text-muted">Team</small></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar1.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar2.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar3.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar4.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar5.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar6.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar7.jpg" title="Avatar" alt="Avatar" /></li>
                                    </ul>
                                    <div className="progress progress-xs progress-transparent custom-color-yellow">
                                        <div className="progress-bar" data-transitiongoal="54"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-7">
                                            <small>PROJECTS: 23</small>
                                            <h6>BUDGET: 8,000 USD</h6>
                                        </div>
                                        <div className="col-5">
                                            <div className="sparkline text-right m-t-10" data-type="bar" data-width="97%" data-height="26px" data-bar-Width="2" data-bar-Spacing="7" data-bar-Color="#2CA8FF">8,2,3,4,6,5,2,7</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <div className="card">
                                <div className="header">
                                    <h2>GT - Graphic Team <small>Ranking 2th</small></h2>
                                    <ul className="header-dropdown">
                                        <li className="dropdown">
                                            <a href="javascript:void(0);" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>
                                            <ul className="dropdown-menu dropdown-menu-right">
                                                <li><a href="javascript:void(0);">Action</a></li>
                                                <li><a href="javascript:void(0);">Another Action</a></li>
                                                <li><a href="javascript:void(0);">Something else</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="body">
                                    <h6 className="m-b-15">Info about Graphic Team</h6>
                                    <p>There are many variations of passages of Lorem Ipsum available, but the have suffered alteration in some form.</p>
                                    <ul className="list-unstyled team-info m-t-20">
                                        <li className="m-r-15"><small className="text-muted">Team</small></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar4.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar5.jpg" title="Avatar" alt="Avatar" /></li>
                                    </ul>
                                    <div className="progress progress-xs progress-transparent custom-color-green">
                                        <div className="progress-bar" data-transitiongoal="67"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-7">
                                            <small>PROJECTS: 2</small>
                                            <h6>BUDGET: 3,370 USD</h6>
                                        </div>
                                        <div className="col-5">
                                            <div className="sparkline text-right m-t-10" data-type="bar" data-width="97%" data-height="26px" data-bar-Width="2" data-bar-Spacing="7" data-bar-Color="#ea4c89">2,5,8,3,5,7,1,6</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <div className="card">
                                <div className="header">
                                    <h2>ST - Sales Team <small>Ranking 7th</small></h2>
                                    <ul className="header-dropdown">
                                        <li className="dropdown">
                                            <a href="javascript:void(0);" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>
                                            <ul className="dropdown-menu dropdown-menu-right">
                                                <li><a href="javascript:void(0);">Action</a></li>
                                                <li><a href="javascript:void(0);">Another Action</a></li>
                                                <li><a href="javascript:void(0);">Something else</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="body">
                                    <h6 className="m-b-15">Info about Sales Team</h6>
                                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classNameical Latin literature.</p>
                                    <ul className="list-unstyled team-info m-t-20">
                                        <li className="m-r-15"><small className="text-muted">Team</small></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar5.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar1.jpg" title="Avatar" alt="Avatar" /></li>
                                    </ul>
                                    <div className="progress progress-xs progress-transparent custom-color-blue">
                                        <div className="progress-bar" data-transitiongoal="87"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-7">
                                            <small>PROJECTS: 12</small>
                                            <h6>BUDGET: 5,100 USD</h6>
                                        </div>
                                        <div className="col-5">
                                            <div className="sparkline text-right m-t-10" data-type="bar" data-width="97%" data-height="26px" data-bar-Width="2" data-bar-Spacing="7" data-bar-Color="#4183c4">6,2,3,4,8,7,6,2</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <div className="card">
                                <div className="header">
                                    <h2>BD - Business Development <small>Ranking 8th</small></h2>
                                    <ul className="header-dropdown">
                                        <li className="dropdown">
                                            <a href="javascript:void(0);" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>
                                            <ul className="dropdown-menu dropdown-menu-right">
                                                <li><a href="javascript:void(0);">Action</a></li>
                                                <li><a href="javascript:void(0);">Another Action</a></li>
                                                <li><a href="javascript:void(0);">Something else</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="body">
                                    <h6 className="m-b-15">Info about Business Development Team</h6>
                                    <p>Lorem Ipsum is simply dummy text of the printing and industry. Lorem Ipsum has been the industry's standard.</p>
                                    <ul className="list-unstyled team-info m-t-20">
                                        <li className="m-r-15"><small className="text-muted">Team</small></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar2.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar3.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar5.jpg" title="Avatar" alt="Avatar" /></li>
                                        <li><img src="DashboardAssets/assets/images/xs/avatar7.jpg" title="Avatar" alt="Avatar" /></li>
                                    </ul>
                                    <div className="progress progress-xs progress-transparent custom-color-blue">
                                        <div className="progress-bar" data-transitiongoal="87"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-7">
                                            <small>PROJECTS: 23</small>
                                            <h6>BUDGET: 11,000 USD</h6>
                                        </div>
                                        <div className="col-5">
                                            <div className="sparkline text-right m-t-10" data-type="bar" data-width="97%" data-height="26px" data-bar-Width="2" data-bar-Spacing="7" data-bar-Color="#026466">6,3,1,5,8,7,3,4</div>
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

export default Teamboards
