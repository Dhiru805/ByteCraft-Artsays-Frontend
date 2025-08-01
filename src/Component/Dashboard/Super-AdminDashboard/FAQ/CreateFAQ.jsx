import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../api/getAPI";
import postAPI from "../../../../api/postAPI";

const AddFAQ = ({ onClose, fetchSubFAQData }) => {
  const [step, setStep] = useState("faq-type");
  const [faqTypes, setFaqTypes] = useState([]);
  const [faqType, setFaqType] = useState("");
  const [isNewFaqType, setIsNewFaqType] = useState(false);
  const [faqRows, setFAQRows] = useState([{ question: "", answer: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFaqTypes = async () => {
      try {
        const response = await getAPI("/api/get-FAQ", {}, true);
        if (!response.hasError && response.data && Array.isArray(response.data.data)) {
          const uniqueFaqTypes = [...new Set(response.data.data.map(faq => faq.faqType))];
          setFaqTypes(uniqueFaqTypes);
        } else {
          toast.error("Failed to fetch FAQ types.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching FAQ types.");
      }
    };
    fetchFaqTypes();
  }, []);

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...faqRows];
    updatedRows[index][field] = value;
    setFAQRows(updatedRows);
  };

  const addRow = () => {
    setFAQRows([...faqRows, { question: "", answer: "" }]);
  };

  const removeRow = (index) => {
    if (faqRows.length > 1) {
      const updatedRows = faqRows.filter((_, i) => i !== index);
      setFAQRows(updatedRows);
    }
  };

  const handleProceed = () => {
    if (!faqType.trim()) {
      toast.error("Please select an existing FAQ type or enter a new one.");
      return;
    }
    setStep("questions-and-answers");
  };

  const handleBack = () => {
    setStep("faq-type");
  };

  const handleFaqTypeChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setIsNewFaqType(true);
      setFaqType("");
    } else {
      setIsNewFaqType(false);
      setFaqType(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validRows = faqRows.filter(
        (row) => row.question.trim() && row.answer.trim()
      );

      if (validRows.length === 0) {
        toast.error("Please provide at least one valid FAQ with a question and answer.");
        setLoading(false);
        return;
      }

      const faqData = validRows.map((row) => ({
        question: row.question.trim(),
        answer: row.answer.trim(),
        faqType: faqType.trim(),
      }));

      const response = await postAPI("/api/create-FAQ", faqData, {}, true);
      if (!response.hasError) {
        toast.success("FAQ(s) created successfully.");
        await fetchSubFAQData();
        onClose();
      } else {
        toast.error(`Failed to create FAQs: ${response.message}`);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message || "An error occurred while creating the FAQs.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add FAQs</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {step === "faq-type" && (
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="faqType" className="form-label">
                      FAQ Type
                    </label>
                    {isNewFaqType ? (
                      <input
                        type Jonstype="text"
                        className="form-control"
                        id="faqType"
                        value={faqType}
                        onChange={(e) => setFaqType(e.target.value)}
                        placeholder="Enter new FAQ Type"
                        required
                      />
                    ) : (
                      <select
                        className="form-control"
                        id="faqType"
                        value={faqType}
                        onChange={handleFaqTypeChange}
                        required
                      >
                        <option value="">Select FAQ Type</option>
                        {faqTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                        <option value="new">Add New FAQ Type</option>
                      </select>
                    )}
                  </div>
                  <div className="d-flex justify-content-end mt-3 mx-2">
                    <button
                      type="button"
                      className="btn btn-secondary mr-2"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleProceed}
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              )}
              {step === "questions-and-answers" && (
                <>
                  <div className="row mb-2">
                    <div className="col-md-12">
                      <p>
                        <strong>FAQ Type:</strong> {faqType}
                      </p>
                    </div>
                  </div>
                  {faqRows.map((row, index) => (
                    <div className="row mb-2" key={index}>
                      <div className="col-md-5">
                        <label htmlFor={`question-${index}`} className="form-label">
                          Question
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`question-${index}`}
                          value={row.question}
                          onChange={(e) => handleRowChange(index, "question", e.target.value)}
                          placeholder="Enter question"
                          required
                        />
                      </div>
                      <div className="col-md-5">
                        <label htmlFor={`answer-${index}`} className="form-label">
                          Answer
                        </label>
                        <textarea
                          className="form-control"
                          id={`answer-${index}`}
                          value={row.answer}
                          onChange={(e) => handleRowChange(index, "answer", e.target.value)}
                          placeholder="Enter answer"
                          required
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-end">
                        {faqRows.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm mr-2"
                            onClick={() => removeRow(index)}
                          >
                            <i className="fa fa-trash-o"></i>
                          </button>
                        )}
                        {index === faqRows.length - 1 && (
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={addRow}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-end mt-3 mx-2">
                    <button
                      type="button"
                      className="btn btn-secondary mr-2"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary mr-2"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add FAQs"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFAQ;