import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { FaTicketAlt, FaClock, FaArrowLeft, FaPaperPlane, FaUserCircle, FaImage, FaCheckCircle, FaLock, FaHistory, FaTag, FaFlag } from 'react-icons/fa';
import getAPI from '../../../../../../../api/getAPI';
import postAPI from '../../../../../../../api/postAPI';
import { useAuth } from '../../../../../../../AuthContext';

const BuyerTicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useAuth();
    
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const chatEndRef = useRef(null);
    
    const pathPrefix = '/my-account/support';

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

    const handleSubmit = async (e) => {
      if (e) e.preventDefault();
      if (!newMessage.trim()) return;

      setSubmitting(true);
      try {
        const response = await postAPI(`/api/tickets/${id}/message`, { 
          message: newMessage,
          is_internal: false 
        });

        if (response.data.success) {
          setMessages([...messages, response.data.newMessage]);
          setNewMessage('');
          fetchTicket();
        }
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
      } finally {
        setSubmitting(false);
      }
    };

    if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#6F4D34] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading ticket conversation...</p>
      </div>
    );

    if (!ticket) return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center">
        <FaTicketAlt className="mx-auto text-3xl mb-3 opacity-50" />
        <h3 className="text-xl font-bold">Ticket Not Found</h3>
        <p className="mt-2 text-amber-700/80">The ticket you're looking for doesn't exist or you don't have access to it.</p>
        <button 
          onClick={() => navigate(pathPrefix)}
          className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-full font-bold hover:bg-amber-700 transition-colors"
        >
          Back to Tickets
        </button>
      </div>
    );

    const getStatusStyle = (status) => {
      switch (status) {
        case 'Open': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' };
        case 'In Progress': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' };
        case 'Resolved': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
        case 'Closed': return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
        case 'Waiting on User': return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' };
        default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100' };
      }
    };

    const getPriorityStyle = (priority) => {
      switch (priority) {
        case 'Critical': return 'text-red-600';
        case 'High': return 'text-orange-600';
        case 'Normal': return 'text-blue-600';
        default: return 'text-gray-500';
      }
    };

    const statusStyle = getStatusStyle(ticket.status);

    return (
      <div className="w-full space-y-6 pb-12 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(pathPrefix)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-[#6F4D34] hover:text-white hover:border-[#6F4D34] transition-all"
            >
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-extrabold text-[#6F4D34] bg-[#6F4D34]/5 px-2 py-0.5 rounded border border-[#6F4D34]/10 tracking-widest uppercase">
                  {ticket.ticket_code}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusStyle.border} ${statusStyle.bg} ${statusStyle.text} uppercase tracking-wider`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Created On</p>
              <p className="text-sm font-semibold text-gray-800">{new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="w-px h-8 bg-gray-100 hidden sm:block"></div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Category</p>
              <p className="text-sm font-bold text-[#6F4D34]">{ticket.category}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Chat Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden flex flex-col min-h-[500px] max-h-[700px]">
              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <FaHistory className="text-4xl mb-3 text-gray-300" />
                    <p className="text-gray-500 font-medium">No messages yet. Our team will respond shortly.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender_id === userId;
                    const isSupport = msg.sender_role.toLowerCase().includes('admin') || msg.sender_role.toLowerCase() === 'super-admin';
                    
                    if (msg.system_message) {
                      return (
                        <div key={msg._id} className="flex justify-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full border border-amber-100 shadow-sm">
                            {msg.message}
                          </span>
                        </div>
                      );
                    }

                    if (msg.is_internal) return null; // Buyer never sees internal notes

                    return (
                      <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="flex-shrink-0 mt-1">
                            {isSupport ? (
                              <div className="w-9 h-9 rounded-full bg-[#6F4D34]/10 border border-[#6F4D34]/20 flex items-center justify-center text-[#6F4D34]">
                                <FaUserCircle size={22} />
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                <FaUserCircle size={22} />
                              </div>
                            )}
                          </div>
                          <div className={`space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 mb-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                {isSupport ? 'Artsays Support' : (isMe ? 'You' : msg.sender_role)}
                              </span>
                              <span className="text-[9px] text-gray-400 font-medium">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className={`px-3 py-2 rounded-2xl shadow-sm text-sm leading-relaxed ${
                              isMe 
                                ? 'bg-[#6F4D34] text-white rounded-tr-none' 
                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                            }`}>
                              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                              {msg.attachments?.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  {msg.attachments.map((att, i) => (
                                    <div key={i} className={`p-2 rounded-xl flex items-center gap-2 text-[10px] font-bold ${isMe ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-500'}`}>
                                      <FaImage size={12} />
                                      <span>Attachment {i + 1}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Reply Area */}
              <div className="p-6 bg-white border-t border-gray-100">
                {ticket.status === 'Closed' ? (
                  <div className="bg-gray-50 p-6 rounded-2xl text-center border border-dashed border-gray-200">
                    <FaLock className="mx-auto text-gray-300 text-xl mb-2" />
                    <p className="text-gray-500 text-sm font-medium">This ticket is closed. You can't send further messages.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative">
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2 !pr-20 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 transition resize-none scrollbar-hide" 
                      rows="2" 
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={submitting}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                    <button 
                      type="submit" 
                      className="absolute right-3 bottom-3 w-12 h-12 bg-[#6F4D34] text-white rounded-xl shadow-lg shadow-[#6F4D34]/20 flex items-center justify-center hover:bg-[#5a3e2a] transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                      disabled={submitting || !newMessage.trim()}
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <FaPaperPlane className="transform rotate-12 ml-[-2px] mt-[-2px]" />
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Ticket Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-8">
              <div>
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <FaTag className="text-[#6F4D34]/40" /> Ticket Details
                </h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Priority</span>
                    <span className={`text-sm font-bold ${getPriorityStyle(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Created At</span>
                    <span className="text-sm font-bold text-gray-800">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <FaFlag className="text-[#6F4D34]/40" /> Associated With
                </h3>
                <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wider">Type</span>
                    <span className="font-bold text-[#6F4D34]">{ticket.linked_entity_type || 'None'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wider">Ref. ID</span>
                    <span className="font-bold text-gray-800">#{ticket.linked_entity_id || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {ticket.status === 'Resolved' && (
                <div className="pt-8 border-t border-gray-50">
                  <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <FaCheckCircle size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900 mb-1">Issue Resolved</h4>
                      <p className="text-xs text-emerald-800/70 leading-relaxed font-medium">
                        This ticket has been marked as resolved. If you're still facing issues, you can send a message to reopen it.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4 shadow-sm shadow-amber-900/5">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-amber-500 shrink-0 shadow-sm border border-amber-200/50">
                <FaClock size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900 mb-1 tracking-tight">Our Support SLA</h4>
                <p className="text-xs text-amber-800/60 leading-relaxed font-medium">
                  We aim to respond to all tickets within 24-48 business hours. Your patience is appreciated!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default BuyerTicketDetail;
