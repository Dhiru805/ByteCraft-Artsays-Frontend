import React, { useEffect, useState } from "react";
import axios from "../../../../api/axiosConfig";
import { toast } from "react-toastify";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { enUS } from "date-fns/locale";
import BuyerWalletSkeleton from "../../../Skeleton/wallet/BuyerWalletSkeleton";


const AdminWalletManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState("credit");
  const [adjustReason, setAdjustReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterWithdrawalUserType, setFilterWithdrawalUserType] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterAllUser, setFilterAllUser] = useState("");
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const [walletPage, setWalletPage] = useState(1);
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const [referralPage, setReferralPage] = useState(1);
  const [earningsPage, setEarningsPage] = useState(1);
  const [earningsFilter, setEarningsFilter] = useState("");
  const [earningsCategory, setEarningsCategory] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  
  // Date Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [walletStartDate, setWalletStartDate] = useState("");
  const [walletEndDate, setWalletEndDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [isExporting, setIsExporting] = useState(false);

    const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
    const [referralSettings, setReferralSettings] = useState(null);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [coinSetting, setCoinSetting] = useState({ coinValue: 0.10, currency: "INR" });
    const [isSavingCoinSetting, setIsSavingCoinSetting] = useState(false);

    // Order Payouts
    const [orders, setOrders] = useState([]);
    const [orderPage, setOrderPage] = useState(1);
    const [orderFilter, setOrderFilter] = useState("");
    const [orderStatusFilter, setOrderStatusFilter] = useState("");
    const [payoutProcessing, setPayoutProcessing] = useState(null);
    const [payoutModal, setPayoutModal] = useState({ show: false, orderId: null });

    // Platform Earnings (from dedicated API)
    const [platformEarnings, setPlatformEarnings] = useState({ transactions: [], summary: {} });
  
    const fetchData = async () => {

    setLoading(true);
    try {
      const walletsRes = await axios.get(`/api/wallet/admin/all-wallets`);
      setWallets(walletsRes.data || []);
      
      const transRes = await axios.get(`/api/wallet/admin/all-transactions`);
      setTransactions(transRes.data || []);
      
      const withdrawRes = await axios.get(`/api/wallet/withdrawals`);
      setWithdrawals(withdrawRes.data || []);

      const coinRes = await axios.get(`/api/coin-settings`);
      if (coinRes.data) setCoinSetting(coinRes.data);

      const ordersRes = await axios.get(`/api/wallet/admin/all-orders`);
      setOrders(ordersRes.data || []);

      const earningsRes = await axios.get(`/api/wallet/admin/platform-earnings`);
      setPlatformEarnings(earningsRes.data || { transactions: [], summary: {} });
    } catch (err) {
      console.error("Error fetching admin wallet data:", err?.response?.data || err?.message || err);
      toast.error(err?.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustBalance = async () => {
    if (!selectedUser || !adjustAmount) return toast.warning("Select user and enter amount");
    setIsLoading(true);
    try {
      await axios.post(`/api/wallet/admin/adjust/${selectedUser}`, {
        amount: Number(adjustAmount),
        type: adjustType,
        reason: adjustReason || "Admin Adjustment"
      });
      toast.success("Balance adjusted successfully");
      fetchData();
      setAdjustAmount("");
      setAdjustReason("");
    } catch (err) {
      toast.error("Failed to adjust balance");
    } finally {
      setIsLoading(false);
    }
  };

  const updateWithdrawalStatus = async (id, status, reason = "") => {
    try {
      const endpoint = status === 'approved' ? 'approve' : status === 'rejected' ? 'decline' : 'mark-paid';
      await axios.post(`/api/wallet/withdrawals/${id}/${endpoint}`, { reason });
      toast.success(`Withdrawal ${status}`);
      fetchData();
    } catch (err) {
      console.error("Withdrawal status update error:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || `Failed to ${status} withdrawal`);
    }
  };

  const handleUpdateLimit = async (userId, limitType, value) => {
    try {
      await axios.post(`/api/wallet/admin/limits/${userId}`, { [limitType]: Number(value) });
      toast.success("Limit updated");
      fetchData();
    } catch (err) {
      toast.error("Failed to update limit");
    }
  };

  const exportWallets = async () => {
    try {
      const response = await axios.get(`/api/export-all-wallets`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "All_User_Wallets.xlsx";
      a.click();
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const handleExportTransactions = async () => {
    const sDate = dateRange[0]?.startDate ? dateRange[0].startDate.toISOString().split("T")[0] : "";
    const eDate = dateRange[0]?.endDate ? dateRange[0].endDate.toISOString().split("T")[0] : "";
    
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (filterRole) params.append("role", filterRole);
      if (filterUser || filterAllUser) params.append("userId", filterUser || filterAllUser);
      if (sDate) params.append("startDate", sDate);
      if (eDate) params.append("endDate", eDate);

      const response = await axios.get(`/api/wallet/admin/export-recent-transactions?${params.toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Transactions_Export.xlsx`;
      a.click();
      toast.success("Export successful");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const generateReferralCodes = async () => {
    setIsGeneratingCodes(true);
    try {
      const response = await axios.post('/api/wallet/admin/generate-referral-codes');
      toast.success(response.data.message || "Referral codes generated");
      fetchData();
    } catch (error) {
      toast.error("Failed to generate referral codes");
    } finally {
      setIsGeneratingCodes(false);
    }
  };

  const fetchReferralSettings = async () => {
    try {
      const res = await axios.get('/api/wallet/admin/referral-settings');
      setReferralSettings(res.data);
    } catch (error) {
      console.error("Error fetching referral settings:", error);
    }
  };

    const saveReferralSettings = async () => {
      setIsSavingSettings(true);
      try {
        await axios.put('/api/wallet/admin/referral-settings', referralSettings);
        toast.success("Referral settings saved successfully");
      } catch (error) {
        toast.error("Failed to save referral settings");
      } finally {
        setIsSavingSettings(false);
      }
    };

    const saveCoinSetting = async () => {
      setIsSavingCoinSetting(true);
      try {
        await axios.put('/api/coin-settings', coinSetting);
        toast.success("Coin settings saved successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to save coin settings");
      } finally {
        setIsSavingCoinSetting(false);
      }
    };


  useEffect(() => {
    fetchReferralSettings();
  }, []);

  // Filtering logic - use platformEarnings.transactions (merged wallet + all service data)
  const allPlatformTxns = platformEarnings.transactions || [];
  const filteredTransactions = allPlatformTxns.filter(txn => {
    const matchesType = !filterType || txn.type === filterType;
    
    if (filterRole) {
      const txnRole = (txn.userRole || (typeof txn.userId === 'object' ? (txn.userId?.role || txn.userId?.userType) : '') || '').toLowerCase();
      if (txnRole !== filterRole.toLowerCase()) return false;
    }
    
    if (filterUser || filterAllUser) {
      const targetUserId = filterUser || filterAllUser;
      const txnUserId = typeof txn.userId === 'object' ? String(txn.userId?._id || txn.userId) : String(txn.userId);
      if (txnUserId !== targetUserId) return false;
    }
    
    return matchesType;
  });

  const displayTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);
  const totalTxnPages = Math.ceil(filteredTransactions.length / pageSize);

  const filteredWallets = wallets.filter(w => {
    if (!walletStartDate || !walletEndDate) return true;
    const activity = new Date(w.lastActivityAt);
    return activity >= new Date(walletStartDate) && activity <= new Date(walletEndDate);
  });
  const displayWallets = filteredWallets.slice((walletPage - 1) * pageSize, walletPage * pageSize);
  const totalWalletPages = Math.ceil(filteredWallets.length / pageSize);

  if (loading) return <BuyerWalletSkeleton />;

  return (
    <div className="container-fluid">
      <div className="block-header mb-4 d-flex justify-content-between align-items-center">
        <h2>Wallet Management System</h2>
<div className="btn-group">
              <button className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('overview')}>Overview</button>
              <button className={`btn ${activeTab === 'wallets' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('wallets')}>User Wallets</button>
              <button className={`btn ${activeTab === 'withdrawals' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('withdrawals')}>Withdrawals</button>
              <button className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('transactions')}>Transactions</button>
            <button className={`btn ${activeTab === 'referrals' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('referrals')}>Referrals</button>
              <button className={`btn ${activeTab === 'earnings' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('earnings')}>Platform Earnings</button>
              <button className={`btn ${activeTab === 'orderPayouts' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('orderPayouts')}>Order Payouts</button>
              <button className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('settings')}>Settings</button>
          </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="row clearfix row-deck mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card top_widget primary-bg text-light">
                <div className="body">
                  <div className="icon bg-light text-primary mb-2"><i className="fa fa-users"></i></div>
                  <div className="content">
                    <div className="text-uppercase small">Total Wallets</div>
                    <h4 className="number mb-0">{wallets.length}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card top_widget bg-success text-light">
                <div className="body">
                  <div className="icon bg-light text-success mb-2"><i className="fa fa-rupee"></i></div>
                  <div className="content">
                    <div className="text-uppercase small">Platform Balance</div>
                    <h4 className="number mb-0">₹{wallets.reduce((sum, w) => sum + (w.balance || 0), 0).toLocaleString()}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card top_widget bg-warning text-dark">
                <div className="body">
                  <div className="icon bg-light text-warning mb-2"><i className="fa fa-clock-o"></i></div>
                  <div className="content">
                    <div className="text-uppercase small">Pending Withdrawals</div>
                    <h4 className="number mb-0">{withdrawals.filter(w => w.status === 'pending').length}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card top_widget bg-info text-light">
                <div className="body">
                  <div className="icon bg-light text-info mb-2"><i className="fa fa-diamond"></i></div>
                  <div className="content">
                    <div className="text-uppercase small">Total Art Coins</div>
                    <h4 className="number mb-0">{wallets.reduce((sum, w) => sum + (w.artCoins || 0), 0).toLocaleString()}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row clearfix">
            <div className="col-md-6">
              <div className="card">
                <div className="header"><h2>Manual Balance Adjustment</h2></div>
                <div className="body">
                  <div className="form-group">
                    <label>Select User</label>
                    <select className="form-control" value={selectedUser || ""} onChange={e => setSelectedUser(e.target.value)}>
                      <option value="">Select User</option>
                      {wallets.map(w => (
                        <option key={w._id} value={w.userId?._id || w.userId}>
                          {w.name} {w.lastName} (₹{w.balance})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Action</label>
                        <select className="form-control" value={adjustType} onChange={e => setAdjustType(e.target.value)}>
                          <option value="credit">Credit (+)</option>
                          <option value="debit">Debit (-)</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Amount (₹)</label>
                        <input type="number" className="form-control" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Reason</label>
                    <input type="text" className="form-control" placeholder="Internal note..." value={adjustReason} onChange={e => setAdjustReason(e.target.value)} />
                  </div>
                  <button className="btn btn-warning btn-block" onClick={handleAdjustBalance} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Execute Adjustment'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card">
                <div className="header"><h2>Platform Quick Stats</h2></div>
                <div className="body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Total Referrals Processed</span>
                      <strong>{wallets.reduce((sum, w) => sum + (w.referralCount || 0), 0)}</strong>
                    </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Art Coins Redeemed (Value)</span>
                        <strong>₹{wallets.reduce((sum, w) => sum + (w.artCoinsRedeemed || 0) * coinSetting.coinValue, 0).toFixed(2)}</strong>
                      </li>

                    <li className="list-group-item d-flex justify-content-between">
                      <span>Verified KYC Users</span>
                      <strong>{wallets.filter(w => w.kycStatus === 'verified').length}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Users with High Limits</span>
                      <strong>{wallets.filter(w => (w.dailyWithdrawalLimit || 50000) > 50000).length}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'wallets' && (
        <div className="card">
          <div className="header d-flex justify-content-between align-items-center">
            <h2>User Wallets Registry</h2>
            <div className="d-flex" style={{ gap: '10px' }}>
              <input type="date" className="form-control" value={walletStartDate} onChange={e => setWalletStartDate(e.target.value)} />
              <input type="date" className="form-control" value={walletEndDate} onChange={e => setWalletEndDate(e.target.value)} />
              <button className="btn btn-success" onClick={exportWallets}>Export Excel</button>
            </div>
          </div>
          <div className="body table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Balance</th>
                  <th>Art Coins</th>
                  <th>KYC Status</th>
                  <th>Daily Limit</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayWallets.map(w => (
                  <tr key={w._id}>
                    <td>
                      <div><strong>{w.name} {w.lastName}</strong></div>
                      <small className="text-muted">{w.userId?._id || w.userId}</small>
                    </td>
                    <td><span className="badge badge-info">{w.role}</span></td>
                    <td>₹{w.balance.toLocaleString()}</td>
                    <td>{w.artCoins}</td>
                    <td>
                      <span className={`badge ${w.kycStatus === 'verified' ? 'badge-success' : w.kycStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {w.kycStatus || 'Not Started'}
                      </span>
                    </td>
                    <td>₹{(w.dailyWithdrawalLimit || 50000).toLocaleString()} <button className="btn btn-xs btn-link p-0" onClick={() => {
                      const newLimit = prompt("Enter new daily limit:", w.dailyWithdrawalLimit || 50000);
                      if (newLimit) handleUpdateLimit(w.userId?._id || w.userId, 'dailyWithdrawalLimit', newLimit);
                    }}><i className="fa fa-pencil text-primary"></i></button></td>
                    <td>{w.lastActivityAt ? new Date(w.lastActivityAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedUser(w.userId?._id || w.userId); setActiveTab('overview'); }}>Adjust</button>
                          <button className="btn btn-sm btn-outline-secondary" title="View History" onClick={() => {
                            setFilterAllUser(w.userId?._id || w.userId);
                            setActiveTab('transactions');
                            setPage(1);
                          }}><i className="fa fa-history"></i></button>
                        </div>
                        </td>
                    </tr>
                  ))}
                  {displayWallets.length === 0 && <tr><td colSpan="8" className="text-center">No wallets found</td></tr>}
                </tbody>
              </table>
              <div className="mt-3 d-flex justify-content-between">
                <div>Page {walletPage} of {totalWalletPages || 1}</div>
              <div className="btn-group">
                <button className="btn btn-sm btn-light" disabled={walletPage === 1} onClick={() => setWalletPage(p => p - 1)}>Prev</button>
                <button className="btn btn-sm btn-light" disabled={walletPage === totalWalletPages} onClick={() => setWalletPage(p => p + 1)}>Next</button>
              </div>
            </div>
          </div>
        </div>
      )}



{activeTab === 'withdrawals' && (() => {
          const filteredWithdrawals = withdrawals.filter(w => {
            if (filterStatus && w.status !== filterStatus) return false;
            if (filterWithdrawalUserType) {
              const wal = wallets.find(wal => String(wal.userId?._id || wal.userId) === String(w.userId));
              if (!wal || (wal.role || '').toLowerCase() !== filterWithdrawalUserType.toLowerCase()) return false;
            }
            return true;
          });
          const totalWithdrawalPages = Math.ceil(filteredWithdrawals.length / pageSize);
          const displayWithdrawals = filteredWithdrawals.slice((withdrawalPage - 1) * pageSize, withdrawalPage * pageSize);
          return (
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <h2>Withdrawal Requests</h2>
              <div className="d-flex" style={{ gap: '10px' }}>
                <select className="form-control" style={{ width: '150px' }} value={filterWithdrawalUserType} onChange={e => { setFilterWithdrawalUserType(e.target.value); setWithdrawalPage(1); }}>
                  <option value="">All User Types</option>
                  <option value="Artist">Artist</option>
                  <option value="Seller">Seller</option>
                  <option value="Buyer">Buyer</option>
                </select>
                <select className="form-control" style={{ width: '150px' }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setWithdrawalPage(1); }}>
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </div>
            <div className="body table-responsive">
              <table className="table table-hover">
                <thead>
                    <tr>
                      <th>User</th>
                      <th>User Type</th>
                      <th>Amount</th>
                      <th>Withdrawal Method</th>
                      <th>KYC</th>
                      <th>Request Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayWithdrawals.map(req => {
                      const userWallet = wallets.find(wal => String(wal.userId?._id || wal.userId) === String(req.userId));
                      return (
                        <tr key={req._id}>
                          <td>{userWallet ? `${userWallet.name} ${userWallet.lastName}` : req.userId}</td>
                          <td><span className={`badge ${userWallet?.role === 'Artist' ? 'badge-primary' : userWallet?.role === 'Seller' ? 'badge-success' : userWallet?.role === 'Buyer' ? 'badge-info' : 'badge-secondary'}`}>{userWallet?.role || 'Unknown'}</span></td>
                          <td>₹{req.amount.toLocaleString()}</td>
                          <td><span className={`badge ${req.method === 'bank' ? 'badge-primary' : 'badge-info'}`}>{(req.method || 'upi').toUpperCase()}</span></td>
                          <td>
                            <span className={`badge ${userWallet?.kycStatus === 'verified' ? 'badge-success' : 'badge-danger'}`}>
                              {userWallet?.kycStatus || 'Unknown'}
                            </span>
                          </td>
                          <td>{new Date(req.createdAt).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${req.status === 'pending' ? 'badge-warning' : req.status === 'approved' ? 'badge-info' : req.status === 'paid' ? 'badge-success' : 'badge-danger'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td>
                          {req.status === 'pending' && (
                            <>
                              <button className="btn btn-sm btn-success mr-2" onClick={() => updateWithdrawalStatus(req._id, 'approved')}>Approve</button>
                              <button className="btn btn-sm btn-danger" onClick={() => {
                                const reason = prompt("Enter rejection reason:");
                                if (reason) updateWithdrawalStatus(req._id, 'rejected', reason);
                              }}>Reject</button>
                            </>
                          )}
                          {req.status === 'approved' && (
                            <button className="btn btn-sm btn-primary" onClick={() => updateWithdrawalStatus(req._id, 'paid')}>Mark Paid</button>
                          )}
                          {(req.status === 'paid' || req.status === 'declined') && <span className="text-muted">-</span>}
                        </td>
                      </tr>
                    );
                  })}
                    {displayWithdrawals.length === 0 && <tr><td colSpan="8" className="text-center">No withdrawals found</td></tr>}
                </tbody>
              </table>
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <div>Page {withdrawalPage} of {totalWithdrawalPages || 1} ({filteredWithdrawals.length} total)</div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-light" disabled={withdrawalPage === 1} onClick={() => setWithdrawalPage(p => p - 1)}>Prev</button>
                  <button className="btn btn-sm btn-light" disabled={withdrawalPage >= totalWithdrawalPages} onClick={() => setWithdrawalPage(p => p + 1)}>Next</button>
                </div>
              </div>
            </div>
          </div>
          );
        })()}

      {activeTab === 'transactions' && (
        <div className="card">
          <div className="header d-flex justify-content-between align-items-center">
            <h2>Platform Transactions</h2>
            <div className="d-flex" style={{ gap: '10px' }}>
              <select className="form-control" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                <option value="">All Roles</option>
                <option value="artist">Artist</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </select>
              <select className="form-control" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
              <button className="btn btn-outline-success" onClick={handleExportTransactions}>Export</button>
            </div>
          </div>
          <div className="body table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
              {displayTransactions.map(txn => {
                    const userName = txn.userName || (typeof txn.userId === 'object' && txn.userId?.name ? txn.userId.name : '') || txn.name || 'Unknown';
                    return (
                      <tr key={txn._id + (txn.category || '')}>
                        <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                        <td>{userName}</td>
                        <td><span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>{txn.type}</span></td>
                        <td>₹{(txn.amount || 0).toLocaleString()}</td>
                        <td>{txn.purpose}</td>
                        <td><span className={`badge ${txn.status === 'success' ? 'badge-success' : txn.status === 'pending' ? 'badge-warning' : 'badge-secondary'}`}>{txn.status}</span></td>
                      </tr>
                    );
                  })}
                {displayTransactions.length === 0 && <tr><td colSpan="6" className="text-center">No transactions found</td></tr>}
              </tbody>
            </table>
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <div>Page {page} of {totalTxnPages || 1}</div>
              <div className="btn-group">
                <button className="btn btn-sm btn-light" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                <button className="btn btn-sm btn-light" disabled={page === totalTxnPages} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            </div>
          </div>
        </div>
      )}

{activeTab === 'referrals' && (() => {
            const totalReferralPages = Math.ceil(wallets.length / pageSize);
            const displayReferrals = wallets.slice((referralPage - 1) * pageSize, referralPage * pageSize);
            return (
            <div className="card">
              <div className="header d-flex justify-content-between align-items-center">
                <h2>Referral Program Insights</h2>
                <button 
                  className="btn btn-primary" 
                  onClick={generateReferralCodes} 
                  disabled={isGeneratingCodes}
                >
                  {isGeneratingCodes ? 'Generating...' : 'Generate Missing Codes'}
                </button>
              </div>
              <div className="body table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Referral Code</th>
                      <th>Total Referred</th>
                      <th>Total Earnings</th>
                      <th>Referred By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayReferrals.map(w => (
                      <tr key={w._id}>
                        <td><strong>{w.name} {w.lastName}</strong></td>
                        <td><code>{w.referralCode || 'Not Generated'}</code></td>
                        <td>{w.referralCount || 0}</td>
                        <td>₹{(w.referralEarnings || 0).toLocaleString()}</td>
                        <td>{w.referredBy || '-'}</td>
                      </tr>
                    ))}
                    {displayReferrals.length === 0 && <tr><td colSpan="5" className="text-center">No wallets found</td></tr>}
                  </tbody>
                </table>
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <div>Page {referralPage} of {totalReferralPages || 1} ({wallets.length} total)</div>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-light" disabled={referralPage === 1} onClick={() => setReferralPage(p => p - 1)}>Prev</button>
                    <button className="btn btn-sm btn-light" disabled={referralPage >= totalReferralPages} onClick={() => setReferralPage(p => p + 1)}>Next</button>
                  </div>
                </div>
              </div>
            </div>
            );
          })()}

            {activeTab === 'earnings' && (() => {
              const allTxns = platformEarnings.transactions || [];
              const summary = platformEarnings.summary || {};

              const getCategoryLabel = (cat) => {
                  const labels = { 
                    buyer_payment: 'Buyer Payment',
                    buyer_refund: 'Buyer Refund',
                    seller_payout: 'Seller Payout',
                    seller_payout_reversed: 'Seller Payout Reversed',
                    commission_earned: 'Commission Earned', 
                    commission_reversed: 'Commission Reversed', 
                    admin_adjustment: 'Admin Adjustment', 
                    add_money: 'Add Money', 
                    withdrawal: 'Withdrawal', 
                    bidding_pass: 'Bidding Pass',
                    certificate: 'Certificate',
                    ads: 'Ads',
                    exhibition: 'Exhibition',
                    challenges: 'Challenges',
                    insurance: 'Insurance',
                    verification_badge: 'Verification Badge',
                    promote_post: 'Promote Post',
                    packaging_materials: 'Packaging Materials',
                      final_bidding: 'Final Bidding',
                      product_order: 'Product Order',
                      other_credit: 'Other Credit', 
                    other_debit: 'Other Debit',
                    other: 'Other'
                  };
                  return labels[cat] || cat;
                };
                const getCategoryBadge = (cat) => {
                  const badges = { 
                    buyer_payment: 'badge-primary',
                    buyer_refund: 'badge-warning',
                    seller_payout: 'badge-info',
                    seller_payout_reversed: 'badge-dark',
                    commission_earned: 'badge-success', 
                    commission_reversed: 'badge-danger', 
                    admin_adjustment: 'badge-secondary', 
                    add_money: 'badge-info', 
                    withdrawal: 'badge-warning', 
                    bidding_pass: 'badge-primary',
                    certificate: 'badge-info',
                    ads: 'badge-warning',
                    exhibition: 'badge-success',
                    challenges: 'badge-danger',
                    insurance: 'badge-secondary',
                    verification_badge: 'badge-info',
                    promote_post: 'badge-primary',
                    packaging_materials: 'badge-dark',
                      final_bidding: 'badge-success',
                      product_order: 'badge-warning',
                      other_credit: 'badge-primary', 
                    other_debit: 'badge-dark',
                    other: 'badge-secondary'
                  };
                  return badges[cat] || 'badge-secondary';
                };

              // Filter by category
              const categoryFiltered = earningsCategory === 'all' 
                ? allTxns 
                : allTxns.filter(txn => txn.category === earningsCategory);

              // Filter by search
              const filteredEarnings = earningsFilter 
                ? categoryFiltered.filter(txn => 
                    (txn.purpose || '').toLowerCase().includes(earningsFilter.toLowerCase()) ||
                    (txn.referenceId || '').toLowerCase().includes(earningsFilter.toLowerCase())
                  )
                : categoryFiltered;

              // Build cumulative earnings (running total sorted by date ascending)
              const sortedForCumulative = [...filteredEarnings].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
              let runningTotal = 0;
              const cumulativeMap = {};
              sortedForCumulative.forEach(txn => {
                if (txn.type === 'debit') {
                  runningTotal -= (txn.amount || 0);
                } else {
                  runningTotal += (txn.amount || 0);
                }
                cumulativeMap[txn._id] = runningTotal;
              });

              const totalEarningsPages = Math.ceil(filteredEarnings.length / pageSize);
              const displayEarnings = filteredEarnings.slice((earningsPage - 1) * pageSize, earningsPage * pageSize);

                return (
                  <>
                    {/* Total Platform Earnings - Prominent Card */}
                    <div className="row clearfix row-deck mb-4">
                      <div className="col-12">
                        <div className="card" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', border: 'none', cursor: 'pointer' }} onClick={() => { setEarningsCategory('all'); setEarningsPage(1); }}>
                          <div className="body d-flex align-items-center justify-content-between flex-wrap" style={{ padding: '20px 30px' }}>
                            <div className="d-flex align-items-center">
                              <div style={{ width: 55, height: 55, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                                <i className="fa fa-bar-chart text-white" style={{ fontSize: '24px' }}></i>
                              </div>
                              <div>
                                <div className="text-uppercase small" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>Total Platform Earnings</div>
                                <h2 className="mb-0 text-white" style={{ fontWeight: 700 }}>₹{(summary.totalPlatformEarningsAll || 0).toLocaleString()}</h2>
                                <small style={{ color: 'rgba(255,255,255,0.5)' }}>All services + commissions combined</small>
                              </div>
                            </div>
                            <div className="text-right d-none d-md-block">
                              <small style={{ color: 'rgba(255,255,255,0.6)' }}>Total Transactions: {summary.totalTransactions || 0}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row clearfix row-deck mb-4">
                    <div className="col-lg-3 col-md-6">
                      <div className="card top_widget bg-success text-light" style={{ cursor: 'pointer' }} onClick={() => { setEarningsCategory('all'); setEarningsPage(1); }}>
                        <div className="body">
                          <div className="icon bg-light text-success mb-2"><i className="fa fa-rupee"></i></div>
                          <div className="content">
                            <div className="text-uppercase small">Net Commission Earnings</div>
                            <h4 className="number mb-0">₹{(summary.netPlatformEarnings || 0).toLocaleString()}</h4>
                            <small>Earned - Reversed</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="card top_widget primary-bg text-light" style={{ cursor: 'pointer' }} onClick={() => { setEarningsCategory('all'); setEarningsPage(1); }}>
                        <div className="body">
                          <div className="icon bg-light text-primary mb-2"><i className="fa fa-calendar"></i></div>
                          <div className="content">
                            <div className="text-uppercase small">Today's Net Earnings</div>
                            <h4 className="number mb-0">₹{(summary.todayNetEarnings || 0).toLocaleString()}</h4>
                            <small>+₹{(summary.todayCommissionEarned || 0).toLocaleString()} / -₹{(summary.todayCommissionReversed || 0).toLocaleString()}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="card top_widget bg-info text-light" style={{ cursor: 'pointer' }} onClick={() => { setEarningsCategory('commission_earned'); setEarningsPage(1); }}>
                        <div className="body">
                          <div className="icon bg-light text-info mb-2"><i className="fa fa-plus-circle"></i></div>
                          <div className="content">
                            <div className="text-uppercase small">Total Commission Earned</div>
                            <h4 className="number mb-0">₹{(summary.totalCommissionEarned || 0).toLocaleString()}</h4>
                            <small>From order payouts</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="card top_widget bg-danger text-light" style={{ cursor: 'pointer' }} onClick={() => { setEarningsCategory('commission_reversed'); setEarningsPage(1); }}>
                        <div className="body">
                          <div className="icon bg-light text-danger mb-2"><i className="fa fa-minus-circle"></i></div>
                          <div className="content">
                            <div className="text-uppercase small">Commission Reversed</div>
                            <h4 className="number mb-0">₹{(summary.totalCommissionReversed || 0).toLocaleString()}</h4>
                            <small>From order cancellations</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                    <div className="row clearfix row-deck mb-4">
                      <div className="col-lg-4 col-md-6">
                        <div className="card">
                          <div className="body text-center">
                            <h6 className="text-muted">Admin Wallet Balance</h6>
                            <h3 className="text-primary">₹{(summary.adminWalletBalance || 0).toLocaleString()}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="card" style={{ cursor: 'pointer' }} onClick={() => { setEarningsCategory('admin_adjustment'); setEarningsPage(1); }}>
                          <div className="body text-center">
                            <h6 className="text-muted">Adjustments (Credit / Debit)</h6>
                            <h3><span className="text-success">+₹{(summary.totalAdjustmentCredit || 0).toLocaleString()}</span> / <span className="text-danger">-₹{(summary.totalAdjustmentDebit || 0).toLocaleString()}</span></h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="card">
                          <div className="body text-center">
                            <h6 className="text-muted">Other (Credit / Debit)</h6>
                            <h3><span className="text-success">+₹{(summary.totalOtherCredit || 0).toLocaleString()}</span> / <span className="text-danger">-₹{(summary.totalOtherDebit || 0).toLocaleString()}</span></h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service-wise Transaction Summary Cards */}
                    <h6 className="mb-3 text-muted" style={{ fontWeight: 600 }}>Service-wise Earnings Breakdown</h6>
                    <div className="row clearfix row-deck mb-4">
                      {[
                        { key: 'bidding_pass', label: 'Bidding Pass', icon: 'fa-ticket', color: '#6f42c1', total: summary.totalBiddingPass },
                        { key: 'certificate', label: 'Certificate', icon: 'fa-certificate', color: '#17a2b8', total: summary.totalCertificate },
                        { key: 'ads', label: 'Ads', icon: 'fa-bullhorn', color: '#fd7e14', total: summary.totalAds },
                        { key: 'exhibition', label: 'Exhibition', icon: 'fa-picture-o', color: '#28a745', total: summary.totalExhibition },
                        { key: 'challenges', label: 'Challenges', icon: 'fa-trophy', color: '#dc3545', total: summary.totalChallenges },
                        { key: 'insurance', label: 'Insurance', icon: 'fa-shield', color: '#6c757d', total: summary.totalInsurance },
                        { key: 'verification_badge', label: 'Verification Badges', icon: 'fa-check-circle', color: '#007bff', total: summary.totalVerificationBadge },
                        { key: 'promote_post', label: 'Promote Post', icon: 'fa-rocket', color: '#e83e8c', total: summary.totalPromotePost },
                        { key: 'packaging_materials', label: 'Packaging Materials', icon: 'fa-cube', color: '#343a40', total: summary.totalPackagingMaterials },
                          { key: 'final_bidding', label: 'Final Bidding', icon: 'fa-gavel', color: '#20c997', total: summary.totalFinalBidding },
                          { key: 'product_order', label: 'Product Order', icon: 'fa-shopping-cart', color: '#fd7e14', total: summary.totalProductOrder },
                      ].map(item => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={item.key}>
                          <div 
                            className="card" 
                            style={{ cursor: 'pointer', borderLeft: `4px solid ${item.color}` }} 
                            onClick={() => { setEarningsCategory(item.key); setEarningsPage(1); }}
                          >
                            <div className="body d-flex align-items-center" style={{ padding: '15px' }}>
                              <div style={{ width: 40, height: 40, borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                <i className={`fa ${item.icon} text-white`}></i>
                              </div>
                              <div>
                                <small className="text-muted d-block">{item.label}</small>
                                <strong style={{ fontSize: '16px' }}>₹{(item.total || 0).toLocaleString()}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  <div className="card">
                    <div className="header d-flex justify-content-between align-items-center flex-wrap" style={{ gap: '10px' }}>
                      <h2>Admin Wallet Transactions {earningsCategory !== 'all' ? `- ${getCategoryLabel(earningsCategory)}` : '- All'}</h2>
                      <div className="d-flex" style={{ gap: '10px' }}>
                        <select 
                          className="form-control" 
                          value={earningsCategory} 
                          onChange={e => { setEarningsCategory(e.target.value); setEarningsPage(1); }}
                          style={{ width: '200px' }}
                        >
                            <option value="all">All Categories</option>
                            <option value="buyer_payment">Buyer Payments</option>
                            <option value="buyer_refund">Buyer Refunds</option>
                            <option value="seller_payout">Seller Payouts</option>
                            <option value="seller_payout_reversed">Seller Payout Reversed</option>
                            <option value="commission_earned">Commission Earned</option>
                            <option value="commission_reversed">Commission Reversed</option>
                            <option value="bidding_pass">Bidding Pass</option>
                            <option value="certificate">Certificate</option>
                            <option value="ads">Ads</option>
                            <option value="exhibition">Exhibition</option>
                            <option value="challenges">Challenges</option>
                            <option value="insurance">Insurance</option>
                            <option value="verification_badge">Verification Badges</option>
                            <option value="promote_post">Promote Post</option>
                            <option value="packaging_materials">Packaging Materials</option>
                              <option value="final_bidding">Final Bidding</option>
                              <option value="product_order">Product Order</option>
                              <option value="add_money">Add Money</option>
                            <option value="withdrawal">Withdrawals</option>
                            <option value="admin_adjustment">Admin Adjustments</option>
                            <option value="other_credit">Other Credit</option>
                            <option value="other_debit">Other Debit</option>
                        </select>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search by purpose or order ID..." 
                          value={earningsFilter} 
                          onChange={e => { setEarningsFilter(e.target.value); setEarningsPage(1); }} 
                          style={{ width: '250px' }}
                        />
                      </div>
                    </div>
                    <div className="body table-responsive">
                      <table className="table table-hover">
                        <thead>
                            <tr>
                              <th>Date</th>
                              <th>User</th>
                              <th>Category</th>
                              <th>Type</th>
                              <th>Purpose</th>
                              <th>Amount</th>
                              <th>Balance After</th>
                              <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                          {displayEarnings.map(txn => (
                              <tr key={txn._id}>
                                <td>{new Date(txn.createdAt).toLocaleString()}</td>
                                <td>
                                  <div style={{fontSize:'13px'}}>{txn.userName || 'Unknown'}</div>
                                  <small className="text-muted">{txn.userRole}</small>
                                </td>
                                <td><span className={`badge ${getCategoryBadge(txn.category)}`}>{getCategoryLabel(txn.category)}</span></td>
                                <td><span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>{txn.type}</span></td>
                                <td className="whitespace-normal" style={{maxWidth:'250px'}}>{txn.purpose}</td>
                                <td className={`font-weight-bold ${txn.type === 'debit' ? 'text-danger' : 'text-success'}`}>
                                  {txn.type === 'debit' ? '-' : '+'}₹{(txn.amount || 0).toLocaleString()}
                                </td>
                                <td>₹{(txn.balanceAfter != null ? txn.balanceAfter : '-').toLocaleString()}</td>
                                <td><span className={`badge ${txn.status === 'success' ? 'badge-success' : txn.status === 'pending' ? 'badge-warning' : 'badge-secondary'}`}>{txn.status}</span></td>
                              </tr>
                            ))}
                            {displayEarnings.length === 0 && <tr><td colSpan="8" className="text-center">No transactions found</td></tr>}
                        </tbody>
                      </table>
                      <div className="mt-3 d-flex justify-content-between align-items-center">
                        <div>Page {earningsPage} of {totalEarningsPages || 1} ({filteredEarnings.length} transactions)</div>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-light" disabled={earningsPage === 1} onClick={() => setEarningsPage(p => p - 1)}>Prev</button>
                          <button className="btn btn-sm btn-light" disabled={earningsPage >= totalEarningsPages} onClick={() => setEarningsPage(p => p + 1)}>Next</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

        {activeTab === 'orderPayouts' && (() => {
            const handleImmediatePayout = async () => {
              const orderId = payoutModal.orderId;
              if (!orderId) return;
              setPayoutModal({ show: false, orderId: null });
              setPayoutProcessing(orderId);
              try {
                const res = await axios.post(`/api/immediate-seller-payout/${orderId}`);
                toast.success(res.data.message || "Payout processed successfully");
                fetchData();
              } catch (err) {
                toast.error(err?.response?.data?.message || "Failed to process payout");
              } finally {
                setPayoutProcessing(null);
              }
            };

          const filtered = orders.filter(o => {
            if (orderStatusFilter && o.orderStatus !== orderStatusFilter) return false;
            if (orderFilter) {
              const q = orderFilter.toLowerCase();
              return (o.orderId || "").toLowerCase().includes(q) ||
                     (o.buyerName || "").toLowerCase().includes(q) ||
                     (o.artistName || "").toLowerCase().includes(q) ||
                     (o.productName || "").toLowerCase().includes(q);
            }
            return true;
          });
          const totalOrderPages = Math.ceil(filtered.length / pageSize);
          const displayOrders = filtered.slice((orderPage - 1) * pageSize, orderPage * pageSize);

          const unpaidDelivered = orders.filter(o => o.orderStatus === "Delivered" && !o.sellerPaid).length;
          const paidCount = orders.filter(o => o.sellerPaid).length;
          const totalCommission = orders.filter(o => o.platformCommission).reduce((s, o) => s + o.platformCommission, 0);
          const totalSellerEarnings = orders.filter(o => o.sellerEarnings).reduce((s, o) => s + o.sellerEarnings, 0);

          return (
            <>
              <div className="row clearfix row-deck mb-4">
                <div className="col-lg-3 col-md-6">
                  <div className="card top_widget bg-warning text-dark">
                    <div className="body">
                      <div className="icon bg-light text-warning mb-2"><i className="fa fa-clock-o"></i></div>
                      <div className="content">
                        <div className="text-uppercase small">Pending Payouts</div>
                        <h4 className="number mb-0">{unpaidDelivered}</h4>
                        <small>Delivered but unpaid</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card top_widget bg-success text-light">
                    <div className="body">
                      <div className="icon bg-light text-success mb-2"><i className="fa fa-check"></i></div>
                      <div className="content">
                        <div className="text-uppercase small">Paid Orders</div>
                        <h4 className="number mb-0">{paidCount}</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card top_widget bg-info text-light">
                    <div className="body">
                      <div className="icon bg-light text-info mb-2"><i className="fa fa-rupee"></i></div>
                      <div className="content">
                        <div className="text-uppercase small">Total Commission</div>
                        <h4 className="number mb-0">₹{totalCommission.toLocaleString()}</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card top_widget primary-bg text-light">
                    <div className="body">
                      <div className="icon bg-light text-primary mb-2"><i className="fa fa-money"></i></div>
                      <div className="content">
                        <div className="text-uppercase small">Total Seller Payouts</div>
                        <h4 className="number mb-0">₹{totalSellerEarnings.toLocaleString()}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="header d-flex justify-content-between align-items-center flex-wrap" style={{ gap: '10px' }}>
                  <h2>Order Payouts Management</h2>
                  <div className="d-flex" style={{ gap: '10px' }}>
                    <select className="form-control" style={{ width: '160px' }} value={orderStatusFilter} onChange={e => { setOrderStatusFilter(e.target.value); setOrderPage(1); }}>
                      <option value="">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <input type="text" className="form-control" placeholder="Search order, buyer, artist..." value={orderFilter} onChange={e => { setOrderFilter(e.target.value); setOrderPage(1); }} style={{ width: '250px' }} />
                  </div>
                </div>
                <div className="body table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Buyer</th>
                        <th>Artist/Seller</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Order Status</th>
                        <th>Payout Status</th>
                        <th>Commission</th>
                        <th>Seller Earnings</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayOrders.map(order => {
                        const statusColors = {
                          Pending: 'badge-secondary', Confirmed: 'badge-info', Shipped: 'badge-primary',
                          Delivered: 'badge-success', Completed: 'badge-success', Cancelled: 'badge-danger'
                        };
                        return (
                          <tr key={order._id}>
                            <td><code>{order.orderId}</code></td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{order.buyerName}</td>
                            <td>{order.artistName}</td>
                            <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.productName}</td>
                            <td className="font-weight-bold">₹{(order.totalAmount || 0).toLocaleString()}</td>
                            <td><span className={`badge ${statusColors[order.orderStatus] || 'badge-secondary'}`}>{order.orderStatus}</span></td>
                            <td>
                              {order.sellerPaid ? (
                                <span className="badge badge-success">Paid {order.sellerPaidAt ? new Date(order.sellerPaidAt).toLocaleDateString() : ''}</span>
                              ) : order.orderStatus === 'Cancelled' ? (
                                <span className="badge badge-dark">N/A</span>
                              ) : (
                                <span className="badge badge-warning">Unpaid</span>
                              )}
                            </td>
                            <td>{order.platformCommission != null ? `₹${order.platformCommission.toLocaleString()}` : '-'}</td>
                            <td>{order.sellerEarnings != null ? `₹${order.sellerEarnings.toLocaleString()}` : '-'}</td>
                            <td>
                                {!order.sellerPaid && order.orderStatus === 'Delivered' ? (
                                  <button
                                    className="btn btn-sm btn-warning"
                                    disabled={payoutProcessing === order.orderId}
                                    onClick={() => setPayoutModal({ show: true, orderId: order.orderId })}
                                  >
                                  {payoutProcessing === order.orderId ? (
                                    <><i className="fa fa-spinner fa-spin mr-1"></i>Processing</>
                                  ) : (
                                    <><i className="fa fa-bolt mr-1"></i>Immediate Payout</>
                                  )}
                                </button>
                              ) : order.sellerPaid ? (
                                <span className="text-success"><i className="fa fa-check-circle"></i> Done</span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {displayOrders.length === 0 && <tr><td colSpan="11" className="text-center">No orders found</td></tr>}
                    </tbody>
                  </table>
                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <div>Page {orderPage} of {totalOrderPages || 1} ({filtered.length} orders)</div>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-light" disabled={orderPage === 1} onClick={() => setOrderPage(p => p - 1)}>Prev</button>
                      <button className="btn btn-sm btn-light" disabled={orderPage >= totalOrderPages} onClick={() => setOrderPage(p => p + 1)}>Next</button>
                    </div>
                  </div>
                </div>
                </div>
              </>
            );
          })()}

          {/* Immediate Payout Confirmation Modal */}
          {payoutModal.show && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header bg-warning">
                    <h5 className="modal-title"><i className="fa fa-bolt mr-2"></i>Confirm Immediate Payout</h5>
                    <button type="button" className="close" onClick={() => setPayoutModal({ show: false, orderId: null })}>
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="text-center mb-3">
                      <i className="fa fa-exclamation-triangle text-warning" style={{ fontSize: '48px' }}></i>
                    </div>
                    <p className="text-center mb-2">
                      Are you sure you want to process immediate payout for order <strong>{payoutModal.orderId}</strong>?
                    </p>
                    <p className="text-center text-muted small">
                      This will credit the seller's wallet and deduct platform commission. This action cannot be undone.
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setPayoutModal({ show: false, orderId: null })}>Cancel</button>
                    <button className="btn btn-warning" onClick={() => {
                      const orderId = payoutModal.orderId;
                      setPayoutModal({ show: false, orderId: null });
                      setPayoutProcessing(orderId);
                      axios.post(`/api/immediate-seller-payout/${orderId}`)
                        .then(res => { toast.success(res.data.message || "Payout processed successfully"); fetchData(); })
                        .catch(err => { toast.error(err?.response?.data?.message || "Failed to process payout"); })
                        .finally(() => setPayoutProcessing(null));
                    }}>
                      <i className="fa fa-bolt mr-1"></i>Confirm Payout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

            {activeTab === 'settings' && referralSettings && (
              <div className="row clearfix">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="header">
                      <h2>Coin Value Settings</h2>
                    </div>
                      <div className="body">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group">
                              <label><strong>Art Coin Value (1 Coin = ₹)</strong></label>
                              <input 
                                type="number" 
                                className="form-control" 
                                value={coinSetting.coinValue} 
                                onChange={e => setCoinSetting({ ...coinSetting, coinValue: Number(e.target.value) })} 
                                step="0.01"
                                min="0"
                              />
                                <small className="text-muted">Example: 0.10 means 10 coins = ₹1</small>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label><strong>Transaction Reward (Art Coins)</strong></label>
                              <input 
                                type="number" 
                                className="form-control" 
                                value={coinSetting.transactionReward || 10} 
                                onChange={e => setCoinSetting({ ...coinSetting, transactionReward: Number(e.target.value) })} 
                                min="0"
                              />
                              <small className="text-muted">Coins awarded per transaction (Add Money, Buy, etc.)</small>
                            </div>
                          </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label><strong>Currency Symbol</strong></label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={coinSetting.currency} 
                                  onChange={e => setCoinSetting({ ...coinSetting, currency: e.target.value })} 
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div className="col-md-4">
                              <div className="form-group">
                                <label><strong>Artist Signup Bonus</strong></label>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  value={coinSetting.artistSignupBonus || 0} 
                                  onChange={e => setCoinSetting({ ...coinSetting, artistSignupBonus: Number(e.target.value) })} 
                                  min="0"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label><strong>Seller Signup Bonus</strong></label>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  value={coinSetting.sellerSignupBonus || 0} 
                                  onChange={e => setCoinSetting({ ...coinSetting, sellerSignupBonus: Number(e.target.value) })} 
                                  min="0"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label><strong>Buyer Signup Bonus</strong></label>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  value={coinSetting.buyerSignupBonus || 0} 
                                  onChange={e => setCoinSetting({ ...coinSetting, buyerSignupBonus: Number(e.target.value) })} 
                                  min="0"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row mt-2">
                          <div className="col-md-6">
                            <div className="p-3 bg-light border rounded h-100">
                                <h6><i className="fa fa-eye mr-2"></i>Value Preview (Real-time)</h6>
                                <hr />
                                <div className="d-flex justify-content-between mb-2">
                                  <span>1 Art Coin:</span>
                                  <strong className="text-success">{coinSetting.currency} {(1 * coinSetting.coinValue).toFixed(2)}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <span>10 Art Coins:</span>
                                  <strong className="text-success">{coinSetting.currency} {(10 * coinSetting.coinValue).toFixed(2)}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <span>100 Art Coins:</span>
                                  <strong className="text-success">{coinSetting.currency} {(100 * coinSetting.coinValue).toFixed(2)}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                  <span>1,000 Art Coins:</span>
                                  <strong className="text-success">{coinSetting.currency} {(1000 * coinSetting.coinValue).toFixed(2)}</strong>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="p-3 bg-light border rounded h-100">
                                <h6><i className="fa fa-gift mr-2"></i>Benefit Preview (Platform-wide)</h6>
                                <hr />
                                <div className="d-flex justify-content-between mb-2">
                                  <span>Transaction Reward ({coinSetting.transactionReward || 10} coins):</span>
                                  <strong className="text-primary">{coinSetting.currency} {((coinSetting.transactionReward || 10) * coinSetting.coinValue).toFixed(2)}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <span>Artist/Seller Referral ({referralSettings.artistReferrerCoinsReward || 0} coins):</span>
                                  <strong className="text-primary">{coinSetting.currency} {((referralSettings.artistReferrerCoinsReward || 0) * coinSetting.coinValue).toFixed(2)}</strong>
                                </div>
                                  <div className="d-flex justify-content-between mb-2">
                                    <span>Buyer Referral ({referralSettings.buyerReferrerCoinsReward || 0} coins):</span>
                                    <strong className="text-primary">{coinSetting.currency} {((referralSettings.buyerReferrerCoinsReward || 0) * coinSetting.coinValue).toFixed(2)}</strong>
                                  </div>
                                  <div className="d-flex justify-content-between mb-2">
                                    <span>Artist Signup Bonus ({coinSetting.artistSignupBonus || 0} coins):</span>
                                    <strong className="text-primary">{coinSetting.currency} {((coinSetting.artistSignupBonus || 0) * coinSetting.coinValue).toFixed(2)}</strong>
                                  </div>
                                  <div className="d-flex justify-content-between mb-2">
                                    <span>Seller Signup Bonus ({coinSetting.sellerSignupBonus || 0} coins):</span>
                                    <strong className="text-primary">{coinSetting.currency} {((coinSetting.sellerSignupBonus || 0) * coinSetting.coinValue).toFixed(2)}</strong>
                                  </div>
                                  <div className="d-flex justify-content-between mb-2">
                                    <span>Buyer Signup Bonus ({coinSetting.buyerSignupBonus || 0} coins):</span>
                                    <strong className="text-primary">{coinSetting.currency} {((coinSetting.buyerSignupBonus || 0) * coinSetting.coinValue).toFixed(2)}</strong>
                                  </div>
                                  <div className="mt-3 text-muted small border-top pt-2">
                                  <i className="fa fa-info-circle mr-1"></i> These rewards are automatically shown to Artists, Sellers, and Buyers in their respective dashboards.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <button className="btn btn-warning" onClick={saveCoinSetting} disabled={isSavingCoinSetting}>
                              {isSavingCoinSetting ? 'Saving...' : 'Save Coin Settings'}
                            </button>
                          </div>
                      </div>
                    </div>

                    <div className="card mt-4">
                      <div className="header d-flex justify-content-between align-items-center">
                        <h2>Referral Program Settings</h2>

                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="referralActiveSwitch"
                          checked={referralSettings.isActive}
                          onChange={e => setReferralSettings({ ...referralSettings, isActive: e.target.checked })}
                        />
                        <label className="custom-control-label" htmlFor="referralActiveSwitch">
                          Program Status: <strong>{referralSettings.isActive ? 'Active' : 'Disabled'}</strong>
                        </label>
                      </div>
                    </div>
                    <div className="body">
                      <div className="row mb-4">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label><strong>Min Purchase for Reward (₹)</strong></label>
                            <input type="number" className="form-control" value={referralSettings.minPurchaseForReward || 0} onChange={e => setReferralSettings({ ...referralSettings, minPurchaseForReward: Number(e.target.value) })} min="0" />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label><strong>Max Referrals Per User</strong></label>
                            <input type="number" className="form-control" value={referralSettings.maxReferralsPerUser || 0} onChange={e => setReferralSettings({ ...referralSettings, maxReferralsPerUser: Number(e.target.value) })} min="0" />
                          </div>
                        </div>
                      </div>

                        <div className="row">
                          {/* Artist & Seller Settings */}
                          <div className="col-md-6">
                            <div className="card border shadow-none bg-light">
                              <div className="header"><h6>Artist & Seller Referral Rewards</h6></div>
                              <div className="body p-3">
                                <div className="form-group">
                                  <label>Referrer Cash (₹)</label>
                                  <input 
                                    type="number" 
                                    className="form-control" 
                                    value={referralSettings.artistReferrerCashReward || 0} 
                                    onChange={e => {
                                      const val = Number(e.target.value);
                                      setReferralSettings({ 
                                        ...referralSettings, 
                                        artistReferrerCashReward: val,
                                        sellerReferrerCashReward: val 
                                      });
                                    }} 
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Referrer Art Coins</label>
                                  <div className="input-group">
                                    <input 
                                      type="number" 
                                      className="form-control" 
                                      value={referralSettings.artistReferrerCoinsReward || 0} 
                                      onChange={e => {
                                        const val = Number(e.target.value);
                                        setReferralSettings({ 
                                          ...referralSettings, 
                                          artistReferrerCoinsReward: val,
                                          sellerReferrerCoinsReward: val 
                                        });
                                      }} 
                                    />
                                    <div className="input-group-append">
                                      <span className="input-group-text bg-white text-muted">
                                        ≈ {coinSetting.currency} {( (referralSettings.artistReferrerCoinsReward || 0) * coinSetting.coinValue).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Referred Cash (₹)</label>
                                  <input 
                                    type="number" 
                                    className="form-control" 
                                    value={referralSettings.artistReferredCashReward || 0} 
                                    onChange={e => {
                                      const val = Number(e.target.value);
                                      setReferralSettings({ 
                                        ...referralSettings, 
                                        artistReferredCashReward: val,
                                        sellerReferredCashReward: val 
                                      });
                                    }} 
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Referred Art Coins</label>
                                  <div className="input-group">
                                    <input 
                                      type="number" 
                                      className="form-control" 
                                      value={referralSettings.artistReferredCoinsReward || 0} 
                                      onChange={e => {
                                        const val = Number(e.target.value);
                                        setReferralSettings({ 
                                          ...referralSettings, 
                                          artistReferredCoinsReward: val,
                                          sellerReferredCoinsReward: val 
                                        });
                                      }} 
                                    />
                                    <div className="input-group-append">
                                      <span className="input-group-text bg-white text-muted">
                                        ≈ {coinSetting.currency} {( (referralSettings.artistReferredCoinsReward || 0) * coinSetting.coinValue).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Buyer Settings */}
                          <div className="col-md-6">

                          <div className="card border shadow-none bg-light">
                            <div className="header"><h6>Buyer Referral Rewards</h6></div>
                            <div className="body p-3">
                              <div className="form-group">
                                <label>Referrer Cash (₹)</label>
                                <input type="number" className="form-control" value={referralSettings.buyerReferrerCashReward || 0} onChange={e => setReferralSettings({ ...referralSettings, buyerReferrerCashReward: Number(e.target.value) })} />
                              </div>
                              <div className="form-group">
                                <label>Referrer Art Coins</label>
                                <div className="input-group">
                                  <input type="number" className="form-control" value={referralSettings.buyerReferrerCoinsReward || 0} onChange={e => setReferralSettings({ ...referralSettings, buyerReferrerCoinsReward: Number(e.target.value) })} />
                                  <div className="input-group-append">
                                    <span className="input-group-text bg-white text-muted">
                                      ≈ {coinSetting.currency} {( (referralSettings.buyerReferrerCoinsReward || 0) * coinSetting.coinValue).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Referred Cash (₹)</label>
                                <input type="number" className="form-control" value={referralSettings.buyerReferredCashReward || 0} onChange={e => setReferralSettings({ ...referralSettings, buyerReferredCashReward: Number(e.target.value) })} />
                              </div>
                              <div className="form-group">
                                <label>Referred Art Coins</label>
                                <div className="input-group">
                                  <input type="number" className="form-control" value={referralSettings.buyerReferredCoinsReward || 0} onChange={e => setReferralSettings({ ...referralSettings, buyerReferredCoinsReward: Number(e.target.value) })} />
                                  <div className="input-group-append">
                                    <span className="input-group-text bg-white text-muted">
                                      ≈ {coinSetting.currency} {( (referralSettings.buyerReferredCoinsReward || 0) * coinSetting.coinValue).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button className="btn btn-primary btn-lg" onClick={saveReferralSettings} disabled={isSavingSettings}>
                          {isSavingSettings ? 'Saving...' : 'Save All Settings'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}
    </div>
  );
};

export default AdminWalletManagement;
