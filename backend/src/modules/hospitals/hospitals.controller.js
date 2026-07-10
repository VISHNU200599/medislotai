// src/modules/hospitals/hospitals.controller.js
// Pure MongoDB Atlas Hospitals Controller
const { Hospital, Doctor, Department } = require("../../models");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Get All Hospitals (with search/filter) ───────────────────────────────────
const getHospitals = asyncHandler(async (req, res) => {
  const { search, city, specialty, page = 1, limit = 10 } = req.query;

  const query = {};
  if (search) {
    const q = new RegExp(search, "i");
    query.$or = [{ name: q }, { city: q }, { description: q }];
  }
  if (city) {
    query.city = new RegExp(city, "i");
  }
  if (specialty) {
    query.specialties = new RegExp(specialty, "i");
  }

  const hospitals = await Hospital.find(query);
  const doctors = await Doctor.find();
  const departments = await Department.find();

  const enriched = hospitals.map((h) => ({
    ...h.toObject(),
    doctor_count: doctors.filter((d) => d.hospital_id === h._id.toString()).length,
    department_count: departments.filter((d) => d.hospital_id === h._id.toString()).length,
  }));

  const total = enriched.length;
  const start = (page - 1) * limit;
  const paginated = enriched.slice(start, start + parseInt(limit));

  return ApiResponse.paginated(res, paginated, { page: parseInt(page), limit: parseInt(limit), total }, "Hospitals fetched successfully from MongoDB Atlas");
});

// ─── Get Hospital by Slug or ID ────────────────────────────────────────────────
const getHospitalBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  let hospital = await Hospital.findOne({ slug });
  if (!hospital) {
    // try by ID if slug not found
    hospital = await Hospital.findById(slug);
  }
  if (!hospital) throw new ApiError(404, "Hospital not found on MongoDB Atlas");

  const departments = await Department.find({ hospital_id: hospital._id.toString() });
  const doctors = await Doctor.find({ hospital_id: hospital._id.toString() });

  const enrichedDoctors = doctors.map((doc) => ({
    ...doc.toObject(),
    department: departments.find((dept) => dept._id.toString() === doc.department_id),
  }));

  return ApiResponse.success(res, {
    ...hospital.toObject(),
    departments,
    doctors: enrichedDoctors,
    reviews: [],
    doctor_count: doctors.length,
    review_count: 0,
  });
});

// ─── Get Doctors by Hospital ──────────────────────────────────────────────────
const getHospitalDoctors = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hospital = await Hospital.findById(id);
  if (!hospital) throw new ApiError(404, "Hospital not found");

  const query = { hospital_id: id };
  if (req.query.department_id) {
    query.department_id = req.query.department_id;
  }

  const doctors = await Doctor.find(query);
  const departments = await Department.find({ hospital_id: id });

  const enriched = doctors.map((doc) => ({
    ...doc.toObject(),
    department: departments.find((dept) => dept._id.toString() === doc.department_id),
    hospital: { id: hospital._id, name: hospital.name, city: hospital.city },
  }));

  return ApiResponse.success(res, enriched);
});

// ─── Create Hospital (CRUD) ───────────────────────────────────────────────────
const createHospital = asyncHandler(async (req, res) => {
  const { name, slug, address, city, state, pincode, phone, email, website, beds, specialties } = req.body;
  if (!name || !address || !city) throw new ApiError(400, "Name, address, and city are required");

  const newHospital = await Hospital.create({
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
    address,
    city,
    state: state || "Maharashtra",
    pincode: pincode || "400001",
    phone: phone || null,
    email: email || null,
    website: website || null,
    beds: beds || 200,
    specialties: specialties || ["General Medicine"],
  });

  return ApiResponse.success(res, newHospital, "Hospital created successfully on MongoDB Atlas", 201);
});

// ─── Update Hospital (CRUD) ───────────────────────────────────────────────────
const updateHospital = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hospital = await Hospital.findByIdAndUpdate(id, req.body, { new: true });
  if (!hospital) throw new ApiError(404, "Hospital not found");
  return ApiResponse.success(res, hospital, "Hospital updated successfully");
});

// ─── Delete Hospital (CRUD) ───────────────────────────────────────────────────
const deleteHospital = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hospital = await Hospital.findByIdAndDelete(id);
  if (!hospital) throw new ApiError(404, "Hospital not found");
  return ApiResponse.success(res, { id }, "Hospital deleted successfully");
});

module.exports = { getHospitals, getHospitalBySlug, getHospitalDoctors, createHospital, updateHospital, deleteHospital };
