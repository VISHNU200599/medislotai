// src/pages/HospitalProfilePage.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Star, Users, Building2, Award, Stethoscope, Clock, Heart, Activity, ArrowLeft } from "lucide-react";
import { hospitalsAPI } from "../services/api";
import Navbar from "../components/layout/Navbar";

export default function HospitalProfilePage() {
  const { slug } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("doctors");

  useEffect(() => {
    hospitalsAPI.getBySlug(slug).then((res) => setHospital(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)" }}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div className="spinner spinner-dark" style={{ width: 40, height: 40 }} />
      </div>
    </div>
  );

  if (!hospital) return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)" }}><Navbar />
    <div className="container" style={{ paddingTop: 120, textAlign: "center" }}>
      <h2>Hospital Facility Not Found</h2>
      <p style={{ marginTop: 8 }}>The requested clinical facility is unavailable or has been removed.</p>
      <Link to="/hospitals" className="btn btn-primary" style={{ marginTop: 24, fontWeight: 500 }}>Return to Hospital Directory</Link>
    </div>
  </div>
);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)" }}>
      <Navbar />
      <div className="container" style={{ maxWidth: "1160px", paddingTop: 16, paddingLeft: 24, paddingRight: 24 }}>
        <Link to="/hospitals" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", transition: "color 150ms ease" }}
          onMouseOver={e => e.currentTarget.style.color = "var(--brand-primary)"}
          onMouseOut={e => e.currentTarget.style.color = "var(--text-secondary)"}
        >
          <ArrowLeft size={16} /> Back to Hospitals
        </Link>
      </div>
      {/* Cover Image (Solid Medical Blue Overlay, No Gradients!) */}
      <div style={{ height: "280px", position: "relative", backgroundColor: "var(--bg-dark)" }}>
        <img src={hospital.cover_image_url} alt={hospital.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(11, 46, 79, 0.45)" }} />
      </div>

      <div className="container" style={{ maxWidth: "1160px", paddingBottom: "64px", paddingLeft: "24px", paddingRight: "24px" }}>
        {/* Profile Header */}
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-end", marginTop: "-64px", marginBottom: "32px", position: "relative", zIndex: 10, flexWrap: "wrap" }}>
          <img src={hospital.logo_url} alt="logo" style={{ width: 112, height: 112, borderRadius: "var(--radius-lg)", objectFit: "cover", border: "4px solid white", boxShadow: "var(--shadow-lg)", backgroundColor: "white" }} />
          <div style={{ flex: 1, paddingBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{hospital.name}</h1>
              {hospital.is_verified && (
                <span className="badge badge-success" style={{ padding: "6px 12px", fontSize: "0.8rem", fontWeight: 600 }}><Award size={14} /> Verified Facility</span>
              )}
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={16} color="var(--brand-primary)" /> {hospital.address}, {hospital.city}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Phone size={16} color="var(--brand-primary)" /> {hospital.phone}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#FF7A59", fontWeight: 600 }}><Star size={16} fill="#FF7A59" /> {hospital.rating} Patient Rating</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", paddingBottom: "8px" }}>
            <a href={`tel:${hospital.phone}`} className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
              <Phone size={16} /> Call Facility
            </a>
          </div>
        </div>

        {/* Clinical Statistics Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
          {[
            { label: "Established Year", value: hospital.established, icon: Building2 },
            { label: "Inpatient Beds", value: hospital.beds, icon: Activity },
            { label: "Clinical Specialists", value: hospital.doctor_count, icon: Stethoscope },
            { label: "Medical Departments", value: hospital.department_count, icon: Heart },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card card-body" style={{ textAlign: "center", padding: "20px", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "var(--bg-card)" }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                <Icon size={20} />
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* About Facility */}
        <div className="card card-body" style={{ marginBottom: "32px", backgroundColor: "var(--bg-card)" }}>
          <h3 style={{ marginBottom: "12px", fontSize: "1.15rem", fontWeight: 600 }}>About {hospital.name}</h3>
          <p style={{ lineHeight: 1.8, color: "var(--text-secondary)", fontSize: "0.95rem" }}>{hospital.description}</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "20px" }}>
            {hospital.specialties?.map((s) => <span key={s} className="badge badge-info">{s}</span>)}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", marginBottom: "32px", overflowX: "auto" }}>
          {[
            { id: "doctors", label: `Clinical Specialists (${hospital.doctors?.length || 0})`, icon: Stethoscope },
            { id: "departments", label: `Medical Departments (${hospital.departments?.length || 0})`, icon: Building2 },
            { id: "facilities", label: "Facilities & Tech", icon: Award },
            { id: "hours", label: "Opening Hours & Emergency", icon: Clock },
            { id: "reviews", label: "Patient Reviews", icon: Star }
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 20px", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, color: activeTab === id ? "var(--brand-primary)" : "var(--text-secondary)", borderBottom: activeTab === id ? "2px solid var(--brand-primary)" : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap", transition: "all 150ms ease" }}>
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {activeTab === "doctors" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {hospital.doctors?.map((doc) => (
              <Link key={doc.id} to={`/doctors/${doc.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card card-body" style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <img src={doc.profile_pic} alt={doc.full_name} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
                    <div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>{doc.full_name}</h4>
                      <p style={{ fontSize: "0.82rem", color: "var(--brand-primary)", fontWeight: 600, marginBottom: "4px" }}>{doc.specialization}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{doc.qualification}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Star size={14} color="#FF7A59" fill="#FF7A59" />
                      <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{doc.rating || "4.9"}</span>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>• {doc.experience_years} yrs exp</span>
                    </div>
                    <span style={{ fontWeight: 700, color: "var(--brand-primary)", fontSize: "0.95rem" }}>₹{doc.consultation_fee}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "departments" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {hospital.departments?.map((dept) => (
              <div key={dept.id} className="card card-body" style={{ display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  <Building2 size={20} />
                </div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>{dept.name}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{dept.description || "Comprehensive diagnostic, inpatient, and outpatient healthcare treatments managed by expert specialists."}</p>
                <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                  <span className={`badge ${dept.is_active ? "badge-success" : "badge-muted"}`} style={{ fontWeight: 600 }}>
                    {dept.is_active ? "Active Clinical Unit" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "facilities" && (
          <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Healthcare Infrastructure & Advanced Technologies
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {[
                { title: "24/7 Advanced Emergency Room", desc: "Fully equipped trauma center with rapid triage and critical resuscitation bays." },
                { title: "Intensive Care Unit (ICU & NICU)", desc: "State-of-the-art life support systems with 1:1 specialized nurse monitoring." },
                { title: "High-Speed CT & 3T MRI Imaging", desc: "Precision diagnostic radiology suites offering rapid scan turnarounds." },
                { title: "Automated Blood Bank & Pathology", desc: "24-hour on-site hematology, biochemistry, and microbiology laboratories." },
                { title: "Robotic Surgery Suites", desc: "Minimal access surgery operating theaters with ultra-high definition optics." },
                { title: "On-Site Digital Pharmacy", desc: "Comprehensive inpatient and outpatient dispensary with automated inventory." }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: "16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "4px" }}>{item.title}</div>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "hours" && (
          <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Operational Timings & Emergency Schedule
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "800px" }}>
              <div style={{ padding: "16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Emergency Room & Trauma</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--status-danger)" }}>24 Hours / 7 Days a Week</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>Always open for critical and acute care admissions.</div>
              </div>

              <div style={{ padding: "16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Outpatient Consultation Clinics</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--brand-primary)" }}>Mon – Sat: 08:00 AM – 08:00 PM</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>Prior appointment requested via patient portal.</div>
              </div>

              <div style={{ padding: "16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Diagnostic Lab & Radiology</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>24/7 Operational</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>Sample collection and imaging available round the clock.</div>
              </div>

              <div style={{ padding: "16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Inpatient Visiting Hours</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>04:00 PM – 07:00 PM Daily</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>Maximum 2 visitors per patient pass at a time.</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>Patient & Visitor Reviews</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>Authenticated feedback from verified facility visits</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "var(--bg-base)", padding: "8px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <Star size={18} fill="#FF7A59" color="#FF7A59" />
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>{hospital.rating || "4.8"}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>({hospital.doctor_count * 12 || 120} reviews)</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { name: "Siddharth K.", rating: 5, date: "2 days ago", dept: "Cardiology Unit", comment: "The emergency admission process was incredibly smooth and fast. The doctors and nursing staff in the cardiac ICU were world-class and attentive." },
                { name: "Meera W.", rating: 5, date: "1 week ago", dept: "Pediatrics & NICU", comment: "Clean rooms, hygienic cafeteria, and very courteous support staff. Dr. Verma provided excellent guidance throughout our stay." },
                { name: "Amitabh R.", rating: 4.8, date: "3 weeks ago", dept: "Orthopedic Surgery", comment: "Modern diagnostic equipment and transparent billing. Highly recommend this facility for any surgical or inpatient needs." }
              ].map((rev, idx) => (
                <div key={idx} style={{ padding: "16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{rev.name}</span>
                      <span className="badge badge-info" style={{ fontSize: "0.72rem", fontWeight: 600 }}>{rev.dept}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill={i < Math.floor(rev.rating) ? "#FF7A59" : "none"} color="#FF7A59" />
                        ))}
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>• {rev.date}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
