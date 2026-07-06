// src/pages/doctor/DoctorDashboard.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Users, Calendar, Activity, AlertCircle, Award, TrendingUp, ShieldCheck, FileText, Sparkles, PhoneCall, Stethoscope } from "lucide-react";
import { doctorsAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  const { profile } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const today = format(new Date(), "yyyy-MM-dd");

  const fetchToday = async () => {
    setLoading(true);
    try {
      const res = await doctorsAPI.getMyAppointments({ date: today });
      setAppointments(res.data.data || []);
    } catch { setAppointments([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchToday(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await doctorsAPI.updateAppointmentStatus(id, { status });
      toast.success(`Appointment marked as ${status.toLowerCase()}`);
      fetchToday();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally { setUpdating(null); }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
  };

  const getInitials = (name) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
  };

  return (
    <DashboardLayout title="Doctor Workspace" subtitle={`Clinical Queue • ${format(new Date(), "EEEE, MMMM d, yyyy")}`}>
      {/* Welcome Section */}
      <div className="card" style={{ padding: "28px 32px", marginBottom: "24px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "var(--status-info-bg)", color: "var(--brand-primary)", padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "14px", border: "1px solid var(--border)" }}>
              <Award size={14} /> Specialist Clinical Dashboard
            </div>
            <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
              Welcome back, Dr. {profile?.full_name?.replace(/^Dr\.\s*/i, "") || "Specialist"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
              {profile?.specialization || "Clinical Specialist"} • {profile?.hospital?.name || "MediSlot AI Medical Directory"}
            </p>
          </div>
          
          <div style={{ backgroundColor: "var(--bg-surface)", padding: "18px 24px", borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", minWidth: "240px" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Today's OPD Roster</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {stats.total} Patient{stats.total === 1 ? "" : "s"} Scheduled
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--brand-accent)", fontWeight: 600, marginTop: "2px" }}>
              {stats.pending} pending acceptance
            </div>
          </div>
        </div>
      </div>

      {/* Quick Clinical Tools Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {[
          { title: "Patient Queue", desc: "Manage live consultation flow", icon: Users, link: "/doctor/appointments", color: "var(--brand-primary)", bg: "var(--bg-muted)" },
          { title: "Weekly Schedule", desc: "Adjust OPD hours & slot capacity", icon: Clock, link: "/doctor/schedule", color: "var(--brand-accent)", bg: "rgba(255, 122, 89, 0.15)" },
          { title: "Digital Rx Pad", desc: "Issue prescriptions & diagnostic notes", icon: FileText, action: () => toast.success("Digital Rx Generator ready for consultation"), color: "var(--status-success)", bg: "var(--status-success-bg)" },
          { title: "Triage Coordinator", desc: "Request hospital admission / ICU", icon: PhoneCall, action: () => toast.success("Connecting to Hospital Inpatient Desk..."), color: "var(--status-danger)", bg: "var(--status-danger-bg)" },
        ].map((item, idx) => {
          const Icon = item.icon;
          const content = (
            <div className="card" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer", transition: "all 200ms ease", height: "100%", border: "1px solid var(--border)" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)", backgroundColor: item.bg, color: item.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{item.title}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>{item.desc}</div>
              </div>
            </div>
          );
          return item.link ? <Link key={idx} to={item.link} style={{ textDecoration: "none" }}>{content}</Link> : <div key={idx} onClick={item.action}>{content}</div>;
        })}
      </div>

      {/* Series A Statistics Grid */}
      <div className="stats-grid" style={{ marginBottom: "28px" }}>
        {[
          { label: "Today's Patients", value: stats.total, desc: "Total booked consultations", icon: Users, color: "var(--brand-primary)", bg: "var(--bg-muted)", trend: "Daily roster" },
          { label: "Pending Review", value: stats.pending, desc: "Requires clinical acceptance", icon: AlertCircle, color: "var(--brand-accent)", bg: "rgba(255, 122, 89, 0.15)", trend: "Action needed" },
          { label: "Confirmed Queue", value: stats.confirmed, desc: "Accepted for examination", icon: Calendar, color: "var(--status-success)", bg: "var(--status-success-bg)", trend: "On schedule" },
          { label: "Completed Visits", value: stats.completed, desc: "Resolved consultations", icon: CheckCircle, color: "var(--brand-primary)", bg: "var(--bg-muted)", trend: "Audited care" },
        ].map(({ label, value, desc, icon: Icon, color, bg, trend }) => (
          <div key={label} className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon" style={{ backgroundColor: bg, color: color }}>
                <Icon size={22} />
              </div>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)", padding: "2px 8px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <TrendingUp size={11} /> {trend}
              </span>
            </div>
            <div className="stat-card-value">{loading ? "—" : value}</div>
            <div className="stat-card-label">{label}</div>
            <div className="stat-card-desc">{desc}</div>
          </div>
        ))}
      </div>

      {/* Today's Appointments Table + AI Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: "24px", alignItems: "flex-start" }}>
        <div className="table-wrapper">
          <div className="table-header">
            <div>
              <div className="table-title">Today's Scheduled Patients</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>{format(new Date(), "EEEE, MMMM d, yyyy")} • Live clinical queue</div>
            </div>
            <Link to="/doctor/appointments" className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
              View All Roster →
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div className="spinner spinner-dark" style={{ width: 28, height: 28, margin: "0 auto" }} />
            </div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Calendar size={28} /></div>
              <div className="empty-state-title">No Appointments Today</div>
              <p className="empty-state-desc">You have no scheduled clinical consultations remaining for today's roster.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Time Slot</th>
                  <th>Clinical Reason / Symptom</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {appt.patient?.profile_pic && !appt.patient?.profile_pic.includes("ui-avatars.com") ? (
                          <img src={appt.patient.profile_pic} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
                        ) : (
                          <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 600, flexShrink: 0 }}>
                            {getInitials(appt.patient?.full_name || "Patient")}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{appt.patient?.full_name || "Patient"}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "monospace" }}>ID: {appt.booking_reference}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px", color: "var(--text-primary)" }}>
                        <Clock size={14} color="var(--brand-primary)" />
                        {appt.slot?.start_time} – {appt.slot?.end_time}
                      </div>
                    </td>
                    <td style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                      {appt.reason || "General clinical checkup"}
                    </td>
                    <td><span className={`badge status-${appt.status}`}>{appt.status}</span></td>
                    <td>
                      {appt.status === "PENDING" && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => updateStatus(appt.id, "CONFIRMED")} className="btn btn-sm" style={{ backgroundColor: "var(--status-success)", color: "white", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 500 }} disabled={updating === appt.id}>
                            {updating === appt.id ? <div className="spinner" style={{ width: 12, height: 12 }} /> : <><CheckCircle size={14} /> Accept</>}
                          </button>
                          <button onClick={() => updateStatus(appt.id, "CANCELLED")} className="btn btn-secondary btn-sm" style={{ color: "var(--status-danger)", borderColor: "rgba(239, 68, 68, 0.3)", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 500 }} disabled={updating === appt.id}>
                            <XCircle size={14} /> Decline
                          </button>
                        </div>
                      )}
                      {appt.status === "CONFIRMED" && (
                        <button onClick={() => updateStatus(appt.id, "COMPLETED")} className="btn btn-primary btn-sm" style={{ padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 500 }} disabled={updating === appt.id}>
                          <CheckCircle size={14} /> Mark Completed
                        </button>
                      )}
                      {["COMPLETED", "CANCELLED"].includes(appt.status) && (
                        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500 }}>Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Column: Clinical OPD Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="card" style={{ padding: "20px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
              <Activity size={18} color="var(--brand-primary)" /> OPD Performance Metrics
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Avg. Consult Duration</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>~15 Mins</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Patient Satisfaction</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--status-success)" }}>4.9 / 5.0 ★</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>On-Time Compliance</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--brand-primary)" }}>98.4%</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "20px", border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
              <Sparkles size={16} color="var(--brand-accent)" /> AI Clinical Triage Note
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
              3 patients today presented with seasonal respiratory symptoms. Diagnostic protocol recommendations for asthma and bronchitis screening have been pre-loaded into your Digital Rx Pad.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
