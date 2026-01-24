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
    // 1. Get Data (Note: We now accept indexNumber instead of studentId)
    const { studentName, indexNumber, guardianName, contactNumber, homeAddress, grade, section } = req.body;

    // 2. Validate Required Text Fields
    if (!studentName || !indexNumber) {
      console.log("❌ Missing Data:", req.body);
      return res.status(400).json({ message: "Student Name and Index Number are required." });
    }

    let descriptorArray = [];
    let hasFace = false;

    // 3. Process Image ONLY if it exists
    if (req.file) {
      console.log("📸 Processing photo...");
      const img = await canvas.loadImage(req.file.buffer);
      const detections = await ssdNet.locateFaces(img);

      if (detections && detections.length > 0) {
        const face = detections[0];
        const landmarks = await landmarkNet.detectLandmarks(img, face);
        const descriptor = await recognitionNet.computeFaceDescriptor(img, landmarks);
        descriptorArray = Array.from(descriptor);
        hasFace = true;
      } else {
        console.log("⚠️ Photo uploaded, but NO FACE detected.");
        // We do NOT return error 400 here anymore. We just save without face data.
      }
    }

    // 4. Save to Firestore
    await db.collection("students").doc(indexNumber).set({
      studentName: studentName,
      studentId: indexNumber, // Fixed: Using indexNumber as studentId
      grade: grade || "",
      section: section || "",
      guardianName: guardianName,
      guardianPhone: contactNumber,
      homeAddress: homeAddress,
      faceDescriptor: Array.from(descriptor),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Registered: ${studentName}`);
    res.json({ success: true, message: "Student Registered Successfully" });

  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// --- 6. MARK ATTENDANCE ROUTE ---
// Server/routes/faceApi.js

// --- 6. MARK ATTENDANCE ROUTE (FIXED) ---
router.post("/mark-attendance", upload.single("faceImage"), async (req, res) => {
  if (!modelsLoaded) return res.status(503).json({ message: "Server initializing..." });

  try {
    if (!req.file) return res.status(400).json({ message: "No face image uploaded" });

    // 1. Load All Students from DB
    const studentsSnapshot = await db.collection("students").get();

    // 2. Prepare Face Matcher Data (CRITICAL FIX HERE)
    const labeledDescriptors = studentsSnapshot.docs
      .map(doc => {
        const data = doc.data();

        // --- THE FIX: Skip students with no face or wrong data length ---
        // A valid face descriptor ALWAYS has 128 numbers.
        if (!data.faceDescriptor || data.faceDescriptor.length !== 128) {
          return null;
        }

        return new faceapi.LabeledFaceDescriptors(
          data.studentName,
          [new Float32Array(data.faceDescriptor)]
        );
      })
      .filter(item => item !== null); // Remove the skipped students

    // If no one in the database has a face, we can't match anything
    if (labeledDescriptors.length === 0) {
      return res.status(404).json({ message: "No registered faces found in database." });
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

    // 3. Process the Uploaded Image
    const img = await canvas.loadImage(req.file.buffer);

    // 1. Detect Face
    const detections = await ssdNet.locateFaces(img);

    if (!detections || detections.length === 0) {
      return res.status(400).json({ message: "No face detected." });
    }

    const face = detections[0];
    const landmarks = await landmarkNet.detectLandmarks(img, face);
    const descriptor = await recognitionNet.computeFaceDescriptor(img, landmarks);

    // 4. Find Best Match
    const bestMatch = faceMatcher.findBestMatch(descriptor);

    if (bestMatch.label === "unknown") {
      return res.status(404).json({ message: "Face not recognized." });
    }

    // 5. Log Attendance
    const studentName = bestMatch.label;
    await db.collection("attendance").add({
      studentName: studentName,
      date: new Date().toISOString().split('T')[0],
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "Present"
    });

    console.log(`📍 Attendance Marked: ${studentName}`);
    res.json({ success: true, message: "Attendance Marked", student: studentName });

  } catch (error) {
    console.error("Attendance Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});


router.get("/students", async (req, res) => {
  try {
    const snapshot = await db.collection("students").orderBy("createdAt", "desc").get();

    if (snapshot.empty) {
      return res.json([]); // Return empty list if no students
    }

    const students = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(students);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch students" });
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