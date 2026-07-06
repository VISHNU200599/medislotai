// src/pages/admin/AdminDoctors.jsx
import { useState, useEffect } from "react";
import { Plus, Trash2, Stethoscope, Star } from "lucide-react";
import { doctorsAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

export default function AdminDoctors() {
  const { profile } = useAuthStore();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorsAPI.getAll({ hospital_id: profile?.hospital_id, limit: 50 })
      .then((res) => setDoctors(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name) => {
    if (!name) return "D";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
  };

  return (
    <DashboardLayout title="Manage Specialists" subtitle="Oversee accredited medical specialists and directory profiles">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span className="badge badge-info" style={{ fontSize: "0.82rem", padding: "6px 12px" }}>{doctors.length} Registered Specialists</span>
        </div>
        <button onClick={() => toast.success("Add Specialist registration form opening...")} className="btn btn-primary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
          <Plus size={15} /> Add New Specialist
        </button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                <div className="skeleton" style={{ width: 56, height: 56, borderRadius: "50%" }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 14, marginBottom: "8px", borderRadius: "6px" }} />
                  <div className="skeleton" style={{ height: 12, width: "70%", borderRadius: "6px" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Stethoscope size={28} /></div>
          <div className="empty-state-title">No Specialists Listed</div>
          <p className="empty-state-desc">Add accredited doctors to your hospital directory to begin accepting consultations.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {doctors.map((doc) => (
            <div key={doc.id} className="card" style={{ backgroundColor: "var(--bg-card)" }}>
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "16px" }}>
                  {doc.profile_pic && !doc.profile_pic.includes("ui-avatars.com") ? (
                    <img src={doc.profile_pic} alt={doc.full_name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid var(--border)" }} />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 600, flexShrink: 0 }}>
                      {getInitials(doc.full_name)}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "2px", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.full_name}</h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--brand-primary)", fontWeight: 500, marginBottom: "4px" }}>{doc.specialization}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{doc.qualification}</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Star size={14} color="#FF7A59" fill="#FF7A59" />
                    <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>{doc.rating}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>• {doc.experience_years} yrs exp</span>
                  </div>
                  <span className={`badge ${doc.is_available ? "badge-success" : "badge-muted"}`}>
                    {doc.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Consultation Fee</span>
                    <span style={{ fontWeight: 700, color: "var(--brand-primary)", fontSize: "1.05rem" }}>₹{doc.consultation_fee}</span>
                  </div>
                  <button onClick={() => toast.error("Doctor removal requires super-admin verification")} className="btn btn-secondary btn-sm" style={{ color: "var(--status-danger)", borderColor: "rgba(200,30,30,0.2)", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
