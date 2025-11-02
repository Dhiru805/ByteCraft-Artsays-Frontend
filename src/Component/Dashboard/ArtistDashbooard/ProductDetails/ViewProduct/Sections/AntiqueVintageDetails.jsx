import { useState, useEffect, useMemo } from "react";
import getAPI from "../../../../../../api/getAPI";
import { toast } from 'react-toastify';

const AntiqueVintageDetails = ({
    formData,
    setFormData,
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

    const [periodEra, setPeriodEra] = useState([]);

    const fetchPeriodEra = async () => {
        try {
            const response = await getAPI("/api/getperioderas");
            const validPeriodEra = response.data.filter(
                era => era.name && typeof era.name === 'string'
            );
            setPeriodEra(validPeriodEra);
            if (!validPeriodEra.length) {
                toast.error('No valid period era found');
            }
        } catch (error) {
            console.error("Error fetching period era:", error);
            toast.error('Failed to load period era');
        }
    };

    useEffect(() => {
        fetchPeriodEra();
    }, []);

    const periodEraOptions = useMemo(() => {
        return periodEra.map((era) => ({
            value: era.name,
            label: era.name
        }));
    }, [periodEra]);

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

    const conservationStatusOptions = [
        { value: 'restored', label: 'Restored' },
        { value: 'original', label: 'Original Condition' },
    ];

    const maintenanceRequiredOptions = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
    ];

    const isRestored = formData.conservationStatus?.value === 'restored';

    return (
        <>
            <h4 className="mb-3">Antique & Vintage Details</h4>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Origin / Region <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.originRegion?.label || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>Period / Era <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.periodEra?.label || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Condition <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.antiqueCondition?.label || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>Conservation Status <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.conservationStatus?.label || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>
            </div>

            {isRestored && (
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Restoration History <span style={{ color: 'red' }}>*</span></label>
                            <textarea
                                className="form-control bg-light"
                                rows="3"
                                value={formData.restorationHistory || '—'}
                                readOnly
                                style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                            />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Restoration Documentation <span style={{ color: 'red' }}>*</span></label>
                            <div className="p-3 border rounded bg-light">
                                {formData.restorationDocumentation ? (
                                    <div>
                                        <small className="text-muted">
                                            {formData.restorationDocumentation.name}
                                        </small>
                                        <div className="mt-2">
                                            {formData.restorationDocumentation.type?.includes('image') ? (
                                                <img 
                                                    src={URL.createObjectURL(formData.restorationDocumentation)} 
                                                    alt="Restoration Doc" 
                                                    className="img-thumbnail" 
                                                    style={{ maxWidth: '200px' }} 
                                                />
                                            ) : (
                                                <a 
                                                    href={URL.createObjectURL(formData.restorationDocumentation)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    View PDF
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <small className="text-muted">No document uploaded</small>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="form-group">
                <label>Provenance (Ownership History)</label>
                <textarea
                    className="form-control bg-light"
                    rows="3"
                    value={formData.provenanceHistory || '—'}
                    readOnly
                    style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                />
            </div>

            <div className="form-group">
                <label>Cultural Significance</label>
                <textarea
                    className="form-control bg-light"
                    rows="3"
                    value={formData.culturalSignificance || '—'}
                    readOnly
                    style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                />
            </div>

            <div className="form-group">
                <label>Appraisal Details</label>
                <textarea
                    className="form-control bg-light"
                    rows="3"
                    value={formData.appraisalDetails || '—'}
                    readOnly
                    style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                />
            </div>

            <h5 className="mt-4 mb-3">Current Location</h5>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Address Line 1</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.addressLine1 || profileData.address?.line1 || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>Address Line 2</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.addressLine2 || profileData.address?.line2 || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>Landmark</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.landmark || profileData.address?.landmark || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.city || profileData.address?.city || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>State/Province</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.state || profileData.address?.state || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>Country</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.country || profileData.address?.country || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>Pincode/Zipcode</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.pincode || profileData.address?.pincode || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>
            </div>

            <h5 className="mt-4 mb-3">Detailed Product Attributes</h5>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Engraving / Markings</label>
                        <textarea
                            className="form-control bg-light"
                            rows="3"
                            value={formData.engravingMarkings || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>Patina / Wear & Tear</label>
                        <textarea
                            className="form-control bg-light"
                            rows="3"
                            value={formData.patinaWear || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Certification Document <span style={{ color: 'red' }}>*</span></label>
                        <div className="p-3 border rounded bg-light">
                            {formData.certification ? (
                                <div>
                                    <small className="text-muted">
                                        {formData.certification.name}
                                    </small>
                                    <div className="mt-2">
                                        {formData.certification.type?.includes('image') ? (
                                            <img 
                                                src={URL.createObjectURL(formData.certification)} 
                                                alt="Certification" 
                                                className="img-thumbnail" 
                                                style={{ maxWidth: '200px' }} 
                                            />
                                        ) : (
                                            <a 
                                                href={URL.createObjectURL(formData.certification)} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="btn btn-primary btn-sm"
                                            >
                                                View PDF
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <small className="text-muted">No document uploaded</small>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label className="d-flex align-items-center">
                            <span className="mr-2">Is this item handmade? <span style={{ color: 'red' }}>*</span></span>
                            <div className="custom-control custom-switch">
                                <input
                                    type="checkbox"
                                    id="isHandmade"
                                    name="isHandmade"
                                    className="custom-control-input"
                                    checked={formData.isHandmade || false}
                                    disabled={true}
                                />
                                <label className="custom-control-label" htmlFor="isHandmade">
                                    {formData.isHandmade ? "Yes" : "No"}
                                </label>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label>Original vs. Reproduction <span style={{ color: 'red' }}>*</span></label>
                <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.originalReproduction?.label || '—'}
                    readOnly
                    style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                />
            </div>

            <div className="form-group">
                <label>Museum / Exhibition History</label>
                <textarea
                    className="form-control bg-light"
                    rows="3"
                    value={formData.museumExhibitionHistory || '—'}
                    readOnly
                    style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                />
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Maintenance Required <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={formData.maintenanceRequired?.label || '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>
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
                            disabled={true}
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