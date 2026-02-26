import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../api/getAPI";
import putAPI from "../../../../api/putAPI";
import ProductRequestSkeleton from "../../../Skeleton/artist/ProductRequestSkeleton";

function SupportTicketAdmin() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    role: "",
    sla_breach: "false"
  });
  
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await getAPI(`/api/tickets/admin/all?${queryParams}`, {}, true);
      if (response.data.success) {
        setTickets(response.data.tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return 'badge-info';
      case 'In Progress': return 'badge-warning';
      case 'Resolved': return 'badge-success';
      case 'Closed': return 'badge-default';
      case 'Waiting on User': return 'badge-primary';
      case 'Assigned': return 'badge-indigo';
      default: return 'badge-default';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-danger font-weight-bold';
      case 'High': return 'text-warning font-weight-bold';
      case 'Normal': return 'text-info';
      case 'Low': return 'text-muted';
      default: return '';
    }
  };

  const calculateSLAHeatmap = () => {
      const breachedCount = tickets.filter(t => new Date(t.sla_deadline) < new Date() && !['Resolved', 'Closed'].includes(t.status)).length;
      const totalActive = tickets.filter(t => !['Resolved', 'Closed'].includes(t.status)).length;
      return { breachedCount, totalActive, percentage: totalActive > 0 ? (breachedCount / totalActive * 100).toFixed(0) : 0 };
  };

  const stats = calculateSLAHeatmap();

  if (loading && tickets.length === 0) return <ProductRequestSkeleton />;

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Command Center: Unified Support System</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Support</li>
              <li className="breadcrumb-item active">Tickets</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
          <div className="col-lg-3 col-md-6">
              <div className="card">
                  <div className="body">
                      <div className="d-flex align-items-center">
                          <div className="icon-in-bg bg-danger text-white rounded-circle"><i className="fa fa-warning"></i></div>
                          <div className="ml-4">
                              <span>SLA Breaches</span>
                              <h4 className="mb-0 font-weight-bold">{stats.breachedCount}</h4>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-md-6">
              <div className="card">
                  <div className="body">
                      <div className="d-flex align-items-center">
                          <div className="icon-in-bg bg-success text-white rounded-circle"><i className="fa fa-money"></i></div>
                          <div className="ml-4">
                              <span>Revenue at Risk</span>
                              <h4 className="mb-0 font-weight-bold">₹{tickets.reduce((acc, t) => acc + (t.status !== 'Resolved' ? (t.revenue_impact || 0) : 0), 0).toLocaleString()}</h4>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-md-6">
              <div className="card">
                  <div className="body">
                      <div className="d-flex align-items-center">
                          <div className="icon-in-bg bg-info text-white rounded-circle"><i className="fa fa-users"></i></div>
                          <div className="ml-4">
                              <span>Active Tickets</span>
                              <h4 className="mb-0 font-weight-bold">{stats.totalActive}</h4>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="col-lg-3 col-md-6">
              <div className="card">
                  <div className="body">
                      <div className="d-flex align-items-center">
                          <div className="icon-in-bg bg-warning text-white rounded-circle"><i className="fa fa-clock-o"></i></div>
                          <div className="ml-4">
                              <span>Heatmap</span>
                              <h4 className="mb-0 font-weight-bold">{stats.percentage}% Breach</h4>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header">
              <div className="row">
                <div className="col-md-2">
                  <label>Status</label>
                  <select 
                    className="form-control" 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="">All Status</option>
                    <option value="Open">Open</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting on User">Waiting on User</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label>Priority</label>
                  <select 
                    className="form-control"
                    value={filters.priority}
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  >
                    <option value="">All Priority</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label>SLA Breach</label>
                  <select 
                    className="form-control"
                    value={filters.sla_breach}
                    onChange={(e) => setFilters({...filters, sla_breach: e.target.value})}
                  >
                    <option value="false">All Tickets</option>
                    <option value="true">Breached Only</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label>User Role</label>
                  <select 
                    className="form-control"
                    value={filters.role}
                    onChange={(e) => setFilters({...filters, role: e.target.value})}
                  >
                    <option value="">All Roles</option>
                    <option value="buyer">Buyer</option>
                    <option value="artist">Artist</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-primary w-100" onClick={fetchTickets}>
                        <i className="fa fa-refresh mr-2"></i> Refresh Live Data
                    </button>
                </div>
              </div>
            </div>
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover table-custom m-b-0">
                  <thead className="thead-dark">
                    <tr>
                      <th>Ticket Code</th>
                      <th>User & Role</th>
                      <th>Category & Impact</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>SLA Deadline</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.length === 0 ? (
                      <tr><td colSpan="7" className="text-center">No tickets found</td></tr>
                    ) : (
                      tickets.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage).map((ticket) => (
                        <tr key={ticket._id} className={new Date(ticket.sla_deadline) < new Date() && !['Resolved', 'Closed'].includes(ticket.status) ? 'bg-danger-light' : ''}>
                          <td>
                              <span className="font-weight-bold text-[#5C4033] d-block">{ticket.ticket_code}</span>
                              {ticket.is_reopened && <span className="badge badge-danger">REOPENED</span>}
                          </td>
                          <td>
                            <span className="font-weight-bold">{ticket.user_id?.name} {ticket.user_id?.lastName}</span>
                            <br /><small className="text-muted text-capitalize badge badge-outline-secondary">{ticket.role}</small>
                          </td>
                          <td>
                              <span className="d-block text-xs font-weight-bold">{ticket.category}</span>
                              <span className="text-danger small font-weight-bold">₹{ticket.revenue_impact?.toLocaleString()} at risk</span>
                          </td>
                          <td><span className={getPriorityBadge(ticket.priority)}>{ticket.priority}</span></td>
                          <td><span className={`badge ${getStatusBadge(ticket.status)}`}>{ticket.status}</span></td>
                          <td>
                            <span className={new Date(ticket.sla_deadline) < new Date() && !['Resolved', 'Closed'].includes(ticket.status) ? 'text-danger font-weight-bold' : ''}>
                              {new Date(ticket.sla_deadline).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {new Date(ticket.sla_deadline) < new Date() && !['Resolved', 'Closed'].includes(ticket.status) && <div className="text-danger small">OVERDUE</div>}
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/super-admin/support/${ticket._id}`)}
                            >
                              <i className="fa fa-bolt mr-1"></i> Resolve
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 d-flex justify-content-between align-items-center">
                <div className="text-muted small">Showing {(currentPage-1)*itemsPerPage + 1} to {Math.min(currentPage*itemsPerPage, tickets.length)} of {tickets.length}</div>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                      </li>
                  )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
          .bg-danger-light {
              background-color: rgba(220, 53, 69, 0.05);
          }
          .icon-in-bg {
              width: 50px;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
          }
          .badge-indigo {
              background-color: #6610f2;
              color: white;
          }
      `}</style>
    </div>
  );
}

export default SupportTicketAdmin;
