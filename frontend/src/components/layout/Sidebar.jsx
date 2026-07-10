// src/components/layout/Sidebar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, User, LogOut,
  Stethoscope, Building2, Clock, Ambulance, Menu, X
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import Logo from "../common/Logo";

const patientNav = [
  { to: "/patient/dashboard", icon: LayoutDashboard, label: "Patient Workspace" },
  { to: "/patient/appointments", icon: Calendar, label: "My Consultations" },
  { to: "/patient/profile", icon: User, label: "My Health Profile" },
  { to: "/patient/ambulance", icon: Ambulance, label: "Emergency Ambulance", emergency: true },
];

const doctorNav = [
  { to: "/doctor/dashboard", icon: LayoutDashboard, label: "Doctor Workspace" },
  { to: "/doctor/appointments", icon: Calendar, label: "Patient Queue" },
  { to: "/doctor/schedule", icon: Clock, label: "Weekly Schedule" },
];

const adminNav = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Hospital Console" },
  { to: "/admin/doctors", icon: Stethoscope, label: "Specialists" },
  { to: "/admin/departments", icon: Building2, label: "Departments" },
  { to: "/admin/appointments", icon: Calendar, label: "All Appointments" },
  { to: "/admin/ambulance", icon: Ambulance, label: "Ambulance Requests", emergency: true },
];

const navLinks = { PATIENT: patientNav, DOCTOR: doctorNav, HOSPITAL_ADMIN: adminNav };

export default function Sidebar() {
  const { user, profile, logout } = useAuthStore();
  const navigate = useNavigate();
  const links = navLinks[user?.role] || [];
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
  };

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <aside className="sidebar" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo Header */}
      <div className="sidebar-header" style={{ padding: "0 24px", height: "var(--navbar-height)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo variant="primary" size="sm" />
        {/* Mobile close button */}
        <button
          onClick={closeMobile}
          className="sidebar-mobile-close"
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 4, display: "none" }}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
      </div>

      {/* User Profile Card */}
      <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", margin: "0 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {profile?.profile_pic && !profile?.profile_pic.includes("ui-avatars.com") ? (
            <img src={profile.profile_pic} alt="profile" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 600, flexShrink: 0, border: "1px solid var(--border)" }}>
              {getInitials(profile?.full_name || "User")}
            </div>
          )}
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {profile?.full_name || "Account User"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2, textTransform: "capitalize", fontWeight: 500 }}>
              {user?.role?.replace("_", " ")?.toLowerCase() || "Member"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-menu" style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 12px", marginBottom: 6 }}>
          Navigation
        </div>

        {links.map(({ to, icon: Icon, label, emergency }) => (
          <NavLink
            key={to}
            to={to}
            onClick={closeMobile}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""} ${emergency ? "sidebar-link-emergency" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Discovery section — Patient only */}
        {user?.role === "PATIENT" && (
          <>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 12px", marginTop: 20, marginBottom: 6 }}>
              Discovery
            </div>
            <NavLink to="/hospitals" onClick={closeMobile} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} style={{ textDecoration: "none" }}>
              <Building2 size={18} /> <span>Find Hospitals</span>
            </NavLink>
            <NavLink to="/doctors" onClick={closeMobile} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} style={{ textDecoration: "none" }}>
              <Stethoscope size={18} /> <span>Find Specialists</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Bottom Footer */}
      <div className="sidebar-footer" style={{ padding: 16, borderTop: "1px solid var(--border)" }}>
        <button
          onClick={handleLogout}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.15)", color: "#FF8A8A", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, transition: "all 200ms ease" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.25)"; e.currentTarget.style.color = "#FFFFFF"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#FF8A8A"; }}
        >
          <LogOut size={18} /> <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="sidebar-hamburger"
        aria-label="Open menu"
        style={{
          position: "fixed", top: 16, left: 16, zIndex: 300,
          width: 42, height: 42, borderRadius: "var(--radius-md)",
          backgroundColor: "var(--bg-dark)", color: "white",
          border: "none", cursor: "pointer", display: "none",
          alignItems: "center", justifyContent: "center",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          style={{
            position: "fixed", inset: 0, zIndex: 399,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="sidebar-wrapper" style={{ display: "contents" }}>
        <div className={`sidebar-container ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
