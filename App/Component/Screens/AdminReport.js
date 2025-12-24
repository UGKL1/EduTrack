// Component/Screens/AdminReport.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../../context/ThemeContext'; // Import Theme Hook

export default function AdminReport({ navigation }) {
  const { colors, isDark } = useTheme(); // Use Theme

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Grade Dropdown
  const [gradeOpen, setGradeOpen] = useState(false);
  const [gradeValue, setGradeValue] = useState(null);
  const [gradeItems, setGradeItems] = useState(
    Array.from({ length: 13 }, (_, i) => ({
      label: `Grade ${i + 1}`,
      value: `Grade ${i + 1}`,
    }))
  );

  // Class Dropdown
  const [classOpen, setClassOpen] = useState(false);
  const [classValue, setClassValue] = useState(null);
  const [classItems, setClassItems] = useState(
    ['A', 'B', 'C', 'D'].map((cls) => ({
      label: `Class ${cls}`,
      value: `Class ${cls}`,
    }))
  );

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') setShowDatePicker(false);
    setDate(currentDate);
  };

  const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}-${date.getFullYear()}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Attendance Reports</Text>
      </View>

      {/* DATE PICKER */}
      <TouchableOpacity
        style={[styles.dateBox, { backgroundColor: colors.card }]}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.dateText, { color: colors.text }]}>{formattedDate}</Text>
        <FontAwesome5 name="calendar" size={18} color={colors.subText} />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
          themeVariant={isDark ? 'dark' : 'light'}
        />
      )}

      {/* GRADE DROPDOWN */}
      <Text style={[styles.label, { color: colors.text }]}>Select Grade</Text>
      <DropDownPicker
        open={gradeOpen}
        value={gradeValue}
        items={gradeItems}
        setOpen={setGradeOpen}
        setValue={setGradeValue}
        setItems={setGradeItems}
        // Theme Styles for Dropdown
        style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
        dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
        textStyle={{ color: colors.text }}
        placeholder="Choose grade"
        placeholderStyle={{ color: colors.placeholder }}
        arrowIconStyle={{ tintColor: colors.text }}
        tickIconStyle={{ tintColor: colors.primary }}
        zIndex={3000}
        zIndexInverse={1000}
      />

      {/* CLASS DROPDOWN */}
      <Text style={[styles.label, { color: colors.text }]}>Select Class</Text>
      <DropDownPicker
        open={classOpen}
        value={classValue}
        items={classItems}
        setOpen={setClassOpen}
        setValue={setClassValue}
        setItems={setClassItems}
        // Theme Styles for Dropdown
        style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
        dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
        textStyle={{ color: colors.text }}
        placeholder="Choose class"
        placeholderStyle={{ color: colors.placeholder }}
        arrowIconStyle={{ tintColor: colors.text }}
        tickIconStyle={{ tintColor: colors.primary }}
        zIndex={2000}
        zIndexInverse={2000}
      />

      {/* PRESENT / ABSENT CARDS */}
      <View style={styles.summaryContainer}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardLabel, { color: colors.subText }]}>Present Today</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>28</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardLabel, { color: colors.subText }]}>Absent Today</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>2</Text>
        </View>
      </View>

      {/* EDIT BUTTON */}
      <TouchableOpacity style={styles.editButton} activeOpacity={0.85}>
        <Text style={styles.editButtonText}>Edit Attendance History</Text>
        <FontAwesome5 name="edit" size={16} color="#fff" />
      </TouchableOpacity>

      {/* EXPORT SECTION */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Generate Report</Text>
      <TouchableOpacity style={styles.exportButton} activeOpacity={0.85}>
        <Text style={styles.exportText}>Export Report</Text>
        <FontAwesome5
          name="download"
          size={18}
          color="#fff"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {/* BOTTOM NAV */}
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
          onPress={() => navigation.navigate('AdminNotificationsScreen')}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  label: {
    marginTop: 10,
    marginBottom: 8,
    fontWeight: '500',
  },
  dateBox: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 14,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderWidth: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    zIndex: -1, // Ensure dropdowns float over this
  },
  card: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cardLabel: {
    fontSize: 14,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
    zIndex: -1,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
    textAlign: 'center',
    zIndex: -1,
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    zIndex: -1,
  },
  exportText: {
    color: '#fff',
    fontSize: 15,
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
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
  },
});