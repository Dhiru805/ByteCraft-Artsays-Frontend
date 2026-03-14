import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaTicketAlt, FaClock, FaChevronRight, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import getAPI from '../../../../../../../api/getAPI';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const isDashboardLayout = location.pathname.startsWith('/artist') || location.pathname.startsWith('/seller');

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
                return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-500', pulse: true };
            case 'In Progress':
                return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500', pulse: false };
            case 'Resolved':
                return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500', pulse: false };
            case 'Closed':
                return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400', pulse: false };
            case 'Waiting on User':
                return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', dot: 'bg-indigo-500', pulse: true };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-100', dot: 'bg-gray-300', pulse: false };
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchSearch = !search || t.subject?.toLowerCase().includes(search.toLowerCase()) || t.ticket_code?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || t.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (loading) return (
        <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#6F4D34] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading your tickets...</p>
        </div>
    );

    /* ─── DASHBOARD LAYOUT (Artist / Seller) ─── */
    if (isDashboardLayout) {
        return (
            <div className="container-fluid">
                {/* Breadcrumb header */}
                <div className="block-header">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <h2>Support Tickets</h2>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={location.pathname.includes('/artist') ? "/artist/dashboard" : "/seller/dashboard"}>
                                        <i className="fa fa-dashboard"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">Support</li>
                                <li className="breadcrumb-item active">Tickets</li>
                            </ul>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="d-none d-md-flex flex-row-reverse">
                                <div className="page_action">
                                    <button onClick={() => navigate(`${pathPrefix}/raise`)} className="btn btn-secondary">
                                        Raise Ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="row clearfix mb-3">
                    {[
                        { label: 'Total Tickets', value: tickets.length, color: '#6F4D34', icon: 'fa-ticket' },
                        { label: 'Open', value: tickets.filter(t => t.status === 'Open').length, color: '#3b82f6', icon: 'fa-folder-open-o' },
                        { label: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length, color: '#f59e0b', icon: 'fa-spinner' },
                        { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, color: '#10b981', icon: 'fa-check-circle-o' },
                    ].map((stat, i) => (
                        <div key={i} className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div className="card" style={{ borderTop: `3px solid ${stat.color}` }}>
                                <div className="body" style={{ padding: '16px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                                            <h3 style={{ margin: '4px 0 0', fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.value}</h3>
                                        </div>
                                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className={`fa ${stat.icon}`} style={{ color: stat.color, fontSize: 18 }}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main ticket list card */}
                <div className="row clearfix">
                    <div className="col-lg-12 col-md-12">
                        <div className="card">
                            <div className="header">
                                <h2>My Support Tickets <small>Track and manage your support requests</small></h2>
                            </div>
                            <div className="body">

                                {/* Search + Filter toolbar */}
                                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <div style={{ position: 'relative', flex: '1 1 220px' }}>
                                        <i className="fa fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bbb', fontSize: 13 }}></i>
                                        <input
                                            type="text"
                                            placeholder="Search by subject or ticket ID..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            style={{ width: '100%', paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fafafa' }}
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={e => setStatusFilter(e.target.value)}
                                        style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, background: '#fafafa', color: '#555', cursor: 'pointer', minWidth: 150 }}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Waiting on User">Waiting on User</option>
                                    </select>
                                    <button
                                        onClick={() => navigate(`${pathPrefix}/raise`)}
                                        style={{ padding: '8px 18px', background: '#6F4D34', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                                    >
                                        <i className="fa fa-plus"></i> Raise Ticket
                                    </button>
                                </div>

                                {/* Empty state */}
                                {filteredTickets.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fafafa', borderRadius: 16, border: '2px dashed #e5e7eb' }}>
                                        <div style={{ width: 64, height: 64, background: '#fff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                            <i className="fa fa-ticket" style={{ fontSize: 24, color: '#d1d5db' }}></i>
                                        </div>
                                        <h4 style={{ color: '#374151', margin: '0 0 8px', fontWeight: 700 }}>
                                            {search || statusFilter ? 'No tickets match your filters' : 'No support tickets yet'}
                                        </h4>
                                        <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 20px' }}>
                                            {search || statusFilter ? 'Try adjusting your search or filter.' : "You haven't raised any support tickets yet."}
                                        </p>
                                        {!search && !statusFilter && (
                                            <button
                                                onClick={() => navigate(`${pathPrefix}/raise`)}
                                                style={{ padding: '10px 24px', background: '#6F4D34', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                                            >
                                                Raise First Ticket
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                            <thead>
                                                <tr>
                                                    {['Ticket Details', 'Category', 'Status', 'Created Date', 'Action'].map((h, i) => (
                                                        <th key={i} style={{
                                                            padding: '6px 14px',
                                                            fontSize: 11,
                                                            fontWeight: 700,
                                                            color: '#9ca3af',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.12em',
                                                            textAlign: i >= 3 ? 'right' : i === 2 ? 'center' : 'left',
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTickets.map((ticket) => {
                                                    const status = getStatusInfo(ticket.status);
                                                    const createdDate = new Date(ticket.createdAt);
                                                    return (
                                                        <tr
                                                            key={ticket._id}
                                                            onClick={() => navigate(`${pathPrefix}/${ticket._id}`)}
                                                            style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                                                            onMouseEnter={e => {
                                                                Array.from(e.currentTarget.cells).forEach(td => {
                                                                    td.style.background = '#fdf8f5';
                                                                    td.style.borderColor = 'rgba(111,77,52,0.15)';
                                                                });
                                                            }}
                                                            onMouseLeave={e => {
                                                                Array.from(e.currentTarget.cells).forEach(td => {
                                                                    td.style.background = '#fff';
                                                                    td.style.borderColor = '#f3f4f6';
                                                                });
                                                            }}
                                                        >
                                                            {/* Ticket Details */}
                                                            <td style={{ padding: '12px 14px', background: '#fff', border: '1px solid #f3f4f6', borderRight: 'none', borderRadius: '12px 0 0 12px', transition: 'background 0.2s, border-color 0.2s' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                                                    <span style={{ fontSize: 10, fontWeight: 800, color: '#6F4D34', background: 'rgba(111,77,52,0.06)', padding: '2px 8px', borderRadius: 5, border: '1px solid rgba(111,77,52,0.1)', letterSpacing: '0.08em', width: 'fit-content' }}>
                                                                        {ticket.ticket_code}
                                                                    </span>
                                                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                                                                        {ticket.subject}
                                                                    </p>
                                                                </div>
                                                            </td>

                                                            {/* Category */}
                                                            <td style={{ padding: '12px 14px', background: '#fff', border: '1px solid #f3f4f6', borderLeft: 'none', borderRight: 'none', transition: 'background 0.2s, border-color 0.2s' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{ticket.category}</span>
                                                                    {ticket.orderId && (
                                                                        <span style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>Order: #{ticket.orderId}</span>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Status */}
                                                            <td style={{ padding: '12px 14px', background: '#fff', border: '1px solid #f3f4f6', borderLeft: 'none', borderRight: 'none', textAlign: 'center', transition: 'background 0.2s, border-color 0.2s' }}>
                                                                <span className={`${status.bg} ${status.text} ${status.border}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, border: '1px solid', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                                                                    <span className={`${status.dot} ${status.pulse ? 'animate-pulse' : ''}`} style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block' }}></span>
                                                                    {ticket.status}
                                                                </span>
                                                            </td>

                                                            {/* Created Date */}
                                                            <td style={{ padding: '12px 14px', background: '#fff', border: '1px solid #f3f4f6', borderLeft: 'none', borderRight: 'none', textAlign: 'right', transition: 'background 0.2s, border-color 0.2s' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#4b5563' }}>
                                                                        {createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </span>
                                                                    <span style={{ fontSize: 10, color: '#9ca3af', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                        <FaClock style={{ fontSize: 8 }} />
                                                                        {createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            {/* Action */}
                                                            <td style={{ padding: '12px 14px', background: '#fff', border: '1px solid #f3f4f6', borderLeft: 'none', borderRadius: '0 12px 12px 0', textAlign: 'right', transition: 'background 0.2s, border-color 0.2s' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                                                                        <FaChevronRight style={{ fontSize: 11, color: '#d1d5db' }} />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ─── BUYER MY-ACCOUNT LAYOUT ─── */
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
                                    className="bg-white transition-all duration-300 cursor-pointer group"
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
                                            <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`} />
                                            {ticket.status}
                                        </div>
                                    </td>
                                    <td className="py-2 px-3 border-y border-gray-100 group-hover:border-[#6F4D34]/20 group-hover:bg-gray-50/30 hidden sm:table-cell text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-gray-600">
                                                {createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
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
