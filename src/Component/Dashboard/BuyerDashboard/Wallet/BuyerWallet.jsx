// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const BuyerWallet = () => {
//   const [wallet, setWallet] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [amount, setAmount] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const API_URL = process.env.REACT_APP_API_URL;
//   const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;
//   const userId = localStorage.getItem("userId");

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
//           ondismiss: function() {
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

//   useEffect(() => {
//     if (!userId) return;
//     fetchWallet();
//     fetchTransactions();
//   }, [userId]);

//   if (!wallet) return <div>Loading...</div>;

//   return (
//     <div className="container-fluid">
//       <div className="block-header mb-4">
//         <h2>My Wallet</h2>
//       </div>

//       {/* Balance Cards */}
//       <div className="row clearfix row-deck mb-4">
//         <div className="col-lg-4 col-md-6 col-sm-6">
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

//         <div className="col-lg-4 col-md-6 col-sm-6">
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

//         <div className="col-lg-4 col-md-6 col-sm-6">
//           <div className="card top_widget bg-dark">
//             <div className="body">
//               <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-history"></i></div>
//               <div className="content text-light">
//                 <div className="text mb-2 text-uppercase">Total Transactions</div>
//                 <h4 className="number mb-0">{transactions.length}</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Money Section */}
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
//               <h2>Wallet Benefits</h2>
//             </div>
//             <div className="body">
//               <ul className="list-unstyled">
//                 <li><i className="fa fa-check text-success"></i> Instant payments for purchases</li>
//                 <li><i className="fa fa-check text-success"></i> Secure bidding with wallet balance</li>
//                 <li><i className="fa fa-check text-success"></i> Earn Art Coins with every transaction</li>
//                 <li><i className="fa fa-check text-success"></i> Automatic refunds for failed bids</li>
//                 <li><i className="fa fa-check text-success"></i> No transaction fees</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="row clearfix">
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
//                   {transactions.slice(0, 10).map((txn, idx) => (
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
//       </div>
//     </div>
//   );
// };

// export default BuyerWallet;




import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BuyerWalletSkeleton from "../../../Skeleton/wallet/BuyerWalletSkeleton";

const BuyerWallet = () => {
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
  const [limits, setLimits] = useState(null);
  const [referralData, setReferralData] = useState(null);
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [isApplyingReferral, setIsApplyingReferral] = useState(false);

  const transactionsRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;
    const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));

  const displayedTransactions = transactions.slice((page - 1) * pageSize, page * pageSize);

  const fetchWallet = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/${userId}`);
      setWallet(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        try {
          const createRes = await axios.post(`${API_URL}/api/wallet/ensure/${userId}`);
          setWallet(createRes.data);
        } catch (e) {
          console.error("Error creating wallet:", e);
        }
      } else console.error("Error fetching wallet:", err);
    }
  };

  const fetchTransactions = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/transactions/${userId}`);
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const fetchWithdrawals = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/withdrawals/user/${userId}`);
      setWithdrawals(res.data.withdrawals || []);
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    }
  };

  const fetchLimits = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/limits/${userId}`);
      setLimits(res.data);
    } catch (err) {
      console.error("Error fetching limits:", err);
    }
  };

  const fetchReferralData = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/referral/stats/${userId}`);
      setReferralData(res.data);
    } catch (err) {
      console.error("Error fetching referral data:", err);
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

    const [referralSettings, setReferralSettings] = useState(null);
    const [coinSetting, setCoinSetting] = useState({ coinValue: 0.10, currency: "INR", transactionReward: 10 });

    const fetchCoinSetting = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/coin-settings`);
        if (res.data) setCoinSetting(res.data);
      } catch (err) {
        console.error("Error fetching coin settings:", err);
      }
    };

    const fetchReferralSettings = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${API_URL}/api/wallet/referral/settings/${userId}`);
        setReferralSettings(res.data);
      } catch (err) {
        console.error("Error fetching referral settings:", err);
      }
    };

  const copyReferralCode = () => {
    if (wallet?.referralCode) {
      navigator.clipboard.writeText(wallet.referralCode);
      toast.success("Referral code copied to clipboard!");
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
    if (!amount || Number(amount) <= 0) return alert("Enter deposit amount");
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/add-money/${userId}`, { amount: Number(amount) });
      setWallet(res.data.wallet);
      setTransactions(prev => [res.data.transaction, ...prev]);
      setAmount("");
      toast.success("Wallet credited");
    } catch (err) {
      console.error("Error adding money:", err);
      toast.error("Failed to add money");
    } finally {
      setIsLoading(false);
    }
  };

  // const addMoneyViaRazorpay = async () => {
  //   if (!amount || Number(amount) <= 0) return alert("Enter deposit amount");

  //   if (!RAZORPAY_KEY) {
  //     toast.warning("Razorpay key not configured. Using test mode...");
  //     setTimeout(async () => {
  //       await fetchWallet();
  //       await fetchTransactions();
  //       toast.success("Test payment completed!");
  //     }, 1000);
  //     return;
  //   }

  //   const ok = await loadRazorpayScript();
  //   if (!ok) return toast.error("Failed to load payment SDK");

  //   try {
  //     const init = await axios.post(`${API_URL}/api/wallet/add-money-initiate/${userId}`, { amount: Number(amount) });
  //     const { id: orderId, amount: razorpayAmount, currency } = init.data;

  //     const options = {
  //       key: RAZORPAY_KEY,
  //       amount: razorpayAmount,
  //       currency: currency || "INR",
  //       name: "Artsays Wallet",
  //       description: "Add Money to Wallet",
  //       order_id: orderId,
  //       handler: async function (response) {
  //         toast.success("Payment successful! Updating wallet...");
  //         setTimeout(async () => {
  //           await fetchWallet();
  //           await fetchTransactions();
  //         }, 1500);
  //       },
  //       prefill: { name: "Artsays User", email: "user@artsays.com" },
  //       theme: { color: "#121212" },
  //       modal: { ondismiss: function () { toast.info("Payment cancelled"); } }
  //     };

  //     const rz = new window.Razorpay(options);
  //     rz.on("payment.failed", function (response) {
  //       toast.error("Payment failed: " + (response.error?.description || "Unknown error"));
  //     });
  //     rz.open();
  //   } catch (err) {
  //     console.error("Error initiating payment:", err);
  //     toast.error("Failed to start payment: " + (err.response?.data?.error || err.message));
  //   }
  // };
const addMoneyViaRazorpay = async () => {
  if (!amount || Number(amount) <= 0) {
    toast.error("Enter a valid amount");
    return;
  }

  setIsLoading(true);

  try {
    // 🔹 TEST MODE (NO RAZORPAY KEY)
    if (!RAZORPAY_KEY) {
      const res = await axios.post(
        `${API_URL}/api/wallet/add-money/${userId}`,
        { amount: Number(amount), source: "test" }
      );

      setWallet(res.data.wallet);
      setTransactions(prev => [res.data.transaction, ...prev]);
      setAmount("");

      toast.success("Payment successful! Wallet credited.");
      return;
    }

    // 🔹 REAL RAZORPAY FLOW
    const ok = await loadRazorpayScript();
    if (!ok) {
      toast.error("Unable to load payment gateway");
      return;
    }

    const init = await axios.post(
      `${API_URL}/api/wallet/add-money-initiate/${userId}`,
      { amount: Number(amount) }
    );

    const { id: orderId, amount: razorpayAmount, currency } = init.data;

    const options = {
      key: RAZORPAY_KEY,
      amount: razorpayAmount,
      currency: currency || "INR",
      name: "Artsays Wallet",
      description: "Add Money to Wallet",
      order_id: orderId,
      handler: async () => {
        toast.success("Payment successful!");

        await fetchWallet();
        await fetchTransactions();
      },
      modal: {
        ondismiss: () => toast.info("Payment cancelled")
      }
    };

    const rz = new window.Razorpay(options);
    rz.on("payment.failed", () => {
      toast.error("Payment failed");
    });
    rz.open();
  } catch (err) {
    console.error(err);
    toast.error("Payment failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const isValidUpi = (upi) => {
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(upi);
};
const isValidName = (name) => {
  return /^[A-Za-z\s]{3,50}$/.test(name);
};

const isValidAccountNumber = (acc) => {
  return /^[0-9]{9,18}$/.test(acc);
};

const isValidIFSC = (ifsc) => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};

const isValidText = (text) => {
  return text && text.trim().length >= 3;
};


  const requestWithdrawal = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return alert("Enter amount to withdraw");


    if (withdrawMethod === "upi") {
  if (!withdrawDestination.upi) {
    toast.error("Please enter UPI ID");
    return;
  }

  if (!isValidUpi(withdrawDestination.upi)) {
    toast.error("Invalid UPI ID format (example: name@bank)");
    return;
  }
}

    // if (withdrawMethod === "bank") {
    //   const { name, accountNumber, ifsc, bankName, purpose } = withdrawDestination;
    //   if (!name || !accountNumber || !ifsc || !bankName || !purpose) return alert("Fill all bank transfer details");
    // }
    if (withdrawMethod === "bank") {
  const { name, accountNumber, ifsc, bankName, purpose } = withdrawDestination;

  if (!isValidName(name)) {
    toast.error("Enter a valid beneficiary name (letters only)");
    return;
  }

  if (!isValidAccountNumber(accountNumber)) {
    toast.error("Enter a valid account number (9–18 digits)");
    return;
  }

  if (!isValidIFSC(ifsc)) {
    toast.error("Enter a valid IFSC code (example: SBIN0001234)");
    return;
  }

  if (!isValidText(bankName)) {
    toast.error("Enter a valid bank name and branch");
    return;
  }

  if (!isValidText(purpose)) {
    toast.error("Purpose of transfer is required");
    return;
  }
}


    if (Number(withdrawAmount) > (wallet?.balance || 0)) return alert("Insufficient balance");
    if (Number(withdrawAmount) < 100) return alert("Minimum withdrawal amount is ₹100");

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/withdraw/${userId}`, {
        amount: Number(withdrawAmount),
        method: withdrawMethod,
        destination: withdrawMethod === "upi" ? withdrawDestination.upi : withdrawDestination
      });
      setWallet(res.data.wallet);
      setTransactions(prev => [res.data.transaction, ...prev]);
      setWithdrawAmount("");
      setWithdrawDestination({});
      fetchWithdrawals();
      fetchLimits();
      toast.success("Withdrawal requested successfully! Admin will process it soon.");
    } catch (err) {
      console.error("Error requesting withdrawal:", err);
      toast.error(err.response?.data?.message || "Failed to request withdrawal");
    } finally {
      setIsLoading(false);
    }
  };



  const downloadReceipt = async (txnId) => {
    try {
      const res = await axios.get(`${API_URL}/api/wallet/transaction/receipt/${txnId}`);
      const receipt = res.data;
      
      const receiptContent = `
========================================
           ARTSAYS RECEIPT
========================================
Receipt No: ${receipt.receiptNumber}
Date: ${new Date(receipt.date).toLocaleString()}

Transaction Details:
--------------------
Type: ${receipt.type.toUpperCase()}
Amount: ₹${receipt.amount}
Purpose: ${receipt.purpose}
Status: ${receipt.status}

User: ${receipt.user.name}
Email: ${receipt.user.email}

Balance After: ₹${receipt.balanceAfter}
Art Coins: ${receipt.artCoinsEarned > 0 ? '+' : ''}${receipt.artCoinsEarned}

Generated: ${new Date(receipt.generatedAt).toLocaleString()}
========================================
      `;
      
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${receipt.receiptNumber}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Receipt downloaded");
    } catch (err) {
      toast.error("Failed to download receipt");
    }
  };

  const exportTransactions = async (format = "csv") => {
    try {
      const res = await axios.get(`${API_URL}/api/wallet/transactions/export/${userId}?format=${format}`);
      if (format === "csv") {
        const blob = new Blob([res.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      toast.success("Transactions exported");
    } catch (err) {
      toast.error("Failed to export transactions");
    }
  };

    useEffect(() => {
      if (!userId) return;
      fetchWallet();
      fetchTransactions();
      fetchWithdrawals();
      fetchLimits();
      fetchReferralData();
      fetchReferralSettings();
      fetchCoinSetting();
    }, [userId]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [transactions.length, pageSize, totalPages]);
 useEffect(() => {
  if (transactionsRef.current) {
    const yOffset = -20;
    const y =
      transactionsRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }
}, [page]);



    const showReferral = referralSettings?.isActive || userType === "Super-Admin";

    if (!wallet) {
      return <BuyerWalletSkeleton />;
    }

    return (

    <div className="container-fluid">
      <div className="block-header mb-4">
        <h2>My Wallet</h2>
      </div>

      <div className="row clearfix row-deck mb-4">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget primary-bg" style={{ backgroundColor: "#4B2E05", color: "#ffffff" }}>
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
            <div className="card top_widget secondary-bg" style={{ backgroundColor: "#F36F21", color: "#ffffff" }}>
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
          <div className="card top_widget bg-dark">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-history"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">All Transactions</div>
                <h4 className="number mb-0">{transactions.length}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget bg-info">
            <div className="body">
              <div className="icon bg-light" style={{ fontSize: "20px" }}><i className="fa fa-chart-line"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Total Credited</div>
                <h4 className="number mb-0">₹{wallet.totalCredited || 0}</h4>
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
                          className="progress-bar"
                          style={{ width: `${(limits.dailyUsed / limits.dailyLimit) * 100}%`, backgroundColor: "#4B2E05" }}
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
                  style={{ backgroundColor: "#4B2E05", borderColor: "#4B2E05", color: "#fff" }}
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

      {showReferral && referralData && (
        <div className="row clearfix mb-4">
          <div className="col-12">
            <div className="card">
              <div className="header"><h2>Referral Program</h2></div>
              <div className="body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Your Referral Code</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={referralData.referralCode || ""}
                          readOnly
                        />
                        <div className="input-group-append">
                          <button className="btn btn-primary" onClick={copyReferralCode} style={{ backgroundColor: "#4B2E05", borderColor: "#4B2E05" }}>
                            <i className="fa fa-copy"></i> Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label>Total Referrals</label>
                    <h4>{referralData.totalReferrals || 0}</h4>
                  </div>
                  <div className="col-md-4">
                    <label>Referral Earnings</label>
                    <h4>₹{referralData.totalEarnings || 0}</h4>
                  </div>
                </div>
                <hr />
                <small className="text-muted">
                  Share your referral code with friends. When they sign up and make their first purchase, you earn ₹50 + 100 Art Coins!
                </small>
              </div>
            </div>
          </div>
        </div>
        )}

          <div className="row clearfix mb-4">
            <div className="col-sm-12">
              <div className="card">
                <div className="header">
                  <h2>Art Coins Benefits</h2>
                </div>
              <div className="body">
                <div className="row">
                  <div className="col-md-4">
                    <h5>How to Earn</h5>
                    <ul>
                      <li>{coinSetting.transactionReward || 10} coins per transaction</li>
                      {showReferral && <li>{referralSettings?.buyerReferredCoinsReward || 100} coins on referral signup</li>}
                      <li>Bonus coins on special offers</li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <h5>How to Use</h5>
                    <ul>
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
                          <strong className="text-primary">{referralSettings?.buyerReferrerCoinsReward || 0} Coins</strong>
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
                    {showReferral && (
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === 'referral' ? 'active' : ''}`}
                          onClick={() => setActiveTab('referral')}
                        >
                          Referral Program
                        </button>
                      </li>
                    )}
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
                        <tr key={txn._id || idx}>
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
                              txn.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                              {txn.status}
                            </span>
                          </td>
                          <td>{txn.createdAt ? new Date(txn.createdAt).toLocaleString() : "-"}</td>
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
                      {displayedTransactions.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center">No transactions yet</td>
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
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
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

                {showReferral && activeTab === 'referral' && (
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
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerWallet;
