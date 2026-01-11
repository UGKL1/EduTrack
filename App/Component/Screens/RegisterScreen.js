import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, Alert,
  ActivityIndicator, ScrollView, StyleSheet, Platform, Modal, FlatList
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from '../../config/config';

const BACKEND_API_URL = API_URL;

const GRADES = ["1", "2", "3", "4", "5"];
const SECTIONS = ["A", "B", "C", "D", "E"];

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal Visibility States
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [sectionModalVisible, setSectionModalVisible] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const validateInputs = () => {
    if (!name || !studentId || !image || !grade || !section || !guardianName || !guardianPhone) {
      Alert.alert("Missing Data", "Please fill all fields and take a photo.");
      return false;
    }

    // Guardian Name Validation (No numbers)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(guardianName)) {
      Alert.alert("Invalid Input", "Guardian Name cannot contain numbers.");
      return false;
    }

    // Phone Validation (Exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(guardianPhone)) {
      Alert.alert("Invalid Input", "Phone Number must be exactly 10 digits.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("studentName", name);
      formData.append("studentId", studentId);
      formData.append("grade", grade);
      formData.append("section", section);
      formData.append("guardianName", guardianName);
      formData.append("guardianPhone", guardianPhone);

      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("faceImage", {
        uri: Platform.OS === "android" ? image : image.replace("file://", ""),
        name: filename,
        type: type
      });

      console.log("Sending data to:", `${BACKEND_API_URL}/enroll-student`);

      const response = await axios.post(`${BACKEND_API_URL}/enroll-student`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Student Registered Successfully!");
      // Reset Form
      setName("");
      setStudentId("");
      setGrade("");
      setSection("");
      setGuardianName("");
      setGuardianPhone("");
      setImage(null);

    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.message || "Registration failed. Check connection.";
      Alert.alert("Registration Failed", serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPickerModal = (visible, setVisible, data, onSelect, title) => (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { onSelect(item); setVisible(false); }}>
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Register Student</Text>

      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="e.g. John Doe"
          placeholderTextColor="#666"
          value={name} onChangeText={setName}
          style={styles.input}
        />
      </View>

      {/* Student ID Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Student ID</Text>
        <TextInput
          placeholder="e.g. S001"
          placeholderTextColor="#666"
          value={studentId} onChangeText={setStudentId}
          style={styles.input}
        />
      </View>

      {/* Class Selection */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>Grade (1-5)</Text>
          <TouchableOpacity onPress={() => setGradeModalVisible(true)} style={styles.pickerButton}>
            <Text style={[styles.pickerText, !grade && { color: "#666" }]}>{grade || "Select"}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Section (A-E)</Text>
          <TouchableOpacity onPress={() => setSectionModalVisible(true)} style={styles.pickerButton}>
            <Text style={[styles.pickerText, !section && { color: "#666" }]}>{section || "Select"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderPickerModal(gradeModalVisible, setGradeModalVisible, GRADES, setGrade, "Select Grade")}
      {renderPickerModal(sectionModalVisible, setSectionModalVisible, SECTIONS, setSection, "Select Section")}

      {/* Guardian Details */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Guardian Name</Text>
        <TextInput
          placeholder="No numbers allowed"
          placeholderTextColor="#666"
          value={guardianName} onChangeText={setGuardianName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Guardian Phone</Text>
        <TextInput
          placeholder="10 digits"
          placeholderTextColor="#666"
          value={guardianPhone} onChangeText={setGuardianPhone}
          keyboardType="numeric"
          maxLength={10}
          style={styles.input}
        />
      </View>

      {/* Camera Section */}
      <Text style={styles.label}>Face Photo</Text>
      <TouchableOpacity onPress={pickImage} style={styles.cameraBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.cameraText}>Tap to Take Photo</Text>
        )}
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register Now</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#0D0D0D", padding: 20, alignItems: "center" },
  header: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 30, marginTop: 10 },
  inputGroup: { width: "100%", marginBottom: 15 },
  label: { color: "#ccc", marginBottom: 5, alignSelf: "flex-start" },
  input: {
    width: "100%", backgroundColor: "#1E1E1E", color: "#fff",
    padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#333"
  },
  row: { flexDirection: "row", width: "100%", justifyContent: "space-between" },
  pickerButton: {
    backgroundColor: "#1E1E1E", padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#333",
    alignItems: "center"
  },
  pickerText: { color: "#fff", fontSize: 16 },
  cameraBox: {
    width: 200, height: 200, backgroundColor: "#1E1E1E",
    justifyContent: "center", alignItems: "center", marginBottom: 30,
    borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#007AFF'
  },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  cameraText: { color: "#007AFF", fontSize: 16 },
  button: {
    backgroundColor: "#007AFF", padding: 16, borderRadius: 10,
    width: "100%", alignItems: "center", marginBottom: 20
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "80%", backgroundColor: "#1E1E1E", borderRadius: 10, padding: 20, maxHeight: "50%" },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#333" },
  modalItemText: { color: "#fff", fontSize: 16, textAlign: "center" },
  closeButton: { marginTop: 15, backgroundColor: "#333", padding: 10, borderRadius: 5, alignItems: "center" },
  closeButtonText: { color: "#fff" }
});