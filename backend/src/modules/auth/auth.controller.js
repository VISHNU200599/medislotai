// src/modules/auth/auth.controller.js
// Pure MongoDB Atlas Authentication Controller
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { User, Patient, Doctor, Hospital, Department } = require("../../models");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Token Generators ──────────────────────────────────────────────────────────
const generateAccessToken = (user) => {
  const userId = user.id || user._id.toString();
  return jwt.sign(
    { id: userId, email: user.email, role: user.role },
    process.env.JWT_SECRET || "medislot_super_secret_jwt_key_change_in_production_2024",
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );
};

const generateRefreshToken = (user) => {
  const userId = user.id || user._id.toString();
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || "medislot_refresh_secret_key_change_in_production_2024",
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// ─── Register (Universal: Patient, Doctor, Hospital Admin) ─────────────────────
const register = asyncHandler(async (req, res) => {
  const { email, password, full_name, phone, date_of_birth, gender, role } = req.body;

  if (!email || !password || !full_name) {
    throw new ApiError(400, "Email, password, and full name are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const userRole = (role || "PATIENT").toUpperCase();
  if (!["PATIENT", "DOCTOR", "HOSPITAL_ADMIN"].includes(userRole)) {
    throw new ApiError(400, "Invalid account role selected");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();
  const profileId = uuidv4();

  const newUser = await User.create({
    _id: userId,
    email: email.toLowerCase().trim(),
    password_hash: hashedPassword,
    role: userRole,
    is_verified: true,
    is_active: true,
  });

  let newProfile = null;
  if (userRole === "PATIENT") {
    newProfile = await Patient.create({
      _id: profileId,
      user_id: userId,
      full_name: full_name.trim(),
      phone: phone || null,
      date_of_birth: date_of_birth || null,
      gender: gender || "Male",
      profile_pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=1877F2&color=fff&size=200`,
    });
  } else if (userRole === "DOCTOR") {
    const defaultHospital = await Hospital.findOne() || { _id: "hosp-001", name: "Apollo Super Specialty Hospitals" };
    const defaultDept = await Department.findOne() || { _id: "dept-001", name: "Cardiology" };

    newProfile = await Doctor.create({
      _id: profileId,
      user_id: userId,
      full_name: full_name.startsWith("Dr.") ? full_name : `Dr. ${full_name.trim()}`,
      email: email.toLowerCase().trim(),
      phone: phone || "+91 9876543210",
      hospital_id: defaultHospital._id,
      department_id: defaultDept._id,
      specialization: defaultDept.name || "Cardiology",
      qualification: "MBBS, MD",
      experience_years: 5,
      consultation_fee: 800,
      profile_pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=1877F2&color=fff&size=200`,
    });
  } else if (userRole === "HOSPITAL_ADMIN") {
    const defaultHospital = await Hospital.findOne();
    if (defaultHospital) {
      defaultHospital.user_id = userId;
      await defaultHospital.save();
      newProfile = defaultHospital;
    } else {
      newProfile = await Hospital.create({
        _id: uuidv4(),
        user_id: userId,
        name: `${full_name.trim()}'s Multi-Specialty Hospital`,
        slug: `hospital-${Date.now()}`,
        address: "Healthcare Boulevard, Medical District",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
      });
    }
  }

  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  return res
    .status(201)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      statusCode: 201,
      message: "Registration successful! Welcome to MediSlot.",
      data: {
        user: { id: newUser._id, email: newUser.email, role: newUser.role },
        profile: newProfile,
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

  const user = await User.findOne({ email: email.toLowerCase().trim() });
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

  let profile = null;
  if (user.role === "PATIENT") {
    profile = await Patient.findOne({ user_id: user._id });
  } else if (user.role === "DOCTOR") {
    profile = await Doctor.findOne({ user_id: user._id });
  } else if (user.role === "HOSPITAL_ADMIN") {
    profile = await Hospital.findOne({ user_id: user._id }) || await Hospital.findOne();
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      statusCode: 200,
      message: "Login successful",
      data: {
        user: { id: user._id, email: user.email, role: user.role },
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
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");

  let profile = null;
  if (user.role === "PATIENT") {
    profile = await Patient.findOne({ user_id: user._id });
  } else if (user.role === "DOCTOR") {
    const doctor = await Doctor.findOne({ user_id: user._id });
    if (doctor) {
      const hospital = await Hospital.findById(doctor.hospital_id);
      const department = await Department.findById(doctor.department_id);
      profile = { ...doctor.toObject(), hospital, department };
    }
  } else if (user.role === "HOSPITAL_ADMIN") {
    const hospital = await Hospital.findOne({ user_id: user._id }) || await Hospital.findOne();
    profile = hospital;
  }

  return ApiResponse.success(res, {
    user: { id: user._id, email: user.email, role: user.role },
    profile,
  });
});

// ─── Refresh Token ────────────────────────────────────────────────────────────
const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized");

  const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET || "medislot_refresh_secret_key_change_in_production_2024");
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, "Invalid refresh token");

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      statusCode: 200,
      message: "Token refreshed",
      data: { accessToken },
    });
});

module.exports = { register, login, logout, getMe, refreshToken };
