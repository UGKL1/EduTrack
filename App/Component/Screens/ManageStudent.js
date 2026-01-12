import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, 
  ActivityIndicator, RefreshControl, Alert, Image 
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext'; // Import Theme Hook

export default function ManageStudent() {
  const navigation = useNavigation();
  const { colors } = useTheme(); // Use Theme

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
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
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
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15,
    borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, left: 0, right: 0,
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