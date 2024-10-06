const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser")

const { auth } = require("./middleware/auth.js")

const dotenv = require("dotenv")
dotenv.config({ path: __dirname+"/.env"});

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(auth);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Routes
app.use("/auth", require("./routes/auth.js"));
app.use("/user", require("./routes/user.js"));
app.use("/events", require("./routes/events.js"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
