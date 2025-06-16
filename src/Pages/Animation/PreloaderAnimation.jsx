"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PreloaderAnimation() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Inline @font-face */}
      <style jsx global>{`
        @font-face {
          font-family: 'Windhvi';
          src: url('/fonts/Windhvi.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000000",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            }}
          >
            <motion.div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: isMobile ? "column" : "row",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "16px" : "32px",
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 1, 0] }}
                transition={{ duration: 3, times: [0, 0.8, 1] }}
              >
                {[
                  { text: "Pioneering", isBold: false },
                  { text: "Creative", isBold: true },
                  { text: "Excellence", isBold: false },
                ].map((item, index) => (
                  <motion.p
                    key={item.text}
                    style={{
                      fontSize: isMobile ? "30px" : "39px",
                      color: "#d1d5db",
                      fontWeight: item.isBold ? "bold" : "100",
                      margin: 0,
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      textAlign: isMobile ? "center" : "left",
                    }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.5 + index * 0.4,
                      ease: "easeOut",
                    }}
                  >
                    {item.text}
                  </motion.p>
                ))}
              </motion.div>

              <motion.div
                style={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 3.5 }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <motion.div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "#6b4f36",
                      zIndex: 0,
                      height: isMobile ? "50px" : "70px",
                    }}
                    initial={{
                      width: "0%",
                      opacity: 0,
                    }}
                    animate={{
                      width: ["0%", "150%", "150%", "0%"],
                      height: isMobile ? ["50px", "50px", "30px", "30px"] : ["70px", "70px", "50px", "50px"],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: 3.5,
                      times: [0, 0.3, 0.7, 1],
                      ease: "easeInOut",
                    }}
                  />
                  <motion.p
                    style={{
                      fontSize: isMobile ? "36px" : "39px",
                      color: "#ffffff",
                      margin: 0,
                      zIndex: 1,
                      fontFamily: "Windhvi, sans-serif",
                      textAlign: "center",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 1] }}
                    transition={{
                      duration: 4,
                      delay: 4.5,
                      times: [0, 0.2, 0.8, 1],
                      ease: "easeOut",
                    }}
                  >
                    Artsays
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}