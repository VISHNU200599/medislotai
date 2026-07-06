// src/modules/hospitals/hospitals.controller.js
const { db } = require("../../config/db");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Get All Hospitals (with search/filter) ───────────────────────────────────
const getHospitals = asyncHandler(async (req, res) => {
  const { search, city, specialty, page = 1, limit = 10 } = req.query;

  let hospitals = [...db.hospitals];

  if (search) {
    const q = search.toLowerCase();
    hospitals = hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
    );
  }

  if (city) {
    hospitals = hospitals.filter(
      (h) => h.city.toLowerCase() === city.toLowerCase()
    );
  }

  if (specialty) {
    hospitals = hospitals.filter((h) =>
      h.specialties?.some((s) => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  // Enrich with doctor count
  hospitals = hospitals.map((h) => ({
    ...h,
    doctor_count: db.doctors.filter((d) => d.hospital_id === h.id).length,
    department_count: db.departments.filter((d) => d.hospital_id === h.id).length,
  }));

  const total = hospitals.length;
  const start = (page - 1) * limit;
  const paginated = hospitals.slice(start, start + parseInt(limit));

  return ApiResponse.paginated(res, paginated, { page: parseInt(page), limit: parseInt(limit), total }, "Hospitals fetched successfully");
});

// ─── Get Hospital by Slug ──────────────────────────────────────────────────────
const getHospitalBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const hospital = db.hospitals.find((h) => h.slug === slug);
  if (!hospital) throw new ApiError(404, "Hospital not found");

  const departments = db.departments.filter((d) => d.hospital_id === hospital.id);
  const doctors = db.doctors
    .filter((d) => d.hospital_id === hospital.id)
    .map((doc) => ({
      ...doc,
      department: departments.find((dept) => dept.id === doc.department_id),
    }));

  const reviews = db.reviews.filter((r) => r.hospital_id === hospital.id);

  return ApiResponse.success(res, {
    ...hospital,
    departments,
    doctors,
    reviews,
    doctor_count: doctors.length,
    review_count: reviews.length,
  });
});

// ─── Get Doctors by Hospital ──────────────────────────────────────────────────
const getHospitalDoctors = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { department_id } = req.query;

  const hospital = db.hospitals.find((h) => h.id === id);
  if (!hospital) throw new ApiError(404, "Hospital not found");

  let doctors = db.doctors.filter((d) => d.hospital_id === id);

  if (department_id) {
    doctors = doctors.filter((d) => d.department_id === department_id);
  }

  const enriched = doctors.map((doc) => ({
    ...doc,
    department: db.departments.find((dept) => dept.id === doc.department_id),
    hospital: { id: hospital.id, name: hospital.name, city: hospital.city },
  }));

  return ApiResponse.success(res, enriched);
});

module.exports = { getHospitals, getHospitalBySlug, getHospitalDoctors };
