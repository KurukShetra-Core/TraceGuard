const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, otp) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "TraceGuard <onboarding@resend.dev>",
            to: [email],
            subject: "TraceGuard Email Verification OTP",
            html: `
                <h2>TraceGuard Email Verification</h2>
                <p>Your OTP for email verification is:</p>

                <h1>${otp}</h1>

                <p>This OTP is valid for 5 minutes.</p>
                <p>If you did not request this OTP, please ignore this email.</p>
            `
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        throw new Error(`Failed to send OTP email: ${error.message}`);
    }
};

module.exports = {
    sendOTPEmail
};