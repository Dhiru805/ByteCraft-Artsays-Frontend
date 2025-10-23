// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const WalletDashboard = () => {
//   const [wallet, setWallet] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [amount, setAmount] = useState("");
//   const [withdrawAmount, setWithdrawAmount] = useState("");

//   const API_URL = process.env.REACT_APP_API_URL;
//   const userId = localStorage.getItem("userId");

//   const fetchWallet = async () => {
//     if (!userId) return;
//     try {
//       let res = await axios.get(`${API_URL}/api/wallet/${userId}`);
//       setWallet(res.data);
//     } catch (err) {
//       if (err.response && err.response.status === 404) {
//         const createRes = await axios.post(`${API_URL}/api/wallet/create/${userId}`);
//         setWallet(createRes.data);
//       } else {
//         console.error("Error fetching wallet:", err);
//       }
//     }
//   };

//   const fetchTransactions = async () => {
//     if (!userId) return;
//     try {
//       const res = await axios.get(`${API_URL}/api/wallet/transactions/${userId}`);
//       setTransactions(res.data);
//     } catch (err) {
//       console.error("Error fetching transactions:", err);
//     }
//   };

//   const addMoney = async () => {
//     if (!amount) return alert("Enter amount");
//     try {
//       const res = await axios.post(`${API_URL}/api/wallet/add-money/${userId}`, { amount: Number(amount) });
//       setWallet(res.data.wallet);
//       setTransactions([res.data.transaction, ...transactions]);
//       setAmount("");
//     } catch (err) {
//       console.error("Error adding money:", err);
//       alert("Failed to add money.");
//     }
//   };

//   const requestWithdrawal = async () => {
//     if (!withdrawAmount) return alert("Enter withdrawal amount");
//     try {
//       const res = await axios.post(`${API_URL}/api/wallet/withdraw/${userId}`, { amount: Number(withdrawAmount) });
//       setWallet(res.data.wallet);
//       setTransactions([res.data.transaction, ...transactions]);
//       setWithdrawAmount("");
//     } catch (err) {
//       console.error("Error requesting withdrawal:", err);
//       alert("Failed to request withdrawal.");
//     }
//   };

//   useEffect(() => {
//     if (!userId) return;
//     fetchWallet();
//     fetchTransactions();
//   }, [userId]);

//   if (!wallet) return <div>Loading...</div>;

//   return (
//     <div className="container-fluid">
//       {/* Header */}
//       <div className="block-header mb-4">
//         <h2>Wallet Dashboard</h2>
//       </div>

//       {/* Summary Cards */}
//       <div className="row clearfix row-deck mb-4">
//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget primary-bg">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-rupee"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Balance</div>
//                 <h4 className="number mb-0">₹{wallet.balance}</h4>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget secondary-bg">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-shopping-basket"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Art Coins</div>
//                 <h4 className="number mb-0">{wallet.artCoins}</h4>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget bg-dark">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-hourglass-half"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Pending Withdrawal</div>
//                 <h4 className="number mb-0">₹{wallet.pendingWithdrawal}</h4>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Add Money Card */}
//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget secondary-bg">
//             <div className="body">
//               {/* <div className="icon bg-light" style={{ fontSize: "18px" }}><i className="fa fa-plus"></i></div> */}
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Deposit</div>
//                 <input
//                   type="number"
//                   placeholder="Amount"
//                   value={amount}
//                   onChange={e => setAmount(e.target.value)}
//                   className="form-control mb-2"
//                   style={{ fontSize: "14px" }}
//                 />
//                 <button className="btn btn-light btn-sm" onClick={addMoney}>Add</button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Withdraw Card */}
//         <div className="col-lg-3 col-md-6 col-sm-6 mt-3">
//           <div className="card top_widget bg-dark">
//             <div className="body">
//               {/* <div className="icon bg-light" style={{ fontSize: "10px" }}><i className="fa fa-arrow-down"></i></div> */}
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Withdraw</div>
//                 <input
//                   type="number"
//                   placeholder="Amount"
//                   value={withdrawAmount}
//                   onChange={e => setWithdrawAmount(e.target.value)}
//                   className="form-control mb-2"
//                   style={{ fontSize: "14px" }}
//                 />
//                 <button className="btn btn-light btn-sm" onClick={requestWithdrawal}>Request</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Transactions Table */}
//       <div className="row clearfix">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header">
//               <h2>Transactions</h2>
//             </div>
//             <div className="body table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Type</th>
//                     <th>Amount</th>
//                     <th>Purpose</th>
//                     <th>Art Coins Earned</th>
//                     <th>Status</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transactions.map((txn, index) => (
//                     <tr key={txn._id}>
//                       <td>{index + 1}</td>
//                       <td>{txn.type}</td>
//                       <td>₹{txn.amount}</td>
//                       <td>{txn.purpose}</td>
//                       <td>{txn.artCoinsEarned}</td>
//                       <td>{txn.status}</td>
//                       <td>{new Date(txn.createdAt).toLocaleString()}</td>
//                     </tr>
//                   ))}
//                   {transactions.length === 0 && (
//                     <tr>
//                       <td colSpan="7" className="text-center">No transactions yet</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WalletDashboard;














// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const WalletDashboard = () => {
//   const [wallet, setWallet] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [amount, setAmount] = useState("");
//   const [withdrawAmount, setWithdrawAmount] = useState("");

//   const API_URL = process.env.REACT_APP_API_URL;
//   const userId = localStorage.getItem("userId");

//   // Fetch wallet
//   const fetchWallet = async () => {
//     if (!userId) return;
//     try {
//       const res = await axios.get(`${API_URL}/api/wallet/${userId}`);
//       setWallet(res.data);
//     } catch (err) {
//       if (err.response && err.response.status === 404) {
//         const createRes = await axios.post(`${API_URL}/api/wallet/create/${userId}`);
//         setWallet(createRes.data);
//       } else console.error("Error fetching wallet:", err);
//     }
//   };

//   // Fetch user transactions
//   const fetchTransactions = async () => {
//     if (!userId) return;
//     try {
//       const res = await axios.get(`${API_URL}/api/wallet/transactions/${userId}`);
//       setTransactions(res.data);
//     } catch (err) {
//       console.error("Error fetching transactions:", err);
//     }
//   };

//   // Add money
//   const addMoney = async () => {
//     if (!amount) return alert("Enter deposit amount");
//     try {
//       const res = await axios.post(`${API_URL}/api/wallet/add-money/${userId}`, { amount: Number(amount) });
//       setWallet(res.data.wallet);
//       setTransactions([res.data.transaction, ...transactions]);
//       setAmount("");
//     } catch (err) {
//       console.error("Error adding money:", err);
//       alert("Failed to add money");
//     }
//   };

//   // Request withdrawal
//   const requestWithdrawal = async () => {
//     if (!withdrawAmount) return alert("Enter withdrawal amount");
//     if (Number(withdrawAmount) > wallet.balance) return alert("Insufficient balance");
//     try {
//       const res = await axios.post(`${API_URL}/api/wallet/withdraw/${userId}`, { amount: Number(withdrawAmount) });
//       setWallet(res.data.wallet);
//       setTransactions([res.data.transaction, ...transactions]);
//       setWithdrawAmount("");
//     } catch (err) {
//       console.error("Error requesting withdrawal:", err);
//       alert("Failed to request withdrawal");
//     }
//   };

//   useEffect(() => {
//     if (!userId) return;
//     fetchWallet();
//     fetchTransactions();
//   }, [userId]);

//   if (!wallet) return <div>Loading...</div>;

//   return (
//     <div className="container-fluid">
//       <div className="block-header mb-4">
//         <h2>Wallet Dashboard</h2>
//       </div>

//       {/* Summary cards */}
//       <div className="row clearfix row-deck mb-4">
//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget primary-bg">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-rupee"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Balance</div>
//                 <h4 className="number mb-0">₹{wallet.balance}</h4>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget secondary-bg">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-shopping-basket"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Art Coins</div>
//                 <h4 className="number mb-0">{wallet.artCoins}</h4>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget bg-dark">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-hourglass-half"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Pending Withdrawal</div>
//                 <h4 className="number mb-0">₹{wallet.pendingWithdrawal}</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Deposit & Withdraw */}
//       <div className="row clearfix row-deck mb-4">
//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget secondary-bg">
//             <div className="body">
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Deposit</div>
//                 <input
//                   type="number"
//                   placeholder="Amount"
//                   value={amount}
//                   onChange={e => setAmount(e.target.value)}
//                   className="form-control mb-2"
//                   style={{ fontSize: "14px" }}
//                 />
//                 <button className="btn btn-light btn-sm" onClick={addMoney}>Add</button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget bg-dark">
//             <div className="body">
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Withdraw</div>
//                 <input
//                   type="number"
//                   placeholder="Amount"
//                   value={withdrawAmount}
//                   onChange={e => setWithdrawAmount(e.target.value)}
//                   className="form-control mb-2"
//                   style={{ fontSize: "14px" }}
//                 />
//                 <button className="btn btn-light btn-sm" onClick={requestWithdrawal}>Request</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Transactions Table */}
//       <div className="row clearfix">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header">
//               <h2>Transactions</h2>
//             </div>
//             <div className="body table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Type</th>
//                     <th>Amount</th>
//                     <th>Purpose</th>
//                     <th>Art Coins Earned</th>
//                     <th>Status</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transactions.length ? transactions.map((txn, idx) => (
//                     <tr key={txn._id}>
//                       <td>{idx + 1}</td>
//                       <td>{txn.type}</td>
//                       <td>₹{txn.amount}</td>
//                       <td>{txn.purpose}</td>
//                       <td>{txn.artCoinsEarned}</td>
//                       <td>{txn.status}</td>
//                       <td>{new Date(txn.createdAt).toLocaleString()}</td>
//                     </tr>
//                   )) : (
//                     <tr>
//                       <td colSpan="7" className="text-center">No transactions yet</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WalletDashboard;













import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const WalletDashboard = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [txnTypeFilter, setTxnTypeFilter] = useState("");
  const [txnStatusFilter, setTxnStatusFilter] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
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
      const params = {};
      if (txnTypeFilter) params.type = txnTypeFilter;
      if (txnStatusFilter) params.status = txnStatusFilter;
      const res = await axios.get(`${API_URL}/api/wallet/transactions/${userId}`, { params });
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
        theme: { 
          color: "#121212" 
        },
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

  const requestWithdrawal = async () => {
    if (!withdrawAmount) return alert("Enter amount to withdraw");
    if (Number(withdrawAmount) > wallet.balance) return alert("Insufficient balance");
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/withdraw/${userId}`, { amount: Number(withdrawAmount) });
      setWallet(res.data.wallet);
      setTransactions([res.data.transaction, ...transactions]);
      setWithdrawAmount("");
      toast.success("Withdrawal requested");
      await fetchWithdrawals();
    } catch (err) {
      console.error("Error requesting withdrawal:", err);
      toast.error("Failed to request withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wallet/withdrawals`);
      setWithdrawals(res.data || []);
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    }
  };

  const approveWithdrawal = async (id) => {
    try {
      await axios.post(`${API_URL}/api/wallet/withdrawals/${id}/approve`, {});
      toast.success("Withdrawal approved");
      await fetchWithdrawals();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve");
    }
  };

  const declineWithdrawal = async (id) => {
    try {
      await axios.post(`${API_URL}/api/wallet/withdrawals/${id}/decline`, {});
      toast.info("Withdrawal declined");
      await fetchWithdrawals();
      await fetchWallet();
      await fetchTransactions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to decline");
    }
  };

  const markWithdrawalPaid = async (id) => {
    try {
      await axios.post(`${API_URL}/api/wallet/withdrawals/${id}/mark-paid`, {});
      toast.success("Marked as paid");
      await fetchWithdrawals();
      await fetchWallet();
      await fetchTransactions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark paid");
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchWallet();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchTransactions();
  }, [userId, txnTypeFilter, txnStatusFilter]);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  if (!wallet) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="block-header mb-4">
        <h2>Wallet Dashboard</h2>
      </div>

      <div className="row clearfix row-deck mb-4">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget primary-bg">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-rupee"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Balance</div>
                <h4 className="number mb-0">₹{wallet.balance}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-6">
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

        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget bg-dark">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-hourglass-half"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Pending Withdrawal</div>
                <h4 className="number mb-0">₹{wallet.pendingWithdrawal}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix row-deck mb-4">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget secondary-bg">
            <div className="body">
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Deposit</div>
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="form-control mb-2"
                  style={{ fontSize: "14px" }}
                />
                <div className="d-flex gap-2">
                  <button disabled={isLoading} className="btn btn-light btn-sm me-2" onClick={addMoneyDirect}>Quick Credit</button>
                  <button disabled={isLoading} className="btn btn-light btn-sm" onClick={addMoneyViaRazorpay}>Pay via Razorpay</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget bg-dark">
            <div className="body">
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Withdraw</div>
                <input
                  type="number"
                  placeholder="Amount"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  className="form-control mb-2"
                  style={{ fontSize: "14px" }}
                />
                <button disabled={isLoading} className="btn btn-light btn-sm" onClick={requestWithdrawal}>Request</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-sm-12">
          <div className="card">
            <div className="header d-flex align-items-center justify-content-between">
              <h2>Transactions</h2>
              <div className="d-flex" style={{ gap: 8 }}>
                <select className="form-control" value={txnTypeFilter} onChange={e=>setTxnTypeFilter(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
                <select className="form-control" value={txnStatusFilter} onChange={e=>setTxnStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
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
                    <th>Balance After</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length ? transactions.map((txn, idx) => (
                    <tr key={txn._id}>
                      <td>{idx + 1}</td>
                      <td>{txn.type}</td>
                      <td>₹{txn.amount}</td>
                      <td>{txn.purpose}</td>
                      <td>{txn.status}</td>
                      <td>{txn.balanceAfter ?? '-'}</td>
                      <td>{new Date(txn.createdAt).toLocaleString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="text-center">No transactions yet</td>
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

export default WalletDashboard;
