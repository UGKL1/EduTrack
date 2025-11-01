<<<<<<< Updated upstream:Component/Screens/Dashboard.js
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Dashboard({ navigation }) {
=======
// Component/Screens/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, firestore } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Dashboard({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // guard: auth.currentUser may be null if not logged in yet
        if (!auth || !auth.currentUser) {
          // no user: stop loading and optionally navigate to login
          setUserData(null);
          setLoading(false);
          return;
        }

        const userId = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'teachers', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.log('No user data found in Firestore!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

>>>>>>> Stashed changes:App/Component/Screens/Dashboard.js
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.profileHeader}>Dashboard</Text>
        <Image
          source={{
            uri:
              userData?.profilePic ||
              'https://placehold.co/100x100/A020F0/white?text=User',
          }}
          style={styles.profileImage}
        />
<<<<<<< Updated upstream:Component/Screens/Dashboard.js
        <Text style={styles.profileName}>Mr. Fernando</Text>
=======
        <Text style={styles.profileName}>{userData?.username || 'User'}</Text>
        <Text style={styles.profileRole}>{userData?.role || 'Teacher'}</Text>
>>>>>>> Stashed changes:App/Component/Screens/Dashboard.js
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate("AttendanceScreen")}>
          <FontAwesome5 name="clipboard-check" size={24} color="#007BFF" />
          <Text style={styles.gridButtonText}>Mark Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridButton}>
          <FontAwesome5 name="user" size={24} color="#007BFF" />
          <Text style={styles.gridButtonText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridButton}>
          <FontAwesome5 name="users" size={24} color="#007BFF" />
          <Text style={styles.gridButtonText}>Student Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridButton}>
          <FontAwesome5 name="chart-bar" size={24} color="#007BFF" />
          <Text style={styles.gridButtonText}>Class Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => navigation.navigate('AttendanceReports')}
        >
          <FontAwesome5 name="file-alt" size={24} color="#007BFF" />
          <Text style={styles.gridButtonText}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridButton}>
          <FontAwesome5 name="bolt" size={24} color="#007BFF" />
          <Text style={styles.gridButtonText}>Quick Access</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome5 name="home" size={20} color="#007BFF" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <FontAwesome5 name="bell" size={20} color="#fff" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
<<<<<<< Updated upstream:Component/Screens/Dashboard.js
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("SettingsScreen")}>
=======

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
>>>>>>> Stashed changes:App/Component/Screens/Dashboard.js
          <FontAwesome5 name="cog" size={20} color="#fff" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

<<<<<<< Updated upstream:Component/Screens/Dashboard.js
=======
// Styles (same as your theme)
>>>>>>> Stashed changes:App/Component/Screens/Dashboard.js
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D', // Dark background
    paddingHorizontal: 15,
    paddingTop: 40,
  },
<<<<<<< Updated upstream:Component/Screens/Dashboard.js
  topSection: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingLeft: 5,
  },
  dashboardHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
=======
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
>>>>>>> Stashed changes:App/Component/Screens/Dashboard.js
  },
  profileCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileHeader: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileRole: {
    color: '#B0B0B0',
    fontSize: 14,
    marginTop: 3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridButton: {
    backgroundColor: '#1E1E1E',
    width: '48%',
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  gridButtonText: {
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
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
    justifyContent: 'center',
  },
  navText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
  },
});
