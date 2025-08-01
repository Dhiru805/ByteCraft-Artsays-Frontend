import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../api/getAPI";
import putAPI from "../../../../api/putAPI";

const EditFAQModal = ({ isOpen, onClose, faq, fetchSubFAQData }) => {
  const [faqTypes, setFaqTypes] = useState([]);
  const [faqType, setFaqType] = useState("");
  const [isNewFaqType, setIsNewFaqType] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
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

  useEffect(() => {
    if (faq) {
      setFaqType(faq.faqType || "");
      setIsNewFaqType(false);
      setQuestion(faq.question || "");
      setAnswer(faq.answer || "");
    }
  }, [faq]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!faqType.trim()) {
        toast.error("Please select an existing FAQ type or enter a new one.");
        setLoading(false);
        return;
      }
      if (!question.trim()) {
        toast.error("Please enter a question.");
        setLoading(false);
        return;
      }
      if (!answer.trim()) {
        toast.error("Please enter an answer.");
        setLoading(false);
        return;
      }

      const response = await putAPI(
        `/api/update-FAQ/${faq._id}`,
        {
          question: question.trim(),
          answer: answer.trim(),
          faqType: faqType.trim(),
        },
        {},
        true
      );

      if (!response.hasError) {
        toast.success("FAQ updated successfully!");
        await fetchSubFAQData();
        onClose();
      } else {
        toast.error(response.message || "Failed to update FAQ.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update FAQ</h5>
            <button
              className="btn"
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.0rem",
              }}
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="row mb-2 ml-2">
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">FAQ Type</label>
                  {isNewFaqType ? (
                    <input
                      type="text"
                      className="form-control"
                      value={faqType}
                      onChange={(e) => setFaqType(e.target.value)}
                      placeholder="Enter new FAQ type"
                      required
                    />
                  ) : (
                    <select
                      className="form-control"
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
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Question</label>
                  <input
                    type="text"
                    className="form-control"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter question"
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Answer</label>
                  <textarea
                    className="form-control"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter answer"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFAQModal;