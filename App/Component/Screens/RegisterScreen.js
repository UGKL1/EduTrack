import React, { useState } from "react";
import { notifyStudentRegistered } from './NotificationHelper';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  ActivityIndicator, ScrollView, StyleSheet, Platform, KeyboardAvoidingView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { API_URL } from '../../config/config';

// Use your specific API URL
const BACKEND_API_URL = API_URL;

export default function RegisterScreen({ navigation }) {
  // --- STATE ---
  const [name, setName] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [grade, setGrade] = useState(""); // Added Grade
  const [section, setSection] = useState(""); // Added Section
  const [guardianName, setGuardianName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- 1. CAMERA FUNCTION ---
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        // No editing/cropping to avoid crashes on some devices
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        Alert.alert("✅ Photo Captured", "Face data is ready.");
      }
    } catch (error) {
      console.log("Camera Error:", error);
      Alert.alert("Error", "Could not open camera.");
    }
  };

  // --- 2. REGISTER FUNCTION (Now Checks ALL Fields) ---
  const handleRegister = async () => {
    // 🚨 VALIDATION CHECK: All text fields are now REQUIRED
    if (!name || !indexNumber || !grade || !section || !guardianName || !contactNumber || !address || !image) {
      return Alert.alert("Missing Data", "All fields (Name, Index, Grade, Section, Guardian, Contact, Address) are required.");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("studentName", name);
      formData.append("indexNumber", indexNumber);
      formData.append("grade", grade);
      formData.append("section", section);
      formData.append("guardianName", guardianName);
      formData.append("contactNumber", contactNumber);
      formData.append("homeAddress", address);

      // Image remains OPTIONAL (only appended if taken)
      if (image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("faceImage", {
          uri: Platform.OS === "android" ? image : image.replace("file://", ""),
          name: filename,
          type: type
        });
      }

      console.log("Sending data to:", `${BACKEND_API_URL}/enroll-student`);

      await axios.post(`${BACKEND_API_URL}/enroll-student`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

// 🔔 Add Firestore notification
await notifyStudentRegistered(name);

Alert.alert("Success", "Student Registered Successfully!", [
  { text: "OK", onPress: () => navigation.navigate("Notifications") }
]);

// Reset Form
setName("");
setIndexNumber("");
setGrade("");
setSection("");
setGuardianName("");
setContactNumber("");
setAddress("");
setImage(null);


    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.message || "Registration failed. Check connection.";
      Alert.alert("Registration Failed", serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0D0D0D" }}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register New Student</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>

          {/* Section: Basic Info */}
          <Text style={styles.sectionHeader}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              placeholder="e.g. John Doe"
              placeholderTextColor="#666"
              value={name} onChangeText={setName}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Index Number *</Text>
            <TextInput
              placeholder="e.g. 20001234"
              placeholderTextColor="#666"
              value={indexNumber} onChangeText={setIndexNumber}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Grade *</Text>
            <TextInput
              placeholder="e.g. 10"
              placeholderTextColor="#666"
              value={grade} onChangeText={setGrade}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Section *</Text>
            <TextInput
              placeholder="e.g. A"
              placeholderTextColor="#666"
              value={section} onChangeText={setSection}
              style={styles.input}
            />
          </View>

          {/* Section: Contact Info */}
          <Text style={styles.sectionHeader}>Contact Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Guardian Name *</Text>
            <TextInput
              placeholder="Parent Name"
              placeholderTextColor="#666"
              value={guardianName} onChangeText={setGuardianName}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              placeholder="07X XXXXXXX"
              placeholderTextColor="#666"
              value={contactNumber} onChangeText={setContactNumber}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Home Address *</Text>
            <TextInput
              placeholder="No, Street, City"
              placeholderTextColor="#666"
              value={address} onChangeText={setAddress}
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              multiline
            />
          </View>

          {/* Section: Biometric Data */}
          <Text style={styles.sectionHeader}>Biometric Data (Optional)</Text>

          <TouchableOpacity onPress={pickImage} style={[styles.cameraBox, image && styles.cameraBoxSuccess]}>
            {image ? (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={50} color="#27ae60" />
                <Text style={[styles.cameraText, { color: "#27ae60" }]}>Photo Captured</Text>
                <Text style={{ color: "#666", fontSize: 12, marginTop: 5 }}>(Tap to Retake)</Text>
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="scan-outline" size={40} color="#007AFF" />
                <Text style={styles.cameraText}>Scan Face</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register Student</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#0D0D0D",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: { padding: 10, marginRight: 10 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  container: { flexGrow: 1, padding: 20, alignItems: "center" },
  sectionHeader: {
    width: "100%", color: "#007AFF", fontSize: 14, fontWeight: "bold",
    marginTop: 15, marginBottom: 15, textTransform: "uppercase", letterSpacing: 1
  },
  inputGroup: { width: "100%", marginBottom: 15 },
  label: { color: "#ccc", marginBottom: 8, fontSize: 14, fontWeight: '600', alignSelf: "flex-start" },
  input: {
    width: "100%", backgroundColor: "#1E1E1E", color: "#fff",
    padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#333", fontSize: 16
  },
  cameraBox: {
    width: "100%", height: 120, backgroundColor: "#1E1E1E",
    justifyContent: "center", alignItems: "center", marginBottom: 20,
    borderRadius: 10,
    borderStyle: 'dashed', borderWidth: 2, borderColor: '#007AFF'
  },
  cameraBoxSuccess: {
    borderColor: '#27ae60',
    backgroundColor: 'rgba(39, 174, 96, 0.1)'
  },
  cameraText: { color: "#007AFF", fontSize: 16, marginTop: 5, fontWeight: "600" },
  button: {
    backgroundColor: "#007AFF", padding: 18, borderRadius: 10,
    width: "100%", alignItems: "center", marginTop: 20
  },
  buttonDisabled: { backgroundColor: "#333" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 }
});