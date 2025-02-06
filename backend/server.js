const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const vendorRoutes = require('./routes/vendorRoutes');  // Import routes
const cookieParser = require('cookie-parser');

const cors = require('cors');


dotenv.config(); // Load .env file

connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());
app.use(cors());  // Enable CORS for all routes

// Use vendor routes
app.use('/api/vendor', vendorRoutes);  // Mount vendor routes at the '/vendor' path

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
