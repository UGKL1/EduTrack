import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../../context/ThemeContext';

export default function AttendanceReports({ navigation }) {
  const { colors, isDark } = useTheme();
  
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
          <Text style={[styles.cardLabel, { color: colors.subText }]}>Present Today</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>28</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardLabel, { color: colors.subText }]}>Absent Today</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>2</Text>
        </View>
      </View>

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

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Generate Report</Text>
      <Text style={[styles.filterLabel, { color: colors.text }]}>Filter Report</Text>

      <DropDownPicker
        open={filterOpen}
        value={filterValue}
        items={filterItems}
        setOpen={setFilterOpen}
        setValue={setFilterValue}
        setItems={setFilterItems}
        style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
        dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
        textStyle={{ color: colors.text }}
        labelStyle={{ color: colors.text }}
        placeholder="Select filter"
        placeholderStyle={{ color: colors.placeholder }}
        arrowIconStyle={{ tintColor: colors.text }}
        tickIconStyle={{ tintColor: colors.primary }}
      />

      <TouchableOpacity style={styles.exportButton} activeOpacity={0.85}>
        <Text style={styles.exportText}>Export Report</Text>
        <FontAwesome5 name="download" size={18} color="#fff" style={{ marginLeft: 8 }} />
      </TouchableOpacity>

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
    justifyContent: 'space-between',
    marginBottom: 15,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    textAlign: 'center',
  },
  filterLabel: {
    marginBottom: 10,
    fontWeight: '500',
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  dropdownContainer: {
    borderWidth: 1,
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