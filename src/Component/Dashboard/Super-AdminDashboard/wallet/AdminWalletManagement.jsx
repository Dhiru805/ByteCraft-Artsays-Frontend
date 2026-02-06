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

  // Filtering logic
  const filteredTransactions = transactions.filter(txn => {
    const userWallet = wallets.find(w => String(w.userId?._id || w.userId) === String(txn.userId));
    
    const matchesType = !filterType || txn.type === filterType;
    const matchesStatus = !filterStatus || txn.status === filterStatus;
    
    if (filterRole) {
      if (!userWallet) return false;
      if ((userWallet.role || '').toLowerCase() !== filterRole.toLowerCase()) return false;
    }
    
    if (filterUser || filterAllUser) {
      const targetUserId = filterUser || filterAllUser;
      if (String(txn.userId) !== targetUserId) return false;
    }
    
    return matchesType && matchesStatus;
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



{activeTab === 'withdrawals' && (
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <h2>Withdrawal Requests</h2>
              <div className="d-flex" style={{ gap: '10px' }}>
                <select className="form-control" style={{ width: '150px' }} value={filterWithdrawalUserType} onChange={e => setFilterWithdrawalUserType(e.target.value)}>
                  <option value="">All User Types</option>
                  <option value="Artist">Artist</option>
                  <option value="Seller">Seller</option>
                  <option value="Buyer">Buyer</option>
                </select>
                <select className="form-control" style={{ width: '150px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
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
                    {withdrawals.filter(w => {
                      if (filterStatus && w.status !== filterStatus) return false;
                      if (filterWithdrawalUserType) {
                        const wal = wallets.find(wal => String(wal.userId?._id || wal.userId) === String(w.userId));
                        if (!wal || (wal.role || '').toLowerCase() !== filterWithdrawalUserType.toLowerCase()) return false;
                      }
                      return true;
                    }).map(req => {
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
                    {withdrawals.filter(w => {
                      if (filterStatus && w.status !== filterStatus) return false;
                      if (filterWithdrawalUserType) {
                        const wal = wallets.find(wal => String(wal.userId?._id || wal.userId) === String(w.userId));
                        if (!wal || (wal.role || '').toLowerCase() !== filterWithdrawalUserType.toLowerCase()) return false;
                      }
                      return true;
                    }).length === 0 && <tr><td colSpan="8" className="text-center">No withdrawals found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                  const user = wallets.find(w => String(w.userId?._id || w.userId) === String(txn.userId));
                  const userName = txn.name && txn.lastName 
                    ? `${txn.name} ${txn.lastName}` 
                    : user 
                      ? `${user.name} ${user.lastName}` 
                      : (txn.userId || 'Unknown');
                  return (
                    <tr key={txn._id}>
                      <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                      <td>{userName}</td>
                      <td><span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>{txn.type}</span></td>
                      <td>₹{txn.amount.toLocaleString()}</td>
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

{activeTab === 'referrals' && (
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
                    {wallets.map(w => (
                      <tr key={w._id}>
                        <td><strong>{w.name} {w.lastName}</strong></td>
                        <td><code>{w.referralCode || 'Not Generated'}</code></td>
                        <td>{w.referralCount || 0}</td>
                        <td>₹{(w.referralEarnings || 0).toLocaleString()}</td>
                        <td>{w.referredBy || '-'}</td>
                      </tr>
                    ))}
                    {wallets.length === 0 && <tr><td colSpan="5" className="text-center">No wallets found</td></tr>}
                  </tbody>
                </table>
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
