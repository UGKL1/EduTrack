import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClassOverviewScreen({ navigation }) {
  const { colors } = useTheme();
  const [selectedView, setSelectedView] = useState('Monthly');

  const attendanceData = {
    Annually: '92.45%',
    Monthly: '89.28%',
    Weekly: '94.10%',
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <FontAwesome5 name="arrow-left" size={22} color={colors.text} />
      </TouchableOpacity>

      {/* Header */}
      <Text style={[styles.header, { color: colors.text }]}>Class Overview</Text>

      {/* Class Info */}
      <Text style={[styles.label, { color: colors.text }]}>Class Name: 7 - A</Text>
      <Text style={[styles.label, { color: colors.text }]}>Class Teacher: P.L.Perera</Text>
      <Text style={[styles.label, { color: colors.text }]}>No of Students: 30</Text>

      {/* Attendance Toggle */}
      <Text style={[styles.subHeader, { color: colors.text }]}>Average Attendance:</Text>
      <View style={styles.toggleContainer}>
        {['Annually', 'Monthly', 'Weekly'].map((view) => (
          <TouchableOpacity
            key={view}
            style={[
              styles.toggleButton,
              {
                backgroundColor: selectedView === view ? colors.primary : colors.card,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setSelectedView(view)}
          >
            <Text style={{ color: selectedView === view ? 'white' : colors.text }}>
              {view}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Attendance Value */}
      <Text style={[styles.attendanceLabel, { color: colors.text }]}>
        {selectedView} Average Attendance
      </Text>
      <Text style={[styles.attendanceValue, { color: colors.primary }]}>
        {attendanceData[selectedView]}
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.actionText}>View Student List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('TeacherProfile')}
        >
          <Text style={styles.actionText}>View Teacher's Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.actionText}>View Graph</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Dashboard')}>
          <FontAwesome5 name="home" size={20} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('NotificationsScreen')}
        >
          <FontAwesome5 name="bell" size={20} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
          <FontAwesome5 name="cog" size={20} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 40 : 60,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
    left: 20,
    zIndex: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  attendanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  attendanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonGroup: {
    gap: 10,
    marginBottom: 40,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
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
