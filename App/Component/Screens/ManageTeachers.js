import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, 
  ActivityIndicator, Modal, Alert 
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext'; 

// Firebase Imports
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'; 
import { sendPasswordResetEmail } from 'firebase/auth';
import { firestore, auth } from '../../config/firebase';

export default function ManageTeachers() {
  const navigation = useNavigation();
  const { colors } = useTheme(); 

  // State Management
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Edit State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editClass, setEditClass] = useState('');
  const [saving, setSaving] = useState(false);

  // 1. Fetch Teachers from Firestore
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, 'teachers'));
      const teacherList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(teacherList);
      setFilteredTeachers(teacherList);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      Alert.alert("Error", "Could not fetch teacher data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // 2. Search Functionality
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = teachers.filter((teacher) => 
        (teacher.username && teacher.username.toLowerCase().includes(text.toLowerCase())) ||
        (teacher.email && teacher.email.toLowerCase().includes(text.toLowerCase())) ||
        (teacher.staffId && teacher.staffId.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers(teachers);
    }
  };

  // 3. Open Edit Modal
  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setEditName(teacher.username || '');
    setEditContact(teacher.contactNo || '');
    setEditClass(teacher.class || '');
    setModalVisible(true);
  };

  // 4. Save Changes to Firestore
  const handleSaveChanges = async () => {
    if (!selectedTeacher) return;
    setSaving(true);
    try {
      const teacherRef = doc(firestore, 'teachers', selectedTeacher.id);
      
      const updatedData = {
        username: editName,
        contactNo: editContact,
        class: editClass
      };

      await updateDoc(teacherRef, updatedData);

      // Update local state to reflect changes immediately
      const updatedList = teachers.map(t => 
        t.id === selectedTeacher.id ? { ...t, ...updatedData } : t
      );
      setTeachers(updatedList);
      setFilteredTeachers(updatedList); 
      
      setModalVisible(false);
      Alert.alert("Success", "Teacher details updated successfully.");
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert("Error", "Failed to update teacher.");
    } finally {
      setSaving(false);
    }
  };

  // 5. Send Password Reset Email
  const handleResetPassword = (email) => {
    Alert.alert(
      "Confirm Reset",
      `Send a password reset email to ${email}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send Email", 
          onPress: async () => {
            try {
              await sendPasswordResetEmail(auth, email);
              Alert.alert("Sent", "Password reset email sent successfully.");
            } catch (error) {
              console.error("Reset Email Error:", error);
              Alert.alert("Error", error.message);
            }
          }
        }
      ]
    );
  };

  // 6. Delete Teacher
  const handleDeleteTeacher = (teacher) => {
    Alert.alert(
      "Delete Account",
      `Are you sure you want to delete ${teacher.username || "this teacher"}? This action cannot be undone and they will lose access immediately.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete from Firestore 'teachers' collection
              await deleteDoc(doc(firestore, 'teachers', teacher.id));
              
              // Update local state
              const updatedList = teachers.filter(t => t.id !== teacher.id);
              setTeachers(updatedList);
              setFilteredTeachers(updatedList);

              Alert.alert("Deleted", "Teacher account has been removed.");
            } catch (error) {
              console.error("Delete Error:", error);
              Alert.alert("Error", "Failed to delete teacher account.");
            }
          }
        }
      ]
    );
  };

  // Render Single Teacher Item
  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.nameText, { color: colors.text }]}>{item.username || "Unknown Name"}</Text>
          <Text style={[styles.subText, { color: colors.subText }]}>{item.email}</Text>
          {item.contactNo && <Text style={[styles.subText, { color: colors.subText }]}>📞 {item.contactNo}</Text>}
          {item.class && <Text style={[styles.subText, { color: colors.subText }]}>🏫 {item.class}</Text>}
        </View>
        
        {/* Edit and Delete Buttons */}
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconButton}>
            <FontAwesome5 name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteTeacher(item)} style={styles.iconButton}>
            <FontAwesome5 name="trash" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={() => handleResetPassword(item.email)}
        >
          <FontAwesome5 name="key" size={14} color="#fff" style={{ marginRight: 6 }}/>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Teachers</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
        <FontAwesome5 name="search" size={16} color={colors.placeholder} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by Name or Email"
          placeholderTextColor={colors.placeholder}
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
             <Ionicons name="close-circle" size={18} color={colors.subText} />
          </TouchableOpacity>
        )}
      </View>

      {/* Teacher List */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredTeachers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.subText }]}>No teachers found.</Text>
          }
        />
      )}

      {/* Edit Modal */}
      <Modal 
        animationType="slide" 
        transparent={true} 
        visible={modalVisible} 
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Teacher</Text>
            
            <Text style={[styles.label, { color: colors.subText }]}>Full Name</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={[styles.label, { color: colors.subText }]}>Contact No</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              value={editContact}
              onChangeText={setEditContact}
              keyboardType="phone-pad"
            />

            <Text style={[styles.label, { color: colors.subText }]}>Class Assigned</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              value={editClass}
              onChangeText={setEditClass}
              placeholder="e.g. Grade 10-A"
              placeholderTextColor={colors.placeholder}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: colors.subText }]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: colors.primary }]} 
                onPress={handleSaveChanges}
                disabled={saving}
              >
                {saving ? <ActivityIndicator color="#fff"/> : <Text style={styles.modalBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation (FIXED: Using String literals) */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
          <TouchableOpacity 
              style={styles.navButton} 
              onPress={() => navigation.navigate('AdminDashboard')} 
          >
              <FontAwesome5 name="home" size={20} color={colors.text} />
              <Text style={[styles.navText, { color: colors.text }]}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
    style={styles.navButton} 
    // 👇 Update this line
    onPress={() => navigation.navigate('AdminNotificationsScreen')} 
>
    <FontAwesome5 name="bell" size={20} color={colors.text} />
    <Text style={[styles.navText, { color: colors.text }]}>Notifications</Text>
</TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
              <FontAwesome5 name="cog" size={20} color={colors.primary} />
              <Text style={[styles.navText, { color: colors.primary }]}>Settings</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    marginBottom: 2,
  },
  iconRow: {
    flexDirection: 'column',
    gap: 15, 
    marginLeft: 10,
  },
  iconButton: {
    padding: 5,
  },
  actionRow: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flex: 1,
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
  },
  modalInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});