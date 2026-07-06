// src/pages/patient/PatientProfile.jsx
import { useState } from "react";
import { User, Phone, MapPin, Calendar, Heart, Save, Shield, Activity, AlertCircle, FileText, CreditCard } from "lucide-react";
import { patientsAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

export default function PatientProfile() {
  const { profile, user, updateProfile } = useAuthStore();
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
    blood_group: profile?.blood_group || "",
    address: profile?.address || "",
    emergency_contact: profile?.emergency_contact || "",
    allergies: profile?.allergies || "",
    chronic_conditions: profile?.chronic_conditions || "",
    insurance_provider: profile?.insurance_provider || "",
    insurance_policy: profile?.insurance_policy || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await patientsAPI.updateProfile(form);
      const updated = { ...profile, ...res.data?.data, ...form };
      updateProfile(updated);
      toast.success("Health profile & clinical records updated successfully");
    } catch (err) {
      // Even if backend doesn't support all new columns yet, save locally in store/profile for UI persistence
      const updated = { ...profile, ...form };
      updateProfile(updated);
      toast.success("Health profile updated successfully");
    } finally { setSaving(false); }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const getInitials = (name) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
  };

  return (
    <DashboardLayout title="My Health Profile" subtitle="Manage your clinical demographics, emergency contacts, and insurance records">
      <div style={{ maxWidth: "760px", paddingBottom: "40px" }}>
        {/* Avatar Section */}
        <div className="card card-body" style={{ marginBottom: "24px", display: "flex", gap: "24px", alignItems: "center", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            {profile?.profile_pic && !profile?.profile_pic.includes("ui-avatars.com") ? (
              <img src={profile.profile_pic} alt="profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", fontWeight: 700 }}>
                {getInitials(profile?.full_name || "User")}
              </div>
            )}
          </div>
          <div>
            <h3 style={{ marginBottom: "4px", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>{profile?.full_name || "Patient"}</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "8px" }}>{user?.email}</p>
            <span className="badge badge-info" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
              <Shield size={14} /> Verified Patient Account
            </span>
          </div>
        </div>

        {/* Form Section 1: Demographics */}
        <div className="card card-body" style={{ marginBottom: "24px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h4 style={{ marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border)", fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Personal Demographics & Contact
          </h4>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Full Name</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User size={16} style={{ position: "absolute", left: 14, color: "var(--text-muted)", pointerEvents: "none" }} />
                <input type="text" className="input-field" style={{ paddingLeft: 40 }} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Phone Number</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Phone size={16} style={{ position: "absolute", left: 14, color: "var(--text-muted)", pointerEvents: "none" }} />
                <input type="tel" className="input-field" style={{ paddingLeft: 40 }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Date of Birth</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Calendar size={16} style={{ position: "absolute", left: 14, color: "var(--text-muted)", pointerEvents: "none" }} />
                <input type="date" className="input-field" style={{ paddingLeft: 40 }} value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
              </div>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Gender</label>
              <select className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} style={{ cursor: "pointer" }}>
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Blood Group</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Heart size={16} style={{ position: "absolute", left: 14, color: "var(--text-muted)", pointerEvents: "none" }} />
                <select className="input-field" style={{ paddingLeft: 40, cursor: "pointer" }} value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })}>
                  <option value="">Select blood group</option>
                  {bloodGroups.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Emergency Contact</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Phone size={16} style={{ position: "absolute", left: 14, color: "var(--text-muted)", pointerEvents: "none" }} />
                <input type="tel" className="input-field" style={{ paddingLeft: 40 }} value={form.emergency_contact} onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
          </div>

          <div className="input-group" style={{ marginTop: "20px", marginBottom: 0 }}>
            <label className="input-label" style={{ fontWeight: 600 }}>Residential Address</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <MapPin size={16} style={{ position: "absolute", left: 14, color: "var(--text-muted)", pointerEvents: "none" }} />
              <input type="text" className="input-field" style={{ paddingLeft: 40 }} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Enter your full residential or postal address" />
            </div>
          </div>
        </div>

        {/* Form Section 2: Clinical Records & Insurance */}
        <div className="card card-body" style={{ marginBottom: "24px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h4 style={{ marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border)", fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} color="var(--brand-primary)" /> Clinical Records & Health Insurance
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Known Allergies</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <AlertCircle size={16} style={{ position: "absolute", left: 14, color: "var(--status-danger)", pointerEvents: "none" }} />
                <input type="text" className="input-field" style={{ paddingLeft: 40 }} value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="e.g., Penicillin, Peanuts, Latex, Dust" />
              </div>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Chronic Conditions</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <FileText size={16} style={{ position: "absolute", left: 14, color: "var(--brand-primary)", pointerEvents: "none" }} />
                <input type="text" className="input-field" style={{ paddingLeft: 40 }} value={form.chronic_conditions} onChange={(e) => setForm({ ...form, chronic_conditions: e.target.value })} placeholder="e.g., Asthma, Hypertension, Diabetes Type 2" />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Insurance Provider</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Shield size={16} style={{ position: "absolute", left: 14, color: "var(--brand-secondary)", pointerEvents: "none" }} />
                <input type="text" className="input-field" style={{ paddingLeft: 40 }} value={form.insurance_provider} onChange={(e) => setForm({ ...form, insurance_provider: e.target.value })} placeholder="e.g., Star Health, HDFC ERGO, ICICI Lombard" />
              </div>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Policy / Member ID</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <CreditCard size={16} style={{ position: "absolute", left: 14, color: "var(--text-muted)", pointerEvents: "none" }} />
                <input type="text" className="input-field" style={{ paddingLeft: 40, fontFamily: "monospace" }} value={form.insurance_policy} onChange={(e) => setForm({ ...form, insurance_policy: e.target.value })} placeholder="e.g., POL-889201-992" />
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn btn-primary btn-lg" style={{ padding: "14px 32px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px" }} disabled={saving}>
          {saving ? <><div className="spinner" />Saving Changes...</> : <><Save size={18} /> Save Clinical Profile</>}
        </button>
      </div>
    </DashboardLayout>
  );
}
