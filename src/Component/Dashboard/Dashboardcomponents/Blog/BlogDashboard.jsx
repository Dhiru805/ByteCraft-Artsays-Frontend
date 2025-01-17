import React from 'react';



function BlogDashboard() { 
  return (

    
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Dashboard</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>                            
                            <li className="breadcrumb-item">App</li>
                            <li className="breadcrumb-item active">Blog</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex flex-row-reverse">
                            <div className="page_action">
                                <button type="button" className="btn btn-primary mx-2">Generate Report</button>
                                <a href="blog-post.html" className="btn btn-secondary" title="new post">New post</a>
                            </div>
                            <div className="p-2 d-flex">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row clearfix row-deck">
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card top_widget">
                        <div className="body">
                            <div className="icon"><i className="fa fa-thumbs-o-up"></i> </div>
                            <div className="content">
                                <div className="text mb-2 text-uppercase">Likes</div>
                                <h4 className="number mb-0">22,500 <span className="font-12 text-muted"><i className="fa fa-level-up"></i> 4%</span></h4>
                                <small className="text-muted">Analytics for last Month</small>
                            </div>
                        </div>
                        <div className="sparkline" data-type="line" data-spot-Radius="0" data-offset="90" data-width="100%" data-height="50px"
                        data-line-Width="1" data-line-Color="#73cec7" data-fill-Color="#73cec7">2,3,1,5,4,2,3,1,5,4,7,8,2,3,1,4,6,5,4,4,4,7,8,2,3,1,4,6,5,4</div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card top_widget">
                        <div className="body">
                            <div className="icon"><i className="fa fa-comment"></i> </div>
                            <div className="content">
                                <div className="text mb-2 text-uppercase">Comments</div>
                                <h4 className="number mb-0">500 <span className="font-12 text-muted"><i className="fa fa-level-up"></i> 11%</span></h4>
                                <small className="text-muted">Analytics for last Month</small>
                            </div>
                        </div>
                        <div className="sparkline" data-type="line" data-spot-Radius="0" data-offset="90" data-width="100%" data-height="50px"
                        data-line-Width="1" data-line-Color="#7ea7de" data-fill-Color="#7ea7de">7,8,2,3,1,4,6,2,3,1,5,4,7,8,2,3,1,4,6,5,4,4,2,3,1,5,4,5,4,4</div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card top_widget">
                        <div className="body">
                            <div className="icon"><i className="fa fa-share-alt"></i> </div>
                            <div className="content">
                                <div className="text mb-2 text-uppercase">Share</div>
                                <h4 className="number mb-0">2,215 <span className="font-12 text-muted"><i className="fa fa-level-up"></i> 9%</span></h4>
                                <small className="text-muted">Analytics for last Month</small>
                            </div>
                        </div>
                        <div className="sparkline" data-type="line" data-spot-Radius="0" data-offset="90" data-width="100%" data-height="50px"
                        data-line-Width="1" data-line-Color="#84d4a6" data-fill-Color="#84d4a6">2,3,1,5,4,7,8,2,3,1,4,6,5,4,4,2,3,1,5,4,7,8,2,3,1,4,6,5,4,4</div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card top_widget">
                        <div className="body">
                            <div className="icon"><i className="fa fa-eye"></i> </div>
                            <div className="content">
                                <div className="text mb-2 text-uppercase">View</div>
                                <h4 className="number mb-0">421,215 <span className="font-12 text-muted"><i className="fa fa-level-down"></i> 2%</span></h4>
                                <small className="text-muted">Analytics for last Month</small>
                            </div>
                        </div>
                        <div className="sparkline" data-type="line" data-spot-Radius="0" data-offset="90" data-width="100%" data-height="50px"
                        data-line-Width="1" data-line-Color="#efc26b" data-fill-Color="#efc26b">2,3,1,5,4,7,8,2,3,1,4,6,5,4,4,1,5,4,7,8,2,3,1,4,6,5,4,4,2,3</div>
                    </div>
                </div>
            </div>

            <div className="row clearfix row-deck">
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="card">
                        <div className="body text-center">
                            <input type="text" className="knob2" value="66" data-linecap="round" data-width="100" data-height="100" data-thickness="0.1" data-fgColor="#4CAF50" readonly/>
                            <h5 className="mt-4 mb-0">Twitter</h5>
                            <small>56% Increase</small>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="card">
                        <div className="body text-center">
                            <input type="text" className="knob2" value="26" data-linecap="round" data-width="100" data-height="100" data-thickness="0.1" data-fgColor="#7b69ec" readonly/>
                            <h5 className="mt-4 mb-0">Facebook</h5>
                            <small>87% Increase</small>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="card">
                        <div className="body text-center">
                            <input type="text" className="knob2" value="76" data-linecap="round" data-width="100" data-height="100" data-thickness="0.1" data-fgColor="#f9bd53" readonly/>
                            <h5 className="mt-4 mb-0">Instagram</h5>
                            <small>16% Increase</small>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="card">
                        <div className="body text-center">
                            <input type="text" className="knob2" value="76" data-linecap="round" data-width="100" data-height="100" data-thickness="0.1" data-fgColor="#f9bd53" readonly/>
                            <h5 className="mt-4 mb-0">Google +</h5>
                            <small>37% Increase</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row clearfix row-deck">
                <div className="col-lg-6 col-md-12">
                    <div className="card">
                        <div className="header">
                            <h2>Return Visitor Information</h2>
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
                            <div id="Return-Visitor-Information"></div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12">
                    <div className="card">
                        <div className="header">
                            <h2>Bounce Rate</h2>
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
                            <div id="Bounce-Rate"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row clearfix row-deck">
                <div className="col-xl-7 col-lg-12 col-md-12">
                    <div className="card">
                        <div className="header">
                            <h2>Visitors Statistics</h2>
                        </div>
                        <div className="body">
                            <div className="row">
                                <div className="col-6">
                                    <small>Page Views</small>
                                    <h4 className="mb-0">32,211,536</h4>
                                </div>
                                <div className="col-6">
                                    <small>Site Visitors</small>
                                    <h4 className="mb-0">23,516</h4>
                                </div>
                            </div>
                            <div id="world-map-markers" className="mt-3" style={{height: "280px"}}></div>
                        </div>
                    </div>                
                </div>
                <div className="col-xl-5 col-lg-12 col-md-12">
                    <div className="card">
                        <div className="header">
                            <h2>Marketing Campaign <small>This Month </small></h2>                            
                        </div>
                        <div className="body">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <i className="fa fa-facebook fa-2x"></i>
                                            </td>
                                            <td>
                                                <h6 className="margin-0">Facebook Ads</h6>
                                                <span>1.2k Likes, 418 Shares</span>
                                            </td>
                                            <td>
                                                <h6 className="mb-0">$ 402</h6>
                                                <span className="text-muted">Spent</span>
                                            </td>
                                            <td className="text-right">
                                                <div className="text-success">
                                                    23 <i className="fa fa-long-arrow-up"></i>
                                                </div>
                                                <div className="text-muted">up</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa fa-twitter fa-2x"></i>
                                            </td>
                                            <td>
                                                <h6 className="margin-0">Twitter Ads</h6>
                                                <span>1k Likes, 128 Shares</span>
                                            </td>
                                            <td>
                                                <h6 className="mb-0">$ 489</h6>
                                                <span className="text-muted">Spent</span>
                                            </td>
                                            <td className="text-right">
                                                <div className="text-danger">                                                    
                                                    -9 <i className="fa fa-long-arrow-down"></i>
                                                </div>
                                                <div className="text-muted">down</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa fa-instagram fa-2x"></i>
                                            </td>
                                            <td>
                                                <h6 className="margin-0">Instagram Post</h6>
                                                <span>1k Follows, 228 Likes</span>
                                            </td>
                                            <td>
                                                <h6 className="mb-0">$ 718 </h6>
                                                <span className="text-muted">Spent</span>
                                            </td>
                                            <td className="text-right">
                                                <div className=" text-success">
                                                    16 <i className="fa  fa-long-arrow-up"></i>
                                                </div>
                                                <div className="text-muted">up</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa fa-linkedin fa-2x"></i>
                                            </td>
                                            <td>
                                                <h6 className="margin-0">LinkedIn Post</h6>
                                                <span>1k Follows, 228 Likes</span>
                                            </td>
                                            <td>
                                                <h6 className="mb-0">$ 768</h6>
                                                <span className="text-muted">Spent</span>
                                            </td>
                                            <td className="text-right">
                                                <div className=" text-success">
                                                    27 <i className="fa  fa-long-arrow-up"></i>
                                                </div>
                                                <div className="text-muted">up</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa fa-google-plus-circle fa-2x"></i>
                                            </td>
                                            <td>
                                                <h6 className="margin-0">Google +</h6>
                                                <span>1k Follows, 228 Likes</span>
                                            </td>
                                            <td>
                                                <h6 className="mb-0">$ 1768</h6>
                                                <span className="text-muted">Spent</span>
                                            </td>
                                            <td className="text-right">
                                                <div className=" text-success">
                                                    27 <i className="fa fa-long-arrow-up"></i>
                                                </div>
                                                <div className="text-muted">up</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default BlogDashboard
