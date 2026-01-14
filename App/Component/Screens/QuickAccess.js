import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext'; // Import Theme Hook
import { signOut } from 'firebase/auth'; // Import signOut
import { auth } from '../../config/firebase'; // Import auth
import Toast from 'react-native-toast-message'; // Import Toast

export default function QuickAccess() {
  const navigation = useNavigation();
  const { colors } = useTheme(); // Use Theme

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Toast.show({ type: 'success', text1: 'Logged out successfully.' });
      // Navigation to login is typically handled by an auth listener in the main navigator
    } catch (error) {
      console.log('Logout Error:', error.message);
      Toast.show({ type: 'error', text1: 'Failed to log out.' });
    }
  };

  const ActionButton = ({ label, icon, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
      <FontAwesome5 name={icon} size={16} color="#fff" style={styles.buttonIcon} />
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Quick Access</Text>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/edulogo.png')}
          style={styles.logo}
        />
        <Text style={[styles.brand, { color: colors.text }]}>EDUTRACK</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <ActionButton
          label="Edit Attendance History"
          icon="edit"
          onPress={() => console.log('Edit Attendance History Pressed')}
        />
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
        <ActionButton
          label="Logout"
          icon="power-off"
          onPress={handleLogout}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TabIcon name="home" label="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
        <TabIcon name="bell" label="Notifications" onPress={() => navigation.navigate('NotificationsScreen')} />
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  brand: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGroup: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 10,
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
});