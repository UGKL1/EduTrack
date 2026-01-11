import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Alert, Modal, ActivityIndicator
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { API_URL } from '../../config/config';
import { useTheme } from '../../context/ThemeContext';

const BACKEND_API_URL = API_URL;

const GRADES = ["1", "2", "3", "4", "5"];
const SECTIONS = ["A", "B", "C", "D", "E"];

export default function ManageStudent() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Picker Modals
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [sectionModalVisible, setSectionModalVisible] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Student", "Are you sure you want to delete this student?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            await axios.delete(`${BACKEND_API_URL}/students/${id}`);
            setStudents(prev => prev.filter(s => s.id !== id));
            Alert.alert("Success", "Student deleted.");
          } catch (err) {
            Alert.alert("Error", "Failed to delete student.");
          }
        }
      }
    ]);
  };

  const openEditModal = (student) => {
    setEditingStudent({ ...student });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editingStudent) return;

    // Validation
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^\d{10}$/;

    if (editingStudent.guardianName && !nameRegex.test(editingStudent.guardianName)) {
      return Alert.alert("Invalid Input", "Guardian Name cannot contain numbers.");
    }
    if (editingStudent.guardianPhone && !phoneRegex.test(editingStudent.guardianPhone)) {
      return Alert.alert("Invalid Input", "Phone Number must be exactly 10 digits.");
    }

    try {
      await axios.put(`${BACKEND_API_URL}/students/${editingStudent.id}`, editingStudent);
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
      setEditModalVisible(false);
      Alert.alert("Success", "Student updated.");
    } catch (err) {
      Alert.alert("Error", "Failed to update student.");
    }
  };

  const filteredStudents = students.filter(s => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      s.studentName?.toLowerCase().includes(query) ||
      s.studentId?.toLowerCase().includes(query) ||
      s.grade?.toLowerCase().includes(query)
    );
  });

  const renderStudentItem = ({ item }) => (
    <View style={[styles.studentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.studentInfo}>
        <Text style={[styles.studentName, { color: colors.text }]}>{item.studentName}</Text>
        <Text style={[styles.studentDetail, { color: colors.subText }]}>ID: {item.studentId}</Text>
        <Text style={[styles.studentDetail, { color: colors.subText }]}>Class: {item.grade}-{item.section}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
          <FontAwesome5 name="edit" size={16} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <FontAwesome5 name="trash" size={16} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPickerModal = (visible, setVisible, data, onSelect, title) => (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.pickerItem} onPress={() => { onSelect(item); setVisible(false); }}>
                <Text style={styles.pickerItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setVisible(false)} style={styles.closePickerBtn}>
            <Text style={styles.closePickerText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const TabIcon = ({ name, label, onPress }) => (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
      <FontAwesome5 name={name} size={20} color={colors.text} />
      <Text style={[styles.navText, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Student</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
        <FontAwesome5 name="search" size={16} color={colors.placeholder} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by Name or ID..."
          placeholderTextColor={colors.placeholder}
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Student List */}
      {loading ? <ActivityIndicator size="large" color="#007AFF" /> : (
        <FlatList
          data={filteredStudents}
          keyExtractor={item => item.id}
          renderItem={renderStudentItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.editModalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Student</Text>

            {editingStudent && (
              <>
                <Text style={[styles.label, { color: colors.subText }]}>Name</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  value={editingStudent.studentName}
                  onChangeText={t => setEditingStudent({ ...editingStudent, studentName: t })}
                />

                {/* Grade & Section Selectors */}
                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={[styles.label, { color: colors.subText }]}>Grade</Text>
                    <TouchableOpacity onPress={() => setGradeModalVisible(true)} style={[styles.pickerButton, { borderColor: colors.border }]}>
                      <Text style={[styles.pickerText, { color: colors.text }]}>{editingStudent.grade || "Select"}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { color: colors.subText }]}>Section</Text>
                    <TouchableOpacity onPress={() => setSectionModalVisible(true)} style={[styles.pickerButton, { borderColor: colors.border }]}>
                      <Text style={[styles.pickerText, { color: colors.text }]}>{editingStudent.section || "Select"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={[styles.label, { color: colors.subText }]}>Guardian Name</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  value={editingStudent.guardianName}
                  onChangeText={t => setEditingStudent({ ...editingStudent, guardianName: t })}
                />
                <Text style={[styles.label, { color: colors.subText }]}>Guardian Phone</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  value={editingStudent.guardianPhone}
                  onChangeText={t => setEditingStudent({ ...editingStudent, guardianPhone: t })}
                  keyboardType="numeric"
                  maxLength={10}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleUpdate} style={styles.saveBtn}>
                    <Text style={styles.saveText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Picker Modals Reuse */}
      {renderPickerModal(gradeModalVisible, setGradeModalVisible, GRADES,
        (val) => setEditingStudent({ ...editingStudent, grade: val }), "Select Grade")}
      {renderPickerModal(sectionModalVisible, setSectionModalVisible, SECTIONS,
        (val) => setEditingStudent({ ...editingStudent, section: val }), "Select Section")}


      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TabIcon name="home" label="Dashboard" onPress={() => navigation.navigate('AdminDashboard')} />
        <TabIcon name="bell" label="Notifications" onPress={() => navigation.navigate('AdminNotificationsScreen')} />
        <TabIcon name="cog" label="Settings" onPress={() => navigation.navigate('SettingsScreen')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 10, marginBottom: 20 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14 },

  studentCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1
  },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  studentDetail: { fontSize: 12 },
  actionButtons: { flexDirection: "row", gap: 15 },
  editBtn: { padding: 5 },
  deleteBtn: { padding: 5 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  editModalContent: { width: "90%", borderRadius: 15, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 12, marginBottom: 5, fontWeight: "600" },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  row: { flexDirection: "row", marginBottom: 15 },
  pickerButton: { borderWidth: 1, borderRadius: 8, padding: 12, alignItems: "center" },
  pickerText: { fontSize: 16 },

  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelBtn: { padding: 15, flex: 1, alignItems: "center", marginRight: 10, backgroundColor: "#333", borderRadius: 8 },
  cancelText: { color: "#fff" },
  saveBtn: { padding: 15, flex: 1, alignItems: "center", backgroundColor: "#007AFF", borderRadius: 8 },
  saveText: { color: "#fff", fontWeight: "bold" },

  // Picker Specific
  pickerContent: { width: "80%", backgroundColor: "#222", borderRadius: 10, padding: 20, maxHeight: "50%" },
  pickerItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#333" },
  pickerItemText: { color: "#fff", center: "center", fontSize: 16 },
  closePickerBtn: { marginTop: 15, padding: 10, alignItems: "center", backgroundColor: "#333", borderRadius: 5 },
  closePickerText: { color: "#fff" },

  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15,
    borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  navButton: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { marginTop: 4, fontSize: 12 },
});