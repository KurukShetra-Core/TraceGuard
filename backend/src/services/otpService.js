const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const OTP_EXPIRY_MINUTES = 5;

const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const hashOTP = async (otp) => {
    return await bcrypt.hash(otp, 10);
};

const getOTPExpiry = () => {
    return new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );
};

module.exports = {
    generateOTP,
    hashOTP,
    getOTPExpiry
};