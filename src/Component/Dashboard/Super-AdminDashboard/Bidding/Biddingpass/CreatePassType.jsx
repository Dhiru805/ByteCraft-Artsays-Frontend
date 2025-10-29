import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postAPI from '../../../../../api/postAPI';
import { toast } from 'react-toastify';

const CreatePassType = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        validityPeriod: '',
        productUploadLimit: '',
        basePriceRange: '',
        bidVisibility: 'Public',
        biddingAnalytics: 'None',
        addonAccess: [],
        supportPriority: 'Standard',
        refundPolicy: 'No refunds',
        earlyRenewalBonus: '',
        customBidTimeControl: '',
        exclusiveAuctionsAccess: false,
        dashboardFeatures: '',
        pricing: '',
        productUploadInfinite: false,
    });

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox' && name === 'exclusiveAuctionsAccess') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'checkbox') {
            const addon = value;
            setFormData(prev => {
                const exists = prev.addonAccess.includes(addon);
                return {
                    ...prev,
                    addonAccess: exists ? prev.addonAccess.filter(a => a !== addon) : [...prev.addonAccess, addon]
                };
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const createPassType = async (e) => {
        e.preventDefault();
        try {
            const res = await postAPI('/api/bidding/passes', formData, {}, true);
            if (!res?.hasError) {
                toast.success('Pass created');
                navigate('/super-admin/bidding/pass-table');
            } else {
                toast.error(res?.message || 'Failed to create pass');
            }
        } catch (e) {
            toast.error('Failed to create pass');
        }
    };

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Create Bidding Pass</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item" onClick={() => navigate('/super-admin/bidding/pass-table')} style={{ cursor: 'pointer' }}>Bidding Pass</li>
                            <li className="breadcrumb-item">Create</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row clearfix mt-3">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="header"><h5>Pass Details</h5></div>
                        <div className="body">
                            <form onSubmit={createPassType}>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label>Pass Name</label>
                                        <input className="form-control" name="name" value={formData.name} onChange={handleFormChange} required />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label>Validity Period</label>
                                        <input className="form-control" name="validityPeriod" value={formData.validityPeriod} onChange={handleFormChange} placeholder="e.g., 30 days" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Product Upload Limit (for Bidding)</label>
                                        <div className="d-flex align-items-center">
                                            <input className="form-control" name="productUploadLimit" value={formData.productUploadLimit} onChange={handleFormChange} disabled={formData.productUploadInfinite} />
                                            <div className="ml-3 d-flex align-items-center">
                                                <input type="checkbox" id="uploadInfinite" name="productUploadInfinite" checked={formData.productUploadInfinite} onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setFormData(prev => ({ ...prev, productUploadInfinite: checked, productUploadLimit: checked ? 'Infinite' : '' }));
                                                }} />
                                                <label className="ml-1 mb-0" htmlFor="uploadInfinite">Infinite</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label>Base Price Range Allowed</label>
                                        <input className="form-control" name="basePriceRange" value={formData.basePriceRange} onChange={handleFormChange} placeholder="e.g., 1000-5000" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label>Bid Visibility</label>
                                        <select className="form-control" name="bidVisibility" value={formData.bidVisibility} onChange={handleFormChange}>
                                            <option>Public</option>
                                            <option>Private</option>
                                            <option>Premium Only</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label>Bidding Analytics Access</label>
                                        <select className="form-control" name="biddingAnalytics" value={formData.biddingAnalytics} onChange={handleFormChange}>
                                            <option>None</option>
                                            <option>Basic</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Add-on Purchase Access</label>
                                        <div className="d-flex align-items-center">
                                            <div className="mr-3">
                                                <input type="checkbox" id="addonFeatured" value="Featured Ads" checked={formData.addonAccess.includes('Featured Ads')} onChange={handleFormChange} />
                                                <label className="ml-1" htmlFor="addonFeatured">Featured Ads</label>
                                            </div>
                                            <div className="mr-3">
                                                <input type="checkbox" id="addonBoost" value="Boost" checked={formData.addonAccess.includes('Boost')} onChange={handleFormChange} />
                                                <label className="ml-1" htmlFor="addonBoost">Boost</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Support Priority</label>
                                        <select className="form-control" name="supportPriority" value={formData.supportPriority} onChange={handleFormChange}>
                                            <option>Standard</option>
                                            <option>Priority</option>
                                            <option>24x7</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Refund / Cancellation</label>
                                        <input className="form-control" name="refundPolicy" value={formData.refundPolicy} onChange={handleFormChange} placeholder="e.g., Refund within 7 days" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Early Renewal Bonus</label>
                                        <input className="form-control" name="earlyRenewalBonus" value={formData.earlyRenewalBonus} onChange={handleFormChange} placeholder="e.g., +5 days on renewal" />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Custom Bid Time Control</label>
                                        <input className="form-control" name="customBidTimeControl" value={formData.customBidTimeControl} onChange={handleFormChange} placeholder="e.g., set min/max bid time" />
                                    </div>
                                    <div className="col-md-6 mb-3 d-flex align-items-center">
                                        <input type="checkbox" id="exclusiveAuctionsAccess" name="exclusiveAuctionsAccess" checked={formData.exclusiveAuctionsAccess} onChange={handleFormChange} />
                                        <label className="ml-2 mb-0" htmlFor="exclusiveAuctionsAccess">Access to “Exclusive Auctions” (Premium Events)</label>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Dashboard Features</label>
                                        <input className="form-control" name="dashboardFeatures" value={formData.dashboardFeatures} onChange={handleFormChange} placeholder="e.g., advanced insights, alerts" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Pricing</label>
                                        <input className="form-control" name="pricing" value={formData.pricing} onChange={handleFormChange} placeholder="e.g., 1999 INR" />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button type="button" className="btn btn-light" onClick={() => navigate('/super-admin/bidding/pass-table')}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create Pass</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePassType;



