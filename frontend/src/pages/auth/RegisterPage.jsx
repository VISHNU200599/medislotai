// src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import Logo from "../../components/common/Logo";

const benefits = [
  "Zero booking fees for all clinical appointments",
  "Direct access to 2,500+ verified medical specialists",
  "HIPAA-compliant centralized digital health records",
  "Instant SMS & email slot booking confirmations"
];

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm_password: "", phone: "", gender: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirm_password) e.confirm_password = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register({ full_name: form.full_name, email: form.email, password: form.password, phone: form.phone, gender: form.gender });
      toast.success("Account created successfully! Welcome to MediSlot AI");
      navigate("/patient/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "var(--bg-base)" }}>
      {/* Left Panel — Deep Medical Blue Branding */}
      <div style={{ flex: "0 0 460px", backgroundColor: "var(--bg-dark)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 48px", position: "relative", overflow: "hidden", color: "white" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "56px" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Logo variant="monochrome" size="md" />
            </Link>
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-full)", padding: "6px 14px", marginBottom: "20px", fontSize: "0.8rem", fontWeight: 500, color: "#EDF7FF" }}>
            <ShieldCheck size={14} color="#FF7A59" /> Patient Registration Portal
          </div>
          <h2 style={{ color: "white", marginBottom: "16px", fontSize: "2.1rem", fontWeight: 800, lineHeight: 1.25 }}>Start Your Healthcare Journey</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "36px" }}>
            Create your free account to connect with India's top accredited hospitals and specialists. Your medical records remain encrypted and confidential.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {benefits.map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle size={16} color="#FF7A59" style={{ flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.875rem" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
          © 2026 MediSlot AI. All rights reserved.
        </div>
      </div>

      {/* Right Panel — Registration Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 64px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "8px", color: "var(--text-primary)" }}>Create Patient Account</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "0.9rem" }}>
            Already registered? <Link to="/login" style={{ color: "var(--brand-primary)", fontWeight: 600, textDecoration: "none" }}>Sign in to workspace</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Full Name *</label>
              <div className="input-with-icon" style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input id="reg-name" type="text" className={`input-field ${errors.full_name ? "input-error" : ""}`} placeholder="e.g. Rahul Sharma" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} style={{ paddingLeft: 42 }} />
              </div>
              {errors.full_name && <span style={{ fontSize: "0.78rem", color: "var(--status-danger)", fontWeight: 500 }}>{errors.full_name}</span>}
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Email Address *</label>
              <div className="input-with-icon" style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input id="reg-email" type="email" className={`input-field ${errors.email ? "input-error" : ""}`} placeholder="name@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ paddingLeft: 42 }} />
              </div>
              {errors.email && <span style={{ fontSize: "0.78rem", color: "var(--status-danger)", fontWeight: 500 }}>{errors.email}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Phone Number</label>
                <div className="input-with-icon" style={{ position: "relative" }}>
                  <Phone size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input id="reg-phone" type="tel" className="input-field" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ paddingLeft: 42 }} />
                </div>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Gender</label>
                <select id="reg-gender" className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} style={{ cursor: "pointer" }}>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Password *</label>
              <div className="input-with-icon" style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input id="reg-password" type={showPass ? "text" : "password"} className={`input-field ${errors.password ? "input-error" : ""}`} placeholder="Minimum 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ paddingLeft: 42, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span style={{ fontSize: "0.78rem", color: "var(--status-danger)", fontWeight: 500 }}>{errors.password}</span>}
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Confirm Password *</label>
              <div className="input-with-icon" style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input id="reg-confirm-password" type="password" className={`input-field ${errors.confirm_password ? "input-error" : ""}`} placeholder="Repeat password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} style={{ paddingLeft: 42 }} />
              </div>
              {errors.confirm_password && <span style={{ fontSize: "0.78rem", color: "var(--status-danger)", fontWeight: 500 }}>{errors.confirm_password}</span>}
            </div>

            <button id="reg-submit" type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%", marginTop: "8px", padding: "14px", fontSize: "0.95rem", fontWeight: 600 }}>
              {loading ? <><div className="spinner" /> Creating account...</> : <>Create Patient Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "24px" }}>
            By registering, you agree to our <a href="#" style={{ color: "var(--brand-primary)", textDecoration: "none", fontWeight: 500 }}>Terms of Service</a> and <a href="#" style={{ color: "var(--brand-primary)", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
