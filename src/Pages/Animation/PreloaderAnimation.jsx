"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PreloaderAnimation() {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 992;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 8800); // extended to allow blackout
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 999,
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <style jsx global>{`
        @font-face {
          font-family: "Windhvi";
          src: url("/fonts/Windhvi.ttf") format("truetype");
          font-display: swap;
        }
      `}</style>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              color: "#fff",
            }}
          >
            {/* Text Slide In-Out */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: isMobile ? "column" : "row",
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 3.2, duration: 0.6 }}
            >
              {["When Art Speaks,", "Value Grows", ""].map((word, index) => (
                <motion.p
                  key={word}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.8 + index * 0.4,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  style={{
                    fontSize: isMobile ? "24px" : "44px",
                    fontWeight: word === "Value Grows" ? 700 : 100,
                    color: "#d1d5db",
                    margin: isMobile ? "0 0 10px 0" : "0 10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {word}
                </motion.p>
              ))}
            </motion.div>

            {/* Reveal Box + Brand */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  padding: "0 40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Reveal Box Expand */}
                <motion.div
                  style={{
                    position: "absolute",
                    height: isMobile ? "30px" : "60px",
                    width: "100%",
                    top: "20%",
                    left: 0,
                    backgroundColor: "#FED8B1",
                    zIndex: 4,
                    transformOrigin: "left",
                  }}
                  initial={{ scaleX: 0, opacity: 1, x: 0 }}
                  animate={{
                    scaleX: [0, 0, 1, 0],
                    x: [0, 50, 50, 0], // moving while expanding
                  }}
                  transition={{
                    delay: 3.6,
                    duration: 1.2,
                    times: [0, 0.4, 0.7, 1],
                    ease: "easeInOut",
                  }}
                />

                {/* Reveal Box Collapse */}
                <motion.div
                  style={{
                    position: "absolute",
                    height: isMobile ? "30px" : "60px",
                    width: "100%",
                    top: "20%",
                    left: 0,
                    backgroundColor: "#FED8B1",
                    zIndex: 3,
                    transformOrigin: "right",
                  }}
                  initial={{ scaleX: 0, opacity: 1, x: 0 }}
                  animate={{
                    scaleX: [0, 0, 1, 0],
                    x: [0, -50, -50, 0],
                  }}
                  transition={{
                    delay: 4.2,
                    duration: 1.2,
                    ease: "easeInOut",
                    times: [0, 0.3, 0.6, 1],
                  }}
                />

                {/* Brand Text - Appear + Exit */}
                <motion.p
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{
                    delay: 5.2,
                    duration: 1.5,
                    ease: "easeOut",
                  }}
                  style={{
                    fontSize: isMobile ? "32px" : "54px",
                    fontFamily: "Windhvi, sans-serif",
                    color: "#ffffff",
                    zIndex: 5,
                    margin: 0,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Artsays.in
                </motion.p>
              </div>
            </motion.div>

            {/* Exit blackout after brand */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 1 }}
              transition={{ delay: 5.6, duration: 0.8, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#000000",
                zIndex: 10,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
