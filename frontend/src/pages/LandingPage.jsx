// src/pages/LandingPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Shield, Clock, Heart, Activity, Calendar, ArrowRight,
  Zap, Brain, Building2, Pill, Stethoscope, CheckCircle2, Star,
  MapPin, Phone, Users, ChevronRight
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Logo from "../components/common/Logo";

const features = [
  { icon: Search, color: "var(--brand-primary)", bg: "var(--bg-muted)", title: "Smart Search", desc: "Find accredited hospitals and specialized doctors near you with intelligent search and filtering by specialty, location, and verified patient ratings." },
  { icon: Calendar, color: "var(--brand-accent)", bg: "rgba(255,122,89,0.15)", title: "Instant Booking", desc: "Book guaranteed appointments in seconds. Choose your preferred morning or evening time slot and receive instant confirmation." },
  { icon: Shield, color: "var(--brand-primary)", bg: "var(--bg-muted)", title: "Verified Credentials", desc: "Every doctor and healthcare facility is thoroughly vetted. Read authentic reviews from real verified patients before scheduling." },
  { icon: Clock, color: "var(--brand-primary)", bg: "var(--bg-muted)", title: "Zero Waiting Queues", desc: "Pre-booked time slots ensure you arrive precisely at your appointment time. Eliminate stressful hours spent in waiting rooms." },
  { icon: Activity, color: "var(--brand-primary)", bg: "var(--bg-muted)", title: "Digital Health Records", desc: "Securely store and access your medical history, e-prescriptions, and laboratory reports in a centralized HIPAA-compliant vault." },
  { icon: Brain, color: "var(--brand-accent)", bg: "rgba(255,122,89,0.15)", title: "AI Health Assistant", desc: "Our intelligent symptom triage and clinical doctor recommendation engine guides your healthcare decisions with precision." },
];

const steps = [
  { num: "01", title: "Search Providers", desc: "Find top-rated hospitals or doctors by medical specialty, location, or procedure." },
  { num: "02", title: "Compare & Select", desc: "Review qualifications, consultation fees, patient feedback, and real-time slot availability." },
  { num: "03", title: "Instant Booking", desc: "Select your preferred slot and confirm your appointment instantly with zero booking fees." },
  { num: "04", title: "Seamless Consultation", desc: "Arrive at your scheduled time for a hassle-free, zero-wait clinical experience." },
];

const specialties = [
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Orthopedics", icon: Activity },
  { name: "Oncology", icon: Shield },
  { name: "Pediatrics", icon: Users },
  { name: "Gynecology", icon: Heart },
  { name: "Dermatology", icon: CheckCircle2 },
  { name: "Psychiatry", icon: Brain },
  { name: "Ophthalmology", icon: Search },
  { name: "ENT", icon: Stethoscope },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* ── Hero Section (Medical Blue Background #0B4F8C) ───────────── */}
      <section style={{ backgroundColor: "var(--bg-dark)", color: "white", padding: "80px 0 96px", borderBottom: "1px solid rgba(255,255,255,0.1)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-full)", padding: "6px 16px", marginBottom: "24px", fontSize: "0.85rem", fontWeight: 500, color: "#EDF7FF" }}>
              <Zap size={14} color="#FF7A59" fill="#FF7A59" /> Smart Hospital & Healthcare Management Platform
            </div>
            
            <h1 style={{ fontSize: "3.25rem", fontWeight: 800, lineHeight: 1.15, marginBottom: "20px", color: "white", letterSpacing: "-0.03em" }}>
              Modern Healthcare,<br />
              <span style={{ color: "#FF967A" }}>Simplified & Accessible</span>
            </h1>
            
            <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", marginBottom: "40px", lineHeight: 1.6, fontWeight: 400 }}>
              Connect with accredited hospitals, consult specialized doctors, book guaranteed appointments instantly, and manage your complete medical records in one trusted platform.
            </p>

            {/* Search Bar Container */}
            <div style={{ background: "white", padding: "8px", borderRadius: "var(--radius-lg)", boxShadow: "0 12px 36px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "12px", maxWidth: "600px", margin: "0 auto 36px" }}>
              <Search size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: "12px" }} />
              <input
                style={{ border: "none", outline: "none", width: "100%", fontSize: "0.95rem", color: "var(--text-primary)", fontFamily: "var(--font-sans)", padding: "8px 0" }}
                placeholder="Search doctors, hospitals, specialties (e.g. Cardiology)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Link to={`/hospitals?search=${searchQuery}`} className="btn btn-primary" style={{ padding: "12px 24px", fontSize: "0.95rem", fontWeight: 600, flexShrink: 0 }}>
                Search Now
              </Link>
            </div>

            {/* Hero CTAs */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/hospitals" className="btn btn-cta btn-lg" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={18} /> Book Appointment
              </Link>
              <Link to="/register" className="btn btn-lg" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
                Register Provider Portal <ArrowRight size={18} />
              </Link>
            </div>

            {/* Trust Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginTop: "64px", paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              {[
                ["500+", "Accredited Hospitals"],
                ["2,500+", "Verified Doctors"],
                ["50,000+", "Patients Served"],
                ["4.9 / 5", "Patient Satisfaction"]
              ].map(([val, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginTop: "6px", fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Specialties Scroll Bar ────────────────────────────────────────── */}
      <div style={{ backgroundColor: "var(--bg-card)", padding: "24px 0", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
            {specialties.map(({ name, icon: Icon }) => (
              <Link key={name} to={`/doctors?specialization=${name}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexShrink: 0, padding: "8px 18px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", backgroundColor: "var(--bg-base)", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", transition: "all 0.2s" }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "var(--brand-primary)"; e.currentTarget.style.color = "var(--brand-primary)"; e.currentTarget.style.backgroundColor = "var(--bg-muted)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.backgroundColor = "var(--bg-base)"; }}
              >
                <Icon size={16} color="var(--brand-primary)" />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why MediSlot AI Section ──────────────────────────────────────── */}
      <section className="section" id="features" style={{ padding: "80px 0", backgroundColor: "var(--bg-base)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 56px" }}>
            <span className="badge badge-info" style={{ marginBottom: "12px" }}>Platform Capabilities</span>
            <h2 style={{ marginBottom: "16px" }}>Healthcare Management <span style={{ color: "var(--brand-primary)" }}>Built for Trust</span></h2>
            <p>Everything patients and providers need for seamless healthcare coordination, from discovery to digital records.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
            {features.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="card card-body" style={{ display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "var(--bg-card)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={24} color={color} />
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 600 }}>{title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Section ─────────────────────────────────────────── */}
      <section className="section" id="how-it-works" style={{ padding: "80px 0", backgroundColor: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 56px" }}>
            <span className="badge badge-info" style={{ marginBottom: "12px" }}>Simple Workflow</span>
            <h2 style={{ marginBottom: "16px" }}>Book in 4 Simple Steps</h2>
            <p>Our streamlined process ensures you get the care you need without administrative friction.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} style={{ textAlign: "center", position: "relative", padding: "16px" }}>
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: 36, left: "65%", width: "70%", height: 1, backgroundColor: "var(--border)", zIndex: 0 }} />
                )}
                <div style={{ width: 56, height: 56, borderRadius: "var(--radius-full)", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative", zIndex: 1, fontWeight: 800, fontSize: "1.2rem", border: "2px solid var(--border)" }}>
                  {num}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "8px" }}>{title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call To Action Section ───────────────────────────────────────── */}
      <section style={{ padding: "80px 0", backgroundColor: "var(--bg-dark)", color: "white", textAlign: "center" }}>
        <div className="container">
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-full)", padding: "6px 16px", marginBottom: "20px", fontSize: "0.85rem", fontWeight: 500, color: "#EDF7FF" }}>
              <Heart size={14} color="#FF7A59" fill="#FF7A59" /> Trusted by Healthcare Providers Nationwide
            </div>
            <h2 style={{ color: "white", fontSize: "2.25rem", marginBottom: "16px" }}>Ready to Take Control of Your Health?</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "32px", fontSize: "1.05rem" }}>Create your free patient account today and schedule your first appointment in under two minutes.</p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/hospitals" className="btn btn-cta btn-lg" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={18} /> Book Appointment
              </Link>
              <Link to="/register" className="btn btn-lg" style={{ backgroundColor: "white", color: "var(--brand-primary)", fontWeight: 600 }}>
                Create Free Account <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Section ───────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "var(--bg-dark-secondary)", color: "white", padding: "64px 0 32px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
            <div>
              <div style={{ marginBottom: "16px" }}>
                <Logo variant="monochrome" size="md" />
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "320px" }}>
                Smart Hospital Appointment & Healthcare Management Platform. Empowering seamless communication between patients and clinical specialists.
              </p>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                {[Building2, Stethoscope, Pill, Heart].map((Icon, idx) => (
                  <div key={idx} style={{ width: 36, height: 36, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>

            {[
              { heading: "Platform", links: ["Find Hospitals", "Find Doctors", "Book Appointment", "Patient Portal"] },
              { heading: "For Providers", links: ["Doctor Portal", "Hospital Admin", "Clinical Guidelines", "API Documentation"] },
              { heading: "Legal & Trust", links: ["About Us", "Privacy Policy", "Terms of Service", "HIPAA Compliance"] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "white", marginBottom: "16px" }}>{heading}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {links.map((l) => (
                    <a key={l} href="#" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.15s" }} onMouseOver={e => e.currentTarget.style.color = "white"} onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
            <span>© 2026 MediSlot AI Healthcare Platforms Inc. All rights reserved.</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              Built with precision for clinical excellence
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
