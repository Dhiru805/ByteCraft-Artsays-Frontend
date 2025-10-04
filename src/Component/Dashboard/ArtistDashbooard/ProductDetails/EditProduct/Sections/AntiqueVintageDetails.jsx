
import React, { useEffect, useState } from "react";
import getAPI from "../../../../../../api/getAPI";

const AntiqueVintageDetails = ({
    formData,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    profileData
}) => {

 

    const originOptions = [
        { value: 'france', label: 'France' },
        { value: 'japan', label: 'Japan' },
        { value: 'india', label: 'India' },
        { value: 'china', label: 'China' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'usa', label: 'United States' },

    ];

    const periodEraOptions = [
        { value: 'victorian', label: 'Victorian' },
        { value: 'art_deco', label: 'Art Deco' },
        { value: 'ming', label: 'Ming Dynasty' },
        { value: 'edwardian', label: 'Edwardian' },
        { value: 'georgian', label: 'Georgian' },

    ];

    const conditionOptions = [
        { value: 'new', label: 'New' },
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' },
    ];

    const originalReproductionOptions = [
        { value: 'original', label: 'Original' },
        { value: 'replica', label: 'Replica' },
        { value: 'reproduction', label: 'Reproduction' },
    ];


    return (
        <>
            <h4 className="mb-3">Antique & Vintage Details</h4>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="originRegion">Origin / Region *</label>
                        <select
                            id="originRegion"
                            name="originRegion"
                            className="form-control"
                            value={formData.originRegion?.value || ''}
                            onChange={(e) => {
                                const selected = originOptions.find(
                                    opt => opt.value === e.target.value
                                );
                                handleSelectChange('originRegion', selected);
                            }}
                            disabled={isSubmitting}
                            required
                        >
                            <option value="">Select Origin/Region</option>
                            {originOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="periodEra">Period / Era *</label>
                        <select
                            id="periodEra"
                            name="periodEra"
                            className="form-control"
                            value={formData.periodEra?.value || ''}
                            onChange={(e) => {
                                const selected = periodEraOptions.find(
                                    opt => opt.value === e.target.value
                                );
                                handleSelectChange('periodEra', selected);
                            }}
                            disabled={isSubmitting}
                            required
                        >
                            <option value="">Select Period/Era</option>
                            {periodEraOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="antiqueCondition">Condition *</label>
                        <select
                            id="antiqueCondition"
                            name="antiqueCondition"
                            className="form-control"
                            value={formData.antiqueCondition?.value || ''}
                            onChange={(e) => {
                                const selected = conditionOptions.find(
                                    opt => opt.value === e.target.value
                                );
                                handleSelectChange('antiqueCondition', selected);
                            }}
                            disabled={isSubmitting}
                            required
                        >
                            <option value="">Select Condition</option>
                            {conditionOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>



            </div>

            <div className="form-group">
                <label htmlFor="restorationHistory">Restoration History</label>
                <textarea
                    id="restorationHistory"
                    name="restorationHistory"
                    className="form-control"
                    placeholder="Details about any restorations, modifications, or repairs"
                    rows="3"
                    value={formData.restorationHistory}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-group">
                <label htmlFor="provenanceHistory">Provenance (Ownership History)</label>
                <textarea
                    id="provenanceHistory"
                    name="provenanceHistory"
                    className="form-control"
                    placeholder="List of previous owners, museums, or galleries"
                    rows="3"
                    value={formData.provenanceHistory}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />
            </div>

            <h5 className="mt-4 mb-3">Current Location</h5>
            <div className="row">
                <div className="col-md-6 form-group">
                    <label htmlFor="addressLine1">Address Line 1</label>
                    <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        className="form-control"
                        placeholder="Street address, P.O. box"
                        value={formData.addressLine1 || profileData.address?.line1 || ''}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        
                    />
                </div>

                <div className="col-md-6 form-group">
                    <label htmlFor="addressLine2">Address Line 2</label>
                    <input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        className="form-control"
                        placeholder="Apartment, suite, unit, building, floor"
                        value={formData.addressLine2 || profileData.address?.line2 || ''}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="col-md-6 form-group">
                    <label htmlFor="landmark">Landmark</label>
                    <input
                        type="text"
                        id="landmark"
                        name="landmark"
                        className="form-control"
                        placeholder="Nearby recognizable location"
                        value={formData.landmark || profileData.address?.landmark || ''}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="col-md-6 form-group">
                    <label htmlFor="city">City </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        className="form-control"
                        placeholder="City name"
                        value={formData.city || profileData.address?.city || ''}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                     
                    />
                </div>

                <div className="col-md-6 form-group">
                    <label htmlFor="state">State/Province </label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        className="form-control"
                        placeholder="State or province"
                        value={formData.state || profileData.address?.state || ''}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    
                    />
                </div>

                <div className="col-md-6 form-group">
                    <label htmlFor="country">Country </label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        className="form-control"
                        placeholder="Country name"
                        value={formData.country || profileData.address?.country || ''}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    
                    />
                </div>

                <div className="col-md-6 form-group">
                    <label htmlFor="pincode">Pincode/Zipcode </label>
                    <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        className="form-control"
                        placeholder="Postal code"
                        value={formData.pincode || profileData.address?.pincode || ''}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        
                    />
                </div>
            </div>

            <h5 className="mt-4 mb-3">Detailed Product Attributes</h5>
            <div className="form-group">
                <label htmlFor="engravingMarkings">Engraving / Markings</label>
                <textarea
                    id="engravingMarkings"
                    name="engravingMarkings"
                    className="form-control"
                    placeholder="Details about any unique engravings, stamps, or markings"
                    rows="3"
                    value={formData.engravingMarkings}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-group">
                <label htmlFor="patinaWear">Patina / Wear & Tear</label>
                <textarea
                    id="patinaWear"
                    name="patinaWear"
                    className="form-control"
                    placeholder="Visible aging effects (e.g., rust, fading, cracks)"
                    rows="3"
                    value={formData.patinaWear}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />
            </div>
            <div className="col-md-6 form-group">
                <label className="d-flex align-items-center">
                    <span className="mr-2">Is this item handmade?</span>
                    <div className="custom-control custom-switch">
                        <input
                            type="checkbox"
                            id="isHandmade"
                            name="isHandmade"
                            className="custom-control-input"
                            checked={formData.isHandmade || false}
                            onChange={(e) =>
                                handleInputChange({ target: { name: "isHandmade", value: e.target.checked } })
                            }
                            disabled={isSubmitting}
                            required
                        />
                        <label className="custom-control-label" htmlFor="isHandmade">
                            {formData.isHandmade ? "Yes" : "No"}
                        </label>
                    </div>
                </label>
            </div>

            <div className="form-group">
                <label htmlFor="originalReproduction">Original vs. Reproduction *</label>
                <select
                    id="originalReproduction"
                    name="originalReproduction"
                    className="form-control"
                    value={formData.originalReproduction?.value || ''}
                    onChange={(e) => {
                        const selected = originalReproductionOptions.find(
                            opt => opt.value === e.target.value
                        );
                        handleSelectChange('originalReproduction', selected);
                    }}
                    disabled={isSubmitting}
                    required
                >
                    <option value="">Select</option>
                    {originalReproductionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="museumExhibitionHistory">Museum / Exhibition History</label>
                <textarea
                    id="museumExhibitionHistory"
                    name="museumExhibitionHistory"
                    className="form-control"
                    placeholder="If displayed in any exhibitions or museums"
                    rows="3"
                    value={formData.museumExhibitionHistory}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />
            </div>

            <h5 className="mt-4 mb-3">Special Features & Add-Ons</h5>
            <div className="form-group">
                <label className="d-flex align-items-center">
                    <span className="mr-2">Custom Engraving Available?</span>
                    <div className="custom-control custom-switch">
                        <input
                            type="checkbox"
                            id="customEngravingAvailable"
                            name="customEngravingAvailable"
                            className="custom-control-input"
                            checked={formData.customEngravingAvailable || false}
                            onChange={(e) =>
                                handleInputChange({
                                    target: {
                                        name: "customEngravingAvailable",
                                        value: e.target.checked,
                                    },
                                })
                            }
                            disabled={isSubmitting}
                        />
                        <label className="custom-control-label" htmlFor="customEngravingAvailable">
                            {formData.customEngravingAvailable ? "Yes" : "No"}
                        </label>
                    </div>
                </label>
            </div>

        </>
    );
};

export default AntiqueVintageDetails;