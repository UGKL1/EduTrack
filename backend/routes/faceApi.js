const express = require("express");
const axios = require("axios");
const multer = require("multer");

const router = express.Router();

// --- Azure API Configuration ---
// Get credentials from .env file
const AZURE_KEY = process.env.AZURE_FACE_API_KEY;
const AZURE_ENDPOINT = process.env.AZURE_FACE_API_ENDPOINT;
const PERSON_GROUP_ID = process.env.AZURE_PERSON_GROUP_ID;

// Set up Axios for Azure requests
const azureApi = axios.create({
  baseURL: AZURE_ENDPOINT,
  headers: {
    "Ocp-Apim-Subscription-Key": AZURE_KEY,
    "Content-Type": "application/octet-stream", // We will send image data directly
  },
});

// --- Multer Configuration ---
// Set up multer to store uploaded images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- API Endpoint: /api/mark-attendance ---
// This is the endpoint your React Native app will call
router.post(
  "/mark-attendance",
  upload.single("faceImage"),
  async (req, res) => {
    try {
      // 1. Check if an image was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded." });
      }

      // The image data is in req.file.buffer
      const imageBuffer = req.file.buffer;

      // --- STEP 1: Detect Face ---
      // We must first detect the face to get a temporary 'faceId'
      // We add 'returnFaceId=true' as a URL parameter
      const detectResponse = await azureApi.post(
        "detect?returnFaceId=true",
        imageBuffer
      );

      if (detectResponse.data.length === 0) {
        return res
          .status(400)
          .json({ message: "No face detected in the image." });
      }

      // Get the faceId of the first face found
      const faceId = detectResponse.data[0].faceId;

      // --- STEP 2: Identify Face ---
      // Now we compare the detected faceId against our PersonGroup
      const identifyResponse = await azureApi.post("identify", {
        faceIds: [faceId],
        personGroupId: PERSON_GROUP_ID,
      });

      if (identifyResponse.data[0].candidates.length === 0) {
        return res.status(404).json({ message: "Student not recognized." });
      }

      // --- STEP 3: Get Match ---
      // Get the best match (the first candidate)
      const bestMatch = identifyResponse.data[0].candidates[0];
      const personId = bestMatch.personId;
      const confidence = bestMatch.confidence;

      // You should set a confidence threshold
      if (confidence < 0.7) {
        return res.status(400).json({
          message: `Student not recognized (Confidence too low: ${confidence})`,
        });
      }

      // --- STEP 4: Update Firebase (Your Logic Here) ---
      // Now you have the 'personId'
      // You need to:
      // 1. Look up this 'personId' in your Firestore 'students' collection
      // 2. Get the student's document (e.g., to get their name)
      // 3. Create a new record in your 'attendance' collection

      // For now, we'll just return the personId

      // const student = await findStudentByPersonId(personId); // (Your function)
      // await markAttendanceInFirebase(student.id); // (Your function)

      res.status(200).json({
        success: true,
        message: "Attendance marked successfully!",
        personId: personId, // This is the ID from Azure
        confidence: confidence,
        // studentName: student.name // (You would get this from Firebase)
      });
    } catch (error) {
      console.error(
        "Error in /mark-attendance:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({ message: "An error occurred on the server." });
    }
  }
);

module.exports = router;
