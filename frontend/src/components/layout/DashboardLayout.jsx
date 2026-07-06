// src/components/layout/DashboardLayout.jsx
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import NotificationCenter from "../common/NotificationCenter";

export default function DashboardLayout({ children, title, subtitle }) {
  const { profile, user } = useAuthStore();

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
  };

  return (
    <div className="dashboard-layout" style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)", display: "flex" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar (64px Sleek Height, 8px Grid Spacing) */}
        <header className="topbar" style={{ height: "var(--navbar-height)", backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", position: "sticky", top: 0, zIndex: 100 }}>
          <div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.015em", lineHeight: 1.2 }}>{title}</h1>
            {subtitle && <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px", fontWeight: 400 }}>{subtitle}</p>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Notification Center */}
            <NotificationCenter />
            
            {/* User Profile Snippet */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "8px", borderLeft: "1px solid var(--border)" }}>
              {profile?.profile_pic && !profile?.profile_pic.includes("ui-avatars.com") ? (
                <img
                  src={profile.profile_pic}
                  alt="profile"
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }}
                />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 600, flexShrink: 0 }}>
                  {getInitials(profile?.full_name || "User")}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>{profile?.full_name || "Account User"}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>{user?.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content with 200ms Framer Motion transition */}
        <main className="dashboard-body" style={{ padding: "32px", flex: 1, maxWidth: "1360px", width: "100%", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
