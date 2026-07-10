// src/modules/departments/departments.controller.js
// Pure MongoDB Atlas Departments Controller
const { Department, Hospital } = require("../../models");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// Get departments for a hospital or all
const getDepartments = asyncHandler(async (req, res) => {
  const { hospital_id } = req.query;
  const query = {};
  if (hospital_id) query.hospital_id = hospital_id;
  const departments = await Department.find(query);
  return ApiResponse.success(res, departments);
});

// Add department (Admin only)
const addDepartment = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findOne({ user_id: req.user.id }) || await Hospital.findOne();
  if (!hospital) throw new ApiError(403, "No hospital workspace assigned to this admin");

  const { name, description, icon } = req.body;
  if (!name) throw new ApiError(400, "Department name is required");

  const dept = await Department.create({
    name,
    hospital_id: hospital._id,
    description: description || "",
    icon: icon || "Activity",
  });

  return res.status(201).json({ success: true, statusCode: 201, message: "Department added on MongoDB Atlas", data: dept });
});

// Update department
const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dept = await Department.findByIdAndUpdate(id, req.body, { new: true });
  if (!dept) throw new ApiError(404, "Department not found");
  return ApiResponse.success(res, dept, "Department updated successfully");
});

// Delete department
const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dept = await Department.findByIdAndDelete(id);
  if (!dept) throw new ApiError(404, "Department not found");
  return ApiResponse.success(res, null, "Department removed from MongoDB Atlas");
});

module.exports = { getDepartments, addDepartment, updateDepartment, deleteDepartment };
