// src/components/common/Logo.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ variant = "primary", size = "md", to = "/" }) {
  const isDark = variant === "monochrome";
  const isCompact = variant === "compact";

  const iconSizes = {
    sm: 26,
    md: 34,
    lg: 42,
  };

  const textSizes = {
    sm: "1.15rem",
    md: "1.4rem",
    lg: "1.65rem",
  };

  const iconSize = iconSizes[size] || 34;
  const textSize = textSizes[size] || "1.4rem";

  // Stethoscope forming the letter "M" inside a Medical Blue rounded square / shield
  const iconElement = (
    <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {/* Container background: Medical Blue (#1565C0) or translucent white for monochrome */}
      <rect width="64" height="64" rx="16" fill={isDark ? "rgba(255, 255, 255, 0.15)" : "#1565C0"} />
      
      {/* Left and Right Earpiece tubes forming the outer legs of 'M' */}
      <path 
        d="M 18 18 V 34 C 18 42, 32 40, 32 28 C 32 40, 46 42, 46 34 V 18" 
        stroke="#FFFFFF" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Center drop tube going from 'M' peak down to the chest piece */}
      <path 
        d="M 32 28 V 44" 
        stroke="#FFFFFF" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />
      
      {/* Earbud tips (Top left and right of the 'M') */}
      <circle cx="18" cy="15" r="3.5" fill="#FFFFFF" />
      <circle cx="46" cy="15" r="3.5" fill="#FFFFFF" />
      
      {/* Stethoscope Chest Piece (Bottom Center) */}
      <circle cx="32" cy="49" r="6" fill="#FFFFFF" />
    </svg>
  );

  if (isCompact) {
    return (
      <Link to={to} style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
        {iconElement}
      </Link>
    );
  }

  return (
    <Link to={to} style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
      {iconElement}
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: textSize, fontWeight: 800, letterSpacing: "-0.03em", color: isDark ? "#FFFFFF" : "#12344D", lineHeight: 1 }}>
        MediSlot<span style={{ color: isDark ? "#DFF2FA" : "#1565C0", marginLeft: "3px" }}>AI</span>
      </div>
    </Link>
  );
}
