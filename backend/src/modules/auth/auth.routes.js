// src/modules/auth/auth.routes.js
const express = require("express");
const router = express.Router();
const { register, login, logout, getMe, refreshToken } = require("./auth.controller");
const { verifyJWT } = require("../../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getMe);
router.post("/refresh-token", refreshToken);

module.exports = router;
