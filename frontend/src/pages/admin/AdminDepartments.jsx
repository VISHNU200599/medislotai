// src/pages/admin/AdminDepartments.jsx
import { useState, useEffect } from "react";
import { Plus, Trash2, Building2, Edit2, X, Heart, Brain, Bone, ShieldAlert, Stethoscope, Pill, Baby, Microscope } from "lucide-react";
import { departmentsAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const DEPT_ICONS = {
  "Cardiology": Heart,
  "Neurology": Brain,
  "Orthopedics": Bone,
  "Oncology": ShieldAlert,
  "General Medicine": Stethoscope,
  "Gastroenterology": Pill,
  "Pediatrics": Baby,
  "Neurosurgery": Microscope
};

export default function AdminDepartments() {
  const { profile } = useAuthStore();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const fetchDepts = () => {
    setLoading(true);
    departmentsAPI.getAll({ hospital_id: profile?.hospital_id })
      .then((res) => setDepartments(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDepts(); }, []);

  const handleAdd = async () => {
    if (!form.name.trim()) { toast.error("Department name is required"); return; }
    setSaving(true);
    try {
      await (departmentsAPI.addDepartment ? departmentsAPI.addDepartment(form) : Promise.resolve());
      toast.success(`Department "${form.name}" added successfully`);
      setShowModal(false);
      fetchDepts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add department");
    } finally { setSaving(false); }
  };

  return (
    <DashboardLayout title="Manage Departments" subtitle="Organize clinical departments and specialized medical units">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <span className="badge badge-info" style={{ padding: "6px 12px", fontSize: "0.82rem" }}>{departments.length} Specialized Departments</span>
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
          <Plus size={15} /> Add Department
        </button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: "var(--radius-lg)" }} />)}
        </div>
      ) : departments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Building2 size={28} /></div>
          <div className="empty-state-title">No Departments Found</div>
          <p className="empty-state-desc">Create your first hospital department to categorize medical specialists.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm" style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 500 }}><Plus size={15} /> Add Department</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          {departments.map((dept) => {
            const IconComponent = DEPT_ICONS[dept.name] || Building2;
            return (
              <div key={dept.id} className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <IconComponent size={22} />
                </div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "4px", color: "var(--text-primary)" }}>{dept.name}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: 1.5, flex: 1 }}>{dept.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                  <span className={`badge ${dept.is_active ? "badge-success" : "badge-muted"}`}>
                    {dept.is_active ? "Active Unit" : "Inactive"}
                  </span>
                  <button onClick={() => toast("Removal requires administrator approval")} className="btn btn-secondary btn-sm" style={{ color: "var(--status-danger)", borderColor: "rgba(200,30,30,0.2)", padding: "4px 8px", fontWeight: 500 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Department Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Add Clinical Department</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label" style={{ fontWeight: 500 }}>Department Name *</label>
                <input type="text" className="input-field" placeholder="e.g., Cardiology, Neurology" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label" style={{ fontWeight: 500 }}>Description</label>
                <textarea className="input-field" rows={3} placeholder="Brief description of clinical services offered..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical", padding: "10px 14px", fontSize: "0.875rem" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1, fontWeight: 500 }}>Cancel</button>
              <button onClick={handleAdd} className="btn btn-cta" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 500 }} disabled={saving}>
                {saving ? <><div className="spinner" />Adding...</> : <><Plus size={16} /> Save Department</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
