const express = require("express");
const multer = require("multer");
const faceapi = require("face-api.js"); // Using the standard library
const canvas = require("canvas");
const path = require("path");

const router = express.Router();

// 1. Setup Canvas for FaceAPI in Node.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// 2. Setup Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 3. Global Variables
let labeledDescriptors = [];
let modelsLoaded = false;

// 4. Load Models Manually (The FIX for Node.js)
async function loadModels() {
  const modelPath = path.join(__dirname, "../models");
  console.log("⏳ Loading AI models from:", modelPath);

  try {
    // Manually create the neural networks (Fixes "undefined" error)
    faceapi.nets.ssdMobilenetv1 = new faceapi.SsdMobilenetv1();
    faceapi.nets.faceLandmark68 = new faceapi.FaceLandmark68Net();
    faceapi.nets.faceRecognitionNet = new faceapi.FaceRecognitionNet();

    // Now load the weights from disk
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);

    modelsLoaded = true;
    console.log("✅ AI Models Loaded Successfully");
  } catch (error) {
    console.error("❌ Error loading models:", error);
  }
}
loadModels();

// =========================================================
// ROUTE: ENROLL STUDENT
// =========================================================
router.post("/enroll-student", upload.single("faceImage"), async (req, res) => {
  if (!modelsLoaded) return res.status(503).json({ message: "Models loading..." });

  try {
    const { studentId, studentName } = req.body;
    if (!req.file || !studentName) return res.status(400).json({ message: "Image and Name required" });

    const img = await canvas.loadImage(req.file.buffer);

    const detection = await faceapi.detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return res.status(400).json({ message: "No face detected." });

    const newDescriptor = new faceapi.LabeledFaceDescriptors(studentName, [detection.descriptor]);
    labeledDescriptors.push(newDescriptor);

    console.log(`✅ Enrolled: ${studentName}`);
    res.json({ success: true, message: `Enrolled ${studentName}` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Enrollment failed" });
  }
});

// =========================================================
// ROUTE: MARK ATTENDANCE
// =========================================================
router.post("/mark-attendance", upload.single("faceImage"), async (req, res) => {
  if (!modelsLoaded) return res.status(503).json({ message: "Models loading..." });

  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const img = await canvas.loadImage(req.file.buffer);

    const detection = await faceapi.detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return res.status(400).json({ message: "No face detected." });

    if (labeledDescriptors.length === 0) {
      return res.status(404).json({ message: "No students registered." });
    }

    const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
    const bestMatch = matcher.findBestMatch(detection.descriptor);

    if (bestMatch.label === "unknown") {
      return res.status(401).json({ message: "Student not recognized." });
    }

    console.log(`📍 Attendance marked for: ${bestMatch.label}`);
    res.json({
      success: true,
      message: `Welcome, ${bestMatch.label}!`,
      student: bestMatch.label
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Processing failed" });
  }
});

// Dummy routes for compatibility
router.post("/create-group", (req, res) => res.json({ message: "OK" }));
router.post("/train-group", (req, res) => res.json({ message: "OK" }));

module.exports = router;