import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Image, Alert, 
  ActivityIndicator, ScrollView, StyleSheet 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from '../config/config';

const BACKEND_API_URL = API_URL;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState(""); // State for ID
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
        uri: image, 
        name: filename, 
        type: type 
      });

      console.log("Sending data to:", `${BACKEND_API_URL}/enroll-student`);

      const response = await axios.post(`${BACKEND_API_URL}/enroll-student`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Student Registered Successfully!");
      setName("");
      setStudentId("");
      setImage(null);

    } catch (err) {
      console.error(err);
      // EXTRACT THE REAL SERVER ERROR MESSAGE
      const serverMessage = err.response?.data?.message || "Registration failed. Check connection.";
      Alert.alert("Registration Failed", serverMessage);
    } finally {
      setLoading(false);
    }
  };

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
          <ActivityIndicator color="#fff"/>
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