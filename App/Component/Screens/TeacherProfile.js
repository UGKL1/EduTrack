import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { firestore, storage } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

export default function TeacherProfile() {
  const navigation = useNavigation();
  const { user, isAuthLoading } = useAuth();
  const { colors } = useTheme();

  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // State for editing
  const [editName, setEditName] = useState("");
  const [editContact, setEditContact] = useState("");
  // CHANGED: Split class into grade and section
  const [editGrade, setEditGrade] = useState(""); 
  const [editSection, setEditSection] = useState("");

  useEffect(() => {
    if (user) {
      setEditName(user.username || "");
      setEditContact(user.contactNo || "");
      // CHANGED: Load specific fields
      setEditGrade(user.grade || "");
      setEditSection(user.section || "");
    }
  }, [user]);

  const InfoRow = ({ label, value }) => (
    <View style={[styles.infoRow, { backgroundColor: colors.card }]}>
      <Text style={[styles.infoTextLabel, { color: colors.subText }]}>{label}</Text>
      <Text style={[styles.infoTextValue, { color: colors.text }]}>{value}</Text>
    </View>
  );

  const TabIcon = ({ name, label, active, onPress }) => (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
      <Ionicons name={name} size={20} color={active ? colors.primary : colors.text} />
      <Text style={[styles.navText, { color: active ? colors.primary : colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant permission to access your photo library.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) { // Note: 'cancelled' is deprecated in newer expo versions, usually 'canceled'
      const uri = result.uri ?? result.assets?.[0]?.uri;
      if (uri) uploadImage(uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!user) return;
    setIsUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      const collectionName = user.role === "Admin" ? "admins" : "teachers";
      const userDocRef = doc(firestore, collectionName, user.uid);
      await updateDoc(userDocRef, { profileImageUrl: downloadURL });
      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    try {
      const collectionName = user.role === "Admin" ? "admins" : "teachers";
      const userDocRef = doc(firestore, collectionName, user.uid);
      
      // CHANGED: Save Grade and Section separately
      await updateDoc(userDocRef, {
        username: editName,
        contactNo: editContact,
        grade: editGrade,
        section: editSection,
        // We also save 'class' string for display compatibility
        class: `${editGrade}-${editSection}`
      });
      
      setModalVisible(false);
      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  if (isAuthLoading || !user) {
    return (
      <View style={[styles.container, { justifyContent: "center", backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleWrapper}>
          <Text style={[styles.title, { color: colors.text }]}>View Profile</Text>
        </View>
      </View>

      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={pickImage} disabled={isUploading}>
          <Image
            source={{ uri: user.profileImageUrl || "https://placehold.co/100x100/A020F0/white?text=User" }}
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

      <View style={styles.infoContainer}>
        <InfoRow label="Name" value={user.username || "N/A"} />
        <InfoRow label="Staff ID" value={user.staffId || "N/A"} />
        <InfoRow label="Email Address" value={user.email || "N/A"} />
        <InfoRow label="Contact No" value={user.contactNo || "N/A"} />
        {/* Helper to display class properly */}
        <InfoRow label="Class" value={user.class || `${user.grade || ''}-${user.section || ''}`} />
        <InfoRow label="Role" value={user.role || "N/A"} />
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.editButtonText}>Edit Profile Details</Text>
      </TouchableOpacity>

      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TabIcon name="home" label="Dashboard" onPress={() => navigation.navigate("Dashboard")} />
        <TabIcon name="notifications" label="Notifications" onPress={() => navigation.navigate("NotificationsScreen")}/>
        <TabIcon name="settings" label="Settings" onPress={() => navigation.navigate("SettingsScreen")} />
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
            
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Full Name"
              placeholderTextColor={colors.placeholder}
              value={editName}
              onChangeText={setEditName}
            />
            
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Contact No"
              placeholderTextColor={colors.placeholder}
              value={editContact}
              onChangeText={setEditContact}
              keyboardType="phone-pad"
            />
            
            {/* CHANGED: Separate Grade Input */}
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Grade (e.g. 10)"
              placeholderTextColor={colors.placeholder}
              value={editGrade}
              onChangeText={setEditGrade}
              keyboardType="numeric"
            />

            {/* CHANGED: Separate Section Input */}
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Section (e.g. A)"
              placeholderTextColor={colors.placeholder}
              value={editSection}
              onChangeText={setEditSection}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.subText }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.primary }]} onPress={handleSaveChanges}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 80,
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
    marginRight: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoTextLabel: {
    fontSize: 14,
  },
  infoTextValue: {
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
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    width: "90%",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    width: "100%",
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