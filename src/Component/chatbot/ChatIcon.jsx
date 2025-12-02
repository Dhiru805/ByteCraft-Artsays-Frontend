import React, { useState } from "react";
import ChatBox from "./ChatBox";

const ChatIcon = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating chat icon */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#8e621aff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          cursor: "pointer",
          fontSize: "28px",
          zIndex: 9999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}
        onClick={() => setOpen(!open)}
      >
        💬
      </div>

      {/* Chat box */}
      {open && <ChatBox closeBox={() => setOpen(false)} />}
    </>
  );
};

export default ChatIcon;
