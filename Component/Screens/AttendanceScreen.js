import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function AttendanceScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header with back button and centered title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.scanText}>Scan face</Text>
        <View style={styles.scanFrame}>
          <FontAwesome5 name="user-circle" size={150} color="#ccc" />
        </View>

        {/* Status icon */}
        <View style={styles.statusIcon}>
          <FontAwesome5 name="check-circle" size={40} color="green" />
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D', // Dark background
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    justifyContent: 'center', // Center content horizontally
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1, // Allows text to take up available space
    textAlign: 'center', // Centers the text within its flex container
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  scanFrame: {
    width: 250,
    height: 300,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007BFF',
    marginBottom: 20,
  },
  statusIcon: {
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  viewButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
