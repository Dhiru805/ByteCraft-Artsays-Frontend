import React from "react";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Tooltip } from 'react-tooltip';

const ArtworkDetails = ({
    formData,
    isSubmitting,
    mediumOptions,
    materialOptions,
    editionOptions,
    framingOptions,
    yearOptions,
    surfaceTypeOptions,
    conditionOptions,
    handleSelectChange,
    handleMultiSelectChange,
    handleInputChange
}) => (
    <>
        <h4 className="mb-3">Artwork/Artifact Details</h4>

        <div className="form-group">
            <label>Medium *</label>
            <CreatableSelect
                options={mediumOptions}
                value={formData.medium}
                onChange={(selected) => handleSelectChange('medium', selected)}
                placeholder="Select or create medium"
                isSearchable
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                required
                isDisabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label>Materials Used *</label>
            <CreatableSelect
                options={materialOptions}
                value={formData.materials}
                onChange={handleMultiSelectChange}
                placeholder="Select or create materials"
                isMulti
                isSearchable
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                required
                isDisabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label htmlFor="dimensions">Dimensions *</label>
            <input
                type="text"
                id="dimensions"
                name="dimensions"
                className="form-control"
                placeholder="e.g., 24 x 36 inches or 60 x 90 cm"
                value={formData.dimensions}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
            />
            <small className="text-muted">Mention in inches/cm (e.g., 24 x 36 inches)</small>
        </div>

        <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
                type="number"
                id="weight"
                name="weight"
                className="form-control"
                placeholder="Enter weight in kilograms"
                step="0.01"
                value={formData.weight}
                onChange={handleInputChange}
                disabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label>Year of Creation *</label>
            <Select
                options={yearOptions}
                value={formData.year}
                onChange={(selected) => handleSelectChange('year', selected)}
                placeholder="Select Year"
                isSearchable
                required
                isDisabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label>Edition Type *</label>
            <Select
                options={editionOptions}
                value={formData.editionType}
                onChange={(selected) => handleSelectChange('editionType', selected)}
                placeholder="Select Edition Type"
                isSearchable
                required
                isDisabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label>Framing Details *</label>
            <Select
                options={framingOptions}
                value={formData.framing}
                onChange={(selected) => handleSelectChange('framing', selected)}
                placeholder="Select Framing Option"
                isSearchable
                required
                isDisabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
                type="number"
                id="quantity"
                name="quantity"
                className="form-control"
                placeholder="Enter quantity"
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label htmlFor="hsnCode">
                HSN Code{' '}
                <a
                    href="https://services.gst.gov.in/services/searchhsnsac"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i
                        className="fa fa-info-circle ml-2"
                        data-tooltip-id="hsn-tooltip"
                    // data-tooltip-content="HSN code for taxation purposes.\nClick for more details."
                    />
                </a>
            </label>
            <Tooltip id="hsn-tooltip">
                <span>HSN code for taxation purposes.</span>
                <br />
                <span>...Click for more details.</span>
            </Tooltip>

            <input
                type="text"
                id="hsnCode"
                name="hsnCode"
                className="form-control"
                placeholder="Enter HSN Code"
                value={formData.hsnCode}
                onChange={handleInputChange}
                disabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label>Surface Type</label>
            <CreatableSelect
                options={surfaceTypeOptions}
                value={formData.surfaceType}
                onChange={(selected) => handleSelectChange('surfaceType', selected)}
                placeholder="Select or create surface type"
                isSearchable
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                isDisabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <div className="form-check">
                <input
                    type="checkbox"
                    id="isSigned"
                    name="isSigned"
                    className="form-check-input"
                    checked={formData.isSigned}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />
                <label className="form-check-label" htmlFor="isSigned">
                    Signed by the artist *
                </label>
            </div>
        </div>

        <div className="form-group">
            <label>Condition *</label>
            <Select
                options={conditionOptions}
                value={formData.condition}
                onChange={(selected) => handleSelectChange('condition', selected)}
                placeholder="Select condition"
                isSearchable
                required
                isDisabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label htmlFor="provenance">Provenance & History</label>
            <textarea
                id="provenance"
                name="provenance"
                className="form-control"
                placeholder="Enter background, exhibitions, previous sales, etc."
                rows="4"
                value={formData.provenance}
                onChange={handleInputChange}
                disabled={isSubmitting}
            />
        </div>

        <hr className="my-4" />
    </>
);

export default ArtworkDetails;