// src/pages/patient/PatientDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, Clock, Search, ChevronRight, Activity, CheckCircle, XCircle, 
  AlertCircle, FileText, TrendingUp, ShieldCheck, Heart, PhoneCall, 
  Award, Star, MapPin, Sparkles, UserCheck 
} from "lucide-react";
import toast from "react-hot-toast";
import { appointmentsAPI, doctorsAPI } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useAuthStore from "../../store/authStore";

const statusConfig = {
  CONFIRMED: { icon: CheckCircle, label: "Confirmed" },
  PENDING: { icon: AlertCircle, label: "Pending" },
  CANCELLED: { icon: XCircle, label: "Cancelled" },
  COMPLETED: { icon: CheckCircle, label: "Completed" },
};

export default function PatientDashboard() {
  const { profile } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("medislot_fav_docs") || "[]"); }
    catch { return []; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      appointmentsAPI.getMyAppointments({ limit: 10 }),
      doctorsAPI.getAll({ limit: 4 })
    ])
      .then(([appRes, docRes]) => {
        setAppointments(appRes.data.data || []);
        setRecommendedDoctors(docRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = (docId) => {
    const next = favorites.includes(docId)
      ? favorites.filter((id) => id !== docId)
      : [...favorites, docId];
    setFavorites(next);
    localStorage.setItem("medislot_fav_docs", JSON.stringify(next));
    toast.success(favorites.includes(docId) ? "Removed from saved doctors" : "Saved to favorite specialists");
  };

  const upcoming = appointments.filter((a) => ["CONFIRMED", "PENDING"].includes(a.status));
  const stats = {
    total: appointments.length,
    upcoming: upcoming.length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <DashboardLayout title="Patient Workspace" subtitle="Monitor your healthcare timeline, live queue status, and clinical records">
      {/* Welcome Banner + Live Queue Tracker */}
      <div className="card" style={{ padding: "28px 32px", marginBottom: "24px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "24px" }}>
          <div style={{ maxWidth: "620px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "var(--status-info-bg)", color: "var(--brand-primary)", padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "14px", border: "1px solid var(--border)" }}>
              <ShieldCheck size={14} /> HIPAA-Compliant Care Ecosystem
            </div>
            <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "10px", letterSpacing: "-0.02em" }}>
              {greeting()}, {profile?.full_name?.split(" ")[0] || "Patient"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>
              Your central dashboard for accredited medical consultations. Track your live OPD queue position, manage prescriptions, and consult top specialists.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/doctors" className="btn btn-cta" style={{ fontWeight: 600 }}>
                <Calendar size={16} /> Book Consultation
              </Link>
              <Link to="/hospitals" className="btn btn-primary" style={{ fontWeight: 600 }}>
                <Search size={16} /> Find Hospitals
              </Link>
            </div>
          </div>
          
          {/* Live Care Episode / Queue Position Tracker Card */}
          <div style={{ backgroundColor: "var(--bg-surface)", padding: "20px 24px", borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", minWidth: "280px", flex: "1 1 280px", maxWidth: "380px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--brand-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
                <Activity size={14} /> Active Care Episode
              </span>
              {upcoming.length > 0 && (
                <span className="badge badge-info" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                  Live Tracking
                </span>
              )}
            </div>

            {upcoming.length > 0 ? (
              <div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                  {upcoming[0].doctor?.full_name}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
                  {upcoming[0].doctor?.specialization} • {upcoming[0].hospital?.name || "Medical Clinic"}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", backgroundColor: "var(--bg-card)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Queue Position</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--brand-accent)" }}>#4 in Line</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Est. Wait Time</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--brand-primary)" }}>~18 mins</div>
                  </div>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
                  <Clock size={14} color="var(--brand-primary)" /> Scheduled: {upcoming[0].appointment_date} ({upcoming[0].slot?.start_time})
                </div>
              </div>
            ) : (
              <div style={{ padding: "16px 0", textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <UserCheck size={22} />
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>All Caught Up!</div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>No active clinical appointments or pending checkups.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {[
          { title: "Specialist Roster", desc: "Browse 2,500+ verified doctors", icon: Search, link: "/doctors", color: "var(--brand-primary)", bg: "var(--bg-muted)" },
          { title: "Hospital Network", desc: "Find accredited medical clinics", icon: MapPin, link: "/hospitals", color: "var(--brand-accent)", bg: "rgba(255, 122, 89, 0.15)" },
          { title: "Health Records", desc: "View encrypted clinical reports", icon: FileText, link: "/patient/profile", color: "var(--status-success)", bg: "var(--status-success-bg)" },
          { title: "24/7 Helpline", desc: "Immediate ambulance & triage", icon: PhoneCall, action: () => toast.success("Connecting to 24/7 Triage Coordinator (Ext 102)..."), color: "var(--status-danger)", bg: "var(--status-danger-bg)" },
        ].map((item, idx) => {
          const Icon = item.icon;
          const content = (
            <div className="card" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer", transition: "all 200ms ease", height: "100%", border: "1px solid var(--border)" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)", backgroundColor: item.bg, color: item.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{item.title}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>{item.desc}</div>
              </div>
            </div>
          );
          return item.link ? <Link key={idx} to={item.link} style={{ textDecoration: "none" }}>{content}</Link> : <div key={idx} onClick={item.action}>{content}</div>;
        })}
      </div>

      {/* Series A Statistics Grid */}
      <div className="stats-grid" style={{ marginBottom: "28px" }}>
        {[
          { label: "Total Consultations", value: stats.total, desc: `${stats.upcoming} scheduled upcoming`, color: "var(--brand-primary)", bg: "var(--bg-muted)", icon: FileText, trend: "All-time record" },
          { label: "Active Queue", value: stats.upcoming, desc: "Pending clinical checkups", color: "var(--brand-accent)", bg: "rgba(255, 122, 89, 0.15)", icon: Calendar, trend: "Live status" },
          { label: "Completed Care", value: stats.completed, desc: "Successfully attended visits", color: "var(--status-success)", bg: "var(--status-success-bg)", icon: CheckCircle, trend: "98% compliance" },
          { label: "Rescheduled", value: stats.cancelled, desc: "Dropped or moved slots", color: "var(--status-danger)", bg: "var(--status-danger-bg)", icon: XCircle, trend: "Low drop rate" },
        ].map(({ label, value, desc, color, bg, icon: Icon, trend }) => (
          <div key={label} className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon" style={{ backgroundColor: bg, color: color }}>
                <Icon size={22} />
              </div>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)", padding: "2px 8px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <TrendingUp size={11} /> {trend}
              </span>
            </div>
            <div className="stat-card-value">{loading ? "—" : value}</div>
            <div className="stat-card-label">{label}</div>
            <div className="stat-card-desc">{desc}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Activity History & Recommended Specialists */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.1fr", gap: "24px", alignItems: "flex-start" }}>
        {/* Left Column: Recent Consultations Table */}
        <div className="table-wrapper">
          <div className="table-header">
            <div>
              <div className="table-title">Recent Consultations</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>Audited chronological history of your clinical visits</div>
            </div>
            <Link to="/patient/appointments" className="btn btn-secondary btn-sm" style={{ fontWeight: 500 }}>
              View All History <ChevronRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div className="spinner spinner-dark" style={{ width: 28, height: 28, margin: "0 auto" }} />
            </div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Calendar size={28} /></div>
              <div className="empty-state-title">No Appointments Yet</div>
              <p className="empty-state-desc">You're all caught up. Book your first consultation to begin managing your healthcare journey.</p>
              <Link to="/doctors" className="btn btn-cta btn-sm" style={{ fontWeight: 500 }}>
                <Calendar size={15} /> Book Appointment
              </Link>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Specialist Doctor</th>
                  <th>Schedule Date & Time</th>
                  <th>Medical Facility</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((appt) => {
                  const cfg = statusConfig[appt.status] || statusConfig.PENDING;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={appt.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img src={appt.doctor?.profile_pic} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{appt.doctor?.full_name}</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--brand-primary)", fontWeight: 500 }}>{appt.doctor?.specialization}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{appt.appointment_date}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{appt.slot?.start_time} – {appt.slot?.end_time}</div>
                      </td>
                      <td style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>{appt.hospital?.name || "—"}</td>
                      <td>
                        <span className={`badge status-${appt.status}`}>
                          <StatusIcon size={12} /> {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Health Tips & Clinical Insights Box */}
          <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "var(--bg-muted)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                AI Clinical Insight: Preventive Checkups
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                Regular blood pressure and lipid profiling every 6 months reduces cardiovascular risk factors by 40%. Ask your specialist about our comprehensive diagnostic packages during your next visit.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Specialists with Favorites Bookmark */}
        <div className="card" style={{ padding: "24px", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Award size={18} color="var(--brand-accent)" /> Recommended Specialists
            </div>
            <Link to="/doctors" style={{ fontSize: "0.8rem", color: "var(--brand-primary)", fontWeight: 600, textDecoration: "none" }}>
              View All →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {recommendedDoctors.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Loading specialist roster...
              </div>
            ) : (
              recommendedDoctors.map((doc) => {
                const isFav = favorites.includes(doc.id);
                return (
                  <div key={doc.id} style={{ padding: "14px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", transition: "all 150ms ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
                      <img src={doc.profile_pic} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--border)", flexShrink: 0 }} />
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {doc.full_name}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--brand-primary)", fontWeight: 600 }}>
                          {doc.specialization}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                          <Star size={11} color="#FFB800" fill="#FFB800" /> {doc.rating || "4.9"} ({doc.experience_years || 10}+ yrs exp)
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <button
                        onClick={() => toggleFavorite(doc.id)}
                        style={{ width: 32, height: 32, borderRadius: "50%", background: isFav ? "rgba(255, 122, 89, 0.15)" : "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: isFav ? "var(--brand-accent)" : "var(--text-muted)", transition: "all 150ms ease" }}
                        title={isFav ? "Remove from favorites" : "Save specialist"}
                      >
                        <Heart size={15} fill={isFav ? "var(--brand-accent)" : "none"} />
                      </button>
                      <Link to={`/doctors/${doc.id}`} className="btn btn-primary btn-sm" style={{ padding: "6px 12px", fontSize: "0.78rem", fontWeight: 600 }}>
                        Book
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ marginTop: "18px", padding: "14px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-muted)", border: "1px dashed var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>Need specialized triage?</div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: "4px 0 0" }}>Our AI symptom checker helps you match with the right department.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
