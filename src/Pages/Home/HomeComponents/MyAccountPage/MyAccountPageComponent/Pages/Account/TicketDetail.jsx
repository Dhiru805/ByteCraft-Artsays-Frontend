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

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px' }}>
            <div className="spinner-border text-primary"></div>
            <div className="text-muted small">Loading ticket details...</div>
        </div>
    );
    if (!ticket) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <div className="alert alert-warning d-inline-block">Ticket not found</div>
        </div>
    );

    const getStatusConfig = (status) => {
      switch (status) {
        case 'Open':           return { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' };
        case 'In Progress':    return { bg: '#fff8e1', color: '#f57f17', border: '#ffe082' };
        case 'Resolved':       return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' };
        case 'Closed':         return { bg: '#f5f5f5', color: '#424242', border: '#bdbdbd' };
        case 'Waiting on User':return { bg: '#ede7f6', color: '#4527a0', border: '#b39ddb' };
        case 'Assigned':       return { bg: '#e8eaf6', color: '#283593', border: '#9fa8da' };
        default:               return { bg: '#f5f5f5', color: '#616161', border: '#e0e0e0' };
      }
    };

    const getPriorityConfig = (priority) => {
      switch (priority) {
        case 'Critical': return { color: '#c62828', bg: '#ffebee', icon: '🔴' };
        case 'High':     return { color: '#e65100', bg: '#fff3e0', icon: '🟠' };
        case 'Medium':   return { color: '#f57f17', bg: '#fffde7', icon: '🟡' };
        case 'Low':      return { color: '#2e7d32', bg: '#e8f5e9', icon: '🟢' };
        default:         return { color: '#616161', bg: '#f5f5f5', icon: '⚪' };
      }
    };

    const slaDate = new Date(ticket.sla_deadline);
    const now = new Date();
    const isSlaBreached = slaDate < now && !['Resolved', 'Closed'].includes(ticket.status);

    const statusCfg = getStatusConfig(ticket.status);
    const priorityCfg = getPriorityConfig(ticket.priority);

    const styles = `
        .td-page { min-height: 100vh; }
        .td-header-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            padding: 20px 24px;
            margin-bottom: 20px;
            border: 1px solid #e8ecf0;
        }
        .td-ticket-code {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #5c6bc0;
            background: #e8eaf6;
            border-radius: 20px;
            padding: 4px 12px;
            display: inline-block;
            margin-bottom: 6px;
        }
        .td-subject { font-size: 18px; font-weight: 700; color: #1a1f36; margin: 0; }
        .td-category { font-size: 12px; color: #8898aa; margin-top: 3px; }
        .td-status-badge {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            border-radius: 20px;
            padding: 5px 14px;
            display: inline-block;
            border: 1px solid;
        }
        .td-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: #f4f6f9;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            color: #525f7f;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
        }
        .td-back-btn:hover { background: #e8ecf0; color: #1a1f36; text-decoration: none; }

        .td-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            border: 1px solid #e8ecf0;
            overflow: hidden;
            margin-bottom: 20px;
        }
        .td-card-header {
            padding: 14px 20px;
            border-bottom: 1px solid #e8ecf0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
        }
        .td-card-title {
            font-size: 14px;
            font-weight: 700;
            color: #1a1f36;
            margin: 0;
        }

        /* Chat */
        .td-chat-scroll {
            overflow-y: auto;
            padding: 20px;
            background: #f8fafc;
        }
        .td-sys-msg {
            text-align: center;
            margin: 12px 0;
        }
        .td-sys-badge {
            display: inline-block;
            background: #fff8e1;
            color: #856404;
            border: 1px solid #ffe082;
            border-radius: 20px;
            padding: 4px 14px;
            font-size: 11px;
            font-weight: 600;
        }
        .td-msg-row {
            display: flex;
            margin-bottom: 20px;
            gap: 10px;
        }
        .td-msg-row.me { flex-direction: row-reverse; }
        .td-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #e8eaf6;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border: 2px solid #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
        .td-avatar.support { background: #e3f2fd; }
        .td-bubble-wrap { max-width: 70%; }
        .td-bubble-wrap.me { align-items: flex-end; display: flex; flex-direction: column; }
        .td-meta {
            font-size: 10px;
            color: #8898aa;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .td-meta.me { justify-content: flex-end; }
        .td-bubble {
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 13.5px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
        }
        .td-bubble.them {
            background: #fff;
            border: 1px solid #e8ecf0;
            border-top-left-radius: 4px;
            color: #1a1f36;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .td-bubble.me {
            background: #5c6bc0;
            border-top-right-radius: 4px;
            color: #fff;
        }
        .td-bubble.internal {
            background: #1a1f36;
            color: #fff;
            border: 1px dashed #5c6bc0;
            border-radius: 8px;
        }
        .td-internal-tag {
            display: inline-block;
            background: #5c6bc0;
            color: #fff;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1px;
            padding: 2px 8px;
            border-radius: 10px;
            text-transform: uppercase;
        }
        .td-attachment {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.15);
            border-radius: 6px;
            padding: 4px 10px;
            margin-top: 8px;
            margin-right: 6px;
            font-size: 11px;
        }

        /* Reply Box */
        .td-reply-box {
            padding: 16px 20px;
            background: #fff;
            border-top: 1px solid #e8ecf0;
        }
        .td-internal-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #fff8e1;
            border: 1px solid #ffe082;
            border-radius: 8px;
            padding: 8px 12px;
            margin-bottom: 12px;
            font-size: 12px;
            font-weight: 600;
            color: #856404;
        }
        .td-reply-row {
            display: flex;
            gap: 10px;
            align-items: flex-end;
        }
        .td-textarea {
            flex: 1;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 13.5px;
            resize: none;
            outline: none;
            background: #f8fafc;
            transition: border 0.2s;
            font-family: inherit;
            color: #1a1f36;
        }
        .td-textarea:focus { border-color: #5c6bc0; background: #fff; }
        .td-send-btn {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            flex-shrink: 0;
            font-size: 15px;
        }
        .td-send-btn.normal { background: #5c6bc0; color: #fff; }
        .td-send-btn.internal-mode { background: #f57f17; color: #fff; }
        .td-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .td-send-btn:not(:disabled):hover { transform: scale(1.06); }
        .td-closed-notice {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 20px;
            background: #f5f5f5;
            border-top: 1px solid #e0e0e0;
            color: #757575;
            font-size: 13px;
            font-weight: 600;
        }

        /* Sidebar */
        .td-info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 9px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 13px;
        }
        .td-info-row:last-child { border-bottom: none; }
        .td-info-label { color: #8898aa; font-weight: 600; font-size: 12px; }
        .td-info-value { font-weight: 600; color: #1a1f36; }
        .td-sla-alert {
            display: flex;
            align-items: center;
            gap: 6px;
            background: #ffebee;
            border: 1px solid #ef9a9a;
            border-radius: 8px;
            padding: 8px 12px;
            color: #c62828;
            font-size: 12px;
            font-weight: 700;
            margin-top: 10px;
        }
        .td-user-block {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f0f0f0;
            margin-bottom: 12px;
        }
        .td-user-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #e8eaf6;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #5c6bc0;
            flex-shrink: 0;
        }
        .td-user-name { font-weight: 700; color: #1a1f36; font-size: 14px; }
        .td-user-role {
            display: inline-block;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #5c6bc0;
            background: #e8eaf6;
            border-radius: 10px;
            padding: 2px 8px;
        }
        .td-user-email { font-size: 12px; color: #8898aa; margin-top: 4px; }
        .td-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 10px 16px;
            border-radius: 8px;
            border: none;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 8px;
        }
        .td-action-btn:last-child { margin-bottom: 0; }
        .td-action-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .td-action-btn.resolve { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
        .td-action-btn.resolve:not(:disabled):hover { background: #2e7d32; color: #fff; }
        .td-action-btn.close-t { background: #f5f5f5; color: #424242; border: 1px solid #bdbdbd; }
        .td-action-btn.close-t:not(:disabled):hover { background: #424242; color: #fff; }
        .td-action-btn.refund { background: #e3f2fd; color: #1565c0; border: 1px solid #90caf9; }
        .td-action-btn.refund:not(:disabled):hover { background: #1565c0; color: #fff; }
        .td-action-btn.escalate { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
        .td-action-btn.escalate:not(:disabled):hover { background: #c62828; color: #fff; }

        /* Modal */
        .td-modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(26,31,54,0.6);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(3px);
        }
        .td-modal {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            width: 90%;
            max-width: 480px;
            overflow: hidden;
            animation: tdSlideIn 0.25s ease-out;
        }
        @keyframes tdSlideIn {
            from { transform: translateY(-16px) scale(0.97); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .td-modal-head {
            padding: 18px 22px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e8ecf0;
        }
        .td-modal-title { font-size: 16px; font-weight: 700; color: #1a1f36; margin: 0; }
        .td-modal-close {
            width: 30px; height: 30px; border-radius: 50%; border: none;
            background: #f4f6f9; color: #525f7f; font-size: 16px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
        }
        .td-modal-close:hover { background: #e0e0e0; }
        .td-modal-body { padding: 22px; }
        .td-modal-msg { font-size: 13.5px; color: #525f7f; margin-bottom: 18px; line-height: 1.6; }
        .td-modal-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #8898aa; letter-spacing: 0.8px; margin-bottom: 6px; }
        .td-modal-textarea {
            width: 100%; border: 1px solid #e0e0e0; border-radius: 8px;
            padding: 10px 12px; font-size: 13.5px; resize: none; outline: none;
            font-family: inherit; color: #1a1f36; background: #f8fafc;
        }
        .td-modal-textarea:focus { border-color: #5c6bc0; background: #fff; }
        .td-modal-foot {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        .td-modal-cancel {
            flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #e0e0e0;
            background: #f4f6f9; color: #525f7f; font-size: 13px; font-weight: 600; cursor: pointer;
        }
        .td-modal-cancel:hover { background: #e8ecf0; }
        .td-modal-confirm {
            flex: 1; padding: 10px; border-radius: 8px; border: none;
            font-size: 13px; font-weight: 700; cursor: pointer; color: #fff;
        }
        .td-modal-confirm.success { background: #2e7d32; }
        .td-modal-confirm.dark { background: #424242; }
        .td-modal-confirm.primary { background: #1565c0; }
        .td-modal-confirm:hover { opacity: 0.9; }

        /* Breadcrumb fix */
        .td-page .breadcrumb { background: transparent; padding: 0; margin: 0; }
    `;

    const renderChatArea = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div
                className="td-chat-scroll"
                style={{ flexGrow: 1, maxHeight: isDashboardLayout ? 'calc(100vh - 420px)' : '460px', minHeight: '340px' }}
            >
                {messages.map((msg) => {
                    const isMe = msg.sender_id === userId;
                    const isSupport = msg.sender_role?.toLowerCase().includes('admin') || msg.sender_role?.toLowerCase() === 'super-admin';

                    if (msg.system_message) {
                        return (
                            <div key={msg._id} className="td-sys-msg">
                                <span className="td-sys-badge">{msg.message}</span>
                            </div>
                        );
                    }

                    return (
                        <div key={msg._id} className={`td-msg-row ${isMe ? 'me' : ''}`}>
                            <div className={`td-avatar ${isSupport ? 'support' : ''}`}>
                                <FaUserCircle size={20} color={isSupport ? '#1565c0' : '#8898aa'} />
                            </div>
                            <div className={`td-bubble-wrap ${isMe ? 'me' : ''}`}>
                                <div className={`td-meta ${isMe ? 'me' : ''}`}>
                                    <span>
                                        {isSupport ? 'Support Team' : (isMe ? 'You' : msg.sender_role)}
                                    </span>
                                    {msg.is_internal && <span className="td-internal-tag">Internal</span>}
                                    <span style={{ fontWeight: 400, fontSize: '9px' }}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`td-bubble ${msg.is_internal ? 'internal' : isMe ? 'me' : 'them'}`}>
                                    {msg.message}
                                    {msg.attachments?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                                            {msg.attachments.map((att, i) => (
                                                <span key={i} className="td-attachment">
                                                    <FaImage size={10} /> Attachment {i + 1}
                                                </span>
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
            {ticket.status === 'Closed' ? (
                <div className="td-closed-notice">
                    <FaLock size={13} />
                    <span>Ticket Closed. {role !== 'buyer' ? 'Audit trail preserved.' : 'You can reopen once if unsatisfied.'}</span>
                </div>
            ) : (
                <div className="td-reply-box">
                    {isAdminUser && (
                        <div className="td-internal-toggle">
                            <input
                                type="checkbox"
                                id="internalCheck"
                                checked={isInternal}
                                onChange={(e) => setIsInternal(e.target.checked)}
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <label htmlFor="internalCheck" style={{ margin: 0, cursor: 'pointer' }}>
                                Post as Internal Note &mdash; Customer won't see this
                            </label>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="td-reply-row">
                        <textarea
                            className="td-textarea"
                            rows="2"
                            placeholder={isInternal ? "Write internal note..." : "Type your message..."}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={submitting}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
                            }}
                        />
                        <button
                            type="submit"
                            className={`td-send-btn ${isInternal ? 'internal-mode' : 'normal'}`}
                            disabled={submitting || !newMessage.trim()}
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );

    const renderSidebar = () => (
        <>
            {/* Ticket Info */}
            <div className="td-card">
                <div className="td-card-header">
                    <span className="td-card-title">Ticket Details</span>
                </div>
                <div style={{ padding: '4px 20px 12px' }}>
                    <div className="td-info-row">
                        <span className="td-info-label">Status</span>
                        <span
                            className="td-status-badge"
                            style={{ background: statusCfg.bg, color: statusCfg.color, borderColor: statusCfg.border }}
                        >
                            {ticket.status}
                        </span>
                    </div>
                    <div className="td-info-row">
                        <span className="td-info-label">Priority</span>
                        <span style={{
                            background: priorityCfg.bg, color: priorityCfg.color,
                            fontWeight: 700, fontSize: '12px', padding: '3px 10px',
                            borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                            {priorityCfg.icon} {ticket.priority}
                        </span>
                    </div>
                    <div className="td-info-row">
                        <span className="td-info-label">Category</span>
                        <span className="td-info-value">{ticket.category}</span>
                    </div>
                    <div className="td-info-row">
                        <span className="td-info-label">Created</span>
                        <span className="td-info-value" style={{ fontWeight: 500 }}>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="td-info-row">
                        <span className="td-info-label">Messages</span>
                        <span className="td-info-value">{messages.length}</span>
                    </div>
                    {isSlaBreached && (
                        <div className="td-sla-alert">
                            <FaClock size={12} /> SLA BREACHED
                        </div>
                    )}
                </div>
            </div>

            {/* User Info */}
            <div className="td-card">
                <div className="td-card-header">
                    <span className="td-card-title">User Information</span>
                </div>
                <div style={{ padding: '16px 20px' }}>
                    <div className="td-user-block">
                        <div className="td-user-avatar">
                            <FaUserCircle size={24} />
                        </div>
                        <div>
                            <div className="td-user-name">
                                {ticket.user_id?.name} {ticket.user_id?.lastName}
                            </div>
                            <span className="td-user-role">{ticket.role}</span>
                        </div>
                    </div>
                    <div className="td-user-email">
                        <i className="fa fa-envelope" style={{ marginRight: '6px' }}></i>
                        {ticket.user_id?.email}
                    </div>
                </div>
            </div>

            {/* Admin Action Center */}
            {isAdminUser && (
                <div className="td-card">
                    <div className="td-card-header" style={{ background: '#1a1f36' }}>
                        <span className="td-card-title" style={{ color: '#fff' }}>Admin Actions</span>
                    </div>
                    <div style={{ padding: '16px 20px' }}>
                        <button
                            className="td-action-btn resolve"
                            onClick={() => openActionModal('Resolve')}
                            disabled={ticket.status === 'Resolved' || ticket.status === 'Closed'}
                        >
                            <FaCheckCircle size={13} /> Mark Resolved
                        </button>
                        <button
                            className="td-action-btn close-t"
                            onClick={() => openActionModal('Close')}
                            disabled={ticket.status === 'Closed'}
                        >
                            <FaLock size={13} /> Close Ticket
                        </button>
                        {ticket.linked_entity_type === 'Order' && (
                            <button
                                className="td-action-btn refund"
                                onClick={() => openActionModal('Refund')}
                            >
                                <FaWallet size={13} /> Process Refund
                            </button>
                        )}
                        <button
                            className="td-action-btn escalate"
                            onClick={handleEscalate}
                            disabled={ticket.manual_escalation_count >= 1}
                        >
                            <FaGavel size={13} /> Escalate to Super-Admin
                        </button>
                    </div>
                </div>
            )}
        </>
    );

    const modalConfirmClass = actionConfig.btnClass === 'btn-success' ? 'success' : actionConfig.btnClass === 'btn-dark' ? 'dark' : 'primary';

    return (
        <div className="td-page p-4">
            <style>{styles}</style>

            {/* Action Modal */}
            {showActionModal && (
                <div className="td-modal-overlay">
                    <div className="td-modal">
                        <div className="td-modal-head">
                            <h3 className="td-modal-title">{actionConfig.title}</h3>
                            <button className="td-modal-close" onClick={() => setShowActionModal(false)}>&times;</button>
                        </div>
                        <div className="td-modal-body">
                            <p className="td-modal-msg">{actionConfig.message}</p>
                            <div>
                                <div className="td-modal-label">
                                    Reason / Note {actionConfig.type === 'Refund' ? <span style={{ color: '#c62828' }}>*</span> : '(Optional)'}
                                </div>
                                <textarea
                                    className="td-modal-textarea"
                                    rows="3"
                                    placeholder="Enter details here..."
                                    value={actionNote}
                                    onChange={(e) => setActionNote(e.target.value)}
                                />
                                {actionConfig.type === 'Refund' && (
                                    <small style={{ color: '#c62828', fontSize: '11px' }}>* Justification is mandatory for refunds.</small>
                                )}
                            </div>
                            <div className="td-modal-foot">
                                <button className="td-modal-cancel" onClick={() => setShowActionModal(false)}>Cancel</button>
                                <button className={`td-modal-confirm ${modalConfirmClass}`} onClick={handleConfirmAction}>
                                    {actionConfig.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
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
                            <button onClick={() => navigate(pathPrefix)} className="td-back-btn">
                                <FaArrowLeft size={12} /> Back to Tickets
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="td-header-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => navigate(pathPrefix)} className="td-back-btn" style={{ flexShrink: 0 }}>
                            <FaArrowLeft size={12} /> Back
                        </button>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                <span className="td-ticket-code" style={{ marginBottom: 0 }}>{ticket.ticket_code}</span>
                                <span
                                    className="td-status-badge"
                                    style={{ background: statusCfg.bg, color: statusCfg.color, borderColor: statusCfg.border }}
                                >
                                    {ticket.status}
                                </span>
                            </div>
                            <h1 className="td-subject">{ticket.subject}</h1>
                            <div className="td-category">{ticket.category}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ticket subject header for dashboard layout */}
            {isDashboardLayout && (
                <div className="td-header-card" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span className="td-ticket-code" style={{ marginBottom: 0 }}>{ticket.ticket_code}</span>
                                <span
                                    className="td-status-badge"
                                    style={{ background: statusCfg.bg, color: statusCfg.color, borderColor: statusCfg.border }}
                                >
                                    {ticket.status}
                                </span>
                                <span style={{
                                    background: priorityCfg.bg, color: priorityCfg.color,
                                    fontWeight: 700, fontSize: '11px', padding: '3px 10px',
                                    borderRadius: '20px', border: `1px solid ${priorityCfg.bg}`
                                }}>
                                    {priorityCfg.icon} {ticket.priority}
                                </span>
                            </div>
                            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1a1f36' }}>{ticket.subject}</h2>
                            <div className="td-category">{ticket.category}</div>
                        </div>
                        {isSlaBreached && (
                            <div className="td-sla-alert" style={{ marginTop: 0 }}>
                                <FaClock size={12} /> SLA BREACHED
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Layout */}
            <div className="row clearfix">
                <div className="col-lg-8 col-md-12">
                    <div className="td-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="td-card-header">
                            <span className="td-card-title">Conversation</span>
                            <span style={{ fontSize: '12px', color: '#8898aa' }}>
                                {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                            </span>
                        </div>
                        {renderChatArea()}
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
