const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// 2. API Versioning Setup
const v1Routes = require("./routes/v1");
app.use("/api/v1",v1Routes);

// Root endpoint / Health check
app.get("/",(req,res)=>{
    res.status(200).json({status:"success",message:"TraceGuard API is running "});
});

// 3. Global Error Handling Middleware (Optional but recommended)
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.start(500).json({status:"error",message:"Internal Server Error"});
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
