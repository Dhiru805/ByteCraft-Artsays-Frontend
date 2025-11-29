// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const AdminWalletManagement = () => {
//   const [wallets, setWallets] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [adjustAmount, setAdjustAmount] = useState("");
//   const [adjustType, setAdjustType] = useState("credit");
//   const [adjustReason, setAdjustReason] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [filterStatus, setFilterStatus] = useState("");
//   const [filterUser, setFilterUser] = useState("");
//   const [filterType, setFilterType] = useState("");

//   const API_URL = process.env.REACT_APP_API_URL;

//   const fetchWallets = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/wallet/admin/all-wallets`);
//       setWallets(res.data || []);
//     } catch (err) {
//       console.error("Error fetching wallets:", err);
//     }
//   };

//   const fetchTransactions = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/wallet/admin/all-transactions`);
//       setTransactions(res.data || []);
//     } catch (err) {
//       console.error("Error fetching transactions:", err);
//     }
//   };

//   // const fetchWithdrawals = async () => {
//   //   try {
//   //     const res = await axios.get(`${API_URL}/api/wallet/withdrawals`);
//   //     setWithdrawals(res.data || []);
//   //   } catch (err) {
//   //     console.error("Error fetching withdrawals:", err);
//   //   }
//   // };

//   const fetchWithdrawals = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/wallet/withdrawals`);
//       console.log("Withdrawals response:", res.data);
//       setWithdrawals(res.data || []);
//     } catch (err) {
//       console.error("Error fetching withdrawals:", err);
//     }
//   };



//   const handleAdjustBalance = async () => {
//     if (!selectedUser || !adjustAmount) return alert("Select user and enter amount");

//     setIsLoading(true);
//     try {
//       await axios.post(`${API_URL}/api/wallet/admin/adjust/${selectedUser}`, {
//         amount: Number(adjustAmount),
//         type: adjustType,
//         reason: adjustReason || "Admin Adjustment"
//       });

//       toast.success("Balance adjusted successfully");
//       await fetchWallets();
//       await fetchTransactions();
//       setAdjustAmount("");
//       setAdjustReason("");
//     } catch (err) {
//       console.error("Error adjusting balance:", err);
//       toast.error("Failed to adjust balance");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const approveWithdrawal = async (id) => {
//     try {
//       await axios.post(`${API_URL}/api/wallet/withdrawals/${id}/approve`, {});
//       toast.success("Withdrawal approved");
//       await fetchWithdrawals();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to approve");
//     }
//   };

//   const declineWithdrawal = async (id) => {
//     try {
//       await axios.post(`${API_URL}/api/wallet/withdrawals/${id}/decline`, {});
//       toast.info("Withdrawal declined");
//       await fetchWithdrawals();
//       await fetchWallets();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to decline");
//     }
//   };

//   const markWithdrawalPaid = async (id) => {
//     try {
//       await axios.post(`${API_URL}/api/wallet/withdrawals/${id}/mark-paid`, {});
//       toast.success("Marked as paid");
//       await fetchWithdrawals();
//       await fetchWallets();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to mark paid");
//     }
//   };

//   useEffect(() => {
//     fetchWallets();
//     fetchTransactions();
//     fetchWithdrawals();
//   }, []);

//   return (
//     <div className="container-fluid">
//       <div className="block-header mb-4">
//         <h2>Wallet Management Dashboard</h2>
//       </div>

//       {/* Summary Cards */}
//       <div className="row clearfix row-deck mb-4">
//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget primary-bg">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-users"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Total Wallets</div>
//                 <h4 className="number mb-0">{wallets.length}</h4>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget secondary-bg">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-rupee"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Total Balance</div>
//                 <h4 className="number mb-0">₹{wallets.reduce((sum, w) => sum + w.balance, 0)}</h4>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget bg-dark">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-hourglass-half"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Pending Withdrawals</div>
//                 <h4 className="number mb-0">{withdrawals.filter(w => w.status === 'pending').length}</h4>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget bg-info">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-exchange"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Total Transactions</div>
//                 <h4 className="number mb-0">{transactions.length}</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Manual Balance Adjustment */}
//       <div className="row clearfix mb-4">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header">
//               <h2>Manual Balance Adjustment</h2>
//             </div>
//             <div className="body">
//               <div className="row">
//                 <div className="col-md-3">
//                   <div className="form-group">
//                     <label>Select User</label>
//                     <select
//                       className="form-control"
//                       value={selectedUser || ""}
//                       onChange={e => setSelectedUser(e.target.value)}
//                     >
//                       <option value="">Select User</option>
//                       {wallets.map(wallet => (
//                         <option key={wallet._id} value={wallet.userId}>
//                           User {wallet.userId} (₹{wallet.balance})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="form-group">
//                     <label>Type</label>
//                     <select
//                       className="form-control"
//                       value={adjustType}
//                       onChange={e => setAdjustType(e.target.value)}
//                     >
//                       <option value="credit">Credit</option>
//                       <option value="debit">Debit</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="form-group">
//                     <label>Amount (₹)</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       placeholder="Amount"
//                       value={adjustAmount}
//                       onChange={e => setAdjustAmount(e.target.value)}
//                       min="1"
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-3">
//                   <div className="form-group">
//                     <label>Reason</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Reason for adjustment"
//                       value={adjustReason}
//                       onChange={e => setAdjustReason(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="form-group">
//                     <label>&nbsp;</label>
//                     <button
//                       className="btn btn-warning btn-block"
//                       onClick={handleAdjustBalance}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? 'Processing...' : 'Adjust'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* All Wallets */}
//       <div className="row clearfix mb-4">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header">
//               <h2>All User Wallets</h2>
//             </div>
//             <div className="body table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>User ID</th>
//                     <th>Balance</th>
//                     <th>Art Coins</th>
//                     <th>Pending Withdrawal</th>
//                     <th>Total Credited</th>
//                     <th>Total Debited</th>
//                     <th>Last Activity</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {wallets.map((wallet, i) => (
//                     <tr key={wallet._id}>
//                       <td>{i + 1}</td>
//                       <td>{wallet.userId}</td>
//                       <td>₹{wallet.balance}</td>
//                       <td>{wallet.artCoins}</td>
//                       <td>₹{wallet.pendingWithdrawal}</td>
//                       <td>₹{wallet.totalCredited}</td>
//                       <td>₹{wallet.totalDebited}</td>
//                       <td>{wallet.lastActivityAt ? new Date(wallet.lastActivityAt).toLocaleString() : 'Never'}</td>
//                     </tr>
//                   ))}
//                   {wallets.length === 0 && (
//                     <tr>
//                       <td colSpan="8" className="text-center">No wallets found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* Recent Transactions */}
//       <div className="row clearfix">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header d-flex justify-content-between align-items-center">
//               <h2>Recent Transactions</h2>

//               {/* Filters */}
//               <div className="d-flex gap-2">
//                 {/* User filter dropdown */}
//                 <select
//                   className="form-control"
//                   value={filterUser}
//                   onChange={e => setFilterUser(e.target.value)}
//                 >
//                   <option value="">All Users</option>
//                   {wallets.map(wallet => (
//                     <option key={wallet._id} value={wallet.userId}>
//                       User {wallet.userId}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Type filter dropdown */}
//                 <select
//                   className="form-control"
//                   value={filterType}
//                   onChange={e => setFilterType(e.target.value)}
//                 >
//                   <option value="">All Types</option>
//                   <option value="credit">Credit</option>
//                   <option value="debit">Debit</option>
//                 </select>

//                 {/* Status filter dropdown */}
//                 <select
//                   className="form-control"
//                   value={filterStatus}
//                   onChange={e => setFilterStatus(e.target.value)}
//                 >
//                   <option value="">All Status</option>
//                   <option value="success">Success</option>
//                   <option value="pending">Pending</option>
//                   <option value="failed">Failed</option>
//                 </select>
//               </div>
//             </div>

//             <div className="body table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>User ID</th>
//                     <th>Type</th>
//                     <th>Amount</th>
//                     <th>Purpose</th>
//                     <th>Source</th>
//                     <th>Status</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transactions
//                     .filter(txn =>
//                       (filterUser === "" || txn.userId === filterUser) &&
//                       (filterType === "" || txn.type === filterType) &&
//                       (filterStatus === "" || txn.status === filterStatus)
//                     )
//                     .map((txn, idx) => (
//                       <tr key={txn._id}>
//                         <td>{idx + 1}</td>
//                         <td>{txn.userId}</td>
//                         <td>
//                           <span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>
//                             {txn.type}
//                           </span>
//                         </td>
//                         <td>₹{txn.amount}</td>
//                         <td>{txn.purpose}</td>
//                         <td>{txn.source}</td>
//                         <td>
//                           <span className={`badge ${txn.status === 'success' ? 'badge-success' :
//                             txn.status === 'pending' ? 'badge-warning' : 'badge-danger'
//                             }`}>
//                             {txn.status}
//                           </span>
//                         </td>
//                         <td>{new Date(txn.createdAt).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   {transactions.filter(txn =>
//                     (filterUser === "" || txn.userId === filterUser) &&
//                     (filterType === "" || txn.type === filterType) &&
//                     (filterStatus === "" || txn.status === filterStatus)
//                   ).length === 0 && (
//                       <tr>
//                         <td colSpan="8" className="text-center">No transactions found</td>
//                       </tr>
//                     )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default AdminWalletManagement;













// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const AdminWalletManagement = () => {
//   const [wallets, setWallets] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [adjustAmount, setAdjustAmount] = useState("");
//   const [adjustType, setAdjustType] = useState("credit");
//   const [adjustReason, setAdjustReason] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const [filterStatus, setFilterStatus] = useState("");
//   const [filterUser, setFilterUser] = useState("");
//   const [filterType, setFilterType] = useState("");

//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const API_URL = process.env.REACT_APP_API_URL;

//   const fetchWallets = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/wallet/admin/all-wallets`);
//       setWallets(res.data || []);
//     } catch (err) {
//       console.error("Error fetching wallets:", err);
//     }
//   };

//   const fetchTransactions = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/wallet/admin/all-transactions`);
//       setTransactions(res.data || []);
//     } catch (err) {
//       console.error("Error fetching transactions:", err);
//     }
//   };

//   const fetchWithdrawals = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/wallet/withdrawals`);
//       setWithdrawals(res.data || []);
//     } catch (err) {
//       console.error("Error fetching withdrawals:", err);
//     }
//   };

//   const handleAdjustBalance = async () => {
//     if (!selectedUser || !adjustAmount) return alert("Select user and enter amount");

//     setIsLoading(true);
//     try {
//       await axios.post(`${API_URL}/api/wallet/admin/adjust/${selectedUser}`, {
//         amount: Number(adjustAmount),
//         type: adjustType,
//         reason: adjustReason || "Admin Adjustment"
//       });

//       toast.success("Balance adjusted successfully");
//       await fetchWallets();
//       await fetchTransactions();
//       setAdjustAmount("");
//       setAdjustReason("");
//     } catch (err) {
//       console.error("Error adjusting balance:", err);
//       toast.error("Failed to adjust balance");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const approveWithdrawal = async (id) => {
//     try {
//       await axios.post(`${API_URL}/api/wallet/withdrawals/${id}/approve`, {});
//       toast.success("Withdrawal approved");
//       await fetchWithdrawals();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to approve");
//     }
//   };

//   const declineWithdrawal = async (id) => {
//     try {
//       await axios.post(`${API_URL}/api/wallet/withdrawals/${id}/decline`, {});
//       toast.info("Withdrawal declined");
//       await fetchWithdrawals();
//       await fetchWallets();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to decline");
//     }
//   };

//   const markWithdrawalPaid = async (id) => {
//     try {
//       await axios.post(`${API_URL}/api/wallet/withdrawals/${id}/mark-paid`, {});
//       toast.success("Marked as paid");
//       await fetchWithdrawals();
//       await fetchWallets();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to mark paid");
//     }
//   };

//   useEffect(() => {
//     fetchWallets();
//     fetchTransactions();
//     fetchWithdrawals();
//   }, []);

//   const filteredTransactions = transactions.filter(txn =>
//     (filterUser === "" || txn.userId === filterUser) &&
//     (filterType === "" || txn.type === filterType) &&
//     (filterStatus === "" || txn.status === filterStatus)
//   );

//   const totalPages = Math.ceil(filteredTransactions.length / pageSize);
//   const displayedTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);

//   return (
//     <div className="container-fluid">
//       <div className="block-header mb-4">
//         <h2>Wallet Management Dashboard</h2>
//       </div>

//       {/* Summary Cards */}
//       <div className="row clearfix row-deck mb-4">
//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget primary-bg">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-users"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Total Wallets</div>
//                 <h4 className="number mb-0">{wallets.length}</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget secondary-bg">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-rupee"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Total Balance</div>
//                 <h4 className="number mb-0">₹{wallets.reduce((sum, w) => sum + w.balance, 0)}</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget bg-dark">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-hourglass-half"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Pending Withdrawals</div>
//                 <h4 className="number mb-0">{withdrawals.filter(w => w.status === 'pending').length}</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-lg-3 col-md-6 col-sm-6">
//           <div className="card top_widget bg-info">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-exchange"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Total Transactions</div>
//                 <h4 className="number mb-0">{transactions.length}</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Manual Balance Adjustment */}
//       <div className="row clearfix mb-4">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header">
//               <h2>Manual Balance Adjustment</h2>
//             </div>
//             <div className="body">
//               <div className="row">
//                 <div className="col-md-3">
//                   <div className="form-group">
//                     <label>Select User</label>
//                     <select
//                       className="form-control"
//                       value={selectedUser || ""}
//                       onChange={e => setSelectedUser(e.target.value)}
//                     >
//                       <option value="">Select User</option>
//                       {wallets.map(wallet => (
//                         <option key={wallet._id} value={wallet.userId}>
//                           User {wallet.userId} (₹{wallet.balance})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="form-group">
//                     <label>Type</label>
//                     <select
//                       className="form-control"
//                       value={adjustType}
//                       onChange={e => setAdjustType(e.target.value)}
//                     >
//                       <option value="credit">Credit</option>
//                       <option value="debit">Debit</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="form-group">
//                     <label>Amount (₹)</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       placeholder="Amount"
//                       value={adjustAmount}
//                       onChange={e => setAdjustAmount(e.target.value)}
//                       min="1"
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-3">
//                   <div className="form-group">
//                     <label>Reason</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Reason for adjustment"
//                       value={adjustReason}
//                       onChange={e => setAdjustReason(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="form-group">
//                     <label>&nbsp;</label>
//                     <button
//                       className="btn btn-warning btn-block"
//                       onClick={handleAdjustBalance}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? 'Processing...' : 'Adjust'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* All Wallets */}
//       <div className="row clearfix mb-4">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header">
//               <h2>All User Wallets</h2>
//             </div>
//             <div className="body table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>User ID</th>
//                     <th>Balance</th>
//                     <th>Art Coins</th>
//                     <th>Pending Withdrawal</th>
//                     <th>Total Credited</th>
//                     <th>Total Debited</th>
//                     <th>Last Activity</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {wallets.map((wallet, i) => (
//                     <tr key={wallet._id}>
//                       <td>{i + 1}</td>
//                       <td>{wallet.userId}</td>
//                       <td>₹{wallet.balance}</td>
//                       <td>{wallet.artCoins}</td>
//                       <td>₹{wallet.pendingWithdrawal}</td>
//                       <td>₹{wallet.totalCredited}</td>
//                       <td>₹{wallet.totalDebited}</td>
//                       <td>{wallet.lastActivityAt ? new Date(wallet.lastActivityAt).toLocaleString() : 'Never'}</td>
//                     </tr>
//                   ))}
//                   {wallets.length === 0 && (
//                     <tr>
//                       <td colSpan="8" className="text-center">No wallets found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="row clearfix">
//         <div className="col-sm-12">
//           <div className="card">
//             <div className="header d-flex justify-content-between align-items-center mb-3">
//               <h2>Recent Transactions</h2>

//               {/* Filters */}
//               <div className="d-flex px-3" style={{ gap: '10px' }}>
//                 <select
//                   className="form-control"
//                   style={{ width: '150px' }}
//                   value={filterUser}
//                   onChange={e => { setFilterUser(e.target.value); setPage(1); }}
//                 >
//                   <option value="">All Users</option>
//                   {wallets.map(wallet => (
//                     <option key={wallet._id} value={wallet.userId}>
//                       User {wallet.userId}
//                     </option>
//                   ))}
//                 </select>

//                 <select
//                   className="form-control "
//                   style={{ width: '120px' }}
//                   value={filterType}
//                   onChange={e => { setFilterType(e.target.value); setPage(1); }}
//                 >
//                   <option value="">All Types</option>
//                   <option value="credit">Credit</option>
//                   <option value="debit">Debit</option>
//                 </select>

//                 <select
//                   className="form-control"
//                   style={{ width: '120px' }}
//                   value={filterStatus}
//                   onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
//                 >
//                   <option value="">All Status</option>
//                   <option value="success">Success</option>
//                   <option value="pending">Pending</option>
//                   <option value="failed">Failed</option>
//                 </select>
//               </div>

//             </div>

//             <div className="body table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>User ID</th>
//                     <th>User Name</th>
//                     <th>Type</th>
//                     <th>Amount</th>
//                     <th>Purpose</th>
//                     <th>Source</th>
//                     <th>Status</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {displayedTransactions.map((txn, idx) => (
//                     <tr key={txn._id}>
//                       <td>{(page - 1) * pageSize + idx + 1}</td>
//                       <td>{txn.userId}</td>
//                       <td>
//                         <span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>
//                           {txn.type}
//                         </span>
//                       </td>
//                       <td>₹{txn.amount}</td>
//                       <td>{txn.purpose}</td>
//                       <td>{txn.source}</td>
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
//                       <td colSpan="8" className="text-center">No transactions found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination Controls */}
//             <div className="d-flex justify-content-between align-items-center mt-3 px-3 py-3">
//               <div>
//                 Show{" "}
//                 <select className="form-control d-inline-block w-auto" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
//                   {[5, 10, 20, 30, 50, 100, 200, 500].map(size => (
//                     <option key={size} value={size}>{size}</option>
//                   ))}
//                 </select>{" "}
//                 entries
//               </div>

//               <div>
//                 <nav>
//                   <ul className="pagination mb-0">
//                     <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//                       <button className="page-link" onClick={() => setPage(prev => Math.max(prev - 1, 1))}>&laquo;</button>
//                     </li>
//                     {Array.from({ length: totalPages }, (_, i) => (
//                       <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
//                         <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
//                       </li>
//                     ))}
//                     <li className={`page-item ${page === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
//                       <button className="page-link" onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}>&raquo;</button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminWalletManagement;



//---------------------------------------------------




import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminWalletManagement = () => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState("credit");
  const [adjustReason, setAdjustReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const [walletPage, setWalletPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUserForDestination, setSelectedUserForDestination] = useState("");
  const [userDestinationData, setUserDestinationData] = useState(null);
  const [filterRole, setFilterRole] = useState("");
  const [exportRole, setExportRole] = useState("");
  const [exportUsers, setExportUsers] = useState([]);
  const [exportUserId, setExportUserId] = useState("");
  const [roleUsers, setRoleUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterAllUser, setFilterAllUser] = useState("");




  const API_URL = process.env.REACT_APP_API_URL;

  const fetchWallets = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wallet/admin/all-wallets`);
      setWallets(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserDestination = async (userId) => {
    if (!userId) {
      setUserDestinationData(null);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/wallet/admin/user/${userId}/destination`);
      setUserDestinationData(res.data);
    } catch (err) {
      console.error(err);
      setUserDestinationData(null);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wallet/admin/all-transactions`);
      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };




  const fetchDateFilteredTransactions = async (startDate, endDate, sortOrder = "desc") => {
    console.log("Fetching date-filtered transactions with params:", {
      startDate,
      endDate,
      sortOrder,
      skip: (page - 1) * pageSize,
      limit: pageSize
    });
    try {
      const res = await axios.get(`${API_URL}/api/wallet/admin/date-filter-transactions`, {
        params: {
          startDate,
          endDate,
          sortOrder,                          // "desc" = newest first, "asc" = oldest first
          skip: (page - 1) * pageSize,
          limit: pageSize
        }
      });
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Error fetching date-filtered transactions:", err);
    }
  };





  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wallet/withdrawals`);
      setWithdrawals(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjustBalance = async () => {
    if (!selectedUser || !adjustAmount) return alert("Select user and enter amount");
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/wallet/admin/adjust/${selectedUser}`, {
        amount: Number(adjustAmount),
        type: adjustType,
        reason: adjustReason || "Admin Adjustment"
      });
      toast.success("Balance adjusted successfully");
      await fetchWallets();
      await fetchTransactions();
      setAdjustAmount("");
      setAdjustReason("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to adjust balance");
    } finally {
      setIsLoading(false);
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
      await fetchWallets();
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
      await fetchWallets();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark paid");
    }
  };

  useEffect(() => {
    fetchWallets();
    fetchTransactions();
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    console.log("Effect fired with:", { startDate, endDate, sortOrder, page });
    if (startDate && endDate) {
      console.log("Calling fetchDateFilteredTransactions");
      fetchDateFilteredTransactions(startDate, endDate, sortOrder);
    } else {
      console.log("Calling fetchTransactions");
      fetchTransactions();
    }
  }, [startDate, endDate, sortOrder, page]);



  useEffect(() => {
    if (!filterRole) {
      setRoleUsers([]);
      setFilterUser("");
      return;
    }

    const fetchUsersByRole = async () => {
      console.log("fetchTransactions called");
      try {
        const res = await axios.get(`${API_URL}/api/wallet/get-users-by-role?role=${filterRole}`);
        // Only set users that belong to the selected role
        setRoleUsers(res.data.users || []);
        setFilterUser(""); // reset selected user whenever role changes
      } catch (err) {
        console.error("Failed to fetch users by role:", err);
        setRoleUsers([]);
        setFilterUser("");
      }
    };

    fetchUsersByRole();
  }, [filterRole]);





  //  filtering 
  // const filteredTransactions = transactions.filter(txn => {

  //   const txnUserWallet = wallets.find(w => {

  //     return w.userId === txn.userId ||
  //       w.userId?.toString() === txn.userId?.toString() ||
  //       String(w.userId) === String(txn.userId);
  //   });


  //   const username = txnUserWallet
  //     ? `${txnUserWallet.name || ''} ${txnUserWallet.lastName || ''}`.trim()
  //     : "";

  //   const userRole = txnUserWallet?.role
  //     ? txnUserWallet.role.toLowerCase().trim()
  //     : "";

  //   // Apply all filters
  //   const matchesUser = filterUser === "" ||
  //     username.toLowerCase().includes(filterUser.toLowerCase());

  //   const matchesType = filterType === "" || txn.type === filterType;

  //   const matchesStatus = filterStatus === "" || txn.status === filterStatus;

  //   const matchesRole = filterRole === "" ||
  //     userRole === filterRole.toLowerCase().trim();

  //   return matchesUser && matchesType && matchesStatus && matchesRole;
  // });

  // const allowedRoles = ["artist", "seller", "buyer"];




  // const filteredRoles = [...new Set(
  //   wallets
  //     .map(w => w.role)
  //     .filter(role => role)
  //     .map(role => role.toLowerCase().trim())
  //     .filter(role => allowedRoles.includes(role))
  // )].sort();

  // const roleOptions = filteredRoles.length > 0 ? filteredRoles : allowedRoles;


  // console.log("Available wallet roles:", wallets.map(w => ({
  //   userId: w.userId,
  //   role: w.role,
  //   name: w.name
  // })));

  const filteredTransactions = transactions.filter(txn => {
    const txnUserWallet = wallets.find(
      w => String(w.userId?._id || w.userId) === String(txn.userId)
    );

    if (!txnUserWallet) return false;

    const userRole = (txnUserWallet.role || '').toLowerCase().trim();
    const userId = txnUserWallet.userId?._id ? String(txnUserWallet.userId._id) : String(txnUserWallet.userId);

    const matchesRole = !filterRole || userRole === filterRole.toLowerCase();
    const matchesUser = !filterUser || userId === filterUser;  // Only selected user
    const matchesType = !filterType || txn.type === filterType;
    const matchesStatus = !filterStatus || txn.status === filterStatus;

    return matchesRole && matchesUser && matchesType && matchesStatus;
  });



  console.log("Filtered transactions count:", filteredTransactions.length);


  const allowedRoles = ["artist", "seller", "buyer"];

  const filteredRoles = [...new Set(
    wallets
      .map(w => w.role)
      .filter(role => role)
      .map(role => role.toLowerCase().trim())
      .filter(role => allowedRoles.includes(role))
  )].sort();

  const roleOptions = filteredRoles.length > 0 ? filteredRoles : allowedRoles;
  console.log("Value of filterRole:", filterRole);
  console.log("Selected user filter:", filterUser);




  const totalTransactionPages = Math.ceil(filteredTransactions.length / pageSize);
  const displayedTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);

  // Pagination for wallets table
  const totalWalletPages = Math.ceil(wallets.length / pageSize);
  const displayedWallets = wallets.slice((walletPage - 1) * pageSize, walletPage * pageSize);

  const allExport = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/export-all-wallets");
      if (!response.ok) throw new Error("Failed to export wallets");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "All_User_Wallets.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to export wallets");
    }
  };

  // const handleExport = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:3001/api/export-all-wallets?role=${filterRole}`);
  //     if (!response.ok) throw new Error("Failed to export wallets");

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `${filterRole || "All"}_User_Wallets.xlsx`;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to export wallets");
  //   }
  // };

  // const exportHandle = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:3001/api/export-recent-transactions?role=${filterRole}`);
  //     if (!response.ok) throw new Error("Failed to export recent transactions");

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `${filterRole || "All"}_Transactions.xlsx`;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to export recent transactions");
  //   }
  // };


  // 





  const handleExportRoleChange = async (role) => {
    setExportRole(role);
    setExportUserId("");

    if (!role) {
      setExportUsers([]);
      return;
    }

    try {
      const response = await axios.get(`/api/get-users-by-role?role=${encodeURIComponent(role)}`);
      setExportUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to load users", error);
      setExportUsers([]);
    }
  };

  // const handleExport = () => {
  //   if (!exportRole && !exportUserId) {
  //     alert("Please select a role or user to export");
  //     return;
  //   }

  //   let url = "/api/export-recent-transactions";
  //   const params = [];
  //   if (exportRole) params.push(`role=${encodeURIComponent(exportRole)}`);
  //   if (exportUserId) params.push(`userId=${encodeURIComponent(exportUserId)}`);

  //   if (params.length > 0) url += "?" + params.join("&");

  //   window.location.href = url; // triggers Excel download
  // };

  const handleExport = () => {
    if (!filterRole && !filterUser) {
      alert("Please select a role or user to export");
      return;
    }

    let url = "/api/export-recent-transactions";
    const params = [];
    if (filterRole) params.push(`role=${encodeURIComponent(filterRole)}`);
    if (filterUser) params.push(`userId=${encodeURIComponent(filterUser)}`);

    if (params.length > 0) url += "?" + params.join("&");

    window.location.href = url;
  };



  return (
    <div className="container-fluid">
      <div className="block-header mb-4">
        <h2>Wallet Management Dashboard</h2>
      </div>

      {/* Widgets */}
      <div className="row clearfix row-deck mb-4">
        {/* Total Wallets */}
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget primary-bg">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-users"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Total Wallets</div>
                <h4 className="number mb-0">{wallets.length}</h4>
              </div>
            </div>
          </div>
        </div>
        {/* Total Balance */}
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget secondary-bg">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-rupee"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Total Balance</div>
                <h4 className="number mb-0">₹{wallets.reduce((sum, w) => sum + w.balance, 0)}</h4>
              </div>
            </div>
          </div>
        </div>
        {/* Pending Withdrawals */}
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget bg-dark">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-hourglass-half"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Pending Withdrawals</div>
                <h4 className="number mb-0">{withdrawals.filter(w => w.status === 'pending').length}</h4>
              </div>
            </div>
          </div>
        </div>
        {/* Total Transactions */}
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget bg-info">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-exchange"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Total Transactions</div>
                <h4 className="number mb-0">{transactions.length}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Balance Adjustment */}
      <div className="row clearfix mb-4">
        <div className="col-sm-12">
          <div className="card">
            <div className="header"><h2>Manual Balance Adjustment</h2></div>
            <div className="body">
              <div className="row">
                <div className="col-md-3">
                  <select className="form-control" value={selectedUser || ""} onChange={e => setSelectedUser(e.target.value)}>
                    <option value="">Select User</option>
                    {wallets.map(wallet => (
                      <option key={wallet._id} value={wallet.userId}>
                        {wallet.name} {wallet.lastName} (₹{wallet.balance})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-control" value={adjustType} onChange={e => setAdjustType(e.target.value)}>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <input type="number" className="form-control" placeholder="Amount" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} min="1" />
                </div>
                <div className="col-md-3">
                  <input type="text" className="form-control" placeholder="Reason for adjustment" value={adjustReason} onChange={e => setAdjustReason(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-warning btn-block" onClick={handleAdjustBalance} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Adjust'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All User Wallets Table with Pagination */}
      <div className="row clearfix mb-4">
        <div className="col-sm-12">
          <div className="card">
            <div className="header d-flex justify-content-between align-items-center">
              <h2 className="mb-0">All User Wallets</h2>
              <button
                type="button"
                className="btn btn-outline-success btn-sm"
                onClick={allExport}
              >
                <i className="fa fa-upload mr-1"></i> Export
              </button>

            </div>
            <select
              className="form-control"
              style={{ width: "130px", height: "36px" }}
              value={sortOrder}
              onChange={e => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>

            <div className="body table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Balance</th>
                    <th>Art Coins</th>
                    <th>Pending Withdrawal</th>
                    <th>Total Credited</th>
                    <th>Total Debited</th>
                    <th>Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedWallets.map((wallet, i) => (
                    <tr key={wallet._id}>
                      <td>{(walletPage - 1) * pageSize + i + 1}</td>
                      <td>{wallet.userId}</td>
                      <td>{wallet.name} {wallet.lastName}</td>
                      <td>₹{wallet.balance}</td>
                      <td>{wallet.artCoins}</td>
                      <td>₹{wallet.pendingWithdrawal}</td>
                      <td>₹{wallet.totalCredited}</td>
                      <td>₹{wallet.totalDebited}</td>
                      <td>{wallet.lastActivityAt ? new Date(wallet.lastActivityAt).toLocaleString() : 'Never'}</td>
                    </tr>
                  ))}
                  {displayedWallets.length === 0 && <tr><td colSpan="9" className="text-center">No wallets found</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3 px-3 py-3">
              <div>
                Show <select className="form-control d-inline-block w-auto" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setWalletPage(1); setPage(1); }}>
                  {[5, 10, 20, 30, 50, 100, 200, 500].map(size => <option key={size} value={size}>{size}</option>)}
                </select> entries
              </div>
              <div>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${walletPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setWalletPage(prev => Math.max(prev - 1, 1))}>&laquo;</button>
                    </li>
                    {Array.from({ length: totalWalletPages }, (_, i) => (
                      <li key={i} className={`page-item ${walletPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setWalletPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${walletPage === totalWalletPages || totalWalletPages === 0 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setWalletPage(prev => Math.min(prev + 1, totalWalletPages))}>&raquo;</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Destination & Method Table */}
      <div className="row clearfix mb-4">
        <div className="col-sm-12">
          <div className="card">
            <div className="header"><h2>User Destination & Method</h2></div>
            <div className="body">
              {/* Select User */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <select
                    className="form-control"
                    value={selectedUserForDestination}
                    onChange={e => {
                      const userId = e.target.value;
                      setSelectedUserForDestination(userId);
                      fetchUserDestination(userId);
                    }}
                  >
                    <option value="">Select User</option>
                    {wallets.map(wallet => (
                      <option key={wallet._id} value={wallet.userId}>
                        {wallet.name} {wallet.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination Table */}
              {selectedUserForDestination ? (
                userDestinationData && (
                  Array.isArray(userDestinationData)
                    ? userDestinationData.length > 0
                    : Object.keys(userDestinationData).length > 0
                ) ? (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Serial No</th>
                          <th>Name</th>
                          <th>Method</th>
                          <th>Destination</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(userDestinationData)
                          ? userDestinationData.map((record, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{record.name || "-"}</td>
                              <td>{record.method || "-"}</td>
                              <td>
                                {typeof record.destination === "string"
                                  ? record.destination
                                  : record.destination && typeof record.destination === "object"
                                    ? (
                                      <div className="d-flex flex-column gap-1">
                                        {record.destination.name && <span>Name: {record.destination.name}</span>}
                                        {record.destination.bankName && <span>Bank: {record.destination.bankName}</span>}
                                        {record.destination.accountNumber && <span>Acc: {record.destination.accountNumber}</span>}
                                        {record.destination.ifsc && <span>IFSC: {record.destination.ifsc}</span>}
                                        {record.destination.upiId && <span>UPI: {record.destination.upiId}</span>}
                                        {record.destination.purpose && <span>Purpose: {record.destination.purpose}</span>}
                                      </div>
                                    )
                                    : "-"}
                              </td>
                            </tr>
                          ))
                          : Object.entries(userDestinationData).map(([key, record], idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{record.name || "-"}</td>
                              <td>{record.method || "-"}</td>
                              <td>
                                {typeof record.destination === "string"
                                  ? record.destination
                                  : record.destination && typeof record.destination === "object"
                                    ? (
                                      <div className="d-flex flex-column gap-1">
                                        {record.destination.name && <span>Name: {record.destination.name}</span>}
                                        {record.destination.bankName && <span>Bank: {record.destination.bankName}</span>}
                                        {record.destination.accountNumber && <span>Acc: {record.destination.accountNumber}</span>}
                                        {record.destination.ifsc && <span>IFSC: {record.destination.ifsc}</span>}
                                        {record.destination.upiId && <span>UPI: {record.destination.upiId}</span>}
                                        {record.destination.purpose && <span>Purpose: {record.destination.purpose}</span>}
                                      </div>
                                    )
                                    : "-"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No destination data found for this user.</p>
                )
              ) : (
                <p>Select a user to see destination data.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table  */}
      <div className="row clearfix">
        <div className="col-sm-12">
          <div className="card">
            {/* <div className="header d-flex justify-content-between align-items-center mb-3">
              <h2>Recent Transactions</h2>
              <div className="d-flex px-3" style={{ gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={handleExport}
                >
                  <i className="fa fa-upload mr-1"></i> Export
                </button>

                <div className="d-flex flex-column">
                  <select
                    className="form-control"
                    style={{ width: "150px" }}
                    value={filterRole}
                    onChange={(e) => {
                      setFilterRole(e.target.value);
                      setExportRole(e.target.value);
                      setFilterUser("");
                      setExportUserId("");
                    }}
                  >
                    <option value="">All Roles</option>
                    {roleOptions.map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>

                  {filterRole && (
                    <select
                      className="form-control mt-2"
                      style={{ width: "200px" }}
                      value={filterUser}
                      onChange={(e) => {
                        setFilterUser(e.target.value);
                        setExportUserId(e.target.value);
                      }}
                    >
                      <option value="">Select User</option>
                      {wallets
                        .filter(w => (w.role || "").toLowerCase().trim() === filterRole.toLowerCase())
                        .map(w => {
                          const fullName = `${w.name || ""} ${w.lastName || ""}`.trim();
                          return (
                            <option key={w.userId} value={w.userId}>
                              {fullName || w.userId}
                            </option>
                          );
                        })}
                    </select>
                  )}
                </div>


                <select className="form-control" style={{ width: '200px' }} value={filterUser} onChange={e => { setFilterUser(e.target.value); setPage(1); }}>
                  <option value="">All Users</option>
                  {wallets.map(wallet => (
                    <option key={wallet._id} value={`${wallet.name} ${wallet.lastName}`}>
                      {wallet.name} {wallet.lastName}
                    </option>
                  ))}
                </select>
                <select className="form-control" style={{ width: '120px' }} value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
                  <option value="">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
                <select className="form-control" style={{ width: '120px' }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
                  <option value="">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div> */}

            <div className="header d-flex justify-content-between align-items-center mb-3">
              <h2>Recent Transactions</h2>

              <div className="d-flex flex-wrap align-items-center px-3" style={{ gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  style={{ height: '36px' }}
                  onClick={handleExport}
                >
                  <i className="fa fa-upload mr-1"></i> Export
                </button>
                <select
                  className="form-control"
                  style={{ width: "130px", height: "36px" }}
                  value={sortOrder}
                  onChange={e => {
                    setSortOrder(e.target.value);
                    setPage(1);
                    fetchTransactions();
                    console.log("Sort order changed:", e.target.value);
                  }}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>




                <select
                  className="form-control"
                  style={{ width: "120px", height: "36px" }}
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value);
                    setExportRole(e.target.value);
                    setFilterUser("");
                    setExportUserId("");
                  }}
                >
                  <option value="">All Roles</option>
                  {roleOptions.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>

                {filterRole && (
                  <select
                    className="form-control"
                    style={{ width: "120px", height: "36px" }}
                    value={filterUser}
                    onChange={(e) => {
                      setFilterUser(e.target.value);
                      setExportUserId(e.target.value);
                    }}
                  >
                    <option value="">Select User</option>
                    {wallets
                      .filter(w => (w.role || "").toLowerCase().trim() === filterRole.toLowerCase())
                      .map(w => {
                        const fullName = `${w.name || ""} ${w.lastName || ""}`.trim();
                        return (
                          <option key={w.userId} value={w.userId}>
                            {fullName || w.userId}
                          </option>
                        );
                      })}
                  </select>
                )}


                <select className="form-control" style={{ width: '170px' }} value={filterUser} onChange={e => { setFilterUser(e.target.value); setPage(1); }}>
                  <option value="">All Users</option>
                  {wallets.map(wallet => (
                    <option key={wallet._id} value={`${wallet.name} ${wallet.lastName}`}>
                      {wallet.name} {wallet.lastName}
                    </option>
                  ))}
                </select>


                <select
                  className="form-control"
                  style={{ width: '120px', height: '36px' }}
                  value={filterType}
                  onChange={e => {
                    setFilterType(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>

                <select
                  className="form-control"
                  style={{ width: '120px', height: '36px' }}
                  value={filterStatus}
                  onChange={e => {
                    setFilterStatus(e.target.value);
                    setPage(1);
                  }}
                >
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
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Purpose</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTransactions.map((txn, idx) => {
                    const user = wallets.find(w => w.userId === txn.userId);
                    return (
                      <tr key={txn._id}>
                        <td>{(page - 1) * pageSize + idx + 1}</td>
                        <td>{txn.userId}</td>
                        <td>{user ? `${user.name} ${user.lastName}` : "Unknown"}</td>
                        <td><span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>{txn.type}</span></td>
                        <td>₹{txn.amount}</td>
                        <td>{txn.purpose}</td>
                        <td>{txn.source}</td>
                        <td><span className={`badge ${txn.status === 'success' ? 'badge-success' : txn.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{txn.status}</span></td>
                        <td>{new Date(txn.createdAt).toLocaleString()}</td>
                      </tr>
                    )
                  })}
                  {displayedTransactions.length === 0 && <tr><td colSpan="9" className="text-center">No transactions found</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3 px-3 py-3">
              <div>
                Show <select className="form-control d-inline-block w-auto" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); setWalletPage(1); }}>
                  {[5, 10, 20, 30, 50, 100, 200, 500].map(size => <option key={size} value={size}>{size}</option>)}
                </select> entries
              </div>
              <div>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(prev => Math.max(prev - 1, 1))}>&laquo;</button></li>
                    {Array.from({ length: totalTransactionPages }, (_, i) => (
                      <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}><button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button></li>
                    ))}
                    <li className={`page-item ${page === totalTransactionPages || totalTransactionPages === 0 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(prev => Math.min(prev + 1, totalTransactionPages))}>&raquo;</button></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWalletManagement;


