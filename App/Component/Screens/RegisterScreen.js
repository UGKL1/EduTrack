import React, { useState } from "react";
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

const GRADES = ["1", "2", "3", "4", "5"];
const SECTIONS = ["A", "B", "C", "D", "E"];

export default function RegisterScreen({ navigation }) {
  // --- STATE ---
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState(""); // State for ID
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal Visibility States
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [sectionModalVisible, setSectionModalVisible] = useState(false);

  // --- 1. CAMERA FUNCTION (EXACT PREVIOUS METHOD) ---
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleRegister = async () => {
    // Check if Name, ID, or Image is missing
    if (!name || !studentId || !image) {
      return Alert.alert("Missing Data", "Please enter Name, Student ID, and take a photo.");
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("studentName", name);
      formData.append("studentId", studentId); // Send the REAL ID now
      
      const filename = image.split('/').pop();
      // Auto-detect file type (jpg/png)
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("faceImage", { 
      uri: Platform.OS === "android" ? image : image.replace("file://", ""),
      name: filename, 
      type: type 
      });

      console.log("Sending data to:", `${BACKEND_API_URL}/enroll-student`);

      await axios.post(`${BACKEND_API_URL}/enroll-student`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Student Registered Successfully!");
      setName("");
      setStudentId("");
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

      {/* Student ID Input (NEW) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Student ID</Text>
        <TextInput 
          placeholder="e.g. S001" 
          placeholderTextColor="#666"
          value={studentId} onChangeText={setStudentId}
          style={styles.input}
        />
      </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Home Address</Text>
            <TextInput 
              placeholder="No, Street, City" 
              placeholderTextColor="#666"
              value={address} onChangeText={setAddress}
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
              multiline
            />
          </View>

          {/* Section: Biometric Data */}
          <Text style={styles.sectionHeader}>Biometric Data</Text>

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
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#fff"/>
        ) : (
          <Text style={styles.buttonText}>Register Now</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
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
  label: { color: "#ccc", marginBottom: 5, alignSelf: "flex-start" },
  input: { 
    width: "100%", backgroundColor: "#1E1E1E", color: "#fff", 
    padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#333" 
  },
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
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 }
});