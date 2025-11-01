import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TeacherProfile() {
  const navigation = useNavigation();

  return (
    
  <View style={styles.container}>
    <View style={styles.headerRow}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Ionicons name="arrow-back" size={24} color="#fff" />
  </TouchableOpacity>
  <View style={styles.titleWrapper}>
    <Text style={styles.title}>View Profile</Text>
  </View>
</View>


    <View style={styles.logoContainer}>
      <Image
        source={require('../../assets/edulogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>

    <View style={styles.infoContainer}>
      <InfoRow label="Name" value="P. H. Weerasinghe" />
      <InfoRow label="Staff ID" value="T2335665" />
      <InfoRow label="Email Address" value="teacher12@gmail.com" />
      <InfoRow label="Contact No" value="0777845481" />
      <InfoRow label="Class" value="Grade 7 - A" />
    </View>

    <View style={styles.bottomNav}>
      <TabIcon name="home" label="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <TabIcon name="notifications" label="Notifications" active />
      <TabIcon name="settings" label="Settings" onPress={() => navigation.navigate('SettingsScreen')} />
    </View>
  </View>
);

}

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoText}>{label} : {value}</Text>
    <Ionicons name="pencil" size={18} color="#ccc" />
  </View>
);

const TabIcon = ({ name, label, active, onPress }) => (
  <TouchableOpacity style={styles.navButton} onPress={onPress}>
    <Ionicons name={name} size={20} color={active ? 'red' : '#fff'} />
    <Text style={[styles.navText, active && { color: 'red' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 80,
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    marginTop: 80,
    marginBottom: 30,
    gap: 12,
  },
  infoRow: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    flexShrink: 1,
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
    marginTop: 4,
    fontSize: 12,
  },
  headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
  paddingHorizontal: 10,
},

backButton: {
  width: 40,
  alignItems: 'flex-start',
},

titleWrapper: {
  flex: 1,
  alignItems: 'center',
},

title: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#fff',
},


});
