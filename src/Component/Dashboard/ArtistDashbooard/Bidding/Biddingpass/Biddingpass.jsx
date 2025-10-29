import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getAPI from '../../../../../api/getAPI';
import postAPI from '../../../../../api/postAPI';
import { toast } from 'react-toastify';

const BiddingPass = () => {
  const navigate = useNavigate();
  const [passes, setPasses] = useState([]);
  const [hasActive, setHasActive] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);
  const userId = localStorage.getItem('userId');
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, o] = await Promise.all([
          getAPI('/api/bidding/passes', {}, true),
          getAPI(`/api/bidding/pass-orders/my?userId=${userId}`, {}, true)
        ]);
        setPasses(Array.isArray(p?.data?.data) ? p.data.data : []);
        const active = Array.isArray(o?.data?.data) && o.data.data.some(x => x.active);
        setHasActive(!!active);
      } catch {
        setPasses([]);
      }
    };
    load();
  }, []);

  const purchase = async () => {
    if (!selectedPass) { toast.info('Select a pass'); return; }
    if (hasActive) { toast.info('You already have an active pass.'); return; }
    try {
      const res = await postAPI('/api/bidding/pass-orders', { passId: selectedPass, userId }, {}, true);
      if (!res?.hasError) { toast.success('Pass purchased'); navigate('/artist/bidding-pass-table'); } else { toast.error(res?.message || 'Failed'); }
    } catch { toast.error('Failed'); }
  };

  const openInfo = () => {
    if (!selectedPass) { toast.info('Select a pass to view details'); return; }
    setShowInfo(true);
  };
  const closeInfo = () => setShowInfo(false);

  return (
    <div className="container-fluid mt-3">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Choose Bidding Pass</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/artist/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Bidding Pass</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse">
              <div className="page_action">
                <button type="button" className="btn btn-secondary mr-2" onClick={openInfo}>
                  <i className="fa fa-info-circle"></i> Pass Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        {passes.map((pass, index) => {
          const isActive = selectedPass === pass._id;
          return (
            <div key={pass._id || index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className={`card position-relative ${isActive ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedPass(pass._id)}>
                <div className="d-flex justify-content-between align-items-center px-4 pt-4 pb-2">
                  <input type="radio" name="passPlan" checked={isActive} onChange={() => setSelectedPass(pass._id)} className="form-check-input" style={{ width: '20px', height: '20px', marginLeft: '1px', cursor: 'pointer' }} />
                  <label className="form-check-label fw-bold mb-0" style={{ fontSize: '2rem', marginLeft: '50px', cursor: 'pointer' }}>{pass.name}</label>
                </div>

                <ul className={`pricing body ${isActive ? 'active' : ''}`}>
                  <li><strong>Validity:</strong> {pass.validityPeriod || '-'}</li>
                  <li><strong>Upload limit:</strong> {pass.productUploadLimit || '-'}</li>
                  <li><strong>Bid Visibility:</strong> {pass.bidVisibility || '-'}</li>
                  <li><strong>Support:</strong> {pass.supportPriority || '-'}</li>
                </ul>
                <div className="text-center mb-3">
                  <h3 style={{ fontSize: '2rem', margin: 0 }}>{pass.pricing || '-'}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showInfo && (() => {
        const pass = passes.find(p => p._id === selectedPass);
        if (!pass) return null;
        return (
          <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} onClick={closeInfo}>
            <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Pass Details - {pass.name}</h5>
                  <button type="button" className="close" onClick={closeInfo}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6"><strong>Validity:</strong> {pass.validityPeriod || '-'}</div>
                    <div className="col-md-6"><strong>Product Upload Limit:</strong> {pass.productUploadLimit || '-'}</div>
                    <div className="col-md-6"><strong>Base Price Range:</strong> {pass.basePriceRange || '-'}</div>
                    <div className="col-md-6"><strong>Bid Visibility:</strong> {pass.bidVisibility || '-'}</div>
                    <div className="col-md-6"><strong>Bidding Analytics:</strong> {pass.biddingAnalytics || '-'}</div>
                    <div className="col-md-6"><strong>Add-on Access:</strong> {(pass.addonAccess && pass.addonAccess.length) ? pass.addonAccess.join(', ') : '-'}</div>
                    <div className="col-md-6"><strong>Support Priority:</strong> {pass.supportPriority || '-'}</div>
                    <div className="col-md-6"><strong>Refund / Cancellation:</strong> {pass.refundPolicy || '-'}</div>
                    <div className="col-md-6"><strong>Early Renewal Bonus:</strong> {pass.earlyRenewalBonus || '-'}</div>
                    <div className="col-md-6"><strong>Custom Bid Time Control:</strong> {pass.customBidTimeControl || '-'}</div>
                    <div className="col-md-6"><strong>Exclusive Auctions Access:</strong> {pass.exclusiveAuctionsAccess ? 'Yes' : 'No'}</div>
                    <div className="col-md-6"><strong>Dashboard Features:</strong> {pass.dashboardFeatures || '-'}</div>
                    <div className="col-md-12 mt-2"><strong>Pricing:</strong> {pass.pricing || '-'}</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeInfo}>Close</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="pt-2 pb-4">
        <button type="button" className="btn btn-secondary" disabled={hasActive || !selectedPass} onClick={purchase}>
          <i className="bi-gem pr-1"></i> {hasActive ? 'Active pass in use' : 'Purchase Pass'}
        </button>
      </div>
    </div>
  );
};

export default BiddingPass;
