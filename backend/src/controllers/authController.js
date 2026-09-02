const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const User = require("../models/user");
const OTP = require("../models/otp");

const {
    generateOTP,
    hashOTP,
    getOTPExpiry
} = require("../services/otpService");

const { sendOTPEmail } = require("../services/emailService");

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "User already exists"
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email,
            passwordHash,
            isVerified: false
        });

        // Generate OTP
        const otp = generateOTP();

        // Hash OTP
        const otpHash = await hashOTP(otp);

        // Store OTP
        await OTP.create({
            email,
            otpHash,
            expiresAt: getOTPExpiry()
        });

        // Send OTP
        await sendOTPEmail(email, otp);

        return res.status(201).json({
            status: "success",
            message: "Registration successful. OTP sent to your email."
        });
    } catch (error) {
        next(error);
    }
};

const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                status: "error",
                message: "Email and OTP are required"
            });
        }

        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                status: "error",
                message: "OTP is invalid or expired"
            });
        }

        const isOTPValid = await bcrypt.compare(
            otp,
            otpRecord.otpHash
        );

        if (!isOTPValid) {
            return res.status(400).json({
                status: "error",
                message: "Invalid OTP"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        user.isVerified = true;
        await user.save();

        await OTP.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            status: "success",
            message: "Email verified successfully"
        });
    } catch (error) {
        next(error);
    }
};

const resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: "error",
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                status: "error",
                message: "Email is already verified"
            });
        }

        // Remove existing OTP
        await OTP.deleteMany({ email });

        // Generate new OTP
        const otp = generateOTP();
        const otpHash = await hashOTP(otp);

        await OTP.create({
            email,
            otpHash,
            expiresAt: getOTPExpiry()
        });

        // Send new OTP
        await sendOTPEmail(email, otp);

        return res.status(200).json({
            status: "success",
            message: "New OTP sent to your email"
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        // Check email verification
        if (!user.isVerified) {
            return res.status(403).json({
                status: "error",
                message: "Please verify your email before logging in"
            });
        }

        const token = jwt.sign(
    {
        userId: user._id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

return res.status(200).json({
    status: "success",
    message: "Login successful",
    token
});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    verifyOTP,
    resendOTP,
    login
};