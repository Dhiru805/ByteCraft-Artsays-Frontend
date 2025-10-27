import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const WalletPayment = ({ amount, purpose, onSuccess, onCancel, orderId }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingBalance, setCheckingBalance] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wallet/${userId}`);
      setWallet(res.data);
    } catch (err) {
      console.error("Error fetching wallet:", err);
    } finally {
      setCheckingBalance(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!wallet) return;
    
    if (wallet.balance < amount) {
      toast.error("Insufficient wallet balance");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/spend/${userId}`, {
        amount,
        purpose: purpose || "Purchase Payment"
      });
      
      toast.success("Payment successful!");
      onSuccess && onSuccess(res.data);
    } catch (err) {
      console.error("Payment failed:", err);
      toast.error("Payment failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEscrowPayment = async () => {
    if (!wallet) return;
    
    if (wallet.balance < amount) {
      toast.error("Insufficient wallet balance");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/wallet/escrow/hold`, {
        buyerId: userId,
        amount,
        orderId: orderId || `order_${Date.now()}`
      });
      
      toast.success("Payment held in escrow!");
      onSuccess && onSuccess(res.data);
    } catch (err) {
      console.error("Escrow payment failed:", err);
      toast.error("Escrow payment failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (checkingBalance) {
    return (
      <div className="modal-body text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2">Checking wallet balance...</p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="modal-body text-center">
        <div className="alert alert-danger">
          <h5>Wallet Not Found</h5>
          <p>Unable to access your wallet. Please try again later.</p>
          <button className="btn btn-secondary" onClick={onCancel}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const insufficientBalance = wallet.balance < amount;

  return (
    <div className="modal-body">
      <div className="row">
        <div className="col-md-6">
          <h5>Payment Details</h5>
          <table className="table table-sm">
            <tbody>
              <tr>
                <td>Amount:</td>
                <td><strong>₹{amount}</strong></td>
              </tr>
              <tr>
                <td>Purpose:</td>
                <td>{purpose || "Purchase Payment"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h5>Wallet Balance</h5>
          <div className="text-center">
            <h3 className={`${insufficientBalance ? 'text-danger' : 'text-success'}`}>
              ₹{wallet.balance}
            </h3>
            <small className="text-muted">Available Balance</small>
          </div>
        </div>
      </div>

      {insufficientBalance && (
        <div className="alert alert-warning mt-3">
          <h6>Insufficient Balance</h6>
          <p>You need ₹{amount - wallet.balance} more to complete this payment.</p>
          <a href={`/${localStorage.getItem('userType').toLowerCase()}/wallet`} className="btn btn-primary btn-sm">
            Add Money to Wallet
          </a>
        </div>
      )}

      <div className="modal-footer">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        
        {!insufficientBalance && (
          <>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleWalletPayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
            
            {orderId && (
              <button 
                type="button" 
                className="btn btn-warning" 
                onClick={handleEscrowPayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay via Escrow'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WalletPayment;



