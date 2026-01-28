import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
// Firebase Imports
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../config/firebase';

export default function AdminNotificationsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  
  // State for dynamic notifications
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Query the 'admin_notifications' collection, sorted by newest first
    const q = query(
      collection(firestore, 'admin_notifications'),
      orderBy('timestamp', 'desc')
    );

    // 2. Set up the Real-time Listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotes = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Convert Firebase Timestamp to readable string
        let timeString = 'Just now';
        if (data.timestamp) {
          const date = data.timestamp.toDate();
          // Formats to "10:30 AM" or similar based on locale
          timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        return { 
          id: doc.id, 
          ...data, 
          time: timeString 
        };
      });
      
      setNotifications(fetchedNotes);
      setLoading(false);
    });

    // Cleanup: Stop listening when screen closes
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.row}>
        {/* Dynamic Icon based on type (success checkmark or alert bell) */}
        <Ionicons 
          name={item.type === 'success' ? "checkmark-circle" : "notifications-outline"} 
          size={20} 
          color={item.type === 'success' ? '#4CAF50' : colors.subText} 
        />
        <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      <Text style={[styles.time, { color: colors.subText }]}>{item.time}</Text>
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
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
      </View>

      {/* Loading State or List */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.subText }}>
              No notifications yet.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 15,
  },
  notificationItem: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  message: {
    fontSize: 14,
    flex: 1,
    marginLeft: 10,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 2,
    marginBottom: 5,
  },
  separator: {
    height: 1,
    marginTop: 5,
    opacity: 0.2 // Slightly faded separator
  },
});