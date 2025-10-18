import React, { useState } from "react";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";

const SendTestMail = ({ show, onClose,formData }) => {
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleTestMail = async (e) => {
    e.preventDefault();

    // if (!formData.is_active) {
    //   toast.error("Email settings are disabled. Enable them to send a test email.");
    //   return;
    // }

    if (!testEmail) {
      toast.error("Please enter a test email address.");
      return;
    }

    setSending(true);

    try {
      const response = await postAPI("/api/send-test-email", { to: testEmail });
      console.log("response", response.data);

      if (response.data) {
        toast.success(`Test mail sent successfully to ${testEmail}`);
        setTestEmail("");
        onClose();
      } else {
        toast("Failed to send test mail.");
      }
    } catch (err) {
      toast.error("Failed to send test mail.");
      // toast.err("Failed to send test mail.");
    } finally {
      setSending(false);
    }
  };
  return (
    show && (
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Send Test Mail</h5>
              {/* <button type="button" className="btn-close" onClick={onClose}></button> */}
              <button
                className="btn"
                onClick={onClose}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "1.0rem",
                }}

              >
                &#x2715;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleTestMail(e)}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    E-Mail Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter E-Mail Address"
                    required
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
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
                    disabled={sending}
                  >
                    {sending ? "Sending Test Mail..." : "Send Test Mail"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SendTestMail;