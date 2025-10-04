import React  from 'react';




function AppContact() {
 
    return (
  <>
                <div className="container-fluid">
                    <div className="block-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <h2>Contact List</h2>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>
                                    <li className="breadcrumb-item">App</li>
                                    <li className="breadcrumb-item active">Contact List</li>
                                </ul>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="d-flex flex-row-reverse">
                                    <div className="page_action">
                                        <a href="app-contact-grid.html" className="btn btn-primary mx-2">Grid view</a>
                                        <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#addcontact">Add New</button>
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
                                    <h2>User List</h2>
                                </div>
                                <div className="body table-responsive">
                                    <table className="table table-hover mb-0 c_list">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <label className="fancy-checkbox">
                                                        <input className="select-all" type="checkbox" name="checkbox" />
                                                        <span></span>
                                                    </label>
                                                </th>
                                                <th>Name</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: "50px" }}>
                                                    <label className="fancy-checkbox">
                                                        <input className="checkbox-tick" type="checkbox" name="checkbox" />
                                                        <span></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <img src="DashboardAssets/assets/images/xs/avatar1.jpg" className="rounded-circle avatar" alt="" />
                                                    <p className="c_name">Robert Hammer <span className="badge badge-default m-l-10 hidden-sm-down">Family</span></p>
                                                </td>
                                                <td>
                                                    <span className="phone">264-625-2583</span>
                                                </td>
                                                <td>
                                                    <address><i className="zmdi zmdi-pin"></i>123 6th St. Melbourne, FL 32904</address>
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary mr-2" title="Edit"><i className="fa fa-edit"></i></button>
                                                    <button type="button" className="btn btn-danger js-sweetalert" data-type="confirm" title="Delete"><i className="fa fa-trash-o"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label className="fancy-checkbox">
                                                        <input className="checkbox-tick" type="checkbox" name="checkbox" />
                                                        <span></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <img src="DashboardAssets/assets/images/xs/avatar3.jpg" className="rounded-circle avatar" alt="" />
                                                    <p className="c_name">Orlando Lentz <span className="badge badge-info m-l-10 hidden-sm-down">Google</span></p>
                                                </td>
                                                <td>
                                                    <span className="phone">264-625-5689</span>
                                                </td>
                                                <td>
                                                    <address><i className="zmdi zmdi-pin"></i>44 Shirley Ave. West Chicago, IL 60185</address>
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary mr-2" title="Edit"><i className="fa fa-edit"></i></button>
                                                    <button type="button" className="btn btn-danger js-sweetalert" data-type="confirm" title="Delete"><i className="fa fa-trash-o"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label className="fancy-checkbox">
                                                        <input className="checkbox-tick" type="checkbox" name="checkbox" />
                                                        <span></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <img src="DashboardAssets/assets/images/xs/avatar4.jpg" className="rounded-circle avatar" alt="" />
                                                    <p className="c_name">Barbara Kelly</p>
                                                </td>
                                                <td>
                                                    <span className="phone">264-625-9513</span>
                                                </td>
                                                <td>
                                                    <address><i className="zmdi zmdi-pin"></i>123 6th St. Melbourne, FL 32904</address>
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary mr-2" title="Edit"><i className="fa fa-edit"></i></button>
                                                    <button type="button" className="btn btn-danger js-sweetalert" data-type="confirm" title="Delete"><i className="fa fa-trash-o"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label className="fancy-checkbox">
                                                        <input className="checkbox-tick" type="checkbox" name="checkbox" />
                                                        <span></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <img src="DashboardAssets/assets/images/xs/avatar6.jpg" className="rounded-circle avatar" alt="" />
                                                    <p className="c_name">Brian Swader<span className="badge badge-default m-l-10 hidden-sm-down">Family</span></p>
                                                </td>
                                                <td>
                                                    <span className="phone">264-625-1212</span>
                                                </td>
                                                <td>
                                                    <address><i className="zmdi zmdi-pin"></i>70 Bowman St. South Windsor, CT 06074</address>
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary mr-2" title="Edit"><i className="fa fa-edit"></i></button>
                                                    <button type="button" className="btn btn-danger js-sweetalert" data-type="confirm" title="Delete"><i className="fa fa-trash-o"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label className="fancy-checkbox">
                                                        <input className="checkbox-tick" type="checkbox" name="checkbox" />
                                                        <span></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <img src="DashboardAssets/assets/images/xs/avatar7.jpg" className="rounded-circle avatar" alt="" />
                                                    <p className="c_name">Richard Foos<span className="badge badge-default m-l-10 hidden-sm-down">Family</span></p>
                                                </td>
                                                <td>
                                                    <span className="phone">264-625-2323</span>
                                                </td>
                                                <td>
                                                    <address><i className="zmdi zmdi-pin"></i>514 S. Magnolia St. Orlando, FL 32806</address>
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary mr-2" title="Edit"><i className="fa fa-edit"></i></button>
                                                    <button type="button" className="btn btn-danger js-sweetalert" data-type="confirm" title="Delete"><i className="fa fa-trash-o"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label className="fancy-checkbox">
                                                        <input className="checkbox-tick" type="checkbox" name="checkbox" />
                                                        <span></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <img src="DashboardAssets/assets/images/xs/avatar8.jpg" className="rounded-circle avatar" alt="" />
                                                    <p className="c_name">Rose Rivera<span className="badge badge-success m-l-10 hidden-sm-down">Work</span></p>
                                                </td>
                                                <td>
                                                    <span className="phone">264-625-1005</span>
                                                </td>
                                                <td>
                                                    <address><i className="zmdi zmdi-pin"></i>44 Shirley Ave. West Chicago, IL 60185</address>
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary mr-2" title="Edit"><i className="fa fa-edit"></i></button>
                                                    <button type="button" className="btn btn-danger js-sweetalert" data-type="confirm" title="Delete"><i className="fa fa-trash-o"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label className="fancy-checkbox">
                                                        <input className="checkbox-tick" type="checkbox" name="checkbox" />
                                                        <span></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <img src="DashboardAssets/assets/images/xs/avatar9.jpg" className="rounded-circle avatar" alt="" />
                                                    <p className="c_name">Frank Camly</p>
                                                </td>
                                                <td>
                                                    <span className="phone">264-625-9999</span>
                                                </td>
                                                <td>
                                                    <address><i className="zmdi zmdi-pin"></i>123 6th St. Melbourne, FL 32904</address>
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary mr-2" title="Edit"><i className="fa fa-edit"></i></button>
                                                    <button type="button" className="btn btn-danger js-sweetalert" data-type="confirm" title="Delete"><i className="fa fa-trash-o"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label className="fancy-checkbox">
                                                        <input className="checkbox-tick" type="checkbox" name="checkbox" />
                                                        <span></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <img src="DashboardAssets/assets/images/xs/avatar10.jpg" className="rounded-circle avatar" alt="" />
                                                    <p className="c_name">Brian Swader<span className="badge badge-default m-l-10 hidden-sm-down">Family</span></p>
                                                </td>
                                                <td>
                                                    <span className="phone">264-625-1212</span>
                                                </td>
                                                <td>
                                                    <address><i className="zmdi zmdi-pin"></i>70 Bowman St. South Windsor, CT 06074</address>
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary mr-2" title="Edit"><i className="fa fa-edit"></i></button>
                                                    <button type="button" className="btn btn-danger js-sweetalert" data-type="confirm" title="Delete"><i className="fa fa-trash-o"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/* <!-- Default Size --> */}
            <div className="modal fade" id="addcontact" tabindex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="title" id="defaultModalLabel">Add Contact</h6>
                        </div>
                        <div className="modal-body">
                            <div className="row clearfix">
                                <div className="col-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="First Name" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Last Name" />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <input type="number" className="form-control" placeholder="Phone Number" />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Enter Address" />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <input type="file" className="form-control-file" id="exampleInputFile" aria-describedby="fileHelp" />
                                        <small id="fileHelp" className="form-text text-muted">This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line.</small>
                                    </div>
                                    <hr />
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Facebook" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Twitter" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Linkedin" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="instagram" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">Add</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">CLOSE</button>
                        </div>
                    </div>
                </div>
            </div>
            </>
    )
}

export default AppContact
