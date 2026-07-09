// src/pages/admin/AdminAmbulance.jsx
import { useState } from "react";
import { Ambulance, Clock, CheckCircle, MapPin, PhoneCall, AlertTriangle, Filter, RefreshCw } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";

const MOCK_REQUESTS = [
  {
    id: "AMB-001",
    patient_name: "Rahul Mehta",
    patient_phone: "+91-9876543210",
    emergency_type: "Cardiac Emergency",
    pickup_address: "12 Marine Drive, Mumbai",
    eta_minutes: 8,
    status: "PENDING",
    requested_at: "10 mins ago",
    vehicle_number: null,
  },
  {
    id: "AMB-002",
    patient_name: "Anjali Sharma",
    patient_phone: "+91-9123456789",
    emergency_type: "Trauma / Accident",
    pickup_address: "Near SV Road, Andheri West, Mumbai",
    eta_minutes: 12,
    status: "DISPATCHED",
    requested_at: "18 mins ago",
    vehicle_number: "MH-01-AB-2345",
  },
  {
    id: "AMB-003",
    patient_name: "Demo Patient",
    patient_phone: "+91-9000000000",
    emergency_type: "Respiratory Distress",
    pickup_address: "123 Demo Street, Mumbai",
    eta_minutes: 9,
    status: "EN_ROUTE",
    requested_at: "25 mins ago",
    vehicle_number: "MH-01-CD-5678",
  },
  {
    id: "AMB-004",
    patient_name: "Priya Nair",
    patient_phone: "+91-9000111222",
    emergency_type: "Maternity Emergency",
    pickup_address: "45 Bandra West, Mumbai",
    eta_minutes: 0,
    status: "COMPLETED",
    requested_at: "1 hour ago",
    vehicle_number: "MH-01-EF-9012",
  },
];

const STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "var(--brand-accent)", bg: "rgba(255,122,89,0.12)" },
  DISPATCHED: { label: "Dispatched", color: "var(--brand-primary)", bg: "var(--status-info-bg)" },
  EN_ROUTE: { label: "En Route", color: "#059669", bg: "var(--status-success-bg)" },
  COMPLETED: { label: "Completed", color: "var(--text-muted)", bg: "var(--bg-muted)" },
};

export default function AdminAmbulance() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  const assignAmbulance = (id) => {
    const vehicle = `MH-01-ZZ-${Math.floor(1000 + Math.random() * 9000)}`;
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "DISPATCHED", vehicle_number: vehicle } : r)
    );
    toast.success(`Ambulance ${vehicle} assigned successfully`);
  };

  const markEnRoute = (id) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "EN_ROUTE" } : r));
    toast.success("Marked as En Route");
  };

  const markCompleted = (id) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "COMPLETED" } : r));
    toast.success("Request marked as completed");
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <DashboardLayout title="Ambulance Requests" subtitle="Manage and dispatch emergency ambulance services">
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Requests", value: requests.length, color: "var(--brand-primary)", bg: "var(--bg-muted)" },
          { label: "Pending Dispatch", value: requests.filter((r) => r.status === "PENDING").length, color: "var(--brand-accent)", bg: "rgba(255,122,89,0.12)" },
          { label: "Active / En Route", value: requests.filter((r) => ["DISPATCHED","EN_ROUTE"].includes(r.status)).length, color: "#059669", bg: "var(--status-success-bg)" },
          { label: "Completed Today", value: requests.filter((r) => r.status === "COMPLETED").length, color: "var(--text-muted)", bg: "var(--bg-muted)" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="card" style={{ padding: "20px 24px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Alert for pending */}
      {pendingCount > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", backgroundColor: "rgba(255,122,89,0.1)", border: "1px solid rgba(255,122,89,0.3)", borderRadius: "var(--radius-md)", marginBottom: 24, color: "var(--brand-accent)" }}>
          <AlertTriangle size={18} />
          <strong>{pendingCount} ambulance request{pendingCount > 1 ? "s" : ""} pending dispatch.</strong>
          <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>Assign a vehicle immediately.</span>
        </div>
      )}

      {/* Filter Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["ALL", "PENDING", "DISPATCHED", "EN_ROUTE", "COMPLETED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 18px", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 600,
              border: "1px solid " + (filter === f ? "var(--brand-primary)" : "var(--border)"),
              backgroundColor: filter === f ? "var(--brand-primary)" : "var(--bg-card)",
              color: filter === f ? "white" : "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            {f === "ALL" ? "All" : f.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Ambulance size={28} /></div>
          <div className="empty-state-title">No Requests Found</div>
          <p className="empty-state-desc">No ambulance requests match the selected filter.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((req) => {
            const st = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
            return (
              <div
                key={req.id}
                className="card"
                style={{
                  padding: "20px 24px", border: "1px solid var(--border)",
                  borderLeft: `4px solid ${st.color}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>{req.patient_name}</div>
                      <span style={{ padding: "3px 10px", borderRadius: "var(--radius-full)", fontSize: "0.72rem", fontWeight: 700, backgroundColor: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <div style={{ fontSize: "0.85rem", color: "var(--brand-accent)", fontWeight: 600 }}>
                        🚨 {req.emergency_type}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={13} color="var(--brand-primary)" /> {req.pickup_address}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={13} color="var(--brand-primary)" /> Requested {req.requested_at}
                        {req.vehicle_number && <span style={{ marginLeft: 8, fontWeight: 600, color: "var(--text-primary)" }}>• {req.vehicle_number}</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                    <a
                      href={`tel:${req.patient_phone}`}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}
                    >
                      <PhoneCall size={14} /> {req.patient_phone}
                    </a>

                    {req.status === "PENDING" && (
                      <button onClick={() => assignAmbulance(req.id)} className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                        <Ambulance size={14} /> Assign Ambulance
                      </button>
                    )}
                    {req.status === "DISPATCHED" && (
                      <button onClick={() => markEnRoute(req.id)} className="btn btn-sm" style={{ background: "#059669", color: "white", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                        <RefreshCw size={14} /> Mark En Route
                      </button>
                    )}
                    {req.status === "EN_ROUTE" && (
                      <button onClick={() => markCompleted(req.id)} className="btn btn-sm" style={{ background: "var(--text-primary)", color: "white", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                        <CheckCircle size={14} /> Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
