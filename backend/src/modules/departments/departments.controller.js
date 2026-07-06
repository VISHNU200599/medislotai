// src/modules/departments/departments.controller.js
const { v4: uuidv4 } = require("uuid");
const { db } = require("../../config/db");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// Get departments for a hospital
const getDepartments = asyncHandler(async (req, res) => {
  const { hospital_id } = req.query;
  let departments = db.departments;
  if (hospital_id) departments = departments.filter((d) => d.hospital_id === hospital_id);
  return ApiResponse.success(res, departments);
});

// Add department (Admin only)
const addDepartment = asyncHandler(async (req, res) => {
  const admin = db.hospitalAdmins?.find((a) => a.user_id === req.user.id);
  if (!admin) throw new ApiError(403, "Not authorized");

  const { name, description, icon } = req.body;
  if (!name) throw new ApiError(400, "Department name is required");

  const dept = {
    id: uuidv4(), hospital_id: admin.hospital_id,
    name, description: description || "", icon: icon || "stethoscope",
    is_active: true, created_at: new Date().toISOString(),
  };

  db.departments.push(dept);
  return res.status(201).json({ success: true, statusCode: 201, message: "Department added", data: dept });
});

// Update department
const updateDepartment = asyncHandler(async (req, res) => {
  const admin = db.hospitalAdmins?.find((a) => a.user_id === req.user.id);
  if (!admin) throw new ApiError(403, "Not authorized");

  const { id } = req.params;
  const idx = db.departments.findIndex((d) => d.id === id && d.hospital_id === admin.hospital_id);
  if (idx === -1) throw new ApiError(404, "Department not found");

  const allowed = ["name", "description", "icon", "is_active"];
  allowed.forEach((f) => { if (req.body[f] !== undefined) db.departments[idx][f] = req.body[f]; });

  return ApiResponse.success(res, db.departments[idx], "Department updated");
});

// Delete department
const deleteDepartment = asyncHandler(async (req, res) => {
  const admin = db.hospitalAdmins?.find((a) => a.user_id === req.user.id);
  if (!admin) throw new ApiError(403, "Not authorized");

  const { id } = req.params;
  const idx = db.departments.findIndex((d) => d.id === id && d.hospital_id === admin.hospital_id);
  if (idx === -1) throw new ApiError(404, "Department not found");

  db.departments.splice(idx, 1);
  return ApiResponse.success(res, null, "Department removed");
});

module.exports = { getDepartments, addDepartment, updateDepartment, deleteDepartment };
