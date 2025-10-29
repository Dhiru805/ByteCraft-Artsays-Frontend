import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getAPI from '../../../../../api/getAPI';
import putAPI from '../../../../../api/putAPI';
import deleteAPI from '../../../../../api/deleteAPI';
import { toast } from 'react-toastify';

const PassOrderTable = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const fetchOrders = async () => {
        try {
            const res = await getAPI('/api/bidding/pass-orders', {}, true);
            setOrders(Array.isArray(res?.data?.data) ? res.data.data : []);
        } catch (e) {
            setOrders([]);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const filtered = orders.filter(o => {
        const uname = `${o.user?.name || ''} ${o.user?.lastName || ''}`.toLowerCase();
        const role = (o.user?.role || '').toLowerCase();
        return uname.includes(searchTerm.toLowerCase()) || role.includes(searchTerm.toLowerCase()) || (o.pass?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleStatus = async (orderId, active) => {
        try {
            const res = await putAPI(`/api/bidding/pass-orders/${orderId}/status`, { active: !active }, {}, true);
            if (!res?.hasError) { toast.success('Status updated'); fetchOrders(); } else { toast.error(res?.message || 'Failed'); }
        } catch { toast.error('Failed'); }
    };

    const deleteOrder = async (orderId) => {
        try {
            const res = await deleteAPI(`/api/bidding/pass-orders/${orderId}`, {}, true);
            if (!res?.hasError) { toast.success('Deleted'); fetchOrders(); } else { toast.error(res?.message || 'Failed'); }
        } catch { toast.error('Failed'); }
    };

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Bidding Pass Orders</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Orders</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex flex-row-reverse">
                            <div className="page_action"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header d-flex justify-content-between align-items-center">
                            <div className="w-100 w-md-auto d-flex align-items-center">
                                <div className="input-group" style={{ maxWidth: '260px' }}>
                                    <input type="text" className="form-control form-control-sm" placeholder="Search user, role or pass" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    <i className="fa fa-search" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}></i>
                                </div>
                            </div>
                        </div>
                        <div className="body">
                            <div className="table-responsive">
                                <table className="table table-hover text-nowrap">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Pass</th>
                                            <th>Purchased On</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageItems.length === 0 ? (
                                            <tr><td colSpan="7" className="text-center">No orders</td></tr>
                                        ) : pageItems.map((o, idx) => (
                                            <tr key={o._id || idx}>
                                                <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                                <td>{o.user?.name} {o.user?.lastName}</td>
                                                <td>{o.user?.role}</td>
                                                <td>{o.pass?.name}</td>
                                                <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
                                                <td>
                                                    <span className={`badge ${o.active ? 'badge-success' : 'badge-secondary'}`}>{o.active ? 'Active' : 'Inactive'}</span>
                                                </td>
                                                <td>
                                                    <button className={`btn btn-sm ${o.active ? 'btn-warning' : 'btn-success'} mr-2`} onClick={() => toggleStatus(o._id, o.active)}>
                                                        {o.active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => deleteOrder(o._id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination d-flex justify-content-between mt-4">
                                <span className="mx-1 d-none d-sm-inline-block text-truncate w-100">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
                                </span>
                                <ul className="pagination d-flex justify-content-end w-100">
                                    <li className={`paginate_button page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                                        <button className="page-link">Previous</button>
                                    </li>
                                    <li className={`paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>
                                        <button className="page-link">Next</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassOrderTable;



