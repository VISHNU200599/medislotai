// src/pages/patient/PatientAppointments.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, X, ChevronRight, Search, Building2, FileText, Activity, ChevronDown, ChevronUp } from "lucide-react";
import { appointmentsAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AppointmentTimeline from "../../components/common/AppointmentTimeline";
import AppointmentSlipModal from "../../components/common/AppointmentSlipModal";
import toast from "react-hot-toast";

const TABS = ["ALL", "CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"];
const STATUS_LABELS = { CONFIRMED: "Confirmed", PENDING: "Pending Review", COMPLETED: "Completed", CANCELLED: "Cancelled", NO_SHOW: "No Show" };

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [expandedTimeline, setExpandedTimeline] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = activeTab !== "ALL" ? { status: activeTab } : {};
      const res = await appointmentsAPI.getMyAppointments(params);
      setAppointments(res.data.data || []);
    } catch { setAppointments([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, [activeTab]);

  const handleCancel = async () => {
    if (!cancelModal) return;
    setCancelling(true);
    try {
      await appointmentsAPI.cancel(cancelModal.id, { cancel_reason: cancelReason || "Patient cancelled consultation" });
      toast.success("Appointment cancelled successfully");
      setCancelModal(null);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel appointment");
    } finally { setCancelling(false); }
  };

  const toggleTimeline = (id) => {
    setExpandedTimeline(expandedTimeline === id ? null : id);
  };

  return (
    <DashboardLayout title="My Consultations" subtitle="View and coordinate all your scheduled medical appointments">
      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", marginBottom: "24px", overflowX: "auto" }}>
        {TABS.map((tab) => {
          const count = tab === "ALL" ? appointments.length : appointments.filter((a) => a.status === tab).length;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "12px 20px", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: activeTab === tab ? "var(--brand-primary)" : "var(--text-secondary)", borderBottom: activeTab === tab ? "2px solid var(--brand-primary)" : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap", transition: "all 150ms ease", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{STATUS_LABELS[tab] || "All"}</span>
              {count > 0 && (
                <span style={{ backgroundColor: activeTab === tab ? "var(--brand-primary)" : "var(--bg-muted)", color: activeTab === tab ? "white" : "var(--text-secondary)", borderRadius: "var(--radius-full)", padding: "2px 8px", fontSize: "0.75rem", fontWeight: 600 }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <div className="spinner spinner-dark" style={{ width: 32, height: 32, margin: "0 auto" }} />
        </div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Calendar size={28} /></div>
          <div className="empty-state-title">No Appointments Found</div>
          <p className="empty-state-desc">We couldn't find any clinical consultations matching the selected status filter.</p>
          <Link to="/doctors" className="btn btn-primary btn-sm" style={{ marginTop: "16px", fontWeight: 500 }}>
            <Calendar size={15} /> Book Consultation
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {appointments.map((appt) => (
            <div key={appt.id} className="card" style={{ borderLeft: `4px solid ${appt.status === "CONFIRMED" ? "var(--brand-primary)" : appt.status === "COMPLETED" ? "var(--status-success)" : appt.status === "CANCELLED" ? "var(--status-danger)" : "var(--brand-accent)"}`, backgroundColor: "var(--bg-card)", borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
              <div className="card-body" style={{ display: "flex", gap: "20px", alignItems: "center", padding: "20px", flexWrap: "wrap" }}>
                <img src={appt.doctor?.profile_pic} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid var(--border)" }} />
                
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "8px" }}>
                    <div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "2px", color: "var(--text-primary)" }}>{appt.doctor?.full_name}</h4>
                      <p style={{ fontSize: "0.82rem", color: "var(--brand-primary)", fontWeight: 600, marginBottom: "8px" }}>{appt.doctor?.specialization}</p>
                      
                      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 500 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Calendar size={14} color="var(--brand-primary)" /> {appt.appointment_date}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Clock size={14} color="var(--brand-primary)" /> {appt.slot?.start_time} – {appt.slot?.end_time}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Building2 size={14} color="var(--brand-primary)" /> {appt.hospital?.name}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span className={`badge status-${appt.status}`} style={{ marginBottom: "6px", fontWeight: 700 }}>
                        {STATUS_LABELS[appt.status] || appt.status}
                      </span>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace", fontWeight: 600 }}>ID: {appt.booking_reference}</div>
                    </div>
                  </div>

                  {appt.reason && (
                    <div style={{ marginTop: "12px", padding: "10px 14px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Consultation Notes:</strong> {appt.reason}
                    </div>
                  )}
                </div>

                {/* Actions Group */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0, minWidth: "180px" }}>
                  <button onClick={() => setSelectedSlip(appt)} className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 600, padding: "8px 12px" }}>
                    <FileText size={14} /> View Clinical Slip
                  </button>
                  <button onClick={() => toggleTimeline(appt.id)} className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 600, padding: "8px 12px" }}>
                    <Activity size={14} /> {expandedTimeline === appt.id ? "Hide Status Tracker" : "Track Consultation"}
                    {expandedTimeline === appt.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {["CONFIRMED", "PENDING"].includes(appt.status) && (
                    <button onClick={() => setCancelModal(appt)}
                      className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "var(--status-danger)", borderColor: "rgba(239, 68, 68, 0.3)", fontWeight: 600, padding: "8px 12px" }}>
                      <X size={14} /> Cancel Appointment
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Timeline Section */}
              {expandedTimeline === appt.id && (
                <div style={{ padding: "16px 24px 24px", backgroundColor: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottomLeftRadius: "var(--radius-lg)", borderBottomRightRadius: "var(--radius-lg)" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                    Clinical Consultation Lifecycle
                  </div>
                  <AppointmentTimeline status={appt.status} date={appt.appointment_date} timeSlot={`${appt.slot?.start_time} – ${appt.slot?.end_time}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Slip Modal */}
      {selectedSlip && <AppointmentSlipModal appointment={selectedSlip} onClose={() => setSelectedSlip(null)} />}

      {/* Cancel Consultation Modal */}
      {cancelModal && (
        <div className="modal-overlay" onClick={() => setCancelModal(null)} style={{ zIndex: 1100 }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
            <h3 style={{ marginBottom: "8px", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>Cancel Scheduled Consultation?</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: 1.6 }}>
              Are you sure you wish to cancel your clinical appointment with <strong style={{ color: "var(--text-primary)" }}>{cancelModal.doctor?.full_name}</strong> on {cancelModal.appointment_date}?
            </p>
            <div className="input-group" style={{ marginBottom: "24px" }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Cancellation Reason (optional)</label>
              <input type="text" className="input-field" placeholder="e.g., Schedule conflict or health improvement" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setCancelModal(null)} className="btn btn-secondary" style={{ flex: 1, fontWeight: 600 }}>Keep Appointment</button>
              <button onClick={handleCancel} className="btn btn-danger" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 600 }} disabled={cancelling}>
                {cancelling ? <><div className="spinner" />Cancelling...</> : <>Confirm Cancellation</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
