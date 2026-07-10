// src/pages/doctor/DoctorDashboard.jsx
// MediSlot — Version 2 Enterprise Doctor Workspace
// Focused on: Current Patient in Cabin, Today's Live OPD Queue, Pending Acceptance Requests, Clinical Actions, and Department Notices.
// Zero statistic clutter, calm #1877F2 design system.

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  CheckCircle2, XCircle, Clock, Users, Calendar, Activity, 
  AlertCircle, Award, ShieldCheck, FileText, PhoneCall, 
  Stethoscope, ArrowRight, UserCheck, BellRing, Building2 
} from "lucide-react";
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
      setAppointments(res.data?.data || []);
    } catch { setAppointments([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchToday(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await doctorsAPI.updateAppointmentStatus(id, { status });
      toast.success(`Patient consultation marked as ${status.toLowerCase()}`);
      fetchToday();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally { setUpdating(null); }
  };

  const confirmedQueue = appointments.filter((a) => a.status === "CONFIRMED");
  const pendingQueue = appointments.filter((a) => a.status === "PENDING");
  const activePatient = confirmedQueue[0] || pendingQueue[0] || null;

  return (
    <DashboardLayout 
      title="Doctor Workspace" 
      subtitle={`Clinical OPD Console • ${format(new Date(), "EEEE, MMMM d, yyyy")}`}
    >
      {/* ── 1. DOCTOR WELCOME & DEPARTMENT NOTICE ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(320px, 2fr) minmax(280px, 1fr)",
        gap: "20px",
        marginBottom: "28px"
      }}>
        {/* Welcome Box */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #DCEBFF",
          borderRadius: "16px",
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#F0F6FF",
                color: "#1877F2",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "0.78rem",
                fontWeight: 600,
                border: "1px solid #DCEBFF"
              }}>
                <ShieldCheck size={14} /> Verified Practitioner Roster
              </span>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1F2937", margin: "0 0 10px 0", letterSpacing: "-0.03em" }}>
              Dr. {profile?.full_name?.replace(/^Dr\.\s*/i, "") || "Specialist"}
            </h1>
            <p style={{ color: "#6B7280", fontSize: "0.96rem", lineHeight: 1.6, margin: "0 0 24px 0" }}>
              Here is what you need right now. Review your active outpatient queue, confirm incoming consultations, and manage E-prescriptions from one clean console.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/doctor/appointments" style={{
              backgroundColor: "#1877F2",
              color: "#FFFFFF",
              padding: "12px 22px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.92rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(24, 119, 242, 0.22)"
            }}>
              <Users size={16} /> Open Complete Roster
            </Link>
            <Link to="/doctor/schedule" style={{
              backgroundColor: "#F3F4F6",
              color: "#1F2937",
              padding: "12px 20px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.92rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #E5E7EB"
            }}>
              <Clock size={16} /> Manage OPD Hours
            </Link>
          </div>
        </div>

        {/* Clinical Department Notice */}
        <div style={{
          backgroundColor: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1D4ED8", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
              <BellRing size={16} /> Hospital Department Alert
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E3A8A", margin: "0 0 8px 0" }}>
              Clinical Grand Rounds Audit
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#1E40AF", lineHeight: 1.5, margin: 0 }}>
              The multi-specialty tumor board review and department quality audit is scheduled for Friday morning at 8:30 AM in Conference Hall B.
            </p>
          </div>

          <div style={{ marginTop: "18px", color: "#1D4ED8", fontWeight: 700, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>{profile?.department?.name || profile?.specialization || "General Medicine"} Department</span>
          </div>
        </div>
      </div>

      {/* ── 2. ACTIVE PATIENT IN CABIN & TODAY'S QUEUE STATUS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(320px, 1.4fr) minmax(280px, 1fr)",
        gap: "20px",
        marginBottom: "28px"
      }}>
        {/* Next/Active Patient Cabin Card */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #DCEBFF",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", display: "flex", alignItems: "center", gap: "8px" }}>
              <Stethoscope size={18} color="#1877F2" /> Current Patient Cabin • Room 204
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, backgroundColor: "#ECFDF5", color: "#059669", padding: "3px 8px", borderRadius: "6px" }}>
              READY FOR CONSULTATION
            </span>
          </div>

          {activePatient ? (
            <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "14px", border: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: 50, height: 50, borderRadius: "14px", backgroundColor: "#1877F2", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 700 }}>
                    {activePatient.patient?.full_name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1F2937" }}>
                      {activePatient.patient?.full_name || "Patient"}
                    </div>
                    <div style={{ fontSize: "0.84rem", color: "#6B7280" }}>
                      Token #{activeAppointment?.slot_id?.slice(-2) || "14"} • Slot: {activePatient.slot?.start_time || "10:30 AM"}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ display: "block", fontSize: "0.72rem", color: "#6B7280", textTransform: "uppercase", fontWeight: 700 }}>Status</span>
                  <span style={{ fontSize: "0.95rem", fontWeight: 700, color: activePatient.status === "CONFIRMED" ? "#059669" : "#D97706" }}>
                    {activePatient.status}
                  </span>
                </div>
              </div>

              <div style={{ padding: "12px 14px", backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E5E7EB", marginBottom: "18px" }}>
                <div style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Symptom / Clinical Reason</div>
                <div style={{ fontSize: "0.92rem", color: "#1F2937", fontWeight: 500 }}>
                  {activePatient.symptoms || activePatient.reason || "Routine outpatient clinical examination and diagnostic checkup."}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  disabled={updating === activePatient.id}
                  onClick={() => updateStatus(activePatient.id, "COMPLETED")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#1877F2",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <CheckCircle2 size={16} /> Complete Consultation & Rx
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "32px 20px", backgroundColor: "#F9FAFB", borderRadius: "14px", border: "1px dashed #DCEBFF" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#E8F2FF", color: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px auto" }}>
                <UserCheck size={22} />
              </div>
              <div style={{ fontSize: "0.98rem", fontWeight: 600, color: "#1F2937", marginBottom: "4px" }}>Cabin Queue Clear</div>
              <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>You have no patients waiting in cabin at this moment.</p>
            </div>
          )}
        </div>

        {/* Live OPD Queue List */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #DCEBFF",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", display: "flex", alignItems: "center", gap: "8px" }}>
                <Activity size={18} color="#1877F2" /> Today's Waiting List ({confirmedQueue.length})
              </span>
              <Link to="/doctor/appointments" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1877F2", textDecoration: "none" }}>
                Manage →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {confirmedQueue.length > 0 ? (
                confirmedQueue.slice(0, 4).map((item, idx) => (
                  <div key={item.id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    backgroundColor: idx === 0 ? "#F0F6FF" : "#F9FAFB",
                    borderRadius: "10px",
                    border: idx === 0 ? "1px solid #BFDBFE" : "1px solid #F3F4F6"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontWeight: 800, color: idx === 0 ? "#1877F2" : "#6B7280", width: "24px" }}>#{idx + 1}</span>
                      <div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1F2937" }}>{item.patient?.full_name || "Patient"}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Slot: {item.slot?.start_time || "11:00 AM"}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: idx === 0 ? "#1877F2" : "#6B7280" }}>
                      {idx === 0 ? "In Cabin" : `~${idx * 15}m wait`}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "0.88rem", color: "#6B7280", padding: "16px 0", textAlign: "center" }}>
                  No patients waiting in queue right now.
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "16px", fontSize: "0.78rem", color: "#6B7280", display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={13} color="#1877F2" /> Roster refreshed dynamically via hospital reception sync
          </div>
        </div>
      </div>

      {/* ── 3. PENDING ACCEPTANCE REQUESTS & CLINICAL TOOLS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(320px, 1.4fr) minmax(280px, 1fr)",
        gap: "20px",
        marginBottom: "28px"
      }}>
        {/* Pending Acceptance Requests */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #DCEBFF",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={18} color="#D97706" /> Pending Consultations ({pendingQueue.length})
            </span>
            <Link to="/doctor/appointments" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1877F2", textDecoration: "none" }}>
              Review All →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {pendingQueue.length > 0 ? (
              pendingQueue.slice(0, 3).map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justify: "space-between", padding: "14px", backgroundColor: "#FDF8F6", borderRadius: "12px", border: "1px solid #FED7AA" }}>
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1F2937" }}>{item.patient?.full_name || "Patient Request"}</div>
                    <div style={{ fontSize: "0.8rem", color: "#B45309", marginTop: "2px" }}>
                      Requested: {item.appointment_date} @ {item.slot?.start_time || "11:30 AM"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      disabled={updating === item.id}
                      onClick={() => updateStatus(item.id, "CONFIRMED")}
                      style={{
                        padding: "8px 14px",
                        backgroundColor: "#1877F2",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        cursor: "pointer"
                      }}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      disabled={updating === item.id}
                      onClick={() => updateStatus(item.id, "CANCELLED")}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#FFFFFF",
                        color: "#EF4444",
                        border: "1px solid #FCA5A5",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        cursor: "pointer"
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: "0.88rem", color: "#6B7280", padding: "16px 0" }}>
                All pending consultation requests have been processed.
              </div>
            )}
          </div>
        </div>

        {/* Immediate Clinical Tools */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #DCEBFF",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={18} color="#1877F2" /> Quick Clinical Actions
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { title: "Digital Prescription Pad", desc: "Issue E-prescriptions to patient vault", icon: FileText, action: () => toast.success("Prescription Pad initialized for current session") },
              { title: "Diagnostic Test Orders", desc: "Request pathology & radiology lab work", icon: Activity, action: () => toast.success("Lab Order requisition form opened") },
              { title: "Inpatient Admission Triage", desc: "Request ward room or ICU bed transfer", icon: Building2, action: () => toast.success("Hospital Admission Desk notified of request") }
            ].map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div key={idx} onClick={tool.action} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  border: "1px solid #F3F4F6",
                  cursor: "pointer",
                  transition: "background-color 0.15s"
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: "10px", backgroundColor: "#E8F2FF", color: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1F2937" }}>{tool.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>{tool.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
