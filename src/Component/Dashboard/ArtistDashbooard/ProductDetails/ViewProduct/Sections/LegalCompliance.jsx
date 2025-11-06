import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const LegalCompliance = ({
  formData,
  isSubmitting,
  handleInputChange,
  handleSelectChange,
  setFormData,
}) => {
  const [showCOAFields, setShowCOAFields] = useState(formData.coaAvailable );
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [certificateType, setCertificateType] = useState("digital");

  useEffect(() => {
    setShowCOAFields(formData.coaAvailable );
  }, [formData.coaAvailable]);

  const buildUrl = (path) => {
    if (!path || typeof path !== "string") return null;
    return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`.replace(
      /([^:]\/)\/+/g,
      "$1"
    );
  };

  const existingCertificateUrl = buildUrl(formData.certificateFile);
  const existingCoaUrl = buildUrl(formData.coaFile);

  const copyrightOptions = [
    { value: "full_rights", label: "Buyer has full reproduction/resale rights" },
    { value: "personal_use", label: "Buyer can use personally but not reproduce/resell" },
    { value: "no_rights", label: "No reproduction/resale rights granted" },
  ];

  const certificateTypeOptions = [
    { value: "artist_signed", label: "Artist Signed" },
    { value: "third_party", label: "Third-Party Certified" },
    { value: "museum", label: "Museum-Approved" },
    { value: "gallery", label: "Gallery-Certified" },
  ];

  const commercialUseOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];




  const handleCOAToggle = (e) => {
    const isChecked = e.target.checked;
    handleInputChange(e);
    if (!isChecked) {
      setFormData((prev) => ({
        ...prev,
        certificateType: null,
        issuerName: "",
        verificationNumber: "",
        coaFile: null,
        coaPreview: null,
      }));
    }
  };

  const handleCertificateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.warn("Please upload JPG, JPEG, or PDF files only");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warn("File size must be less than 5 MB");
      return;
    }

    setCertificateFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCertificatePreview(ev.target.result);
    reader.readAsDataURL(file);

    setFormData((prev) => ({ ...prev, certificateFile: file }));
  };

  const handleCOAFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.warn("Please upload JPG, JPEG, or PDF files only");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warn("File size must be less than 5 MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      coaFile: file,
      coaPreview: URL.createObjectURL(file),
    }));
  };

  const toggleCertificateType = () => {
    const newType = certificateType === "digital" ? "physical" : "digital";
    setCertificateType(newType);
    setCertificateFile(null);
    setCertificatePreview(null);
    setFormData((prev) => ({
      ...prev,
      certificateFormat: newType,
      certificateFile: null,
    }));
  };

  const handleArtistSignatureChange = (e) => {
    handleInputChange(e);
    if (!e.target.checked) {
      setCertificateType("digital");
      setCertificateFile(null);
      setCertificatePreview(null);
      setFormData((prev) => ({
        ...prev,
        certificateFormat: "digital",
        certificateFile: null,
      }));
    }
  };




  return (
    <div className="legal-compliance-section">
      <h4 className="mb-3">Legal & Compliance</h4>

      { }
      <div className="form-group form-check">
        <input
          type="checkbox"
          id="ownershipConfirmation"
          name="ownershipConfirmation"
          className="form-check-input"
          checked={formData.ownershipConfirmation }
          onChange={handleInputChange}
          disabled={true}
        />
        <label className="form-check-label" htmlFor="ownershipConfirmation">
          I confirm I have legal rights to sell this artwork <span style={{ color: "red" }}>*</span>
        </label>
      </div>

      { }
      <div className="form-group">
        <label>
          Copyright & Reproduction Rights <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={copyrightOptions}
          value={formData.copyrightRights}
          onChange={(s) => handleSelectChange("copyrightRights", s)}
          placeholder="Select copyright terms"
          isSearchable
          isDisabled={true}
        />
      </div>

      { }
      <div className="form-group form-check">
        <input
          type="checkbox"
          id="prohibitedItems"
          name="prohibitedItems"
          className="form-check-input"
          checked={formData.prohibitedItems }
          onChange={handleInputChange}
          disabled={true}
        />
        <label className="form-check-label" htmlFor="prohibitedItems">
          I confirm this artwork complies with platform rules <span style={{ color: "red" }}>*</span>
        </label>
      </div>

      { }
      <div className="form-group">
        <label className="d-flex align-items-center">
          <span className="mr-2">Artist Signature Included:</span>
          <div className="custom-control custom-switch">
            <input
              type="checkbox"
              id="artistSignature"
              name="artistSignature"
              className="custom-control-input"
              checked={formData.artistSignature }
              onChange={handleArtistSignatureChange}
              disabled={true}
            />
            <label className="custom-control-label" htmlFor="artistSignature">
              {formData.artistSignature ? "Yes" : "No"}
            </label>
          </div>
        </label>
      </div>

      { }
      {formData.artistSignature && (
        <>
          <div className="form-group">
            <label className="d-flex align-items-center">
              <span className="mr-2">Certificate Type:</span>
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  id="certificateTypeToggle"
                  className="custom-control-input"
                  checked={certificateType === "digital"}
                  onChange={toggleCertificateType}
                  disabled={true}
                />
                <label className="custom-control-label" htmlFor="certificateTypeToggle">
                  {certificateType === "digital" ? "Digital" : "Physical"}
                </label>
              </div>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              Upload {certificateType === "digital" ? "Digital" : "Physical"} Certificate
            </label>

            { }
            {existingCertificateUrl && !certificatePreview && (
              <div className="mt-2 mb-2">
                <strong>Current Certificate:</strong>{" "}
                {formData.certificateFile?.endsWith(".pdf") ? (
                  <a
                    href={existingCertificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary ml-2"
                  >
                    View PDF
                  </a>
                ) : (
                  <img
                    src={existingCertificateUrl}
                    alt="Current Certificate"
                    className="img-thumbnail ml-2"
                    style={{ maxWidth: "200px" }}
                  />
                )}
              </div>
            )}

            { }
            {certificatePreview && (
              <div className="mt-2 mb-2">
                <strong>New Certificate preview:</strong>{" "}
                {certificateFile?.type.includes("image") ? (
                  <img
                    src={certificatePreview}
                    alt="Certificate preview"
                    className="img-thumbnail ml-2"
                    style={{ maxWidth: "200px" }}
                  />
                ) : (
                  <a
                    href={certificatePreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary ml-2"
                  >
                    View PDF
                  </a>
                )}
              </div>
            )}

            <input
              type="file"
              className="form-control mt-2"
              onChange={handleCertificateUpload}
              accept=".jpg,.jpeg,.pdf"
              disabled={true}
            />
            <small className="text-muted">JPG, JPEG, PDF (max 5 MB)</small>
          </div>
        </>
      )}

      { }
      <div className="form-group">
        <label className="d-flex align-items-center">
          <span className="mr-2">Certificate of Authenticity (COA) Available:</span>
          <div className="custom-control custom-switch">
            <input
              type="checkbox"
              id="coaAvailable"
              name="coaAvailable"
              className="custom-control-input"
              checked={formData.coaAvailable }
              onChange={handleCOAToggle}
              disabled={true}
            />
            <label className="custom-control-label" htmlFor="coaAvailable">
              {formData.coaAvailable ? "Yes" : "No"}
            </label>
          </div>
        </label>
        {!formData.coaAvailable && (
          <div className="mt-2">
            <a
              href="https://example.com/purchase-coa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              Purchase a Certificate of Authenticity
            </a>
          </div>
        )}
      </div>

      { }
      {showCOAFields && (
        <div className="coa-fields border p-3 rounded bg-light">
          <div className="form-group">
            <label>COA Type</label>
            <Select
              options={certificateTypeOptions}
              value={formData.certificateType}
              onChange={(s) => handleSelectChange("certificateType", s)}
              placeholder="Select COA type"
              isSearchable
              isDisabled={true}
            />
          </div>

          <div className="form-group">
            <label htmlFor="issuerName">Issuer Name</label>
            <input
              type="text"
              id="issuerName"
              name="issuerName"
              className="form-control"
              placeholder="Who issued the certificate"
              value={formData.issuerName || ""}
              onChange={handleInputChange}
              disabled={true}
            />
          </div>

          <div className="form-group">
            <label htmlFor="verificationNumber">Verification Number</label>
            <input
              type="text"
              id="verificationNumber"
              name="verificationNumber"
              className="form-control"
              placeholder="Unique ID for authenticity tracking"
              value={formData.verificationNumber || ""}
              onChange={handleInputChange}
              disabled={true}
            />
          </div>

          <div className="form-group">
            <label htmlFor="coaFile">Upload COA Document</label>

            {existingCoaUrl && !formData.coaPreview && (
              <div className="mt-2 mb-2">
                <strong>Current COA:</strong>{" "}
                {formData.coaFile?.endsWith(".pdf") ? (
                  <a
                    href={existingCoaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary ml-2"
                  >
                    View PDF
                  </a>
                ) : (
                  <img
                    src={existingCoaUrl}
                    alt="Current COA"
                    className="img-thumbnail ml-2"
                    style={{ maxWidth: "200px" }}
                  />
                )}
              </div>
            )}

            {formData.coaPreview && (
              <div className="mt-2 mb-2">
                <strong>New COA preview:</strong>{" "}
                {formData.coaFile?.type?.includes("image") ? (
                  <img
                    src={formData.coaPreview}
                    alt="COA preview"
                    className="img-thumbnail ml-2"
                    style={{ maxWidth: "200px" }}
                  />
                ) : (
                  <a
                    href={formData.coaPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary ml-2"
                  >
                    View PDF
                  </a>
                )}
              </div>
            )}

            <input
              type="file"
              id="coaFile"
              name="coaFile"
              className="form-control mt-2"
              onChange={handleCOAFileUpload}
              accept=".jpg,.jpeg,.pdf"
              disabled={true}
            />
            <small className="text-muted">JPG, JPEG, PDF (max 5 MB)</small>
          </div>
        </div>
      )}

      { }
      <div className="license-usage-rights-section mt-4">
        <h4 className="mb-3">License & Usage Rights</h4>

        <div className="form-group">
          <label>
            Commercial Use Allowed? <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            options={commercialUseOptions}
            value={formData.commercialUse}
            onChange={(s) => handleSelectChange("commercialUse", s)}
            placeholder="Select commercial use option"
            isSearchable
            isDisabled={true}
          />
        </div>

        <div className="form-group">
          <label htmlFor="royaltyTerms">Royalty Terms (if applicable)</label>
          <input
            type="text"
            id="royaltyTerms"
            name="royaltyTerms"
            className="form-control"
            placeholder="e.g., 10% on resale"
            value={formData.royaltyTerms || ""}
            onChange={handleInputChange}
            disabled={true}
          />
          <small className="text-muted">
            Specify any royalty terms, e.g., percentage for resale, licensing fees
          </small>
        </div>

        <div className="form-group form-check">
          <input
            type="checkbox"
            id="ethicalSourcing"
            name="ethicalSourcing"
            className="form-check-input"
            checked={formData.ethicalSourcing }
            onChange={handleInputChange}
            disabled={true}
          />
          <label className="form-check-label" htmlFor="ethicalSourcing">
            I confirm this artwork was sourced ethically
          </label>
          <small className="text-muted d-block">
            Check to confirm ethical sourcing practices were followed
          </small>
        </div>
      </div>

      <hr className="my-4" />
    </div>
  );
};

export default LegalCompliance;