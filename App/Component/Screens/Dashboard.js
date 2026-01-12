import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, firestore } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../../context/ThemeContext';

export default function Dashboard({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'teachers', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.profileHeader, { color: colors.text }]}>Dashboard</Text>
        <Image
          source={{ uri: userData?.profileImageUrl || 'https://placehold.co/100x100/A020F0/white?text=User' }}
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, { color: colors.text }]}>
          {userData ? userData.username : 'User'}
        </Text>
      </View>

      <View style={styles.gridContainer}>
        {[
          { icon: 'clipboard-check', label: 'Mark Attendance', nav: 'AttendanceScreen' },
          { icon: 'user', label: 'View Profile', nav: 'TeacherProfile' },
          { icon: 'users', label: "Student's Details", nav: 'ManageStudent' }, // Add nav when ready
          { icon: 'chart-bar', label: 'Class Overview', nav: '' },
          { icon: 'file-alt', label: 'Reports', nav: 'AttendanceReports' },
          { icon: 'bolt', label: 'Quick Access', nav: 'QuickAccess' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.gridButton, { backgroundColor: colors.card }]}
            onPress={() => item.nav && navigation.navigate(item.nav)}
          >
            <FontAwesome5 name={item.icon} size={24} color={colors.primary} />
            <Text style={[styles.gridButtonText, { color: colors.text }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome5 name="home" size={20} color={colors.primary} />
          <Text style={[styles.navText, { color: colors.primary }]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('NotificationsScreen')}>
          <FontAwesome5 name="bell" size={20} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('SettingsScreen')}>
          <FontAwesome5 name="cog" size={20} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 40,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileHeader: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridButton: {
    width: '48%',
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  gridButtonText: {
    marginTop: 10,
    textAlign: 'center',
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
  },
  navText: {
    marginTop: 5,
    fontSize: 12,
  },
});