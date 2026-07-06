// src/pages/DoctorsPage.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Star, MapPin, Clock, Filter, ChevronRight, Stethoscope, Calendar, Award, Heart, RefreshCw } from "lucide-react";
import { doctorsAPI } from "../services/api";
import Navbar from "../components/layout/Navbar";
import toast from "react-hot-toast";

const specializations = ["All", "Cardiology", "Neurology", "Orthopedics", "Oncology", "Pediatrics", "General Medicine", "Gastroenterology", "Neurosurgery"];

export default function DoctorsPage() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState(searchParams.get("specialization") || "");
  const [pagination, setPagination] = useState({});

  // Multi-parameter filter state
  const [minExp, setMinExp] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("medislot_fav_doctors") || "[]");
    } catch { return []; }
  });

  const toggleFavorite = (docId, e) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (favorites.includes(docId)) {
      updated = favorites.filter(id => id !== docId);
      toast.success("Removed from saved doctors");
    } else {
      updated = [...favorites, docId];
      toast.success("Added to saved doctors");
    }
    setFavorites(updated);
    localStorage.setItem("medislot_fav_doctors", JSON.stringify(updated));
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorsAPI.getAll({ search, specialization: spec, limit: 50 });
      setDoctors(res.data.data);
      setPagination(res.data.pagination || {});
    } catch { setDoctors([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDoctors(); }, [search, spec]);

  // Client-side multi-parameter filtering
  const filteredDoctors = doctors.filter((doc) => {
    if (showFavsOnly && !favorites.includes(doc.id)) return false;
    if (minExp && (doc.experience_years || 0) < Number(minExp)) return false;
    if (genderFilter && doc.gender && doc.gender !== genderFilter) return false;
    if (maxFee && (doc.consultation_fee || 0) > Number(maxFee)) return false;
    if (langFilter && !doc.languages?.some(l => l.toLowerCase().includes(langFilter.toLowerCase()))) return false;
    return true;
  });

  const resetFilters = () => {
    setMinExp("");
    setGenderFilter("");
    setMaxFee("");
    setLangFilter("");
    setShowFavsOnly(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)" }}>
      <Navbar />
      
      {/* Hero Section (Solid Medical Blue Background, No Gradients) */}
      <div style={{ backgroundColor: "var(--bg-dark)", padding: "48px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "12px", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
            <Award size={14} /> Verified Specialist Directory
          </div>
          <h1 style={{ color: "white", marginBottom: "8px", fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Find Specialized Doctors</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "24px", fontSize: "0.95rem", fontWeight: 400 }}>
            Search from 2,500+ verified clinical specialists across top accredited hospitals
          </p>
          <div style={{ background: "white", padding: "6px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", display: "flex", gap: "10px", alignItems: "center" }}>
            <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: "12px" }} />
            <input style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "0.9rem", fontFamily: "inherit", padding: "8px 0", fontWeight: 500 }}
              placeholder="Search by specialist name, qualification, or department..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 24px 64px" }}>
        {/* Specialization Filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
          {specializations.map((s) => (
            <button key={s} onClick={() => setSpec(s === "All" ? "" : s)}
              className={`btn btn-sm ${(spec === s || (s === "All" && !spec)) ? "btn-primary" : "btn-secondary"}`}
              style={{ flexShrink: 0, borderRadius: "var(--radius-full)", fontWeight: 600 }}>
              {s}
            </button>
          ))}
        </div>

        {/* Multi-Parameter Advanced Search Filters Bar */}
        <div className="card card-body" style={{ marginBottom: "24px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginRight: "8px" }}>
                <Filter size={16} color="var(--brand-primary)" /> Filters:
              </div>

              {/* Experience */}
              <select className="input-field" style={{ width: "auto", padding: "8px 12px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", height: "36px" }}
                value={minExp} onChange={(e) => setMinExp(e.target.value)}>
                <option value="">Experience: Any</option>
                <option value="5">5+ Years Exp</option>
                <option value="10">10+ Years Exp</option>
                <option value="15">15+ Years Exp</option>
              </select>

              {/* Consultation Fee */}
              <select className="input-field" style={{ width: "auto", padding: "8px 12px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", height: "36px" }}
                value={maxFee} onChange={(e) => setMaxFee(e.target.value)}>
                <option value="">Fee: Any</option>
                <option value="500">Under ₹500</option>
                <option value="1000">Under ₹1000</option>
                <option value="1500">Under ₹1500</option>
              </select>

              {/* Gender */}
              <select className="input-field" style={{ width: "auto", padding: "8px 12px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", height: "36px" }}
                value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                <option value="">Gender: All</option>
                <option value="MALE">Male Doctor</option>
                <option value="FEMALE">Female Doctor</option>
              </select>

              {/* Languages */}
              <select className="input-field" style={{ width: "auto", padding: "8px 12px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", height: "36px" }}
                value={langFilter} onChange={(e) => setLangFilter(e.target.value)}>
                <option value="">Language: Any</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>

              {/* Favorites Toggle Button */}
              <button onClick={() => setShowFavsOnly(!showFavsOnly)}
                className={`btn btn-sm ${showFavsOnly ? "btn-primary" : "btn-secondary"}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "36px", fontWeight: 600 }}>
                <Heart size={14} fill={showFavsOnly ? "white" : "none"} color={showFavsOnly ? "white" : "#FF7A59"} />
                <span>Saved ({favorites.length})</span>
              </button>
            </div>

            {(minExp || genderFilter || maxFee || langFilter || showFavsOnly) && (
              <button onClick={resetFilters} className="btn btn-secondary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600, height: "36px" }}>
                <RefreshCw size={14} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div style={{ marginBottom: "20px", color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600 }}>
          {!loading && `${filteredDoctors.length} verified specialists matching your selection`}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div className="skeleton" style={{ width: "64px", height: "64px", borderRadius: "50%", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: "18px", marginBottom: "8px", width: "70%" }} />
                    <div className="skeleton" style={{ height: "14px", width: "50%" }} />
                  </div>
                </div>
                <div className="skeleton" style={{ height: "14px", marginBottom: "8px", width: "90%" }} />
                <div className="skeleton" style={{ height: "36px", width: "100%", marginTop: "16px" }} />
              </div>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Stethoscope size={28} /></div>
            <div className="empty-state-title">No Doctors Found</div>
            <p className="empty-state-desc">We couldn't find any clinical specialists matching your search or filter selection.</p>
            {(minExp || genderFilter || maxFee || langFilter || showFavsOnly) && (
              <button onClick={resetFilters} className="btn btn-primary btn-sm" style={{ marginTop: "16px", fontWeight: 600 }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {filteredDoctors.map((doc) => {
              const isFav = favorites.includes(doc.id);
              return (
                <Link key={doc.id} to={`/doctors/${doc.id}`} style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
                  <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "var(--bg-card)", transition: "all 150ms ease", position: "relative" }}>
                    {/* Favorite Bookmark Button */}
                    <button onClick={(e) => toggleFavorite(doc.id, e)}
                      style={{ position: "absolute", top: 16, right: 16, width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border)", backgroundColor: isFav ? "rgba(255, 122, 89, 0.1)" : "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 150ms ease", zIndex: 5 }}
                      title={isFav ? "Remove from saved doctors" : "Save doctor"}>
                      <Heart size={16} fill={isFav ? "#FF7A59" : "none"} color="#FF7A59" />
                    </button>

                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "16px", paddingRight: "36px" }}>
                      <img src={doc.profile_pic} alt={doc.full_name} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid var(--border)" }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "2px", color: "var(--text-primary)" }}>{doc.full_name}</h4>
                        <p style={{ fontSize: "0.82rem", color: "var(--brand-primary)", fontWeight: 600, marginBottom: "4px" }}>{doc.specialization}</p>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{doc.qualification}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                          <Star size={14} color="#FF7A59" fill="#FF7A59" />
                          <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>{doc.rating || "4.9"}</span>
                          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>• {doc.experience_years} yrs exp</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px", flex: 1 }}>
                      {doc.hospital && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: "12px", fontWeight: 500 }}>
                          <MapPin size={13} color="var(--brand-primary)" /> {doc.hospital.name}, {doc.hospital.city}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {doc.languages?.map((l) => <span key={l} className="badge badge-muted" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{l}</span>)}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
                      <div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Consultation Fee</div>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.05rem" }}>₹{doc.consultation_fee}</div>
                      </div>
                      <Link to={`/doctors/${doc.id}`} className="btn btn-cta btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600 }} onClick={(e) => e.stopPropagation()}>
                        <Calendar size={14} /> Book Appointment
                      </Link>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
