// src/pages/DoctorProfilePage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Award, CheckCircle, Calendar, ChevronLeft, ShieldAlert, ShieldCheck, Building2, ThumbsUp, MessageSquare, Check, BookOpen, Stethoscope, Heart, ArrowLeft } from "lucide-react";
import { doctorsAPI } from "../services/api";
import { format, addDays } from "date-fns";
import Navbar from "../components/layout/Navbar";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeTab, setActiveTab] = useState("OVERVIEW");

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i);
    return { date: format(d, "yyyy-MM-dd"), label: format(d, "EEE"), dayNum: format(d, "d"), month: format(d, "MMM") };
  });

  useEffect(() => {
    Promise.all([
      doctorsAPI.getById(id),
      doctorsAPI.getSlots(id),
    ]).then(([docRes, slotsRes]) => {
      setDoctor(docRes.data.data);
      setSlots(slotsRes.data.data.slots || {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }
    if (user?.role !== "PATIENT") {
      toast.error("Only patients can book appointments");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    navigate(`/patient/book/${id}`, { state: { doctor, slot: selectedSlot, date: selectedDate } });
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)" }}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div className="spinner spinner-dark" style={{ width: 40, height: 40 }} />
      </div>
    </div>
  );

  if (!doctor) return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)" }}>
      <Navbar />
      <div className="container" style={{ paddingTop: 120, textAlign: "center" }}>
        <h2>Doctor Profile Not Found</h2>
        <p style={{ marginTop: 8 }}>The requested clinical specialist profile is no longer active.</p>
        <Link to="/doctors" className="btn btn-primary" style={{ marginTop: 24, fontWeight: 500 }}>Return to Doctor Directory</Link>
      </div>
    </div>
  );

  const todaySlots = slots[selectedDate] || [];

  const mockReviews = [
    { name: "Rahul S.", rating: 5, date: "3 days ago", comment: "Dr. Sharma took the time to explain every detail of my diagnosis. Excellent bedside manner and very knowledgeable!" },
    { name: "Ananya M.", rating: 5, date: "1 week ago", comment: "Very clean hospital facility and minimal waiting time. Highly recommend for consultation." },
    { name: "Vikram P.", rating: 4.8, date: "2 weeks ago", comment: "Professional approach and transparent about treatment options and consultation fees." }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)", paddingBottom: "64px" }}>
      <Navbar />
      <div className="container" style={{ maxWidth: "1160px", paddingTop: "40px", paddingLeft: "24px", paddingRight: "24px" }}>
        <Link to="/doctors" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.85rem", fontWeight: 500, textDecoration: "none", transition: "color 150ms ease" }}>
          <ChevronLeft size={16} /> Back to Specialist Directory
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>
          {/* Left Column — Profile & Clinical Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Doctor Card */}
            <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
                <img src={doctor.profile_pic} alt={doctor.full_name} style={{ width: 112, height: 112, borderRadius: "var(--radius-lg)", objectFit: "cover", border: "1px solid var(--border)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginBottom: "6px" }}>
                    <h1 style={{ fontSize: "1.65rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{doctor.full_name}</h1>
                    <span className="badge badge-success" style={{ padding: "4px 10px", fontSize: "0.75rem", fontWeight: 600 }}><CheckCircle size={12} /> Verified Specialist</span>
                  </div>
                  <p style={{ color: "var(--brand-primary)", fontWeight: 600, fontSize: "1rem", marginBottom: "4px" }}>{doctor.specialization}</p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "16px" }}>{doctor.qualification}</p>
                  
                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--text-primary)" }}>{doctor.experience_years}+</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Years Exp.</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "#FF7A59" }}>{doctor.rating || "4.9"}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Patient Rating</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--brand-primary)" }}>{doctor.review_count || "48"}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Verified Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Tabs Navigation */}
            <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
              {["OVERVIEW", "EXPERIENCE & FACILITIES", "REVIEWS"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: "12px 20px", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: activeTab === tab ? "var(--brand-primary)" : "var(--text-secondary)", borderBottom: activeTab === tab ? "2px solid var(--brand-primary)" : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap", transition: "all 150ms ease" }}>
                  {tab === "OVERVIEW" ? "Clinical Overview" : tab === "EXPERIENCE & FACILITIES" ? "Experience & Facilities" : "Patient Reviews"}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "OVERVIEW" && (
              <>
                <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <h3 style={{ marginBottom: "12px", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Clinical Background</h3>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--text-secondary)" }}>{doctor.bio || "Dedicated healthcare specialist with extensive experience in outpatient consultation, clinical diagnostics, and comprehensive patient care."}</p>
                </div>

                <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <h3 style={{ marginBottom: "16px", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Practice Information</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {[
                      { label: "Affiliated Hospital", value: doctor.hospital?.name || "MediSlot Medical Center" },
                      { label: "Medical Department", value: doctor.department?.name || doctor.specialization || "General Healthcare" },
                      { label: "Spoken Languages", value: doctor.languages?.join(", ") || "English, Hindi, Regional" },
                      { label: "Practice City", value: `${doctor.hospital?.city || "Healthcare City"}, ${doctor.hospital?.state || ""}` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ padding: "14px 16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{label}</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Tab 2: Experience & Facilities */}
            {activeTab === "EXPERIENCE & FACILITIES" && (
              <>
                <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <h3 style={{ marginBottom: "16px", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Award size={18} color="var(--brand-primary)" /> Credentials & Education
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", paddingBottom: "14px", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: "var(--status-info-bg)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700 }}>MD</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>Doctor of Medicine • Specialized Clinical Practice</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{doctor.qualification || "All India Institute of Medical Sciences (AIIMS)"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: "var(--bg-muted)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700 }}>EXP</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{doctor.experience_years || 10}+ Years of Active Clinical Practice</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Senior Consultant & Outpatient Specialist at {doctor.hospital?.name || "MediSlot Medical Center"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <h3 style={{ marginBottom: "16px", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Building2 size={18} color="var(--brand-primary)" /> Clinic Facilities & Amenities
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {[
                      "Digital E-Prescriptions", "Wheelchair Accessibility", "On-site Diagnostic Lab",
                      "Pharmacy Support", "High-speed Patient Wi-Fi", "Dedicated Parking Area"
                    ].map((facility, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                        <Check size={16} color="var(--status-success)" /> {facility}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <h3 style={{ marginBottom: "16px", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={18} color="var(--brand-primary)" /> Weekly Clinical Schedule
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>Monday – Friday</span>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--brand-primary)" }}>09:00 AM – 06:00 PM</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>Saturday</span>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--brand-primary)" }}>09:00 AM – 02:00 PM</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-muted)" }}>Sunday</span>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-muted)" }}>Emergency / On-Call Only</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === "REVIEWS" && (
              <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Verified Patient Reviews</h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>Feedback from authenticated clinical appointments</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "var(--bg-base)", padding: "8px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                    <Star size={18} fill="#FF7A59" color="#FF7A59" />
                    <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>{doctor.rating || "4.9"}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>({doctor.review_count || "48"} reviews)</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {mockReviews.map((rev, idx) => (
                    <div key={idx} style={{ padding: "16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{rev.name}</div>
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

          {/* Right Column — Slot Booking Widget */}
          <div style={{ position: "sticky", top: "88px" }}>
            <div className="card card-body" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Request Consultation</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--brand-primary)", fontWeight: 600 }}>Subject to clinical acceptance</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Fee</span>
                  <div style={{ fontWeight: 800, fontSize: "1.35rem", color: "var(--brand-primary)", lineHeight: 1 }}>₹{doctor.consultation_fee}</div>
                </div>
              </div>

              {/* Date Selector */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Select Appointment Date</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
                  {dates.map(({ date, label, dayNum }) => (
                    <button key={date} onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                      style={{ padding: "8px 4px", borderRadius: "var(--radius-md)", border: `1px solid ${selectedDate === date ? "var(--brand-primary)" : "var(--border)"}`, backgroundColor: selectedDate === date ? "var(--brand-primary)" : "var(--bg-base)", cursor: "pointer", textAlign: "center", transition: "all 150ms ease" }}>
                      <div style={{ fontSize: "0.7rem", color: selectedDate === date ? "rgba(255,255,255,0.8)" : "var(--text-secondary)", fontWeight: 500 }}>{label}</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: selectedDate === date ? "white" : "var(--text-primary)" }}>{dayNum}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot Selector */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", justifyContent: "space-between" }}>
                  <span>Available Time Slots</span>
                  <span className="badge badge-info">{todaySlots.length} slots</span>
                </div>
                
                {todaySlots.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "28px 16px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border)", color: "var(--text-secondary)" }}>
                    <Clock size={22} color="var(--text-muted)" style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>No Slots Available</div>
                    <p style={{ fontSize: "0.8rem", marginTop: "4px" }}>All appointments for this date are booked. Please select another date above.</p>
                  </div>
                ) : (
                  <div className="slot-grid">
                    {todaySlots.map((slot) => (
                      <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                        className={`slot-btn ${selectedSlot?.id === slot.id ? "selected" : ""}`}>
                        {slot.start_time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Non-bold! Medium/Semi-bold 500/600 only */}
              <button onClick={handleBook} className="btn btn-cta btn-lg" style={{ width: "100%", padding: "14px", fontSize: "0.95rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                disabled={!selectedSlot}>
                <Calendar size={16} />
                {selectedSlot ? `Request ${selectedSlot.start_time} Consultation` : "Select a Time Slot to Request"}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "14px", padding: "8px", backgroundColor: "var(--bg-base)", borderRadius: "var(--radius-sm)", fontWeight: 500 }}>
                <ShieldCheck size={14} color="var(--brand-primary)" />
                <span>Subject to specialist review • Free cancellation up to 2 hours prior</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
