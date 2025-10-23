import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BuyerWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;
  const userId = localStorage.getItem("userId");

  const fetchWallet = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/${userId}`);
      setWallet(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const createRes = await axios.post(`${API_URL}/api/wallet/ensure/${userId}`);
        setWallet(createRes.data);
      } else console.error("Error fetching wallet:", err);
    }
  };

  const fetchTransactions = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/transactions/${userId}`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const addMoneyDirect = async () => {
    if (!amount) return alert("Enter deposit amount");
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/add-money/${userId}`, { amount: Number(amount) });
      setWallet(res.data.wallet);
      setTransactions([res.data.transaction, ...transactions]);
      setAmount("");
      toast.success("Wallet credited");
    } catch (err) {
      console.error("Error adding money:", err);
      toast.error("Failed to add money");
    } finally {
      setIsLoading(false);
    }
  };

  const addMoneyViaRazorpay = async () => {
    if (!amount) return alert("Enter deposit amount");
    
    if (!RAZORPAY_KEY) {
      toast.warning("Razorpay key not configured. Using test mode...");
      setTimeout(async () => {
        await fetchWallet();
        await fetchTransactions();
        toast.success("Test payment completed!");
      }, 1000);
      return;
    }
    
    const ok = await loadRazorpayScript();
    if (!ok) return toast.error("Failed to load payment SDK");
    try {
      const init = await axios.post(`${API_URL}/api/wallet/add-money-initiate/${userId}`, { amount: Number(amount) });
      const { id: orderId, amount: razorpayAmount, currency } = init.data;
      
      const options = {
        key: RAZORPAY_KEY,
        amount: razorpayAmount,
        currency: currency || "INR",
        name: "Artsays Wallet",
        description: "Add Money to Wallet",
        order_id: orderId,
        handler: async function (response) {
          toast.success("Payment successful! Updating wallet...");
          setTimeout(async () => {
            await fetchWallet();
            await fetchTransactions();
          }, 2000);
        },
        prefill: {
          name: "Artsays User",
          email: "user@artsays.com"
        },
        theme: { color: "#121212" },
        modal: {
          ondismiss: function() {
            toast.info("Payment cancelled");
          }
        }
      };
      
      const rz = new window.Razorpay(options);
      rz.on('payment.failed', function (response) {
        toast.error("Payment failed: " + response.error.description);
      });
      rz.open();
    } catch (err) {
      console.error("Error initiating payment:", err);
      toast.error("Failed to start payment: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchWallet();
    fetchTransactions();
  }, [userId]);

  if (!wallet) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="block-header mb-4">
        <h2>My Wallet</h2>
      </div>

      {/* Balance Cards */}
      <div className="row clearfix row-deck mb-4">
        <div className="col-lg-4 col-md-6 col-sm-6">
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

        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card top_widget secondary-bg">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-shopping-basket"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Art Coins</div>
                <h4 className="number mb-0">{wallet.artCoins}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card top_widget bg-dark">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-history"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Total Transactions</div>
                <h4 className="number mb-0">{transactions.length}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Money Section */}
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
            <div className="header">
              <h2>Wallet Benefits</h2>
            </div>
            <div className="body">
              <ul className="list-unstyled">
                <li><i className="fa fa-check text-success"></i> Instant payments for purchases</li>
                <li><i className="fa fa-check text-success"></i> Secure bidding with wallet balance</li>
                <li><i className="fa fa-check text-success"></i> Earn Art Coins with every transaction</li>
                <li><i className="fa fa-check text-success"></i> Automatic refunds for failed bids</li>
                <li><i className="fa fa-check text-success"></i> No transaction fees</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="row clearfix">
        <div className="col-sm-12">
          <div className="card">
            <div className="header">
              <h2>Recent Transactions</h2>
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
                  {transactions.slice(0, 10).map((txn, idx) => (
                    <tr key={txn._id}>
                      <td>{idx + 1}</td>
                      <td>
                        <span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>
                          {txn.type}
                        </span>
                      </td>
                      <td>₹{txn.amount}</td>
                      <td>{txn.purpose}</td>
                      <td>
                        <span className={`badge ${
                          txn.status === 'success' ? 'badge-success' : 
                          txn.status === 'pending' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td>{new Date(txn.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">No transactions yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerWallet;
