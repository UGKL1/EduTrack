// AttendanceScreen.safeImagePicker.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

// --- CHANGE THIS to your backend URL (use device-accessible IP) ---
const BACKEND_API_URL = "http://192.168.1.10:3000/api"; // <-- replace

export default function AttendanceScreen({ navigation }) {
  const [permissionState, setPermissionState] = useState(null); // null | "granted" | "denied"
  const [isLoading, setIsLoading] = useState(false);
  const [pickedUri, setPickedUri] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  // Request permission and auto-open camera on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setPermissionState(status);

        if (status === "granted") {
          // Auto-launch camera once when screen opens
          await openCameraAndUpload({ autoLaunched: true });
        }
      } catch (err) {
        console.warn("Permission request failed:", err);
        setPermissionState("denied");
      }
    })();
  }, []);

  // open device camera using system UI
  const openCameraAndUpload = async ({ autoLaunched = false } = {}) => {
    if (permissionState !== "granted") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setPermissionState(status);
      if (status !== "granted") {
        if (!autoLaunched)
          Alert.alert(
            "Permission required",
            "Please grant camera permission in settings."
          );
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      });

      // result shape depends on SDK: sometimes { cancelled } or { assets: [...] }
      if (result.cancelled) return;
      const uri = result.uri ?? result.assets?.[0]?.uri;
      if (!uri) return;

      setPickedUri(uri);
      await uploadImage(uri);
    } catch (err) {
      console.error("Camera open failed:", err);
      setScanResult({ success: false, message: "Could not open camera." });
    }
  };

  // upload image to backend as 'faceImage'
  const uploadImage = async (uri) => {
    setIsLoading(true);
    setScanResult(null);

    try {
      const formData = new FormData();
      const uriParts = uri.split(".");
      const fileType = uriParts[uriParts.length - 1] || "jpg";

      formData.append("faceImage", {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      const res = await axios.post(
        `${BACKEND_API_URL}/mark-attendance`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 25000,
        }
      );

      setScanResult({
        success: true,
        message: res.data?.message ?? "Attendance marked.",
      });
    } catch (err) {
      console.error(
        "Upload failed:",
        err?.response?.data ?? err.message ?? err
      );
      const msg = err.response?.data?.message ?? "Student not recognized.";
      setScanResult({ success: false, message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  // UI states
  if (permissionState === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.scanText}>Checking camera permission…</Text>
      </View>
    );
  }

  if (permissionState !== "granted") {
    return (
      <View style={styles.container}>
        <Text style={styles.scanText}>
          We need permission to use your camera
        </Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            setPermissionState(status);
            if (status === "granted") openCameraAndUpload();
          }}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main screen
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.scanText}>Tap the button to take a photo</Text>

        <View style={styles.scanFrame}>
          {pickedUri ? (
            <Image
              source={{ uri: pickedUri }}
              style={styles.camera}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.camera,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text style={{ color: "#fff" }}>No photo yet</Text>
            </View>
          )}

          <View style={styles.overlay}>
            {isLoading && <ActivityIndicator size="large" color="#fff" />}
            {scanResult && !isLoading && (
              <View style={styles.resultContainer}>
                <FontAwesome5
                  name={scanResult.success ? "check-circle" : "times-circle"}
                  size={60}
                  color={scanResult.success ? "#4CAF50" : "#F44336"}
                />
                <Text
                  style={[
                    styles.resultText,
                    { color: scanResult.success ? "#4CAF50" : "#F44336" },
                  ]}
                >
                  {scanResult.message}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            style={[styles.captureButton, isLoading && { opacity: 0.6 }]}
            onPress={() => openCameraAndUpload({ autoLaunched: false })}
            disabled={isLoading}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallButton, isLoading && { opacity: 0.6 }]}
            onPress={() => {
              setPickedUri(null);
              setScanResult(null);
            }}
            disabled={isLoading}
          >
            <FontAwesome5 name="trash" size={18} color="#fff" />
            <Text style={styles.smallButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Styles (kept similar to your UI)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "center",
  },
  backButton: { position: "absolute", left: 0 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  content: { flex: 1, alignItems: "center" },
  scanText: { color: "#fff", fontSize: 16, marginBottom: 12 },
  scanFrame: {
    width: 320,
    height: 420,
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#007BFF",
    marginBottom: 20,
    overflow: "hidden",
  },
  camera: { flex: 1, width: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  resultContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0,123,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    marginHorizontal: 12,
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#007BFF",
  },
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  smallButtonText: { color: "#fff", marginLeft: 6 },
  viewButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    minWidth: 120,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
