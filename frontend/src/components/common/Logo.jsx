// src/components/common/Logo.jsx
// MediSlot — Official Brand Identity Logo System
// Pure Flat Geometric Medical Plus (+) Symbol • Zero Gradients • Zero Shadows
// Typography: Manrope / Inter ExtraBold (800) • Horizontal Alignment

import React from "react";
import { Link } from "react-router-dom";

/**
 * MediSlot Logo Component
 *
 * @param {"primary" | "white" | "monochrome" | "dark" | "monochrome-dark" | "icon-only" | "compact" | "app-icon"} variant
 *   primary          = Blue plus icon (#2563EB) + "Medi" Navy (#0F172A) + "Slot" Blue (#2563EB)
 *   white/monochrome = White plus icon (#FFFFFF) + White text (#FFFFFF) + Transparent bg
 *   dark/monochrome-dark = Navy plus icon (#0F172A) + Navy text (#0F172A)
 *   icon-only/compact = Renders only the plus symbol (no wordmark)
 *   app-icon         = Rounded square blue bg (#2563EB) + White plus symbol (#FFFFFF)
 *
 * @param {"xs" | "sm" | "md" | "lg" | "xl"} size
 */
export default function Logo({
  variant = "primary",
  size = "md",
  to = "/",
  style = {},
  className = "",
  iconColorOverride = null,
  textColorOverride = null
}) {
  const isWhite = variant === "white" || variant === "monochrome";
  const isDark = variant === "dark" || variant === "monochrome-dark";
  const isAppIcon = variant === "app-icon";
  const isIconOnly = variant === "icon-only" || variant === "compact" || isAppIcon;

  // Proportional icon dimensions
  const iconSize = { xs: 24, sm: 28, md: 36, lg: 44, xl: 56 }[size] || 36;

  // Proportional wordmark typography (Manrope / Inter ExtraBold)
  const textSize = { xs: "1.05rem", sm: "1.25rem", md: "1.5rem", lg: "1.85rem", xl: "2.35rem" }[size] || "1.5rem";

  // ── Icon & Wordmark Color Mapping (Exact requested palette) ────────────────
  let plusColor = "#1877F2"; // Modern Facebook Blue
  let mediColor = "#1F2937"; // Professional Text Dark
  let slotColor = "#1877F2"; // Modern Facebook Blue

  if (isWhite) {
    plusColor = "#FFFFFF";
    mediColor = "#FFFFFF";
    slotColor = "#FFFFFF";
  } else if (isDark) {
    plusColor = "#1F2937";
    mediColor = "#1F2937";
    slotColor = "#1F2937";
  } else if (isAppIcon) {
    plusColor = "#FFFFFF";
  }

  if (iconColorOverride) plusColor = iconColorOverride;
  if (textColorOverride) {
    mediColor = textColorOverride;
    slotColor = textColorOverride;
  }

  // ── Symmetrical Bold Medical Plus (+) Vector SVG (100x100 Grid) ────────────
  const iconSvg = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block" }}
    >
      {isAppIcon ? (
        <>
          {/* Rounded square container for App Icon mode */}
          <rect width="100" height="100" rx="24" fill="#1877F2" />
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
        </>
      ) : (
        <>
          {/* Bold, Minimal, Perfectly Symmetrical Rounded Medical Plus (+) */}
          <path
            d="M 50 16 L 50 84"
            stroke={plusColor}
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M 16 50 L 84 50"
            stroke={plusColor}
            strokeWidth="24"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );

  const wordmark = !isIconOnly && (
    <div
      style={{
        fontFamily: "'Manrope', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: textSize,
        fontWeight: 800,
        letterSpacing: "-0.035em",
        lineHeight: 1,
        userSelect: "none",
        display: "flex",
        alignItems: "center"
      }}
    >
      <span style={{ color: mediColor, fontWeight: 800 }}>Medi</span>
      <span style={{ color: slotColor, fontWeight: 800 }}>Slot</span>
    </div>
  );

  if (!to) {
    return (
      <div
        className={`medislot-brand-logo ${className}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: size === "xs" || size === "sm" ? "8px" : "11px",
          ...style
        }}
      >
        {iconSvg}
        {wordmark}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`medislot-brand-logo ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "xs" || size === "sm" ? "8px" : "11px",
        textDecoration: "none",
        ...style
      }}
    >
      {iconSvg}
      {wordmark}
    </Link>
  );
}
