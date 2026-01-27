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
  Dimensions
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import useAuth from '../../hooks/useAuth';

export default function ClassOverviewScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const [selectedView, setSelectedView] = useState('Monthly');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [className, setClassName] = useState("Loading...");
  const [teacherName, setTeacherName] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  
  // Stats for the Graph
  const [stats, setStats] = useState({
    Annually: 0,
    Monthly: 0,
    Weekly: 0,
  });

  // --- 1. Main Data Fetch Function ---
  const fetchClassData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // STEP A: Force Fetch Fresh Teacher Profile
      // (This fixes the "Not Assigned" bug by getting the latest data directly from DB)
      const userRef = doc(firestore, 'teachers', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.log("Teacher profile not found");
        setLoading(false);
        return;
      }

      const freshData = userSnap.data();
      const targetGrade = freshData.grade;
      const targetSection = freshData.section;
      
      setTeacherName(freshData.username || "Unknown");

      // Check if Grade/Section exists
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
        setStats({ Annually: 0, Monthly: 0, Weekly: 0 });
        setLoading(false);
        return;
      }

      // STEP C: Fetch & Calculate Attendance
      const attQuery = query(collection(firestore, 'attendance'), orderBy('timestamp', 'desc'));
      const attSnapshot = await getDocs(attQuery);
      
      const now = new Date();
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      // Get valid student names for this class
      const classStudentNames = new Set(studentSnapshot.docs.map(doc => doc.data().studentName));
      
      let presentYear = 0, presentMonth = 0, presentWeek = 0;
      const daysYear = new Set(), daysMonth = new Set(), daysWeek = new Set();

      attSnapshot.forEach(doc => {
        const data = doc.data();
        // Only process if student belongs to this class
        if (classStudentNames.has(data.studentName)) {
          const rDate = new Date(data.date);
          
          if (rDate >= startOfYear) {
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

      // Helper to calculate %
      const calc = (present, days) => {
        if (days === 0 || totalStudents === 0) return 0;
        const result = (present / (totalStudents * days)) * 100;
        return result > 100 ? 100 : result; // Cap at 100
      };

      setStats({
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
    }, [user])
  );

  // --- Custom Bar Component for Graph ---
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header with Back Button */}
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
        <View style={styles.content}>
          
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
              <FontAwesome5 name="user-graduate" size={24} color={colors.primary} style={styles.icon} />
              <View>
                <Text style={[styles.cardLabel, { color: colors.subText }]}>Students</Text>
                <Text style={[styles.cardValue, { color: colors.text }]}>{studentCount} Enrolled</Text>
              </View>
            </View>
          </View>

          {/* 2. Visual Graph Section */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Graph</Text>
          <View style={[styles.graphCard, { backgroundColor: colors.card }]}>
            <Bar label="Weekly" percentage={stats.Weekly} />
            <Bar label="Monthly" percentage={stats.Monthly} />
            <Bar label="Annual" percentage={stats.Annually} />
          </View>

          {/* 3. Big Percentage Display */}
          <View style={styles.toggleRow}>
            {['Weekly', 'Monthly', 'Annually'].map((view) => (
              <TouchableOpacity
                key={view}
                onPress={() => setSelectedView(view)}
                style={[
                  styles.pill,
                  selectedView === view && { backgroundColor: colors.primary }
                ]}
              >
                <Text style={[
                  styles.pillText, 
                  selectedView === view ? { color: '#fff' } : { color: colors.text }
                ]}>
                  {view}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bigStat}>
            <Text style={[styles.bigStatValue, { color: colors.primary }]}>
              {stats[selectedView].toFixed(1)}%
            </Text>
            <Text style={[styles.bigStatLabel, { color: colors.subText }]}>
              Average Attendance
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

        </View>
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 10,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bigStat: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bigStatValue: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  bigStatLabel: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
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
  actionBtnText: {
    color: '#fff',
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