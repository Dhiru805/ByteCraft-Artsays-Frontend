import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaTicketAlt, FaClock, FaChevronRight } from 'react-icons/fa';
import getAPI from '../../../../../../../api/getAPI';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const isDashboardLayout = location.pathname.startsWith('/artist') || location.pathname.startsWith('/seller');

    // Determine path prefix (for /artist, /seller, or /my-account)
    const pathPrefix = location.pathname.includes('/my-account') 
      ? '/my-account/support' 
      : location.pathname.includes('/artist')
      ? '/artist/support'
      : location.pathname.includes('/super-admin')
      ? '/super-admin/support'
      : '/seller/support';

    useEffect(() => {
      const fetchTickets = async () => {
        try {
          const response = await getAPI('/api/tickets/my-tickets');
          if (response.data.success) {
            setTickets(response.data.tickets);
          }
        } catch (error) {
          console.error("Error fetching tickets:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTickets();
    }, []);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Open': 
                return { 
                    bg: 'bg-blue-50', 
                    text: 'text-blue-600', 
                    border: 'border-blue-100',
                    icon: <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                };
            case 'In Progress': 
                return { 
                    bg: 'bg-amber-50', 
                    text: 'text-amber-600', 
                    border: 'border-amber-100',
                    icon: <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                };
            case 'Resolved': 
                return { 
                    bg: 'bg-emerald-50', 
                    text: 'text-emerald-600', 
                    border: 'border-emerald-100',
                    icon: <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                };
            case 'Closed': 
                return { 
                    bg: 'bg-gray-50', 
                    text: 'text-gray-500', 
                    border: 'border-gray-200',
                    icon: <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                };
            case 'Waiting on User': 
                return { 
                    bg: 'bg-indigo-50', 
                    text: 'text-indigo-600', 
                    border: 'border-indigo-100',
                    icon: <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                };
            default: 
                return { 
                    bg: 'bg-gray-50', 
                    text: 'text-gray-500', 
                    border: 'border-gray-100',
                    icon: <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                };
        }
    };

    if (loading) return (
        <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#6F4D34] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading your tickets...</p>
        </div>
    );

    const renderTicketsContent = () => {
        if (tickets.length === 0) {
            return (
                <div className="bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                        <FaTicketAlt className="text-gray-300 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">No support tickets</h3>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto text-sm">
                        You haven't raised any support tickets yet. If you're facing any issues with your orders or account, we're here to help!
                    </p>
                    <button
                        onClick={() => navigate(`${pathPrefix}/raise`)}
                        className="mt-8 px-8 py-3 bg-[#6F4D34] text-white rounded-xl font-bold text-sm hover:bg-[#5a3e2a] transition shadow-lg shadow-[#6F4D34]/20 active:scale-95"
                    >
                        Raise First Ticket
                    </button>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            <th className="pb-2 px-6">Ticket Details</th>
                            <th className="pb-2 px-6 hidden md:table-cell">Category</th>
                            <th className="pb-2 px-6 text-center">Status</th>
                            <th className="pb-2 px-6 hidden sm:table-cell text-right">Created Date</th>
                            <th className="pb-2 px-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => {
                            const status = getStatusInfo(ticket.status);
                            const createdDate = new Date(ticket.createdAt);

                            return (
                                <tr 
                                    key={ticket._id} 
                                    onClick={() => navigate(`${pathPrefix}/${ticket._id}`)} 
                                    className="bg-white transition-all duration-300 cursor-pointer"
                                >
                                    <td className="py-2 px-3 rounded-l-2xl border-y border-l border-gray-100 group-hover:border-[#6F4D34]/20 group-hover:bg-gray-50/30">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[10px] font-extrabold text-[#6F4D34] bg-[#6F4D34]/5 px-2 py-0.5 rounded border border-[#6F4D34]/10 tracking-wider w-fit">
                                                {ticket.ticket_code}
                                            </span>
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-[#6F4D34] transition-colors line-clamp-1">
                                                {ticket.subject}
                                            </p>
                                            <div className="flex items-center gap-2 md:hidden">
                                                <span className="text-[10px] font-medium text-gray-400">{ticket.category}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                <span className="text-[10px] font-medium text-gray-400">{createdDate.toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="py-2 px-3 border-y border-gray-100 group-hover:border-[#6F4D34]/20 group-hover:bg-gray-50/30 hidden md:table-cell">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700">{ticket.category}</span>
                                            {ticket.orderId && (
                                                <span className="text-[10px] font-medium text-gray-400 mt-0.5">Order: #{ticket.orderId}</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-2 px-3 border-y border-gray-100 group-hover:border-[#6F4D34]/20 group-hover:bg-gray-50/30 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${status.bg} ${status.text} ${status.border} font-bold text-[10px] uppercase tracking-wider`}>
                                            {status.icon}
                                            {ticket.status}
                                        </div>
                                    </td>

                                    <td className="py-2 px-3 border-y border-gray-100 group-hover:border-[#6F4D34]/20 group-hover:bg-gray-50/30 hidden sm:table-cell text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-gray-600">{createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="text-[10px] font-medium text-gray-400 mt-0.5 flex items-center gap-1">
                                                <FaClock className="text-[8px]" /> {createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-2 px-3 rounded-r-2xl border-y border-r border-gray-100 group-hover:border-[#6F4D34]/20 group-hover:bg-gray-50/30 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-50 hover:bg-[#6F4D34]/10 flex items-center justify-center transition-colors">
                                                <FaChevronRight className="text-gray-300 hover:text-[#6F4D34] text-xs transition-colors" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    if (isDashboardLayout) {
        return (
            <div className="container-fluid">
                <div className="block-header">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <h2>Support Tickets</h2>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={location.pathname.includes('/artist') ? "/artist/dashboard" : "/seller/dashboard"}><i className="fa fa-dashboard"></i></Link>
                                </li>
                                <li className="breadcrumb-item">Support</li>
                                <li className="breadcrumb-item active">Tickets</li>
                            </ul>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="d-none d-md-flex flex-row-reverse">
                                <div className="page_action">
                                    <button
                                        onClick={() => navigate(`${pathPrefix}/raise`)}
                                        className="btn btn-secondary"
                                    >
                                        Raise Ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix">
                    <div className="col-lg-12 col-md-12">
                        <div className="card">
                            <div className="header">
                                <h2>My Support Tickets <small>Track and manage your support requests</small></h2>
                            </div>
                            <div className="body">
                                {renderTicketsContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Buyer My Account Layout
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
                    <p className="text-sm text-gray-500 mt-1">Need help? Track and manage your support requests</p>
                </div>
                <button
                    onClick={() => navigate(`${pathPrefix}/raise`)}
                    className="px-6 py-2.5 bg-[#6F4D34] text-white rounded-xl font-bold text-sm hover:bg-[#5a3e2a] transition shadow-lg shadow-[#6F4D34]/20 active:scale-95"
                >
                    Raise Ticket
                </button>
            </div>
            <div className="bg-white/50 rounded-3xl border border-gray-100 p-2 sm:p-6 overflow-visible">
                {renderTicketsContent()}
            </div>
        </div>
    );
};

export default SupportTickets;
