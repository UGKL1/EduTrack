import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, PanResponder, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { firestore } from '../../config/firebase';

export default function AdminNotificationsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(firestore, 'admin_notifications'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotes = snapshot.docs.map(doc => {
        const data = doc.data();
        let timeString = 'Just now';
        if (data.timestamp) {
          const date = data.timestamp.toDate();
          timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return { id: doc.id, ...data, time: timeString };
      });
      setNotifications(fetchedNotes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'admin_notifications', id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearAll = () => {
    Alert.alert('Clear All Notifications', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All', style: 'destructive', onPress: async () => {
          const batch = writeBatch(firestore);
          notifications.forEach(n => batch.delete(doc(firestore, 'admin_notifications', n.id)));
          await batch.commit();
        }
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const translateX = new Animated.Value(0);
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderMove: (_, g) => { if (g.dx < 0) translateX.setValue(g.dx); },
      onPanResponderRelease: (_, g) => {
        if (g.dx < -80) {
          Animated.timing(translateX, { toValue: -500, duration: 250, useNativeDriver: true })
            .start(() => handleDelete(item.id));
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    });

    return (
      <Animated.View {...panResponder.panHandlers} style={{ transform: [{ translateX }] }}>
        <View style={styles.notificationItem}>
          <View style={styles.row}>
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
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={22} color={colors.text} onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        {notifications.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 15, flex: 1 },
  clearAllText: { color: '#FF3B30', fontSize: 14, fontWeight: '600' },
  notificationItem: { marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  message: { fontSize: 14, flex: 1, marginLeft: 10, lineHeight: 20 },
  time: { fontSize: 12, textAlign: 'right', marginTop: 2, marginBottom: 5 },
  separator: { height: 1, marginTop: 5, opacity: 0.2 },
});