// src/components/common/NotificationCenter.jsx
import { useState } from "react";
import { Bell, CheckCircle, Clock, ShieldAlert, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Appointment Request Submitted",
    desc: "Your consultation request with Dr. Rajesh Sharma is pending clinical review.",
    time: "10 mins ago",
    type: "info",
    unread: true,
  },
  {
    id: 2,
    title: "Prescription Ready",
    desc: "Digital prescription and diagnostic slip from Apollo Hospital are now available.",
    time: "2 hours ago",
    type: "success",
    unread: true,
  },
  {
    id: 3,
    title: "Security & HIPAA Notice",
    desc: "New login verified from Windows NT 10.0. Your clinical data remains encrypted.",
    time: "1 day ago",
    type: "alert",
    unread: false,
  },
];

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const removeNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          backgroundColor: open ? "var(--bg-muted)" : "var(--bg-card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: open ? "var(--brand-primary)" : "var(--text-secondary)",
          position: "relative",
          transition: "all 150ms ease",
        }}
        aria-label="Clinical Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              backgroundColor: "var(--brand-accent)",
              borderRadius: "50%",
              border: "1.5px solid var(--bg-card)",
            }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              style={{ position: "fixed", inset: 0, zIndex: 998 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 10px)",
                width: 360,
                backgroundColor: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-modal)",
                border: "1px solid var(--border)",
                zIndex: 999,
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "14px 18px",
                  backgroundColor: "var(--bg-surface)",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    Clinical Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="badge badge-info" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--brand-primary)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Check size={14} /> Mark read
                  </button>
                )}
              </div>

              {/* List */}
              <div style={{ maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    No notifications at this time.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: "14px 18px",
                        borderBottom: "1px solid var(--border)",
                        backgroundColor: n.unread ? "var(--bg-muted)" : "var(--bg-card)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        position: "relative",
                        transition: "background 150ms ease",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "var(--radius-md)",
                          backgroundColor:
                            n.type === "success"
                              ? "var(--status-success-bg)"
                              : n.type === "alert"
                              ? "var(--status-danger-bg)"
                              : "var(--status-info-bg)",
                          color:
                            n.type === "success"
                              ? "var(--status-success)"
                              : n.type === "alert"
                              ? "var(--status-danger)"
                              : "var(--brand-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        {n.type === "success" ? <CheckCircle size={16} /> : n.type === "alert" ? <ShieldAlert size={16} /> : <Clock size={16} />}
                      </div>
                      <div style={{ flex: 1, paddingRight: "16px" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: n.unread ? 700 : 600, color: "var(--text-primary)", marginBottom: "2px" }}>
                          {n.title}
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4, marginBottom: "4px" }}>
                          {n.desc}
                        </p>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>
                          {n.time}
                        </span>
                      </div>
                      <button
                        onClick={(e) => removeNotification(n.id, e)}
                        style={{
                          position: "absolute",
                          right: 14,
                          top: 14,
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: 2,
                        }}
                        title="Dismiss"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: "12px 18px", backgroundColor: "var(--bg-surface)", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                <a
                  href="/patient/appointments"
                  onClick={() => setOpen(false)}
                  style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--brand-primary)", textDecoration: "none" }}
                >
                  View All Clinical Activity →
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
