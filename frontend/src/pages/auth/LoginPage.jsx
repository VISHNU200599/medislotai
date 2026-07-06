// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, User, Stethoscope, Building2, ShieldCheck, CheckCircle, Terminal, X, Zap } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import Logo from "../../components/common/Logo";

const ROLES = [
  {
    id: "PATIENT",
    roleName: "Patient",
    title: "Patient Portal",
    icon: User,
    desc: "Book appointments, track medical history, and manage personal healthcare.",
    leftTitle: "Your Health, Simply Managed",
    leftDesc: "Access India's top accredited hospitals and specialists. View prescriptions, track diagnostic reports, and book instant consultations with zero booking fees.",
  },
  {
    id: "DOCTOR",
    roleName: "Doctor",
    title: "Doctor Workspace",
    icon: Stethoscope,
    desc: "Manage consultations, review patient queues, and coordinate schedules.",
    leftTitle: "Clinical Excellence & Control",
    leftDesc: "Streamline your daily patient roster, manage consultation queues, and maintain digital clinical notes with enterprise-grade HIPAA-aligned security.",
  },
  {
    id: "HOSPITAL_ADMIN",
    roleName: "Hospital",
    title: "Hospital Console",
    icon: Building2,
    desc: "Oversee hospital doctors, clinical departments, and real-time analytics.",
    leftTitle: "Hospital Command Console",
    leftDesc: "Centralize your healthcare facility operations. Audit department rosters, monitor appointment metrics, and manage specialist accreditations effortlessly.",
  },
];

const DEMO_ACCOUNTS = [
  { role: "Patient", email: "demo@patient.com", password: "password123", icon: User, desc: "Test patient booking and medical records" },
  { role: "Doctor", email: "dr.sharma@medislot.com", password: "password123", icon: Stethoscope, desc: "Dr. Rajesh Sharma (Apollo Hospitals)" },
  { role: "Admin", email: "admin@apollo.com", password: "password123", icon: Building2, desc: "Apollo Hospitals Administrator" },
];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role")?.toUpperCase();
  const defaultRoleObj = ROLES.find((r) => r.id === initialRole) || null;

  const [step, setStep] = useState(defaultRoleObj ? 2 : 1);
  const [selectedRole, setSelectedRole] = useState(defaultRoleObj ? defaultRoleObj.id : "PATIENT");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDemoModal, setShowDemoModal] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const currentRoleObj = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { user } = await login(form);
      toast.success(`Welcome back to MediSlot AI (${user.role})`);
      const from = location.state?.from?.pathname;
      const dashMap = { PATIENT: "/patient/dashboard", DOCTOR: "/doctor/dashboard", HOSPITAL_ADMIN: "/admin/dashboard" };
      navigate(from || dashMap[user.role] || "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setForm({ email: acc.email, password: acc.password });
    toast.success(`Demo credentials filled for ${acc.role}`);
    setShowDemoModal(false);
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
            <ShieldCheck size={14} color="#FF7A59" /> Accredited Healthcare Network
          </div>

          <h2 style={{ color: "white", marginBottom: "16px", fontSize: "2.1rem", fontWeight: 800, lineHeight: 1.25 }}>
            {step === 1 ? "Start Your Healthcare Journey" : currentRoleObj.leftTitle}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "40px" }}>
            {step === 1
              ? "Join thousands of patients, physicians, and clinical directors connecting in a unified digital ecosystem designed for speed, security, and clinical trust."
              : currentRoleObj.leftDesc}
          </p>

          {/* Security Features List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "20px" }}>
            {[
              "HIPAA-inspired clinical data encryption",
              "Zero booking fees & instant slot confirmation",
              "Unified digital health records & prescriptions",
            ].map((text, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>
                <CheckCircle size={16} color="#FF7A59" style={{ flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>© 2026 MediSlot AI. All rights reserved.</span>
          <button
            type="button"
            onClick={() => setShowDemoModal(true)}
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "var(--radius-md)", padding: "4px 10px", color: "white", fontSize: "0.75rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", transition: "background 150ms ease" }}
          >
            <Terminal size={12} color="#FF7A59" /> Developer Demo
          </button>
        </div>
      </div>

      {/* Right Panel — Onboarding & Login Flow */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 64px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          {step === 1 ? (
            /* ── Step 1: Role Selection Onboarding ── */
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--brand-primary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                Step 1 of 2 • Role Selection
              </div>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "8px", color: "var(--text-primary)" }}>
                Who are you joining as?
              </h1>
              <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "0.95rem" }}>
                Select your designated workspace in the MediSlot AI healthcare ecosystem.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      style={{
                        padding: "18px 20px",
                        borderRadius: "var(--radius-lg)",
                        border: "2px solid " + (isSelected ? "var(--brand-primary)" : "var(--border)"),
                        backgroundColor: isSelected ? "var(--bg-muted)" : "var(--bg-card)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                        transition: "all 150ms ease",
                        boxShadow: isSelected ? "0 4px 12px rgba(21, 101, 192, 0.12)" : "var(--shadow-sm)",
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "var(--radius-md)",
                          backgroundColor: isSelected ? "var(--brand-primary)" : "var(--bg-base)",
                          color: isSelected ? "white" : "var(--brand-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 150ms ease",
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>{role.title}</h4>
                          {isSelected && <CheckCircle size={18} color="var(--brand-primary)" />}
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                          {role.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-cta btn-lg"
                style={{ width: "100%", padding: "14px", fontSize: "1rem", fontWeight: 600 }}
              >
                Continue to {currentRoleObj.roleName} Login <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "var(--brand-primary)", fontWeight: 600, textDecoration: "none" }}>
                  Create free patient account
                </Link>
              </div>
            </div>
          ) : (
            /* ── Step 2: Role Login Portal ── */
            <div>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", marginBottom: "20px", padding: 0 }}
              >
                <ArrowLeft size={16} /> Change Workspace Role
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <currentRoleObj.icon size={20} />
                </div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  {currentRoleObj.roleName} Login
                </h1>
              </div>
              <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "0.9rem" }}>
                Sign in to access your {currentRoleObj.title.toLowerCase()} and clinical records.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Email Address</label>
                  <div className="input-with-icon" style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      id="login-email"
                      type="email"
                      className={`input-field ${errors.email ? "input-error" : ""}`}
                      placeholder="name@healthcare.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{ paddingLeft: 42 }}
                    />
                  </div>
                  {errors.email && <span style={{ fontSize: "0.78rem", color: "var(--status-danger)", fontWeight: 500 }}>{errors.email}</span>}
                </div>

                <div className="input-group" style={{ margin: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="input-label">Password</label>
                    <a href="#" style={{ fontSize: "0.8rem", color: "var(--brand-primary)", fontWeight: 500, textDecoration: "none" }}>
                      Forgot password?
                    </a>
                  </div>
                  <div className="input-with-icon" style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      id="login-password"
                      type={showPass ? "text" : "password"}
                      className={`input-field ${errors.password ? "input-error" : ""}`}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      style={{ paddingLeft: 42, paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <span style={{ fontSize: "0.78rem", color: "var(--status-danger)", fontWeight: 500 }}>{errors.password}</span>}
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                  style={{ width: "100%", marginTop: "8px", padding: "14px", fontSize: "0.95rem", fontWeight: 600 }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" /> Signing in to {currentRoleObj.roleName} Workspace...
                    </>
                  ) : (
                    <>
                      Sign In to Workspace <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: "28px", padding: "16px", backgroundColor: "var(--bg-muted)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px" }}>
                <Zap size={18} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                  Need quick testing credentials? Click the <strong>Developer Demo</strong> button in the bottom left footer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Developer Demo Credentials Modal ── */}
      {showDemoModal && (
        <div className="modal-overlay" onClick={() => setShowDemoModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Terminal size={20} color="var(--brand-primary)" />
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>Developer Demo Credentials</h3>
              </div>
              <button onClick={() => setShowDemoModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: 1.5 }}>
              Use these pre-configured test accounts to evaluate clinical workflows without manual registration. Click any row to auto-fill.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {DEMO_ACCOUNTS.map(({ role, email, password, icon: Icon, desc }) => (
                <div
                  key={role}
                  onClick={() => fillDemo({ role, email, password })}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-card)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "all 150ms ease",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-muted)")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-card)")}
                >
                  <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{role} Workspace</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{email} • {password}</div>
                  </div>
                  <span className="badge badge-info" style={{ fontSize: "0.72rem" }}>Auto-Fill</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowDemoModal(false)}
              className="btn btn-secondary"
              style={{ width: "100%", fontWeight: 500 }}
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
