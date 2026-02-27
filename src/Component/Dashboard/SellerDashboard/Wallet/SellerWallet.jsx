import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../../../Constants/index";

const SellerWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("upi");
  const [withdrawDestination, setWithdrawDestination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("transactions");
  const [withdrawals, setWithdrawals] = useState([]);
  const [referralData, setReferralData] = useState(null);
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [isApplyingReferral, setIsApplyingReferral] = useState(false);
  const [referralSettings, setReferralSettings] = useState(null);

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const fetchWallet = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/${userId}`);
      setWallet(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const createRes = await axios.post(`${API_URL}/api/wallet/ensure/${userId}`);
        setWallet(createRes.data);
      } else {
        toast.error("Failed to fetch wallet details");
      }
    }
  }, [userId]);

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/transactions/${userId}`);
      setTransactions(res.data);
    } catch (err) {
      toast.error("Failed to fetch transactions");
    }
  }, [userId]);

  const fetchWithdrawals = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/withdrawals/user/${userId}`);
      setWithdrawals(res.data.withdrawals || []);
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    }
  }, [userId]);

  const fetchReferralData = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/referral/stats/${userId}`);
      setReferralData(res.data);
    } catch (err) {
      console.error("Error fetching referral data:", err);
    }
  }, [userId]);

  const fetchReferralSettings = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/referral/settings/${userId}`);
      setReferralSettings(res.data);
    } catch (err) {
      console.error("Error fetching referral settings:", err);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchWallet();
    fetchTransactions();
    fetchWithdrawals();
    fetchReferralData();
    fetchReferralSettings();
  }, [userId, fetchWallet, fetchTransactions, fetchWithdrawals, fetchReferralData, fetchReferralSettings]);

  const addMoneyDirect = async () => {
    if (!amount || amount <= 0) return toast.error("Please enter a valid amount");
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/add-money/initiate/${userId}`, { amount: Number(amount) });
      if (res.data.success && res.data.data.paymentUrl) {
        window.location.href = res.data.data.paymentUrl;
      }
      setAmount("");
      fetchWallet();
      fetchTransactions();
    } catch (err) {
      toast.error("Failed to add money");
    } finally {
      setIsLoading(false);
    }
  };

  const requestWithdrawal = async () => {
    if (!withdrawAmount || withdrawAmount < 100) return toast.error("Minimum withdrawal is ₹100");
    if (withdrawAmount > wallet.balance) return toast.error("Insufficient balance");

    if (withdrawMethod === "upi" && !withdrawDestination.upi) return toast.error("Please enter UPI ID");
    if (withdrawMethod === "bank") {
      const { name, accountNumber, ifsc, bankName, purpose } = withdrawDestination;
      if (!name || !accountNumber || !ifsc || !bankName || !purpose) return toast.error("Please fill all bank transfer details");
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/wallet/withdraw/${userId}`, {
        amount: Number(withdrawAmount),
        method: withdrawMethod,
        destination: withdrawMethod === "upi" ? withdrawDestination.upi : withdrawDestination
      });
      toast.success("Withdrawal requested successfully!");
      setWithdrawAmount("");
      setWithdrawDestination({});
      fetchWallet();
      fetchWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (wallet?.referralCode) {
      navigator.clipboard.writeText(wallet.referralCode);
      toast.success("Referral code copied!");
    }
  };

  const applyReferralCode = async () => {
    if (!referralCodeInput.trim()) return toast.error("Please enter a referral code");
    if (wallet?.referredBy) return toast.error("You have already used a referral code");
    setIsApplyingReferral(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/referral/apply`, {
        userId,
        referralCode: referralCodeInput.trim().toUpperCase()
      });
      toast.success(res.data.message || "Referral code applied successfully!");
      setReferralCodeInput("");
      fetchWallet();
      fetchReferralData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply referral code");
    } finally {
      setIsApplyingReferral(false);
    }
  };

  const showReferral = referralSettings?.isActive || userType === "Super-Admin";

  if (!wallet) return <WalletSkeleton />;

  const displayedTransactions = transactions.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(transactions.length / pageSize);

  return (
    <div className="container-fluid">
      <div className="block-header mb-4">
        <h2>My Wallet - {userType}</h2>
      </div>

      <div className="row clearfix row-deck mb-4">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget primary-bg">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-rupee"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Available Balance</div>
                <h4 className="number mb-0">₹{wallet.balance}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget secondary-bg">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-hourglass-half"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Pending Withdrawal</div>
                <h4 className="number mb-0">₹{wallet.pendingWithdrawal}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget bg-dark">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-shopping-basket"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Art Coins</div>
                <h4 className="number mb-0">{wallet.artCoins}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget bg-info">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-chart-line"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Total Earnings</div>
                <h4 className="number mb-0">₹{wallet.totalCredited}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix mb-4">
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="header">
              <h2>Add Money to Wallet</h2>
            </div>
            <div className="body">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="1"
                />
              </div>
              <div className="d-flex gap-2">
                  <button
                    disabled={isLoading}
                    className="btn btn-primary"
                    onClick={addMoneyDirect}
                  >
                    Add Money in wallet
                  </button>
                </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="header"><h2>Request Withdrawal</h2></div>
            <div className="body">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  min="100"
                />
              </div>

              <div className="form-group">
                <label>Withdrawal Method</label>
                <select
                  className="form-control"
                  value={withdrawMethod}
                  onChange={e => setWithdrawMethod(e.target.value)}
                >
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              {withdrawMethod === "upi" && (
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter UPI ID"
                    value={withdrawDestination.upi || ""}
                    onChange={e => setWithdrawDestination({ upi: e.target.value })}
                  />
                </div>
              )}

              {withdrawMethod === "bank" && (
                <>
                  <div className="form-group">
                    <label>Beneficiary's Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter full name"
                      value={withdrawDestination.name || ""}
                      onChange={e => setWithdrawDestination({ ...withdrawDestination, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter account number"
                      value={withdrawDestination.accountNumber || ""}
                      onChange={e => setWithdrawDestination({ ...withdrawDestination, accountNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter IFSC code"
                      value={withdrawDestination.ifsc || ""}
                      onChange={e => setWithdrawDestination({ ...withdrawDestination, ifsc: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bank Name & Branch</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter bank name & branch"
                      value={withdrawDestination.bankName || ""}
                      onChange={e => setWithdrawDestination({ ...withdrawDestination, bankName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Purpose of Transfer</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter purpose"
                      value={withdrawDestination.purpose || ""}
                      onChange={e => setWithdrawDestination({ ...withdrawDestination, purpose: e.target.value })}
                    />
                  </div>
                </>
              )}

              <button
                className="btn btn-warning btn-block mt-3"
                onClick={requestWithdrawal}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Request Withdrawal"}
              </button>
              <small className="text-muted">Minimum withdrawal: ₹100. Admin approval required.</small>
            </div>
          </div>
        </div>
      </div>

      {showReferral && referralData && (
        <div className="row clearfix mb-4">
          <div className="col-12">
            <div className="card">
              <div className="header"><h2>Referral Program</h2></div>
              <div className="body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5>Your Referral Code</h5>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control form-control-lg text-center font-weight-bold"
                            value={wallet?.referralCode || "Not Generated"}
                            readOnly
                            style={{ letterSpacing: "2px" }}
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-primary"
                              onClick={copyReferralCode}
                              disabled={!wallet?.referralCode}
                              style={{ backgroundColor: "#4B2E05", borderColor: "#4B2E05" }}
                            >
                              <i className="fa fa-copy"></i> Copy
                            </button>
                          </div>
                        </div>
                        <p className="text-muted mb-0">Share this code with friends to earn rewards!</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5>Enter Referral Code</h5>
                        {wallet?.referredBy ? (
                          <div className="alert alert-success">
                            <i className="fa fa-check-circle"></i> You joined using code: <strong>{wallet.referredBy}</strong>
                          </div>
                        ) : (
                          <>
                            <div className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter friend's referral code"
                                value={referralCodeInput}
                                onChange={e => setReferralCodeInput(e.target.value.toUpperCase())}
                                maxLength={10}
                              />
                              <div className="input-group-append">
                                <button
                                  className="btn btn-success"
                                  onClick={applyReferralCode}
                                  disabled={isApplyingReferral || !referralCodeInput.trim()}
                                >
                                  {isApplyingReferral ? "Applying..." : "Apply"}
                                </button>
                              </div>
                            </div>
                            <p className="text-muted mb-0">Enter a referral code to get bonus Art Coins!</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-4">
                    <div className="card text-center" style={{ backgroundColor: "#4B2E05", color: "#fff" }}>
                      <div className="card-body">
                        <h3>{referralData?.totalReferrals || wallet?.referralCount || 0}</h3>
                        <p className="mb-0">Friends Referred</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-center" style={{ backgroundColor: "#F36F21", color: "#fff" }}>
                      <div className="card-body">
                        <h3>₹{referralData?.totalEarnings || wallet?.referralEarnings || 0}</h3>
                        <p className="mb-0">Referral Earnings</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-center bg-success text-white">
                      <div className="card-body">
                        <h3>₹50 + 100 Coins</h3>
                        <p className="mb-0">Per Referral Reward</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info mt-4">
                  <h5><i className="fa fa-info-circle"></i> How Referrals Work</h5>
                  <ul className="mb-0">
                    <li>Share your referral code with friends</li>
                    <li>When they sign up and enter your code, both of you get rewards</li>
                    <li>You earn ₹50 cash + 100 Art Coins per successful referral</li>
                    <li>Your friend gets 50 Art Coins as a welcome bonus</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row clearfix">
        <div className="col-sm-12">
          <div className="card">
            <div className="header">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                  >
                    Transactions
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'withdrawals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('withdrawals')}
                  >
                    Withdrawal History
                  </button>
                </li>
              </ul>
            </div>

            {activeTab === 'transactions' && (
              <>
                <div className="header d-flex justify-content-between align-items-center">
                  <h2>Recent Transactions</h2>
                  <div>Show
                    <select
                      className="form-control d-inline-block w-auto ml-2"
                      value={pageSize}
                      onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                    >
                      {[5, 10, 15, 20, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                    entries
                  </div>
                </div>
                <div className="body table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedTransactions.map((txn, idx) => (
                        <tr key={txn._id}>
                          <td>{(page - 1) * pageSize + idx + 1}</td>
                          <td>
                            <span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>
                              {txn.type}
                            </span>
                          </td>
                          <td>₹{txn.amount}</td>
                          <td>{txn.purpose}</td>
                          <td>
                            <span className={`badge ${txn.status === 'success' ? 'badge-success' :
                              txn.status === 'pending' ? 'badge-warning' : 'badge-danger'
                              }`}>
                              {txn.status}
                            </span>
                          </td>
                          <td>{new Date(txn.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                      {displayedTransactions.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center">No transactions yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-end align-items-center mt-3 px-3 py-3">
                  <ul className="pagination mb-0">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage(prev => Math.max(prev - 1, 1))}>&laquo;</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${page === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}>&raquo;</button>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {activeTab === 'withdrawals' && (
              <div className="body table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Requested</th>
                      <th>Processed</th>
                      <th>Admin Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w, idx) => (
                      <tr key={w._id}>
                        <td>{idx + 1}</td>
                        <td>₹{w.amount}</td>
                        <td>{w.method?.toUpperCase()}</td>
                        <td>
                          <span className={`badge badge-${
                            w.status === 'paid' ? 'success' :
                            w.status === 'approved' ? 'info' :
                            w.status === 'pending' ? 'warning' : 'danger'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                        <td>{new Date(w.createdAt).toLocaleString()}</td>
                        <td>{w.processedAt ? new Date(w.processedAt).toLocaleString() : '-'}</td>
                        <td>{w.adminNote || '-'}</td>
                      </tr>
                    ))}
                    {withdrawals.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center">No withdrawal requests yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function WalletSkeleton() {
  return (
    <div className="container-fluid animate-pulse">
      <div className="block-header mb-4">
        <div className="h-8 w-48 bg-gray-300 rounded"></div>
      </div>
      <div className="row clearfix row-deck mb-4">
        {Array(4).fill().map((_, idx) => (
          <div key={idx} className="col-lg-3 col-md-6 col-sm-6 mb-3">
            <div className="card p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row clearfix mb-4">
        <div className="col-lg-6 col-md-12 mb-4">
          <div className="card p-4 shadow-sm rounded-lg">
            <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-4">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-300 rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-32 bg-gray-300 rounded"></div>
                <div className="h-10 w-40 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 mb-4">
          <div className="card p-4 shadow-sm rounded-lg">
            <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
            <div className="mb-4">
              <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
              <div className="h-10 w-full bg-gray-300 rounded"></div>
            </div>
            <div className="mb-4">
              <div className="h-4 w-32 bg-gray-200 mb-2 rounded"></div>
              <div className="h-10 w-full bg-gray-300 rounded"></div>
            </div>
            <div className="h-10 w-full bg-gray-400 rounded mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerWallet;
