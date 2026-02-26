import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { FaTicketAlt, FaClock, FaArrowLeft, FaPaperPlane, FaUserCircle, FaWallet, FaGavel, FaShoppingCart, FaImage, FaCheckCircle, FaLock, FaExternalLinkAlt } from 'react-icons/fa';
import getAPI from '../../../../../../../api/getAPI';
import postAPI from '../../../../../../../api/postAPI';
import putAPI from '../../../../../../../api/putAPI';
import { useAuth } from '../../../../../../../AuthContext';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { userType, userId, userrole } = useAuth();
    const [ticket, setTicket] = useState(null);

    const isDashboardLayout = location.pathname.startsWith('/artist') || 
                             location.pathname.startsWith('/seller') || 
                             location.pathname.startsWith('/super-admin');

    // Determine path prefix (for /artist, /seller, or /my-account)
    const pathPrefix = location.pathname.includes('/my-account') 
      ? '/my-account/support' 
      : location.pathname.includes('/artist')
      ? '/artist/support'
      : location.pathname.includes('/super-admin')
      ? '/super-admin/support'
      : '/seller/support';

    const dashboardHome = location.pathname.includes('/artist') 
      ? "/artist/dashboard" 
      : location.pathname.includes('/super-admin')
      ? "/super-admin/dashboard"
      : "/seller/dashboard";

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const chatEndRef = useRef(null);
    const [isInternal, setIsInternal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionConfig, setActionConfig] = useState({ type: '', title: '', message: '', confirmText: '', btnClass: '' });
    const [actionNote, setActionNote] = useState('');
    
    const role = userType?.toLowerCase();
    const isAdminUser = userType === 'Super-Admin' || userType === 'Admin' || userrole?.toLowerCase().includes('admin');

    const fetchTicket = async () => {
      try {
        const response = await getAPI(`/api/tickets/${id}`);
        if (response.data.success) {
          setTicket(response.data.ticket);
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchTicket();
    }, [id]);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e, isInternalParam = false, msg = '') => {
      if (e) e.preventDefault();
      const finalMsg = msg || newMessage;
      if (!finalMsg.trim()) return;

      setSubmitting(true);
      try {
        const response = await postAPI(`/api/tickets/${id}/message`, { 
          message: finalMsg,
          is_internal: isInternalParam || isInternal 
        });

        if (response.data.success) {
          setMessages([...messages, response.data.newMessage]);
          setNewMessage('');
          setIsInternal(false);
          fetchTicket();
        }
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
      } finally {
        setSubmitting(false);
      }
    };

    const updateTicket = async (updates) => {
      try {
        const response = await putAPI(`/api/tickets/admin/${id}`, updates);
        if (response.data.success) {
          fetchTicket();
        }
      } catch (error) {
        console.error("Error updating ticket:", error);
        if (error.response?.status === 403 || error.response?.status === 401) {
            alert("Unauthorized. You do not have permission to perform this action.");
        } else {
            alert(error.response?.data?.message || "Failed to update ticket.");
        }
      }
    };

    const handleEscalate = async () => {
      const reason = prompt("Please provide a reason for escalation (logged permanently):");
      if (!reason) return;

      try {
        const response = await postAPI(`/api/tickets/${id}/escalate`, { reason });
        if (response.data.success) {
          alert("Ticket escalated successfully. Manager/Super-Admin notified.");
          fetchTicket();
        }
      } catch (error) {
        console.error("Error escalating ticket:", error);
        alert(error.response?.data?.message || "Failed to escalate ticket");
      }
    };

    const triggerAdminAction = async (action) => {
      await updateTicket({ action });
    };

    const openActionModal = (type) => {
      let config = {};
      switch (type) {
        case 'Resolve':
          config = { 
            type: 'Resolve', 
            title: 'Resolve Ticket', 
            message: 'Are you sure you want to mark this ticket as resolved? This will notify the user.',
            confirmText: 'Mark Resolved',
            btnClass: 'btn-success'
          };
          break;
        case 'Close':
          config = { 
            type: 'Close', 
            title: 'Close Ticket', 
            message: 'Closing this ticket will lock the conversation. No further messages can be sent.',
            confirmText: 'Close Ticket',
            btnClass: 'btn-dark'
          };
          break;
        case 'Refund':
          config = { 
            type: 'Refund', 
            title: 'Process Refund', 
            message: 'This will initiate a refund process for the linked order. Please add a justification.',
            confirmText: 'Process Refund',
            btnClass: 'btn-primary'
          };
          break;
        default: break;
      }
      setActionConfig(config);
      setActionNote('');
      setShowActionModal(true);
    };

    const handleConfirmAction = async () => {
        if (actionConfig.type === 'Refund') {
            if (!actionNote.trim()) {
                alert("Please provide a reason/justification for the refund.");
                return;
            }
            // Add as internal note first
            await handleSubmit(null, true, `Refund triggered. Justification: ${actionNote}`);
            await triggerAdminAction('issue_refund');
        } else if (actionConfig.type === 'Resolve') {
            if (actionNote.trim()) {
                await handleSubmit(null, false, actionNote);
            }
            await updateTicket({ status: 'Resolved' });
        } else if (actionConfig.type === 'Close') {
            if (actionNote.trim()) {
                await handleSubmit(null, true, `Closing ticket with note: ${actionNote}`);
            }
            await updateTicket({ status: 'Closed' });
        }
        setShowActionModal(false);
    };

    if (loading) return <div className="p-8 text-center mt-5"><div className="spinner-border text-primary"></div><div className="mt-2">Loading ticket details...</div></div>;
    if (!ticket) return <div className="p-8 text-center mt-5"><div className="alert alert-warning d-inline-block">Ticket not found</div></div>;

    const getStatusStyle = (status) => {
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

    const slaDate = new Date(ticket.sla_deadline);
    const now = new Date();
    const isSlaBreached = slaDate < now && !['Resolved', 'Closed'].includes(ticket.status);

    const renderChatArea = () => (
        <div className="chat-content d-flex flex-column h-100">
            <div className="flex-grow-1 overflow-auto p-4 mb-3 border rounded bg-light shadow-inner" style={{ maxHeight: isDashboardLayout ? 'calc(100vh - 450px)' : '500px', minHeight: '400px' }}>
                {messages.map((msg) => {
                    const isMe = msg.sender_id === userId;
                    const isSupport = msg.sender_role.toLowerCase().includes('admin') || msg.sender_role.toLowerCase() === 'super-admin';

                    if (msg.system_message) {
                        return (
                            <div key={msg._id} className="text-center my-3">
                                <span className="badge badge-soft-warning py-2 px-3 border border-warning" style={{ backgroundColor: '#fff8e1', color: '#856404' }}>{msg.message}</span>
                            </div>
                        );
                    }

                    return (
                        <div key={msg._id} className={`d-flex mb-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`${isMe ? 'ml-3' : 'mr-3'}`}>
                                <div className="rounded-circle bg-white border d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <FaUserCircle className={`text-2xl ${isSupport ? 'text-primary' : 'text-muted'}`} size={30} />
                                </div>
                            </div>
                            <div style={{ maxWidth: '75%' }} className={isMe ? 'text-right' : 'text-left'}>
                                <div className={`d-flex align-items-center mb-1 ${isMe ? 'justify-content-end' : ''}`}>
                                    <small className="font-weight-bold text-uppercase text-muted" style={{ fontSize: '10px' }}>
                                        {isSupport ? 'Support Team' : (isMe ? 'You' : `${msg.sender_role}`)}
                                        {msg.is_internal && <span className="ml-2 badge badge-dark">INTERNAL</span>}
                                    </small>
                                    <small className="ml-2 text-muted" style={{ fontSize: '9px' }}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </small>
                                </div>
                                <div className={`p-3 rounded-lg shadow-sm ${
                                    msg.is_internal 
                                        ? 'bg-dark text-white'
                                        : (isMe 
                                            ? 'bg-primary text-white bubble-me' 
                                            : 'bg-white border text-dark bubble-them')
                                }`}>
                                    <p className="mb-0 text-sm" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{msg.message}</p>
                                    {msg.attachments?.length > 0 && (
                                        <div className="mt-3 row no-gutters">
                                            {msg.attachments.map((att, i) => (
                                                <div key={i} className="col-auto mr-2 mb-2">
                                                    <div className="bg-light p-2 border rounded d-flex align-items-center">
                                                        <FaImage className="text-muted mr-2" size={12} />
                                                        <small className="font-weight-bold" style={{ fontSize: '10px' }}>Attachment {i+1}</small>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            {/* Reply Area */}
            <div className="reply-area">
                {ticket.status === 'Closed' ? (
                    <div className="alert alert-secondary text-center border-0 shadow-sm py-4">
                        <FaLock className="mr-2" /> Ticket Closed. {role !== 'buyer' ? 'Audit trail preserved.' : 'You can reopen once if unsatisfied.'}
                    </div>
                ) : (
                    <div className="reply-form-wrapper bg-white p-3 rounded shadow-sm border">
                        {isAdminUser && (
                            <div className="mb-3 d-flex align-items-center bg-warning-light p-2 rounded">
                                <div className="custom-control custom-switch">
                                    <input 
                                        type="checkbox" 
                                        className="custom-control-input" 
                                        id="internalCheck" 
                                        checked={isInternal}
                                        onChange={(e) => setIsInternal(e.target.checked)}
                                    />
                                    <label className="custom-control-label small font-weight-bold text-uppercase text-warning" htmlFor="internalCheck">
                                        Post as Internal Note (Customer won't see this)
                                    </label>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="d-flex align-items-center">
                            <textarea 
                                className="form-control border-0 bg-transparent flex-grow-1 mr-3" 
                                rows="2" 
                                placeholder={isInternal ? "Write internal note here..." : "Type your message here..."}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{ resize: 'none' }}
                                disabled={submitting}
                            />
                            <button 
                                type="submit" 
                                className={`btn ${isInternal ? 'btn-warning' : 'btn-primary'} rounded-circle shadow-sm`} 
                                style={{ width: '50px', height: '50px' }}
                                disabled={submitting || !newMessage.trim()}
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSidebar = () => (
        <div className="ticket-sidebar space-y-4">
            {/* Ticket Info */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white border-bottom py-3 px-4">
                    <h2 className="h5 font-weight-bold mb-0">Ticket Info</h2>
                </div>
                <div className="card-body p-4">
                    <div className="space-y-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="small text-muted font-weight-bold">Status</span>
                            <span className={`badge ${getStatusStyle(ticket.status)}`}>{ticket.status}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="small text-muted font-weight-bold">Priority</span>
                            <span className={`font-weight-bold ${ticket.priority === 'Critical' ? 'text-danger' : ticket.priority === 'High' ? 'text-warning' : 'text-info'}`}>{ticket.priority}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="small text-muted font-weight-bold">Category</span>
                            <span className="font-weight-bold">{ticket.category}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="small text-muted font-weight-bold">Created</span>
                            <span className="small">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        {isSlaBreached && (
                            <div className="alert alert-danger p-2 mb-0 mt-2 small">
                                <FaClock className="mr-1" /> SLA BREACHED
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white border-bottom py-3 px-4">
                    <h2 className="h5 font-weight-bold mb-0">User Information</h2>
                </div>
                <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                        <FaUserCircle className="text-muted mr-3" size={30} />
                        <div>
                            <div className="font-weight-bold text-dark">{ticket.user_id?.name} {ticket.user_id?.lastName}</div>
                            <div className="small text-muted text-uppercase font-weight-bold">{ticket.role}</div>
                        </div>
                    </div>
                    <div className="small text-muted mb-2">
                        <i className="fa fa-envelope mr-2"></i> {ticket.user_id?.email}
                    </div>
                </div>
            </div>

            {/* Admin Action Center */}
            {isAdminUser && (
                <div className="card shadow-sm border-0 mb-4 bg-light">
                    <div className="card-header bg-dark text-white border-bottom py-3 px-4">
                        <h2 className="h5 font-weight-bold mb-0">Admin Action Center</h2>
                    </div>
                    <div className="card-body p-4">
                        <div className="d-grid gap-2">
                            <button 
                                onClick={() => openActionModal('Resolve')} 
                                className="btn btn-success btn-block mb-2 font-weight-bold"
                                disabled={ticket.status === 'Resolved' || ticket.status === 'Closed'}
                            >
                                <FaCheckCircle className="mr-2" /> Mark Resolved
                            </button>
                            <button 
                                onClick={() => openActionModal('Close')} 
                                className="btn btn-dark btn-block mb-2 font-weight-bold"
                                disabled={ticket.status === 'Closed'}
                            >
                                <FaLock className="mr-2" /> Close Ticket
                            </button>
                            {ticket.linked_entity_type === 'Order' && (
                                <button 
                                    onClick={() => openActionModal('Refund')} 
                                    className="btn btn-primary btn-block mb-2 font-weight-bold"
                                >
                                    <FaWallet className="mr-2" /> Process Refund
                                </button>
                            )}
                            <button 
                                onClick={handleEscalate} 
                                className="btn btn-outline-danger btn-block font-weight-bold"
                                disabled={ticket.manual_escalation_count >= 1}
                            >
                                <FaGavel className="mr-2" /> Escalate to Super-Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="ticket-detail-page p-4 bg-light min-vh-100">
            {/* Action Confirmation Modal */}
            {showActionModal && (
                <div className="modal-overlay d-flex align-items-center justify-content-center">
                    <div className="modal-content-custom bg-white rounded-lg shadow-xl overflow-hidden" style={{ maxWidth: '500px', width: '90%' }}>
                        <div className={`p-4 ${actionConfig.btnClass} text-white d-flex justify-content-between align-items-center`}>
                            <h3 className="h5 mb-0 font-weight-bold">{actionConfig.title}</h3>
                            <button onClick={() => setShowActionModal(false)} className="btn btn-sm text-white p-0" style={{ fontSize: '1.5rem', background: 'none', border: 'none' }}>&times;</button>
                        </div>
                        <div className="p-4">
                            <p className="text-dark mb-4">{actionConfig.message}</p>
                            
                            <div className="form-group mb-4">
                                <label className="small font-weight-bold text-muted text-uppercase">Reason / Note (Optional)</label>
                                <textarea 
                                    className="form-control" 
                                    rows="3" 
                                    placeholder="Enter details here..."
                                    value={actionNote}
                                    onChange={(e) => setActionNote(e.target.value)}
                                    style={{ resize: 'none' }}
                                />
                                {actionConfig.type === 'Refund' && <small className="text-danger">* Justification is mandatory for refunds.</small>}
                            </div>

                            <div className="d-flex gap-3">
                                <button 
                                    onClick={() => setShowActionModal(false)} 
                                    className="btn btn-light flex-grow-1 font-weight-bold py-2"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirmAction}
                                    className={`btn ${actionConfig.btnClass} flex-grow-1 font-weight-bold py-2 shadow-sm text-white`}
                                >
                                    {actionConfig.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.6);
                    z-index: 9999;
                    backdrop-filter: blur(2px);
                }
                .modal-content-custom {
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .gap-3 { gap: 1rem; }
                .bg-warning-light { background-color: #fff9e6 !important; }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
                .bubble-me { border-bottom-right-radius: 4px !important; }
                .bubble-them { border-bottom-left-radius: 4px !important; }
            `}} />

            {isDashboardLayout ? (
                <div className="block-header mb-4">
                    <div className="row align-items-center">
                        <div className="col-lg-8 col-md-6 col-sm-12">
                            <h2 className="font-weight-bold mb-1">Ticket: {ticket.ticket_code}</h2>
                            <ul className="breadcrumb bg-transparent p-0 mb-0">
                                <li className="breadcrumb-item">
                                    <Link to={dashboardHome}><i className="fa fa-dashboard"></i> Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item">Support</li>
                                <li className="breadcrumb-item">
                                    <Link to={pathPrefix}>Tickets</Link>
                                </li>
                                <li className="breadcrumb-item active">{ticket.ticket_code}</li>
                            </ul>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 text-md-right mt-3 mt-md-0">
                            <button onClick={() => navigate(pathPrefix)} className="btn btn-secondary shadow-sm">
                                <FaArrowLeft className="mr-2" /> Back to List
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row mb-5 align-items-center">
                    <div className="col">
                        <div className="d-flex align-items-center">
                            <button 
                                onClick={() => navigate(pathPrefix)}
                                className="btn btn-white shadow-sm rounded-circle mr-4"
                                style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: 'none' }}
                            >
                                <FaArrowLeft />
                            </button>
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <span className="badge badge-primary px-3 py-1 mr-2 shadow-sm">
                                        {ticket.ticket_code}
                                    </span>
                                    <span className={`badge ${getStatusStyle(ticket.status)} px-3 py-1 shadow-sm`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <h1 className="h3 font-weight-bold mb-0 text-dark">{ticket.subject}</h1>
                                <p className="text-muted mb-0 mt-1">{ticket.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row clearfix">
                <div className="col-lg-8 col-md-12">
                    <div className="card shadow-sm border-0 mb-4 h-100">
                        <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                            <h2 className="h5 font-weight-bold mb-0">Conversation</h2>
                            <span className="small text-muted">
                                <i className="fa fa-users mr-1"></i> {messages.length} Messages
                            </span>
                        </div>
                        <div className="card-body p-0">
                            {renderChatArea()}
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-12">
                    {renderSidebar()}
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;
