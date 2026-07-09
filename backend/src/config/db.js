// src/config/db.js
// In-memory database for demo MVP
// Replace with PostgreSQL + Prisma for production

const { v4: uuidv4 } = require("uuid");

// ─── In-Memory Data Store ─────────────────────────────────────────────────────
const db = {
  users: [],
  patients: [],
  doctors: [],
  hospitals: [],
  departments: [],
  appointments: [],
  slots: [],
  schedules: [],
  reviews: [],
  notifications: [],
  otps: [], // { email, otp, expiresAt }
};

// ─── Seed Demo Data ───────────────────────────────────────────────────────────
const bcrypt = require("bcryptjs");

async function seedDatabase() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ── Hospitals ──────────────────────────────────────────────────────────────
  const hospitals = [
    {
      id: "hosp-001",
      name: "Apollo Hospitals",
      slug: "apollo-hospitals",
      description: "Apollo Hospitals is one of India's premier healthcare institutions offering world-class medical care with cutting-edge technology and expert specialists.",
      address: "21 Greams Lane, Off Greams Road",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600006",
      phone: "+91-44-28296000",
      email: "info@apollohospitals.com",
      website: "https://apollohospitals.com",
      logo_url: "https://ui-avatars.com/api/?name=Apollo+Hospitals&background=0EA5E9&color=fff&size=200",
      cover_image_url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800",
      is_verified: true,
      rating: 4.8,
      latitude: 13.0614,
      longitude: 80.2444,
      specialties: ["Cardiology", "Oncology", "Neurology", "Orthopedics", "Nephrology"],
      beds: 700,
      established: 1983,
      created_at: new Date().toISOString(),
    },
    {
      id: "hosp-002",
      name: "Fortis Healthcare",
      slug: "fortis-healthcare",
      description: "Fortis Healthcare is a leading integrated healthcare delivery service provider in India, offering comprehensive medical services across multiple specialties.",
      address: "Mulund Goregaon Link Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400078",
      phone: "+91-22-67971000",
      email: "info@fortishealthcare.com",
      website: "https://fortishealthcare.com",
      logo_url: "https://ui-avatars.com/api/?name=Fortis+Healthcare&background=10B981&color=fff&size=200",
      cover_image_url: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
      is_verified: true,
      rating: 4.7,
      latitude: 19.1723,
      longitude: 72.9456,
      specialties: ["Cardiology", "Gastroenterology", "Urology", "Oncology"],
      beds: 400,
      established: 1996,
      created_at: new Date().toISOString(),
    },
    {
      id: "hosp-003",
      name: "AIIMS New Delhi",
      slug: "aiims-new-delhi",
      description: "All India Institute of Medical Sciences is the premier medical institution in India, offering the highest standards of medical care, education and research.",
      address: "Sri Aurobindo Marg, Ansari Nagar",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110029",
      phone: "+91-11-26588500",
      email: "info@aiims.edu",
      website: "https://aiims.edu",
      logo_url: "https://ui-avatars.com/api/?name=AIIMS+Delhi&background=8B5CF6&color=fff&size=200",
      cover_image_url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
      is_verified: true,
      rating: 4.9,
      latitude: 28.5672,
      longitude: 77.2100,
      specialties: ["All Specialties", "Research", "Trauma Care"],
      beds: 2500,
      established: 1956,
      created_at: new Date().toISOString(),
    },
    {
      id: "hosp-004",
      name: "Manipal Hospitals",
      slug: "manipal-hospitals",
      description: "Manipal Hospitals is among the top hospital chains in India, with a strong presence across major cities, providing excellent healthcare services.",
      address: "98 HAL Airport Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560017",
      phone: "+91-80-25024444",
      email: "info@manipalhospitals.com",
      website: "https://manipalhospitals.com",
      logo_url: "https://ui-avatars.com/api/?name=Manipal+Hospitals&background=F59E0B&color=fff&size=200",
      cover_image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
      is_verified: true,
      rating: 4.6,
      latitude: 12.9592,
      longitude: 77.6494,
      specialties: ["Cardiology", "Oncology", "Transplants", "Neurosurgery"],
      beds: 600,
      established: 1991,
      created_at: new Date().toISOString(),
    },
    {
      id: "hosp-005",
      name: "Max Super Speciality Hospital",
      slug: "max-super-speciality",
      description: "Max Hospital is a chain of multi-specialty hospitals offering world-class healthcare with state-of-the-art technology and renowned medical expertise.",
      address: "1 Press Enclave Road, Saket",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110017",
      phone: "+91-11-26515050",
      email: "info@maxhealthcare.in",
      website: "https://maxhealthcare.in",
      logo_url: "https://ui-avatars.com/api/?name=Max+Hospital&background=EF4444&color=fff&size=200",
      cover_image_url: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800",
      is_verified: true,
      rating: 4.7,
      latitude: 28.5245,
      longitude: 77.2066,
      specialties: ["Cardiology", "Oncology", "Orthopedics", "Pediatrics"],
      beds: 500,
      established: 2000,
      created_at: new Date().toISOString(),
    },
  ];

  // ── Departments ────────────────────────────────────────────────────────────
  const departments = [
    { id: "dept-001", hospital_id: "hosp-001", name: "Cardiology", description: "Heart & cardiovascular care", icon: "heart", is_active: true },
    { id: "dept-002", hospital_id: "hosp-001", name: "Neurology", description: "Brain & nervous system care", icon: "brain", is_active: true },
    { id: "dept-003", hospital_id: "hosp-001", name: "Orthopedics", description: "Bone, joint & muscle care", icon: "bone", is_active: true },
    { id: "dept-004", hospital_id: "hosp-001", name: "Oncology", description: "Cancer diagnosis & treatment", icon: "ribbon", is_active: true },
    { id: "dept-005", hospital_id: "hosp-002", name: "Cardiology", description: "Heart & cardiovascular care", icon: "heart", is_active: true },
    { id: "dept-006", hospital_id: "hosp-002", name: "Gastroenterology", description: "Digestive system disorders", icon: "activity", is_active: true },
    { id: "dept-007", hospital_id: "hosp-003", name: "General Medicine", description: "Primary healthcare & diagnosis", icon: "stethoscope", is_active: true },
    { id: "dept-008", hospital_id: "hosp-003", name: "Pediatrics", description: "Child health & development", icon: "baby", is_active: true },
    { id: "dept-009", hospital_id: "hosp-004", name: "Oncology", description: "Cancer diagnosis & treatment", icon: "ribbon", is_active: true },
    { id: "dept-010", hospital_id: "hosp-004", name: "Neurosurgery", description: "Surgical treatment of neurological disorders", icon: "brain", is_active: true },
    { id: "dept-011", hospital_id: "hosp-005", name: "Cardiology", description: "Heart & cardiovascular care", icon: "heart", is_active: true },
    { id: "dept-012", hospital_id: "hosp-005", name: "Orthopedics", description: "Bone, joint & muscle care", icon: "bone", is_active: true },
  ];

  // ── Users (doctors & admins) ───────────────────────────────────────────────
  const demoPatientUser = {
    id: "user-demo-patient",
    email: "demo@patient.com",
    password_hash: hashedPassword,
    role: "PATIENT",
    is_verified: true,
    is_active: true,
    created_at: new Date().toISOString(),
  };
  const demoPatient = {
    id: "pat-demo-001",
    user_id: "user-demo-patient",
    full_name: "Demo Patient",
    phone: "+91-9000000000",
    date_of_birth: "1995-06-15",
    gender: "Male",
    blood_group: "O+",
    address: "123 Demo Street, Mumbai, Maharashtra",
    profile_pic: "https://ui-avatars.com/api/?name=Demo+Patient&background=2563EB&color=fff&size=200",
    emergency_contact: null,
    created_at: new Date().toISOString(),
  };

  const doctorUsers = [
    { id: "user-d001", email: "dr.sharma@medislot.com", password_hash: hashedPassword, role: "DOCTOR", is_verified: true, is_active: true, created_at: new Date().toISOString() },
    { id: "user-d002", email: "dr.patel@medislot.com", password_hash: hashedPassword, role: "DOCTOR", is_verified: true, is_active: true, created_at: new Date().toISOString() },
    { id: "user-d003", email: "dr.iyer@medislot.com", password_hash: hashedPassword, role: "DOCTOR", is_verified: true, is_active: true, created_at: new Date().toISOString() },
    { id: "user-d004", email: "dr.khan@medislot.com", password_hash: hashedPassword, role: "DOCTOR", is_verified: true, is_active: true, created_at: new Date().toISOString() },
    { id: "user-d005", email: "dr.gupta@medislot.com", password_hash: hashedPassword, role: "DOCTOR", is_verified: true, is_active: true, created_at: new Date().toISOString() },
    { id: "user-d006", email: "dr.mehta@medislot.com", password_hash: hashedPassword, role: "DOCTOR", is_verified: true, is_active: true, created_at: new Date().toISOString() },
  ];

  const adminUsers = [
    { id: "user-a001", email: "admin@apollo.com", password_hash: hashedPassword, role: "HOSPITAL_ADMIN", is_verified: true, is_active: true, created_at: new Date().toISOString() },
    { id: "user-a002", email: "admin@fortis.com", password_hash: hashedPassword, role: "HOSPITAL_ADMIN", is_verified: true, is_active: true, created_at: new Date().toISOString() },
  ];

  // ── Doctors ────────────────────────────────────────────────────────────────
  const doctors = [
    {
      id: "doc-001", user_id: "user-d001", hospital_id: "hosp-001", department_id: "dept-001",
      full_name: "Dr. Rajesh Sharma", phone: "+91-9876543210",
      specialization: "Interventional Cardiologist", qualification: "MBBS, MD, DM (Cardiology)",
      experience_years: 18, bio: "Dr. Sharma is a renowned interventional cardiologist with 18+ years of experience. He has performed over 5000 cardiac procedures and is known for his expertise in complex angioplasties and structural heart disease.",
      profile_pic: "https://ui-avatars.com/api/?name=Rajesh+Sharma&background=2563EB&color=fff&size=200",
      consultation_fee: 1500, languages: ["English", "Hindi", "Tamil"],
      rating: 4.9, is_available: true, created_at: new Date().toISOString(),
    },
    {
      id: "doc-002", user_id: "user-d002", hospital_id: "hosp-001", department_id: "dept-002",
      full_name: "Dr. Priya Patel", phone: "+91-9876543211",
      specialization: "Senior Neurologist", qualification: "MBBS, MD, DM (Neurology)",
      experience_years: 14, bio: "Dr. Patel specializes in epilepsy, stroke management, and movement disorders. She is a compassionate doctor known for her patient-centric approach and use of latest neurological diagnostics.",
      profile_pic: "https://ui-avatars.com/api/?name=Priya+Patel&background=EC4899&color=fff&size=200",
      consultation_fee: 1200, languages: ["English", "Hindi", "Gujarati"],
      rating: 4.8, is_available: true, created_at: new Date().toISOString(),
    },
    {
      id: "doc-003", user_id: "user-d003", hospital_id: "hosp-002", department_id: "dept-005",
      full_name: "Dr. Suresh Iyer", phone: "+91-9876543212",
      specialization: "Cardiac Surgeon", qualification: "MBBS, MS, MCh (Cardiothoracic Surgery)",
      experience_years: 22, bio: "Dr. Iyer is one of India's most experienced cardiac surgeons with over 4000 open heart surgeries. He specializes in bypass surgery, valve replacements, and pediatric cardiac surgery.",
      profile_pic: "https://ui-avatars.com/api/?name=Suresh+Iyer&background=059669&color=fff&size=200",
      consultation_fee: 2000, languages: ["English", "Hindi", "Tamil", "Telugu"],
      rating: 4.9, is_available: true, created_at: new Date().toISOString(),
    },
    {
      id: "doc-004", user_id: "user-d004", hospital_id: "hosp-003", department_id: "dept-007",
      full_name: "Dr. Ayesha Khan", phone: "+91-9876543213",
      specialization: "General Physician", qualification: "MBBS, MD (Internal Medicine)",
      experience_years: 10, bio: "Dr. Khan is a general physician with extensive experience in managing chronic diseases, infectious diseases, and preventive healthcare. She is known for her thorough diagnostic approach.",
      profile_pic: "https://ui-avatars.com/api/?name=Ayesha+Khan&background=7C3AED&color=fff&size=200",
      consultation_fee: 800, languages: ["English", "Hindi", "Urdu"],
      rating: 4.7, is_available: true, created_at: new Date().toISOString(),
    },
    {
      id: "doc-005", user_id: "user-d005", hospital_id: "hosp-004", department_id: "dept-009",
      full_name: "Dr. Vikram Gupta", phone: "+91-9876543214",
      specialization: "Surgical Oncologist", qualification: "MBBS, MS, MCh (Oncology)",
      experience_years: 16, bio: "Dr. Gupta is a leading surgical oncologist specializing in GI cancers, breast cancer, and head & neck tumors. He is proficient in minimally invasive and robotic-assisted cancer surgery.",
      profile_pic: "https://ui-avatars.com/api/?name=Vikram+Gupta&background=DC2626&color=fff&size=200",
      consultation_fee: 1800, languages: ["English", "Hindi"],
      rating: 4.8, is_available: true, created_at: new Date().toISOString(),
    },
    {
      id: "doc-006", user_id: "user-d006", hospital_id: "hosp-005", department_id: "dept-011",
      full_name: "Dr. Anita Mehta", phone: "+91-9876543215",
      specialization: "Consultant Cardiologist", qualification: "MBBS, MD, FESC",
      experience_years: 12, bio: "Dr. Mehta is a highly skilled cardiologist with expertise in echocardiography, cardiac stress testing, and management of heart failure. She provides personalized cardiac care to patients of all ages.",
      profile_pic: "https://ui-avatars.com/api/?name=Anita+Mehta&background=D97706&color=fff&size=200",
      consultation_fee: 1300, languages: ["English", "Hindi", "Marathi"],
      rating: 4.6, is_available: true, created_at: new Date().toISOString(),
    },
  ];

  // ── Generate Slots for next 7 days ─────────────────────────────────────────
  const slots = [];
  const today = new Date();
  
  doctors.forEach((doctor) => {
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + dayOffset);
      const dateStr = slotDate.toISOString().split("T")[0];
      
      // Morning slots: 9 AM - 12 PM (30 min each)
      const morningTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
      // Evening slots: 4 PM - 6 PM (30 min each)
      const eveningTimes = ["16:00", "16:30", "17:00", "17:30"];
      
      const allTimes = [...morningTimes, ...eveningTimes];
      
      allTimes.forEach((time) => {
        const [hour, min] = time.split(":").map(Number);
        const endHour = min === 30 ? hour + 1 : hour;
        const endMin = min === 30 ? "00" : "30";
        const endTime = `${String(endHour).padStart(2, "0")}:${endMin}`;
        
        // Randomly mark some as booked for realism
        const isBooked = Math.random() < 0.25;
        
        slots.push({
          id: uuidv4(),
          doctor_id: doctor.id,
          slot_date: dateStr,
          start_time: time,
          end_time: endTime,
          status: isBooked ? "BOOKED" : "AVAILABLE",
          created_at: new Date().toISOString(),
        });
      });
    }
  });

  // ── Admin hospital mappings ───────────────────────────────────────────────
  const hospitalAdmins = [
    { id: "ha-001", user_id: "user-a001", hospital_id: "hosp-001", full_name: "Admin Apollo", created_at: new Date().toISOString() },
    { id: "ha-002", user_id: "user-a002", hospital_id: "hosp-002", full_name: "Admin Fortis", created_at: new Date().toISOString() },
  ];

  db.hospitals = hospitals;
  db.departments = departments;
  db.users = [...doctorUsers, ...adminUsers, demoPatientUser];
  db.patients = [demoPatient];
  db.doctors = doctors;
  db.slots = slots;
  db.hospitalAdmins = hospitalAdmins;

  console.log(`✅ Database seeded: ${hospitals.length} hospitals, ${doctors.length} doctors, ${slots.length} slots`);
}

module.exports = { db, seedDatabase };
