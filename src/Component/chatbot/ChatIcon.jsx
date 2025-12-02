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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          zIndex: 99,
          cursor: "pointer"
        }}
        onClick={() => setOpen(!open)}
      >

        {/* Main Round Icon */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "28px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            overflow: "hidden",
            background: "black"
          }}
        >
          <img
            src="/assets/profile/ArtyW.png"
            alt="chat"
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        </div>

        {/* Name Image - BOTTOM */}
        <img
          src="/assets/profile/ArtyN.png"
          alt="Name"
          style={{
            width: "70px",
            objectFit: "contain"
          }}
        />

      </div>


      {/* Chat box */}
      {open && <ChatBox closeBox={() => setOpen(false)} />}
    </>
  );
};

export default ChatIcon;
