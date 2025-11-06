import { useState, useEffect, useMemo } from "react";
import getAPI from "../../../../../../api/getAPI";
import { toast } from "react-toastify";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const AntiqueVintageDetails = ({
    formData,
    setFormData,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    profileData,
}) => {



    const originOptions = [
        { value: "france", label: "France" },
        { value: "japan", label: "Japan" },
        { value: "india", label: "India" },
        { value: "china", label: "China" },
        { value: "uk", label: "United Kingdom" },
        { value: "usa", label: "United States" },
    ];

    const [periodEra, setPeriodEra] = useState([]);

    const fetchPeriodEra = async () => {
        try {
            const response = await getAPI("/api/getperioderas");
            const validPeriodEra = response.data.filter(
                (era) => era.name && typeof era.name === "string"
            );
            setPeriodEra(validPeriodEra);
            if (!validPeriodEra.length) toast.error("No valid period era found");
        } catch (error) {
            console.error("Error fetching period era:", error);
            toast.error("Failed to load period era");
        }
    };

    useEffect(() => {
        fetchPeriodEra();
    }, []);

    const periodEraOptions = useMemo(
        () =>
            periodEra.map((era) => ({
                value: era.name,
                label: era.name,
            })),
        [periodEra]
    );

    const conditionOptions = [
        { value: "new", label: "New" },
        { value: "excellent", label: "Excellent" },
        { value: "good", label: "Good" },
        { value: "fair", label: "Fair" },
        { value: "poor", label: "Poor" },
    ];

    const originalReproductionOptions = [
        { value: "original", label: "Original" },
        { value: "replica", label: "Replica" },
        { value: "reproduction", label: "Reproduction" },
    ];

    const conservationStatusOptions = [
        { value: "restored", label: "Restored" },
        { value: "original", label: "Original Condition" },
    ];

    const maintenanceRequiredOptions = [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
    ];




    const buildUrl = (path) => {
        if (!path || typeof path !== "string") return null;
        return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`.replace(
            /([^:]\/)\/+/g,
            "$1"
        );
    };


    const existingRestorationUrl = buildUrl(formData.restorationDocumentation);
    const existingCertificationUrl = buildUrl(formData.certification);




    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (!files?.[0]) return;

        const file = files[0];
        const allowed = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

        if (
            (name === "restorationDocumentation" || name === "certification") &&
            !allowed.includes(file.type)
        ) {
            toast.error("Please upload a valid image (JPEG, PNG, GIF) or PDF file.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should not exceed 5 MB.");
            e.target.value = "";
            return;
        }


        setFormData((prev) => ({
            ...prev,
            [name]: file,
            [`${name}Preview`]: URL.createObjectURL(file),
        }));
    };




    const renderFilePreview = (file, previewUrl, existingUrl, label) => {
        if (!file && !existingUrl) return null;

        const isPdf = file?.type === "application/pdf" || (existingUrl && existingUrl.endsWith(".pdf"));

        return (
            <div className="mt-2 d-flex align-items-center flex-wrap">
                <small className="text-muted mr-2">
                    {file?.name || (existingUrl && "")}
                </small>

                { }
                {existingUrl && !previewUrl && (
                    <>
                        {isPdf ? (
                            <a
                                href={existingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary mr-2"
                            >
                                View PDF
                            </a>
                        ) : (
                            <img
                                src={existingUrl}
                                alt={label}
                                className="img-thumbnail mr-2"
                                style={{ maxWidth: "120px" }}
                            />
                        )}
                    </>
                )}

                { }
                {previewUrl && (
                    <>
                        {isPdf ? (
                            <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-primary mr-2"
                            >
                                View PDF
                            </a>
                        ) : (
                            <img
                                src={previewUrl}
                                alt={label}
                                className="img-thumbnail mr-2"
                                style={{ maxWidth: "120px" }}
                            />
                        )}
                    </>
                )}
            </div>
        );
    };




    return (
        <>
            <h4 className="mb-3">Antique & Vintage Details</h4>

            { }
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="originRegion">
                            Origin / Region <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                            id="originRegion"
                            name="originRegion"
                            className="form-control"
                            value={formData.originRegion?.value || ""}
                            onChange={(e) => {
                                const selected = originOptions.find((opt) => opt.value === e.target.value);
                                handleSelectChange("originRegion", selected);
                            }}
                            disabled
                        >
                            <option value="">Select Origin/Region</option>
                            {originOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="periodEra">
                            Period / Era <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                            id="periodEra"
                            name="periodEra"
                            className="form-control"
                            value={formData.periodEra?.value || ""}
                            onChange={(e) => {
                                const selected = periodEraOptions.find((opt) => opt.value === e.target.value);
                                handleSelectChange("periodEra", selected);
                            }}
                            disabled
                        >
                            <option value="">Select Period/Era</option>
                            {periodEraOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            { }
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="antiqueCondition">
                            Condition <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                            id="antiqueCondition"
                            name="antiqueCondition"
                            className="form-control"
                            value={formData.antiqueCondition?.value || ""}
                            onChange={(e) => {
                                const selected = conditionOptions.find((opt) => opt.value === e.target.value);
                                handleSelectChange("antiqueCondition", selected);
                            }}
                            disabled
                        >
                            <option value="">Select Condition</option>
                            {conditionOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="conservationStatus">
                            Conservation Status <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                            id="conservationStatus"
                            name="conservationStatus"
                            className="form-control"
                            value={formData.conservationStatus?.value || ""}
                            onChange={(e) => {
                                const selected = conservationStatusOptions.find(
                                    (opt) => opt.value === e.target.value
                                );
                                handleSelectChange("conservationStatus", selected);
                            }}
                            disabled
                        >
                            <option value="">Select Conservation Status</option>
                            {conservationStatusOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            { }
            {formData.conservationStatus?.value === "restored" && (
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label htmlFor="restorationHistory">
                                Restoration History <span style={{ color: "red" }}>*</span>
                            </label>
                            <textarea
                                id="restorationHistory"
                                name="restorationHistory"
                                className="form-control"
                                placeholder="Details about any restorations, modifications, or repairs"
                                rows="3"
                                value={formData.restorationHistory || ""}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <label htmlFor="restorationDocumentation">
                                Restoration Documentation <span style={{ color: "red" }}>*</span>
                            </label>
                            {renderFilePreview(
                                formData.restorationDocumentation,
                                formData.restorationDocumentationPreview,
                                existingRestorationUrl,
                                "Restoration Doc"
                            )}
                        </div>
                    </div>
                </div>
            )}

            { }
            <div className="form-group">
                <label htmlFor="provenanceHistory">Provenance (Ownership History)</label>
                <textarea
                    id="provenanceHistory"
                    name="provenanceHistory"
                    className="form-control"
                    placeholder="List of previous owners, museums, or galleries"
                    rows="3"
                    value={formData.provenanceHistory || ""}
                    onChange={handleInputChange}
                    disabled
                />
            </div>

            <div className="form-group">
                <label htmlFor="culturalSignificance">Cultural Significance</label>
                <textarea
                    id="culturalSignificance"
                    name="culturalSignificance"
                    className="form-control"
                    placeholder="Describe any cultural or historical significance"
                    rows="3"
                    value={formData.culturalSignificance || ""}
                    onChange={handleInputChange}
                    disabled
                />
            </div>

            <div className="form-group">
                <label htmlFor="appraisalDetails">Appraisal Details</label>
                <textarea
                    id="appraisalDetails"
                    name="appraisalDetails"
                    className="form-control"
                    placeholder="Details of any professional appraisals or valuations"
                    rows="3"
                    value={formData.appraisalDetails || ""}
                    onChange={handleInputChange}
                    disabled
                />
            </div>

            { }
            <h5 className="mt-4 mb-3">Current Location</h5>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="addressLine1">Address Line 1</label>
                        <input
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            className="form-control"
                            placeholder="Street address, P.O. box"
                            value={formData.addressLine1 || profileData.address?.line1 || ""}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="addressLine2">Address Line 2</label>
                        <input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            className="form-control"
                            placeholder="Apartment, suite, unit, building, floor"
                            value={formData.addressLine2 || profileData.address?.line2 || ""}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="landmark">Landmark</label>
                        <input
                            type="text"
                            id="landmark"
                            name="landmark"
                            className="form-control"
                            placeholder="Nearby recognizable location"
                            value={formData.landmark || profileData.address?.landmark || ""}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            className="form-control"
                            placeholder="City name"
                            value={formData.city || profileData.address?.city || ""}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="state">State/Province</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            className="form-control"
                            placeholder="State or province"
                            value={formData.state || profileData.address?.state || ""}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            className="form-control"
                            placeholder="Country name"
                            value={formData.country || profileData.address?.country || ""}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="pincode">Pincode/Zipcode</label>
                        <input
                            type="text"
                            id="pincode"
                            name="pincode"
                            className="form-control"
                            placeholder="Postal code"
                            value={formData.pincode || profileData.address?.pincode || ""}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>
            </div>

            { }
            <h5 className="mt-4 mb-3">Detailed Product Attributes</h5>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="engravingMarkings">Engraving / Markings</label>
                        <textarea
                            id="engravingMarkings"
                            name="engravingMarkings"
                            className="form-control"
                            placeholder="Details about any unique engravings, stamps, or markings"
                            rows="3"
                            value={formData.engravingMarkings || ""}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="patinaWear">Patina / Wear & Tear</label>
                        <textarea
                            id="patinaWear"
                            name="patinaWear"
                            className="form-control"
                            placeholder="Visible aging effects (e.g., rust, fading, cracks)"
                            rows="3"
                            value={formData.patinaWear || ""}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>
            </div>

            { }
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="certification">
                            Certification Document <span style={{ color: "red" }}>*</span>
                        </label>
                        {renderFilePreview(
                            formData.certification,
                            formData.certificationPreview,
                            existingCertificationUrl,
                            "Certification"
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label className="d-flex align-items-center">
                            <span className="mr-2">
                                Is this item handmade? <span style={{ color: "red" }}>*</span>
                            </span>
                            <div className="custom-control custom-switch">
                                <input
                                    type="checkbox"
                                    id="isHandmade"
                                    name="isHandmade"
                                    className="custom-control-input"
                                    checked={formData.isHandmade || false}
                                    onChange={(e) =>
                                        handleInputChange({
                                            target: { name: "isHandmade", value: e.target.checked },
                                        })
                                    }
                                    disabled
                                />
                                <label className="custom-control-label" htmlFor="isHandmade">
                                    {formData.isHandmade ? "Yes" : "No"}
                                </label>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            { }
            <div className="form-group">
                <label htmlFor="originalReproduction">
                    Original vs. Reproduction <span style={{ color: "red" }}>*</span>
                </label>
                <select
                    id="originalReproduction"
                    name="originalReproduction"
                    className="form-control"
                    value={formData.originalReproduction?.value || ""}
                    onChange={(e) => {
                        const selected = originalReproductionOptions.find(
                            (opt) => opt.value === e.target.value
                        );
                        handleSelectChange("originalReproduction", selected);
                    }}
                    disabled
                >
                    <option value="">Select</option>
                    {originalReproductionOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>

            { }
            <div className="form-group">
                <label htmlFor="museumExhibitionHistory">Museum / Exhibition History</label>
                <textarea
                    id="museumExhibitionHistory"
                    name="museumExhibitionHistory"
                    className="form-control"
                    placeholder="If displayed in any exhibitions or museums"
                    rows="3"
                    value={formData.museumExhibitionHistory || ""}
                    onChange={handleInputChange}
                    disabled
                />
            </div>

            { }
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="maintenanceRequired">
                            Maintenance Required <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                            id="maintenanceRequired"
                            name="maintenanceRequired"
                            className="form-control"
                            value={formData.maintenanceRequired?.value || ""}
                            onChange={(e) => {
                                const selected = maintenanceRequiredOptions.find(
                                    (opt) => opt.value === e.target.value
                                );
                                handleSelectChange("maintenanceRequired", selected);
                            }}
                            disabled
                        >
                            <option value="">Select Maintenance Requirement</option>
                            {maintenanceRequiredOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            { }
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
                                    target: { name: "customEngravingAvailable", value: e.target.checked },
                                })
                            }
                            disabled
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