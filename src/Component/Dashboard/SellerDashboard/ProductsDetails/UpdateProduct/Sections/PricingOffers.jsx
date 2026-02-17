

import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import getAPI from "../../../../../../api/getAPI";
import GiftWrappingSection from "./GiftWrappingSection";

const installmentOptions = [
       { value: "Yearly", label: "Yearly" },
    { value: "Lifetime", label: "Lifetime" },
];

const PricingOffers = ({
    pricingData,
    finalPrice,
    isSubmitting,
    handlePricingChange,
    handleInstallmentDurationChange,
    mainCategoryId,
    subCategoryId,
    formData,
    setFormData,
    handleInputChange,
}) => {

    const [gstPercentage, setGstPercentage] = useState(pricingData.gstPercentage || 0);
    const [isLoadingGST, setIsLoadingGST] = useState(false);
    const [gstError, setGstError] = useState(null);
    const [marketPriceError, setMarketPriceError] = useState("");


    const [insuranceSettings, setInsuranceSettings] = useState(null);
    const [isLoadingInsurance, setIsLoadingInsurance] = useState(false);
    const [insuranceError, setInsuranceError] = useState(null);

    const [subcategory, setsubcategory] = useState(null);
    const [isLoadingsubcategory, setIsLoadingsubcategory] = useState(false);
    const [subcategoryError, setsubcategoryError] = useState(null);


    console.log("Sub CategoryId Is :-", subCategoryId)

    const fetchSubGSTData = async () => {
        if (!mainCategoryId) {
            if (!pricingData.includeGst) {
                setGstPercentage(0);
                handlePricingChange({ target: { name: "gstPercentage", value: 0 } });
            }
            return;
        }

        setIsLoadingGST(true);
        setGstError(null);

        try {
            const response = await getAPI(
                `/api/get-gst-setting?mainCategoryId=${mainCategoryId}`,
                {},
                true
            );

            if (!response.hasError && response.data && Array.isArray(response.data.data)) {
                const gstData = response.data.data.find(
                    (item) => item.mainCategoryId._id === mainCategoryId
                );

                if (gstData?.percentage && !pricingData.includeGst) {
                    setGstPercentage(gstData.percentage);
                    handlePricingChange({
                        target: { name: "gstPercentage", value: gstData.percentage },
                    });
                } else if (!pricingData.includeGst) {
                    setGstPercentage(0);
                    handlePricingChange({ target: { name: "gstPercentage", value: 0 } });
                }
            } else {
                setGstError("Invalid GST response");
                if (!pricingData.includeGst) {
                    setGstPercentage(0);
                    handlePricingChange({ target: { name: "gstPercentage", value: 0 } });
                }
            }
        } catch (err) {
            setGstError("Failed to fetch GST");
            if (!pricingData.includeGst) {
                setGstPercentage(0);
                handlePricingChange({ target: { name: "gstPercentage", value: 0 } });
            }
        } finally {
            setIsLoadingGST(false);
        }
    };


    const fetchInsuranceSettingData = async () => {
        if (!mainCategoryId) return;

        setIsLoadingInsurance(true);
        setInsuranceError(null);

        try {
            const response = await getAPI("/api/get-insurance-settings", {}, true);

            if (!response.hasError && response.data && Array.isArray(response.data.data)) {
                const setting = response.data.data.find(
                    (s) => s.mainCategoryId._id === mainCategoryId
                );
                setInsuranceSettings(setting || null);
            } else {
                setInsuranceError("Invalid insurance response");
            }
        } catch (err) {
            setInsuranceError("Failed to fetch insurance settings");
        } finally {
            setIsLoadingInsurance(false);
        }
    };

    useEffect(() => {
        if (mainCategoryId) {
            fetchSubGSTData();
            fetchInsuranceSettingData();
        }
    }, [mainCategoryId]);

    const fetchsubcategoryData = async () => {
        //   if (!subCategoryId) return;

        setIsLoadingsubcategory(true);
        setsubcategoryError(null);

        try {
            const response = await getAPI("/api/sub-category", {}, true);
            console.log("Subcategory API response:", response.data.data);

            if (!response.hasError && response.data && Array.isArray(response.data.data)) {

                const setting = response.data.data.find(
                    (s) => s.subCategoryId === subCategoryId
                );
                setsubcategory(setting || null);
                console.log("Setting", setting)
            } else {
                setsubcategoryError("Invalid subcategory response");
            }
        } catch (err) {
            setsubcategoryError("Failed to fetch sub category");
        } finally {
            setIsLoadingsubcategory(false);
        }
    };





    useEffect(() => {
        if (subCategoryId) {
            fetchsubcategoryData();
        }
    }, [subCategoryId]);

    // useEffect(() => {
    //     if (pricingData.includeGst) {
    //         setGstPercentage(0);
    //         handlePricingChange({ target: { name: "gstPercentage", value: 0 } });
    //     } else {
    //         fetchSubGSTData();
    //     }
    // }, [pricingData.includeGst]);

    useEffect(() => {
    if (pricingData.includeGst) {
        setGstPercentage(pricingData.gstPercentage || 0);
    } else {

        fetchSubGSTData();
    }
}, [pricingData.includeGst, pricingData.gstPercentage, mainCategoryId]);


    const validateMarketPrice = (market, selling) => {
        if (market && selling && Number(market) <= Number(selling)) {
            setMarketPriceError("Market price must be greater than selling price.");
        } else {
            setMarketPriceError("");
        }
    };

    const handleMarketPriceChange = (e) => {
        const value = e.target.value;
        handlePricingChange(e);
        validateMarketPrice(value, pricingData.sellingPrice);
    };


    const gstAmount = useMemo(() => {
        if (pricingData.includeGst || !gstPercentage) return 0;
        return (gstPercentage / 100) * finalPrice;
    }, [finalPrice, gstPercentage, pricingData.includeGst]);

    const priceWithGst = finalPrice + gstAmount;

    const insuranceInfo = useMemo(() => {
        if (
            !pricingData.allowInstallments ||
            !pricingData.installmentDuration?.value ||
            !insuranceSettings
        )
            return null;

        const duration = pricingData.installmentDuration.value;
        const config = insuranceSettings[duration === "yearly" ? "oneYear" : "lifeTime"];

        const base = Number(pricingData.sellingPrice) || 0;
        const percentage = config?.percentage || 0;
        const insuranceAmt = (percentage / 100) * base;

        const gstOnInsurance = config?.gst || 0;
        const gstAmt = (gstOnInsurance / 100) * insuranceAmt;

        return {
            percentage,
            amount: insuranceAmt,
            gstPercentage: gstOnInsurance,
            gstAmount: gstAmt,
            total: insuranceAmt + gstAmt,
        };
    }, [
        pricingData.allowInstallments,
        pricingData.installmentDuration,
        pricingData.sellingPrice,
        insuranceSettings,
    ]);

    const finalPriceWithEverything = priceWithGst + (insuranceInfo?.total || 0);

    useEffect(() => {
        handlePricingChange({
            target: { name: "finalPrice", value: finalPriceWithEverything.toFixed(2) }
        });
    }, [finalPriceWithEverything]);


    const commissionAmount = useMemo(() => {
        if (!subcategory?.commissionTerm || !finalPriceWithEverything) return 0;
        return (finalPriceWithEverything * Number(subcategory.commissionTerm)) / 100;
    }, [finalPriceWithEverything, subcategory?.commissionTerm]);

    return (
        <>
            <h4 className="mb-3">Pricing & Offers</h4>

            {(isLoadingGST || isLoadingInsurance || isLoadingsubcategory) && (
                <div className="alert alert-info">Loading …</div>
            )}
            {gstError && <div className="alert alert-danger">{gstError}</div>}
            {insuranceError && <div className="alert alert-danger">{insuranceError}</div>}
            {subcategoryError && <div className="alert alert-danger">{subcategoryError}</div>}

            { }
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="sellingPrice">
                            Selling Price (₹) <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="sellingPrice"
                            name="sellingPrice"
                            className="form-control"
                            placeholder="Enter selling price"
                            min="0"
                            step="0.01"
                            value={pricingData.sellingPrice}
                            onChange={(e) => {
                                handlePricingChange(e);
                                validateMarketPrice(pricingData.marketPrice, e.target.value);
                            }}

                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="marketPrice">Market Price (₹)</label>
                        <input
                            type="number"
                            id="marketPrice"
                            name="marketPrice"
                            className={`form-control ${marketPriceError ? "is-invalid" : ""}`}
                            placeholder="Enter market price"
                            min="0"
                            step="0.01"
                            value={pricingData.marketPrice}
                            onChange={handleMarketPriceChange}
                            disabled={isSubmitting}
                        />
                        <small className="text-muted">Original price for comparison</small>
                        {marketPriceError && (
                            <div className="invalid-feedback">{marketPriceError}</div>
                        )}
                    </div>
                </div>
            </div>

            { }

            {subcategory?.commissionTerm != null && (
                <div className="alert alert-info mt-2">
                    <strong>Commission Term Note:</strong> The Commission amount is ₹
                    <strong>{commissionAmount.toFixed(2)}</strong> (
                    {subcategory.commissionTerm}% of ₹{finalPriceWithEverything.toFixed(2)} base price)
                </div>
            )}

            { }

           
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="discount">Discount (%)</label>
                        <input
                            type="number"
                            id="discount"
                            name="discount"
                            className="form-control"
                            placeholder="Enter discount percentage"
                            min="0"
                            max="100"
                            step="0.1"
                            value={pricingData.discount}
                            onChange={handlePricingChange}
                            disabled={isSubmitting}
                        />
                    </div>
               
                </div>
                

                <div className="col-md-6">
                    <div className="form-group">
                        <label>
                            Final Price After Discount (₹) <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={`₹${finalPriceWithEverything.toFixed(2)}`}
                            readOnly
                        />
                        <small className="text-muted">
                            {pricingData.includeGst
                                ? "Includes GST"
                                : gstPercentage > 0
                                    ? `Includes GST (${gstPercentage}%)`
                                    : ""}
                            {insuranceInfo ? " + Insurance" : ""}
                        </small>
                    </div>
                </div>
            </div>
      { }
            {!pricingData.includeGst && gstPercentage > 0 && (
                <div className="alert alert-info mt-2">
                    <strong>GST Note:</strong> The final price includes a GST amount of ₹
                    {gstAmount.toFixed(2)} ({gstPercentage}% of ₹{finalPrice.toFixed(2)} base price),
                    resulting in ₹{priceWithGst.toFixed(2)}.
                </div>
            )}

            { }

            { }
            <div className="form-group form-check">
                <input
                    type="checkbox"
                    id="includeGst"
                    name="includeGst"
                    className="form-check-input"
                    checked={pricingData.includeGst}
                    onChange={handlePricingChange}
                    disabled={isSubmitting}
                />
                <label className="form-check-label" htmlFor="includeGst">
                    Include GST in Pricing
                </label>
            </div>
            

            { }
            <div className="form-group" style={{ paddingLeft: 0, marginLeft: 0 }}>
                <label htmlFor="gstPercentage">
                    GST Percentage (%) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    // type="number"
                    id="gstPercentage"
                    name="gstPercentage"
                    className="form-control"
                    placeholder="GST percentage"
                    min="0"
                    max="100"
                    step="0.1"
                    value={gstPercentage}
                    onChange={(e) => {
                        const val = e.target.value;
                        setGstPercentage(val ? Number(val) : 0);
                        handlePricingChange({ target: { name: "gstPercentage", value: val || 0 } });
                    }}
                    disabled={!pricingData.includeGst || isSubmitting}

                />
                <small className="text-muted">
                    {pricingData.includeGst
                        ? "Enter the GST percentage."
                        : "GST percentage is automatically set based on the main category."}
                </small>
            </div>

            

            { }
            <div className="form-group form-check">
                <input
                    type="checkbox"
                    id="allowInstallments"
                    name="allowInstallments"
                    className="form-check-input"
                    checked={pricingData.allowInstallments}
                    onChange={handlePricingChange}
                    disabled={isSubmitting}
                />
                <label className="form-check-label" htmlFor="allowInstallments">
                    Would you like to secure your product with insurance for lifetime or for a year?
                </label>
            </div>

            { }
            {pricingData.allowInstallments && (
                <div className="form-group" style={{ paddingLeft: 0, marginLeft: 0 }}>
                    <label htmlFor="installmentDuration">
                        Insurance Option <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                        id="installmentDuration"
                        options={installmentOptions}
                        value={pricingData.installmentDuration}
                        onChange={handleInstallmentDurationChange}
                        placeholder="Choose EMI duration"
                        isDisabled={isSubmitting}
                    />
                    <small>
                        <a href="/installment-details" target="_blank" rel="noopener noreferrer">
                            View Insurance Details
                        </a>
                    </small>
                </div>
            )}

            { }
            {insuranceInfo && (
                <div className="alert alert-success mt-3">
                    <strong>
                        Insurance ({insuranceInfo.percentage}% of selling price):
                    </strong>
                    <ul className="mb-0">
                        <li>Base insurance: ₹{insuranceInfo.amount.toFixed(2)}</li>
                        <li>
                            GST on insurance ({insuranceInfo.gstPercentage}%): ₹
                            {insuranceInfo.gstAmount.toFixed(2)}
                        </li>
                        <li>
                            <strong>Total insurance charge: ₹{insuranceInfo.total.toFixed(2)}</strong>
                        </li>
                    </ul>
                </div>
            )}

            <GiftWrappingSection
                formData={formData}
                isSubmitting={isSubmitting}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
            />

            <hr className="my-4" />
        </>
    );
};

export default PricingOffers;