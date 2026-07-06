// src/pages/admin/AdminAppointments.jsx
import { useState } from "react";
import { Calendar, Download, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";

const MOCK_APPOINTMENTS = [
  { id: 1, patient: "Rohit Verma", doctor: "Dr. Rajesh Sharma", dept: "Cardiology", date: "2024-07-06", time: "09:00", status: "CONFIRMED", ref: "MED-ABC123" },
  { id: 2, patient: "Priya Singh", doctor: "Dr. Rajesh Sharma", dept: "Cardiology", date: "2024-07-06", time: "09:30", status: "PENDING", ref: "MED-DEF456" },
  { id: 3, patient: "Amit Patel", doctor: "Dr. Priya Patel", dept: "Neurology", date: "2024-07-06", time: "10:00", status: "COMPLETED", ref: "MED-GHI789" },
  { id: 4, patient: "Sunita Devi", doctor: "Dr. Priya Patel", dept: "Neurology", date: "2024-07-05", time: "11:00", status: "CANCELLED", ref: "MED-JKL012" },
  { id: 5, patient: "Rajesh Kumar", doctor: "Dr. Rajesh Sharma", dept: "Cardiology", date: "2024-07-07", time: "16:00", status: "CONFIRMED", ref: "MED-MNO345" },
];

export default function AdminAppointments() {
  const [activeTab, setActiveTab] = useState("ALL");

  const filtered = activeTab === "ALL" ? MOCK_APPOINTMENTS : MOCK_APPOINTMENTS.filter((a) => a.status === activeTab);
  const TABS = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
  const counts = { ALL: MOCK_APPOINTMENTS.length, PENDING: 1, CONFIRMED: 2, COMPLETED: 1, CANCELLED: 1 };

  return (
    <DashboardLayout title="Hospital Appointments" subtitle="Monitor, track, and audit all clinical consultations across departments">
      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: "24px" }}>
        {[
          { label: "Total Bookings", value: 5, color: "var(--brand-primary)", bg: "var(--bg-muted)", icon: FileText },
          { label: "Pending Review", value: 1, color: "var(--brand-accent)", bg: "rgba(255, 122, 89, 0.1)", icon: AlertCircle },
          { label: "Confirmed Consultations", value: 2, color: "var(--status-success)", bg: "rgba(21, 128, 61, 0.1)", icon: CheckCircle },
          { label: "Cancelled / No-Show", value: 1, color: "var(--status-danger)", bg: "rgba(200, 30, 30, 0.1)", icon: XCircle },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="stat-card" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="stat-card-icon" style={{ backgroundColor: bg, color: color }}>
              <Icon size={20} />
            </div>
            <div className="stat-card-value" style={{ color: "var(--text-primary)" }}>{value}</div>
            <div className="stat-card-label" style={{ color: "var(--text-secondary)" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "6px 14px", backgroundColor: activeTab === tab ? "var(--brand-primary)" : "transparent", color: activeTab === tab ? "white" : "var(--text-secondary)", border: "1px solid " + (activeTab === tab ? "var(--brand-primary)" : "var(--border)"), borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 150ms ease", whiteSpace: "nowrap" }}>
                {tab === "ALL" ? "All Consultations" : tab.charAt(0) + tab.slice(1).toLowerCase()} ({counts[tab]})
              </button>
            ))}
          </div>
          <button onClick={() => toast.success("Exporting report as CSV...")} className="btn btn-secondary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Patient Demographics</th>
              <th>Specialist Doctor</th>
              <th>Department</th>
              <th>Schedule Date & Time</th>
              <th>Status</th>
              <th>Reference ID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((appt) => (
              <tr key={appt.id}>
                <td style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{appt.patient}</td>
                <td style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>{appt.doctor}</td>
                <td><span className="badge badge-info">{appt.dept}</span></td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{appt.date}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 500 }}>{appt.time}</div>
                </td>
                <td><span className={`badge status-${appt.status}`}>{appt.status}</span></td>
                <td style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "var(--text-primary)", fontWeight: 600 }}>{appt.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
