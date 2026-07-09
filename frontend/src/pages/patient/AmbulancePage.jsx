// src/pages/patient/AmbulancePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Ambulance, AlertTriangle, MapPin, Building2, Clock, CheckCircle,
  XCircle, ArrowLeft, PhoneCall, Activity, Zap, RefreshCw
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { hospitalsAPI } from "../../services/api";
import toast from "react-hot-toast";

const EMERGENCY_TYPES = [
  { id: "CARDIAC", label: "Cardiac Emergency", icon: "❤️", color: "#EF4444", desc: "Heart attack, chest pain, palpitations" },
  { id: "TRAUMA", label: "Trauma / Accident", icon: "🚨", color: "#F97316", desc: "Road accidents, fractures, injuries" },
  { id: "BREATHING", label: "Respiratory Distress", icon: "🫁", color: "#3B82F6", desc: "Asthma attack, difficulty breathing" },
  { id: "MATERNITY", label: "Maternity Emergency", icon: "👶", color: "#EC4899", desc: "Labor, obstetric emergency" },
  { id: "GENERAL", label: "General Emergency", icon: "🏥", color: "#8B5CF6", desc: "Unconscious, severe pain, high fever" },
];

const STATUS_STEPS = [
  { key: "REQUESTED", label: "Request Submitted", icon: CheckCircle },
  { key: "DISPATCHED", label: "Ambulance Dispatched", icon: Activity },
  { key: "EN_ROUTE", label: "En Route to Pickup", icon: Ambulance },
  { key: "ARRIVED", label: "Ambulance Arrived", icon: MapPin },
  { key: "COMPLETED", label: "Reached Hospital", icon: Building2 },
];

const ETA_MAP = { CARDIAC: 8, TRAUMA: 10, BREATHING: 9, MATERNITY: 12, GENERAL: 15 };

export default function AmbulancePage() {
  const [hospitals, setHospitals] = useState([]);
  const [step, setStep] = useState("form"); // "form" | "tracking"
  const [request, setRequest] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    emergency_type: "",
    pickup_address: "",
    hospital_id: "",
    notes: "",
  });

  useEffect(() => {
    hospitalsAPI.getAll({ limit: 20 }).then((res) => {
      setHospitals(res.data.data || []);
    }).catch(() => {});
  }, []);

  // Auto-advance tracking status (simulate real-time updates)
  useEffect(() => {
    if (step !== "tracking") return;
    if (trackingStatus >= STATUS_STEPS.length - 1) return;

    const delay = [3000, 8000, 12000, 20000][trackingStatus] || 10000;
    const timer = setTimeout(() => {
      setTrackingStatus((prev) => prev + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [step, trackingStatus]);

  const handleSubmit = async () => {
    if (!form.emergency_type) return toast.error("Please select an emergency type");
    if (!form.pickup_address.trim()) return toast.error("Please enter your pickup address");
    if (!form.hospital_id) return toast.error("Please select a destination hospital");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const hospital = hospitals.find((h) => h.id === form.hospital_id);
    const emergencyType = EMERGENCY_TYPES.find((e) => e.id === form.emergency_type);
    const eta = ETA_MAP[form.emergency_type] || 12;

    const newRequest = {
      id: `AMB-${Date.now()}`,
      emergency_type: emergencyType,
      pickup_address: form.pickup_address,
      hospital,
      notes: form.notes,
      status: "REQUESTED",
      eta_minutes: eta,
      driver: "Suresh Kumar",
      vehicle_number: "MH-01-AB-1234",
      created_at: new Date().toISOString(),
    };

    setRequest(newRequest);
    setStep("tracking");
    setTrackingStatus(0);
    setLoading(false);
    toast.success("🚨 Ambulance dispatched! Help is on the way.");
  };

  const handleCancel = () => {
    toast.success("Ambulance request cancelled.");
    setStep("form");
    setRequest(null);
    setTrackingStatus(0);
    setForm({ emergency_type: "", pickup_address: "", hospital_id: "", notes: "" });
  };

  return (
    <DashboardLayout title="Emergency Ambulance" subtitle="Request immediate emergency medical transport">
      {step === "form" ? (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link
            to="/patient/dashboard"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", marginBottom: 24, fontSize: "0.85rem", fontWeight: 500, textDecoration: "none" }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          {/* Emergency Banner */}
          <div style={{ background: "linear-gradient(135deg, #DC2626, #991B1B)", borderRadius: "var(--radius-lg)", padding: "24px 28px", marginBottom: 28, color: "white", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ambulance size={28} />
            </div>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 4 }}>Emergency Ambulance Service</div>
              <p style={{ fontSize: "0.875rem", opacity: 0.9, margin: 0 }}>
                Avg response time: <strong>8–15 minutes</strong>. For life-threatening emergencies, also call <strong>108</strong>.
              </p>
            </div>
            <a href="tel:108" style={{ marginLeft: "auto", flexShrink: 0, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "var(--radius-md)", padding: "10px 16px", color: "white", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
              <PhoneCall size={16} /> Call 108
            </a>
          </div>

          {/* Step 1: Emergency Type */}
          <div className="card" style={{ padding: "24px", marginBottom: 20, border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={18} color="var(--brand-accent)" /> Select Emergency Type
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {EMERGENCY_TYPES.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setForm({ ...form, emergency_type: e.id })}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "var(--radius-md)",
                    border: `2px solid ${form.emergency_type === e.id ? e.color : "var(--border)"}`,
                    backgroundColor: form.emergency_type === e.id ? `${e.color}15` : "var(--bg-surface)",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{e.icon}</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{e.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{e.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Location Details */}
          <div className="card" style={{ padding: "24px", marginBottom: 20, border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={18} color="var(--brand-primary)" /> Pickup & Destination
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Pickup Address *</label>
                <input
                  className="input-field"
                  placeholder="Enter your current address or landmark..."
                  value={form.pickup_address}
                  onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
                />
              </div>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Destination Hospital *</label>
                <select
                  className="input-field"
                  value={form.hospital_id}
                  onChange={(e) => setForm({ ...form, hospital_id: e.target.value })}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select nearest hospital...</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>{h.name} — {h.city}</option>
                  ))}
                </select>
              </div>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Additional Notes (optional)</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Any additional information for the paramedic team..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-lg"
            style={{ width: "100%", background: "#DC2626", color: "white", padding: "16px", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: "var(--radius-md)", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Dispatching Ambulance...</> : <><Ambulance size={18} /> Request Emergency Ambulance</>}
          </button>
          <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 12 }}>
            By requesting, you confirm this is a genuine medical emergency.
          </p>
        </div>
      ) : (
        /* Tracking View */
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Active Request Banner */}
          <div style={{ background: "linear-gradient(135deg, #059669, #065F46)", borderRadius: "var(--radius-lg)", padding: "24px 28px", marginBottom: 28, color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#34D399", animation: "pulse 1.5s ease-in-out infinite" }} />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.9, textTransform: "uppercase", letterSpacing: "0.06em" }}>Live Tracking</span>
                </div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 4 }}>
                  Ambulance En Route
                </div>
                <div style={{ fontSize: "0.875rem", opacity: 0.85 }}>
                  {request?.emergency_type?.label} • {request?.hospital?.name}
                </div>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "var(--radius-md)", padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900 }}>{request?.eta_minutes}</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>min ETA</div>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="card" style={{ padding: "20px 24px", marginBottom: 20, border: "1px solid var(--border)", display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ambulance size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{request?.driver}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Paramedic Driver • Vehicle: {request?.vehicle_number}</div>
            </div>
            <a
              href="tel:+919000000001"
              style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--status-success-bg)", color: "var(--status-success)", border: "1px solid var(--status-success)", borderRadius: "var(--radius-md)", padding: "8px 16px", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}
            >
              <PhoneCall size={14} /> Call Driver
            </a>
          </div>

          {/* Status Timeline */}
          <div className="card" style={{ padding: "24px", marginBottom: 20, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20 }}>
              Live Status Tracker
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {STATUS_STEPS.map((s, idx) => {
                const isCompleted = idx <= trackingStatus;
                const isCurrent = idx === trackingStatus;
                const Icon = s.icon;
                return (
                  <div key={s.key} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        backgroundColor: isCompleted ? "var(--status-success)" : "var(--bg-muted)",
                        color: isCompleted ? "white" : "var(--text-muted)",
                        border: isCurrent ? "3px solid var(--status-success)" : "none",
                        transition: "all 400ms ease",
                        boxShadow: isCurrent ? "0 0 0 4px rgba(16,185,129,0.2)" : "none",
                      }}>
                        <Icon size={16} />
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div style={{ width: 2, height: 36, backgroundColor: idx < trackingStatus ? "var(--status-success)" : "var(--border)", transition: "background 400ms ease" }} />
                      )}
                    </div>
                    <div style={{ paddingTop: 8, paddingBottom: idx < STATUS_STEPS.length - 1 ? 8 : 0, flex: 1 }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: isCompleted ? 700 : 500, color: isCompleted ? "var(--text-primary)" : "var(--text-muted)", marginBottom: 2 }}>
                        {s.label}
                      </div>
                      {isCurrent && (
                        <div style={{ fontSize: "0.78rem", color: "var(--status-success)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--status-success)", animation: "pulse 1.5s ease-in-out infinite" }} />
                          In Progress...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Request Details */}
          <div className="card" style={{ padding: "20px 24px", marginBottom: 20, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Request Details</div>
            {[
              { label: "Request ID", value: request?.id },
              { label: "Emergency Type", value: request?.emergency_type?.label },
              { label: "Pickup Location", value: request?.pickup_address },
              { label: "Destination", value: request?.hospital?.name },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid var(--border)", marginBottom: 10 }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{label}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{value}</span>
              </div>
            ))}
          </div>

          {trackingStatus < STATUS_STEPS.length - 1 && (
            <button
              onClick={handleCancel}
              className="btn btn-secondary"
              style={{ width: "100%", color: "var(--status-danger)", borderColor: "rgba(239,68,68,0.3)", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <XCircle size={16} /> Cancel Ambulance Request
            </button>
          )}

          {trackingStatus === STATUS_STEPS.length - 1 && (
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "var(--status-success-bg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--status-success)" }}>
              <CheckCircle size={32} color="var(--status-success)" style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 700, color: "var(--status-success)", fontSize: "1rem" }}>Reached Hospital Successfully</div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "8px 0 16px" }}>Patient has been safely delivered to {request?.hospital?.name}.</p>
              <button onClick={handleCancel} className="btn btn-primary btn-sm">Back to Dashboard</button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
