// src/pages/doctor/DoctorAppointments.jsx
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Calendar, FileText, Activity, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { doctorsAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AppointmentTimeline from "../../components/common/AppointmentTimeline";
import AppointmentSlipModal from "../../components/common/AppointmentSlipModal";
import toast from "react-hot-toast";

const TABS = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [updating, setUpdating] = useState(null);
  const [notesModal, setNotesModal] = useState(null);
  const [notes, setNotes] = useState("");
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [proposedSlot, setProposedSlot] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [expandedTimeline, setExpandedTimeline] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = activeTab !== "ALL" ? { status: activeTab } : {};
      const res = await doctorsAPI.getMyAppointments(params);
      setAppointments(res.data.data || []);
    } catch { setAppointments([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [activeTab]);

  const updateStatus = async (id, status, noteText) => {
    setUpdating(id);
    try {
      await doctorsAPI.updateAppointmentStatus(id, { status, notes: noteText });
      toast.success(`Appointment marked as ${status.toLowerCase()}`);
      setNotesModal(null);
      setRescheduleModal(null);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally { setUpdating(null); }
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleModal) return;
    const noteText = `[RESCHEDULE PROPOSED: ${proposedSlot || "Alternative time requested"}] ${rescheduleReason}`;
    updateStatus(rescheduleModal.id, "PENDING", noteText);
    toast.success("Reschedule proposal sent to patient");
  };

  const toggleTimeline = (id) => {
    setExpandedTimeline(expandedTimeline === id ? null : id);
  };

  const getInitials = (name) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
  };

  return (
    <DashboardLayout title="Patient Consultations" subtitle="Manage, review, and coordinate all patient consultations across your roster">
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", marginBottom: "24px", overflowX: "auto" }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: "12px 20px", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: activeTab === tab ? "var(--brand-primary)" : "var(--text-secondary)", borderBottom: activeTab === tab ? "2px solid var(--brand-primary)" : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap", transition: "all 150ms ease" }}>
            {tab === "ALL" ? "All Consultations" : tab === "PENDING" ? "Pending Review" : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: "64px 0", textAlign: "center" }}><div className="spinner spinner-dark" style={{ width: 32, height: 32, margin: "0 auto" }} /></div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Calendar size={28} /></div>
            <div className="empty-state-title">No Consultations Found</div>
            <p className="empty-state-desc">We couldn't find any patient consultations matching the selected status filter.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Patient Demographics</th>
                <th>Schedule Date & Time</th>
                <th>Clinical Reason / Symptom</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <React.Fragment key={appt.id}>
                  <tr>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {appt.patient?.profile_pic && !appt.patient?.profile_pic.includes("ui-avatars.com") ? (
                          <img src={appt.patient.profile_pic} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0 }}>
                            {getInitials(appt.patient?.full_name || "Patient")}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{appt.patient?.full_name || "Patient"}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "monospace", fontWeight: 600 }}>ID: {appt.booking_reference}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>{appt.appointment_date}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--brand-primary)", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                        <Clock size={13} color="var(--brand-primary)" /> {appt.slot?.start_time} – {appt.slot?.end_time}
                      </div>
                    </td>
                    <td style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                      {appt.reason || "General clinical checkup"}
                    </td>
                    <td><span className={`badge status-${appt.status}`} style={{ fontWeight: 700 }}>{appt.status === "PENDING" ? "Pending Review" : appt.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                        <button onClick={() => setSelectedSlip(appt)} className="btn btn-secondary btn-sm" title="View Clinical Slip" style={{ padding: "6px 10px", fontWeight: 600 }}>
                          <FileText size={14} /> Slip
                        </button>
                        <button onClick={() => toggleTimeline(appt.id)} className="btn btn-secondary btn-sm" title="Lifecycle Tracker" style={{ padding: "6px 10px", fontWeight: 600 }}>
                          <Activity size={14} />
                        </button>

                        {appt.status === "PENDING" && (
                          <>
                            <button onClick={() => updateStatus(appt.id, "CONFIRMED")} className="btn btn-sm" style={{ backgroundColor: "var(--status-success)", color: "white", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600 }} disabled={updating === appt.id}>
                              <CheckCircle size={14} /> Accept
                            </button>
                            <button onClick={() => { setRescheduleModal(appt); setProposedSlot(""); setRescheduleReason(""); }} className="btn btn-secondary btn-sm" style={{ color: "var(--brand-primary)", borderColor: "rgba(21, 101, 192, 0.3)", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600 }} disabled={updating === appt.id}>
                              <RefreshCw size={14} /> Propose Slot
                            </button>
                            <button onClick={() => updateStatus(appt.id, "CANCELLED")} className="btn btn-secondary btn-sm" style={{ color: "var(--status-danger)", borderColor: "rgba(239, 68, 68, 0.3)", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600 }} disabled={updating === appt.id}>
                              <XCircle size={14} /> Decline
                            </button>
                          </>
                        )}
                        {appt.status === "CONFIRMED" && (
                          <button onClick={() => { setNotesModal(appt); setNotes(""); }} className="btn btn-cta btn-sm" style={{ padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                            <CheckCircle size={14} /> Complete Consultation
                          </button>
                        )}
                        {["COMPLETED", "CANCELLED"].includes(appt.status) && (
                          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, marginLeft: "4px" }}>Archived</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedTimeline === appt.id && (
                    <tr style={{ backgroundColor: "var(--bg-surface)" }}>
                      <td colSpan={5} style={{ padding: "16px 24px" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                          Consultation Lifecycle Tracker • Ref: {appt.booking_reference}
                        </div>
                        <AppointmentTimeline status={appt.status} date={appt.appointment_date} timeSlot={`${appt.slot?.start_time} – ${appt.slot?.end_time}`} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Slip Modal */}
      {selectedSlip && <AppointmentSlipModal appointment={selectedSlip} onClose={() => setSelectedSlip(null)} />}

      {/* Propose New Slot / Reschedule Modal */}
      {rescheduleModal && (
        <div className="modal-overlay" onClick={() => setRescheduleModal(null)} style={{ zIndex: 1100 }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
            <h3 style={{ marginBottom: "8px", fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", color: "var(--text-primary)" }}>
              <RefreshCw size={20} color="var(--brand-primary)" /> Propose Alternative Time Slot
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: 1.6 }}>
              Suggest a new schedule for <strong style={{ color: "var(--text-primary)" }}>{rescheduleModal.patient?.full_name}</strong>. The patient will be notified to confirm the new appointment time.
            </p>
            <div className="input-group" style={{ marginBottom: "16px" }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Proposed Date & Time Slot</label>
              <input type="text" className="input-field" placeholder="e.g., Tomorrow at 4:30 PM – 5:00 PM"
                value={proposedSlot} onChange={(e) => setProposedSlot(e.target.value)} />
            </div>
            <div className="input-group" style={{ marginBottom: "24px" }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Reason for Schedule Change (optional)</label>
              <textarea className="input-field" rows={3} placeholder="e.g., Emergency surgery conflict during originally requested slot..."
                value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)} style={{ resize: "vertical", padding: "10px 14px", fontSize: "0.875rem" }} />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setRescheduleModal(null)} className="btn btn-secondary" style={{ flex: 1, fontWeight: 600 }}>Cancel</button>
              <button onClick={handleRescheduleSubmit} className="btn btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 600 }} disabled={updating === rescheduleModal.id}>
                {updating === rescheduleModal.id ? <><div className="spinner" />Sending...</> : <><RefreshCw size={16} /> Send Reschedule Proposal</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {notesModal && (
        <div className="modal-overlay" onClick={() => setNotesModal(null)} style={{ zIndex: 1100 }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
            <h3 style={{ marginBottom: "8px", fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", color: "var(--text-primary)" }}>
              <FileText size={20} color="var(--brand-primary)" /> Complete Consultation
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Add clinical notes, diagnosis, or prescription summaries for <strong style={{ color: "var(--text-primary)" }}>{notesModal.patient?.full_name}</strong>.
            </p>
            <div className="input-group" style={{ marginBottom: "24px" }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Doctor's Clinical Notes (optional)</label>
              <textarea className="input-field" rows={4} placeholder="Enter clinical diagnosis, prescribed medications, and follow-up instructions..."
                value={notes} onChange={(e) => setNotes(e.target.value)} style={{ resize: "vertical", padding: "10px 14px", fontSize: "0.875rem" }} />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setNotesModal(null)} className="btn btn-secondary" style={{ flex: 1, fontWeight: 600 }}>Cancel</button>
              <button onClick={() => updateStatus(notesModal.id, "COMPLETED", notes)} className="btn btn-cta" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 600 }} disabled={updating === notesModal.id}>
                {updating === notesModal.id ? <><div className="spinner" />Saving...</> : <><CheckCircle size={16} /> Mark Complete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
