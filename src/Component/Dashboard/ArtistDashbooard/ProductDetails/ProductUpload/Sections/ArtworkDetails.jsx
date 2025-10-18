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
    culturalRegionOptions,
    handleSelectChange,
    handleMultiSelectChange,
    handleInputChange
}) => (
    <>
        <h4 className="mb-3">Artwork/Artifact Details</h4>

        <div className="form-group">
            <label>Medium <span style={{ color: 'red' }}>*</span></label>
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
            <label>Materials Used <span style={{ color: 'red' }}>*</span></label>
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
            <label>Dimensions <span style={{ color: 'red' }}>*</span></label>
            <div className="row">
                <div className="col">
                    <input
                        type="number"
                        id="width"
                        name="width"
                        className="form-control"
                        placeholder="Width (e.g., 24 inches/cm)"
                        step="0.01"
                        value={formData.width}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="col">
                    <input
                        type="number"
                        id="height"
                        name="height"
                        className="form-control"
                        placeholder="Height (e.g., 36 inches/cm)"
                        step="0.01"
                        value={formData.height}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="col">
                    <input
                        type="number"
                        id="depth"
                        name="depth"
                        className="form-control"
                        placeholder="Depth (e.g., 2 inches/cm)"
                        step="0.01"
                        value={formData.depth}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                    />
                </div>
            </div>
            <small className="text-muted">Mention in inches/cm (e.g., 24 x 36 x 2 inches)</small>
        </div>

        <div className="form-group">
            <label>Weight (g)</label>
            <input
                type="number"
                id="weight"
                name="weight"
                className="form-control"
                placeholder="Enter weight in grams"
                step="0.01"
                value={formData.weight}
                onChange={handleInputChange}
                disabled={isSubmitting}
            />
        </div>

        {(formData.medium?.value?.toLowerCase() === 'print' || formData.medium?.value?.toLowerCase() === 'poster') && (
            <div className="form-group">
                <label>Print Resolution <span style={{ color: 'red' }}>*</span></label>
                <input
                    type="text"
                    id="printResolution"
                    name="printResolution"
                    className="form-control"
                    placeholder="Enter print resolution (e.g., 300 DPI)"
                    value={formData.printResolution}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                />
                <small className="text-muted">Specify resolution (e.g., 300 DPI)</small>
            </div>
        )}

        <div className="form-group">
            <label>Year of Creation <span style={{ color: 'red' }}>*</span></label>
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
            <label>Edition Type <span style={{ color: 'red' }}>*</span></label>
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
            <label>Framing Details <span style={{ color: 'red' }}>*</span></label>
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
            <label>Quantity <span style={{ color: 'red' }}>*</span></label>
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
                    />
                </a>
            </label>
            <Tooltip id="hsn-tooltip">
                <span>HSN code for taxation purposes.</span>
                <br />
                <span>Click for more details.</span>
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
            <label>Cultural Region</label>
            <CreatableSelect
                options={culturalRegionOptions}
                value={formData.culturalRegion}
                onChange={(selected) => handleSelectChange('culturalRegion', selected)}
                placeholder="Select or create cultural region"
                isSearchable
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                isDisabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label>Biological Material</label>
            <input
                type="text"
                id="biologicalMaterial"
                name="biologicalMaterial"
                className="form-control"
                placeholder="Enter biological material"
                value={formData.biologicalMaterial}
                onChange={handleInputChange}
                disabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label>Functional Use <span style={{ color: 'red' }}>*</span></label>
            <Select
                options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                ]}
                value={formData.functionalUse}
                onChange={(selected) => handleSelectChange('functionalUse', selected)}
                placeholder="Select Functional Use"
                isSearchable
                required
                isDisabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label>Material Source</label>
            <input
                type="text"
                id="materialSource"
                name="materialSource"
                className="form-control"
                placeholder="Enter material source"
                value={formData.materialSource}
                onChange={handleInputChange}
                disabled={isSubmitting}
            />
        </div>

        <div className="form-group">
            <label>Craft Technique (Optional)</label>
            <input
                type="text"
                id="craftTechnique"
                name="craftTechnique"
                className="form-control"
                placeholder="Enter craft technique"
                value={formData.craftTechnique}
                onChange={handleInputChange}
                disabled={isSubmitting}
            />
        </div>

            <div className="form-group">
            <label>Tool Usage</label>
            <CreatableSelect
                value={formData.toolUsage}
                onChange={(selected) => handleMultiSelectChange('toolUsage', selected)}
                placeholder="Select or create tools used"
                isMulti
                isSearchable
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                isDisabled={isSubmitting}
            />
        </div>


        <div className="form-group">
            <label>Handmade <span style={{ color: 'red' }}>*</span></label>
            <Select
                options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                ]}
                value={formData.handmade}
                onChange={(selected) => handleSelectChange('handmade', selected)}
                placeholder="Select Handmade Option"
                isSearchable
                required
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
                    Signed by the artist <span style={{ color: 'red' }}>*</span>
                </label>
            </div>
        </div>

      <div className="form-group">
            <div className="form-check">
                <input
                    type="checkbox"
                    id="isResinCovered" 
                    name="isResinCovered" 
                    className="form-check-input"
                    checked={formData.isResinCovered || false}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />
                <label className="form-check-label" htmlFor="isResinCovered">
                    Covered with resign?
                </label>
                <small className="text-muted d-block">(Check if the artwork is coated with resign)</small>
            </div>
        </div>

        <div className="form-group">
            <label>Condition <span style={{ color: 'red' }}>*</span></label>
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

        {formData.condition?.value?.toLowerCase() === 'resale' && (
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
        )}

        <hr className="my-4" />
    </>
);

export default ArtworkDetails;