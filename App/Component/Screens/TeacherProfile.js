import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

// Import all Firebase services
import { firestore, storage } from "../../config/firebase"; // auth is not needed here
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- IMPORT YOUR HOOK ---
import useAuth from "../../hooks/useAuth";

// Re-usable InfoRow component
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoTextLabel}>{label}</Text>
    <Text style={styles.infoTextValue}>{value}</Text>
  </View>
);

// Re-usable TabIcon
const TabIcon = ({ name, label, active, onPress }) => (
  <TouchableOpacity style={styles.navButton} onPress={onPress}>
    <Ionicons name={name} size={20} color={active ? "#007BFF" : "#fff"} />
    <Text style={[styles.navText, active && { color: "#007BFF" }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function TeacherProfile() {
  const navigation = useNavigation();

  // --- USE YOUR AUTH HOOK ---
  // This gets the user data that was already loaded
  const { user, isAuthLoading } = useAuth();

  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // State for the edit modal
  const [editName, setEditName] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editClass, setEditClass] = useState("");

  // --- Pre-fill modal when user data loads ---
  useEffect(() => {
    if (user) {
      setEditName(user.username || "");
      setEditContact(user.contactNo || "");
      setEditClass(user.class || "");
    }
  }, [user]); // This runs whenever the 'user' object changes

  // Function to pick an image
  const pickImage = async () => {
    // ... (This function is correct, no changes needed)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photo library."
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.cancelled) {
      const uri = result.uri ?? result.assets?.[0]?.uri;
      if (uri) {
        uploadImage(uri);
      }
    }
  };

  // Function to upload the image
  const uploadImage = async (uri) => {
    if (!user) return; // Make sure user is loaded

    setIsUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      // Use the user.uid from the hook
      const storageRef = ref(storage, `profileImages/${user.uid}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Determine the correct collection based on role
      const collectionName = user.role === "Admin" ? "admins" : "teachers";
      const userDocRef = doc(firestore, collectionName, user.uid);

      await updateDoc(userDocRef, {
        profileImageUrl: downloadURL,
      });

      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Function to save the edited text data
  const handleSaveChanges = async () => {
    if (!user) return; // Make sure user is loaded

    try {
      // Determine the correct collection based on role
      const collectionName = user.role === "Admin" ? "admins" : "teachers";
      const userDocRef = doc(firestore, collectionName, user.uid);

      await updateDoc(userDocRef, {
        username: editName,
        contactNo: editContact,
        class: editClass,
      });
      setModalVisible(false);
      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  // Use the loading state from your hook
  if (isAuthLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // If loading is done but user is still null (logged out)
  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={styles.infoTextValue}>
          User not found. Please log in again.
        </Text>
      </View>
    );
  }

  // --- Main Render ---
  // All 'userData' is replaced with 'user'
  return (
    <View style={styles.container}>
      {/* --- Header --- */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>View Profile</Text>
        </View>
      </View>

      {/* --- Profile Picture --- */}
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={pickImage} disabled={isUploading}>
          <Image
            source={{
              uri:
                user.profileImageUrl ||
                "https://placehold.co/100x100/A020F0/white?text=User",
            }}
            style={styles.logo}
            resizeMode="cover"
          />
          {isUploading && (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
          <View style={styles.editIcon}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* --- Info Container --- */}
      <View style={styles.infoContainer}>
        <InfoRow label="Name" value={user.username || "N/A"} />
        <InfoRow label="Staff ID" value={user.staffId || "N/A"} />
        <InfoRow label="Email Address" value={user.email || "N/A"} />
        <InfoRow label="Contact No" value={user.contactNo || "N/A"} />
        <InfoRow label="Class" value={user.class || "N/A"} />
        <InfoRow label="Role" value={user.role || "N/A"} />
      </View>

      {/* --- Edit Button --- */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.editButtonText}>Edit Profile Details</Text>
      </TouchableOpacity>

      {/* --- Bottom Nav --- */}
      <View style={styles.bottomNav}>
        <TabIcon
          name="home"
          label="Dashboard"
          onPress={() => navigation.navigate("Dashboard")}
        />
        <TabIcon name="notifications" label="Notifications" />
        <TabIcon
          name="settings"
          label="Settings"
          onPress={() => navigation.navigate("SettingsScreen")}
        />
      </View>

      {/* --- Edit Modal --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Contact No"
              placeholderTextColor="#888"
              value={editContact}
              onChangeText={setEditContact}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Class (e.g., Grade 7-A)"
              placeholderTextColor="#888"
              value={editClass}
              onChangeText={setEditClass}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#555" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#007BFF" }]}
                onPress={handleSaveChanges}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- Styles ---
// (All your existing styles are perfect, no changes needed)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 80, // Space for bottom nav
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
    marginRight: 40, // Offset back button
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#007BFF",
    padding: 6,
    borderRadius: 15,
  },
  infoContainer: {
    marginBottom: 20,
    gap: 12,
  },
  infoRow: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoTextLabel: {
    color: "#ccc",
    fontSize: 14,
  },
  infoTextValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1E1E1E",
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    color: "#fff",
    marginTop: 4,
    fontSize: 12,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  modalInput: {
    width: "100%",
    backgroundColor: "#333",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
