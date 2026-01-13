import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../../context/ThemeContext';
import { firestore } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function AttendanceReports({ navigation }) {
  const { colors, isDark } = useTheme();

  // Date State
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('Annually');
  const [filterItems, setFilterItems] = useState([
    { label: 'Annually', value: 'Annually' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Weekly', value: 'Weekly' },
  ]);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') setShowDatePicker(false);
    setDate(currentDate);
  };

  const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

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

      const fileName = `Attendance_${reportType}_${formattedDate}.csv`;
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Attendance Reports</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardLabel, { color: colors.subText }]}>Records Found</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>{stats.present}</Text>
        </View>
        {/* You can add more summary cards here logic permits */}
      </View>

      {/* Controls Container */}
      <View style={{ zIndex: 3000 }}>
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

      <TouchableOpacity style={styles.exportButton} onPress={exportToCSV} activeOpacity={0.85}>
        <Text style={styles.exportText}>Export as CSV</Text>
        <FontAwesome5 name="file-csv" size={18} color="#fff" style={{ marginLeft: 8 }} />
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

      {/* Bottom Nav - Kept consistent */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Dashboard')}>
          <FontAwesome5 name="home" size={20} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Dashboard</Text>
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
    marginBottom: 15,
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

  filterContainer: { marginVertical: 15 },
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
    backgroundColor: '#28a745',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 15,
  },
  exportText: { color: '#fff', fontSize: 15, fontWeight: '600' },

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
  navButton: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 5 },
});