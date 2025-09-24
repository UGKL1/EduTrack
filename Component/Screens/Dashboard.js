import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Dashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.profileHeader}>Dashboard</Text>
        <Image
          source={{ uri: 'https://placehold.co/100x100/A020F0/white?text=User' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Mr. Fernando</Text>
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
          <Text style={styles.gridButtonText}>Student's Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton}>
          <FontAwesome5 name="chart-bar" size={24} color="#007BFF" />
          <Text style={styles.gridButtonText}>Class Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton}>
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
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("SettingsScreen")}>
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
    backgroundColor: '#0D0D0D', // Dark background
    paddingHorizontal: 15,
    paddingTop: 40,
  },
  topSection: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingLeft: 5,
  },
  dashboardHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
    fontSize: 18,
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
