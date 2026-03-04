

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";


  export default function ChatBox({ closeBox }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userName, setUserName] = useState(undefined);
    const [isSending, setIsSending] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const greeted = useRef(false);

    const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
    const userRole = typeof window !== 'undefined' ? localStorage.getItem("userrole") : null;

    useEffect(() => {
      let id = localStorage.getItem("arty_session_id");
      const lastActivity = localStorage.getItem("arty_last_activity");
      
      // If 15 minutes passed since last activity, clear session
      if (lastActivity && Date.now() - parseInt(lastActivity) > 15 * 60 * 1000) {
        id = null;
        localStorage.removeItem("arty_session_id");
        localStorage.removeItem("arty_last_activity");
      }

      if (!id) {
        id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("arty_session_id", id);
      }
      setSessionId(id);
      localStorage.setItem("arty_last_activity", Date.now().toString());
    }, []);


  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      if (!userId) {
        if (mounted) setUserName("");
        return;
      }
      try {
        const { data } = await axios.get(`http://localhost:3001/auth/user/${userId}`);
        if (mounted) setUserName(data?.name || "");
      } catch (err) {
        console.error(err);
        if (mounted) setUserName("");
      }
    };
    fetchUser();
    return () => { mounted = false; };
  }, [userId]);

    useEffect(() => {
      if (!sessionId) return;
      
      const fetchHistory = async () => {
        try {
          const { data } = await axios.get(`http://localhost:3001/api/gemini/session/${sessionId}`);
          if (data?.messages?.length > 0) {
            const formatted = data.messages.map(m => ({
              sender: m.role === 'arty' ? 'bot' : 'user',
              text: m.text,
              link: m.link,
              time: m.timestamp
            }));
            setMessages(formatted);
            greeted.current = true; // Skip greeting if history exists
            setShowSuggestions(false);
          }
        } catch (err) {
          console.error("Failed to fetch chat history:", err);
        }
      };
      
      fetchHistory();
    }, [sessionId]);

    useEffect(() => {
      if (userName === undefined) return;
      if (greeted.current || messages.length > 0) return;
      greeted.current = true;
  
      const greeting = userName 
        ? `Hey ${userName}! I'm Arty, your intelligent assistant for Artsays. How can I help you with our art collection or products today?`
        : "Hello! I'm Arty, your intelligent assistant for Artsays. How can I help you with our art collection or products today?";
      
      setMessages([{ sender: 'bot', text: greeting, time: new Date() }]);
    }, [userName, messages.length]);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages]);
  
    const sendMessage = async (prefilled) => {
      const text = (prefilled ?? input).trim();
      if (!text) return;
      if (!prefilled) setInput("");
  
      setMessages((m) => [...m, { sender: 'user', text, time: new Date() }]);
      setIsSending(true);
      setShowSuggestions(false);
      localStorage.setItem("arty_last_activity", Date.now().toString());
  
      try {
        const res = await axios.post("http://localhost:3001/api/gemini/ask", {
            question: text,
            sessionId: sessionId || localStorage.getItem("arty_session_id"),
            userId: userId || null,
            userRole: userRole || "guest"
          }, {
            headers: { "x-requested-with": "XMLHttpRequest" }
          });
          const reply = res.data?.answer || "I'm still learning and couldn't find the right information for this yet. You can raise a support ticket or talk to our team for accurate help.";
          const link = res.data?.link || null;
          // tiny delay
          await new Promise((r) => setTimeout(r, 350 + Math.random() * 350));
          setMessages((m) => [...m, { sender: 'bot', text: reply, link, time: new Date() }]);
        } catch (e) {
          setMessages((m) => [...m, { sender: 'bot', text: "I'm having trouble connecting right now. Please try again in a moment, or contact our support team directly.", time: new Date() }]);
      } finally {
        setIsSending(false);
      }
    };

  const handleCloseChat = async () => {
    try {
      const sid = sessionId || localStorage.getItem("arty_session_id");
      if (sid) {
        await axios.post("http://localhost:3001/api/gemini/close-session", { sessionId: sid });
      }
    } catch (e) {
      console.error("Failed to close Arty session:", e);
    }
    localStorage.removeItem("arty_session_id");
    localStorage.removeItem("arty_last_activity");
    setMessages([]);
    greeted.current = false;
    closeBox();
  };

  const formatTime = (d) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  const suggestions = [
    'How are COAs issued?',
    'Authenticate an artwork',
    'Selling my art on Artsays',
    'Contact support',
  ];

  return (
    <div className="fixed bottom-[75px] md:bottom-[110px] justify-self-center md:right-6 w-[90%] md:w-[420px] z-[9999]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 ring-1 ring-black/40">
        {/* Header */}
        <div className="flex items-center justify-between px-2 md:px-4 py-2 md:py-3 bg-[#48372D] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white font-bold"><img
              src="/assets/profile/Arty.png"
              alt="chat"
              className="rounded-lg"
              style={{ objectFit: "contain" }}
            /></div>
            <div>
              <div className="text-sm font-semibold text-white">Arty</div>
              <div className="text-xs text-white">Verified AI Assistant</div>
            </div>
          </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/30 mr-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                  <span className="text-xs text-white">Online</span>
                </div>
                {messages.length > 1 && (
                  <button 
                    onClick={handleCloseChat} 
                    className="text-[10px] bg-red-500/80 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                    title="End session and clear chat"
                  >
                    End Chat
                  </button>
                )}
                <button onClick={closeBox} className="text-white hover:text-white p-1 ml-1" title="Minimize">✕</button>
              </div>

        </div>

        {/* Body */}
        <div className="h-[300px] md:h-[250px] px-2 md:px-4 py-2 md:py-3 overflow-y-auto bg-[#ffffff]">
          <div className="flex flex-col gap-4">
            <AnimatePresence initial={false} mode="popLayout">
              {messages.map((m, idx) => {
                const user = m.sender === 'user';
                return (
                  <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex ${user ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] ${user ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-flex items-start gap-3 p-2 md:p-3 rounded-2xl ${user
                          ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "bg-white/6 backdrop-blur-sm border border-dark text-dark"
                          }`}
                      >
                        {/* Bot avatar (Arty) */}
                        {!user && (
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-rose-500 flex items-center justify-center border border-dark">
                            <img
                              src="/assets/profile/Arty.png"
                              alt="Arty"
                              className="w-[32px] h-[32px] object-cover block"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/assets/profile/default-arty.png";
                              }}
                            />
                          </div>
                        )}

                        <div>
                          {m.sender === "bot" ? (
                            <ReactMarkdown
                              children={m.text}
                              components={{
                                p: ({ children }) => <p className="m-0 text-sm leading-snug">{children}</p>,
                                li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
                              }}
                            />
                          ) : (
                            <div className="text-sm">{m.text}</div>
                          )}

                            <div className="mt-1 text-[11px] text-dark opacity-80">{formatTime(m.time)}</div>

                            {/* Redirect button */}
                            {m.sender === "bot" && m.link && (
                              <button
                                onClick={() => { navigate(m.link.url); closeBox(); }}
                                className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#48372D] text-white hover:opacity-90 transition-opacity"
                              >
                                {m.link.label} →
                              </button>
                            )}
                        </div>

                        {/* User avatar */}
                        {user && (
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-indigo-700 flex items-center justify-center">
                            <img
                              src="/assets/profile/user.png"
                              alt="You"
                              className="w-[32px] h-[32px] object-cover block"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/assets/profile/default-user.png";
                              }}
                            />
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}

              {isSending && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-semibold"><img
                    src="/assets/profile/Arty.png"
                    alt="Arty"
                    className="w-[32px] h-[32px] object-cover block border border-dark rounded-full"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/profile/default-arty.png";
                    }}
                  /></div>
                  <div className="px-3 py-2 rounded-2xl bg-white/6">
                    <span className="inline-block w-2 h-2 rounded-full bg-dark animate-bounce mr-1" />
                    <span className="inline-block w-2 h-2 rounded-full bg-dark animate-bounce delay-150 mr-1" />
                    <span className="inline-block w-2 h-2 rounded-full bg-dark animate-bounce delay-300" />
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="px-2 py-2 border-t border-dark bg-[#ffffff] flex gap-2 flex-wrap">
            {suggestions.map((s) => (
              <button key={s} onClick={() => sendMessage(s)} className="text-xs px-2 py-1 rounded-full border border-gray-300 hover:!border-gray-600 text-gray-700">{s}</button>
            ))}
          </div>
        )}

        {/* Footer / Input */}
        <div className="px-2 md:px-4 py-2 md:py-3 bg-[#48372D] to-transparent">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-2 md:gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Arty About Artworks, COA, Authentication..." className="flex-1 px-4 py-2 rounded-full bg-white/6 placeholder:text-white/50 text-dark text-sm outline-none" />
            <button type="submit" disabled={!input.trim() || isSending} className={`px-4 py-2 rounded-full text-sm font-semibold ${!input.trim() || isSending ? 'bg-[#ffffff] text-dark cursor-not-allowed' : 'bg-rose-500 text-white shadow-md'}`}>
              {isSending ? 'Working…' : 'Send'}
            </button>
          </form>
        </div>
      </motion.div>

      <style jsx>{`
        .animate-bounce { animation: chat-bounce 1s infinite; }
        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }
        @keyframes chat-bounce { 0%,80%,100%{ transform: translateY(0); opacity: .6 } 40%{ transform: translateY(-6px); opacity: 1 } }
      `}</style>
    </div>
  );
}


