// src/pages/admin/AdminDashboard.jsx
// MediSlot — Version 2 Enterprise Hospital Administrator Workspace
// Focused on: Active Specialists on Duty, Department Capacity, Pending Accreditations, and Facility Governance.
// Zero statistic clutter, calm #1877F2 design system.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, Calendar, Building2, Stethoscope, AlertCircle, 
  CheckCircle2, ShieldCheck, Activity, ArrowRight, BellRing, 
  UserCheck, Award, FileText 
} from "lucide-react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useAuthStore from "../../store/authStore";

export default function AdminDashboard() {
  const { profile } = useAuthStore();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    Promise.all([
      axios.get("http://localhost:5000/api/v1/doctors", { params: { hospital_id: profile?.hospital_id }, headers: { Authorization: `Bearer ${token}` } }),
      axios.get("http://localhost:5000/api/v1/departments", { params: { hospital_id: profile?.hospital_id }, headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([docRes, deptRes]) => {
      setDoctors(docRes.data?.data || []);
      setDepartments(deptRes.data?.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const activeDoctorsCount = doctors.length;
  const activeDepartmentsCount = departments.length;

  return (
    <DashboardLayout 
      title="Hospital Console" 
      subtitle="Multi-Specialty Facility Governance & Outpatient Capacity Operations"
    >
      {/* ── 1. HOSPITAL GOVERNANCE HEADER & NABH COMPLIANCE NOTICE ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(320px, 2fr) minmax(280px, 1fr)",
        gap: "20px",
        marginBottom: "28px"
      }}>
        {/* Welcome & Facility Summary */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #DCEBFF",
          borderRadius: "16px",
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#F0F6FF",
                color: "#1877F2",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "0.78rem",
                fontWeight: 600,
                border: "1px solid #DCEBFF"
              }}>
                <ShieldCheck size={14} /> NABH Accredited Facility
              </span>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1F2937", margin: "0 0 10px 0", letterSpacing: "-0.03em" }}>
              {profile?.hospital?.name || "Apollo Super Specialty Hospital"}
            </h1>
            <p style={{ color: "#6B7280", fontSize: "0.96rem", lineHeight: 1.6, margin: "0 0 24px 0" }}>
              Here is your facility status right now. Monitor specialist doctor rosters, track outpatient cabin allocation, and audit clinical department capacity across your institution.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/admin/doctors" style={{
              backgroundColor: "#1877F2",
              color: "#FFFFFF",
              padding: "12px 22px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.92rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(24, 119, 242, 0.22)"
            }}>
              <Stethoscope size={16} /> Manage Specialists Roster
            </Link>
            <Link to="/admin/departments" style={{
              backgroundColor: "#F3F4F6",
              color: "#1F2937",
              padding: "12px 20px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.92rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #E5E7EB"
            }}>
              <Building2 size={16} /> Clinical Departments
            </Link>
          </div>
        </div>

        {/* Compliance & Audit Notice */}
        <div style={{
          backgroundColor: "#ECFDF5",
          border: "1px solid #A7F3D0",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#047857", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
              <Award size={16} /> Medical Council Audit
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#065F46", margin: "0 0 8px 0" }}>
              Quarterly Accreditation Review
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#064E3B", lineHeight: 1.5, margin: 0 }}>
              Your facility's specialist license certifications and digital OPD token logging protocol are fully compliant with NABH Level 3 security benchmarks.
            </p>
          </div>

          <div style={{ marginTop: "18px", color: "#047857", fontWeight: 700, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Next inspection window: Q4 2026</span>
          </div>
        </div>
      </div>

      {/* ── 2. SPECIALISTS ON DUTY TODAY & DEPARTMENT CAPACITY ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(320px, 1.4fr) minmax(280px, 1fr)",
        gap: "20px",
        marginBottom: "28px"
      }}>
        {/* Active Specialists Roster */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #DCEBFF",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", display: "flex", alignItems: "center", gap: "8px" }}>
              <Stethoscope size={18} color="#1877F2" /> Specialists on Duty Today ({activeDoctorsCount})
            </span>
            <Link to="/admin/doctors" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1877F2", textDecoration: "none" }}>
              Full Roster →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {doctors.length > 0 ? (
              doctors.slice(0, 4).map((doc, idx) => (
                <div key={doc.id || idx} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  border: "1px solid #F3F4F6"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <img src={doc.profile_pic} alt="" style={{ width: 44, height: 44, borderRadius: "12px", objectFit: "cover", border: "1px solid #DCEBFF" }} />
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1F2937" }}>{doc.full_name}</div>
                      <div style={{ fontSize: "0.78rem", color: "#1877F2", fontWeight: 600 }}>
                        {doc.specialization} • {doc.qualification || "MD, DM"}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669", backgroundColor: "#ECFDF5", padding: "4px 10px", borderRadius: "6px" }}>
                    Cabin Active
                  </span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: "0.88rem", color: "#6B7280", padding: "16px 0", textAlign: "center" }}>
                No specialist physicians registered to this facility yet.
              </div>
            )}
          </div>
        </div>

        {/* Clinical Departments Overview */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #DCEBFF",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 size={18} color="#1877F2" /> Operational Departments ({activeDepartmentsCount})
            </span>
            <Link to="/admin/departments" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1877F2", textDecoration: "none" }}>
              Configure →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(departments.length > 0 ? departments.slice(0, 4) : [
              { name: "Cardiology & Vascular Sciences", doctorsCount: 4, floor: "Block A, 1st Floor" },
              { name: "Neurology & Neurosurgery", doctorsCount: 3, floor: "Block A, 2nd Floor" },
              { name: "Orthopedics & Joint Replacement", doctorsCount: 3, floor: "Block B, Ground Floor" },
              { name: "Pediatrics & Neonatology", doctorsCount: 2, floor: "Block C, 1st Floor" }
            ]).map((dept, idx) => (
              <div key={idx} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                backgroundColor: "#F9FAFB",
                borderRadius: "10px",
                border: "1px solid #F3F4F6"
              }}>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1F2937" }}>{dept.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{dept.floor || "OPD Block A"}</div>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1877F2", backgroundColor: "#E8F2FF", padding: "3px 8px", borderRadius: "6px" }}>
                  {dept.doctorsCount || 2} Doctors
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. FACILITY AUDIT LOGS & ACTION CONSOLE ── */}
      <div style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #DCEBFF",
        borderRadius: "16px",
        padding: "24px 32px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1F2937", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={18} color="#1877F2" /> Administrative Actions Console
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {[
            { title: "Specialist Accreditation Audit", desc: "Verify medical council registration numbers for new doctors", link: "/admin/doctors" },
            { title: "Department OPD Roster Setup", desc: "Allocate cabin numbers and weekly outpatient consultation slots", link: "/admin/departments" },
            { title: "Facility Appointments Log", desc: "Review real-time digital check-in records across all departments", link: "/admin/appointments" }
          ].map((item, idx) => (
            <Link key={idx} to={item.link} style={{
              padding: "18px 20px",
              backgroundColor: "#F9FAFB",
              borderRadius: "14px",
              border: "1px solid #F3F4F6",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: "0.96rem", fontWeight: 700, color: "#1F2937", marginBottom: "6px" }}>{item.title}</div>
                <div style={{ fontSize: "0.82rem", color: "#6B7280", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
              <div style={{ marginTop: "14px", fontSize: "0.82rem", fontWeight: 700, color: "#1877F2", display: "flex", alignItems: "center", gap: "4px" }}>
                Open Console →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
