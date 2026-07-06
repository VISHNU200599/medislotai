// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown, Calendar, Building2, Stethoscope } from "lucide-react";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import Logo from "../common/Logo";
import NotificationCenter from "../common/NotificationCenter";

export default function Navbar() {
  const [dropOpen, setDropOpen] = useState(false);
  const { isAuthenticated, user, profile, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const dashLink = {
    PATIENT: "/patient/dashboard",
    DOCTOR: "/doctor/dashboard",
    HOSPITAL_ADMIN: "/admin/dashboard",
  }[user?.role] || "/";

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
  };

  return (
    <nav className="navbar" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 1000, height: "var(--navbar-height)", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        {/* Logo */}
        <Logo variant="primary" size="md" />

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link to="/hospitals" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", transition: "color 150ms ease" }}>
            <Building2 size={16} /> Hospitals
          </Link>
          <Link to="/doctors" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", transition: "color 150ms ease" }}>
            <Stethoscope size={16} /> Specialists
          </Link>
          <a href="/#features" style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", transition: "color 150ms ease" }}>Features</a>
          <a href="/#how-it-works" style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", transition: "color 150ms ease" }}>How it works</a>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link to="/hospitals" className="btn btn-cta btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
            <Calendar size={15} /> Book Consultation
          </Link>

          {!isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ fontWeight: 500 }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ fontWeight: 500 }}>
                Get Started
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Notification Center */}
              <NotificationCenter />

              {/* Profile Dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-full)", padding: "4px 12px 4px 4px", cursor: "pointer", color: "var(--text-primary)", transition: "all 150ms ease" }}
                >
                  {profile?.profile_pic && !profile?.profile_pic.includes("ui-avatars.com") ? (
                    <img
                      src={profile.profile_pic}
                      alt="avatar"
                      style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }}
                    />
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600 }}>
                      {getInitials(profile?.full_name || "User")}
                    </div>
                  )}
                  <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>{profile?.full_name?.split(" ")[0] || "User"}</span>
                  <ChevronDown size={14} color="var(--text-secondary)" />
                </button>

                {dropOpen && (
                  <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-dropdown)", border: "1px solid var(--border)", minWidth: 220, zIndex: 999, overflow: "hidden" }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{profile?.full_name || "Account User"}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "6px" }}>{user?.email}</div>
                      <span className="badge badge-info" style={{ display: "inline-flex" }}>{user?.role?.replace("_", " ")}</span>
                    </div>
                    <Link to={dashLink} onClick={() => setDropOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", color: "var(--text-primary)", fontSize: "0.875rem", textDecoration: "none", transition: "background 150ms ease", fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.background = "var(--bg-surface)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                      <User size={16} color="var(--brand-primary)" /> {user?.role === "PATIENT" ? "Patient Workspace" : user?.role === "DOCTOR" ? "Doctor Workspace" : "Hospital Console"}
                    </Link>
                    <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", color: "var(--status-danger)", fontSize: "0.875rem", background: "transparent", border: "none", borderTop: "1px solid var(--border)", cursor: "pointer", transition: "background 150ms ease", textAlign: "left", fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.background = "var(--status-danger-bg)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
