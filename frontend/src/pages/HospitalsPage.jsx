// src/pages/HospitalsPage.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Star, ChevronRight, Building2, Users, Award, Filter, Heart, RefreshCw, Activity, Stethoscope } from "lucide-react";
import { hospitalsAPI } from "../services/api";
import Navbar from "../components/layout/Navbar";
import toast from "react-hot-toast";

export default function HospitalsPage() {
  const [searchParams] = useSearchParams();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState("");
  const [pagination, setPagination] = useState({});

  // Multi-parameter filter state
  const [minDoctors, setMinDoctors] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [minRating, setMinRating] = useState("");
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("medislot_fav_hospitals") || "[]");
    } catch { return []; }
  });

  const toggleFavorite = (hospId, e) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (favorites.includes(hospId)) {
      updated = favorites.filter(id => id !== hospId);
      toast.success("Removed from saved facilities");
    } else {
      updated = [...favorites, hospId];
      toast.success("Added to saved facilities");
    }
    setFavorites(updated);
    localStorage.setItem("medislot_fav_hospitals", JSON.stringify(updated));
  };

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const res = await hospitalsAPI.getAll({ search, city, limit: 50 });
      setHospitals(res.data.data);
      setPagination(res.data.pagination || {});
    } catch { setHospitals([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHospitals(); }, [search, city]);

  const cities = ["All Cities", "Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata", "Pune"];

  // Client-side multi-parameter filtering
  const filteredHospitals = hospitals.filter((h) => {
    if (showFavsOnly && !favorites.includes(h.id)) return false;
    if (minDoctors && (h.doctor_count || 0) < Number(minDoctors)) return false;
    if (minBeds && (h.beds || 0) < Number(minBeds)) return false;
    if (minRating && (h.rating || 0) < Number(minRating)) return false;
    return true;
  });

  const resetFilters = () => {
    setMinDoctors("");
    setMinBeds("");
    setMinRating("");
    setShowFavsOnly(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)" }}>
      <Navbar />

      {/* Hero Section (Solid Medical Blue Background, No Gradients) */}
      <div style={{ backgroundColor: "var(--bg-dark)", padding: "48px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "12px", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
            <Award size={14} /> Accredited Medical Network
          </div>
          <h1 style={{ color: "white", marginBottom: "8px", fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Find Accredited Hospitals</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "24px", fontSize: "0.95rem", fontWeight: 400 }}>
            Discover top-rated healthcare facilities with verified clinical departments and instant slot booking
          </p>
          <div style={{ background: "white", padding: "6px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", display: "flex", gap: "10px", alignItems: "center" }}>
            <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: "12px" }} />
            <input
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "0.9rem", fontFamily: "inherit", padding: "8px 0", fontWeight: 500 }}
              placeholder="Search hospitals by name, city, or medical specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 24px 64px" }}>
        {/* City Filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
          {cities.map((c) => (
            <button key={c} onClick={() => setCity(c === "All Cities" ? "" : c)}
              className={`btn btn-sm ${(city === c || (c === "All Cities" && !city)) ? "btn-primary" : "btn-secondary"}`}
              style={{ flexShrink: 0, borderRadius: "var(--radius-full)", fontWeight: 600 }}>
              {c}
            </button>
          ))}
        </div>

        {/* Multi-Parameter Advanced Search Filters Bar */}
        <div className="card card-body" style={{ marginBottom: "24px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justify: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginRight: "8px" }}>
                <Filter size={16} color="var(--brand-primary)" /> Filters:
              </div>

              {/* Specialist Count */}
              <select className="input-field" style={{ width: "auto", padding: "8px 12px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", height: "36px" }}
                value={minDoctors} onChange={(e) => setMinDoctors(e.target.value)}>
                <option value="">Specialists: Any</option>
                <option value="5">5+ Specialists</option>
                <option value="10">10+ Specialists</option>
                <option value="20">20+ Specialists</option>
              </select>

              {/* Inpatient Beds */}
              <select className="input-field" style={{ width: "auto", padding: "8px 12px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", height: "36px" }}
                value={minBeds} onChange={(e) => setMinBeds(e.target.value)}>
                <option value="">Beds: Any</option>
                <option value="50">50+ Beds</option>
                <option value="100">100+ Beds</option>
                <option value="250">250+ Beds</option>
              </select>

              {/* Minimum Rating */}
              <select className="input-field" style={{ width: "auto", padding: "8px 12px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", height: "36px" }}
                value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                <option value="">Rating: Any</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
              </select>

              {/* Favorites Toggle Button */}
              <button onClick={() => setShowFavsOnly(!showFavsOnly)}
                className={`btn btn-sm ${showFavsOnly ? "btn-primary" : "btn-secondary"}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "36px", fontWeight: 600 }}>
                <Heart size={14} fill={showFavsOnly ? "white" : "none"} color={showFavsOnly ? "white" : "#FF7A59"} />
                <span>Saved ({favorites.length})</span>
              </button>
            </div>

            {(minDoctors || minBeds || minRating || showFavsOnly) && (
              <button onClick={resetFilters} className="btn btn-secondary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600, height: "36px" }}>
                <RefreshCw size={14} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            {loading ? "Searching clinical facilities..." : `${filteredHospitals.length} accredited hospitals matching your selection`}
          </h3>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card" style={{ padding: 0 }}>
                <div className="skeleton" style={{ height: "160px", borderRadius: 0 }} />
                <div style={{ padding: "20px" }}>
                  <div className="skeleton" style={{ height: "18px", marginBottom: "10px", width: "80%" }} />
                  <div className="skeleton" style={{ height: "14px", width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Building2 size={28} /></div>
            <div className="empty-state-title">No Hospitals Found</div>
            <p className="empty-state-desc">We couldn't find any facilities matching your search criteria or city filter.</p>
            {(minDoctors || minBeds || minRating || showFavsOnly) && (
              <button onClick={resetFilters} className="btn btn-primary btn-sm" style={{ marginTop: "16px", fontWeight: 600 }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {filteredHospitals.map((h) => {
              const isFav = favorites.includes(h.id);
              return (
                <Link key={h.id} to={`/hospitals/${h.slug}`} style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
                  <div className="card" style={{ padding: 0, display: "flex", flexDirection: "column", width: "100%", backgroundColor: "var(--bg-card)", transition: "all 150ms ease", position: "relative" }}>
                    <div style={{ height: "160px", position: "relative", overflow: "hidden", backgroundColor: "var(--bg-muted)" }}>
                      <img src={h.cover_image_url} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 300ms ease" }}
                        onMouseOver={e => e.target.style.transform = "scale(1.03)"}
                        onMouseOut={e => e.target.style.transform = "scale(1)"}
                      />
                      {/* Medical Blue overlay instead of gradient! */}
                      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(11, 46, 79, 0.25)" }} />
                      
                      {/* Favorite Bookmark Button */}
                      <button onClick={(e) => toggleFavorite(h.id, e)}
                        style={{ position: "absolute", top: 12, left: 12, width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: isFav ? "rgba(255, 122, 89, 0.9)" : "rgba(11, 46, 79, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 150ms ease", zIndex: 5 }}
                        title={isFav ? "Remove from saved facilities" : "Save facility"}>
                        <Heart size={15} fill={isFav ? "white" : "none"} color="white" />
                      </button>

                      {h.is_verified && (
                        <div style={{ position: "absolute", top: 12, right: 12, backgroundColor: "var(--status-success)", color: "white", borderRadius: "var(--radius-full)", padding: "4px 10px", display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", fontWeight: 600 }}>
                          <Award size={12} /> Verified
                        </div>
                      )}
                    </div>

                    <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
                        <img src={h.logo_url} alt="logo" style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", objectFit: "cover", border: "1px solid var(--border)", flexShrink: 0, backgroundColor: "white" }} />
                        <div>
                          <h4 style={{ color: "var(--text-primary)", marginBottom: "2px", fontSize: "1rem", fontWeight: 700 }}>{h.name}</h4>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 500 }}>
                            <MapPin size={13} color="var(--brand-primary)" /> {h.city}, {h.state}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
                        {h.description}
                      </p>

                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                        {h.specialties?.slice(0, 3).map((s) => (
                          <span key={s} className="badge badge-info" style={{ fontWeight: 600 }}>{s}</span>
                        ))}
                        {h.specialties?.length > 3 && <span className="badge badge-muted" style={{ fontWeight: 600 }}>+{h.specialties.length - 3}</span>}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", gap: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Star size={14} color="#FF7A59" fill="#FF7A59" />
                            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{h.rating || "4.8"}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600 }}>
                            <Users size={13} /> {h.doctor_count} Doctors
                          </div>
                        </div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--brand-primary)", fontWeight: 600, fontSize: "0.85rem" }}>
                          Explore <ChevronRight size={15} />
                        </span>
                      </div>
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
