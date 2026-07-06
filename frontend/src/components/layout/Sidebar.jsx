// src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, User, LogOut,
  Stethoscope, Building2, Clock
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import Logo from "../common/Logo";

const patientNav = [
  { to: "/patient/dashboard", icon: LayoutDashboard, label: "Patient Workspace" },
  { to: "/patient/appointments", icon: Calendar, label: "My Consultations" },
  { to: "/patient/profile", icon: User, label: "My Health Profile" },
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
];

const navLinks = { PATIENT: patientNav, DOCTOR: doctorNav, HOSPITAL_ADMIN: adminNav };

export default function Sidebar() {
  const { user, profile, logout } = useAuthStore();
  const navigate = useNavigate();
  const links = navLinks[user?.role] || [];

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

  return (
    <aside className="sidebar">
      {/* Logo Header (Monochrome Stethoscope M on Medical Blue, 8px grid spacing) */}
      <div className="sidebar-header" style={{ padding: "0 24px", height: "var(--navbar-height)", display: "flex", alignItems: "center" }}>
        <Logo variant="monochrome" size="sm" />
      </div>

      {/* User Profile Card (Clean white/translucent contrast on Deep Medical Blue) */}
      <div style={{ padding: "20px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", margin: "0 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {profile?.profile_pic && !profile?.profile_pic.includes("ui-avatars.com") ? (
            <img
              src={profile.profile_pic}
              alt="profile"
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255, 255, 255, 0.2)" }}
            />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.15)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 600, flexShrink: 0, border: "1px solid rgba(255, 255, 255, 0.2)" }}>
              {getInitials(profile?.full_name || "User")}
            </div>
          )}
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-white)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {profile?.full_name || "Account User"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)", marginTop: "2px", textTransform: "capitalize", fontWeight: 500 }}>
              {user?.role?.replace("_", " ")?.toLowerCase() || "Member"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu (8px Grid, Rounded Active Indicator, Breathing Room) */}
      <nav className="sidebar-menu" style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "4px 12px", marginBottom: "4px" }}>
          Portal Navigation
        </div>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "4px 12px", marginTop: "24px", marginBottom: "4px" }}>
          Discovery
        </div>
        <NavLink to="/hospitals" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} style={{ textDecoration: "none" }}>
          <Building2 size={18} /> <span>Hospitals</span>
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} style={{ textDecoration: "none" }}>
          <Stethoscope size={18} /> <span>Find Specialists</span>
        </NavLink>
      </nav>

      {/* Bottom Footer */}
      <div className="sidebar-footer" style={{ padding: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <button 
          onClick={handleLogout} 
          style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid rgba(239, 68, 68, 0.3)", background: "rgba(239, 68, 68, 0.15)", color: "#FF8A8A", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, transition: "all 200ms ease" }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)"; e.currentTarget.style.color = "#FFFFFF"; }}
          onMouseOut={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"; e.currentTarget.style.color = "#FF8A8A"; }}
        >
          <LogOut size={18} /> <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
