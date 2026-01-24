import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
  ActivityIndicator, RefreshControl, Alert, Image
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext'; // Import Theme Hook
import useAuth from '../../hooks/useAuth'; // Import Auth Hook
import axios from 'axios';
import { API_URL } from '../../config/config'; // Make sure this path is correct

export default function ManageStudent() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user } = useAuth(); // Get user role and details 

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  // --- 1. Fetch Students from Server ---
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      let allStudents = response.data;

      // Filter for Teachers
      if (user?.role === 'Teacher') {
        allStudents = allStudents.filter(student =>
          student.grade === user.grade && student.section === user.section
        );
      }

      setStudents(allStudents);
    } catch (error) {
      console.error("Fetch Error:", error);
      // Optional: Fail silently or show a small toast, avoiding popup spam
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- 2. Auto-Reload when screen opens/returns ---
  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [])
  );

  // --- 3. Filter Logic for Search ---
  const filteredStudents = students.filter(student =>
    student.studentName?.toLowerCase().includes(searchText.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchText.toLowerCase())
  );

  // --- 4. Render Student Card ---
  const renderStudent = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => navigation.navigate('EditStudentScreen', { student: item })}
    >
      <View style={styles.avatar}>
        <FontAwesome5 name="user-graduate" size={24} color={colors.text} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.studentName}</Text>
        <Text style={[styles.cardSubtitle, { color: colors.placeholder }]}>ID: {item.studentId}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.placeholder} />
    </TouchableOpacity>
  );

  // --- 5. Navigation Tab Component ---
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Students</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
        <FontAwesome5 name="search" size={16} color={colors.placeholder} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by Name or ID..."
          placeholderTextColor={colors.placeholder}
          style={[styles.searchInput, { color: colors.text }]}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Content Area */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary || "#4A90E2"} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.studentId}
          renderItem={renderStudent}
          contentContainerStyle={{ paddingBottom: 100 }} // Space for Bottom Nav
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStudents(); }} />
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <FontAwesome5 name="user-slash" size={40} color={colors.placeholder} />
              <Text style={{ color: colors.placeholder, marginTop: 10 }}>No students found.</Text>
            </View>
          }
        />
      )}

      {/* FLOATING ADD BUTTON */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#007AFF' }]}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

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
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 0, // Removed paddingBottom to let FlatList handle scrolling
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
    marginRight: 24, // Balance back arrow
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  // Student Card Styles
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent', // Handled by theme
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: 'rgba(100,100,100,0.1)', // Light generic background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 90, // Positioned just above the Bottom Nav
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Android Shadow
    shadowColor: '#000', // iOS Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
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
    flex: 1,
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
  },
});