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
    formData,
    setFormData,
    handleInputChange,
    readOnly,
    mainCategoryId,
    subCategoryId,
}) => {
    const [gstPercentage, setGstPercentage] = useState(pricingData.gstPercentage || 0);
    const [insuranceSettings] = useState(null);
    const [subcategory, setSubcategory] = useState(null);

    useEffect(() => {
        if (!mainCategoryId) return;
        const fetchGST = async () => {
            try {
                const response = await getAPI(`/api/get-gst-setting?mainCategoryId=${mainCategoryId}`, {}, true);
                if (!response.hasError && Array.isArray(response.data?.data)) {
                    const gstData = response.data.data.find(item => item.mainCategoryId._id === mainCategoryId);
                    if (gstData?.percentage && !pricingData.includeGst) {
                        setGstPercentage(gstData.percentage);
                    }
                }
            } catch {}
        };
        fetchGST();
    }, [mainCategoryId]);

    useEffect(() => {
        if (!subCategoryId) return;
        const fetchSubcategory = async () => {
            try {
                const response = await getAPI("/api/sub-category", {}, true);
                if (!response.hasError && Array.isArray(response.data?.data)) {
                    const setting = response.data.data.find(s => s.subCategoryId === subCategoryId);
                    setSubcategory(setting || null);
                }
            } catch {}
        };
        fetchSubcategory();
    }, [subCategoryId]);

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

    const commissionAmount = useMemo(() => {
        if (!subcategory?.commissionTerm || !finalPriceWithEverything) return 0;
        return (finalPriceWithEverything * Number(subcategory.commissionTerm)) / 100;
    }, [finalPriceWithEverything, subcategory?.commissionTerm]);

    return (
        <>
            <h4 className="mb-3">Pricing & Offers</h4>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>
                            Selling Price (₹) <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={`₹${Number(pricingData.sellingPrice || 0).toFixed(2)}`}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>Market Price (₹)</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={pricingData.marketPrice ? `₹${Number(pricingData.marketPrice).toFixed(2)}` : '—'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                        />
                        <small className="text-muted">Original price for comparison</small>
                    </div>
                </div>
            </div>

            {subcategory?.commissionTerm != null && (
                <div className="alert alert-info mt-2">
                    <strong>Commission Term Note:</strong> The Commission amount is ₹
                    <strong>{commissionAmount.toFixed(2)}</strong> (
                    {subcategory.commissionTerm}% of ₹{finalPriceWithEverything.toFixed(2)} base price)
                </div>
            )}

            {!pricingData.includeGst && gstPercentage > 0 && (
                <div className="alert alert-info mt-2">
                    <strong>GST Note:</strong> The final price includes a GST amount of ₹
                    {gstAmount.toFixed(2)} ({gstPercentage}% of ₹{finalPrice.toFixed(2)} base price),
                    resulting in ₹{priceWithGst.toFixed(2)}.
                </div>
            )}

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Discount (%)</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            value={pricingData.discount ? `${pricingData.discount}%` : '0%'}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
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
                            className="form-control bg-light font-weight-bold"
                            value={`₹${finalPriceWithEverything.toFixed(2)}`}
                            readOnly
                            style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
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

            <div className="form-group form-check">
                <input
                    type="checkbox"
                    id="includeGst"
                    name="includeGst"
                    className="form-check-input"
                    checked={pricingData.includeGst || false}
                    disabled={true}
                />
                <label className="form-check-label" htmlFor="includeGst">
                    Include GST in Pricing
                </label>
            </div>

            <div className="form-group">
                <label>
                    GST Percentage (%) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="text"
                    className="form-control bg-light"
                    value={`${gstPercentage}%`}
                    readOnly
                    style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
                />
                <small className="text-muted">
                    {pricingData.includeGst
                        ? "GST included in price."
                        : "GST percentage is automatically set based on the main category."}
                </small>
            </div>

            <div className="form-group form-check">
                <input
                    type="checkbox"
                    id="allowInstallments"
                    name="allowInstallments"
                    className="form-check-input"
                    checked={pricingData.allowInstallments || false}
                    disabled={true}
                />
                <label className="form-check-label" htmlFor="allowInstallments">
                    Would you like to secure your product with insurance for lifetime or for a year?
                </label>
            </div>

            {pricingData.allowInstallments && pricingData.installmentDuration && (
                <div className="form-group">
                    <label>
                        Insurance Option <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                        id="installmentDuration"
                        options={installmentOptions}
                        value={pricingData.installmentDuration}
                        onChange={() => {}}
                        placeholder="—"
                        isDisabled={true}
                        styles={{
                            control: (base) => ({ ...base, backgroundColor: '#e9ecef', opacity: 0.7 }),
                            singleValue: (base) => ({ ...base, color: '#495057' })
                        }}
                    />
                    <small>
                        <a href="/installment-details" target="_blank" rel="noopener noreferrer">
                            View Insurance Details
                        </a>
                    </small>
                </div>
            )}

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
                setFormData={setFormData}
                handleInputChange={handleInputChange}
                readOnly={readOnly}
            />

            <hr className="my-4" />
        </>
    );
};

export default PricingOffers;