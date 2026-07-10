// src/models/index.js
// Centralized Mongoose Models for MediSlot (MongoDB Atlas Only)
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Helper to ensure 'id' field exists and matches _id or custom id string
const addIdVirtual = (schema) => {
  schema.virtual("id").get(function () {
    return this._id.toString();
  });
  schema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    },
  });
  schema.set("toObject", { virtuals: true });
};

// ─── 1. USERS COLLECTION (`users`) ─────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["PATIENT", "DOCTOR", "HOSPITAL_ADMIN"], default: "PATIENT", required: true },
    is_verified: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
addIdVirtual(userSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema, "users");

// ─── 2. PATIENTS COLLECTION (`patients`) ───────────────────────────────────────
const patientSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    user_id: { type: String, ref: "User", required: true },
    full_name: { type: String, required: true, trim: true },
    phone: { type: String, default: null },
    date_of_birth: { type: String, default: null },
    gender: { type: String, default: "Male" },
    blood_group: { type: String, default: null },
    address: { type: String, default: null },
    profile_pic: { type: String, default: null },
    emergency_contact: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
addIdVirtual(patientSchema);
const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema, "patients");

// ─── 3. DOCTORS COLLECTION (`doctors`) ─────────────────────────────────────────
const doctorSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    user_id: { type: String, ref: "User", required: true },
    full_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: null },
    hospital_id: { type: String, ref: "Hospital", required: true },
    department_id: { type: String, ref: "Department", required: true },
    specialization: { type: String, required: true },
    qualification: { type: String, default: "MBBS, MD" },
    experience_years: { type: Number, default: 5 },
    consultation_fee: { type: Number, default: 800 },
    rating: { type: Number, default: 4.8 },
    review_count: { type: Number, default: 24 },
    bio: { type: String, default: "Accredited multi-specialty clinical practitioner." },
    profile_pic: { type: String, default: null },
    is_verified: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
addIdVirtual(doctorSchema);
const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema, "doctors");

// ─── 4. HOSPITALS COLLECTION (`hospitals`) ─────────────────────────────────────
const hospitalSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    user_id: { type: String, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: "Maharashtra" },
    pincode: { type: String, default: "400001" },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    website: { type: String, default: null },
    logo_url: { type: String, default: null },
    cover_image_url: { type: String, default: null },
    is_verified: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8 },
    latitude: { type: Number, default: 19.076 },
    longitude: { type: Number, default: 72.8777 },
    specialties: [{ type: String }],
    beds: { type: Number, default: 350 },
    established: { type: Number, default: 1995 },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
addIdVirtual(hospitalSchema);
const Hospital = mongoose.models.Hospital || mongoose.model("Hospital", hospitalSchema, "hospitals");

// ─── 5. DEPARTMENTS COLLECTION (`departments`) ─────────────────────────────────
const departmentSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true, trim: true },
    hospital_id: { type: String, ref: "Hospital", required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "Activity" },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
addIdVirtual(departmentSchema);
const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema, "departments");

// ─── 6. APPOINTMENTS COLLECTION (`appointments`) ───────────────────────────────
const appointmentSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    booking_reference: { type: String, required: true, unique: true },
    patient_id: { type: String, ref: "Patient", required: true },
    doctor_id: { type: String, ref: "Doctor", required: true },
    hospital_id: { type: String, ref: "Hospital", required: true },
    slot_id: { type: String, default: null },
    appointment_date: { type: String, required: true },
    slot: {
      start_time: { type: String, default: "10:30 AM" },
      end_time: { type: String, default: "11:00 AM" },
    },
    reason: { type: String, default: "Routine consultation" },
    symptoms: { type: String, default: "" },
    status: { type: String, enum: ["CONFIRMED", "PENDING", "CANCELLED", "COMPLETED"], default: "CONFIRMED" },
    notes: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
addIdVirtual(appointmentSchema);
const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema, "appointments");

// ─── 7. AMBULANCE REQUESTS COLLECTION (`ambulanceRequests`) ────────────────────
const ambulanceRequestSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    patient_id: { type: String, ref: "User", default: null },
    patient_name: { type: String, required: true },
    patient_phone: { type: String, required: true },
    pickup_address: { type: String, required: true },
    destination_hospital_id: { type: String, ref: "Hospital", default: null },
    latitude: { type: Number, default: 19.076 },
    longitude: { type: Number, default: 72.8777 },
    emergency_type: { type: String, default: "Urgent Medical Assistance" },
    eta_minutes: { type: Number, default: 12 },
    status: { type: String, enum: ["DISPATCHED", "EN_ROUTE", "ARRIVED", "COMPLETED", "CANCELLED"], default: "DISPATCHED" },
    vehicle_number: { type: String, default: "MH-01-AB-2345" },
    driver_name: { type: String, default: "Rajesh Kumar (Emergency ICU Dispatch)" },
    driver_phone: { type: String, default: "+91 9820011223" },
    requested_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "requested_at", updatedAt: "updated_at" } }
);
addIdVirtual(ambulanceRequestSchema);
const AmbulanceRequest = mongoose.models.AmbulanceRequest || mongoose.model("AmbulanceRequest", ambulanceRequestSchema, "ambulanceRequests");

// ─── 8. NOTIFICATIONS COLLECTION (`notifications`) ─────────────────────────────
const notificationSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    user_id: { type: String, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "INFO" },
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
addIdVirtual(notificationSchema);
const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema, "notifications");

// ─── 9. MEDICAL RECORDS COLLECTION (`medicalRecords`) ──────────────────────────
const medicalRecordSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    patient_id: { type: String, ref: "Patient", required: true },
    doctor_id: { type: String, ref: "Doctor", default: null },
    hospital_id: { type: String, ref: "Hospital", default: null },
    title: { type: String, required: true },
    record_type: { type: String, enum: ["PRESCRIPTION", "LAB_REPORT", "DISCHARGE_SUMMARY", "DIAGNOSTIC", "OTHER"], default: "PRESCRIPTION" },
    file_url: { type: String, default: null },
    description: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
addIdVirtual(medicalRecordSchema);
const MedicalRecord = mongoose.models.MedicalRecord || mongoose.model("MedicalRecord", medicalRecordSchema, "medicalRecords");

module.exports = {
  User,
  Patient,
  Doctor,
  Hospital,
  Department,
  Appointment,
  AmbulanceRequest,
  Notification,
  MedicalRecord,
};
