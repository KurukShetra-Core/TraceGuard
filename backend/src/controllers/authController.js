const { logger } = require("../utils/logger");
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

        logger.info({
    msg: "User registration started",
    email: req.body.email
});

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

            logger.warn({
    msg: "Registration failed: user already exists",
    email
});

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

        logger.info({
    msg: "User created successfully",
    userId: user._id.toString(),
    email: user.email
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

        logger.info({
    msg: "Registration OTP sent successfully",
    email
});

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

        logger.info({
    msg: "OTP verification started",
    email: req.body.email
});    

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                status: "error",
                message: "Email and OTP are required"
            });
        }

        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {

            logger.warn({
    msg: "OTP verification failed: OTP invalid or expired",
    email
});

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

            logger.warn({
    msg: "OTP verification failed: invalid OTP",
    email
});

            return res.status(400).json({
                status: "error",
                message: "Invalid OTP"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {

            logger.error({
    msg: "OTP verification failed: user not found",
    email
});
            
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        user.isVerified = true;
        await user.save();

        await OTP.deleteOne({ _id: otpRecord._id });

        logger.info({
    msg: "Email verified successfully",
    userId: user._id.toString(),
    email: user.email
});

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

        logger.info({
    msg: "OTP resend requested",
    email: req.body.email
});

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: "error",
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {

            logger.warn({
    msg: "OTP resend failed: user not found",
    email
});

            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        if (user.isVerified) {

logger.warn({
    msg: "OTP resend failed: email already verified",
    email
});

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

        logger.info({
    msg: "New OTP sent successfully",
    email
});

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

        logger.info({
    msg: "User login started",
    email: req.body.email
});

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

            logger.warn({
    msg: "Login failed: user not found",
    email
});

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

            logger.warn({
    msg: "Login failed: invalid password",
    email
});

            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        // Check email verification
        if (!user.isVerified) {

            logger.warn({
    msg: "Login failed: email not verified",
    email
});

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

logger.info({
    msg: "User login successful",
    userId: user._id.toString(),
    email: user.email
});

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