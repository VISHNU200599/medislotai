// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import useAuthStore from "../store/authStore";
import Logo from "../components/common/Logo";

export default function NotFound() {
  const { isAuthenticated, user } = useAuthStore();
  const dashMap = { PATIENT: "/patient/dashboard", DOCTOR: "/doctor/dashboard", HOSPITAL_ADMIN: "/admin/dashboard" };
  const homeLink = isAuthenticated ? (dashMap[user?.role] || "/") : "/";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ marginBottom: 32 }}>
        <Logo variant="monochrome-dark" size="sm" />
      </div>

      <div style={{ position: "relative", marginBottom: 32 }}>
        <div style={{ fontSize: "10rem", fontWeight: 900, color: "var(--bg-muted)", lineHeight: 1, userSelect: "none" }}>404</div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "var(--bg-card)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-md)" }}>
            <Search size={32} color="var(--brand-primary)" />
          </div>
        </div>
      </div>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Page Not Found</h1>
      <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 400, lineHeight: 1.6, marginBottom: 36 }}>
        The page you're looking for doesn't exist or may have been moved. Let's get you back to safety.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => window.history.back()} className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
          <ArrowLeft size={16} /> Go Back
        </button>
        <Link to={homeLink} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
          <Home size={16} /> Return to {isAuthenticated ? "Dashboard" : "Home"}
        </Link>
      </div>
    </div>
  );
}
