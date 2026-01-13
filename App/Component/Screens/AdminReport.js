// Component/Screens/AdminReport.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, FlatList, Alert, ActivityIndicator
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../../context/ThemeContext';
import { firestore } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function AdminReport({ navigation }) {
  const { colors, isDark } = useTheme();

  // Date State
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Data State
  const [attendanceList, setAttendanceList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ present: 0 });

  // Filter State
  const [reportTypeOpen, setReportTypeOpen] = useState(false);
  const [reportType, setReportType] = useState('Daily');
  const [reportTypes] = useState([
    { label: 'Daily', value: 'Daily' },
    { label: 'All Time', value: 'AllTime' },
  ]);

  const [searchName, setSearchName] = useState('');

  // Grade Dropdown
  const [gradeOpen, setGradeOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [gradeItems, setGradeItems] = useState([
    { label: 'All Grades', value: null },
    ...Array.from({ length: 13 }, (_, i) => ({
      label: `Grade ${i + 1}`,
      value: `${i + 1}`, // Storing as string number to match standard
    }))
  ]);

  // Section Dropdown
  const [sectionOpen, setSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionItems] = useState([
    { label: 'All Sections', value: null },
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
    { label: 'E', value: 'E' },
  ]);

  // Initial Data Load
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch Attendance on dependency change
  useEffect(() => {
    if (Object.keys(studentsMap).length > 0) {
      fetchAttendance();
    }
  }, [date, reportType, studentsMap]);

  // Filter Logic
  useEffect(() => {
    filterData();
  }, [searchName, selectedGrade, selectedSection, attendanceList]);

  // 1. Fetch Students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(collection(firestore, 'students'));
      const snapshot = await getDocs(q);
      const map = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.studentName) {
          map[data.studentName] = {
            grade: data.grade,
            section: data.section,
            id: doc.id
          };
        }
      });
      setStudentsMap(map);
    } catch (err) {
      console.error("Error fetching students:", err);
      Alert.alert("Error", "Could not load student data.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Attendance
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      let q;
      const attRef = collection(firestore, 'attendance');

      if (reportType === 'Daily') {
        const dateStr = date.toISOString().split('T')[0];
        q = query(attRef, where('date', '==', dateStr));
      } else {
        q = query(attRef, orderBy('timestamp', 'desc'));
      }

      const snapshot = await getDocs(q);
      const records = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        const studentInfo = studentsMap[data.studentName] || {};

        records.push({
          id: doc.id,
          ...data,
          grade: studentInfo.grade || 'N/A',
          section: studentInfo.section || 'N/A',
        });
      });

      setAttendanceList(records);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      Alert.alert("Error", "Could not load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Filter Data
  const filterData = () => {
    let result = attendanceList;

    if (searchName) {
      result = result.filter(item =>
        item.studentName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedGrade) {
      // Check for exact match or 'Grade X' format just in case
      result = result.filter(item =>
        item.grade == selectedGrade || item.grade === `Grade ${selectedGrade}`
      );
    }

    if (selectedSection) {
      result = result.filter(item => item.section === selectedSection);
    }

    setFilteredList(result);
    setStats({ present: result.length });
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') setShowDatePicker(false);
    setDate(currentDate);
  };

  const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(
    date.getMonth() + 1
  ).toString().padStart(2, '0')}-${date.getFullYear()}`;

  // 4. Export CSV
  const exportToCSV = async () => {
    try {
      if (filteredList.length === 0) {
        Alert.alert("No Data", "There is no data to export.");
        return;
      }

      let csv = "Student Name,Date,Status,Grade,Section\n";
      filteredList.forEach(item => {
        csv += `${item.studentName},${item.date},${item.status},${item.grade},${item.section}\n`;
      });

      const fileName = `Admin_Attendance_${reportType}_${formattedDate}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: 'utf8' });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Saved", `File saved to: ${fileUri}`);
      }
    } catch (err) {
      console.error("Export Error:", err);
      Alert.alert("Error", "Failed to export CSV.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.card }]}>
      <View style={styles.itemRow}>
        <View>
          <Text style={[styles.itemText, { color: colors.text }]}>{item.studentName}</Text>
          <Text style={[styles.itemSubText, { color: colors.subText }]}>Class: {item.grade}-{item.section}</Text>
        </View>
        <Text style={[styles.statusText, { color: '#4CAF50' }]}>{item.status}</Text>
      </View>
      <Text style={[styles.dateText, { color: colors.subText, fontSize: 12 }]}>{item.date}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Attendance Reports (Admin)</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardLabel, { color: colors.subText }]}>Records Found</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>{stats.present}</Text>
        </View>
      </View>

      {/* Controls Container */}
      <View style={{ zIndex: 3000, marginBottom: 15 }}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.dateBox, { backgroundColor: colors.card, flex: 1, marginRight: 10 }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: colors.text }}>{formattedDate}</Text>
            <FontAwesome5 name="calendar" size={16} color={colors.subText} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <DropDownPicker
              open={reportTypeOpen}
              value={reportType}
              items={reportTypes}
              setOpen={setReportTypeOpen}
              setValue={setReportType}
              style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
              dropDownContainerStyle={{ backgroundColor: colors.card, borderColor: colors.border }}
              textStyle={{ color: colors.text }}
            />
          </View>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={onChangeDate}
          themeVariant={isDark ? 'dark' : 'light'}
        />
      )}

      {/* Search & Filters */}
      <View style={[styles.filterContainer, { zIndex: 2000 }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Search Student..."
          placeholderTextColor={colors.placeholder}
          value={searchName}
          onChangeText={setSearchName}
        />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <DropDownPicker
              open={gradeOpen}
              value={selectedGrade}
              items={gradeItems}
              setOpen={setGradeOpen}
              setValue={setSelectedGrade}
              onOpen={() => setSectionOpen(false)}
              placeholder="Grade"
              style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
              dropDownContainerStyle={{ backgroundColor: colors.card, borderColor: colors.border }}
              textStyle={{ color: colors.text }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <DropDownPicker
              open={sectionOpen}
              value={selectedSection}
              items={sectionItems}
              setOpen={setSectionOpen}
              setValue={setSelectedSection}
              onOpen={() => setGradeOpen(false)}
              placeholder="Section"
              style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
              dropDownContainerStyle={{ backgroundColor: colors.card, borderColor: colors.border }}
              textStyle={{ color: colors.text }}
            />
          </View>
        </View>
      </View>

      {/* EXPORT SECTION */}
      <TouchableOpacity style={styles.exportButton} onPress={exportToCSV} activeOpacity={0.85}>
        <Text style={styles.exportText}>Export Report</Text>
        <FontAwesome5 name="download" size={18} color="#fff" style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.subText }}>No records found</Text>
          }
        />
      )}

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
    paddingBottom: 80, // Space for bottom nav
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
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cardLabel: { fontSize: 13 },
  cardValue: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateBox: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },

  filterContainer: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
  },

  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 10,
  },
  exportText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  itemCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  itemText: { fontSize: 16, fontWeight: 'bold' },
  itemSubText: { fontSize: 13 },
  statusText: { fontWeight: 'bold' },

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