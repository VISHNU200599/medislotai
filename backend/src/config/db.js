// src/config/db.js
// MediSlot — MongoDB Atlas Seeder & Database Utilities
// Purged all legacy PostgreSQL references. Runs exclusively on MongoDB Atlas.

const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const {
  User,
  Patient,
  Doctor,
  Hospital,
  Department,
  Appointment,
  AmbulanceRequest,
  Notification,
  MedicalRecord,
} = require("../models");

/**
 * Seeds MongoDB Atlas database with Hospitals, Departments, and Doctors if empty.
 */
async function seedDatabase() {
  try {
    const hospCount = await Hospital.countDocuments();
    if (hospCount > 0) {
      console.log("⚡ MongoDB Atlas already contains seeded Hospitals and Doctors. Skipping seed.");
      return;
    }

    console.log("🌱 Seeding MongoDB Atlas collections with initial accredited hospitals, departments, and doctors...");

    // ─── 1. Seed Hospitals ──────────────────────────────────────────────────────
    const hospitalsData = [
      {
        _id: "hosp-001",
        name: "Apollo Super Specialty Hospitals",
        slug: "apollo-super-specialty-hospitals",
        description: "Premier multi-specialty clinical institution with Level-3 NABH accreditation and 24/7 ICU ambulance triage.",
        address: "21 Greams Lane, Off Greams Road",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600006",
        phone: "+91-44-28296000",
        email: "info@apollohospitals.com",
        website: "https://apollohospitals.com",
        logo_url: "https://ui-avatars.com/api/?name=Apollo+Hospitals&background=1877F2&color=fff&size=200",
        cover_image_url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800",
        is_verified: true,
        rating: 4.9,
        latitude: 13.0614,
        longitude: 80.2444,
        specialties: ["Cardiology", "Oncology", "Neurology", "Orthopedics", "Nephrology"],
        beds: 700,
        established: 1983,
      },
      {
        _id: "hosp-002",
        name: "Fortis Healthcare Institute",
        slug: "fortis-healthcare-institute",
        description: "Integrated healthcare delivery network with state-of-the-art robotic surgery wings and outpatient clinical diagnostics.",
        address: "Mulund Goregaon Link Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400078",
        phone: "+91-22-67994444",
        email: "contact@fortishealthcare.com",
        website: "https://fortishealthcare.com",
        logo_url: "https://ui-avatars.com/api/?name=Fortis+Healthcare&background=10B981&color=fff&size=200",
        cover_image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
        is_verified: true,
        rating: 4.8,
        latitude: 19.1663,
        longitude: 72.9436,
        specialties: ["Cardiology", "Cardiac Surgery", "Gastroenterology", "Urology"],
        beds: 500,
        established: 1996,
      },
      {
        _id: "hosp-003",
        name: "Manipal Super Specialty Hospital",
        slug: "manipal-super-specialty-hospital",
        description: "World-class multidisciplinary clinical care center offering advanced diagnostic imaging and OPD token queue integration.",
        address: "98 HAL Old Airport Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560017",
        phone: "+91-80-25024444",
        email: "info@manipalhospitals.com",
        website: "https://manipalhospitals.com",
        logo_url: "https://ui-avatars.com/api/?name=Manipal+Hospitals&background=F59E0B&color=fff&size=200",
        cover_image_url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
        is_verified: true,
        rating: 4.7,
        latitude: 12.9592,
        longitude: 77.6496,
        specialties: ["Neurology", "Neurosurgery", "Organ Transplant", "Pediatrics"],
        beds: 600,
        established: 1991,
      },
      {
        _id: "hosp-004",
        name: "Max Super Speciality Hospital",
        slug: "max-super-speciality-hospital",
        description: "Renowned healthcare facility known for comprehensive oncological interventions and dedicated emergency cardiac units.",
        address: "1 2 Press Enclave Road, Saket",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110017",
        phone: "+91-11-26515050",
        email: "saket@maxhealthcare.com",
        website: "https://maxhealthcare.in",
        logo_url: "https://ui-avatars.com/api/?name=Max+Hospital&background=6366F1&color=fff&size=200",
        cover_image_url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800",
        is_verified: true,
        rating: 4.8,
        latitude: 28.5276,
        longitude: 77.2123,
        specialties: ["Cardiology", "Oncology", "Orthopedics", "Pulmonology"],
        beds: 550,
        established: 2000,
      },
      {
        _id: "hosp-005",
        name: "AIIMS Medical Center",
        slug: "aiims-medical-center",
        description: "India's premier public medical research and multi-specialty clinical hospital delivering exemplary treatment across all clinical disciplines.",
        address: "Sri Aurobindo Marg, Ansari Nagar",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110029",
        phone: "+91-11-26588500",
        email: "director@aiims.edu",
        website: "https://aiims.edu",
        logo_url: "https://ui-avatars.com/api/?name=AIIMS+Delhi&background=EC4899&color=fff&size=200",
        cover_image_url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800",
        is_verified: true,
        rating: 4.9,
        latitude: 28.5672,
        longitude: 77.21,
        specialties: ["General Medicine", "Cardiology", "Neurology", "Oncology", "Pediatrics"],
        beds: 2500,
        established: 1956,
      },
    ];

    await Hospital.insertMany(hospitalsData);

    // ─── 2. Seed Departments ────────────────────────────────────────────────────
    const departmentsData = [
      { _id: "dept-001", name: "Cardiology", hospital_id: "hosp-001", description: "Comprehensive heart and cardiovascular clinical care." },
      { _id: "dept-002", name: "Neurology", hospital_id: "hosp-001", description: "Advanced neurological disorders and stroke treatment." },
      { _id: "dept-003", name: "Orthopedics", hospital_id: "hosp-002", description: "Joint replacement, trauma care, and sports medicine." },
      { _id: "dept-004", name: "Pediatrics", hospital_id: "hosp-003", description: "Dedicated pediatric and neonatology consultation cabins." },
      { _id: "dept-005", name: "General Medicine", hospital_id: "hosp-004", description: "Primary outpatient checkups, routine fever, and diagnostics." },
    ];

    await Department.insertMany(departmentsData);

    // ─── 3. Seed Doctors & Users ────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash("password123", 10);

    const doctorsSeedList = [
      {
        _id: "doc-001",
        full_name: "Dr. Rajesh Sharma",
        email: "dr.sharma@medislot.com",
        phone: "+91 9820011223",
        hospital_id: "hosp-001",
        department_id: "dept-001",
        specialization: "Cardiology",
        qualification: "MBBS, MD, DM (Cardiology)",
        experience_years: 15,
        consultation_fee: 1200,
        rating: 4.9,
        review_count: 142,
        bio: "Senior Interventional Cardiologist with extensive clinical practice at Apollo Hospitals.",
        profile_pic: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
      },
      {
        _id: "doc-002",
        full_name: "Dr. Priya Nair",
        email: "dr.nair@medislot.com",
        phone: "+91 9820033445",
        hospital_id: "hosp-001",
        department_id: "dept-002",
        specialization: "Neurology",
        qualification: "MBBS, DM (Neurology)",
        experience_years: 12,
        consultation_fee: 1000,
        rating: 4.8,
        review_count: 98,
        bio: "Renowned clinical neurologist specializing in headache management and neuro-rehabilitation.",
        profile_pic: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
      },
      {
        _id: "doc-003",
        full_name: "Dr. Vikram Malhotra",
        email: "dr.malhotra@medislot.com",
        phone: "+91 9820055667",
        hospital_id: "hosp-002",
        department_id: "dept-003",
        specialization: "Orthopedics",
        qualification: "MBBS, MS (Orthopedics)",
        experience_years: 18,
        consultation_fee: 1500,
        rating: 4.9,
        review_count: 210,
        bio: "Leading Joint Replacement Surgeon with specialized fellowships in robotic orthopedics.",
        profile_pic: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
      },
      {
        _id: "doc-004",
        full_name: "Dr. Ananya Reddy",
        email: "dr.reddy@medislot.com",
        phone: "+91 9820077889",
        hospital_id: "hosp-003",
        department_id: "dept-004",
        specialization: "Pediatrics",
        qualification: "MBBS, MD (Pediatrics)",
        experience_years: 10,
        consultation_fee: 800,
        rating: 4.7,
        review_count: 84,
        bio: "Dedicated pediatrician expert in infant wellness, immunization, and pediatric nutrition.",
        profile_pic: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
      },
      {
        _id: "doc-005",
        full_name: "Dr. Suresh Gupta",
        email: "dr.gupta@medislot.com",
        phone: "+91 9820099001",
        hospital_id: "hosp-004",
        department_id: "dept-005",
        specialization: "General Medicine",
        qualification: "MBBS, MD (Internal Medicine)",
        experience_years: 20,
        consultation_fee: 700,
        rating: 4.8,
        review_count: 310,
        bio: "Senior Internal Medicine Consultant focusing on diabetes care, hypertension, and primary diagnostics.",
        profile_pic: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
      },
    ];

    const doctorUsers = [];
    const doctorsDocs = [];

    for (const doc of doctorsSeedList) {
      const userId = uuidv4();
      doctorUsers.push({
        _id: userId,
        email: doc.email,
        password_hash: hashedPassword,
        role: "DOCTOR",
        is_verified: true,
        is_active: true,
      });

      doctorsDocs.push({
        ...doc,
        user_id: userId,
      });
    }

    // Add Admin & Demo Patient User
    const adminUser = {
      _id: uuidv4(),
      email: "admin@apollo.com",
      password_hash: hashedPassword,
      role: "HOSPITAL_ADMIN",
      is_verified: true,
      is_active: true,
    };

    const patientUser = {
      _id: uuidv4(),
      email: "priya.nair@example.com",
      password_hash: hashedPassword,
      role: "PATIENT",
      is_verified: true,
      is_active: true,
    };

    const patientDoc = {
      _id: uuidv4(),
      user_id: patientUser._id,
      full_name: "Priya Nair",
      phone: "+91 9876543210",
      gender: "Female",
      blood_group: "O+",
      address: "14 Marine Drive, Mumbai",
    };

    await User.insertMany([...doctorUsers, adminUser, patientUser]);
    await Doctor.insertMany(doctorsDocs);
    await Patient.create(patientDoc);

    console.log("✅ MongoDB Atlas Seeded Successfully! (5 Hospitals, 5 Departments, 5 Doctors, 1 Admin, 1 Patient)");
  } catch (err) {
    console.error("❌ Error seeding MongoDB Atlas:", err.message);
  }
}

module.exports = { seedDatabase };
