import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const WalletBalance = ({ userId, userType }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchWallet = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/wallet/${userId}`);
      setWallet(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const createRes = await axios.post(`${API_URL}/api/wallet/ensure/${userId}`);
        setWallet(createRes.data);
      } else {
        console.error("Error fetching wallet:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [userId]);

  if (loading) {
    return (
      <div className="card">
        <div className="body">
          <div className="text-center">Loading wallet...</div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="card">
        <div className="body">
          <div className="text-center text-danger">Wallet not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="header">
        <h2>Wallet Balance</h2>
      </div>
      <div className="body">
        <div className="row">
          <div className="col-md-6">
            <div className="text-center">
              <h3 className="text-primary">₹{wallet.balance}</h3>
              <small className="text-muted">Available Balance</small>
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-center">
              <h4 className="text-success">{wallet.artCoins}</h4>
              <small className="text-muted">Art Coins</small>
            </div>
          </div>
        </div>
        
        {(userType === 'Artist' || userType === 'Seller') && wallet.pendingWithdrawal > 0 && (
          <div className="row mt-2">
            <div className="col-12">
              <div className="text-center">
                <h5 className="text-warning">₹{wallet.pendingWithdrawal}</h5>
                <small className="text-muted">Pending Withdrawal</small>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mt-3">
          <Link 
            to={`/${userType.toLowerCase()}/wallet`} 
            className="btn btn-primary btn-sm"
          >
            View Wallet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;



