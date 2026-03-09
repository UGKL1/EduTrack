import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import useAuth from '../../hooks/useAuth';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ClassOverviewScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  // UI State - Default to 'Daily' or 'Monthly' as you prefer
  const [selectedView, setSelectedView] = useState('Monthly');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Date State
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Data State
  const [className, setClassName] = useState("Loading...");
  const [teacherName, setTeacherName] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [stats, setStats] = useState({
    Daily: 0,
    Annually: 0,
    Monthly: 0,
    Weekly: 0,
  });

  // --- Date Change Handler ---
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') setShowDatePicker(false);
    setDate(currentDate);
  };

  // --- Helper: Format Date for Display (DD/MM/YYYY) ---
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

  // --- Helper: Format Date for DB Query (YYYY-MM-DD) ---
  // Using local time components to avoid timezone shifts
  const queryDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  // --- 1. Main Data Fetch Function ---
  const fetchClassData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // STEP A: Force Fetch Fresh Teacher Profile
      const userRef = doc(firestore, 'teachers', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        setLoading(false);
        return;
      }

      const freshData = userSnap.data();
      const targetGrade = freshData.grade;
      const targetSection = freshData.section;
      
      setTeacherName(freshData.username || "Unknown");

      if (!targetGrade || !targetSection) {
        setClassName("Not Assigned");
        setLoading(false);
        Alert.alert("Profile Incomplete", "Please update your Grade and Section in your Profile.");
        return;
      }

      setClassName(`${targetGrade} - ${targetSection}`);

      // STEP B: Count Students in this Class
      const studentQuery = query(
        collection(firestore, 'students'),
        where('grade', '==', targetGrade.toString()), 
        where('section', '==', targetSection.toString())
      );
      
      const studentSnapshot = await getDocs(studentQuery);
      const totalStudents = studentSnapshot.size;
      setStudentCount(totalStudents);

      if (totalStudents === 0) {
        setStats({ Daily: 0, Annually: 0, Monthly: 0, Weekly: 0 });
        setLoading(false);
        return;
      }

      // STEP C: Fetch & Calculate Attendance
      const attQuery = query(collection(firestore, 'attendance'), orderBy('timestamp', 'desc'));
      const attSnapshot = await getDocs(attQuery);
      
      const now = new Date(date); // Reference point is Selected Date
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      const classStudentNames = new Set(studentSnapshot.docs.map(doc => doc.data().studentName));
      
      let presentDay = 0;
      let presentYear = 0, presentMonth = 0, presentWeek = 0;
      const daysYear = new Set(), daysMonth = new Set(), daysWeek = new Set();

      attSnapshot.forEach(doc => {
        const data = doc.data();
        if (classStudentNames.has(data.studentName)) {
          const rDate = new Date(data.date);
          
          // 1. Daily Calc (Exact Match String)
          if (data.date === queryDateStr) {
            presentDay++;
          }

          // 2. Range Calcs (Relative to selected date)
          if (rDate <= now && rDate >= startOfYear) {
            presentYear++;
            daysYear.add(data.date);
            
            if (rDate >= startOfMonth) {
              presentMonth++;
              daysMonth.add(data.date);
            }
            if (rDate >= oneWeekAgo) {
              presentWeek++;
              daysWeek.add(data.date);
            }
          }
        }
      });

      // Percentage Calculation Helper
      const calc = (present, denominator) => {
        if (denominator === 0 || totalStudents === 0) return 0;
        let val = (present / (totalStudents * denominator)) * 100;
        return val > 100 ? 100 : val;
      };

      setStats({
        Daily: calc(presentDay, 1), // Denominator is 1 day
        Annually: calc(presentYear, daysYear.size),
        Monthly: calc(presentMonth, daysMonth.size),
        Weekly: calc(presentWeek, daysWeek.size),
      });

    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchClassData();
    }, [user, date])
  );

  // --- Dynamic Label Logic ---
  const getStatsLabel = () => {
    if (selectedView === 'Daily') {
      return `Average Attendance as at ${formattedDate}`;
    }
    return `${selectedView} Average Attendance`;
  };

  // --- Custom Bar Component ---
  const Bar = ({ label, percentage }) => (
    <View style={styles.barContainer}>
      <Text style={[styles.barLabel, { color: colors.subText }]}>{label}</Text>
      <View style={styles.barBackground}>
        <View 
          style={[
            styles.barFill, 
            { 
              width: `${percentage}%`, 
              backgroundColor: percentage > 75 ? '#4CAF50' : percentage > 50 ? '#FFC107' : '#F44336' 
            }
          ]} 
        />
      </View>
      <Text style={[styles.barValue, { color: colors.text }]}>{percentage.toFixed(1)}%</Text>
    </View>
  );

  // --- Helper Button ---
  const CustomButton = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionText}>{title}</Text>
      <FontAwesome5 name={icon} size={18} color="white" style={{ marginLeft: 10 }} />
    </TouchableOpacity>
  );

  const options = ['Daily', 'Weekly', 'Monthly', 'Annually'];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Class Overview</Text>
        <View style={{ width: 20 }} /> 
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: colors.subText }}>Analyzing Attendance...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* 1. Class Info Card */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardRow}>
              <FontAwesome5 name="chalkboard-teacher" size={24} color={colors.primary} style={styles.icon} />
              <View>
                <Text style={[styles.cardLabel, { color: colors.subText }]}>Class</Text>
                <Text style={[styles.cardValue, { color: colors.text }]}>{className}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <FontAwesome5 name="user-tie" size={24} color={colors.primary} style={styles.icon} />
              <View>
                <Text style={[styles.cardLabel, { color: colors.subText }]}>Class Teacher</Text>
                <Text style={[styles.cardValue, { color: colors.text }]}>{teacherName}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <FontAwesome5 name="user-graduate" size={24} color={colors.primary} style={styles.icon} />
              <View>
                <Text style={[styles.cardLabel, { color: colors.subText }]}>Students</Text>
                <Text style={[styles.cardValue, { color: colors.text }]}>{studentCount} Enrolled</Text>
              </View>
            </View>
          </View>

          {/* Controls Row */}
          <Text style={[styles.label, { color: colors.subText, marginTop: 10 }]}>Attendance Filters :</Text>
          <View style={styles.controlsRow}>
            {/* DATE PICKER */}
            <TouchableOpacity 
              style={[styles.controlBox, { backgroundColor: colors.card, marginRight: 10 }]}
              onPress={() => setShowDatePicker(true)}
            >
              <FontAwesome5 name="calendar-alt" size={16} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={{ color: colors.text, fontWeight: '600' }}>{formattedDate}</Text>
            </TouchableOpacity>

            {/* DROPDOWN */}
            <View style={{ flex: 1, zIndex: 1000 }}>
              <TouchableOpacity 
                style={[styles.controlBox, { backgroundColor: colors.card, justifyContent: 'space-between' }]}
                onPress={() => setDropdownOpen(!dropdownOpen)}
              >
                <Text style={{ color: colors.text, fontWeight: '600' }}>{selectedView}</Text>
                <Ionicons name={dropdownOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.subText} />
              </TouchableOpacity>

              {dropdownOpen && (
                <View style={[styles.dropdownList, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  {options.map((opt, index) => (
                    <TouchableOpacity 
                      key={opt}
                      style={[
                        styles.dropdownItem, 
                        index !== options.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                      ]}
                      onPress={() => {
                        setSelectedView(opt);
                        setDropdownOpen(false);
                      }}
                    >
                      <Text style={{ color: colors.text }}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              themeVariant={isDark ? 'dark' : 'light'}
            />
          )}

          {/* 2. Graph Section */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Performance Graph</Text>
          <View style={[styles.graphCard, { backgroundColor: colors.card }]}>
            {/* Show Daily on graph too if you like, or stick to trends */}
            <Bar label="Daily" percentage={stats.Daily} />
            <Bar label="Weekly" percentage={stats.Weekly} />
            <Bar label="Monthly" percentage={stats.Monthly} />
          </View>

          {/* 3. Big Percentage Display (Dynamic Label) */}
          <View style={[styles.statsBox, { borderColor: '#8FBC8F', marginTop: 10 }]}> 
              <Text style={[styles.statsTitle, { color: colors.subText }]}>
                {getStatsLabel()}
              </Text>
              <Text style={[styles.statsValue, { color: colors.text }]}>
                {stats[selectedView].toFixed(2)}%
              </Text>
          </View>

          {/* 4. Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('ManageStudent')}
            >
              <FontAwesome5 name="users" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Students</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.primary }]}
              onPress={() => navigation.navigate('AttendanceReports')}
            >
              <FontAwesome5 name="file-download" size={18} color={colors.primary} />
              <Text style={[styles.actionBtnText, { color: colors.primary }]}>Reports</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.fullWidthBtn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.subText }]}
            onPress={() => navigation.navigate('TeacherProfile')}
          >
            <FontAwesome5 name="user-cog" size={18} color={colors.text} />
            <Text style={[styles.actionBtnText, { color: colors.text }]}>View Teacher Profile</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} /> 
        </ScrollView>
      )}

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Dashboard')}>
          <FontAwesome5 name="home" size={20} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('NotificationsScreen')}>
          <FontAwesome5 name="bell" size={20} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SettingsScreen')}>
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
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
    width: 30,
  },
  cardLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150,150,150,0.2)',
    marginVertical: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    marginBottom: 10,
    zIndex: 2000, 
  },
  controlBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    height: 50,
  },
  dropdownList: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 0.5,
    elevation: 5,
    zIndex: 3000,
  },
  dropdownItem: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  graphCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barLabel: {
    width: 60,
    fontSize: 12,
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(150,150,150,0.2)',
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  barValue: {
    width: 45,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  statsBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center'
  },
  statsValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  fullWidthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
    width: '100%',
  },
  actionBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
  },
});