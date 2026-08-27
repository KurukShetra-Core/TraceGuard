const express = require("express");
const router = express.Router();

router.get("/health",(req,res)=>{
    res.json({status:"success",version:"v1.0.0"});
});

module.exports = router;