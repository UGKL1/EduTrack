import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { firestore } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Firestore listener for notifications
    const q = query(collection(firestore, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
      console.log("Fetched notifications:", data); // 🔍 Debug log
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.row}>
        <Ionicons name="notifications-outline" size={20} color={colors.subText} />
        <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>
          {item.message || "No message"}
        </Text>
      </View>
      <Text style={[styles.time, { color: colors.subText }]}>
        {item.createdAt?.toDate
          ? item.createdAt.toDate().toLocaleString()
          : ""}
      </Text>
      <View style={[styles.separator, { backgroundColor: colors.border }]} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={22}
          color={colors.text}
          onPress={() => navigation.goBack()} // navigates back to Home or previous screen
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
      </View>

      {/* Section title */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Attendance Alerts</Text>

      {/* Notifications list */}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={{ color: colors.subText, textAlign: 'center', marginTop: 20 }}>
          No notifications yet
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  notificationItem: { marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  message: { fontSize: 14, flex: 1, marginLeft: 10, lineHeight: 20 },
  time: { fontSize: 12, textAlign: 'right', marginTop: 2, marginBottom: 5 },
  separator: { height: 1, marginTop: 5 },
});
