// src/components/common/AppointmentTimeline.jsx
import React from "react";
import { CheckCircle2, Clock, CalendarCheck, Award, XCircle } from "lucide-react";

export default function AppointmentTimeline({ status = "PENDING", date, timeSlot }) {
  const isCancelled = status === "CANCELLED" || status === "NO_SHOW";
  
  const steps = [
    {
      label: "Request Submitted",
      desc: "Patient requested consultation",
      icon: Clock,
      completed: true,
      active: status === "PENDING"
    },
    {
      label: "Clinical Review",
      desc: "Specialist acceptance pending",
      icon: CalendarCheck,
      completed: ["CONFIRMED", "COMPLETED"].includes(status),
      active: status === "PENDING"
    },
    {
      label: isCancelled ? "Consultation Cancelled" : "Confirmed & Scheduled",
      desc: isCancelled ? "Appointment was cancelled" : `${date || "Scheduled"} • ${timeSlot || "Time Slot"}`,
      icon: isCancelled ? XCircle : CheckCircle2,
      completed: ["CONFIRMED", "COMPLETED"].includes(status) || isCancelled,
      active: status === "CONFIRMED" || isCancelled,
      isError: isCancelled
    },
    {
      label: "Consultation Completed",
      desc: "Clinical summary & Rx archived",
      icon: Award,
      completed: status === "COMPLETED",
      active: status === "COMPLETED"
    }
  ];

  return (
    <div style={{ padding: "16px 0", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
        {/* Connecting Line */}
        <div style={{
          position: "absolute",
          top: "16px",
          left: "24px",
          right: "24px",
          height: "3px",
          backgroundColor: "var(--border)",
          zIndex: 0
        }}>
          <div style={{
            height: "100%",
            backgroundColor: isCancelled ? "var(--status-danger)" : "var(--brand-primary)",
            width: status === "COMPLETED" ? "100%" : status === "CONFIRMED" ? "66%" : isCancelled ? "66%" : "33%",
            transition: "width 400ms ease"
          }} />
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = step.completed;
          const isCurrent = step.active;
          const isErr = step.isError;

          let bg = "var(--bg-surface)";
          let color = "var(--text-muted)";
          let borderColor = "var(--border)";

          if (isErr) {
            bg = "var(--status-danger)";
            color = "white";
            borderColor = "var(--status-danger)";
          } else if (isDone) {
            bg = "var(--brand-primary)";
            color = "white";
            borderColor = "var(--brand-primary)";
          } else if (isCurrent) {
            bg = "var(--bg-card)";
            color = "var(--brand-primary)";
            borderColor = "var(--brand-primary)";
          }

          return (
            <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", zIndex: 1, flex: 1, padding: "0 4px" }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: bg,
                color: color,
                border: `2px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px",
                boxShadow: isCurrent ? "0 0 0 4px var(--status-info-bg)" : "none",
                transition: "all 200ms ease"
              }}>
                <Icon size={16} />
              </div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: isCurrent || isDone ? "var(--text-primary)" : "var(--text-muted)", marginBottom: "2px" }}>
                {step.label}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", maxWidth: "110px", lineHeight: 1.3 }}>
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
