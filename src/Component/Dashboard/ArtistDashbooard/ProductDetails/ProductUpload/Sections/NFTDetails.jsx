
import { useState, useEffect, useMemo } from "react";
import getAPI from "../../../../../../api/getAPI";
import { toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';

const NFTDetails = ({
    formData,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    profileData
}) => {
    const [blockchain, setBlockchain] = useState([]);
    const [tokenStandard, setTokenStandard] = useState([]);

    const fetchBlockchain = async () => {
        try {
            const response = await getAPI("/api/getblockchainnetworks"); 
            const validBlockchain = response.data.filter(
                chain => chain.name && typeof chain.name === 'string'
            );
            setBlockchain(validBlockchain);
            if (!validBlockchain.length) {
                toast.error('No valid blockchain data found');
            }
        } catch (error) {
            console.error("Error fetching blockchain:", error);
            toast.error('Failed to load blockchain data');
        }
    };

    useEffect(() => {
        fetchBlockchain();
    }, []);

    const blockchainOptions = useMemo(() => {
        return blockchain.map((chain) => ({
            value: chain.name,
            label: chain.name
        }));
    }, [blockchain]);

    const fetchTokenStandard = async () => {
        try {
            const response = await getAPI("/api/gettokenstandards"); 
            const validTokenStandard = response.data.filter(
                token => token.name && typeof token.name === "string"
            );
            setTokenStandard(validTokenStandard);
            if (!validTokenStandard.length) {
                toast.error("No valid token standard found");
            }
        } catch (error) {
            console.error("Error fetching token standard:", error);
            toast.error("Failed to load token standard");
        }
    };

    useEffect(() => {
        fetchTokenStandard();
    }, []);

    const tokenStandardOptions = useMemo(() => {
        return tokenStandard.map((token) => ({
            value: token.name,
            label: token.name,
        }));
    }, [tokenStandard]);

    const mintingTypeOptions = [
        { value: 'pre_minted', label: 'Pre-Minted' },
        { value: 'lazy', label: 'Lazy Minting' }
    ];

    const licenseTypeOptions = [
        { value: 'personal', label: 'Personal Use Only' },
        { value: 'limited', label: 'Limited Commercial Use' },
        { value: 'full', label: 'Full Commercial Rights' },
        { value: 'exclusive', label: 'Exclusive Ownership' }
    ];

    const rarityOptions = [
        { value: 'common', label: 'Common' },
        { value: 'rare', label: 'Rare' },
        { value: 'epic', label: 'Epic' },
        { value: 'legendary', label: 'Legendary' }
    ];

    return (
        <>
            <h4 className="mb-3">NFT & Digital Art Listings</h4>

            <div className="card mb-4">
                <div className="card-header">
                    <h5>Blockchain & Smart Contract Details</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label htmlFor="blockchainNetwork">Blockchain Network <span className="text-danger">*</span></label>
                            <CreatableSelect
                                id="blockchainNetwork"
                                name="blockchainNetwork"
                                options={blockchainOptions}
                                value={formData.blockchainNetwork || null}
                                onChange={(selected) => handleSelectChange('blockchainNetwork', selected)}
                                isDisabled={isSubmitting}
                                required
                                isSearchable={true}
                                placeholder="Select or type to search..."
                                className="basic-multi-select"
                                classNamePrefix="select"
                                isClearable
                                onCreateOption={(inputValue) => {
                                    const newOption = { label: inputValue, value: inputValue };
                                    handleSelectChange('blockchainNetwork', newOption);
                                }}
                            />
                        </div>

                        <div className="col-md-6 form-group">
                            <label htmlFor="smartContractAddress">Smart Contract Address <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                id="smartContractAddress"
                                name="smartContractAddress"
                                className="form-control"
                                placeholder="0x..."
                                value={formData.smartContractAddress || ''}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="col-md-6 form-group">
                            <label htmlFor="tokenStandard">Token Standard <span className="text-danger">*</span></label>
                            <CreatableSelect
                                id="tokenStandard"
                                name="tokenStandard"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={tokenStandardOptions}
                                value={formData.tokenStandard || null}
                                onChange={(selected) => handleSelectChange('tokenStandard', selected)}
                                isDisabled={isSubmitting}
                                required
                                isSearchable={true}
                                isClearable
                                placeholder="Select or type to add a token standard..."
                                onCreateOption={(inputValue) => {
                                    const newOption = { label: inputValue, value: inputValue };
                                    handleSelectChange('tokenStandard', newOption);
                                }}
                            />
                        </div>

                        <div className="col-md-6 form-group">
                            <label htmlFor="tokenId">Token ID <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                id="tokenId"
                                name="tokenId"
                                className="form-control"
                                placeholder="Unique identifier"
                                value={formData.tokenId || ''}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="col-md-6 form-group">
                            <label htmlFor="walletAddress">Wallet Address of Creator <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                id="walletAddress"
                                name="walletAddress"
                                className="form-control"
                                placeholder="0x..."
                                value={formData.walletAddress || ''}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="col-md-6 form-group">
                            <label htmlFor="royaltyPercentage">Royalty Percentage <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    id="royaltyPercentage"
                                    name="royaltyPercentage"
                                    className="form-control"
                                    placeholder="e.g., 10"
                                    value={formData.royaltyPercentage || ''}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSubmitting}
                                    min="0"
                                    max="50"
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 form-group">
                            <label htmlFor="mintingType">Minting Type <span className="text-danger">*</span></label>
                            <select
                                id="mintingType"
                                name="mintingType"
                                className="form-control"
                                value={formData.mintingType?.value || ''}
                                onChange={(e) => {
                                    const selected = mintingTypeOptions.find(
                                        opt => opt.value === e.target.value
                                    );
                                    handleSelectChange('mintingType', selected);
                                }}
                                disabled={isSubmitting}
                                required
                            >
                                <option value="">Select Minting Type</option>
                                {mintingTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-header">
                    <h5>Licensing & Usage Rights</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label htmlFor="licenseType">License Type <span className="text-danger">*</span></label>
                            <select
                                id="licenseType"
                                name="licenseType"
                                className="form-control"
                                value={formData.licenseType?.value || ''}
                                onChange={(e) => {
                                    const selected = licenseTypeOptions.find(
                                        opt => opt.value === e.target.value
                                    );
                                    handleSelectChange('licenseType', selected);
                                }}
                                disabled={isSubmitting}
                                required
                            >
                                <option value="">Select License Type</option>
                                {licenseTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="d-flex align-items-center">
                                <span className="mr-2">IPFS Storage Link:</span>
                                <div className="custom-control custom-switch">
                                    <input
                                        type="checkbox"
                                        id="ipfsStorage"
                                        name="ipfsStorage"
                                        className="custom-control-input"
                                        checked={formData.ipfsStorage || false}
                                        onChange={(e) =>
                                            handleInputChange({ target: { name: "ipfsStorage", value: e.target.checked } })
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <label className="custom-control-label" htmlFor="ipfsStorage">
                                        {formData.ipfsStorage ? "Yes" : "No"}
                                    </label>
                                </div>
                            </label>
                        </div>

                        {formData.ipfsStorage && (
                            <>
                                <div className="col-md-6 form-group">
                                    <label htmlFor="ipfsLink">IPFS Link <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        id="ipfsLink"
                                        name="ipfsLink"
                                        className="form-control"
                                        placeholder="Enter IPFS link (e.g., ipfs://...)"
                                        value={formData.ipfsLink || ''}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label htmlFor="softwareVersion">Software Version</label>
                                    <input
                                        type="text"
                                        id="softwareVersion"
                                        name="softwareVersion"
                                        className="form-control"
                                        placeholder="e.g., v1.0.0"
                                        value={formData.softwareVersion || ''}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label htmlFor="fileFormat">File Format</label>
                                    <input
                                        type="text"
                                        id="fileFormat"
                                        name="fileFormat"
                                        className="form-control"
                                        placeholder="e.g., PNG, MP4"
                                        value={formData.fileFormat || ''}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </>
                        )}

                        <div className="col-md-6 form-group">
                            <label className="d-flex align-items-center">
                                <span className="mr-2">Unlockable Content?</span>
                                <div className="custom-control custom-switch">
                                    <input
                                        type="checkbox"
                                        id="unlockableContent"
                                        name="unlockableContent"
                                        className="custom-control-input"
                                        checked={formData.unlockableContent || false}
                                        onChange={(e) =>
                                            handleInputChange({ target: { name: "unlockableContent", value: e.target.checked } })
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <label className="custom-control-label" htmlFor="unlockableContent">
                                        {formData.unlockableContent ? "Yes" : "No"}
                                    </label>
                                </div>
                            </label>
                        </div>

                        {formData.unlockableContent && (
                            <div className="col-md-6 form-group">
                                <label htmlFor="unlockableContentLink">Unlockable Content Link <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    id="unlockableContentLink"
                                    name="unlockableContentLink"
                                    className="form-control"
                                    placeholder="Enter link to unlockable content (e.g., https://...)"
                                    value={formData.unlockableContentLink || ''}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header">
                    <h5>Collection Details</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label className="d-flex align-items-center">
                                <span className="mr-2">Part of a Collection?</span>
                                <div className="custom-control custom-switch">
                                    <input
                                        type="checkbox"
                                        id="partOfCollection"
                                        name="partOfCollection"
                                        className="custom-control-input"
                                        checked={formData.partOfCollection || false}
                                        onChange={(e) =>
                                            handleInputChange({ target: { name: "partOfCollection", value: e.target.checked } })
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <label className="custom-control-label" htmlFor="partOfCollection">
                                        {formData.partOfCollection ? "Yes" : "No"}
                                    </label>
                                </div>
                            </label>
                        </div>

                        {formData.partOfCollection && (
                            <>
                                <div className="col-md-6 form-group">
                                    <label htmlFor="collectionName">Collection Name <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        id="collectionName"
                                        name="collectionName"
                                        className="form-control"
                                        placeholder="e.g., Crypto Punks"
                                        value={formData.collectionName || ''}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label htmlFor="editionSize">Edition Size <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        id="editionSize"
                                        name="editionSize"
                                        className="form-control"
                                        placeholder="Total number of items in collection"
                                        value={formData.editionSize || ''}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        required
                                        min="1"
                                    />
                                </div>

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
                                    <label htmlFor="city">City</label>
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
                                    <label htmlFor="state">State/Province</label>
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
                                    <label htmlFor="country">Country</label>
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
                                    <label htmlFor="pincode">Pincode/Zipcode</label>
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
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header">
                    <h5>Rarity & Traits (For Collectible NFTs)</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label htmlFor="rarityType">Rarity Type <span className="text-danger">*</span></label>
                            <select
                                id="rarityType"
                                name="rarityType"
                                className="form-control"
                                value={formData.rarityType?.value || ''}
                                onChange={(e) => {
                                    const selected = rarityOptions.find(
                                        opt => opt.value === e.target.value
                                    );
                                    handleSelectChange('rarityType', selected);
                                }}
                                disabled={isSubmitting}
                                required
                            >
                                <option value="">Select Rarity Type</option>
                                {rarityOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6 form-group">
                            <label htmlFor="traits">Traits & Attributes <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                id="traits"
                                name="traits"
                                className="form-control"
                                placeholder="E.g., Background, Eyes, Accessories"
                                value={formData.traits || ''}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NFTDetails;