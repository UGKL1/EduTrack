import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ManageStudent() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Student</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <FontAwesome5 name="search" size={16} color="#ccc" style={styles.searchIcon} />
        <TextInput
          placeholder="Search Class by Grade"
          placeholderTextColor="#ccc"
          style={styles.searchInput}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TabIcon name="home" label="Dashboard" onPress={() => navigation.navigate('AdminDashboard')} />
        <TabIcon name="bell" label="Notifications" />
        <TabIcon name="cog" label="Settings" onPress={() => navigation.navigate('SettingsScreen')} />
      </View>
    </View>
  );
}

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
    paddingBottom: 80,
  },

  // Header
 header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 30,
  marginTop: 30, // 👈 Increase this to push the next element down
},

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
    marginTop: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
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
