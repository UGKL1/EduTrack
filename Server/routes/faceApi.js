const express = require("express");
const multer = require("multer");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

// --- 1. SETUP FIREBASE ADMIN ---
// We use a try-catch block to debug the key file specifically
try {
  const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`File not found at: ${serviceAccountPath}`);
  }

  const serviceAccount = require(serviceAccountPath);

  // Initialize Firebase (only if not already running)
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log(`✅ Firebase Connected: ${serviceAccount.project_id}`);
  }

} catch (error) {
  console.error("❌ FIREBASE ERROR: Could not load serviceAccountKey.json");
  console.error("   Reason:", error.message);
  console.error("   -> Did you download a NEW key and put it in the Server folder?");
  process.exit(1); // Stop server so you can fix it
}

const db = admin.firestore();

// --- 2. SETUP FACE API ENV ---
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- 3. CREATE NETWORKS MANUALLY ---
// Create the neural networks
const ssdNet = new faceapi.SsdMobilenetv1();
const landmarkNet = new faceapi.FaceLandmark68Net();
const recognitionNet = new faceapi.FaceRecognitionNet();

let modelsLoaded = false;

// --- 4. LOAD MODELS ---
async function loadModels() {
  const modelPath = path.join(__dirname, "../models");
  console.log("📂 Loading models from:", modelPath);

  try {
    // Load weights directly into memory
    await ssdNet.loadFromDisk(modelPath);
    await landmarkNet.loadFromDisk(modelPath);
    await recognitionNet.loadFromDisk(modelPath);

    // Verify loading
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
    const { studentId, studentName, grade, section, guardianName, guardianPhone } = req.body;
    if (!req.file || !studentId || !studentName) return res.status(400).json({ message: "Missing data" });

    const img = await canvas.loadImage(req.file.buffer);

    // 1. Detect Face
    const detections = await ssdNet.locateFaces(img);
    if (!detections || detections.length === 0) {
      return res.status(400).json({ message: "No face detected." });
    }
    const face = detections[0];

    // 2. Landmarks & Descriptor
    const landmarks = await landmarkNet.detectLandmarks(img, face);
    const descriptor = await recognitionNet.computeFaceDescriptor(img, landmarks);

    // 3. Save to Firestore
    await db.collection("students").doc(studentId).set({
      studentName: studentName,
      studentId: studentId,
      grade: grade || null,
      section: section || null,
      guardianName: guardianName || null,
      guardianPhone: guardianPhone || null,
      faceDescriptor: Array.from(descriptor),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Registered: ${studentName}`);
    res.json({ success: true, message: "Student Registered" });

  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// --- 6. MARK ATTENDANCE ROUTE ---
router.post("/mark-attendance", upload.single("faceImage"), async (req, res) => {
  if (!modelsLoaded) return res.status(503).json({ message: "Server initializing..." });

  try {
    if (!req.file) return res.status(400).json({ message: "No photo uploaded" });

    const img = await canvas.loadImage(req.file.buffer);

    // 1. Detect Face
    const detections = await ssdNet.locateFaces(img);
    if (!detections || detections.length === 0) {
      return res.status(400).json({ message: "No face detected." });
    }
    const face = detections[0];

    // 2. Landmarks & Descriptor
    const landmarks = await landmarkNet.detectLandmarks(img, face);
    const descriptor = await recognitionNet.computeFaceDescriptor(img, landmarks);

    // 3. Match against Database
    const studentsSnapshot = await db.collection("students").get();
    if (studentsSnapshot.empty) return res.status(404).json({ message: "No students found." });

    const labeledDescriptors = studentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return new faceapi.LabeledFaceDescriptors(data.studentName, [new Float32Array(data.faceDescriptor)]);
    });

    const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
    const bestMatch = matcher.findBestMatch(descriptor);

    if (bestMatch.label === "unknown") return res.status(401).json({ message: "Face not recognized." });

    // 4. Record Attendance
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

// --- 7. MANAGE STUDENTS ROUTES ---

// GET All Students
router.get("/students", async (req, res) => {
  try {
    const snapshot = await db.collection("students").get();
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (error) {
    console.error("Fetch Students Error:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// PUT Update Student
router.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, grade, section, guardianName, guardianPhone } = req.body;

    await db.collection("students").doc(id).update({
      studentName, grade, section, guardianName, guardianPhone
    });

    res.json({ success: true, message: "Student Updated" });
  } catch (error) {
    console.error("Update Student Error:", error);
    res.status(500).json({ message: "Failed to update student" });
  }
});

// DELETE Student
router.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("students").doc(id).delete();
    res.json({ success: true, message: "Student Deleted" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({ message: "Failed to delete student" });
  }
});

module.exports = router;