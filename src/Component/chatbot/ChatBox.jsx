import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBox.css";

const ChatBox = ({ closeBox }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState(undefined); // undefined = loading
  const messagesEndRef = useRef(null);
  const greetingShown = useRef(false);

  const userId = localStorage.getItem("userId");

  // 1️⃣ Fetch username
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setUserName(""); // means no user
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3001/auth/user/${userId}`
        );
        const user = response.data;
        setUserName(user?.name || "");
      } catch (error) {
        console.error("Error loading user:", error);
        setUserName("");
      }
    };
    fetchUser();
  }, [userId]);

  // 2️⃣ Show greeting AFTER username loads
  useEffect(() => {
    if (userName === undefined) return; // wait for loading
    if (greetingShown.current) return;

    greetingShown.current = true;

    const sendGreeting = async () => {
      try {
        const endpoint = "http://localhost:3001/api/knowledge/search";
        const res = await axios.get(`${endpoint}?query=`);
        const base = res.data?.answer || "How can I help you today?";

        let greeting = "";

        if (userName && userName.length > 0) {
          greeting = `Hello ${userName}, ${base}`;
        } else {
          greeting = `Hello, ${base}`;
        }

        setMessages([{ sender: "bot", text: greeting }]);
      } catch (error) {
        setMessages([{ sender: "bot", text: "Server error. Please try again later." }]);
      }
    };

    sendGreeting();
  }, [userName]);

  // 3️⃣ Keep scroll at bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4️⃣ Sending user message
  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input },
    ]);

    try {
      const endpoint = "http://localhost:3001/api/knowledge/search";
      const res = await axios.get(
        `${endpoint}?query=${encodeURIComponent(input)}`
      );

      const botReply =
        res.data?.answer || "Sorry, I don't have information on that.";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error. Please try again later." },
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        Chat with Arty
        <span className="close-btn" onClick={closeBox}>✖</span>
      </div>

      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-row ${
              msg.sender === "user" ? "right" : "left"
            } animate-message`}
          >
            {/* 5️⃣ Username shown instead of "You" */}
            <div className="message-name">
              {msg.sender === "user"
                ? userName || "You"
                : "Arty"}
            </div>

            <div className="message-with-avatar">
              <img
                src={
                  msg.sender === "user"
                    ? "/assets/profile/user.png"
                    : "/assets/profile/arty.jpg"
                }
                alt={
                  msg.sender === "user"
                    ? userName || "You"
                    : "Arty"
                }
                className="message-avatar floating-avatar"
              />

              <span className={`message-bubble ${msg.sender}`}>
                {msg.sender === "bot" ? (
                  <ReactMarkdown
                    children={msg.text}
                    components={{
                      p: (props) => (
                        <p style={{ margin: "4px 0" }} {...props} />
                      ),
                      li: (props) => (
                        <li style={{ margin: "2px 0" }} {...props} />
                      ),
                    }}
                  />
                ) : (
                  msg.text
                )}
              </span>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="chatbox-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your question..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
