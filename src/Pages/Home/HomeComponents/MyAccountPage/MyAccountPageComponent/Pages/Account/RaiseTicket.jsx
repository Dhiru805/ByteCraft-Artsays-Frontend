import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaTicketAlt, FaPaperPlane, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import postAPI from '../../../../../../../api/postAPI';
import { useAuth } from '../../../../../../../AuthContext';

const RaiseTicket = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userType } = useAuth();
    const role = userType?.toLowerCase() || 'buyer';
    
    const isDashboardLayout = location.pathname.startsWith('/artist') || location.pathname.startsWith('/seller') || location.pathname.startsWith('/super-admin');

    // Determine path prefix (for /artist, /seller, /super-admin or /my-account)
    const pathPrefix = location.pathname.includes('/my-account') 
      ? '/my-account/support' 
      : location.pathname.includes('/artist')
      ? '/artist/support'
      : location.pathname.includes('/super-admin')
      ? '/super-admin/support'
      : '/seller/support';

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        subject: '',
        description: '',
        linked_entity_type: 'None',
        linked_entity_id: '',
        device_info: {
            browser: navigator.userAgent,
            os: navigator.platform,
            device: window.innerWidth < 768 ? 'Mobile' : 'Desktop'
        }
    });

    const roleCategories = {
        buyer: [
            "Order delay",
            "Damaged product received",
            "Wrong product received",
            "Refund not received",
            "Payment failed but debited",
            "Seller unresponsive",
            "Product query",
            "General Query"
        ],
        artist: [
            "Buyer unresponsive (custom order)",
            "Order cancelled unfairly",
            "Certification stuck",
            "Payment not credited",
            "Withdrawal delay",
            "Payout Issue",
            "Custom Order",
            "General Query"
        ],
        seller: [
            "Withdrawal delay",
            "Ads not running",
            "Buyer dispute",
            "Ad campaign issue",
            "Auction restart needed",
            "Packaging material delay",
            "Wallet settlement mismatch",
            "General Query"
        ],
        'super-admin': [
            "System Bug",
            "Payout delay",
            "Server downtime",
            "General Query"
        ]
    };

    const categories = roleCategories[role] || [
        "Order & Delivery",
        "Payment / Refund",
        "Wallet / Withdrawal",
        "Bidding / Auction",
        "Product / Listing",
        "Certification / Insurance",
        "Ads / Promotion",
        "Custom Order",
        "Account / Verification / KYC",
        "Technical Bug",
        "Policy / Abuse / Fraud",
        "General Query"
    ];

    useEffect(() => {
        const state = location.state;
        if (state?.order_id) {
            setFormData(prev => ({
                ...prev,
                category: state.category || (role === 'buyer' ? 'Order delay' : (role === 'artist' ? 'Order cancelled unfairly' : 'Buyer dispute')),
                linked_entity_type: 'Order',
                linked_entity_id: state.order_id,
                subject: state.subject || `Issue with Order #${state.order_id}`
            }));
        } else if (state?.product_id) {
            setFormData(prev => ({
                ...prev,
                category: role === 'buyer' ? 'Product query' : 'Product / Listing',
                linked_entity_type: 'Product',
                linked_entity_id: state.product_id,
                subject: `Issue with Product #${state.product_id}`
            }));
        } else if (state?.bid_id) {
            setFormData(prev => ({
                ...prev,
                category: role === 'buyer' ? 'Auction unfair bidding' : (role === 'seller' ? 'Auction restart needed' : 'Bidding / Auction'),
                linked_entity_type: 'Bid',
                linked_entity_id: state.bid_id,
                subject: `Issue with Auction Bid #${state.bid_id}`
            }));
        } else if (state?.transaction_id) {
            setFormData(prev => ({
                ...prev,
                category: role === 'seller' ? 'Withdrawal delay' : (role === 'artist' ? 'Payment not credited' : 'Refund delay'),
                linked_entity_type: 'WalletTransaction',
                linked_entity_id: state.transaction_id,
                subject: `Issue with Transaction #${state.transaction_id}`
            }));
        } else if (state?.category) {
            setFormData(prev => ({
                ...prev,
                category: state.category,
                linked_entity_type: state.entity_type || 'None',
                linked_entity_id: state.entity_id || '',
                subject: state.subject || `${state.category} Issue`
            }));
        }
    }, [location.state, role]);

    const isContextual = !!(location.state?.order_id || location.state?.product_id || location.state?.bid_id || location.state?.transaction_id || location.state?.category);

    const handleCategoryChange = (cat) => {
        let type = formData.linked_entity_type;
        if (!isContextual) {
            type = 'None';
            const orderCats = ['Order delay', 'Damaged product received', 'Wrong product received', 'Seller unresponsive', 'Order & Delivery', 'Buyer dispute', 'Order cancelled unfairly'];
            const walletCats = ['Payment failed but debited', 'Refund not received', 'Payment / Refund', 'Wallet / Withdrawal', 'Refund delay', 'Withdrawal delay', 'Wallet settlement mismatch', 'Payout Issue', 'Payment not credited'];
            const bidCats = ['Bidding / Auction', 'Auction unfair bidding', 'Auction restart needed'];
            const prodCats = ['Product / Listing', 'Product query'];
            const customCats = ['Custom Order', 'Buyer unresponsive (custom order)'];

            if (orderCats.includes(cat)) type = 'Order';
            else if (walletCats.includes(cat)) type = 'WalletTransaction';
            else if (bidCats.includes(cat)) type = 'Bid';
            else if (prodCats.includes(cat)) type = 'Product';
            else if (customCats.includes(cat)) type = 'CustomOrder';
        }
        
        setFormData(prev => ({...prev, category: cat, linked_entity_type: type}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category || !formData.subject || !formData.description) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            const response = await postAPI('/api/tickets', formData);
            if (response.data.success) {
                navigate(`${pathPrefix}/${response.data.ticket._id}`);
            }
        } catch (error) {
            console.error("Error creating ticket:", error);
            alert("Failed to create ticket. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderForm = () => (
        <form onSubmit={handleSubmit} className="row">
            {isContextual && (
                <div className="col-12">
                    <div className="alert alert-info border-0 shadow-sm d-flex align-items-center mb-4 p-4" style={{ borderRadius: '1rem', background: '#F0F7FF' }}>
                        <FaTicketAlt className="mr-3 h4 mb-0 opacity-50 text-primary" />
                        <div>
                            <h3 className="h6 font-weight-bold mb-1 text-primary">Context Link Active</h3>
                            <p className="small mb-0 text-muted">Linked to <strong>{formData.linked_entity_type} #{formData.linked_entity_id}</strong>. You can still choose the specific issue category below.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="col-md-6 mb-3">
                <label className="small font-weight-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Category *</label>
                <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="form-control form-control-lg custom-select"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <div className="col-md-6 mb-3">
                <label className="small font-weight-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Related To (Optional)</label>
                <div className="input-group input-group-lg">
                    <select
                        value={formData.linked_entity_type}
                        onChange={(e) => setFormData({...formData, linked_entity_type: e.target.value})}
                        className="form-control col-4 custom-select"
                        disabled={isContextual}
                    >
                        <option value="None">None</option>
                        <option value="Order">Order</option>
                        <option value="Product">Product</option>
                        <option value="Bid">Bid</option>
                        <option value="WalletTransaction">Wallet</option>
                        <option value="CustomOrder">Custom Order</option>
                    </select>
                    <input
                        type="text"
                        placeholder="ID (e.g. 123)"
                        value={formData.linked_entity_id}
                        onChange={(e) => setFormData({...formData, linked_entity_id: e.target.value})}
                        className="form-control col-8"
                        disabled={formData.linked_entity_type === 'None' || isContextual}
                    />
                </div>
            </div>

            <div className="col-12 mb-3">
                <label className="small font-weight-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Subject *</label>
                <input
                    type="text"
                    placeholder="Brief summary of the issue"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="form-control form-control-lg"
                    required
                />
            </div>

            <div className="col-12 mb-4">
                <label className="small font-weight-bold text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Description *</label>
                <textarea
                    rows={6}
                    placeholder="Please provide details about the issue you're facing..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="form-control form-control-lg resize-none"
                    required
                />
            </div>

            <div className="col-12">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-lg btn-block font-weight-bold text-uppercase py-3"
                    style={{ 
                        letterSpacing: '1px', 
                        backgroundColor: '#6F4D34', 
                        color: '#fff',
                        boxShadow: '0 4px 14px 0 rgba(111, 77, 52, 0.39)'
                    }}
                >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                        <span className="d-flex align-items-center justify-center">
                            <FaPaperPlane className="mr-2" /> Create Ticket
                        </span>
                    )}
                </button>
            </div>
        </form>
    );

    if (isDashboardLayout) {
        return (
            <div className="container-fluid">
                <div className="block-header">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <h2 className="font-weight-bold">Raise Support Ticket</h2>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={location.pathname.includes('/artist') ? "/artist/dashboard" : location.pathname.includes('/seller') ? "/seller/dashboard" : "/super-admin/dashboard"}>
                                        <i className="fa fa-dashboard"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">Support</li>
                                <li className="breadcrumb-item active">Raise Ticket</li>
                            </ul>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="d-none d-md-flex flex-row-reverse">
                                <div className="page_action">
                                    <button onClick={() => navigate(pathPrefix)} className="btn btn-secondary">
                                        Back to Tickets
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix justify-content-center">
                    <div className="col-lg-8 col-md-12">
                        <div className="card shadow-sm border-0">
                            <div className="header border-bottom py-3 px-4">
                                <h2 className="font-weight-bold">Ticket Details <small className="d-block text-muted">We'll get back to you according to our SLA</small></h2>
                            </div>
                            <div className="body p-4">
                                <div className="alert alert-light border d-flex align-items-start mb-4">
                                    <FaInfoCircle className="text-primary mt-1 mr-3 h5 opacity-50" />
                                    <p className="small mb-0 text-dark">
                                        <strong>Smart Support:</strong> Selecting the correct category helps us route your issue to the right department faster.
                                    </p>
                                </div>
                                {renderForm()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Buyer layout
    return (
        <div className="w-full space-y-8 pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(pathPrefix)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-[#6F4D34] hover:text-white hover:border-[#6F4D34] transition-all"
                    >
                        <FaArrowLeft size={14} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Raise Support Ticket</h2>
                        <p className="text-sm text-gray-500 mt-1">Tell us more about the issue you're facing</p>
                    </div>
                </div>
                
                <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-100/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                        <FaInfoCircle size={14} />
                    </div>
                    <div className="text-[11px] font-bold text-amber-900 leading-tight">
                        <p>24/7 Support</p>
                        <p className="text-amber-700/60 uppercase tracking-widest text-[9px]">SLA: 24-48 Hours</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-10">
                    <div className="bg-[#6F4D34]/5 border border-[#6F4D34]/10 rounded-2xl p-5 mb-10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#6F4D34] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#6F4D34]/20">
                            <FaTicketAlt size={18} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-[#6F4D34] mb-1">Smart Routing Active</h4>
                            <p className="text-xs text-[#6F4D34]/70 leading-relaxed font-medium">
                                Choosing the correct category ensures your ticket is routed directly to the specialized team for faster resolution.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {isContextual && (
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 mb-8 animate-in slide-in-from-top-4">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-500 shadow-sm border border-blue-100 shrink-0">
                                    <FaTicketAlt size={14} />
                                </div>
                                <div className="text-xs">
                                    <h4 className="font-bold text-blue-900 mb-0.5">Context Link Active</h4>
                                    <p className="text-blue-700/70 font-medium">Linked to <span className="text-blue-900 font-bold uppercase tracking-wider">{formData.linked_entity_type} #{formData.linked_entity_id}</span></p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Issue Category *</label>
                                <div className="relative group">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:bg-white transition-all appearance-none cursor-pointer group-hover:border-[#6F4D34]/20"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <i className="fa fa-chevron-down text-xs" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Related To (Optional)</label>
                                <div className="flex gap-2">
                                    <div className="w-1/3 relative group">
                                        <select
                                            value={formData.linked_entity_type}
                                            onChange={(e) => setFormData({...formData, linked_entity_type: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-[#6F4D34]/20"
                                            disabled={isContextual}
                                        >
                                            <option value="None">None</option>
                                            <option value="Order">Order</option>
                                            <option value="Product">Product</option>
                                            <option value="Bid">Bid</option>
                                            <option value="WalletTransaction">Wallet</option>
                                            <option value="CustomOrder">Custom</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <i className="fa fa-chevron-down text-[10px]" />
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Reference ID"
                                        value={formData.linked_entity_id}
                                        onChange={(e) => setFormData({...formData, linked_entity_id: e.target.value})}
                                        className="w-2/3 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#6F4D34]/20"
                                        disabled={formData.linked_entity_type === 'None' || isContextual}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Subject / Summary *</label>
                            <input
                                type="text"
                                placeholder="E.g., Haven't received my refund for Order #12345"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:bg-white transition-all hover:border-[#6F4D34]/20"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Detailed Description *</label>
                            <textarea
                                rows={6}
                                placeholder="Please provide as much detail as possible to help us resolve your issue quickly..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:bg-white transition-all resize-none hover:border-[#6F4D34]/20"
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#6F4D34] text-white rounded-2xl font-bold text-base py-5 hover:bg-[#5a3e2a] transition-all shadow-xl shadow-[#6F4D34]/30 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <FaPaperPlane className="transform rotate-12 -mt-1" />
                                        Submit Support Ticket
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
                                We usually respond within 24 hours
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RaiseTicket;
