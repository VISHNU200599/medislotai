// src/components/common/Logo.jsx
// MediSlot AI — Premium Brand Logo System
// Abstract monoline stethoscope forming an "M" shape
// Designed to meet startup-quality standards: Apple Health / Stripe aesthetic

import { Link } from "react-router-dom";

/**
 * MediSlot AI Logo
 *
 * @param {"primary" | "monochrome" | "monochrome-dark" | "icon-only"} variant
 *   primary          = blue icon + dark text (default, for light backgrounds)
 *   monochrome       = white icon + white text (for dark/sidebar backgrounds)
 *   monochrome-dark  = dark icon + dark text (for light backgrounds without color)
 *   icon-only        = renders only the icon square, no wordmark
 *
 * @param {"xs" | "sm" | "md" | "lg" | "xl"} size
 */
export default function Logo({ variant = "primary", size = "md", to = "/", style = {} }) {
  const isWhite = variant === "monochrome";
  const isIconOnly = variant === "icon-only";

  // Icon dimensions
  const iconSize = { xs: 22, sm: 28, md: 36, lg: 44, xl: 56 }[size] || 36;

  // Text dimensions
  const textSize = { xs: "0.9rem", sm: "1.1rem", md: "1.35rem", lg: "1.6rem", xl: "2rem" }[size] || "1.35rem";

  // ── Icon colors ──────────────────────────────────────────────────────────
  const containerFill =
    variant === "monochrome"
      ? "rgba(255,255,255,0.14)"
      : variant === "monochrome-dark"
      ? "#EDF7FF"
      : "#1565C0";

  const strokeColor =
    variant === "monochrome"
      ? "#FFFFFF"
      : variant === "monochrome-dark"
      ? "#1565C0"
      : "#FFFFFF";

  // ── Text colors ──────────────────────────────────────────────────────────
  const brandColor = isWhite ? "#FFFFFF" : "#12344D";
  const accentColor = isWhite ? "rgba(255,255,255,0.75)" : "#1565C0";

  // ── The Icon SVG ─────────────────────────────────────────────────────────
  const iconSvg = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block" }}
    >
      {/* Rounded square container */}
      <rect width="64" height="64" rx="14" fill={containerFill} />

      {/* ── Monoline stethoscope-M ────────────────────────────────────────
          Left leg: curves up to left earbud tip
          Center arch: connects left peak to right peak (the valley of M)
          Right leg: curves up to right earbud tip
          Drop tube: vertical line from center arch to chest piece
          Chest piece: open circle (diaphragm)
      ─────────────────────────────────────────────────────────────────── */}

      {/* Left earpiece — arc from left peak to left tube going down */}
      <path
        d="M 21 13 C 18 13, 15 15.5, 15 19 L 15 28"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Left tube to center valley of M */}
      <path
        d="M 15 28 C 15 35, 32 35, 32 28"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Right tube from center valley of M */}
      <path
        d="M 32 28 C 32 35, 49 35, 49 28"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Right earpiece — arc from right tube going up to right earbud */}
      <path
        d="M 49 28 L 49 19 C 49 15.5, 46 13, 43 13"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Earbud tips — small filled circles at top of each leg */}
      <circle cx="21" cy="13" r="3.2" fill={strokeColor} />
      <circle cx="43" cy="13" r="3.2" fill={strokeColor} />

      {/* Drop tube — from center arch downward */}
      <path
        d="M 32 35 L 32 46"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Chest piece (diaphragm) — open circle */}
      <circle
        cx="32"
        cy="51"
        r="5"
        stroke={strokeColor}
        strokeWidth="3.5"
        fill="none"
      />
    </svg>
  );

  const wordmark = !isIconOnly && (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: textSize,
        fontWeight: 800,
        letterSpacing: "-0.035em",
        color: brandColor,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      Medi<span style={{ color: accentColor, fontWeight: 800 }}>Slot</span>
      <span
        style={{
          fontSize: "0.6em",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: accentColor,
          marginLeft: "3px",
          verticalAlign: "middle",
          opacity: 0.9,
        }}
      >
        AI
      </span>
    </div>
  );

  if (!to) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: size === "xs" || size === "sm" ? "7px" : "10px",
          ...style,
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
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "xs" || size === "sm" ? "7px" : "10px",
        textDecoration: "none",
        ...style,
      }}
    >
      {iconSvg}
      {wordmark}
    </Link>
  );
}
