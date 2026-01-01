import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext'; // Import Theme Hook

const notifications = [
  {
    id: '1',
    message: 'Achintha was absent today. A message will be sent to the guardian.',
    time: '2 hrs',
  },
  {
    id: '2',
    message: 'P.L.Perera’s attendance has dropped below 80%',
    time: '2 hrs',
  },
  {
    id: '3',
    message: 'This week your class attendance is above 90%.',
    time: '1 d',
  },
  {
    id: '4',
    message: 'Don’t forget to submit monthly attendance report.',
    time: '2 d',
  },
  {
    id: '5',
    message: 'Admin added you to Class.',
    time: '3 d',
  },
  {
    id: '6',
    message: 'Achintha was absent today. A message will be sent to the guardian.',
    time: '1 w',
  },
];

export default function NotificationsScreen() {
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

      {/* Section title */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Attendance Alerts</Text>

      {/* Notifications list */}
      <FlatList
        data={notifications}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  notificationItem: {
    marginBottom: 10,
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