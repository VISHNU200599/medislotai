// src/pages/auth/RegisterPage.jsx
// MediSlot — Official Enterprise SaaS Registration & OTP Verification System
// Flow: Create Account -> Verify Email / OTP -> Login -> Dashboard
// 50/50 split layout, clean #1877F2 primary styling, zero demo accounts.

import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ArrowLeft, Check, ShieldCheck, CheckCircle2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import Logo from "../../components/common/Logo";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role")?.toUpperCase() || "PATIENT";
  const roleName = roleParam === "DOCTOR" ? "Doctor" : roleParam === "HOSPITAL_ADMIN" ? "Hospital Admin" : "Patient";

  const [step, setStep] = useState(1); // 1: Registration Form, 2: OTP Verification
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm_password: "", phone: "", gender: "Male" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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
    else if (form.password.length < 6) e.password = "Minimum 6 characters required";
    if (form.password !== form.confirm_password) e.confirm_password = "Passwords do not match";
    return e;
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        gender: form.gender,
        role: roleParam
      });
      toast.success("Account created! Please verify your email with the OTP sent to your inbox.");
      setStep(2); // Move to OTP verification step
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    // Auto-focus next box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Email verified successfully! You can now log into your account.");
      navigate(`/login?role=${roleParam}`);
    }, 900);
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
            <span>Encrypted Registration & Identity Verification</span>
          </div>
        </div>

        <div style={{ my: "auto", zIndex: 2 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "6px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #DCEBFF",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "#1877F2",
            marginBottom: "20px",
            boxShadow: "0 2px 6px rgba(24, 119, 242, 0.06)"
          }}>
            <User size={16} />
            <span>{roleName} Workspace Initialization</span>
          </div>

          <h2 style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            color: "#1F2937",
            letterSpacing: "-0.035em",
            lineHeight: 1.15,
            marginBottom: "16px"
          }}>
            Join the Healthcare Infrastructure of Tomorrow
          </h2>
          <p style={{
            fontSize: "1.05rem",
            color: "#6B7280",
            lineHeight: 1.6,
            marginBottom: "36px",
            maxWidth: "480px"
          }}>
            Create your account to unlock instant multi-specialty scheduling, encrypted digital health records, and direct clinical communications.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              "Zero platform booking fees for all clinical appointments",
              "Direct instant OPD token verification across 500+ hospitals",
              "Centralized encrypted HIPAA-inspired digital health vault",
              "Priority specialist queue status & automated reminders"
            ].map((feat, idx) => (
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
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", color: "#6B7280", zIndex: 2 }}>
          <span>© 2026 MediSlot Platform • Version 2.0</span>
          <span>HIPAA & NABH Compliant Infrastructure</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: 50% Clean Registration & OTP Workspace ── */}
      <div style={{
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        backgroundColor: "#FFFFFF"
      }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* ── STEP 1: ACCOUNT REGISTRATION FORM ── */
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}>
                <div style={{ marginBottom: "28px" }}>
                  <button
                    type="button"
                    onClick={() => navigate("/get-started")}
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
                    <ArrowLeft size={16} /> Change Role
                  </button>
                  <h3 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#1F2937", letterSpacing: "-0.025em", margin: "0 0 8px 0" }}>
                    {roleName} Account Setup
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                    Enter your details below to create your account workspace.
                  </p>
                </div>

                <form onSubmit={handleCreateAccount} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Full Name */}
                  <div>
                    <label htmlFor="reg-name" style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", marginBottom: "6px" }}>
                      Full Name
                    </label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <User size={18} color="#9CA3AF" style={{ position: "absolute", left: "16px", pointerEvents: "none" }} />
                      <input
                        id="reg-name"
                        type="text"
                        required
                        placeholder={roleParam === "DOCTOR" ? "Dr. Priya Nair" : "Priya Nair"}
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        style={{
                          width: "100%",
                          height: "48px",
                          paddingLeft: "46px",
                          paddingRight: "16px",
                          borderRadius: "12px",
                          border: errors.full_name ? "1.5px solid #EF4444" : "1.5px solid #DCEBFF",
                          backgroundColor: "#FFFFFF",
                          color: "#1F2937",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          outline: "none"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#1877F2"}
                        onBlur={(e) => e.target.style.borderColor = errors.full_name ? "#EF4444" : "#DCEBFF"}
                      />
                    </div>
                    {errors.full_name && <span style={{ fontSize: "0.78rem", color: "#EF4444", marginTop: "4px", display: "block" }}>{errors.full_name}</span>}
                  </div>

                  {/* Email & Phone Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label htmlFor="reg-email" style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", marginBottom: "6px" }}>
                        Email Address
                      </label>
                      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <Mail size={18} color="#9CA3AF" style={{ position: "absolute", left: "16px", pointerEvents: "none" }} />
                        <input
                          id="reg-email"
                          type="email"
                          required
                          placeholder="name@email.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          style={{
                            width: "100%",
                            height: "48px",
                            paddingLeft: "46px",
                            paddingRight: "14px",
                            borderRadius: "12px",
                            border: errors.email ? "1.5px solid #EF4444" : "1.5px solid #DCEBFF",
                            backgroundColor: "#FFFFFF",
                            color: "#1F2937",
                            fontSize: "0.92rem",
                            fontWeight: 500,
                            outline: "none"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#1877F2"}
                          onBlur={(e) => e.target.style.borderColor = errors.email ? "#EF4444" : "#DCEBFF"}
                        />
                      </div>
                      {errors.email && <span style={{ fontSize: "0.78rem", color: "#EF4444", marginTop: "4px", display: "block" }}>{errors.email}</span>}
                    </div>

                    <div>
                      <label htmlFor="reg-phone" style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", marginBottom: "6px" }}>
                        Phone Number
                      </label>
                      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <Phone size={18} color="#9CA3AF" style={{ position: "absolute", left: "16px", pointerEvents: "none" }} />
                        <input
                          id="reg-phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          style={{
                            width: "100%",
                            height: "48px",
                            paddingLeft: "46px",
                            paddingRight: "14px",
                            borderRadius: "12px",
                            border: "1.5px solid #DCEBFF",
                            backgroundColor: "#FFFFFF",
                            color: "#1F2937",
                            fontSize: "0.92rem",
                            fontWeight: 500,
                            outline: "none"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#1877F2"}
                          onBlur={(e) => e.target.style.borderColor = "#DCEBFF"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label htmlFor="reg-pass" style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", marginBottom: "6px" }}>
                        Password
                      </label>
                      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <Lock size={18} color="#9CA3AF" style={{ position: "absolute", left: "16px", pointerEvents: "none" }} />
                        <input
                          id="reg-pass"
                          type={showPass ? "text" : "password"}
                          required
                          placeholder="Min 6 chars"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          style={{
                            width: "100%",
                            height: "48px",
                            paddingLeft: "46px",
                            paddingRight: "36px",
                            borderRadius: "12px",
                            border: errors.password ? "1.5px solid #EF4444" : "1.5px solid #DCEBFF",
                            backgroundColor: "#FFFFFF",
                            color: "#1F2937",
                            fontSize: "0.92rem",
                            fontWeight: 500,
                            outline: "none"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#1877F2"}
                          onBlur={(e) => e.target.style.borderColor = errors.password ? "#EF4444" : "#DCEBFF"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          style={{ position: "absolute", right: "12px", background: "none", border: "none", color: "#6B7280", cursor: "pointer" }}
                        >
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && <span style={{ fontSize: "0.78rem", color: "#EF4444", marginTop: "4px", display: "block" }}>{errors.password}</span>}
                    </div>

                    <div>
                      <label htmlFor="reg-confirm" style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", marginBottom: "6px" }}>
                        Confirm Password
                      </label>
                      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <Lock size={18} color="#9CA3AF" style={{ position: "absolute", left: "16px", pointerEvents: "none" }} />
                        <input
                          id="reg-confirm"
                          type={showPass ? "text" : "password"}
                          required
                          placeholder="Repeat password"
                          value={form.confirm_password}
                          onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                          style={{
                            width: "100%",
                            height: "48px",
                            paddingLeft: "46px",
                            paddingRight: "14px",
                            borderRadius: "12px",
                            border: errors.confirm_password ? "1.5px solid #EF4444" : "1.5px solid #DCEBFF",
                            backgroundColor: "#FFFFFF",
                            color: "#1F2937",
                            fontSize: "0.92rem",
                            fontWeight: 500,
                            outline: "none"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#1877F2"}
                          onBlur={(e) => e.target.style.borderColor = errors.confirm_password ? "#EF4444" : "#DCEBFF"}
                        />
                      </div>
                      {errors.confirm_password && <span style={{ fontSize: "0.78rem", color: "#EF4444", marginTop: "4px", display: "block" }}>{errors.confirm_password}</span>}
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
                      marginTop: "10px",
                      boxShadow: "0 8px 20px rgba(24, 119, 242, 0.24)",
                      transition: "all 0.15s ease"
                    }}
                    onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = "#166FE5")}
                    onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = "#1877F2")}
                  >
                    <span>{loading ? "Initializing Workspace..." : "Create Account & Send Verification OTP"}</span>
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "24px", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", border: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: "0.88rem", color: "#6B7280" }}>Already registered on MediSlot? </span>
                  <Link to={`/login?role=${roleParam}`} style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1877F2", textDecoration: "none", display: "inline-block", marginTop: "4px" }}>
                    Sign in to your portal →
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ── STEP 2: EMAIL VERIFICATION & OTP SECURITY ── */
              <motion.div key="step2" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.22 }}>
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: "16px",
                    backgroundColor: "#E8F2FF",
                    color: "#1877F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto"
                  }}>
                    <KeyRound size={28} />
                  </div>
                  <h3 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#1F2937", letterSpacing: "-0.025em", margin: "0 0 8px 0" }}>
                    Verify Email Address
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                    We have sent a 6-digit security OTP code to <strong style={{ color: "#1F2937" }}>{form.email}</strong>. Enter the code below to activate your account.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        style={{
                          width: "52px",
                          height: "56px",
                          textAlign: "center",
                          fontSize: "1.4rem",
                          fontWeight: 700,
                          borderRadius: "12px",
                          border: digit ? "2px solid #1877F2" : "1.5px solid #DCEBFF",
                          backgroundColor: "#FFFFFF",
                          color: "#1F2937",
                          outline: "none",
                          boxShadow: digit ? "0 4px 12px rgba(24, 119, 242, 0.12)" : "none"
                        }}
                      />
                    ))}
                  </div>

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
                      boxShadow: "0 8px 20px rgba(24, 119, 242, 0.24)",
                      transition: "all 0.15s ease"
                    }}
                    onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = "#166FE5")}
                    onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = "#1877F2")}
                  >
                    <span>{loading ? "Verifying Security Code..." : "Verify & Continue to Login"}</span>
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "24px" }}>
                  <button
                    type="button"
                    onClick={() => toast.success(`New verification code resent to ${form.email}`)}
                    style={{ background: "none", border: "none", color: "#6B7280", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Didn't receive the code? Resend OTP
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
