import React, { useEffect, useState } from 'react';




function AppChat() {
  const [activeChat, setActiveChat] = useState(null);

  const chatList = [
    { name: 'Vincent Porter', avatar: 'avatar1.jpg', status: 'offline', lastSeen: 'left 7 mins ago' },
    { name: 'Aiden Chavez', avatar: 'avatar2.jpg', status: 'online' },
    { name: 'Mike Thomas', avatar: 'avatar3.jpg', status: 'online' },
    { name: 'Christian Kelly', avatar: 'avatar7.jpg', status: 'offline', lastSeen: 'left 10 hours ago' },
    { name: 'Monica Ward', avatar: 'avatar8.jpg', status: 'online' },
    { name: 'Dean Henry', avatar: 'avatar9.jpg', status: 'offline', lastSeen: 'offline since Oct 28' },
  ];

 

  return (
    <>
        <div className="container-fluid">
          <div className="block-header">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <h2>Chat App</h2>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="index.html">
                      <i className="fa fa-dashboard"></i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">App</li>
                  <li className="breadcrumb-item active">Chat</li>
                </ul>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="d-flex flex-row-reverse">
                  <div className="page_action">
                    <button type="button" className="btn btn-primary mx-2">
                      <i className="fa fa-download"></i> Download report
                    </button>
                    <button type="button" className="btn btn-secondary">
                      <i className="fa fa-plus"></i> Add new
                    </button>
                  </div>
                  <div className="p-2 d-flex"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card chat-app">
                <div id="plist" className="people-list">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="icon-magnifier"></i>
                      </span>
                    </div>
                    <input type="text" className="form-control" placeholder="Search..." />
                  </div>
                  <ul className="list-unstyled chat-list mt-2 mb-0">
                    {chatList.map((chat, index) => (
                      <li
                        key={index}
                        className={`clearfix ${activeChat === index ? 'active' : ''}`}
                        onClick={() => setActiveChat(index)}
                      >
                        <img
                          src={`DashboardAssets/assets/images/xs/${chat.avatar}`}
                          alt="avatar"
                        />
                        <div className="about">
                          <div className="name">{chat.name}</div>
                          <div className="status">
                            <i className={`fa fa-circle ${chat.status}`}></i> {chat.status === 'online' ? 'online' : chat.lastSeen}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="chat">
                  {/* Chat content remains unchanged */}
                  <div className="chat-header clearfix">
                    <div className="row">
                      <div className="col-lg-6">
                        <a
                          href="javascript:void(0);"
                          data-toggle="modal"
                          data-target="#view_info"
                        >
                          <img
                            src="DashboardAssets/assets/images/xs/avatar2.jpg"
                            alt="avatar"
                          />
                        </a>
                        <div className="chat-about">
                          <h5 className="mb-0">Aiden Chavez</h5>
                          <small>Last seen: 2 hours ago</small>
                        </div>
                      </div>
                      <div className="col-lg-6 hidden-sm text-right">
                        <a
                          href="javascript:void(0);"
                          className="btn btn-sm btn-outline-secondary"
                        >
                          <i className="icon-camera"></i>
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="icon-camcorder"></i>
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="btn btn-sm btn-outline-info"
                        >
                          <i className="icon-settings"></i>
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="btn btn-sm btn-outline-warning"
                        >
                          <i className="icon-question"></i>
                        </a>
                      </div>
                      </div>
                  </div>
                  <div className="chat-history">
                    <ul className="mb-0">
                      <li className="clearfix">
                        <div className="message-data text-right">
                          <span className="message-data-time">
                            10:10 AM, Today
                          </span>
                          <img
                            src="DashboardAssets/assets/images/xs/avatar2.jpg"
                            alt="avatar"
                          />
                        </div>
                        <div className="message other-message float-right">
                          {" "}
                          Hi Aiden, how are you? How is the project coming
                          along?{" "}
                        </div>
                      </li>
                      <li className="clearfix">
                        <div className="message-data">
                          <span className="message-data-time">
                            10:12 AM, Today
                          </span>
                        </div>
                        <div className="message my-message">
                          Are we meeting today?
                        </div>
                      </li>
                      <li className="clearfix">
                        <div className="message-data">
                          <span className="message-data-time">
                            10:15 AM, Today
                          </span>
                        </div>
                        <div className="message my-message">
                          Project has been already finished and I have results
                          to show you.
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="chat-message clearfix">
                    <div className="input-group mb-0">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="icon-paper-plane"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter text here..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* <!-- Default Size --> */}
      <div className="modal fade" id="view_info" tabindex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="title" id="defaultModalLabel">
                User Details
              </h6>
            </div>
            <div className="modal-body">
              <div className="body top_counter">
                <div className="icon">
                  <img
                    src="DashboardAssets/assets/images/xs/avatar2.jpg"
                    className="rounded-circle"
                    alt=""
                  />
                </div>
                <div className="content m-t-5">
                  <div>Team Leader</div>
                  <h6>Aiden Chavez</h6>
                </div>
              </div>
              <hr />
              <small className="text-muted">Address: </small>
              <p>795 Folsom Ave, Suite 600 San Francisco, 94107</p>
              <small className="text-muted">Email address: </small>
              <p>michael@gmail.com</p>
              <small className="text-muted">Mobile: </small>
              <p>+ 202-555-2828</p>
              <small className="text-muted">Birth Date: </small>
              <p className="mb-0">October 22th, 1990</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
     
  )
}

export default AppChat
