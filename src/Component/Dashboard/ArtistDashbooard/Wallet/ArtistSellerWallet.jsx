// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ArtistSellerWallet = () => {
//   const [wallet, setWallet] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [amount, setAmount] = useState("");
//   const [withdrawAmount, setWithdrawAmount] = useState("");
//   const [withdrawMethod, setWithdrawMethod] = useState("upi");
//   const [withdrawDestination, setWithdrawDestination] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const totalPages = Math.ceil(transactions.length / pageSize);
//   const displayedTransactions = transactions.slice((page - 1) * pageSize, page * pageSize);

//   const API_URL = process.env.REACT_APP_API_URL;
//   const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;
//   const userId = localStorage.getItem("userId");
//   const userType = localStorage.getItem("userType");

//   const fetchWallet = async () => {
//     if (!userId) return;
//     try {
//       const res = await axios.get(`${API_URL}/api/wallet/${userId}`);
//       setWallet(res.data);
//     } catch (err) {
//       if (err.response && err.response.status === 404) {
//         const createRes = await axios.post(`${API_URL}/api/wallet/ensure/${userId}`);
//         setWallet(createRes.data);
//       } else console.error("Error fetching wallet:", err);
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

//   const loadRazorpayScript = () => new Promise((resolve) => {
//     if (document.getElementById("razorpay-sdk")) return resolve(true);
//     const script = document.createElement("script");
//     script.id = "razorpay-sdk";
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });

//   const addMoneyDirect = async () => {
//     if (!amount) return alert("Enter deposit amount");
//     setIsLoading(true);
//     try {
//       const res = await axios.post(`${API_URL}/api/wallet/add-money/${userId}`, { amount: Number(amount) });
//       setWallet(res.data.wallet);
//       setTransactions([res.data.transaction, ...transactions]);
//       setAmount("");
//       toast.success("Wallet credited");
//     } catch (err) {
//       console.error("Error adding money:", err);
//       toast.error("Failed to add money");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addMoneyViaRazorpay = async () => {
//     if (!amount) return alert("Enter deposit amount");

//     if (!RAZORPAY_KEY) {
//       toast.warning("Razorpay key not configured. Using test mode...");
//       setTimeout(async () => {
//         await fetchWallet();
//         await fetchTransactions();
//         toast.success("Test payment completed!");
//       }, 1000);
//       return;
//     }

//     const ok = await loadRazorpayScript();
//     if (!ok) return toast.error("Failed to load payment SDK");
//     try {
//       const init = await axios.post(`${API_URL}/api/wallet/add-money-initiate/${userId}`, { amount: Number(amount) });
//       const { id: orderId, amount: razorpayAmount, currency } = init.data;

//       const options = {
//         key: RAZORPAY_KEY,
//         amount: razorpayAmount,
//         currency: currency || "INR",
//         name: "Artsays Wallet",
//         description: "Add Money to Wallet",
//         order_id: orderId,
//         handler: async function (response) {
//           toast.success("Payment successful! Updating wallet...");
//           setTimeout(async () => {
//             await fetchWallet();
//             await fetchTransactions();
//           }, 2000);
//         },
//         prefill: {
//           name: "Artsays User",
//           email: "user@artsays.com"
//         },
//         theme: { color: "#121212" },
//         modal: {
//           ondismiss: function () {
//             toast.info("Payment cancelled");
//           }
//         }
//       };

//       const rz = new window.Razorpay(options);
//       rz.on('payment.failed', function (response) {
//         toast.error("Payment failed: " + response.error.description);
//       });
//       rz.open();
//     } catch (err) {
//       console.error("Error initiating payment:", err);
//       toast.error("Failed to start payment: " + (err.response?.data?.error || err.message));
//     }
//   };

//   const requestWithdrawal = async () => {
//     if (!withdrawAmount) return alert("Enter amount to withdraw");
//     if (!withdrawDestination) return alert("Enter withdrawal destination");
//     if (Number(withdrawAmount) > wallet.balance) return alert("Insufficient balance");
//     if (Number(withdrawAmount) < 100) return alert("Minimum withdrawal amount is ₹100");

//     setIsLoading(true);
//     try {
//       const res = await axios.post(`${API_URL}/api/wallet/withdraw/${userId}`, {
//         amount: Number(withdrawAmount),
//         method: withdrawMethod,
//         destination: withdrawDestination
//       });
//       setWallet(res.data.wallet);
//       setTransactions([res.data.transaction, ...transactions]);
//       setWithdrawAmount("");
//       setWithdrawDestination("");
//       toast.success("Withdrawal requested successfully! Admin will process it soon.");
//     } catch (err) {
//       console.error("Error requesting withdrawal:", err);
//       toast.error("Failed to request withdrawal");
//     } finally {
//       setIsLoading(false);
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
//         <h2>My Wallet - {userType}</h2>
//       </div>

//       {/* Balance Cards */}
//       <div className="row clearfix row-deck mb-4">
//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget primary-bg">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-rupee"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Available Balance</div>
//                 <h4 className="number mb-0">₹{wallet.balance}</h4>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget secondary-bg">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-hourglass-half"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Pending Withdrawal</div>
//                 <h4 className="number mb-0">₹{wallet.pendingWithdrawal}</h4>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget bg-dark">
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
//           <div className="card top_widget bg-info">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-chart-line"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Total Earnings</div>
//                 <h4 className="number mb-0">₹{wallet.totalCredited}</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Money & Withdraw */}
//       <div className="row clearfix mb-4">
//         <div className="col-lg-6 col-md-12">
//           <div className="card">
//             <div className="header">
//               <h2>Add Money to Wallet</h2>
//             </div>
//             <div className="body">
//               <div className="form-group">
//                 <label>Amount (₹)</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   placeholder="Enter amount"
//                   value={amount}
//                   onChange={e => setAmount(e.target.value)}
//                   min="1"
//                 />
//               </div>
//               <div className="d-flex gap-2">
//                 <button
//                   disabled={isLoading}
//                   className="btn btn-primary"
//                   onClick={addMoneyDirect}
//                 >
//                   Quick Add
//                 </button>
//                 <button
//                   disabled={isLoading}
//                   className="btn btn-success"
//                   onClick={addMoneyViaRazorpay}
//                 >
//                   Pay via Razorpay
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-6 col-md-12">
//           <div className="card">
//             <div className="header">
//               <h2>Request Withdrawal</h2>
//             </div>
//             <div className="body">
//               <div className="form-group">
//                 <label>Amount (₹)</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   placeholder="Enter amount"
//                   value={withdrawAmount}
//                   onChange={e => setWithdrawAmount(e.target.value)}
//                   min="100"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Withdrawal Method</label>
//                 <select
//                   className="form-control"
//                   value={withdrawMethod}
//                   onChange={e => setWithdrawMethod(e.target.value)}
//                 >
//                   <option value="upi">UPI</option>
//                   <option value="bank">Bank Transfer</option>
//                   <option value="manual">Manual Transfer</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Destination</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder={withdrawMethod === 'upi' ? 'UPI ID' : 'Account Details'}
//                   value={withdrawDestination}
//                   onChange={e => setWithdrawDestination(e.target.value)}
//                 />
//               </div>
//               <button
//                 disabled={isLoading}
//                 className="btn btn-warning btn-block"
//                 onClick={requestWithdrawal}
//               >
//                 Request Withdrawal
//               </button>
//               <small className="text-muted">Minimum withdrawal: ₹100. Admin approval required.</small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Earnings Info */}
//       <div className="row clearfix mb-4">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header">
//               <h2>Earnings Information</h2>
//             </div>
//             <div className="body">
//               <div className="row">
//                 <div className="col-md-4">
//                   <h5>How You Earn</h5>
//                   <ul>
//                     <li>Artwork sales</li>
//                     <li>Commission work</li>
//                     <li>Bidding wins</li>
//                     <li>Referral bonuses</li>
//                   </ul>
//                 </div>
//                 <div className="col-md-4">
//                   <h5>Withdrawal Process</h5>
//                   <ul>
//                     <li>Request withdrawal</li>
//                     <li>Admin verification</li>
//                     <li>Payment processing</li>
//                     <li>Funds transferred</li>
//                   </ul>
//                 </div>
//                 <div className="col-md-4">
//                   <h5>Important Notes</h5>
//                   <ul>
//                     <li>Minimum withdrawal: ₹100</li>
//                     <li>Processing time: 1-3 business days</li>
//                     <li>Admin approval required</li>
//                     <li>Keep withdrawal details updated</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       {/* <div className="row clearfix">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header">
//               <h2>Recent Transactions</h2>
//             </div>
//             <div className="body table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Type</th>
//                     <th>Amount</th>
//                     <th>Purpose</th>
//                     <th>Status</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transactions.map((txn, idx) => (
//                     <tr key={txn._id}>
//                       <td>{idx + 1}</td>
//                       <td>
//                         <span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>
//                           {txn.type}
//                         </span>
//                       </td>
//                       <td>₹{txn.amount}</td>
//                       <td>{txn.purpose}</td>
//                       <td>
//                         <span className={`badge ${
//                           txn.status === 'success' ? 'badge-success' : 
//                           txn.status === 'pending' ? 'badge-warning' : 'badge-danger'
//                         }`}>
//                           {txn.status}
//                         </span>
//                       </td>
//                       <td>{new Date(txn.createdAt).toLocaleString()}</td>
//                     </tr>
//                   ))}
//                   {transactions.length === 0 && (
//                     <tr>
//                       <td colSpan="6" className="text-center">No transactions yet</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div> */}
//       {/* Recent Transactions */}
//       <div className="row clearfix">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header d-flex justify-content-between align-items-center">
//               <h2>Recent Transactions</h2>
//               <div>
//                 Show
//                 <select
//                   className="form-control d-inline-block w-auto ml-2"
//                   value={pageSize}
//                   onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
//                 >
//                   {[5, 10, 15, 20, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
//                 </select>
//                 entries
//               </div>
//             </div>
//             <div className="body table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Type</th>
//                     <th>Amount</th>
//                     <th>Purpose</th>
//                     <th>Status</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {displayedTransactions.map((txn, idx) => (
//                     <tr key={txn._id}>
//                       <td>{(page - 1) * pageSize + idx + 1}</td>
//                       <td>
//                         <span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>
//                           {txn.type}
//                         </span>
//                       </td>
//                       <td>₹{txn.amount}</td>
//                       <td>{txn.purpose}</td>
//                       <td>
//                         <span className={`badge ${txn.status === 'success' ? 'badge-success' :
//                           txn.status === 'pending' ? 'badge-warning' : 'badge-danger'
//                           }`}>
//                           {txn.status}
//                         </span>
//                       </td>
//                       <td>{new Date(txn.createdAt).toLocaleString()}</td>
//                     </tr>
//                   ))}
//                   {displayedTransactions.length === 0 && (
//                     <tr>
//                       <td colSpan="6" className="text-center">No transactions yet</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination Controls */}
//             <div className="d-flex justify-content-center align-items-center mt-3 px-3 py-3">
//               <ul className="pagination mb-0">
//                 <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//                   <button className="page-link" onClick={() => setPage(prev => Math.max(prev - 1, 1))}>&laquo;</button>
//                 </li>
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
//                     <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
//                   </li>
//                 ))}
//                 <li className={`page-item ${page === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
//                   <button className="page-link" onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}>&raquo;</button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default ArtistSellerWallet;






import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ArtistSellerWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("upi");
  const [withdrawDestination, setWithdrawDestination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(transactions.length / pageSize);
  const displayedTransactions = transactions.slice((page - 1) * pageSize, page * pageSize);

  const API_URL = process.env.REACT_APP_API_URL;
  const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

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

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
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
        prefill: { name: "Artsays User", email: "user@artsays.com" },
        theme: { color: "#121212" },
        modal: { ondismiss: function () { toast.info("Payment cancelled"); } }
      };

      const rz = new window.Razorpay(options);
      rz.on("payment.failed", function (response) {
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

    if (withdrawMethod === "upi" && !withdrawDestination.upi) return alert("Enter UPI ID");
    if (withdrawMethod === "bank") {
      const { name, accountNumber, ifsc, bankName, purpose } = withdrawDestination;
      if (!name || !accountNumber || !ifsc || !bankName || !purpose) return alert("Fill all bank transfer details");
    }

    if (Number(withdrawAmount) > wallet.balance) return alert("Insufficient balance");
    if (Number(withdrawAmount) < 100) return alert("Minimum withdrawal amount is ₹100");

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/withdraw/${userId}`, {
        amount: Number(withdrawAmount),
        method: withdrawMethod,
        destination: withdrawMethod === "upi" ? withdrawDestination.upi : withdrawDestination
      });
      setWallet(res.data.wallet);
      setTransactions([res.data.transaction, ...transactions]);
      setWithdrawAmount("");
      setWithdrawDestination({});
      toast.success("Withdrawal requested successfully! Admin will process it soon.");
    } catch (err) {
      console.error("Error requesting withdrawal:", err);
      toast.error("Failed to request withdrawal");
    } finally {
      setIsLoading(false);
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
        <h2>My Wallet - {userType}</h2>
      </div>

      {/* Balance Cards */}
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

      {/* Add Money & Withdraw */}
      <div className="row clearfix mb-4">
        {/* Add Money Card */}
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

        {/* Withdraw Card */}
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

              {/* Conditional Fields */}
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
                      onChange={e => setWithdrawDestination({ ...withdrawDestination, ifsc: e.target.value })}
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

      {/* Earnings Info */}
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
                  <h5>Withdrawal Process</h5>
                  <ul>
                    <li>Request withdrawal</li>
                    <li>Admin verification</li>
                    <li>Payment processing</li>
                    <li>Funds transferred</li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h5>Important Notes</h5>
                  <ul>
                    <li>Minimum withdrawal: ₹100</li>
                    <li>Processing time: 1-3 business days</li>
                    <li>Admin approval required</li>
                    <li>Keep withdrawal details updated</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="row clearfix">
        <div className="col-sm-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <h2>Recent Transactions</h2>
              <div>
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

            {/* Pagination */}
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
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}>&raquo;</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ArtistSellerWallet;

