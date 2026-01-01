import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext'; // Import Theme Hook

const adminNotifications = [
  {
    id: '1',
    message: 'Password is successfully reset',
    time: '2 hrs',
  },
  {
    id: '2',
    message: 'Mr. R.D.Liyanage added one student to the class',
    time: '2 hrs',
  },
  {
    id: '3',
    message: 'Mrs. L.Rathnayake has changed her profile picture',
    time: '1 d',
  },
];

export default function AdminNotificationsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme(); // Use Theme

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.row}>
        <Ionicons name="notifications-outline" size={20} color={colors.subText} />
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

      {/* Notifications list */}
      <FlatList
        data={adminNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
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
  },
});