// src/pages/IntroScreen.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function IntroScreen() {
  const navigate = useNavigate();
  const [typedTagline, setTypedTagline] = useState("");
  const [taglineDone, setTaglineDone] = useState(false);

  const fullTagline = "Healthcare. Simplified.";

  // Typewriter effect triggered after Logo & Title finish animating (~1.4s in)
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < fullTagline.length) {
          setTypedTagline(fullTagline.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setTaglineDone(true);
        }
      }, 55); // ~1.2 seconds for full string
      return () => clearInterval(interval);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #FFFFFF 0%, #F5FAFF 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "40px 24px",
      fontFamily: "var(--font-sans)",
      color: "#1F2937",
      position: "relative",
      overflow: "hidden",
      userSelect: "none"
    }}>
      {/* Subtle, calm ambient background lighting */}
      <div style={{
        position: "absolute",
        top: "-15%",
        right: "-10%",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(24, 119, 242, 0.05) 0%, rgba(24, 119, 242, 0) 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-15%",
        left: "-10%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(24, 119, 242, 0.04) 0%, rgba(24, 119, 242, 0) 70%)",
        pointerEvents: "none"
      }} />

      {/* Top OS Security Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          borderRadius: "999px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #DCEBFF",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "#6B7280",
          boxShadow: "0 2px 8px rgba(0,0,0,0.015)",
          zIndex: 10
        }}
      >
        <ShieldCheck size={14} color="#1877F2" />
        <span>MediSlot OS v2.0 • Enterprise Healthcare Vault</span>
      </motion.div>

      {/* Main Center Stage (Logo -> Name -> Typewriter -> Subtext -> Continue) */}
      <div style={{
        maxWidth: "480px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        margin: "auto 0",
        zIndex: 10
      }}>
        {/* 1. Logo Fades In */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 88,
            height: 88,
            borderRadius: "24px",
            backgroundColor: "#1877F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
            boxShadow: "0 16px 40px rgba(24, 119, 242, 0.26)"
          }}
        >
          <svg
            width={50}
            height={50}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M 50 22 L 50 78"
              stroke="#FFFFFF"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M 22 50 L 78 50"
              stroke="#FFFFFF"
              strokeWidth="20"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* 2. "MediSlot" Slides Upward */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "3.2rem",
            fontWeight: 800,
            color: "#1F2937",
            letterSpacing: "-0.045em",
            margin: "0 0 16px 0",
            lineHeight: 1.05
          }}
        >
          MediSlot
        </motion.h1>

        {/* 3. Primary Tagline with Typewriter Effect */}
        <div style={{
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px"
        }}>
          <span style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#1877F2",
            letterSpacing: "-0.02em"
          }}>
            {typedTagline}
          </span>
          <motion.span
            animate={{ opacity: taglineDone ? [1, 0] : 1 }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            style={{
              display: "inline-block",
              width: "3px",
              height: "26px",
              backgroundColor: "#1877F2",
              marginLeft: "4px",
              borderRadius: "2px"
            }}
          />
        </div>

        {/* 4. Supporting Text Fades In */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8, ease: "easeOut" }}
          style={{
            fontSize: "1.08rem",
            color: "#6B7280",
            lineHeight: 1.6,
            maxWidth: "400px",
            margin: "0 0 44px 0",
            fontWeight: 400
          }}
        >
          Find doctors. Book appointments. Access healthcare with confidence.
        </motion.p>

        {/* 5. Continue Button Fades In */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%", maxWidth: "320px" }}
        >
          <button
            onClick={() => navigate("/get-started")}
            style={{
              width: "100%",
              padding: "16px 36px",
              fontSize: "1.08rem",
              fontWeight: 600,
              backgroundColor: "#1877F2",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: "0 10px 28px rgba(24, 119, 242, 0.28)",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#166FE5";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 14px 32px rgba(24, 119, 242, 0.34)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#1877F2";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 28px rgba(24, 119, 242, 0.28)";
            }}
          >
            <span>Continue</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.8 }}
        style={{
          fontSize: "0.8rem",
          color: "#9CA3AF",
          textAlign: "center",
          zIndex: 10
        }}
      >
        <span>© 2026 MediSlot Platform • AES-256 Encryption • HIPAA Compliant Architecture</span>
      </motion.div>
    </div>
  );
}
