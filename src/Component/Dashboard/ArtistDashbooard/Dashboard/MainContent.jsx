import React from 'react';

const BlockHeader = () => {
    return (
        <div class="container-fluid">
            <div class="block-header">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <h2>eCommerce</h2>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item"><a href="index.html"><i class="fa fa-dashboard"></i></a></li>                            
                            <li class="breadcrumb-item">Dashboard</li>
                            <li class="breadcrumb-item active">eCommerce</li>
                        </ul>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="d-flex flex-row-reverse">
                            <div class="page_action">
                                <button type="button" class="btn btn-primary mx-2"><i class="fa fa-download"></i> Download report</button>
                                <button type="button" class="btn btn-secondary"><i class="fa fa-send"></i> Send report</button>
                            </div>
                            <div class="p-2 d-flex">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                <div className="row clearfix row-deck">
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card top_widget primary-bg">
                            <div className="body">
                                <div className="icon bg-light"><i className="fa fa-shopping-basket"></i> </div>
                                <div className="content text-light">
                                    <div className="text mb-2 text-uppercase">New Order</div>
                                    <h4 className="number mb-0">3,251 <span className="font-12"><i className="fa fa-level-up"></i> 8.1%</span></h4>
                                    <small>Analytics for last month</small>
                                </div>
                                <div className="sparkline text-left mt-3" data-type="bar" data-offset="100" data-width="100%" data-height="40px"
                                    data-bar-Width="4" data-bar-Color="#ffffff">2,9,8,7,4,4,6,7,3,4,9,1,5,1,7,8,4,2,1,4,1,2,4,6,7,8,3,2,1,2,5</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card top_widget secondary-bg">
                            <div className="body">
                                <div className="icon bg-light"><i className="fa fa-dollar"></i> </div>
                                <div className="content text-light">
                                    <div className="text mb-2 text-uppercase">Total Income</div>
                                    <h4 className="number mb-0">3,251 <span className="font-12"><i className="fa fa-level-up"></i> 11%</span></h4>
                                    <small>Analytics for last month</small>
                                </div>
                                <div className="sparkline text-left mt-3" data-type="bar" data-offset="100" data-width="100%" data-height="40px"
                                    data-bar-Width="4" data-bar-Color="#ffffff">2,7,8,3,2,1,2,5,6,7,3,4,9,1,5,9,8,7,4,4,4,1,2,4,6,1,7,8,4,2,1</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card top_widget bg-dark">
                            <div className="body">
                                <div className="icon bg-light"><i className="fa fa-file-text-o"></i> </div>
                                <div className="content text-light">
                                    <div className="text mb-2 text-uppercase">Total Expense</div>
                                    <h4 className="number mb-0">3,251 <span className="font-12"><i className="fa fa-level-up"></i> 5.2%</span></h4>
                                    <small>Analytics for last month</small>
                                </div>
                                <div className="sparkline text-left mt-3" data-type="bar" data-offset="100" data-width="100%" data-height="40px"
                                    data-bar-Width="4" data-bar-Color="#ffffff">2,9,8,7,4,4,4,9,1,5,1,7,8,4,2,1,4,1,2,4,6,7,8,3,2,1,2,5,6,7,3</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card top_widget bg-info">
                            <div className="body">
                                <div className="icon bg-light"><i className="fa fa-users"></i> </div>
                                <div className="content text-light">
                                    <div className="text mb-2 text-uppercase">New Users</div>
                                    <h4 className="number mb-0">3,251 <span className="font-12"><i className="fa fa-level-up"></i> 3.8%</span></h4>
                                    <small>Analytics for last month</small>
                                </div>
                                <div className="sparkline text-left mt-3" data-type="bar" data-offset="100" data-width="100%" data-height="40px"
                                    data-bar-Width="4" data-bar-Color="#ffffff">2,9,8,7,4,4,4,1,2,4,6,7,8,3,2,1,2,5,6,7,3,4,9,1,5,1,7,8,4,2,1</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix row-deck">
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="header">
                                <h2>Sales by Category <small>Description text here...</small></h2>
                                <ul className="header-dropdown">
                                    <li><a href="#" title=""><i className="fa fa-envelope"></i></a></li>
                                    <li><a href="#" title=""><i className="fa fa-download"></i></a></li>
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
                                <div className="d-flex justify-content-start">
                                    <div className="mr-3">
                                        <p className="mb-0">Online <span className="font-12 text-muted"><i className="fa fa-level-up"></i> 8.2%</span></p>
                                        <h5>$ 9,011</h5>
                                    </div>
                                    <div className="ml-3">
                                        <p className="mb-0">Offline <span className="font-12 text-muted"><i className="fa fa-level-up"></i> 16%</span></p>
                                        <h5>$ 14,012</h5>
                                    </div>
                                </div>
                                <div style={{ width: '80%', margin: 'auto', paddingTop: '50px' }}>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="header">
                                <h2>Annual Report <small>Description text here...</small></h2>
                                <ul className="header-dropdown">
                                    <li><a href="#" title=""><i className="fa fa-envelope"></i></a></li>
                                    <li><a href="#" title=""><i className="fa fa-download"></i></a></li>
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
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex">
                                        <div>
                                            <span className="font-12 text-uppercase">Sales Report</span>
                                            <h4>$4,516</h4>
                                        </div>
                                        <div className="ml-4 mr-4">
                                            <span className="font-12 text-uppercase">Annual Revenue </span>
                                            <h4>$6,481</h4>
                                        </div>
                                        <div>
                                            <span className="font-12 text-uppercase">Total Profit</span>
                                            <h4>$3,915</h4>
                                        </div>
                                    </div>
                                    <div className="d-flex">

                                    </div>
                                </div>
                                <div id="Annual-Report" className="annual_report" style={{ height: "16rem" }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix row-deck">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="card">
                            <div className="header">
                                <h2>New Orders</h2>
                            </div>
                            <div className="body">
                                <table className="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Product</th>
                                            <th>Customers</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>01</td>
                                            <td>IPONE-7</td>
                                            <td>
                                                <ul className="list-unstyled team-info margin-0">
                                                    <li><img src="DashboardAssets/assets/images/xs/avatar1.jpg" title="Avatar" alt="Avatar" /></li>
                                                    <li><img src="DashboardAssets/assets/images/xs/avatar6.jpg" title="Avatar" alt="Avatar" /></li>
                                                </ul>
                                            </td>
                                            <td>$ 356</td>
                                        </tr>
                                        <tr>
                                            <td>02</td>
                                            <td>NOKIA-8</td>
                                            <td>
                                                <ul classNameName="list-unstyled team-info margin-0">
                                                    <li><img src="DashboardAssets/assets/images/xs/avatar1.jpg" title="Avatar" alt="Avatar" /></li>
                                                    <li><img src="DashboardAssets/assets/images/xs/avatar5.jpg" title="Avatar" alt="Avatar" /></li>
                                                    <li><img src="DashboardAssets/assets/images/xs/avatar9.jpg" title="Avatar" alt="Avatar" /></li>
                                                </ul>
                                            </td>
                                            <td>$ 542</td>
                                        </tr>
                                        <tr>
                                            <td>03</td>
                                            <td>Laptop HP</td>
                                            <td>
                                                <ul className="list-unstyled team-info margin-0">
                                                    <li><img src="DashboardAssets/assets/images/xs/avatar5.jpg" title="Avatar" alt="Avatar" /></li>
                                                </ul>
                                            </td>
                                            <td>$ 356</td>
                                        </tr>
                                        <tr>
                                            <td>04</td>
                                            <td>NOKIA-8</td>
                                            <td>
                                                <ul className="list-unstyled team-info margin-0">
                                                    <li><img src="DashboardAssets/assets/images/xs/avatar3.jpg" title="Avatar" alt="Avatar" /></li>
                                                    <li><img src="DashboardAssets/assets/images/xs/avatar2.jpg" title="Avatar" alt="Avatar" /></li>
                                                </ul>
                                            </td>
                                            <td>$ 542</td>
                                        </tr>
                                        <tr>
                                            <td>05</td>
                                            <td>Tablet 4g</td>
                                            <td>
                                                <ul className="list-unstyled team-info margin-0">
                                                    <li><img src="DashboardAssets/assets/images/xs/avatar3.jpg" title="Avatar" alt="Avatar" /></li>
                                                    <li><img src="DashboardAssets/assets/images/xs/avatar2.jpg" title="Avatar" alt="Avatar" /></li>
                                                </ul>
                                            </td>
                                            <td>$ 542</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-12 col-sm-12">
                        <div className="card">
                            <div className="header">
                                <h2>Top Selling Country</h2>
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
                                <div id="world-map-markers" className="jvector-map" style={{ height: "300px" }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="card">
                            <div className="header">
                                <h2>Recent Transactions</h2>
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
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "60px" }}>#</th>
                                                <th>Name</th>
                                                <th>Item</th>
                                                <th>Address</th>
                                                <th>Quantity</th>
                                                <th>Status</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><img src="http://via.placeholder.com/60x50" alt="Product img" /></td>
                                                <td>Hossein</td>
                                                <td>IPONE-7</td>
                                                <td>Porterfield 508 Virginia Street Chicago, IL 60653</td>
                                                <td>3</td>
                                                <td><span className="badge badge-success">DONE</span></td>
                                                <td>$ 356</td>
                                            </tr>
                                            <tr>
                                                <td><img src="http://via.placeholder.com/60x50" alt="Product img" /></td>
                                                <td>Camara</td>
                                                <td>NOKIA-8</td>
                                                <td>2595 Pearlman Avenue Sudbury, MA 01776 </td>
                                                <td>3</td>
                                                <td><span className="badge badge-default">Delivered</span></td>
                                                <td>$ 542</td>
                                            </tr>
                                            <tr>
                                                <td><img src="http://via.placeholder.com/60x50" alt="Product img" /></td>
                                                <td>Maryam</td>
                                                <td>NOKIA-456</td>
                                                <td>Porterfield 508 Virginia Street Chicago, IL 60653</td>
                                                <td>4</td>
                                                <td><span className="badge badge-success">DONE</span></td>
                                                <td>$ 231</td>
                                            </tr>
                                            <tr>
                                                <td><img src="http://via.placeholder.com/60x50" alt="Product img" /></td>
                                                <td>Micheal</td>
                                                <td>SAMSANG PRO</td>
                                                <td>508 Virginia Street Chicago, IL 60653</td>
                                                <td>1</td>
                                                <td><span className="badge badge-success">DONE</span></td>
                                                <td>$ 601</td>
                                            </tr>
                                            <tr>
                                                <td><img src="http://via.placeholder.com/60x50" alt="Product img" /></td>
                                                <td>Frank</td>
                                                <td>NOKIA-456</td>
                                                <td>1516 Holt Street West Palm Beach, FL 33401</td>
                                                <td>13</td>
                                                <td><span className="badge badge-warning">PENDING</span></td>
                                                <td>$ 128</td>
                                            </tr>
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

export default BlockHeader;
