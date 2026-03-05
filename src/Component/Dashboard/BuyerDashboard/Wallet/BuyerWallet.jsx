import React, { useEffect, useState, useRef } from "react";
import axios from "../../../../api/axiosConfig";
import { toast } from "react-toastify";
import { FaWallet, FaCoins, FaExchangeAlt, FaArrowUp, FaArrowDown, FaCopy, FaDownload, FaGift, FaUsers, FaCheckCircle, FaHistory, FaChartLine, FaPlus } from "react-icons/fa";
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
  const [referralSettings, setReferralSettings] = useState(null);
  const [coinSetting, setCoinSetting] = useState({ coinValue: 0.10, currency: "INR", transactionReward: 10 });
  const [savedBankDetails, setSavedBankDetails] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("saved"); // "saved" or "new"

  const transactionsRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const categorize = (txn) => {
    if (txn.category) return txn.category;
    const p = (txn.purpose || "").toLowerCase();
    if (p.includes("bidding pass")) return "bidding_pass";
    if (p.includes("certificate")) return "certificate";
    if (p.includes("ad click") || p.includes("ad spend") || p.includes("campaign")) return "ads";
    if (p.includes("challenge")) return "challenges";
    if (p.includes("insurance")) return "insurance";
    if (p.includes("verification badge") || p.includes("badge purchase") || p.includes("badge")) return "verification_badge";
    if (p.includes("promote post") || p.includes("post promotion") || p.includes("boost post")) return "promote_post";
    if (p.includes("packaging") || p.includes("packing material")) return "packaging_materials";
    if (p.includes("final bid") || p.includes("bid won") || p.includes("bid refund")) return "final_bidding";
    if (p.includes("exhibition")) return "exhibition";
    if (p.includes("order") && p.includes("commission")) return "product_order";
    if (p.includes("order payment") || p.includes("payment for order")) return "product_order";
    if (p.includes("order refund") || p.includes("order cancelled")) return "refund";
    if (p.includes("order") || p.includes("payment") || p.includes("purchase") || p.includes("art coins redeemed")) return "orders";
    if (p.includes("commission")) return "commission";
    if (p.includes("promot")) return "promotion";
    if (p.includes("referral")) return "referral";
    if (p.includes("withdraw")) return "withdrawal";
    if (p.includes("add money") || p.includes("deposit") || p.includes("top-up") || p.includes("topup")) return "deposit";
    if (p.includes("admin")) return "admin";
    return "other";
  };

  const categoryLabels = {
    all: "All Transactions",
    bidding_pass: "Bidding Pass",
    certificate: "Certificate",
    ads: "Ads / Campaigns",
    challenges: "Challenges",
    insurance: "Insurance",
    verification_badge: "Verification Badges",
    promote_post: "Promote Post",
    packaging_materials: "Packaging Materials",
    final_bidding: "Final Bidding",
    exhibition: "Exhibition",
    product_order: "Product Orders",
    commission: "Commissions",
    orders: "Orders & Payments",
    promotion: "Promotions",
    referral: "Referral",
    withdrawal: "Withdrawals",
    deposit: "Deposits",
    admin: "Admin Adjustments",
    refund: "Refunds",
    other: "Other"
  };

  const categoryColors = {
    bidding_pass: "bg-violet-100 text-violet-700",
    certificate: "bg-blue-100 text-blue-700",
    ads: "bg-orange-100 text-orange-700",
    challenges: "bg-pink-100 text-pink-700",
    insurance: "bg-teal-100 text-teal-700",
    verification_badge: "bg-amber-100 text-amber-700",
    promote_post: "bg-fuchsia-100 text-fuchsia-700",
    packaging_materials: "bg-stone-100 text-stone-700",
    final_bidding: "bg-indigo-100 text-indigo-700",
    exhibition: "bg-cyan-100 text-cyan-700",
    product_order: "bg-yellow-100 text-yellow-700",
    commission: "bg-amber-100 text-amber-700",
    orders: "bg-blue-100 text-blue-700",
    promotion: "bg-pink-100 text-pink-700",
    referral: "bg-cyan-100 text-cyan-700",
    withdrawal: "bg-red-100 text-red-700",
    deposit: "bg-emerald-100 text-emerald-700",
    admin: "bg-gray-100 text-gray-700",
    refund: "bg-yellow-100 text-yellow-700",
    other: "bg-slate-100 text-slate-700"
  };

  const filteredTransactions = categoryFilter === "all"
    ? transactions
    : transactions.filter(t => categorize(t) === categoryFilter);

  const sortedForCumulative = [...filteredTransactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const cumulativeMap = {};
  let runningTotal = 0;
  sortedForCumulative.forEach(txn => {
    runningTotal += txn.type === "credit" ? Number(txn.amount) : -Number(txn.amount);
    cumulativeMap[txn._id] = runningTotal;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const displayedTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);

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
      const res = await axios.get(`${API_URL}/api/wallet/user-all-transactions/${userId}`);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      // Fallback to wallet-only transactions
      try {
        const res2 = await axios.get(`${API_URL}/api/wallet/transactions/${userId}`);
        setTransactions(res2.data || []);
      } catch (e) {
        console.error("Error fetching transactions:", e);
      }
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

  const fetchBankDetails = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/auth/bankdetails/${userId}`);
      if (res.data && res.data.bankDetails) {
        setSavedBankDetails(res.data.bankDetails);
        if (res.data.bankDetails.upiId || res.data.bankDetails.accountNumber) {
          setSelectedPaymentOption("saved");
        }
      } else {
        setSavedBankDetails(null);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Error fetching bank details:", err);
      }
      setSavedBankDetails(null);
    }
  };

  const copyReferralCode = () => {
    if (wallet?.referralCode) {
      navigator.clipboard.writeText(wallet.referralCode);
      toast.success("Referral code copied to clipboard!");
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

  const addMoneyDirect = async () => {
    if (!amount || Number(amount) <= 0) return toast.error("Enter deposit amount");
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/add-money/initiate/${userId}`, { amount: Number(amount) });
      if (res.data.success && res.data.data?.paymentUrl) {
        window.location.href = res.data.data.paymentUrl;
      } else {
        toast.error(res.data.message || "Failed to initiate payment");
      }
    } catch (err) {
      console.error("Error adding money:", err);
      toast.error(err.response?.data?.message || "Failed to add money");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUpi = (upi) => /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upi);
  const isValidName = (name) => /^[A-Za-z\s]{3,50}$/.test(name);
  const isValidAccountNumber = (acc) => /^[0-9]{9,18}$/.test(acc);
  const isValidIFSC = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  const isValidText = (text) => text && text.trim().length >= 3;

  const requestWithdrawal = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return toast.error("Enter amount to withdraw");

    // Determine destination based on saved or new selection
    let destination;
    
    if (withdrawMethod === "upi") {
      if (selectedPaymentOption === "saved" && savedBankDetails?.upiId) {
        destination = savedBankDetails.upiId;
      } else {
        if (!withdrawDestination.upi) return toast.error("Please enter UPI ID");
        if (!isValidUpi(withdrawDestination.upi)) return toast.error("Invalid UPI ID format (example: name@bank)");
        destination = withdrawDestination.upi;
      }
    }

    if (withdrawMethod === "bank") {
      if (selectedPaymentOption === "saved" && savedBankDetails?.accountNumber) {
        destination = {
          name: savedBankDetails.accountHolderName,
          accountNumber: savedBankDetails.accountNumber,
          ifsc: savedBankDetails.ifscCode,
          bankName: savedBankDetails.bankName,
          purpose: "Wallet Withdrawal"
        };
      } else {
        const { name, accountNumber, ifsc, bankName, purpose } = withdrawDestination;
        if (!isValidName(name)) return toast.error("Enter a valid beneficiary name (letters only)");
        if (!isValidAccountNumber(accountNumber)) return toast.error("Enter a valid account number (9-18 digits)");
        if (!isValidIFSC(ifsc)) return toast.error("Enter a valid IFSC code (example: SBIN0001234)");
        if (!isValidText(bankName)) return toast.error("Enter a valid bank name and branch");
        if (!isValidText(purpose)) return toast.error("Purpose of transfer is required");
        destination = withdrawDestination;
      }
    }

    if (Number(withdrawAmount) > (wallet?.balance || 0)) return toast.error("Insufficient balance");
    if (Number(withdrawAmount) < 100) return toast.error("Minimum withdrawal amount is ₹100");

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/withdraw/${userId}`, {
        amount: Number(withdrawAmount),
        method: withdrawMethod,
        destination: destination
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
    fetchBankDetails();
  }, [userId]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [transactions.length, pageSize, totalPages]);

  useEffect(() => {
    if (transactionsRef.current) {
      const yOffset = -20;
      const y = transactionsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [page]);

  const showReferral = referralSettings?.isActive || userType === "Super-Admin";

  if (!wallet) {
    return <BuyerWalletSkeleton />;
  }

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          My Wallet
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#5C4033] to-[#3d2a22] rounded-[1.5rem] p-6 text-white shadow-lg shadow-[#5C4033]/20 hover:shadow-xl hover:shadow-[#5C4033]/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaWallet className="text-xl" />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium mb-1">Available Balance</p>
          <h3 className="text-2xl font-bold">₹{wallet.balance?.toLocaleString()}</h3>
        </div>

        {/* Art Coins Card */}
        <div className="bg-gradient-to-br from-[#F36F21] to-[#d55a10] rounded-[1.5rem] p-6 text-white shadow-lg shadow-[#F36F21]/20 hover:shadow-xl hover:shadow-[#F36F21]/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaCoins className="text-xl" />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium mb-1">Art Coins</p>
          <h3 className="text-2xl font-bold">{wallet.artCoins?.toLocaleString() || 0}</h3>
          <p className="text-white/60 text-xs mt-1">Worth {coinSetting.currency} {(wallet.artCoins * (coinSetting.coinValue || 0)).toFixed(2)}</p>
        </div>

        {/* Transactions Card */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-[1.5rem] p-6 text-white shadow-lg shadow-gray-700/20 hover:shadow-xl hover:shadow-gray-700/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaHistory className="text-xl" />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium mb-1">All Transactions</p>
          <h3 className="text-2xl font-bold">{transactions.length}</h3>
        </div>

        {/* Total Credited Card */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-[1.5rem] p-6 text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaChartLine className="text-xl" />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium mb-1">Total Credited</p>
          <h3 className="text-2xl font-bold">₹{(wallet.totalCredited || 0).toLocaleString()}</h3>
        </div>
      </div>

      {/* Withdrawal Limits */}
      {limits && (
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Withdrawal Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Daily Limit</span>
                <span className="text-sm font-bold text-gray-900">₹{limits.dailyUsed?.toLocaleString()} / ₹{limits.dailyLimit?.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#5C4033] to-[#8B6914] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((limits.dailyUsed / limits.dailyLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Remaining: ₹{limits.dailyRemaining?.toLocaleString()}</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Monthly Limit</span>
                <span className="text-sm font-bold text-gray-900">₹{limits.monthlyUsed?.toLocaleString()} / ₹{limits.monthlyLimit?.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((limits.monthlyUsed / limits.monthlyLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Remaining: ₹{limits.monthlyRemaining?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Money & Withdraw Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Add Money */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Add Money to Wallet</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
              />
            </div>
            <button
              onClick={addMoneyDirect}
              disabled={isLoading}
              className="w-full bg-[#5C4033] hover:bg-[#4b3327] text-white py-3 px-6 rounded-2xl font-semibold shadow-lg shadow-[#5C4033]/20 transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Add Money"}
            </button>
          </div>
        </div>

        {/* Request Withdrawal */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Request Withdrawal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="100"
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Withdrawal Method</label>
                <select
                  value={withdrawMethod}
                  onChange={e => {
                    setWithdrawMethod(e.target.value);
                    setSelectedPaymentOption("saved");
                    setWithdrawDestination({});
                  }}
                  className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                >
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              {/* Payment Option Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Payment Details</label>
                <div className="flex gap-2">
                  {((withdrawMethod === "upi" && savedBankDetails?.upiId) || 
                    (withdrawMethod === "bank" && savedBankDetails?.accountNumber)) && (
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentOption("saved")}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedPaymentOption === "saved" 
                          ? "bg-[#5C4033] text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Use Saved Details
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentOption("new");
                      setWithdrawDestination({});
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      selectedPaymentOption === "new" 
                        ? "bg-[#5C4033] text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <FaPlus className="text-xs" /> Add New
                  </button>
                </div>
              </div>

              {/* Saved UPI Details */}
              {withdrawMethod === "upi" && selectedPaymentOption === "saved" && savedBankDetails?.upiId && (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCheckCircle className="text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-700">Saved UPI ID</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{savedBankDetails.upiId}</p>
                </div>
              )}

              {/* Saved Bank Details */}
              {withdrawMethod === "bank" && selectedPaymentOption === "saved" && savedBankDetails?.accountNumber && (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCheckCircle className="text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-700">Saved Bank Account</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Holder:</span>
                      <span className="font-semibold text-gray-900">{savedBankDetails.accountHolderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-semibold text-gray-900">
                        ****{savedBankDetails.accountNumber?.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IFSC Code:</span>
                      <span className="font-semibold text-gray-900">{savedBankDetails.ifscCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-semibold text-gray-900">{savedBankDetails.bankName}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* No Saved Details Message */}
              {selectedPaymentOption === "saved" && 
                ((withdrawMethod === "upi" && !savedBankDetails?.upiId) || 
                 (withdrawMethod === "bank" && !savedBankDetails?.accountNumber)) && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <p className="text-sm text-amber-700">
                    No saved {withdrawMethod === "upi" ? "UPI ID" : "bank account"} found. Please add new details below.
                  </p>
                </div>
              )}

              {/* New UPI Input */}
              {withdrawMethod === "upi" && (selectedPaymentOption === "new" || !savedBankDetails?.upiId) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
                  <input
                    type="text"
                    value={withdrawDestination.upi || ""}
                    onChange={e => setWithdrawDestination({ upi: e.target.value })}
                    placeholder="yourname@upi"
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  />
                </div>
              )}

              {/* New Bank Details Input */}
              {withdrawMethod === "bank" && (selectedPaymentOption === "new" || !savedBankDetails?.accountNumber) && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={withdrawDestination.name || ""}
                    onChange={e => setWithdrawDestination({ ...withdrawDestination, name: e.target.value })}
                    placeholder="Beneficiary Name"
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  />
                  <input
                    type="text"
                    value={withdrawDestination.accountNumber || ""}
                    onChange={e => setWithdrawDestination({ ...withdrawDestination, accountNumber: e.target.value })}
                    placeholder="Account Number"
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  />
                  <input
                    type="text"
                    value={withdrawDestination.ifsc || ""}
                    onChange={e => setWithdrawDestination({ ...withdrawDestination, ifsc: e.target.value.toUpperCase() })}
                    placeholder="IFSC Code"
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  />
                  <input
                    type="text"
                    value={withdrawDestination.bankName || ""}
                    onChange={e => setWithdrawDestination({ ...withdrawDestination, bankName: e.target.value })}
                    placeholder="Bank Name & Branch"
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  />
                  <input
                    type="text"
                    value={withdrawDestination.purpose || ""}
                    onChange={e => setWithdrawDestination({ ...withdrawDestination, purpose: e.target.value })}
                    placeholder="Purpose of Transfer"
                    className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  />
                </div>
              )}

              <button
                onClick={requestWithdrawal}
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg shadow-amber-500/20 transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Request Withdrawal"}
              </button>
              <p className="text-xs text-gray-500 text-center">Minimum withdrawal: ₹100. Admin approval required.</p>
            </div>
          </div>
        </div>

      {/* Referral Program Card */}
      {showReferral && referralData && (
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Referral Program</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Referral Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralData.referralCode || wallet?.referralCode || ""}
                  readOnly
                  className="flex-1 border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 font-bold text-center tracking-widest"
                />
                <button
                  onClick={copyReferralCode}
                  className="px-4 py-3 bg-[#5C4033] hover:bg-[#4b3327] text-white rounded-2xl transition-all duration-300"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Referrals</label>
              <h4 className="text-3xl font-bold text-[#5C4033]">{referralData.totalReferrals || 0}</h4>
            </div>
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Referral Earnings</label>
              <h4 className="text-3xl font-bold text-emerald-500">₹{referralData.totalEarnings || 0}</h4>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-2xl">
            <p className="text-sm text-blue-700">
              Share your referral code with friends. When they sign up and make their first purchase, you earn ₹50 + 100 Art Coins!
            </p>
          </div>
        </div>
      )}

      {/* Art Coins Benefits */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Art Coins Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">How to Earn</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500 flex-shrink-0" /> {coinSetting.transactionReward || 10} coins per transaction</li>
              {showReferral && <li className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500 flex-shrink-0" /> {referralSettings?.buyerReferredCoinsReward || 100} coins on referral signup</li>}
              <li className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500 flex-shrink-0" /> Bonus coins on special offers</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">How to Use</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500 flex-shrink-0" /> 1 coin = {coinSetting.currency} {(coinSetting.coinValue || 0).toFixed(2)} discount</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500 flex-shrink-0" /> Max 20% discount per order</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500 flex-shrink-0" /> Use during checkout</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl">
            <h6 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaGift className="text-[#F36F21]" /> Benefit Preview
            </h6>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction Reward:</span>
                <strong className="text-[#5C4033]">{coinSetting.transactionReward || 10} Coins</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Referral Reward:</span>
                <strong className="text-[#5C4033]">{referralSettings?.buyerReferrerCoinsReward || 0} Coins</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Signup Bonus:</span>
                <strong className="text-[#5C4033]">{coinSetting[`${userType?.toLowerCase()}SignupBonus`] || 0} Coins</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions & History Tabs */}
      <div ref={transactionsRef} className="bg-white rounded-[2rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500 overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all focus:outline-none duration-300 ${activeTab === 'transactions' ? 'text-[#5C4033] border-b-4 border-[#5C4033] bg-[#5C4033]/5' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all focus:outline-none duration-300 ${activeTab === 'withdrawals' ? 'text-[#5C4033] border-b-4 border-[#5C4033] bg-[#5C4033]/5' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Withdrawal History
          </button>
          {showReferral && (
            <button
              onClick={() => setActiveTab('referral')}
              className={`flex-1 py-4 px-6 text-sm font-semibold transition-all focus:outline-none duration-300 ${activeTab === 'referral' ? 'text-[#5C4033] border-b-4 border-[#5C4033] bg-[#5C4033]/5' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Referral Program
            </button>
          )}
        </div>

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h4 className="font-semibold text-gray-900">Recent Transactions</h4>
                <div className="flex items-center gap-4">
                  <select
                    value={categoryFilter}
                    onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
                    className="border border-gray-200 px-3 py-2 rounded-xl text-sm font-medium"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => exportTransactions('csv')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <FaDownload /> Export CSV
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <select
                      value={pageSize}
                      onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                      className="border border-gray-200 px-3 py-2 rounded-xl text-sm"
                    >
                      {[5, 10, 15, 20, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                    <span className="text-sm text-gray-500">entries</span>
                  </div>
                </div>
              </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">#</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Purpose</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Cumulative</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Receipt</th>
                    </tr>
                </thead>
                <tbody>
                  {displayedTransactions.map((txn, idx) => {
                    const cat = categorize(txn);
                    const cumVal = cumulativeMap[txn._id];
                    return (
                    <tr key={txn._id || idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-600">{(page - 1) * pageSize + idx + 1}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categoryColors[cat]}`}>
                          {categoryLabels[cat]}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${txn.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {txn.type === 'credit' ? <FaArrowDown className="text-[10px]" /> : <FaArrowUp className="text-[10px]" />}
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold">
                        <span className={txn.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}>
                          {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{txn.purpose}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          txn.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                          txn.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-bold" style={{ color: cumVal >= 0 ? '#059669' : '#dc2626' }}>
                        ₹{Math.abs(cumVal || 0).toLocaleString()}
                        {cumVal < 0 ? ' (-)' : ''}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">{txn.createdAt ? new Date(txn.createdAt).toLocaleString() : "-"}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => downloadReceipt(txn._id)}
                          className="p-2 text-gray-400 hover:text-[#5C4033] hover:bg-[#5C4033]/10 rounded-xl transition-all"
                        >
                          <FaDownload />
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                  {displayedTransactions.length === 0 && (
                    <tr>
                      <td colSpan="9" className="py-12 text-center text-gray-500">No transactions yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5) {
                      if (page > 3) pageNum = page - 2 + i;
                      if (page > totalPages - 2) pageNum = totalPages - 4 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === pageNum ? 'bg-[#5C4033] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">#</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Method</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Requested</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Processed</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Admin Note</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w, idx) => (
                    <tr key={w._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-600">{idx + 1}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">₹{w.amount}</td>
                      <td className="py-4 px-4 text-sm text-gray-600 uppercase">{w.method}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          w.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          w.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                          w.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">{new Date(w.createdAt).toLocaleString()}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{w.processedAt ? new Date(w.processedAt).toLocaleString() : '-'}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{w.adminNote || '-'}</td>
                    </tr>
                  ))}
                  {withdrawals.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-500">No withdrawal requests yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Referral Tab */}
        {showReferral && activeTab === 'referral' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Your Referral Code */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
                <h5 className="font-semibold text-gray-900 mb-4">Your Referral Code</h5>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={wallet?.referralCode || "Not Generated"}
                    readOnly
                    className="flex-1 border border-gray-200 px-4 py-3 rounded-xl bg-white font-bold text-center tracking-widest text-lg"
                  />
                  <button
                    onClick={copyReferralCode}
                    disabled={!wallet?.referralCode}
                    className="px-6 py-3 bg-[#5C4033] hover:bg-[#4b3327] text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                  >
                    <FaCopy />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">Share this code with friends to earn rewards!</p>
              </div>

              {/* Enter Referral Code */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
                <h5 className="font-semibold text-gray-900 mb-4">Enter Referral Code</h5>
                {wallet?.referredBy ? (
                  <div className="bg-emerald-100 text-emerald-700 p-4 rounded-xl flex items-center gap-2">
                    <FaCheckCircle />
                    <span>You joined using code: <strong>{wallet.referredBy}</strong></span>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={referralCodeInput}
                        onChange={e => setReferralCodeInput(e.target.value.toUpperCase())}
                        placeholder="Enter friend's code"
                        maxLength={10}
                        className="flex-1 border border-gray-200 px-4 py-3 rounded-xl bg-white"
                      />
                      <button
                        onClick={applyReferralCode}
                        disabled={isApplyingReferral || !referralCodeInput.trim()}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">Enter a referral code to get bonus Art Coins!</p>
                  </>
                )}
              </div>
            </div>

            {/* Referral Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#5C4033] to-[#3d2a22] p-6 rounded-2xl text-white text-center">
                <h3 className="text-3xl font-bold">{referralData?.totalReferrals || wallet?.referralCount || 0}</h3>
                <p className="text-white/70 mt-1">Friends Referred</p>
              </div>
              <div className="bg-gradient-to-br from-[#F36F21] to-[#d55a10] p-6 rounded-2xl text-white text-center">
                <h3 className="text-3xl font-bold">₹{referralData?.totalEarnings || wallet?.referralEarnings || 0}</h3>
                <p className="text-white/70 mt-1">Referral Earnings</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white text-center">
                <h3 className="text-2xl font-bold">
                  {referralSettings ? `₹${referralSettings.referrerCash} + ${referralSettings.referrerCoins} Coins` : "₹50 + 100 Coins"}
                </h3>
                <p className="text-white/70 mt-1">Per Referral Reward</p>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-blue-50 p-6 rounded-2xl">
              <h5 className="font-semibold text-blue-900 mb-3">How Referrals Work</h5>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2"><FaCheckCircle className="mt-0.5 flex-shrink-0" /> Share your referral code with friends</li>
                <li className="flex items-start gap-2"><FaCheckCircle className="mt-0.5 flex-shrink-0" /> When they sign up and enter your code, both of you get rewards</li>
                <li className="flex items-start gap-2"><FaCheckCircle className="mt-0.5 flex-shrink-0" /> You earn {referralSettings ? `₹${referralSettings.referrerCash} cash + ${referralSettings.referrerCoins} Art Coins` : "₹50 cash + 100 Art Coins"} per successful referral</li>
                <li className="flex items-start gap-2"><FaCheckCircle className="mt-0.5 flex-shrink-0" /> Your friend gets {referralSettings ? `${referralSettings.referredCoins} Art Coins ${referralSettings.referredCash > 0 ? `+ ₹${referralSettings.referredCash} cash` : ''}` : "50 Art Coins"} as a welcome bonus</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerWallet;
