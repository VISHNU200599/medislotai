// src/components/common/AppointmentSlipModal.jsx
import React from "react";
import { X, Printer, Download, ShieldCheck, CheckCircle, Calendar, Clock, MapPin, Stethoscope, User, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AppointmentSlipModal({ appointment, onClose }) {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
    toast.success("Printing clinical appointment slip...");
  };

  const handleDownload = () => {
    toast.success("Downloading PDF Slip... (Ref: " + (appointment.booking_reference || "MS-REF") + ")");
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px", padding: "0", overflow: "hidden", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
        
        {/* Slip Header */}
        <div style={{ backgroundColor: "var(--brand-dark)", color: "white", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-secondary)", marginBottom: "6px" }}>
              <ShieldCheck size={16} /> MediSlot • Verified Clinical Slip
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "white" }}>Outpatient Consultation Pass</h3>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", margin: "4px 0 0" }}>Please present this slip at the hospital reception counter.</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        {/* Slip Body */}
        <div style={{ padding: "28px" }}>
          {/* Barcode & Reference Banner */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px dashed var(--brand-primary)", marginBottom: "24px" }}>
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Booking Reference ID</div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--brand-primary)", fontFamily: "monospace", letterSpacing: "0.05em", marginTop: "2px" }}>
                {appointment.booking_reference || "MS-2026-X89"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              {/* Simulated CSS Barcode */}
              <div style={{ display: "flex", gap: "2px", height: "32px", alignItems: "center", justifyContent: "flex-end", marginBottom: "4px" }}>
                {[3,1,2,4,1,3,2,1,4,2,3,1,2,3,1,4,2,1,3,2].map((w, i) => (
                  <div key={i} style={{ width: `${w * 1.5}px`, height: "100%", backgroundColor: "var(--text-primary)" }} />
                ))}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "monospace", fontWeight: 600 }}>SECURITY VERIFIED</div>
            </div>
          </div>

          {/* Patient & Doctor Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                <User size={14} color="var(--brand-primary)" /> Patient Details
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {appointment.patient?.full_name || "Patient Name"}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                {appointment.patient?.email || "Verified Patient"}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                <Stethoscope size={14} color="var(--brand-primary)" /> Assigned Specialist
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {appointment.doctor?.full_name || "Specialist Doctor"}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--brand-primary)", fontWeight: 600, marginTop: "2px" }}>
                {appointment.doctor?.specialization || "Clinical Department"}
              </div>
            </div>
          </div>

          {/* Schedule & Facility Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div style={{ padding: "14px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "4px" }}>
                <Calendar size={14} color="var(--brand-primary)" /> Date & Time Slot
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {appointment.appointment_date}
              </div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--brand-primary)", marginTop: "2px" }}>
                {appointment.slot?.start_time} – {appointment.slot?.end_time}
              </div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "4px" }}>
                <Building2 size={14} color="var(--brand-primary)" /> Hospital Facility
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {appointment.hospital?.name || "MediSlot Medical Center"}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                {appointment.hospital?.city || "Healthcare Complex"}
              </div>
            </div>
          </div>

          {/* Consultation Fee & Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", marginBottom: "24px" }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>Consultation Status:</span>
              <span className={`badge status-${appointment.status}`} style={{ marginLeft: "8px", fontWeight: 700 }}>
                {appointment.status || "CONFIRMED"}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600, marginRight: "8px" }}>Consultation Fee:</span>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--brand-primary)" }}>
                ₹{appointment.doctor?.consultation_fee || "500"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", fontWeight: 600 }}>
              <Printer size={16} /> Print Clinical Slip
            </button>
            <button onClick={handleDownload} className="btn btn-secondary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", fontWeight: 600 }}>
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
