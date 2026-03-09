import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../../config/firebase'; // Ensure firestore is imported
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'; // Import Firestore functions
import Toast from 'react-native-toast-message';

export default function QuickAccess() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Toast.show({ type: 'success', text1: 'Logged out successfully.' });
    } catch (error) {
      console.log('Logout Error:', error.message);
      Toast.show({ type: 'error', text1: 'Failed to log out.' });
    }
  };

  // --- MAGIC DATA GENERATOR ---
  const generateDemoData = async () => {
    setLoading(true);
    try {
      // 1. Get Current Teacher's Info
      const user = auth.currentUser;
      if (!user) return;

      const teacherRef = doc(firestore, 'teachers', user.uid);
      const teacherSnap = await getDoc(teacherRef);

      if (!teacherSnap.exists()) {
        Alert.alert('Error', 'Teacher profile not found.');
        setLoading(false);
        return;
      }

      const { grade, section } = teacherSnap.data();

      if (!grade || !section) {
        Alert.alert(
          'Missing Info',
          'Please update your Profile with Grade & Section first.',
        );
        setLoading(false);
        return;
      }

      console.log(`Generating data for Grade ${grade} - ${section}...`);

      // 2. Create 5 Dummy Students
      const dummyStudents = [
        { name: 'Saman Kumara', id: 'ST001' },
        { name: 'Nimal Perera', id: 'ST002' },
        { name: 'Kamal Silva', id: 'ST003' },
        { name: 'Mala De Alwis', id: 'ST004' },
        { name: 'Chathura J', id: 'ST005' },
      ];

      for (const student of dummyStudents) {
        // Use setDoc with ID to avoid duplicates if you run it twice
        await setDoc(doc(firestore, 'students', student.id), {
          studentName: student.name,
          studentId: student.id,
          grade: grade.toString(), // Ensure it matches Teacher's grade
          section: section.toString(),
          guardianName: 'Parent of ' + student.name,
          guardianPhone: '0771234567',
          homeAddress: '123 Fake St',
          createdAt: serverTimestamp(),
        });

        // 3. Generate 30 Days of Attendance for this student
        // We create a loop for the past 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i); // Go back 'i' days

          // Skip weekends (optional, but realistic)
          const day = date.getDay();
          if (day === 0 || day === 6) continue;

          // 80% chance of being present
          if (Math.random() > 0.2) {
            const dateString = date.toISOString().split('T')[0];
            await addDoc(collection(firestore, 'attendance'), {
              studentName: student.name,
              date: dateString,
              status: 'Present',
              timestamp: date, // For sorting
            });
          }
        }
      }

      Alert.alert(
        'Success',
        `Added 5 students and attendance records for Class ${grade}-${section}!`,
      );
    } catch (error) {
      console.error('Generator Error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const ActionButton = ({ label, icon, onPress, color }) => (
    <TouchableOpacity
      style={[styles.actionButton, color && { backgroundColor: color }]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.buttonText}>{label}</Text>
      <FontAwesome5
        name={icon}
        size={16}
        color="#fff"
        style={styles.buttonIcon}
      />
    </TouchableOpacity>
  );

  const TabIcon = ({ name, label, onPress }) => (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
      <FontAwesome5 name={name} size={20} color={colors.text} />
      <Text style={[styles.navText, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Quick Access
        </Text>
      </View>

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/edulogo.png')}
          style={styles.logo}
        />
        <Text style={[styles.brand, { color: colors.text }]}>EDUTRACK</Text>
      </View>

      <View style={styles.buttonGroup}>
        {/* MAGIC BUTTON */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <ActionButton
            label="⚡ Generate Demo Data (Run Once)"
            icon="magic"
            color="#9C27B0" // Purple color to stand out
            onPress={generateDemoData}
          />
        )}

        <ActionButton
          label="Export Report"
          icon="file-alt"
          onPress={() => navigation.navigate('AttendanceReports')}
        />
        <ActionButton
          label="Add Student"
          icon="user-plus"
          onPress={() => navigation.navigate('RegisterScreen')}
        />
        <ActionButton
          label="Update Student"
          icon="user-edit"
          onPress={() => navigation.navigate('ManageStudent')}
        />
        <ActionButton label="Logout" icon="power-off" onPress={handleLogout} />
      </View>

      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TabIcon
          name="home"
          label="Dashboard"
          onPress={() => navigation.navigate('Dashboard')}
        />
        <TabIcon
          name="bell"
          label="Notifications"
          onPress={() => navigation.navigate('NotificationsScreen')}
        />
        <TabIcon
          name="cog"
          label="Settings"
          onPress={() => navigation.navigate('SettingsScreen')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 10 },
  brand: { fontSize: 16, fontWeight: 'bold' },
  buttonGroup: { gap: 12 },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  buttonIcon: { marginLeft: 10 },
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
  navText: { marginTop: 4, fontSize: 12 },
});
