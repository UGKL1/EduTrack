const express = require("express");
const multer = require("multer");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

// --- 1. SETUP FIREBASE ---
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// --- 2. SETUP FACE API ENV ---
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- 3. CREATE NETWORKS MANUALLY ---
// We create them here to ensure they exist forever
const ssdNet = new faceapi.SsdMobilenetv1();
const landmarkNet = new faceapi.FaceLandmark68Net();
const recognitionNet = new faceapi.FaceRecognitionNet();

let modelsLoaded = false;

// --- 4. LOAD MODELS ---
async function loadModels() {
  const modelPath = path.join(__dirname, "../models");
  console.log("📂 Loading models from:", modelPath);

  try {
    // Load weights directly into our specific variables
    await ssdNet.loadFromDisk(modelPath);
    await landmarkNet.loadFromDisk(modelPath);
    await recognitionNet.loadFromDisk(modelPath);

    // Verify they are loaded
    if (!landmarkNet.params) {
        throw new Error("LandmarkNet failed to load weights.");
    }

    modelsLoaded = true;
    console.log("✅ SYSTEM READY: AI Models loaded.");

  } catch (error) {
    console.error("❌ Model Loading Failed:", error);
  }
}
loadModels();

// --- 5. REGISTER STUDENT ROUTE ---
router.post("/enroll-student", upload.single("faceImage"), async (req, res) => {
  if (!modelsLoaded) return res.status(503).json({ message: "Server initializing..." });

  try {
    const { studentId, studentName } = req.body;
    if (!req.file || !studentId || !studentName) return res.status(400).json({ message: "Missing data" });

    const img = await canvas.loadImage(req.file.buffer);
    
    // --- DIRECT DETECTION (Bypasses Helper) ---
    // 1. Find the face box
    const detections = await ssdNet.locateFaces(img);
    if (!detections || detections.length === 0) {
        return res.status(400).json({ message: "No face detected." });
    }
    const face = detections[0]; // Take the first face

    // 2. Find the landmarks (Eyes/Nose)
    const landmarks = await landmarkNet.detectLandmarks(img, face);

    // 3. Calculate Descriptor (Face ID)
    const descriptor = await recognitionNet.computeFaceDescriptor(img, landmarks);

    // Save to Firestore
    await db.collection("students").doc(studentId).set({
      studentName: studentName,
      studentId: studentId,
      faceDescriptor: Array.from(descriptor),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Registered: ${studentName}`);
    res.json({ success: true, message: "Student Registered" });

  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// --- 6. MARK ATTENDANCE ROUTE ---
router.post("/mark-attendance", upload.single("faceImage"), async (req, res) => {
  if (!modelsLoaded) return res.status(503).json({ message: "Server initializing..." });

  try {
    if (!req.file) return res.status(400).json({ message: "No photo uploaded" });

    const img = await canvas.loadImage(req.file.buffer);
    
    // --- DIRECT DETECTION ---
    const detections = await ssdNet.locateFaces(img);
    if (!detections || detections.length === 0) {
        return res.status(400).json({ message: "No face detected." });
    }
    const face = detections[0]; 

    const landmarks = await landmarkNet.detectLandmarks(img, face);
    const descriptor = await recognitionNet.computeFaceDescriptor(img, landmarks);

    // DB Matching
    const studentsSnapshot = await db.collection("students").get();
    if (studentsSnapshot.empty) return res.status(404).json({ message: "No students found." });

    const labeledDescriptors = studentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return new faceapi.LabeledFaceDescriptors(data.studentName, [new Float32Array(data.faceDescriptor)]);
    });

    const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
    const bestMatch = matcher.findBestMatch(descriptor);

    if (bestMatch.label === "unknown") return res.status(401).json({ message: "Face not recognized." });

    await db.collection("attendance").add({
      studentName: bestMatch.label,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "Present"
    });

    console.log(`📍 Attendance: ${bestMatch.label}`);
    res.json({ success: true, message: `Welcome, ${bestMatch.label}!`, student: bestMatch.label });

  } catch (error) {
    console.error("Attendance Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;