// src/pages/LandingPage.jsx
// MediSlot — Version 2 Official Production Landing Page
// Complete redesign following the exact architectural flow: Sticky Nav -> Hero -> Trusted By -> Why MediSlot -> How It Works -> Core Features -> Find Doctors -> Find Hospitals -> Testimonials -> FAQ -> Footer
// Built with Inter typography, 8px grid spacing, flat SVG geometric art, 48px CTAs, and subtle Framer Motion transitions (<= 200ms).

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Shield, Clock, Heart, Activity, Calendar, ArrowRight,
  Zap, Brain, Building2, Pill, Stethoscope, CheckCircle2, Star,
  MapPin, Phone, Users, ChevronRight, Check, X, HelpCircle,
  FileText, Sparkles, ShieldCheck, Award, Lock, UserCheck
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Logo from "../components/common/Logo";

// ── Framer Motion Variants (<= 200ms duration for snappy SaaS feel) ──────────
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const hoverCard = {
  rest: { y: 0, boxShadow: "0 2px 8px rgba(18, 52, 77, 0.05)" },
  hover: { y: -3, boxShadow: "0 10px 24px rgba(18, 52, 77, 0.10)", transition: { duration: 0.18 } }
};

// ── Data: Core Features ──────────────────────────────────────────────────────
const coreFeatures = [
  {
    icon: Search,
    color: "var(--brand-primary)",
    bg: "var(--bg-muted)",
    title: "Smart Clinical Discovery",
    desc: "Search top NABH/JCI accredited hospitals and board-certified doctors by specialty, procedure, or availability with real-time OPD slot verification."
  },
  {
    icon: Calendar,
    color: "var(--brand-accent)",
    bg: "rgba(255, 122, 89, 0.15)",
    title: "Instant Slot Confirmation",
    desc: "Lock in guaranteed consultation appointments in under 30 seconds. Receive instant digital QR tokens directly via email and SMS without manual confirmations."
  },
  {
    icon: ShieldCheck,
    color: "var(--brand-primary)",
    bg: "var(--bg-muted)",
    title: "Verified Medical Credentials",
    desc: "Every listed practitioner undergoes quarterly medical council registration verification, degree audits, and background screening before being listed."
  },
  {
    icon: Clock,
    color: "var(--brand-primary)",
    bg: "var(--bg-muted)",
    title: "Zero Waiting Room Queues",
    desc: "Our precision OPD scheduling engine allocates staggered time blocks, ensuring you meet your doctor precisely at your booked time without crowded waiting halls."
  },
  {
    icon: FileText,
    color: "var(--brand-primary)",
    bg: "var(--bg-muted)",
    title: "Unified Digital Health Vault",
    desc: "Store and access digital prescriptions, diagnostic lab reports, and medical history inside an encrypted, HIPAA-inspired clinical repository."
  },
  {
    icon: Sparkles,
    color: "var(--brand-accent)",
    bg: "rgba(255, 122, 89, 0.15)",
    title: "Smart Specialty Triage",
    desc: "Input your symptoms or medical query and let our diagnostic routing engine match you with the precise clinical department for immediate, focused care."
  }
];

// ── Data: How It Works ───────────────────────────────────────────────────────
const workflowSteps = [
  {
    num: "01",
    title: "Discover & Filter Providers",
    desc: "Explore top multi-specialty hospitals and verified doctors across India. Filter by distance, consultation tariff, availability, and authentic reviews."
  },
  {
    num: "02",
    title: "Compare Clinical Profiles",
    desc: "Examine detailed medical qualifications, years of clinical experience, sub-specialty expertise, and transparent hospital OPD rosters."
  },
  {
    num: "03",
    title: "Instant Digital Booking",
    desc: "Select your preferred morning or evening slot. Confirm your appointment with zero booking fees and direct hospital tariff guarantees."
  },
  {
    num: "04",
    title: "Priority Hospital Check-In",
    desc: "Present your digital consultation slip at the hospital fast-track counter for immediate check-in and priority specialist consultation."
  }
];

// ── Data: Doctor Specialties (Find Doctors) ──────────────────────────────────
const specialtiesList = [
  { name: "Cardiology", desc: "Heart & Vascular Care", icon: Heart, count: "340+ Doctors" },
  { name: "Neurology", desc: "Brain & Nervous System", icon: Brain, count: "210+ Doctors" },
  { name: "Orthopedics", desc: "Bones, Joints & Spine", icon: Activity, count: "420+ Doctors" },
  { name: "Oncology", desc: "Comprehensive Cancer Care", icon: ShieldCheck, count: "180+ Doctors" },
  { name: "Pediatrics", desc: "Child & Adolescent Health", icon: Users, count: "510+ Doctors" },
  { name: "Dermatology", desc: "Skin, Hair & Aesthetics", icon: CheckCircle2, count: "390+ Doctors" },
  { name: "Gynecology", desc: "Women's Health & Maternity", icon: Heart, count: "450+ Doctors" },
  { name: "Ophthalmology", desc: "Advanced Eye Surgery", icon: Search, count: "280+ Doctors" },
  { name: "Psychiatry", desc: "Mental Health & Therapy", icon: Brain, count: "230+ Doctors" },
  { name: "ENT", desc: "Ear, Nose & Throat Care", icon: Stethoscope, count: "310+ Doctors" }
];

// ── Data: Hospital Partners (Find Hospitals & Trusted By) ────────────────────
const hospitalPartners = [
  { name: "Apollo Hospitals", location: "Multi-City Network", beds: "10,000+ Beds", badge: "JCI Accredited" },
  { name: "Fortis Healthcare", location: "Pan-India Centers", beds: "4,000+ Beds", badge: "NABH Certified" },
  { name: "Max Super Specialty", location: "Delhi NCR & North", beds: "3,500+ Beds", badge: "Excellence Center" },
  { name: "Manipal Hospitals", location: "Southern & Western Region", beds: "7,000+ Beds", badge: "NABH Accredited" },
  { name: "Medanta The Medicity", location: "Gurugram & Lucknow", beds: "2,800+ Beds", badge: "Top Clinical Rank" },
  { name: "Narayana Health", location: "Bangalore & Kolkata", beds: "6,000+ Beds", badge: "Global Care Partner" }
];

// ── Data: Why Choose MediSlot (Comparison Matrix) ────────────────────────────
const comparisonData = [
  {
    metric: "Appointment Booking Speed",
    traditional: "Average 35–45 minutes of phone calls & hold music",
    medislot: "Instant digital booking under 30 seconds with instant token"
  },
  {
    metric: "Doctor Credential Verification",
    traditional: "Unverified claims or informal word-of-mouth referrals",
    medislot: "100% Board-certified, license-verified medical council check"
  },
  {
    metric: "Hospital Waiting Room Time",
    traditional: "1 to 3 hours of unpredictable queueing & delays",
    medislot: "Priority check-in right at your confirmed digital time slot"
  },
  {
    metric: "Medical Records & Prescriptions",
    traditional: "Scattered paper files, lost lab slips, and manual sorting",
    medislot: "Unified cloud health vault with one-click digital prescriptions"
  },
  {
    metric: "Booking Fees & Pricing Transparency",
    traditional: "Hidden registration charges and unclear consultation rates",
    medislot: "Zero platform booking fees; 100% transparent hospital pricing"
  }
];

// ── Data: Testimonials ───────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "MediSlot has completely eliminated OPD overcrowding in our cardiology department. Patients arrive precisely at their scheduled slot with their clinical history pre-loaded digitally.",
    author: "Dr. Rajesh Sharma",
    role: "Senior Consultant Cardiologist",
    hospital: "Apollo Hospitals, New Delhi",
    rating: 5
  },
  {
    quote: "Booking an urgent pediatric consultation at 9:30 PM for my daughter took literally 30 seconds on MediSlot. When we arrived at the hospital, reception checked us in immediately using our QR pass.",
    author: "Priya Nair",
    role: "Verified Patient",
    hospital: "Bangalore, Karnataka",
    rating: 5
  },
  {
    quote: "The precision of the clinical scheduling engine means zero double-bookings or administrative confusion. It elevates the standard of patient communication and outpatient care.",
    author: "Dr. Ananya Verma",
    role: "Head of Neurology",
    hospital: "Max Super Specialty, Saket",
    rating: 5
  }
];

// ── Data: Frequently Asked Questions ─────────────────────────────────────────
const faqs = [
  {
    q: "Is booking appointments through MediSlot completely free?",
    a: "Yes. MediSlot charges zero convenience or platform fees to patients. You pay only the standard hospital consultation fee directly at the facility or securely online during booking."
  },
  {
    q: "How does MediSlot verify doctors and healthcare facilities?",
    a: "Every physician and clinical center listed on MediSlot undergoes a rigorous multi-step credentialing audit. We verify active medical council registrations, educational degrees, hospital affiliations, and professional conduct records."
  },
  {
    q: "Can I reschedule or cancel my confirmed appointment online?",
    a: "Absolutely. You can reschedule or cancel any confirmed appointment directly from your Patient Portal up to 2 hours prior to the scheduled consultation time. Instant cancellation confirmation is transmitted to both you and the hospital."
  },
  {
    q: "How secure are my digital health records and e-prescriptions?",
    a: "Your health records, lab investigations, and digital prescriptions are encrypted with clinical-grade AES-256 encryption both in transit and at rest. Access is strictly controlled under HIPAA-inspired privacy guidelines."
  },
  {
    q: "Do I need to carry physical paper files to the hospital?",
    a: "No. Once your digital appointment pass is verified at reception, your consulting doctor can directly view any prior medical records or test reports you have uploaded to your secure MediSlot health vault."
  }
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/hospitals?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/hospitals");
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="page-wrapper" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* ── 1. STICKY NAVIGATION ─────────────────────────────────────────── */}
      <Navbar />

      {/* ── 2. HERO SECTION ──────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: "var(--bg-dark)",
        color: "white",
        padding: "80px 0 96px",
        borderBottom: "1px solid rgba(255,255,255,0.14)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Ambient background lighting */}
        <div style={{ position: "absolute", top: "-160px", right: "-100px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(32,136,255,0.16) 0%, rgba(21,101,192,0) 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-180px", left: "-80px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,122,89,0.12) 0%, rgba(21,101,192,0) 70%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "56px", alignItems: "center" }}>
            
            {/* Left Hero Content */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeUp} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: "var(--radius-full)", padding: "6px 18px", marginBottom: "24px", fontSize: "0.84rem", fontWeight: 600, color: "#EDF7FF" }}>
                <ShieldCheck size={16} color="#FF7A59" /> Official Series A Healthcare Platform • 100% Board-Certified
              </motion.div>

              <motion.h1 variants={fadeUp} style={{ fontSize: "3.4rem", fontWeight: 800, lineHeight: 1.12, marginBottom: "20px", color: "white", letterSpacing: "-0.035em" }}>
                Priority Hospital &<br />
                Doctor Scheduling,<br />
                <span style={{ color: "#FF967A" }}>Engineered for Trust</span>
              </motion.h1>

              <motion.p variants={fadeUp} style={{ fontSize: "1.12rem", color: "rgba(255,255,255,0.85)", marginBottom: "36px", lineHeight: 1.65, fontWeight: 400, maxWidth: "560px" }}>
                Connect directly with India's premier accredited multi-specialty hospitals, book guaranteed outpatient consultations in under 30 seconds, and manage your complete digital health vault inside one unified platform.
              </motion.p>

              {/* Instant Search Bar */}
              <motion.form
                variants={fadeUp}
                onSubmit={handleSearchSubmit}
                style={{
                  background: "white",
                  padding: "8px 8px 8px 18px",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  maxWidth: "580px",
                  marginBottom: "32px",
                  border: "2px solid rgba(255,255,255,0.2)"
                }}
              >
                <Search size={22} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                <input
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.96rem",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sans)",
                    padding: "10px 0",
                    fontWeight: 500
                  }}
                  placeholder="Search doctors, hospitals, or specialties (e.g., Cardiology, Apollo)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    height: "48px",
                    padding: "0 28px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    borderRadius: "var(--radius-lg)",
                    flexShrink: 0
                  }}
                >
                  Find & Book
                </button>
              </motion.form>

              {/* Action Buttons & Trust Badges */}
              <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", fontSize: "0.86rem", color: "rgba(255,255,255,0.82)", fontWeight: 500 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={17} color="#FF7A59" /> Zero Platform Booking Fees
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Lock size={17} color="#FF7A59" /> HIPAA-Inspired Encryption
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Activity size={17} color="#FF7A59" /> Instant OPD QR Token
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Custom SVG Illustration Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "20px",
                padding: "36px",
                boxShadow: "0 24px 64px rgba(0,0,0,0.32)",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "12px", backgroundColor: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800 }}>
                    <Logo variant="icon-only" size="sm" iconColorOverride="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "white" }}>Priority OPD Pass</div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>Instant Digital Token System</div>
                  </div>
                </div>
                <span className="badge badge-success" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>Active Live Status</span>
              </div>

              {/* Sample Live Doctor Slot Card inside Hero */}
              <div style={{ backgroundColor: "white", borderRadius: "14px", padding: "20px", color: "var(--text-primary)", marginBottom: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem" }}>
                    RS
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>Dr. Rajesh Sharma</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--brand-primary)", fontWeight: 600 }}>Senior Consultant Cardiologist</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Apollo Hospitals • NABH Accredited</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>Next Available Slot</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>Today, 10:30 AM</div>
                  </div>
                  <Link to="/doctors" className="btn btn-primary btn-sm" style={{ height: "36px", padding: "0 16px", fontSize: "0.84rem" }}>
                    Book Slot <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Encrypted Pass Banner */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(0,0,0,0.22)", padding: "14px 18px", borderRadius: "12px", fontSize: "0.84rem", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Lock size={18} color="#60B4FF" />
                <span>Encrypted token generated instantly. Zero wait queues.</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 3. TRUSTED BY (HOSPITAL NETWORK & STATS BANNER) ──────────────── */}
      <section style={{ backgroundColor: "var(--bg-surface)", padding: "64px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>
              Trusted by 500+ Accredited Hospitals & Medical Centers Across India
            </span>
          </div>

          {/* Hospital Brand Strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "20px", marginBottom: "48px", alignItems: "center" }}>
            {hospitalPartners.map((h) => (
              <div
                key={h.name}
                style={{
                  backgroundColor: "var(--bg-card)",
                  padding: "16px 12px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border)",
                  textAlign: "center",
                  boxShadow: "0 2px 6px rgba(18,52,77,0.03)"
                }}
              >
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--brand-primary)", marginBottom: "3px" }}>{h.name}</div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--status-success)" }}>{h.badge}</div>
              </div>
            ))}
          </div>

          {/* Key Metrics Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "24px", textAlign: "center", paddingTop: "32px", borderTop: "1px solid var(--border)" }}>
            {[
              { value: "500+", label: "Accredited Hospitals", sub: "NABH & JCI Certified" },
              { value: "2,500+", label: "Verified Specialists", sub: "100% License Audited" },
              { value: "50,000+", label: "Patients Served", sub: "Across India & NCR" },
              { value: "99.9%", label: "Booking Accuracy", sub: "Zero Overlapping Slots" },
              { value: "4.9 / 5", label: "Patient Satisfaction", sub: "From 18,000+ Reviews" }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                style={{ padding: "10px", borderRight: idx < 4 ? "1px solid var(--border)" : "none" }}
              >
                <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "var(--brand-primary)", lineHeight: 1.1, marginBottom: "4px" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {stat.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHY MEDISLOT (COMPARISON MATRIX & ADVANTAGE) ──────────────── */}
      <section style={{ padding: "96px 0", backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 60px" }}>
            <span className="badge badge-info" style={{ marginBottom: "14px", padding: "6px 14px" }}>The MediSlot Advantage</span>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.025em" }}>
              Traditional Scheduling vs. <span style={{ color: "var(--brand-primary)" }}>MediSlot Platform</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              See why over 50,000 patients and leading multi-specialty hospital chains rely on MediSlot for priority outpatient scheduling.
            </p>
          </div>

          <div style={{ maxWidth: "960px", margin: "0 auto", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-xl)", border: "1.5px solid var(--border)", overflow: "hidden", boxShadow: "0 8px 32px rgba(18,52,77,0.06)" }}>
            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 2fr 2fr", backgroundColor: "var(--bg-dark)", color: "white", padding: "20px 28px", fontWeight: 700, fontSize: "0.95rem" }}>
              <div>Clinical Metric</div>
              <div style={{ color: "rgba(255,255,255,0.7)" }}>Traditional Phone Booking</div>
              <div style={{ color: "#FF967A", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={18} color="#FF7A59" /> MediSlot Digital Platform
              </div>
            </div>

            {/* Rows */}
            {comparisonData.map((row, idx) => (
              <div
                key={row.metric}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 2fr 2fr",
                  padding: "20px 28px",
                  borderTop: idx > 0 ? "1px solid var(--border)" : "none",
                  backgroundColor: idx % 2 === 0 ? "var(--bg-surface)" : "var(--bg-card)",
                  alignItems: "center"
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                  {row.metric}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <X size={18} color="var(--status-danger)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{row.traditional}</span>
                </div>
                <div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "flex-start", gap: "8px", backgroundColor: "var(--status-info-bg)", padding: "10px 14px", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--brand-primary)" }}>
                  <Check size={18} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{row.medislot}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ──────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "96px 0", backgroundColor: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 64px" }}>
            <span className="badge badge-info" style={{ marginBottom: "14px", padding: "6px 14px" }}>Streamlined Workflow</span>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.025em" }}>
              Priority Consultation in <span style={{ color: "var(--brand-primary)" }}>4 Simple Steps</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              We have eliminated the friction of traditional medical scheduling. Experience zero queues and instant digital verification.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px" }}>
            {workflowSteps.map(({ num, title, desc }) => (
              <motion.div
                key={num}
                initial="rest"
                whileHover="hover"
                variants={hoverCard}
                style={{
                  backgroundColor: "var(--bg-card)",
                  padding: "32px 24px",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--bg-muted)",
                  color: "var(--brand-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  marginBottom: "20px",
                  border: "2px solid var(--border)"
                }}>
                  {num}
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-primary)" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CORE FEATURES ─────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "96px 0", backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "660px", margin: "0 auto 64px" }}>
            <span className="badge badge-info" style={{ marginBottom: "14px", padding: "6px 14px" }}>Platform Capabilities</span>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.025em" }}>
              Engineered for <span style={{ color: "var(--brand-primary)" }}>Clinical Excellence</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              A full-stack healthcare operating system designed to unify patients, specialist doctors, and hospital administrators.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {coreFeatures.map(({ icon: Icon, color, bg, title, desc }) => (
              <motion.div
                key={title}
                initial="rest"
                whileHover="hover"
                variants={hoverCard}
                className="card card-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  backgroundColor: "var(--bg-surface)",
                  padding: "32px",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border)"
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: "var(--radius-lg)", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={26} color={color} />
                </div>
                <h3 style={{ fontSize: "1.22rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FIND DOCTORS (SPECIALTIES SHOWCASE) ───────────────────────── */}
      <section style={{ padding: "96px 0", backgroundColor: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: "12px", padding: "6px 14px" }}>Specialist Directory</span>
              <h2 style={{ fontSize: "2.4rem", fontWeight: 800, margin: 0, letterSpacing: "-0.025em" }}>
                Find Specialists by <span style={{ color: "var(--brand-primary)" }}>Clinical Department</span>
              </h2>
            </div>
            <Link to="/doctors" className="btn btn-outline" style={{ height: "48px", padding: "0 24px", display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
              View All Specialist Doctors <ChevronRight size={18} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px" }}>
            {specialtiesList.map(({ name, desc, icon: Icon, count }) => (
              <Link
                key={name}
                to={`/doctors?specialization=${encodeURIComponent(name)}`}
                style={{ textDecoration: "none" }}
              >
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  variants={hoverCard}
                  style={{
                    backgroundColor: "var(--bg-card)",
                    padding: "24px 18px",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    height: "100%"
                  }}
                >
                  <div style={{ width: 50, height: 50, borderRadius: "50%", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: "4px" }}>{name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: "8px" }}>{desc}</div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--brand-accent)", backgroundColor: "rgba(255,122,89,0.12)", padding: "3px 10px", borderRadius: "var(--radius-full)" }}>
                      {count}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FIND HOSPITALS (ACCREDITED PARTNERS SHOWCASE) ─────────────── */}
      <section style={{ padding: "96px 0", backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: "12px", padding: "6px 14px" }}>Accredited Healthcare Facilities</span>
              <h2 style={{ fontSize: "2.4rem", fontWeight: 800, margin: 0, letterSpacing: "-0.025em" }}>
                Find Premium <span style={{ color: "var(--brand-primary)" }}>Hospitals & Medical Centers</span>
              </h2>
            </div>
            <Link to="/hospitals" className="btn btn-outline" style={{ height: "48px", padding: "0 24px", display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
              Explore All 500+ Hospitals <ChevronRight size={18} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {hospitalPartners.map((h) => (
              <motion.div
                key={h.name}
                initial="rest"
                whileHover="hover"
                variants={hoverCard}
                style={{
                  backgroundColor: "var(--bg-surface)",
                  padding: "26px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "16px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Building2 size={24} />
                  </div>
                  <span className="badge badge-success" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>{h.badge}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 6px", color: "var(--text-primary)" }}>{h.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.86rem" }}>
                    <MapPin size={15} color="var(--brand-accent)" /> {h.location} • {h.beds}
                  </div>
                </div>
                <Link
                  to={`/hospitals?search=${encodeURIComponent(h.name)}`}
                  style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--brand-primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "4px" }}
                >
                  View Doctors & OPD Roster <ArrowRight size={15} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. TESTIMONIALS ──────────────────────────────────────────────── */}
      <section style={{ padding: "96px 0", backgroundColor: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "660px", margin: "0 auto 60px" }}>
            <span className="badge badge-info" style={{ marginBottom: "14px", padding: "6px 14px" }}>Verified Feedback</span>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.025em" }}>
              Trusted by <span style={{ color: "var(--brand-primary)" }}>Doctors & Patients</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Hear genuine feedback from senior medical directors and everyday patients experiencing hassle-free outpatient care.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial="rest"
                whileHover="hover"
                variants={hoverCard}
                style={{
                  backgroundColor: "var(--bg-card)",
                  padding: "32px",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "24px"
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "16px", color: "#F59E0B" }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="#F59E0B" />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>
                    "{t.quote}"
                  </p>
                </div>

                <div style={{ paddingTop: "20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0 }}>
                    {t.author.replace(/^Dr\.\s*/i, "").charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>{t.author}</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--brand-primary)" }}>{t.role}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.hospital}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 0", backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "660px", margin: "0 auto 56px" }}>
            <span className="badge badge-info" style={{ marginBottom: "14px", padding: "6px 14px" }}>Clear Answers</span>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.025em" }}>
              Frequently Asked <span style={{ color: "var(--brand-primary)" }}>Questions</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Everything you need to know about booking appointments, hospital tariffs, and medical record security on MediSlot.
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderRadius: "var(--radius-lg)",
                    border: isOpen ? "1.5px solid var(--brand-primary)" : "1px solid var(--border)",
                    overflow: "hidden",
                    transition: "border-color 0.18s"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "20px 24px",
                      background: "none",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--text-primary)"
                    }}
                  >
                    <span>{faq.q}</span>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: isOpen ? "var(--brand-primary)" : "var(--bg-muted)",
                      color: isOpen ? "white" : "var(--text-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.18s"
                    }}>
                      <ChevronRight size={18} style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.18s" }} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div style={{ padding: "0 24px 22px", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.65, borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 11. FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "var(--bg-dark)", color: "white", padding: "72px 0 36px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.2fr 1.2fr 1.4fr", gap: "48px", marginBottom: "56px" }}>
            <div>
              <div style={{ marginBottom: "20px" }}>
                <Logo variant="monochrome" size="md" />
              </div>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.92rem", lineHeight: 1.65, maxWidth: "340px", margin: "0 0 24px" }}>
                Official Series A Healthcare Operating System. Providing verified, zero-wait outpatient appointment coordination across premier clinical institutions.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255, 255, 255, 0.08)", padding: "10px 16px", borderRadius: "10px", color: "white", fontSize: "0.85rem", fontWeight: 600, border: "1px solid rgba(255, 255, 255, 0.12)" }}>
                <Logo variant="icon-only" size="xs" iconColorOverride="#FFFFFF" />
                <span>Enterprise Healthcare Operating System • ISO & HIPAA Certified</span>
              </div>
            </div>

            {/* Patient Links */}
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "white", marginBottom: "20px" }}>Patient Platform</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link to="/hospitals" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.92rem", textDecoration: "none" }}>Find Hospitals</Link>
                <Link to="/doctors" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.92rem", textDecoration: "none" }}>Doctor Directory</Link>
                <Link to="/hospitals" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.92rem", textDecoration: "none" }}>Instant OPD Booking</Link>
                <Link to="/patient/dashboard" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.92rem", textDecoration: "none" }}>Patient Health Vault</Link>
              </div>
            </div>

            {/* Provider Links */}
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "white", marginBottom: "20px" }}>Clinical Portals</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link to="/doctor/dashboard" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.92rem", textDecoration: "none" }}>Doctor Roster & Rx</Link>
                <Link to="/admin/dashboard" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.92rem", textDecoration: "none" }}>Hospital Administration</Link>
                <Link to="/register" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.92rem", textDecoration: "none" }}>Provider Onboarding</Link>
                <Link to="/login" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.92rem", textDecoration: "none" }}>Clinical Sign-In</Link>
              </div>
            </div>

            {/* Governance */}
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "white", marginBottom: "20px" }}>Clinical Governance</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.88rem", color: "rgba(255,255,255,0.75)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Phone size={15} color="#FF7A59" /> Helpdesk: +91 800-MEDISLOT
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={15} color="#FF7A59" /> HQ: Healthcare Tech Park, Bangalore
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldCheck size={15} color="#FF7A59" /> ISO 27001 & NABH Digital Partner
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: "36px", borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", flexWrap: "wrap", gap: "16px" }}>
            <span>© 2026 MediSlot Healthcare Platforms Inc. All rights reserved. • Official Medical Blue System</span>
            <div style={{ display: "flex", gap: "24px" }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>HIPAA Compliance Statement</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
