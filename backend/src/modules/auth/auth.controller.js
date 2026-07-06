// src/modules/auth/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../../config/db");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Token Generators ──────────────────────────────────────────────────────────
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// ─── Register (Patient only) ──────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { email, password, full_name, phone, date_of_birth, gender } = req.body;

  if (!email || !password || !full_name) {
    throw new ApiError(400, "Email, password, and full name are required");
  }

  const existingUser = db.users.find((u) => u.email === email.toLowerCase());
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();
  const patientId = uuidv4();

  const newUser = {
    id: userId,
    email: email.toLowerCase(),
    password_hash: hashedPassword,
    role: "PATIENT",
    is_verified: true,
    is_active: true,
    created_at: new Date().toISOString(),
  };

  const newPatient = {
    id: patientId,
    user_id: userId,
    full_name,
    phone: phone || null,
    date_of_birth: date_of_birth || null,
    gender: gender || null,
    blood_group: null,
    address: null,
    profile_pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=2563EB&color=fff&size=200`,
    emergency_contact: null,
    created_at: new Date().toISOString(),
  };

  db.users.push(newUser);
  db.patients.push(newPatient);

  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  return res
    .status(201)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      statusCode: 201,
      message: "Registration successful! Welcome to MediSlot AI.",
      data: {
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
        patient: { id: newPatient.id, full_name: newPatient.full_name },
        accessToken,
      },
    });
});

// ─── Login ────────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = db.users.find((u) => u.email === email.toLowerCase());
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.is_active) {
    throw new ApiError(403, "Account has been deactivated. Contact support.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Fetch role-specific profile
  let profile = null;
  if (user.role === "PATIENT") {
    profile = db.patients.find((p) => p.user_id === user.id);
  } else if (user.role === "DOCTOR") {
    profile = db.doctors.find((d) => d.user_id === user.id);
  } else if (user.role === "HOSPITAL_ADMIN") {
    profile = db.hospitalAdmins?.find((a) => a.user_id === user.id);
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      statusCode: 200,
      message: "Login successful",
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        profile,
        accessToken,
      },
    });
});

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({
      success: true,
      statusCode: 200,
      message: "Logged out successfully",
      data: {},
    });
});

// ─── Get Current User ─────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) throw new ApiError(404, "User not found");

  let profile = null;
  if (user.role === "PATIENT") {
    profile = db.patients.find((p) => p.user_id === user.id);
  } else if (user.role === "DOCTOR") {
    const doctor = db.doctors.find((d) => d.user_id === user.id);
    if (doctor) {
      const hospital = db.hospitals.find((h) => h.id === doctor.hospital_id);
      const department = db.departments.find((d) => d.id === doctor.department_id);
      profile = { ...doctor, hospital, department };
    }
  } else if (user.role === "HOSPITAL_ADMIN") {
    const admin = db.hospitalAdmins?.find((a) => a.user_id === user.id);
    if (admin) {
      const hospital = db.hospitals.find((h) => h.id === admin.hospital_id);
      profile = { ...admin, hospital };
    }
  }

  return ApiResponse.success(res, {
    user: { id: user.id, email: user.email, role: user.role },
    profile,
  });
});

// ─── Refresh Token ────────────────────────────────────────────────────────────
const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized");

  const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
  const user = db.users.find((u) => u.id === decoded.id);
  if (!user) throw new ApiError(401, "Invalid refresh token");

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      statusCode: 200,
      message: "Token refreshed",
      data: { accessToken },
    });
});

module.exports = { register, login, logout, getMe, refreshToken };
