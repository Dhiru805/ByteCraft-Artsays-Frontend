"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PreloaderAnimation() {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1440;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 8000);
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
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      <style jsx global>{`
        @font-face {
          font-family: 'Windhvi';
          src: url('/fonts/Windhvi.ttf') format('truetype');
          font-display: swap;
        }
      `}</style>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              color: "#ffffff",
            }}
          >
            {/* Text Animation */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: isMobile ? "column" : "row",
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 3.2, duration: 0.6 }}
            >
              {[
                { text: "Pioneering", delay: 0 },
                { text: "Creative", delay: 0.4 },
                { text: "Excellence", delay: 0.8 },
              ].map((item, i) => (
                <motion.p
                  key={item.text}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{
                    delay: 0.8 + i * 0.4,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  style={{
                    fontSize: isMobile ? "36px" : "54px",
                    fontWeight: i === 1 ? "bold" : 100,
                    color: "#d1d5db",
                    margin: isMobile ? "0 0 8px 0" : "0 10px",
                    fontFamily: "system-ui, sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </motion.p>
              ))}
            </motion.div>

            {/* Reveal Box and Final Text */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                {/* Reveal Box (expanding and splitting) */}
                <motion.div
                  style={{
                    position: "absolute",
                    height: isMobile ? "40px" : "70px",
                    width: "100%",
                    top: "20%",
                    left: 0,
                    backgroundColor: "#FED8B1",
                    zIndex: 4,
                    transformOrigin: "left",
                    x: [ "0%", "0%", "-20%", "0%" ]
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{
                    scaleX: [0, 1, 1, 0],
                    opacity: [1, 1, 1, 1],
                    x: ["0%", "0%", "-10%", "20%"],
                  }}
                  transition={{
                    delay: 3.6,
                    duration: 1.0,
                    times: [0, 0.3, 0.5, 0.8, 1],
                    ease: "easeInOut",
                  }}
                />

                {/* Collapse Phase (into right) */}
                <motion.div
                  style={{
                    position: "absolute",
                    height: isMobile ? "40px" : "70px",
                    width: "100%",
                    top: "20%",
                    left: 0,
                    backgroundColor: "#FED8B1",
                    zIndex: 4,
                    transformOrigin: "right", 
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{
                    scaleX: [0, 0, 1, 0],
                    opacity: [1, 1, 1, 1],
                    x: ["0%", "0%", "-20%", "0%"],
                  }}
                  transition={{
                    delay: 3.9,
                    duration: 1.0,
                    times: [0, 0.3, 0.5, 0.8, 1],
                    ease: "easeInOut",
                  }}
                />

                {/* Final Brand Name Text */}
                <motion.p
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{
                    delay: 4.6, 
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                  style={{
                    fontSize: isMobile ? "42px" : "60px",
                    fontFamily: "Windhvi, sans-serif",
                    color: "#ffffff",
                    zIndex: 2,
                    margin: 0,
                    textAlign: "center",
                    whiteSpace: "nowrap",

                  }}
                >
                  Artsays.in
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
