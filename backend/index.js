// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import your API routes
const faceApiRoutes = require("./routes/faceApi");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS)
// This allows your React Native app to make requests to this server
app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// --- API Routes ---
// Tell Express to use your face API routes when the URL starts with /api
app.use("/api", faceApiRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
