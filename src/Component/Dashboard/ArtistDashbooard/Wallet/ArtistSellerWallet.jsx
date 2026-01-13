import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../../../Constants/index";

export function ArtistSellerWallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [limits, setLimits] = useState(null);
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("upi");
  const [withdrawDestination, setWithdrawDestination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [referralData, setReferralData] = useState(null);
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [isApplyingReferral, setIsApplyingReferral] = useState(false);
    const [referralSettings, setReferralSettings] = useState(null);
    const [coinSetting, setCoinSetting] = useState({ coinValue: 0.10, currency: "INR", transactionReward: 10 });

    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    const fetchWallet = useCallback(async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${API_URL}/api/wallet/${userId}`);
        setWallet(res.data);
      } catch (err) {
        toast.error("Failed to fetch wallet details");
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
        toast.error("Failed to fetch withdrawals");
      }
    }, [userId]);

    const fetchLimits = useCallback(async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${API_URL}/api/wallet/limits/${userId}`);
        setLimits(res.data);
      } catch (err) {
        console.error("Error fetching limits:", err);
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

    const fetchCoinSetting = useCallback(async () => {
      try {
        const res = await axios.get(`${API_URL}/api/coin-settings`);
        if (res.data) setCoinSetting(res.data);
      } catch (err) {
        console.error("Error fetching coin settings:", err);
      }
    }, []);

  const addMoneyDirect = async () => {
    if (!amount || amount <= 0) return toast.error("Please enter a valid amount");
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/wallet/add-money/${userId}`, { amount: Number(amount) });
      toast.success("Money Added Successfully!");
      setAmount("");
      fetchWallet();
      fetchTransactions();
    } catch (err) {
      toast.error("Failed to add money");
    } finally {
      setIsLoading(false);
    }
  };

  const addMoneyViaRazorpay = async () => {
    if (!amount || amount <= 0) return toast.error("Please enter a valid amount");
    setIsLoading(true);
    try {
      const orderRes = await axios.post(`${API_URL}/api/wallet/add-money-initiate/${userId}`, {
        amount: Number(amount)
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency || "INR",
        name: "Artsays Wallet",
        description: "Add money to wallet",
        order_id: orderRes.data.id,
        handler: async function (response) {
          toast.success("Payment successful! Updating wallet...");
          setTimeout(() => {
            fetchWallet();
            fetchTransactions();
          }, 2000);
        },
        prefill: {
          name: localStorage.getItem("firstName") + " " + localStorage.getItem("lastName") || "",
          email: localStorage.getItem("email") || ""
        },
        theme: { color: "#4B2E05" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Failed to initiate payment");
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
      fetchLimits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReceipt = async (transactionId) => {
    try {
      const response = await axios.get(`${API_URL}/api/wallet/transaction/receipt/${transactionId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error("Failed to download receipt");
    }
  };

  const exportTransactions = async (format) => {
    try {
      const response = await axios.get(`${API_URL}/api/wallet/transactions/export/${userId}?format=${format}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-${userId}.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error("Failed to export transactions");
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
      fetchLimits();
      fetchReferralData();
      fetchReferralSettings();
      fetchCoinSetting();
    }, [userId, fetchWallet, fetchTransactions, fetchWithdrawals, fetchLimits, fetchReferralData, fetchReferralSettings, fetchCoinSetting]);

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
                  <small>Worth {coinSetting.currency} {(wallet.artCoins * coinSetting.coinValue).toFixed(2)}</small>
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

      {limits && (
        <div className="row clearfix mb-4">
          <div className="col-12">
            <div className="card">
              <div className="header"><h2>Withdrawal Limits</h2></div>
              <div className="body">
                <div className="row">
                  <div className="col-md-6">
                      <div className="progress-container">
                        <label>Daily Limit</label>
                        <div className="progress" style={{ height: "20px" }}>
                          <div
                            className="progress-bar bg-primary"
                            style={{ width: `${(limits.dailyUsed / limits.dailyLimit) * 100}%` }}
                          >
                            ₹{limits.dailyUsed} / ₹{limits.dailyLimit}
                          </div>
                        </div>
                        <small className="text-muted">Remaining: ₹{limits.dailyRemaining}</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="progress-container">
                        <label>Monthly Limit</label>
                        <div className="progress" style={{ height: "20px" }}>
                          <div
                            className="progress-bar bg-success"
                            style={{ width: `${(limits.monthlyUsed / limits.monthlyLimit) * 100}%` }}
                          >
                            ₹{limits.monthlyUsed} / ₹{limits.monthlyLimit}
                          </div>
                        </div>
                        <small className="text-muted">Remaining: ₹{limits.monthlyRemaining}</small>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  Quick Add
                </button>
                <button
                  disabled={isLoading}
                  className="btn btn-success"
                  onClick={addMoneyViaRazorpay}
                >
                  Pay via Razorpay
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
                </>
              )}

              <button
                className="btn btn-primary btn-block mt-3"
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
                            <h3>
                              {referralSettings 
                                ? `₹${referralSettings.referrerCash} + ${referralSettings.referrerCoins} Coins` 
                                : "₹50 + 100 Coins"}
                            </h3>
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
                        <li>
                          You earn {referralSettings ? `₹${referralSettings.referrerCash} cash + ${referralSettings.referrerCoins} Art Coins` : "₹50 cash + 100 Art Coins"} per successful referral
                        </li>
                        <li>
                          Your friend gets {referralSettings ? `${referralSettings.referredCoins} Art Coins ${referralSettings.referredCash > 0 ? `+ ₹${referralSettings.referredCash} cash` : ''}` : "50 Art Coins"} as a welcome bonus
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}

        <div className="row clearfix mb-4">
          <div className="col-sm-12">
            <div className="card">
              <div className="header">
                <h2>Earnings Information</h2>
              </div>
            <div className="body">
              <div className="row">
                <div className="col-md-4">
                  <h5>How You Earn</h5>
                  <ul>
                    <li>Artwork sales</li>
                    <li>Commission work</li>
                    <li>Bidding wins</li>
                    <li>Referral bonuses</li>
                  </ul>
                </div>
                  <div className="col-md-4">
                    <h5>Art Coins Benefits</h5>
                    <ul>
                      <li>Earn {coinSetting.transactionReward || 10} coins per transaction</li>
                      <li>1 coin = {coinSetting.currency} {coinSetting.coinValue.toFixed(2)} discount</li>
                      <li>Max 20% discount per order</li>
                      <li>Use during checkout</li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light border rounded">
                      <h6><i className="fa fa-gift mr-2"></i>Benefit Preview</h6>
                      <hr />
                        <div className="d-flex justify-content-between mb-1 small">
                          <span>Transaction Reward:</span>
                          <strong className="text-primary">{coinSetting.transactionReward || 10} Coins</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1 small">
                          <span>Referral Reward:</span>
                          <strong className="text-primary">{referralSettings?.[`${userType.toLowerCase()}ReferrerCoinsReward`] || 0} Coins</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1 small">
                          <span>Signup Bonus:</span>
                          <strong className="text-primary">{coinSetting[`${userType.toLowerCase()}SignupBonus`] || 0} Coins</strong>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  <div>
                    <button className="btn btn-sm btn-outline-primary mr-2" onClick={() => exportTransactions('csv')}>
                      <i className="fa fa-download"></i> Export CSV
                    </button>
                    Show
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
                        <th>Receipt</th>
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
                          <td>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => downloadReceipt(txn._id)}
                            >
                              <i className="fa fa-download"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center">No transactions yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="header d-flex justify-content-between align-items-center">
                    <div>Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, transactions.length)} of {transactions.length} entries</div>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                      </li>
                    </ul>
                  </div>
                )}
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
                      <th>Destination</th>
                      <th>Status</th>
                      <th>Requested At</th>
                      <th>Processed At</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w, idx) => (
                      <tr key={w._id}>
                        <td>{idx + 1}</td>
                        <td>₹{w.amount}</td>
                        <td className="text-uppercase">{w.method}</td>
                        <td>
                          {w.method === 'upi' ? w.destination.upi :
                            `${w.destination.name} - ${w.destination.accountNumber}`}
                        </td>
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

export default ArtistSellerWallet;

 function WalletSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      
      {/* Heading */}
      <div className="h-8 w-48 bg-gray-300 rounded mb-6"></div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((_, idx) => (
          <div key={idx} className="bg-gray-200 rounded-xl p-5 shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-5 w-20 bg-gray-400 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Money & Withdraw */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Add Money */}
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>

          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>

          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
            <div className="h-10 w-40 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Withdraw */}
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>

          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>

          <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>

          {/* Extra dynamic fields skeleton */}
          <div className="space-y-3">
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>

          <div className="h-10 bg-gray-300 rounded mt-4"></div>
        </div>
      </div>

      {/* Earnings Information */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <div className="h-6 w-44 bg-gray-300 rounded mb-4"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx}>
              <div className="h-5 w-32 bg-gray-300 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gray-300 rounded"></div>
                <div className="h-3 w-32 bg-gray-300 rounded"></div>
                <div className="h-3 w-24 bg-gray-300 rounded"></div>
                <div className="h-3 w-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white p-5 rounded-xl shadow">
        
        {/* Table Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-40 bg-gray-300 rounded"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-10 bg-gray-300 rounded"></div>
            <div className="h-10 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-12 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <th key={i} className="p-3">
                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <tr key={idx} className="border-t">
                  {[1, 2, 3, 4, 5, 6].map((cell, i2) => (
                    <td key={i2} className="p-3">
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4 gap-2">
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
        </div>
      </div>

    </div>
  );
}
