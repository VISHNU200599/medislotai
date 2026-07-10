// src/pages/auth/LoginPage.jsx
// MediSlot — Official Enterprise SaaS Authentication System
// Flow: Intro -> Choose Role -> Create Account / Login -> Dashboard
// Clean desktop app styling (`#1877F2` primary, `#F5FAFF` light, `#1F2937` typography) with zero demo accounts.

import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, User, Stethoscope,
  Building2, ShieldCheck, CheckCircle2, Lock as LockIcon
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import Logo from "../../components/common/Logo";

const ROLES = [
  {
    id: "PATIENT",
    roleName: "Patient",
    title: "Patient Health Portal",
    icon: User,
    badge: "Personal Account",
    desc: "Book instant priority OPD appointments, track diagnostic reports, and manage digital prescriptions.",
    leftTitle: "Your Complete Health Vault, Simply Managed",
    leftDesc: "Connect with accredited multi-specialty hospitals, bypass waiting queues with digital QR passes, and keep your family's clinical records unified inside a secure cloud repository.",
    features: [
      "Instant 30-Second OPD Slot Confirmation",
      "Unified Digital Prescriptions & Lab Reports",
      "Zero Platform Convenience or Booking Fees"
    ]
  },
  {
    id: "DOCTOR",
    roleName: "Doctor",
    title: "Clinical Practice Workspace",
    icon: Stethoscope,
    badge: "Medical Practitioner",
    desc: "Manage outpatient consultations, review daily patient queues, and issue verified digital prescriptions.",
    leftTitle: "Precision Roster & Clinical Queue Management",
    leftDesc: "Streamline your outpatient clinic workflow. Review pre-loaded medical histories before patients enter your cabin, issue digital notes, and eliminate scheduling overlaps.",
    features: [
      "Real-Time OPD Roster & Patient Queue Tracking",
      "Direct E-Prescription & Diagnostic Notes Engine",
      "HIPAA-Inspired Clinical Data Security Protocol"
    ]
  },
  {
    id: "HOSPITAL_ADMIN",
    roleName: "Hospital",
    title: "Hospital Command Console",
    icon: Building2,
    badge: "Facility Administrator",
    desc: "Oversee hospital specialist rosters, monitor clinical departments, and track outpatient capacity metrics.",
    leftTitle: "Enterprise Multi-Specialty Facility Control",
    leftDesc: "Centralize governance across your healthcare institution. Audit department rosters, monitor consultation metrics in real time, and manage physician accreditations effortlessly.",
    features: [
      "Multi-Department Doctor & Roster Management",
      "Real-Time Facility OPD Capacity Analytics",
      "Automated Medical Council Verification Checks"
    ]
  }
];

export default function LoginPage({ initialStep = null }) {
  const [searchParams] = useSearchParams();
  const initialRoleParam = searchParams.get("role")?.toUpperCase();
  const defaultRoleObj = ROLES.find((r) => r.id === initialRoleParam) || ROLES[0];

  const [step, setStep] = useState(initialStep || (initialRoleParam ? 2 : 1));
  const [selectedRole, setSelectedRole] = useState(defaultRoleObj.id);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const currentRoleObj = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinueToRegister = () => {
    navigate(`/register?role=${selectedRole}`);
  };

  const handleContinueToLogin = () => {
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const { user } = await login({ email: form.email.trim(), password: form.password });
      toast.success(`Welcome back to MediSlot ${currentRoleObj.roleName} Portal`);
      if (user.role === "DOCTOR") navigate("/doctor/dashboard");
      else if (user.role === "HOSPITAL_ADMIN") navigate("/admin/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      backgroundColor: "var(--bg-base)",
      fontFamily: "var(--font-sans)"
    }}>
      {/* ── LEFT PANEL: 50% Clean Enterprise Healthcare Branding ── */}
      <div style={{
        flex: "1",
        background: "linear-gradient(160deg, #F5FAFF 0%, #E8F2FF 100%)",
        borderRight: "1px solid #DCEBFF",
        padding: "48px 56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle geometric light rings */}
        <div style={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(24, 119, 242, 0.08) 0%, rgba(24, 119, 242, 0) 70%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(24, 119, 242, 0.06) 0%, rgba(24, 119, 242, 0) 70%)",
          pointerEvents: "none"
        }} />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 2 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Logo variant="primary" size="md" />
          </Link>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "999px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #DCEBFF",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#6B7280",
            boxShadow: "0 2px 6px rgba(0,0,0,0.015)"
          }}>
            <ShieldCheck size={14} color="#1877F2" />
            <span>256-Bit Encrypted Healthcare OS</span>
          </div>
        </div>

        {/* Dynamic Role-Based Value Proposition */}
        <div style={{ my: "auto", zIndex: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRole}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "#FFFFFF",
                border: "1px solid #DCEBFF",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#1877F2",
                marginBottom: "20px",
                boxShadow: "0 2px 6px rgba(24, 119, 242, 0.06)"
              }}>
                <currentRoleObj.icon size={16} />
                <span>{currentRoleObj.badge}</span>
              </div>

              <h2 style={{
                fontSize: "2.4rem",
                fontWeight: 800,
                color: "#1F2937",
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
                marginBottom: "16px"
              }}>
                {currentRoleObj.leftTitle}
              </h2>
              <p style={{
                fontSize: "1.05rem",
                color: "#6B7280",
                lineHeight: 1.6,
                marginBottom: "36px",
                maxWidth: "480px"
              }}>
                {currentRoleObj.leftDesc}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {currentRoleObj.features.map((feat, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: "6px",
                      backgroundColor: "#1877F2",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <CheckCircle2 size={15} />
                    </div>
                    <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1F2937" }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", color: "#6B7280", zIndex: 2 }}>
          <span>© 2026 MediSlot Platform • Version 2.0</span>
          <span>HIPAA & NABH Compliant Infrastructure</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: 50% Clean Actionable Workspace ── */}
      <div style={{
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        backgroundColor: "#FFFFFF"
      }}>
        <div style={{ width: "100%", maxWidth: "440px" }}>

          {step === 1 ? (
            /* ── STEP 1: CHOOSE WORKSPACE ROLE ── */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
              <div style={{ marginBottom: "28px" }}>
                <h3 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#1F2937", letterSpacing: "-0.025em", margin: "0 0 8px 0" }}>
                  Choose Account Role
                </h3>
                <p style={{ fontSize: "0.95rem", color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                  Select your role to create a new account or sign into your portal.
                </p>
              </div>

              {/* Role Selection Grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
                {ROLES.map((r) => {
                  const isSelected = selectedRole === r.id;
                  const Icon = r.icon;
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      style={{
                        padding: "18px 20px",
                        borderRadius: "14px",
                        border: isSelected ? "2px solid #1877F2" : "1px solid #DCEBFF",
                        backgroundColor: isSelected ? "#F5FAFF" : "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                        transition: "all 0.15s ease",
                        boxShadow: isSelected ? "0 8px 24px rgba(24, 119, 242, 0.12)" : "0 2px 8px rgba(0,0,0,0.015)"
                      }}
                    >
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        backgroundColor: isSelected ? "#1877F2" : "#F0F6FF",
                        color: isSelected ? "#FFFFFF" : "#1877F2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.15s ease"
                      }}>
                        <Icon size={22} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "1.08rem", fontWeight: 700, color: "#1F2937" }}>{r.roleName}</span>
                          <span style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            color: isSelected ? "#1877F2" : "#6B7280",
                            backgroundColor: isSelected ? "#FFFFFF" : "#F3F4F6",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: "1px solid #DCEBFF"
                          }}>
                            {r.badge}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                          {r.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Primary CTA: Create Account First */}
              <button
                type="button"
                onClick={handleContinueToRegister}
                style={{
                  width: "100%",
                  height: "50px",
                  fontSize: "1.02rem",
                  fontWeight: 600,
                  backgroundColor: "#1877F2",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 8px 20px rgba(24, 119, 242, 0.24)",
                  transition: "all 0.15s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#166FE5"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1877F2"}
              >
                <span>Create {currentRoleObj.roleName} Account</span>
                <ArrowRight size={18} />
              </button>

              {/* Secondary CTA: Sign In */}
              <button
                type="button"
                onClick={handleContinueToLogin}
                style={{
                  width: "100%",
                  height: "48px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  color: "#1F2937",
                  border: "1.5px solid #DCEBFF",
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "12px",
                  transition: "all 0.15s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#1877F2";
                  e.currentTarget.style.color = "#1877F2";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#DCEBFF";
                  e.currentTarget.style.color = "#1F2937";
                }}
              >
                <span>Already have an account? Sign In to {currentRoleObj.roleName} Portal</span>
              </button>
            </motion.div>
          ) : (
            /* ── STEP 2: DEDICATED ROLE LOGIN PORTAL (ZERO DEMO ACCOUNTS) ── */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
              <div style={{ marginBottom: "32px" }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6B7280",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    padding: 0,
                    marginBottom: "16px"
                  }}
                >
                  <ArrowLeft size={16} /> Change Account Role
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    backgroundColor: "#E8F2FF",
                    color: "#1877F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <currentRoleObj.icon size={20} />
                  </div>
                  <h3 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#1F2937", letterSpacing: "-0.025em", margin: 0 }}>
                    {currentRoleObj.roleName} Sign-In
                  </h3>
                </div>
                <p style={{ fontSize: "0.95rem", color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                  Enter your verified credentials to access {currentRoleObj.title}.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                {/* Email Field */}
                <div>
                  <label htmlFor="login-email" style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", marginBottom: "8px" }}>
                    Workspace Email Address
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Mail size={18} color="#9CA3AF" style={{ position: "absolute", left: "16px", pointerEvents: "none" }} />
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder={`Enter your ${currentRoleObj.roleName.toLowerCase()} email...`}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{
                        width: "100%",
                        height: "48px",
                        paddingLeft: "46px",
                        paddingRight: "16px",
                        borderRadius: "12px",
                        border: "1.5px solid #DCEBFF",
                        backgroundColor: "#FFFFFF",
                        color: "#1F2937",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        outline: "none",
                        transition: "border-color 0.15s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#1877F2"}
                      onBlur={(e) => e.target.style.borderColor = "#DCEBFF"}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label htmlFor="login-password" style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1F2937" }}>
                      Account Password
                    </label>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1877F2", cursor: "pointer" }}>
                      Forgot password?
                    </span>
                  </div>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <LockIcon size={18} color="#9CA3AF" style={{ position: "absolute", left: "16px", pointerEvents: "none" }} />
                    <input
                      id="login-password"
                      type={showPass ? "text" : "password"}
                      required
                      placeholder="Enter account password..."
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      style={{
                        width: "100%",
                        height: "48px",
                        paddingLeft: "46px",
                        paddingRight: "46px",
                        borderRadius: "12px",
                        border: "1.5px solid #DCEBFF",
                        backgroundColor: "#FFFFFF",
                        color: "#1F2937",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        outline: "none",
                        transition: "border-color 0.15s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#1877F2"}
                      onBlur={(e) => e.target.style.borderColor = "#DCEBFF"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{ position: "absolute", right: "14px", background: "none", border: "none", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "50px",
                    fontSize: "1.02rem",
                    fontWeight: 600,
                    backgroundColor: "#1877F2",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "8px",
                    boxShadow: "0 8px 20px rgba(24, 119, 242, 0.24)",
                    transition: "all 0.15s ease"
                  }}
                  onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = "#166FE5")}
                  onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = "#1877F2")}
                >
                  <span>{loading ? "Verifying Credentials..." : `Sign In to ${currentRoleObj.roleName} Portal`}</span>
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              {/* Minimal Clean Registration Link */}
              <div style={{ textAlign: "center", marginTop: "32px", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", border: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: "0.88rem", color: "#6B7280" }}>Need to create a new {currentRoleObj.roleName.toLowerCase()} workspace account? </span>
                <Link to={`/register?role=${selectedRole}`} style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1877F2", textDecoration: "none", display: "inline-block", marginTop: "4px" }}>
                  Set up {currentRoleObj.roleName.toLowerCase()} account →
                </Link>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
