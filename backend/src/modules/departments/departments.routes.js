// src/modules/departments/departments.routes.js
const express = require("express");
const router = express.Router();
const { getDepartments, addDepartment, updateDepartment, deleteDepartment } = require("./departments.controller");
const { verifyJWT, authorizeRoles } = require("../../middleware/auth.middleware");

router.get("/", getDepartments);
router.post("/", verifyJWT, authorizeRoles("HOSPITAL_ADMIN"), addDepartment);
router.put("/:id", verifyJWT, authorizeRoles("HOSPITAL_ADMIN"), updateDepartment);
router.delete("/:id", verifyJWT, authorizeRoles("HOSPITAL_ADMIN"), deleteDepartment);

module.exports = router;
