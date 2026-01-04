import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ArtCoinsRedemption = ({ orderAmount, onDiscountApplied, userId }) => {
  const [wallet, setWallet] = useState(null);
  const [coinsToRedeem, setCoinsToRedeem] = useState(0);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useCoins, setUseCoins] = useState(false);
  const [artCoinValue, setArtCoinValue] = useState(0.10);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCoinValue = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/wallet/art-coins/value`);
        if (res.data && res.data.coinValue) {
          setArtCoinValue(res.data.coinValue);
        }
      } catch (err) {
        console.error("Error fetching coin value:", err);
      }
    };
    fetchCoinValue();
  }, [API_URL]);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${API_URL}/api/wallet/${userId}`);
        setWallet(res.data);
      } catch (err) {
        console.error("Error fetching wallet:", err);
      }
    };
    fetchWallet();
  }, [userId, API_URL]);

  useEffect(() => {
    if (!useCoins || !wallet || coinsToRedeem <= 0) {
      setDiscountInfo(null);
      if (onDiscountApplied) onDiscountApplied(0, 0);
      return;
    }

    const calculateDiscount = async () => {
      try {
        const res = await axios.post(`${API_URL}/api/wallet/art-coins/calculate-discount/${userId}`, {
          coinsToRedeem,
          orderAmount
        });
        setDiscountInfo(res.data);
        if (onDiscountApplied) {
          onDiscountApplied(res.data.discountAmount, res.data.coinsToUse);
        }
      } catch (err) {
        console.error("Error calculating discount:", err);
      }
    };

    const debounce = setTimeout(calculateDiscount, 300);
    return () => clearTimeout(debounce);
  }, [coinsToRedeem, orderAmount, useCoins, userId, API_URL, wallet, onDiscountApplied]);

  const handleMaxCoins = () => {
    if (!wallet) return;
    const maxDiscountCoins = Math.ceil((orderAmount * 0.20) / artCoinValue);
    const useableCoins = Math.min(wallet.artCoins, maxDiscountCoins);
    setCoinsToRedeem(useableCoins);
  };

  if (!wallet) return null;

  const maxDiscount = orderAmount * 0.20;
  const potentialDiscount = Math.min(wallet.artCoins * artCoinValue, maxDiscount);

  return (
    <div className="card mb-3">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <span>
          <i className="fa fa-coins mr-2"></i>
          Use Art Coins
        </span>
        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            id="useArtCoins"
            checked={useCoins}
            onChange={(e) => {
              setUseCoins(e.target.checked);
              if (!e.target.checked) {
                setCoinsToRedeem(0);
                setDiscountInfo(null);
                if (onDiscountApplied) onDiscountApplied(0, 0);
              }
            }}
          />
          <label className="custom-control-label" htmlFor="useArtCoins"></label>
        </div>
      </div>
      
      {useCoins && (
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <span>Available Art Coins:</span>
            <strong>{wallet.artCoins} coins</strong>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <span>Coin Value:</span>
            <span>1 coin = ₹{artCoinValue}</span>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <span>Max Discount (20%):</span>
            <span>₹{maxDiscount.toFixed(2)}</span>
          </div>

          <div className="form-group">
            <label>Coins to Redeem</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={coinsToRedeem}
                onChange={(e) => setCoinsToRedeem(Math.max(0, Math.min(wallet.artCoins, parseInt(e.target.value) || 0)))}
                max={wallet.artCoins}
                min={0}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleMaxCoins}
                >
                  Max
                </button>
              </div>
            </div>
          </div>

          <input
            type="range"
            className="custom-range mb-3"
            min="0"
            max={wallet.artCoins}
            value={coinsToRedeem}
            onChange={(e) => setCoinsToRedeem(parseInt(e.target.value))}
          />

          {discountInfo && (
            <div className="alert alert-success mb-0">
              <div className="d-flex justify-content-between">
                <span>Coins to Use:</span>
                <strong>{discountInfo.coinsToUse}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Discount:</span>
                <strong className="text-success">-₹{discountInfo.discountAmount.toFixed(2)}</strong>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between">
                <span>Final Amount:</span>
                <strong>₹{discountInfo.finalAmount.toFixed(2)}</strong>
              </div>
            </div>
          )}

          {wallet.artCoins === 0 && (
            <div className="alert alert-info mb-0">
              You don't have any Art Coins. Complete transactions to earn coins!
            </div>
          )}
        </div>
      )}

      {!useCoins && wallet.artCoins > 0 && (
        <div className="card-body">
          <small className="text-muted">
            You have <strong>{wallet.artCoins} coins</strong> worth up to <strong>₹{potentialDiscount.toFixed(2)}</strong> discount.
            Enable to apply.
          </small>
        </div>
      )}
    </div>
  );
};

export default ArtCoinsRedemption;
