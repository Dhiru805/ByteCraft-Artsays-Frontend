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
                            <label>Blockchain Network <span className="text-danger">*</span></label>
                            <CreatableSelect
                                id="blockchainNetwork"
                                name="blockchainNetwork"
                                options={blockchainOptions}
                                value={formData.blockchainNetwork || null}
                                onChange={() => {}}
                                isDisabled={true}
                                isSearchable={false}
                                placeholder="—"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                isClearable={false}
                                styles={{
                                    control: (base) => ({ ...base, backgroundColor: '#e9ecef', opacity: 0.7 }),
                                    singleValue: (base) => ({ ...base, color: '#495057' })
                                }}
                            />
                        </div>

                        <div className="col-md-6 form-group">
                            <label>Smart Contract Address <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                id="smartContractAddress"
                                name="smartContractAddress"
                                className="form-control"
                                placeholder="0x..."
                                value={formData.smartContractAddress || ''}
                                disabled={true}
                                style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                            />
                        </div>

                        <div className="col-md-6 form-group">
                            <label>Token Standard <span className="text-danger">*</span></label>
                            <CreatableSelect
                                id="tokenStandard"
                                name="tokenStandard"
                                options={tokenStandardOptions}
                                value={formData.tokenStandard || null}
                                onChange={() => {}}
                                isDisabled={true}
                                isSearchable={false}
                                isClearable={false}
                                placeholder="—"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={{
                                    control: (base) => ({ ...base, backgroundColor: '#e9ecef', opacity: 0.7 }),
                                    singleValue: (base) => ({ ...base, color: '#495057' })
                                }}
                            />
                        </div>

                        <div className="col-md-6 form-group">
                            <label>Token ID <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                id="tokenId"
                                name="tokenId"
                                className="form-control"
                                placeholder="Unique identifier"
                                value={formData.tokenId || ''}
                                disabled={true}
                                style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                            />
                        </div>

                        <div className="col-md-6 form-group">
                            <label>Wallet Address of Creator <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                id="walletAddress"
                                name="walletAddress"
                                className="form-control"
                                placeholder="0x..."
                                value={formData.walletAddress || ''}
                                disabled={true}
                                style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                            />
                        </div>

                        <div className="col-md-6 form-group">
                            <label>Royalty Percentage <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    id="royaltyPercentage"
                                    name="royaltyPercentage"
                                    className="form-control"
                                    placeholder="e.g., 10"
                                    value={formData.royaltyPercentage || ''}
                                    disabled={true}
                                    min="0"
                                    max="50"
                                    style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 form-group">
                            <label>Minting Type <span className="text-danger">*</span></label>
                            <select
                                id="mintingType"
                                name="mintingType"
                                className="form-control"
                                value={formData.mintingType?.value || ''}
                                disabled={true}
                                style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                            >
                                <option value="">{formData.mintingType?.label || '—'}</option>
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
                            <label>License Type <span className="text-danger">*</span></label>
                            <select
                                id="licenseType"
                                name="licenseType"
                                className="form-control"
                                value={formData.licenseType?.value || ''}
                                disabled={true}
                                style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                            >
                                <option value="">{formData.licenseType?.label || '—'}</option>
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
                                        disabled={true}
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
                                    <label>IPFS Link <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        id="ipfsLink"
                                        name="ipfsLink"
                                        className="form-control"
                                        placeholder="Enter IPFS link"
                                        value={formData.ipfsLink || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Software Version</label>
                                    <input
                                        type="text"
                                        id="softwareVersion"
                                        name="softwareVersion"
                                        className="form-control"
                                        placeholder="e.g., v1.0.0"
                                        value={formData.softwareVersion || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>File Format</label>
                                    <input
                                        type="text"
                                        id="fileFormat"
                                        name="fileFormat"
                                        className="form-control"
                                        placeholder="e.g., PNG, MP4"
                                        value={formData.fileFormat || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
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
                                        disabled={true}
                                    />
                                    <label className="custom-control-label" htmlFor="unlockableContent">
                                        {formData.unlockableContent ? "Yes" : "No"}
                                    </label>
                                </div>
                            </label>
                        </div>

                        {formData.unlockableContent && (
                            <div className="col-md-6 form-group">
                                <label>Unlockable Content Link <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    id="unlockableContentLink"
                                    name="unlockableContentLink"
                                    className="form-control"
                                    placeholder="Enter link to unlockable content"
                                    value={formData.unlockableContentLink || ''}
                                    disabled={true}
                                    style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
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
                                        disabled={true}
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
                                    <label>Collection Name <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        id="collectionName"
                                        name="collectionName"
                                        className="form-control"
                                        placeholder="e.g., Crypto Punks"
                                        value={formData.collectionName || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Edition Size <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        id="editionSize"
                                        name="editionSize"
                                        className="form-control"
                                        placeholder="Total number of items"
                                        value={formData.editionSize || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                        min="1"
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Address Line 1</label>
                                    <input
                                        type="text"
                                        id="addressLine1"
                                        name="addressLine1"
                                        className="form-control"
                                        placeholder="Street address"
                                        value={formData.addressLine1 || profileData.address?.line1 || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Address Line 2</label>
                                    <input
                                        type="text"
                                        id="addressLine2"
                                        name="addressLine2"
                                        className="form-control"
                                        placeholder="Apartment, suite"
                                        value={formData.addressLine2 || profileData.address?.line2 || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Landmark</label>
                                    <input
                                        type="text"
                                        id="landmark"
                                        name="landmark"
                                        className="form-control"
                                        placeholder="Nearby location"
                                        value={formData.landmark || profileData.address?.landmark || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        className="form-control"
                                        placeholder="City name"
                                        value={formData.city || profileData.address?.city || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>State/Province</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        className="form-control"
                                        placeholder="State or province"
                                        value={formData.state || profileData.address?.state || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        className="form-control"
                                        placeholder="Country name"
                                        value={formData.country || profileData.address?.country || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                                    />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Pincode/Zipcode</label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        className="form-control"
                                        placeholder="Postal code"
                                        value={formData.pincode || profileData.address?.pincode || ''}
                                        disabled={true}
                                        style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
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
                            <label>Rarity Type <span className="text-danger">*</span></label>
                            <select
                                id="rarityType"
                                name="rarityType"
                                className="form-control"
                                value={formData.rarityType?.value || ''}
                                disabled={true}
                                style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                            >
                                <option value="">{formData.rarityType?.label || '—'}</option>
                            </select>
                        </div>

                        <div className="col-md-6 form-group">
                            <label>Traits & Attributes <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                id="traits"
                                name="traits"
                                className="form-control"
                                placeholder="E.g., Background, Eyes"
                                value={formData.traits || ''}
                                disabled={true}
                                style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NFTDetails;