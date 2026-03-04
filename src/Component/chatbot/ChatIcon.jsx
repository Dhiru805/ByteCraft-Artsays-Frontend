import React, { useState, useEffect, useRef } from "react";
import ChatBox from "./ChatBox";
import axios from "axios";

const ChatIcon = () => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("arty_unread_count");
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem("arty_unread_count", unreadCount.toString());
  }, [unreadCount]);

  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const lastActivityRef = useRef(Date.now());
  const lastReminderSentRef = useRef(0);
  const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;

  // Fetch history if session exists to enable inactivity reminders
  useEffect(() => {
    const sid = localStorage.getItem("arty_session_id");
    if (!sid) return;

    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/gemini/session/${sid}`);
        if (data?.messages?.length > 0) {
          const formatted = data.messages.map(m => ({
            sender: m.role === 'arty' ? 'bot' : 'user',
            text: m.text,
            link: m.link,
            time: m.timestamp
          }));
          setMessages(formatted);
          lastActivityRef.current = Date.now(); // Reset activity on initial load
          localStorage.setItem("arty_last_activity", lastActivityRef.current.toString());
        }
      } catch (err) {
        console.warn("ChatIcon: Failed to fetch chat history:", err);
      }
    };
    fetchHistory();
  }, []);

  const generateSessionId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const endSession = async () => {
    try {
      const sid = sessionId || localStorage.getItem("arty_session_id");
      if (sid) {
        await axios.post("http://localhost:3001/api/gemini/close-session", { sessionId: sid });
      }
    } catch (e) {
      console.warn("ChatIcon: Failed to close session —", e.message);
    }
    localStorage.removeItem("arty_session_id");
    localStorage.removeItem("arty_last_activity");
    setMessages([]);
    setUnreadCount(0);
    const newSid = generateSessionId();
    localStorage.setItem("arty_session_id", newSid);
    setSessionId(newSid);
    lastActivityRef.current = Date.now();
    setOpen(false);
  };

  // Sync with ChatBox messages if open
  const updateMessages = (newMessages) => {
    if (newMessages.length === 0) {
      // If someone sends [], they likely want to clear.
      // But we use endSession now for explicit closing.
      setMessages([]);
      setUnreadCount(0);
      return;
    }
    setMessages(newMessages);
    lastActivityRef.current = Date.now();
    localStorage.setItem("arty_last_activity", lastActivityRef.current.toString());
    if (!open && newMessages.length > messages.length) {
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.sender === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (open) setUnreadCount(0);
  }, [open]);

  useEffect(() => {
    let id = localStorage.getItem("arty_session_id");
    const lastActivity = localStorage.getItem("arty_last_activity");
    
    if (lastActivity && Date.now() - parseInt(lastActivity) > 15 * 60 * 1000) {
      id = null;
      localStorage.removeItem("arty_session_id");
      localStorage.removeItem("arty_last_activity");
    }

    if (!id) {
      id = generateSessionId();
      localStorage.setItem("arty_session_id", id);
    }
    setSessionId(id);
    lastActivityRef.current = parseInt(lastActivity || Date.now());
  }, []);

  // Inactivity Timers
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      const diff = now - lastActivityRef.current;

      // 15 Minutes: Auto-end
      if (diff >= 15 * 60 * 1000) {
        if (messages.length > 0) {
          endSession();
        }
      } 
      // 5 Minutes: Reminder
      else if (diff >= 5 * 60 * 1000 && (now - lastReminderSentRef.current) > 5 * 60 * 1000) {
        if (messages.length > 0) {
          const reminder = "Are You Still There? I'm Here If You Need Any Help With Artworks Or Our Services!";
          const newMsg = { sender: 'bot', text: reminder, time: new Date() };
          const updated = [...messages, newMsg];
          setMessages(updated);
          lastReminderSentRef.current = now;
          if (!open) setUnreadCount(prev => prev + 1);

          // Save reminder to DB if logged in
          if (userId) {
            try {
              const sid = sessionId || localStorage.getItem("arty_session_id");
              await axios.post("http://localhost:3001/api/gemini/save-message", {
                sessionId: sid,
                role: "arty",
                text: reminder,
                userId: userId
              });
            } catch (e) { console.error(e); }
          }
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [messages, sessionId, userId, open]);

  return (
    <>
      {/* Floating chat icon */}
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            zIndex: 99,
            cursor: "pointer"
          }}
          onClick={() => setOpen(!open)}
        >
          {/* Icon with Badge Wrapper */}
          <div style={{ position: "relative" }}>
            {/* Unread Badge */}
            {unreadCount > 0 && (
              <div style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                backgroundColor: "#ef4444",
                color: "white",
                borderRadius: "50%",
                minWidth: "20px",
                height: "20px",
                padding: "0 4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "11px",
                fontWeight: "bold",
                border: "2px solid white",
                zIndex: 100,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
              }}>
                {unreadCount}
              </div>
            )}

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
                width="60"
                height="60"
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Name Image - BOTTOM */}
          <img
            src="/assets/profile/ArtyN.png"
            alt="Name"
            className="hidden md:block"
            width="70"
            height="20"
            style={{
              width: "70px",
              objectFit: "contain"
            }}
          />
        </div>



      {/* Chat box */}
      {open && (
        <ChatBox 
          closeBox={() => setOpen(false)} 
          parentMessages={messages}
          parentSetMessages={updateMessages}
          parentSessionId={sessionId}
          endSession={endSession}
        />
      )}
    </>
  );
};

export default ChatIcon;
