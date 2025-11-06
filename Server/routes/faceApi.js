const express = require("express");
const axios = require("axios");
const multer = require("multer");

const router = express.Router();

// Get values from .env file
const AZURE_KEY = process.env.AZURE_FACE_API_KEY;
const AZURE_ENDPOINT = process.env.AZURE_FACE_API_ENDPOINT;
const PERSON_GROUP_ID = process.env.AZURE_PERSON_GROUP_ID;

// Set up Axios
const azureApi = axios.create({
  baseURL: AZURE_ENDPOINT,
  headers: {
    "Ocp-Apim-Subscription-Key": AZURE_KEY,
    "Content-Type": "application/octet-stream", // Default for sending image data
  },
});

// Set up multer to store uploaded images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Create our PersonGroup in Azure
router.post("/create-group", async (req, res) => {
  try {
    const groupId = process.env.AZURE_PERSON_GROUP_ID;

    await azureApi.put(
      `persongroups/${groupId}`, // This URL to create the group
      {
        name: "EduTrack Students",
        recognitionModel: "recognition_04",
      },
      {
        headers: {
          "Content-Type": "application/json", // Override default header
        },
      }
    );

    console.log(`PersonGroup '${groupId}' created successfully.`);
    res
      .status(200)
      .json({ message: `PersonGroup '${groupId}' created successfully.` });
  } catch (error) {
    // Log the detailed error
    if (error.response) {
      console.error(
        "Error creating PersonGroup (Full Response):",
        JSON.stringify(error.response.data, null, 2)
      );
      const errorMessage = error.response.data.error
        ? error.response.data.error.message
        : JSON.stringify(error.response.data);
      res
        .status(500)
        .json({ message: "Error creating PersonGroup", error: errorMessage });
    } else {
      console.error("Error creating PersonGroup:", error.message);
      res
        .status(500)
        .json({ message: "Error creating PersonGroup", error: error.message });
    }
  }
});

// Enrolls a new student by creating a Person and adding their face
router.post(
  "/enroll-student",
  upload.single("faceImage"), // Handles the image upload
  async (req, res) => {
    try {
      const { studentId, studentName } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded." });
      }
      const imageBuffer = req.file.buffer;

      if (!studentId || !studentName) {
        return res.status(400).json({
          message: "Missing studentId or studentName in the request body.",
        });
      }

      const createPersonResponse = await azureApi.post(
        `persongroups/${PERSON_GROUP_ID}/persons`,
        {
          name: studentName, // The student's name
          userData: studentId, // Store their Firebase ID here
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Get the 'personId' returned by Azure
      const personId = createPersonResponse.data.personId;
      console.log(`Created Person with personId: ${personId}`);

      await azureApi.post(
        `persongroups/${PERSON_GROUP_ID}/persons/${personId}/persistedFaces`,
        imageBuffer // The image data
      );

      console.log(`Added face to personId: ${personId}`);

      res.status(200).json({
        success: true,
        message: `Enrolled ${studentName} successfully.`,
        personId: personId, // The Azure ID
        studentId: studentId, // Your Firebase ID
      });
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error.message
        : error.message;
      console.error("Error in /enroll-student:", errorMessage);
      res.status(500).json({
        message: "An error occurred on the server.",
        error: errorMessage,
      });
    }
  }
);

// After adding students, the group must be trained
router.post("/train-group", async (req, res) => {
  try {
    await azureApi.post(`persongroups/${PERSON_GROUP_ID}/train`);

    console.log(`Training started for group: ${PERSON_GROUP_ID}`);
    res.status(202).json({ message: "Training started." });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.error.message
      : error.message;
    console.error("Error in /train-group:", errorMessage);
    res.status(500).json({
      message: "An error occurred on the server.",
      error: errorMessage,
    });
  }
});

// This is the endpoint our React Native app will call
router.post(
  "/mark-attendance",
  upload.single("faceImage"), // Use multer middleware to handle the image
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded." });
      }

      const imageBuffer = req.file.buffer;

      // We must first detect the face to get a temporary 'faceId'
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

      // Now we compare the detected faceId against our PersonGroup
      const identifyResponse = await azureApi.post(
        "identify",
        {
          faceIds: [faceId],
          personGroupId: PERSON_GROUP_ID,
        },
        {
          headers: {
            "Content-Type": "application/json", // Override default header
          },
        }
      );

      if (identifyResponse.data[0].candidates.length === 0) {
        return res.status(404).json({ message: "Student not recognized." });
      }

      // Get the best match (the first candidate)
      const bestMatch = identifyResponse.data[0].candidates[0];
      const personId = bestMatch.personId;
      const confidence = bestMatch.confidence;

      // should set a confidence threshold
      if (confidence < 0.7) {
        return res.status(400).json({
          message: `Student not recognized (Confidence too low: ${confidence})`,
        });
      }

      res.status(200).json({
        success: true,
        message: "Attendance marked successfully!",
        personId: personId, // This is the ID from Azure
        confidence: confidence,
      });
    } catch (error) {
      if (error.response) {
        console.error(
          "Error in /mark-attendance (Full Response):",
          JSON.stringify(error.response.data, null, 2)
        );
        const errorMessage = error.response.data.error
          ? error.response.data.error.message
          : JSON.stringify(error.response.data);
        res
          .status(500)
          .json({ message: "Error marking attendance", error: errorMessage });
      } else {
        console.error("Error in /mark-attendance:", error.message);
        res
          .status(500)
          .json({ message: "Error marking attendance", error: error.message });
      }
    }
  }
);

module.exports = router;
