// src/pages/patient/BookAppointment.jsx
import { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, CheckCircle, ArrowLeft, AlertCircle, ShieldCheck, FileText } from "lucide-react";
import { appointmentsAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AppointmentTimeline from "../../components/common/AppointmentTimeline";
import AppointmentSlipModal from "../../components/common/AppointmentSlipModal";
import toast from "react-hot-toast";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(null);
  const [showSlip, setShowSlip] = useState(false);

  const doctor = state?.doctor;
  const slot = state?.slot;

  if (!doctor || !slot) {
    return (
      <DashboardLayout title="Request Consultation">
        <div className="empty-state">
          <div className="empty-state-icon"><AlertCircle size={28} /></div>
          <div className="empty-state-title">No Consultation Data</div>
          <p className="empty-state-desc">Please select a specialist doctor and time slot first from the clinical directory.</p>
          <Link to="/doctors" className="btn btn-primary btn-sm" style={{ marginTop: "16px", fontWeight: 500 }}>
            <Calendar size={15} /> Browse Specialists
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleBook = async () => {
    setLoading(true);
    try {
      const res = await appointmentsAPI.book({ doctor_id: doctorId, slot_id: slot.id, reason });
      setBooked(res.data.data);
      toast.success(`Appointment request submitted! Ref ID: ${res.data.data.booking_reference}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking request failed. Please try again.");
    } finally { setLoading(false); }
  };

  if (booked) {
    return (
      <DashboardLayout title="Request Transmitted">
        <div style={{ maxWidth: "620px", margin: "0 auto", textAlign: "center", padding: "24px 0" }}>
          <div style={{ width: 68, height: 68, backgroundColor: "var(--status-info-bg)", color: "var(--brand-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "1.5px solid var(--border)" }}>
            <Clock size={34} />
          </div>
          <h2 style={{ marginBottom: "8px", color: "var(--text-primary)", fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Appointment Request Submitted</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Your consultation request has been transmitted to <strong style={{ color: "var(--text-primary)" }}>Dr. {doctor.full_name}</strong>'s desk and is currently awaiting clinical review & acceptance.
          </p>

          {/* Appointment Timeline Component */}
          <div className="card card-body" style={{ marginBottom: "28px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", textAlign: "left" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              Consultation Status Tracker
            </div>
            <AppointmentTimeline status={booked.status || "PENDING"} date={booked.appointment_date} timeSlot={`${slot.start_time} – ${slot.end_time}`} />
          </div>

          <div className="card card-body" style={{ textAlign: "left", marginBottom: "28px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
              <img src={doctor.profile_pic} alt={doctor.full_name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>{doctor.full_name}</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--brand-primary)", fontWeight: 600 }}>{doctor.specialization}</p>
              </div>
            </div>
            {[
              { label: "Booking Reference", value: booked.booking_reference, mono: true },
              { label: "Requested Date", value: booked.appointment_date },
              { label: "Time Slot", value: `${slot.start_time} – ${slot.end_time}` },
              { label: "Consultation Fee", value: `₹${doctor.consultation_fee}`, bold: true },
            ].map(({ label, value, mono, bold }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: "0.9rem", fontWeight: bold ? 700 : 600, fontFamily: mono ? "monospace" : "inherit", color: mono ? "var(--brand-primary)" : bold ? "var(--brand-primary)" : "var(--text-primary)" }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setShowSlip(true)} className="btn btn-secondary" style={{ padding: "12px 24px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={16} /> View / Download Clinical Slip
            </button>
            <Link to="/patient/appointments" className="btn btn-primary" style={{ padding: "12px 24px", fontWeight: 600 }}>View My Consultations</Link>
          </div>
        </div>

        {showSlip && <AppointmentSlipModal appointment={{ ...booked, doctor, slot }} onClose={() => setShowSlip(false)} />}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Request Consultation" subtitle="Review clinical appointment details and submit consultation request">
      <div style={{ maxWidth: "600px", margin: "0 auto", paddingBottom: "40px" }}>
        <Link to={`/doctors/${doctorId}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.85rem", fontWeight: 500, textDecoration: "none", transition: "color 150ms ease" }}>
          <ArrowLeft size={16} /> Back to Specialist Profile
        </Link>

        {/* Doctor Summary */}
        <div className="card card-body" style={{ marginBottom: "24px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <img src={doctor.profile_pic} alt={doctor.full_name} style={{ width: 64, height: 64, borderRadius: "var(--radius-lg)", objectFit: "cover", border: "1px solid var(--border)" }} />
            <div>
              <h3 style={{ marginBottom: "2px", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{doctor.full_name}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--brand-primary)", fontWeight: 600, marginBottom: "4px" }}>{doctor.specialization}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{doctor.qualification}</p>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="card card-body" style={{ marginBottom: "24px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h4 style={{ marginBottom: "16px", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Appointment Specification</h4>
          <div style={{ display: "grid", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>
                <Calendar size={16} color="var(--brand-primary)" /> Schedule Date
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{slot.slot_date}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>
                <Clock size={16} color="var(--brand-primary)" /> Time Slot
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{slot.start_time} – {slot.end_time}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 600 }}>Consultation Fee</span>
              <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--brand-primary)" }}>₹{doctor.consultation_fee}</span>
            </div>
          </div>
        </div>

        {/* Reason for Visit */}
        <div className="card card-body" style={{ marginBottom: "24px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label" style={{ fontWeight: 600, marginBottom: "6px" }}>Reason for Consultation (optional)</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Describe your symptoms, clinical history, or reason for visiting..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ resize: "vertical", minHeight: "80px", fontSize: "0.875rem", padding: "10px 14px" }}
            />
          </div>
        </div>

        {/* Confirm Booking CTA (Non-bold! Medium/Semi-bold 500/600 only) */}
        <button onClick={handleBook} className="btn btn-cta btn-lg" style={{ width: "100%", padding: "14px", fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }} disabled={loading}>
          {loading ? <><div className="spinner" />Transmitting Request...</> : <><Clock size={18} /> Submit Appointment Request</>}
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "16px", padding: "12px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontWeight: 500 }}>
          <ShieldCheck size={16} color="var(--brand-primary)" />
          <span>Subject to specialist review • Free cancellation up to 2 hours prior</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
