import React, { useState } from "react";
import Select from 'react-select';
import { toast } from "react-toastify";

const LegalCompliance = ({
  formData,
  isSubmitting,
  handleInputChange,
  handleSelectChange,
  setFormData
}) => {
  const [showCOAFields, setShowCOAFields] = useState(formData.coaAvailable || false);
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [certificateType, setCertificateType] = useState('digital');

  const copyrightOptions = [
    { value: 'full_rights', label: 'Buyer has full reproduction/resale rights' },
    { value: 'personal_use', label: 'Buyer can use personally but not reproduce/resell' },
    { value: 'no_rights', label: 'No reproduction/resale rights granted' }
  ];

  const certificateTypeOptions = [
    { value: 'artist_signed', label: 'Artist Signed' },
    { value: 'third_party', label: 'Third-Party Certified' },
    { value: 'museum', label: 'Museum-Approved' },
    { value: 'gallery', label: 'Gallery-Certified' }
  ];

  const handleCOAToggle = (e) => {
    const isChecked = e.target.checked;
    setShowCOAFields(isChecked);
    handleInputChange(e);
  };

  const handleCertificateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'application/pdf'];

    if (!validTypes.includes(file.type)) {
      toast.warn(`Please upload JPG, JPEG, or PDF files only`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setCertificateFile(file);

    if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCertificatePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      const pdfUrl = URL.createObjectURL(file);
      setCertificatePreview(pdfUrl);
    } else {
      setCertificatePreview(null);
    }

    setFormData(prev => ({
      ...prev,
      certificateFile: file
    }));
  };

  const handleCOAFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'application/pdf'];

    if (!validTypes.includes(file.type)) {
      toast.warn("Please upload JPG, JPEG, or PDF files only");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warn("File size should be less than 5MB");
      return;
    }

    setFormData(prev => ({
      ...prev,
      coaFile: file
    }));

    if (file.type.includes("image")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          coaPreview: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      const pdfUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        coaPreview: pdfUrl
      }));
    }
  };

  const toggleCertificateType = () => {
    const newType = certificateType === 'digital' ? 'physical' : 'digital';
    setCertificateType(newType);
    setCertificateFile(null);
    setCertificatePreview(null);
    setFormData(prev => ({
      ...prev,
      certificateFormat: newType,
      certificateFile: null
    }));
  };

  // Handle artist signature toggle
  const handleArtistSignatureChange = (e) => {
    handleInputChange(e);
    if (!e.target.checked) {
      // Reset certificate fields when signature is turned off
      setCertificateType('digital');
      setCertificateFile(null);
      setCertificatePreview(null);
      setFormData(prev => ({
        ...prev,
        certificateFormat: 'digital',
        certificateFile: null
      }));
    }
  };

  return (
    <div className="legal-compliance-section">
      <h4 className="mb-3">Legal & Compliance</h4>

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="ownershipConfirmation"
          name="ownershipConfirmation"
          className="form-check-input"
          checked={formData.ownershipConfirmation || false}
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
        />
        <label className="form-check-label" htmlFor="ownershipConfirmation">
          I confirm I have legal rights to sell this artwork *
        </label>
      </div>

      <div className="form-group">
        <label>Copyright & Reproduction Rights *</label>
        <Select
          options={copyrightOptions}
          value={formData.copyrightRights}
          onChange={(selected) => handleSelectChange('copyrightRights', selected)}
          placeholder="Select copyright terms"
          isSearchable
          required
          isDisabled={isSubmitting}
        />
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="prohibitedItems"
          name="prohibitedItems"
          className="form-check-input"
          checked={formData.prohibitedItems || false}
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
        />
        <label className="form-check-label" htmlFor="prohibitedItems">
          I confirm this artwork complies with platform rules and does not contain prohibited content *
        </label>
      </div>

      <div className="form-group">
        <label className="d-flex align-items-center">
          <span className="mr-2">Artist Signature Included:</span>
          <div className="custom-control custom-switch">
            <input
              type="checkbox"
              id="artistSignature"
              name="artistSignature"
              className="custom-control-input"
              checked={formData.artistSignature || false}
              onChange={handleArtistSignatureChange}
              disabled={isSubmitting}
            />
            <label className="custom-control-label" htmlFor="artistSignature">
              {formData.artistSignature ? 'Yes' : 'No'}
            </label>
          </div>
        </label>
      </div>

      {/* Only show certificate section if artist signature is enabled */}
      {formData.artistSignature && (
        <>
          <div className="form-group">
            <label className="d-flex align-items-center">
              <span className="mr-2">Certificate Type:</span>
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  id="certificateTypeToggle"
                  name="certificateTypeToggle"
                  className="custom-control-input"
                  checked={certificateType === 'digital'}
                  onChange={toggleCertificateType}
                  disabled={isSubmitting}
                />
                <label className="custom-control-label" htmlFor="certificateTypeToggle">
                  {certificateType === 'digital' ? 'Digital' : 'Physical'}
                </label>
              </div>
            </label>
          </div>

          {certificateType === 'digital' ? (
            <div className="form-group">
              <label className="form-label">Upload Digital Certificate</label>
              <input
                type="file"
                className="form-control"
                onChange={handleCertificateUpload}
                accept=".jpg,.jpeg,.pdf"
                disabled={isSubmitting}
              />
              <small className="text-muted">Accepted formats: JPG, JPEG, PDF (Max 5MB)</small>

              {certificatePreview && (
                <div className="mt-3">
                  {certificateFile?.type.includes('image') ? (
                    <img src={certificatePreview} alt="Certificate Preview" className="img-thumbnail" style={{ maxWidth: '200px' }} />
                  ) : (
                    <a href={certificatePreview} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View PDF</a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Upload Physical Certificate Photo</label>
              <input
                type="file"
                className="form-control"
                onChange={handleCertificateUpload}
                accept=".jpg,.jpeg,.pdf"
                disabled={isSubmitting}
              />
              <small className="text-muted">Accepted formats: JPG, JPEG, PDF (Max 5MB)</small>

              {certificatePreview && (
                <div className="mt-3">
                  {certificateFile?.type.includes('image') ? (
                    <img src={certificatePreview} alt="Certificate Preview" className="img-thumbnail" style={{ maxWidth: '200px' }} />
                  ) : (
                    <a href={certificatePreview} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View PDF</a>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="form-group">
        <label className="d-flex align-items-center">
          <span className="mr-2">Certificate of Authenticity (COA) Available:</span>
          <div className="custom-control custom-switch">
            <input
              type="checkbox"
              id="coaAvailable"
              name="coaAvailable"
              className="custom-control-input"
              checked={formData.coaAvailable || false}
              onChange={handleCOAToggle}
              disabled={isSubmitting}
            />
            <label className="custom-control-label" htmlFor="coaAvailable">
              {formData.coaAvailable ? 'Yes' : 'No'}
            </label>
          </div>
        </label>
      </div>

      {showCOAFields && (
        <div className="coa-fields">
          <div className="form-group">
            <label>COA Type</label>
            <Select
              options={certificateTypeOptions}
              value={formData.certificateType}
              onChange={(selected) => handleSelectChange('certificateType', selected)}
              placeholder="Select COA type"
              isSearchable
              isDisabled={isSubmitting}
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
              value={formData.issuerName}
              onChange={handleInputChange}
              disabled={isSubmitting}
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
              value={formData.verificationNumber}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="coaFile">Upload COA Document</label>
            <input
              type="file"
              id="coaFile"
              name="coaFile"
              className="form-control"
              onChange={handleCOAFileUpload}
              accept=".jpg,.jpeg,.pdf"
              disabled={isSubmitting}
            />
            <small className="text-muted">Accepted formats: JPG, JPEG, PDF (Max 5MB)</small>

            {formData.coaPreview && (
              <div className="mt-3">
                {formData.coaFile?.type.includes("image") ? (
                  <img
                    src={formData.coaPreview}
                    alt="COA Preview"
                    className="img-thumbnail"
                    style={{ maxWidth: "200px" }}
                  />
                ) : (
                  <div className="mt-2">
                    <a
                      href={formData.coaPreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      View PDF
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <hr className="my-4" />
    </div>
  );
};

export default LegalCompliance;