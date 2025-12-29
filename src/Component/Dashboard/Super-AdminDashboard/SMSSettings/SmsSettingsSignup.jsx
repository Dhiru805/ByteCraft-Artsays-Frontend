import React, { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import getAPI from "../../../../api/getAPI";
import postAPI from "../../../../api/postAPI";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;
const TYPE = "signup-sms";


export default function SmsSettings() {
  const [settings, setSettings] = useState({
    type: TYPE,
    apiUrl: "",
    username: "",
    password: "",
    senderId: "",
    dltContentId: "",
    unicode: false,
    isActive: false,
    signupTemplate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testMobile, setTestMobile] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [testSending, setTestSending] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAPI(`${API_BASE}/api/get-sms-settings/${TYPE}`);

      if (res.data && !res.data.hasError && res.data.data) {
        const data = res.data.data;
        setSettings({
          type: data.type || TYPE,
          apiUrl: data.apiUrl || "",
          username: data.username || "",
          password: data.password || "",
          senderId: data.senderId || "",
          dltContentId: data.dltContentId || "",
          unicode: data.unicode === true,
          isActive: data.isActive === true,
          signupTemplate: data.signupTemplate || "",
        });


        setTestMessage(data.signupTemplate || "");
      } else {
        setSettings(prev => ({ ...prev, isActive: false }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load SMS settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));


    if (name === "signupTemplate") {
      setTestMessage(value);
    }
  };

  const handleSave = async () => {
    if (
      !settings.apiUrl ||
      !settings.username ||
      !settings.password ||
      !settings.senderId ||
      !settings.dltContentId ||
      !settings.signupTemplate?.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    setSaving(true);
    try {
      await postAPI(`${API_BASE}/api/save-sms-settings`, {
        Type: TYPE,
        ...settings,
      });

      toast.success("School SMS settings saved!");
      fetchSettings();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTestSms = async () => {
    if (!testMobile.trim()) return toast.error("Enter mobile number");
    let mobile = testMobile.replace(/\D/g, "").replace(/^(91|\+91)/, "");
    if (mobile.length !== 10) return toast.error("Enter valid 10-digit mobile");

    if (!settings.apiUrl || !settings.senderId) {
      return toast.error("Save SMS settings first before testing");
    }

    if (!settings.isActive) {
      return toast.error("SMS gateway is disabled. Enable it first.");
    }

    setTestSending(true);
    try {
      const res = await postAPI(`${API_BASE}/api/send-test-sms`, {
        Type: TYPE,
        mobile,
        message: testMessage,
      });

      if (res.data && !res.data.hasError) {
        toast.success(`Test SMS sent to ${mobile}!`);
        setTestMobile("");
      } else {
        toast.error(res.data?.message || "SMS failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Network error");
    } finally {
      setTestSending(false);
    }
  };


  if (loading) {
    return (
      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>SMS Settings</h2>
              { }
            </div>
          </div>
        </div>
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="body text-center p-5">Loading SMS Settings...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      { }
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>SMS Settings</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><a href="/"><i className="fa fa-dashboard"></i></a></li>
              <li className="breadcrumb-item active">SMS Settings</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">

              { }
              <div className={`alert ${settings.isActive ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: '24px' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5>SMS Status</h5>
                    <p className="mb-0 small">
                      {settings.isActive ? "Active – SMS will be sent" : "Inactive – No SMS"}
                    </p>
                  </div>
                  { }
                  <label style={{ position: "relative", display: "inline-block", width: "60px", height: "34px" }}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={settings.isActive}
                      onChange={handleChange}
                      style={{ opacity: 0 }}
                    />
                    <span style={{
                      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: settings.isActive ? "#22c55e" : "#ef4444",
                      transition: ".4s", borderRadius: "34px"
                    }} />
                    <span style={{
                      position: "absolute", height: "26px", width: "26px",
                      left: settings.isActive ? "30px" : "4px", top: "4px",
                      backgroundColor: "white", transition: ".4s", borderRadius: "50%"
                    }} />
                  </label>
                </div>
              </div>

              { }
              <div className="row">
                { }
                { }
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">API URL <span className="text-danger">*</span></label>
                    <input type="text" name="apiUrl" value={settings.apiUrl} onChange={handleChange} className="form-control" required />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Username <span className="text-danger">*</span></label>
                    <input type="text" name="username" value={settings.username} onChange={handleChange} className="form-control" required />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Password <span className="text-danger">*</span></label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={settings.password}
                        onChange={handleChange}
                        className="form-control"
                        style={{ paddingRight: '44px' }}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: "12px", top: "7px", background: "none", border: "none" }}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Sender ID (6 chars) <span className="text-danger">*</span></label>
                    <input type="text" name="senderId" value={settings.senderId} onChange={handleChange} maxLength={6} className="form-control" required />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">DLT Content ID <span className="text-danger">*</span></label>
                    <input type="text" name="dltContentId" value={settings.dltContentId} onChange={handleChange} className="form-control" required />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Language</label>
                    <select name="unicode" value={settings.unicode} onChange={handleChange} className="form-control">
                      <option value={false}>English</option>
                      <option value={true}>Unicode (Hindi/Regional)</option>
                    </select>
                  </div>
                </div>
              </div>

              { }
              <hr />
              <h5 className="mb-3">Signup SMS Template <span className="text-danger">*</span></h5>
              <div className="form-group mb-4">
                <textarea
                  name="signupTemplate"
                  rows={5}
                  value={settings.signupTemplate}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Use {#var#} as placeholder for OTP/code"
                />
                <small className="text-muted">
                  Use <code>{`{#var#}`}</code> where the OTP/code should appear.
                </small>
              </div>

              <hr />

              { }
              <h5 className="mb-3">Send Test SMS</h5>
              <div className="row align-items-end">
                <div className="col-md-5">
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      placeholder="Mobile number (10 digits)"
                      value={testMobile}
                      onChange={(e) => setTestMobile(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="form-group mb-3">
                    <textarea
                      rows={3}
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      className="form-control"
                      placeholder="Test message (defaults to saved template)"
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleTestSms}
                    disabled={testSending || !settings.isActive}
                  >
                    {testSending ? "Sending..." : "Send Test SMS"}
                  </button>
                </div>
              </div>

              { }
              <div className="text-end mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}