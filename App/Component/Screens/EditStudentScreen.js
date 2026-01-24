import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity, Alert,
    ActivityIndicator, ScrollView, StyleSheet, KeyboardAvoidingView, Platform
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { API_URL } from '../../config/config';

export default function EditStudentScreen({ route, navigation }) {
    // Get student data from navigation params
    const { student } = route.params;

    // --- STATE ---
    const [name, setName] = useState(student.studentName || "");
    const [indexNumber, setIndexNumber] = useState(student.studentId || "");
    const [grade, setGrade] = useState(student.grade || "");
    const [section, setSection] = useState(student.section || "");
    const [guardianName, setGuardianName] = useState(student.guardianName || "");
    const [contactNumber, setContactNumber] = useState(student.guardianPhone || "");
    const [address, setAddress] = useState(student.homeAddress || "");

    const [loading, setLoading] = useState(false);

    // --- UPDATE FUNCTION ---
    const handleUpdate = async () => {
        // 🚨 VALIDATION CHECK
        if (!name || !indexNumber || !grade || !section || !guardianName || !contactNumber || !address) {
            return Alert.alert("Missing Data", "All fields are required.");
        }

        setLoading(true);
        try {
            const updateData = {
                studentName: name,
                grade: grade,
                section: section,
                guardianName: guardianName,
                guardianPhone: contactNumber,
                homeAddress: address,
                // We don't update indexNumber or studentId typically as it's the key, 
                // but if your backend supports it, you can add it here.
                // Usually ID is immutable.
            };

            console.log("Updating data at:", `${API_URL}/students/${student.studentId}`);

            await axios.put(`${API_URL}/students/${student.studentId}`, updateData);

            Alert.alert("Success", "Student Updated Successfully!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (err) {
            console.error(err);
            const serverMessage = err.response?.data?.message || "Update failed. Check connection.";
            Alert.alert("Update Failed", serverMessage);
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
                <Text style={styles.headerTitle}>Edit Student</Text>
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
                        <Text style={styles.label}>Index Number (Read Only)</Text>
                        <TextInput
                            value={indexNumber}
                            editable={false}
                            style={[styles.input, { opacity: 0.5 }]}
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

                    {/* Update Button */}
                    <TouchableOpacity
                        onPress={handleUpdate}
                        disabled={loading}
                        style={[styles.button, loading && styles.buttonDisabled]}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Update Student</Text>
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
    button: {
        backgroundColor: "#007AFF", padding: 18, borderRadius: 10,
        width: "100%", alignItems: "center", marginTop: 20
    },
    buttonDisabled: { backgroundColor: "#333" },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 }
});
