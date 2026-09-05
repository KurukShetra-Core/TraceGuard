const express = require("express");

const {
    register,
    verifyOTP,
    resendOTP,
    login
} = require("../../controllers/authController");

const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({
        status: "success",
        user: req.user
    });
});

module.exports = router;