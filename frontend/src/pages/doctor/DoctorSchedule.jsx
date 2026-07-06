// src/pages/doctor/DoctorSchedule.jsx
import { useState } from "react";
import { Clock, Info, Sun, Moon, CheckCircle, XCircle } from "lucide-react";
import { doctorsAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MORNING = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const EVENING = ["16:00", "16:30", "17:00", "17:30"];

export default function DoctorSchedule() {
  const { profile } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(profile?.is_available ?? true);
  const [saving, setSaving] = useState(false);

  const toggleAvailability = async () => {
    setSaving(true);
    try {
      await doctorsAPI.updateProfile({ is_available: !isAvailable });
      setIsAvailable(!isAvailable);
      toast.success(`You are now marked as ${!isAvailable ? "available" : "unavailable"} for consultations`);
    } catch { toast.error("Failed to update availability status"); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout title="My Schedule" subtitle="Review your weekly consultation hours and availability settings">
      {/* Availability Status Card */}
      <div className="card card-body" style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--bg-card)", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h4 style={{ marginBottom: "4px", fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)" }}>Clinical Availability Status</h4>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {isAvailable ? "Patients can currently book consultations and time slots with you" : "You are currently marked unavailable for new patient appointments"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className={`badge ${isAvailable ? "badge-success" : "badge-muted"}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", fontSize: "0.82rem" }}>
            {isAvailable ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {isAvailable ? "Available for Booking" : "Currently Unavailable"}
          </span>
          <button onClick={toggleAvailability} className={`btn btn-sm ${isAvailable ? "btn-secondary" : "btn-cta"}`} style={{ padding: "8px 16px", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "6px" }} disabled={saving}>
            {saving ? <div className="spinner" style={{ width: 14, height: 14 }} /> : isAvailable ? "Set Unavailable" : "Set Available"}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="alert alert-info" style={{ marginBottom: "24px", display: "flex", gap: "12px", alignItems: "flex-start", backgroundColor: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
        <Info size={18} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--brand-primary)", fontWeight: 600 }}>Slot Management Policy:</strong> Your appointment slots are automatically generated based on your default hospital roster below. To request permanent modifications to your clinical session timings, please coordinate with your Hospital Administrator.
        </div>
      </div>

      {/* Weekly Schedule Table */}
      <div className="table-wrapper" style={{ marginBottom: "24px" }}>
        <div className="table-header">
          <div>
            <div className="table-title">Weekly Roster & Session Timings</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>Standard departmental consultation schedule</div>
          </div>
          <span className="badge badge-info">Default Roster</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Day of Week</th>
              <th>Morning Session</th>
              <th>Evening Session</th>
              <th>Total Slot Capacity</th>
              <th>Roster Status</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, i) => {
              const isWeekend = i >= 5;
              return (
                <tr key={day}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{day}</td>
                  <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {isWeekend && i === 6 ? "—" : "09:00 AM – 12:00 PM"}
                  </td>
                  <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {i === 6 ? "—" : i === 5 ? "04:00 PM – 06:00 PM" : "04:00 PM – 06:00 PM"}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--brand-primary)", fontFamily: "monospace" }}>
                      {i === 6 ? "0" : i === 5 ? "4" : "10"} slots
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${i === 6 ? "badge-muted" : "badge-success"}`}>
                      {i === 6 ? "Off Duty" : "Active Roster"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Time Slots Preview Card */}
      <div className="card card-body" style={{ backgroundColor: "var(--bg-card)" }}>
        <h4 style={{ marginBottom: "16px", fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)" }}>Today's Time Slot Preview</h4>
        
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <Sun size={16} color="var(--brand-primary)" /> Morning Consultations (09:00 AM – 12:00 PM)
          </div>
          <div className="slot-grid">
            {MORNING.map((time) => (
              <div key={time} className="slot-btn" style={{ cursor: "default", backgroundColor: "var(--bg-base)", borderColor: "var(--border)", color: "var(--text-primary)", fontWeight: 500 }}>{time}</div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <Moon size={16} color="var(--brand-primary)" /> Evening Consultations (04:00 PM – 06:00 PM)
          </div>
          <div className="slot-grid">
            {EVENING.map((time) => (
              <div key={time} className="slot-btn" style={{ cursor: "default", backgroundColor: "var(--bg-base)", borderColor: "var(--border)", color: "var(--text-primary)", fontWeight: 500 }}>{time}</div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
