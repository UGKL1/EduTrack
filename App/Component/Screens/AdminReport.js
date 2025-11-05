// Component/Screens/AttendanceReports.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

export default function AttendanceReports({ navigation }) {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance Reports</Text>
      </View>

      {/* DATE PICKER */}
      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.dateText}>{formattedDate}</Text>
        <FontAwesome5 name="calendar" size={18} color="#aaa" />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}

      {/* GRADE DROPDOWN */}
      <Text style={styles.label}>Select Grade</Text>
      <DropDownPicker
        open={gradeOpen}
        value={gradeValue}
        items={gradeItems}
        setOpen={setGradeOpen}
        setValue={setGradeValue}
        setItems={setGradeItems}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={{ color: '#fff' }}
        placeholder="Choose grade"
        placeholderStyle={{ color: '#aaa' }}
      />

      {/* CLASS DROPDOWN */}
      <Text style={styles.label}>Select Class</Text>
      <DropDownPicker
        open={classOpen}
        value={classValue}
        items={classItems}
        setOpen={setClassOpen}
        setValue={setClassValue}
        setItems={setClassItems}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={{ color: '#fff' }}
        placeholder="Choose class"
        placeholderStyle={{ color: '#aaa' }}
      />

      {/* PRESENT / ABSENT CARDS */}
      <View style={styles.summaryContainer}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Present Today</Text>
          <Text style={styles.cardValue}>28</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Absent Today</Text>
          <Text style={styles.cardValue}>2</Text>
        </View>
      </View>

      {/* EDIT BUTTON */}
      <TouchableOpacity style={styles.editButton} activeOpacity={0.85}>
        <Text style={styles.editButtonText}>Edit Attendance History</Text>
        <FontAwesome5 name="edit" size={16} color="#fff" />
      </TouchableOpacity>

      {/* EXPORT SECTION */}
      <Text style={styles.sectionTitle}>Generate Report</Text>
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
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <FontAwesome5 name="home" size={20} color="#fff" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('NotificationScreen')}
        >
          <FontAwesome5 name="bell" size={20} color="#fff" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
          <FontAwesome5 name="cog" size={20} color="#fff" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  label: {
    color: '#fff',
    marginTop: 10,
    marginBottom: 8,
    fontWeight: '500',
  },
  dateBox: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: '#1E1E1E',
    borderWidth: 0,
    borderRadius: 10,
    marginBottom: 10,
    zIndex: 10,
  },
  dropdownContainer: {
    backgroundColor: '#1E1E1E',
    borderWidth: 0,
    zIndex: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cardLabel: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  cardValue: {
    color: '#fff',
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
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
    textAlign: 'center',
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  exportText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
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
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});
