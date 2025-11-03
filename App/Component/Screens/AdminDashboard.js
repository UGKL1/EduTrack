import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AdminDashboard() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={require('../../assets/edulogo.png')}
          style={styles.profileImage}
        />
        <Text style={styles.brand}>EDUTRACK</Text>
        <InfoRow label="Name" value="R.S. Sumangala" />
        <InfoRow label="Admin ID" value="AD1258" />
        <InfoRow label="Email Address" value="admin90@gmail.com" />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGrid}>
  <View style={styles.row}>
    <ActionButton
  label="Manage Student"
  icon="users"
  onPress={() => navigation.navigate('ManageStudent')}
/>

    <ActionButton
  label="Manage Teacher"
  icon="users"
  onPress={() => navigation.navigate('ManageTeachers')}
/>
  </View>
  <View style={styles.centerRow}>
  <ActionButton label="Reports" icon="file-alt" />
</View>

</View>


      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TabIcon name="home" label="Dashboard" active />
        <TabIcon name="bell" label="Notifications" />
        <TabIcon name="cog" label="Settings" onPress={() => navigation.navigate('SettingsScreen')} />
      </View>
    </View>
  );
}

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoText}>{label} : {value}</Text>
  </View>
);

const ActionButton = ({ label, icon, full, onPress }) => (
  <TouchableOpacity
    style={[styles.actionButton, full ? styles.fullWidthButton : styles.halfWidthButton]}
    onPress={onPress}
  >
    <FontAwesome5 name={icon} size={20} color="#fff" />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const TabIcon = ({ name, label, active, onPress }) => (
  <TouchableOpacity style={styles.navButton} onPress={onPress}>
    <FontAwesome5 name={name} size={20} color={active ? '#007BFF' : '#ccc'} />
    <Text style={[styles.navText, { color: active ? '#007BFF' : '#ccc' }]}>{label}</Text>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },

  // Header
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 40, // reduce this if needed
  paddingHorizontal: 10,
},

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Profile Card
  profileCard: {
  backgroundColor: '#1E1E1E',
  borderRadius: 15,
  padding: 20,
  alignItems: 'center',
  marginBottom: 20,
  marginTop: 20, // 👈 This pushes it lower
},

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#007BFF',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  brand: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },

  // Action Buttons
  buttonGrid: {
    alignItems: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  halfWidthButton: {
    width: '48%',
  },
  fullWidthButton: {
    width: '100%',
  },
  actionLabel: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },

  // Bottom Navigation
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
    padding: 10,
    flex: 1,
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
  },
  placeholder: {
  width: '48%',
},
centerRow: {
  width: '100%',
  alignItems: 'center',
  marginBottom: 12,
},


});
