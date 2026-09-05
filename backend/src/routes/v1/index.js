const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");

router.get("/health", (req, res) => {
    res.json({
        status: "success",
        version: "v1.0.0"
    });
});

router.use("/auth", authRoutes);

module.exports = router;