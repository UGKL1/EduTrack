import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { firestore } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import useAuth from '../../hooks/useAuth';

export default function AdminDashboard() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (!user?.uid) return;
        const adminDocRef = doc(firestore, 'admins', user.uid);
        const adminDocSnap = await getDoc(adminDocRef);
        if (adminDocSnap.exists()) {
          setAdminData(adminDocSnap.data());
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoadingAdmin(false);
      }
    };
    fetchAdminData();
  }, [user]);

  const InfoRow = ({ label, value }) => (
    <View style={[styles.infoRow, { backgroundColor: colors.background }]}>
      <Text style={[styles.infoText, { color: colors.text }]}>
        {label} : {value}
      </Text>
    </View>
  );

  const ActionButton = ({ label, icon, full, onPress }) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        full ? styles.fullWidthButton : styles.halfWidthButton,
        { backgroundColor: colors.card, borderColor: colors.primary }
      ]}
      onPress={onPress}
    >
      <FontAwesome5 name={icon} size={20} color={colors.text} />
      <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  const TabIcon = ({ name, label, active, onPress }) => (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
      <FontAwesome5 name={name} size={20} color={active ? colors.primary : colors.text} />
      <Text style={[styles.navText, { color: active ? colors.primary : colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <Image source={require('../../assets/edulogo.png')} style={styles.profileImage} />
        <Text style={[styles.brand, { color: colors.text }]}>EDUTRACK</Text>
        {loadingAdmin ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 10 }} />
        ) : (
          <>
            <InfoRow label="Name" value={adminData?.username || 'N/A'} />
            <InfoRow label="Admin ID" value={adminData?.staffId || 'N/A'} />
            <InfoRow label="Email Address" value={adminData?.email || user?.email || 'N/A'} />
          </>
        )}
      </View>

      <View style={styles.buttonGrid}>
        <View style={styles.row}>
          <ActionButton label="Manage Student" icon="users" onPress={() => navigation.navigate('ManageStudent')} />
          <ActionButton label="Manage Teacher" icon="users" onPress={() => navigation.navigate('ManageTeachers')} />
        </View>
        <View style={styles.centerRow}>
          <ActionButton label="Reports" icon="file-alt" onPress={() => navigation.navigate('AdminReport')} />
        </View>
      </View>

      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TabIcon name="home" label="Dashboard" active />
        <TabIcon name="bell" label="Notifications" onPress={() => navigation.navigate('AdminNotificationsScreen')} />
        <TabIcon name="cog" label="Settings" onPress={() => navigation.navigate('SettingsScreen')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
  },
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
    borderWidth: 1,
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
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
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
    justifyContent: 'center',
    padding: 10,
    flex: 1,
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
  },
  centerRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
});