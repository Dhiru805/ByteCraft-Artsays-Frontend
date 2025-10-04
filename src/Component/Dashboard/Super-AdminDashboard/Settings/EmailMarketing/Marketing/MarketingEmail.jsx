import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import getAPI from "../../../../../../api/getAPI";
import postAPI from "../../../../../../api/postAPI";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as XLSX from "xlsx";
import { components } from "react-select";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";

const MarketingEmail = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mailTo: [],
    subject: "",
    content: "",
    attachments: [],
  });

  const [sending, setSending] = useState(false);
  const [emailOptions, setEmailOptions] = useState([]);
  const [editorMode, setEditorMode] = useState("wysiwyg");
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const quillRef = useRef(null);
  const importFileInputRef = useRef(null);
  const attachmentFileInputRef = useRef(null);
  const htmlEditorRef = useRef(null);
  const [filteredRole, setFilteredRole] = useState("all");
  const [allEmails, setAllEmails] = useState([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const SELECT_ALL_OPTION = { label: "Select All", value: "__select_all__" };


  const selectWrapperRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectWrapperRef.current &&
        !selectWrapperRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowRoleDropdown(false);
        setIsInputFocused(false);

        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const emailResponse = await getAPI("/api/get-allUserMail", {}, true);
        if (!emailResponse.hasError) {
          const users = emailResponse.data.data;
          setAllEmails(users);
          setEmailOptions([
            SELECT_ALL_OPTION,
            ...users.map((user) => ({
              label: user.email,
              value: user.email,
              role: user.role,
            })),
          ]);
        }

        const savedDraft = localStorage.getItem("emailDraft");
        if (savedDraft) {
          setFormData(JSON.parse(savedDraft));
        }
      } catch (err) {
        toast.error("Initialization error: " + err.message);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("emailDraft", JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  const sanitizeHtml = (html) => {
    if (typeof window !== "undefined") {
      return DOMPurify.sanitize(html);
    }
    return html;
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const isCSV = file.name.endsWith(".csv");
    const isExcel = file.name.endsWith(".xls") || file.name.endsWith(".xlsx");

    reader.onload = (e) => {
      let emails = [];

      if (isCSV) {
        emails = parseCSV(e.target.result);
      } else if (isExcel) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        emails = rows.map((row) => row[0]).filter(Boolean);
      }

      const validEmails = emails.filter(isValidEmail);
      if (validEmails.length === 0) {
        toast.warning("No valid emails found");
        return;
      }

      setEmailOptions((prev) => [
        ...prev,
        ...validEmails
          .map((email) => ({ label: email, value: email }))
          .filter((opt) => !prev.some((e) => e.value === opt.value)),
      ]);

      setFormData((prev) => ({
        ...prev,
        mailTo: [...new Set([...prev.mailTo, ...validEmails])],
      }));

      toast.success(`${validEmails.length} emails imported`);
    };

    if (isCSV) reader.readAsText(file);
    else if (isExcel) reader.readAsArrayBuffer(file);
    else toast.error("Unsupported file format");

    event.target.value = null;
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024;

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    setFormData((prev) => ({
      ...prev,
      attachments: [
        ...prev.attachments,
        ...validFiles.map((file) => ({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      ],
    }));

    e.target.value = null;
  };

  const toggleEditorMode = () => {
    if (editorMode === "wysiwyg") {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const html = quill.root.innerHTML;
        setFormData((prev) => ({ ...prev, content: html }));
      }
    } else {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(formData.content);
      }
    }
    setEditorMode((prev) => (prev === "wysiwyg" ? "html" : "wysiwyg"));
    setShowHtmlPreview(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mailTo.length) {
      toast.error("Please add at least one recipient");
      return;
    }

    if (!formData.subject.trim()) {
      toast.error("Subject is required");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Email content is required");
      return;
    }

    setSending(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("content", sanitizeHtml(formData.content));
      formData.mailTo.forEach((email) =>
        formDataToSend.append("mailTo[]", email)
      );
      formData.attachments.forEach((att) =>
        formDataToSend.append("attachments", att.file)
      );

      const response = await postAPI(
        "/api/send-email",
        formDataToSend,
        { "Content-Type": "multipart/form-data" },
        true
      );

      if (response.hasError) {
        throw new Error(response.message);
      }

      toast.success("Email sent successfully!");
      setFormData({
        mailTo: [],
        subject: "",
        content: "",
        attachments: [],
      });
      localStorage.removeItem("emailDraft");
    } catch (err) {
      toast.error("Failed to send: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
    const firstLine = lines[0].split(",").map((col) => col.trim().toLowerCase());
    const hasHeader = firstLine.includes("email");
    const startIndex = hasHeader ? 1 : 0;
    return lines.slice(startIndex).map((line) => line.split(",")[0]);
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const MultiValueContainer = ({ index, selectProps, data, children, ...props }) => {
    const limit = 6;
    const selected = selectProps.value || [];
    if (index >= limit) return null;
    return (
      <components.MultiValueContainer {...props} data={data} selectProps={selectProps}>
        {children}
      </components.MultiValueContainer>
    );
  };

  const ValueContainer = ({ children, ...props }) => {
    const selected = props.getValue();
    const limit = 6;

    let displayChildren = children;

    if (selected.length > limit) {
      const [values, input] = children;
      const moreLabel = (
        <div style={{ marginLeft: "6px", color: "#999" }}>
          +{selected.length - limit} more
        </div>
      );

      displayChildren = [
        React.Children.toArray(values).slice(0, limit),
        moreLabel,
        input,
      ];
    }

    return (
      <components.ValueContainer {...props}>
        {displayChildren}
      </components.ValueContainer>
    );
  };

  const DropdownIndicator = (props) => {
    if (!isInputFocused) return null;

    const handleToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => {
        setShowRoleDropdown((prev) => !prev);
      }, 0);
    };

    const isFiltered = filteredRole !== "all";

    return (
      <components.DropdownIndicator {...props}>
        <div
          onMouseDown={handleToggle}
          style={{
            cursor: "pointer",
            paddingRight: "6px",
            color: isFiltered ? "#0d6efd" : "#6c757d",
            fontSize: "16px",
          }}
        >
          <FaFilter />
        </div>
      </components.DropdownIndicator>
    );
  };

  const handleRoleFilterChange = (role) => {
    setFilteredRole(role);
    setShowRoleDropdown(false);
    const filteredUsers =
      role === "all" ? allEmails : allEmails.filter((u) => u.role === role);
    setEmailOptions([
      SELECT_ALL_OPTION,
      ...filteredUsers.map((u) => ({
        label: u.email,
        value: u.email,
        role: u.role,
      })),
    ]);
    setFormData((prev) => ({
      ...prev,
      mailTo:
        role === "all"
          ? prev.mailTo
          : prev.mailTo.filter((email) =>
            filteredUsers.some((u) => u.email === email)
          ),
    }));
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Marketing Email</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Marketing Email</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">
                To <span className="text-danger">*</span>
              </label>
              <div className="d-flex gap-2 align-items-center">
                <div style={{ width: "50%", position: "relative" }} ref={selectWrapperRef}>
                  <CreatableSelect
                    isMulti
                    isClearable
                    options={emailOptions}
                    onChange={(selectedOptions) => {
                      if (!selectedOptions) {
                        setFormData((prev) => ({ ...prev, mailTo: [] }));
                        return;
                      }

                      const includesSelectAll = selectedOptions.some(
                        (opt) => opt.value === "__select_all__"
                      );

                      if (includesSelectAll) {
                        const allEmails = emailOptions
                          .filter((opt) => opt.value !== "__select_all__")
                          .map((opt) => opt.value);

                        setFormData((prev) => ({
                          ...prev,
                          mailTo: allEmails,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          mailTo: selectedOptions.map((opt) => opt.value),
                        }));
                      }
                    }}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setIsInputFocused(false);
                        setShowRoleDropdown(false);
                      }, 200);
                    }}
                    className="email-select"
                    placeholder="Select or enter email addresses"
                    value={emailOptions.filter((o) => formData.mailTo.includes(o.value))}
                    components={{
                      MultiValueContainer,
                      ValueContainer,
                      DropdownIndicator,
                      Input: (props) => (
                        <components.Input
                          {...props}
                          innerRef={(ref) => {
                            inputRef.current = ref;
                            if (typeof props.innerRef === "function") props.innerRef(ref);
                            else if (props.innerRef) props.innerRef.current = ref;
                          }}
                        />
                      ),
                    }}
                  />
                  {showRoleDropdown && (
                    <div
                      onMouseDown={(e) => e.preventDefault()}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        zIndex: 1000,
                        width: "150px",
                      }}
                      className="mt-1 p-2"
                    >
                      {["all", "seller", "artist", "buyer"].map((role) => (
                        <div
                          key={role}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoleFilterChange(role);
                          }}
                          style={{
                            padding: "4px 8px",
                            cursor: "pointer",
                            background:
                              filteredRole === role ? "#f0f0f0" : "transparent",
                          }}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-primary ml-2"
                    onClick={() => importFileInputRef.current.click()}
                  >
                    Import Emails
                  </button>
                  <input
                    type="file"
                    ref={importFileInputRef}
                    onChange={handleFileImport}
                    accept=".csv,.xlsx,.xls"
                    hidden
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="form-group mt-5">
              <label>
                Subject <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                placeholder="Enter subject"
              />
            </div>

            <div className="form-group mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <label className="mb-0 mt-3">Email Message</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm mt-3 mr-3"
                    onClick={() => attachmentFileInputRef.current.click()}
                  >
                    Add Attachments
                  </button>
                  <input
                    type="file"
                    ref={attachmentFileInputRef}
                    onChange={handleAttachmentChange}
                    multiple
                    hidden
                  />

                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm mt-3"
                    onClick={toggleEditorMode}
                  >
                    {editorMode === "wysiwyg"
                      ? "Switch to HTML Editor"
                      : "Switch to Text Editor"}
                  </button>
                </div>
              </div>

              {/* Editor */}
              {editorMode === "wysiwyg" ? (
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={(content, _, __, editor) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: editor.getHTML(),
                    }))
                  }
                  className="quill-editor-custom mt-2"
                />
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary mb-2 mt-2"
                    onClick={() => setShowHtmlPreview(!showHtmlPreview)}
                  >
                    {showHtmlPreview ? "Edit HTML" : "Preview Email"}
                  </button>
                  {showHtmlPreview ? (
                    <div
                      className="border p-3 bg-white"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(formData.content),
                      }}
                      onClick={(e) => {
                        if (e.target.tagName === "A") {
                          e.preventDefault();
                          window.open(e.target.href, "_blank");
                        }
                      }}
                    />
                  ) : (
                    <textarea
                      className="form-control"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      rows={10}
                    />
                  )}
                </>
              )}
            </div>

            {/* Attachment preview */}
            {formData.attachments.length > 0 && (
              <div className="mb-3">
                <label>Attachments</label>
                <div className="d-flex flex-wrap gap-2">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="bg-light p-2 rounded d-flex align-items-center"
                    >
                      <span className="me-2">{file.name}</span>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            attachments: prev.attachments.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card-footer d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MarketingEmail;
