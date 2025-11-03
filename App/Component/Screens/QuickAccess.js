import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function QuickAccess() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Access</Text>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/edulogo.png')} // Replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.brand}>EDUTRACK</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <ActionButton label="Edit Attendance History" icon="edit" />
        <ActionButton label="Export Report" icon="file-alt" />
        <ActionButton label="Add Student" icon="user-plus" />
        <ActionButton label="Update Student" icon="user-edit" />
        <ActionButton label="Logout" icon="power-off" />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TabIcon name="home" label="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
        <TabIcon name="bell" label="Notifications" />
        <TabIcon name="cog" label="Settings" onPress={() => navigation.navigate('SettingsScreen')} />
      </View>
    </View>
  );
}

const ActionButton = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
    <FontAwesome5 name={icon} size={16} color="#fff" style={styles.buttonIcon} />
  </TouchableOpacity>
);

const TabIcon = ({ name, label, onPress }) => (
  <TouchableOpacity style={styles.navButton} onPress={onPress}>
    <FontAwesome5 name={name} size={20} color="#ccc" />
    <Text style={styles.navText}>{label}</Text>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Header
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
    color: '#fff',
  },

  // Logo
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Buttons
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

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1E1E1E',
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
    color: '#ccc',
  },
});
