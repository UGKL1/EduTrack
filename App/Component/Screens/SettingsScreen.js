// Component/Screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Firebase auth
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

// Import Theme Hook
import { useTheme } from '../../context/ThemeContext';

// ✅ ADDED: Auth hook to detect Admin / Teacher
import useAuth from '../../hooks/useAuth';

export default function SettingsScreen({ navigation }) {
    // Access the theme context
    const { colors, themePreference, updateTheme } = useTheme();

    // ✅ ADDED: Get logged-in user and role
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    // ✅ Role-based route names (NO hardcoding anymore)
    const dashboardRoute = isAdmin ? 'AdminDashboard' : 'Dashboard';
    const notificationRoute = isAdmin
        ? 'AdminNotificationsScreen'
        : 'NotificationsScreen';

    // ✅ ADDED: Notification State
    const [isAbsenceNotificationEnabled, setIsAbsenceNotificationEnabled] = useState(false);

    // ✅ ADDED: Load Notification Preference
    useEffect(() => {
        const loadNotificationPreference = async () => {
            try {
                const savedPreference = await AsyncStorage.getItem('absenceNotification');
                if (savedPreference !== null) {
                    setIsAbsenceNotificationEnabled(JSON.parse(savedPreference));
                }
            } catch (error) {
                console.log('Failed to load notification preference', error);
            }
        };
        loadNotificationPreference();
    }, []);

    // ✅ ADDED: Toggle Notification Preference
    const toggleSwitch = async () => {
        try {
            const newValue = !isAbsenceNotificationEnabled;
            setIsAbsenceNotificationEnabled(newValue);
            await AsyncStorage.setItem('absenceNotification', JSON.stringify(newValue));

            Toast.show({
                type: 'success',
                text1: newValue ? 'Notifications Enabled' : 'Notifications Disabled',
            });
        } catch (error) {
            console.log('Failed to save notification preference', error);
            Toast.show({ type: 'error', text1: 'Failed to update setting.' });
        }
    };

    const handleOpenURL = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Toast.show({ type: 'error', text1: 'Cannot open this link.' });
            }
        } catch (error) {
            console.log('Error opening URL:', error);
            Toast.show({ type: 'error', text1: 'Failed to open link.' });
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Toast.show({ type: 'success', text1: 'Logged out successfully.' });
        } catch (error) {
            console.log('Logout Error:', error.message);
            Toast.show({ type: 'error', text1: 'Failed to log out.' });
        }
    };

    // Helper component for Radio Button Options
    const RadioOption = ({ label, value }) => (
        <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => updateTheme(value)}
        >
            <Text style={[styles.settingText, { color: colors.text }]}>{label}</Text>
            <View style={[styles.radioCircle, { borderColor: colors.text }]}>
                {themePreference === value && (
                    <View style={[styles.selectedRb, { backgroundColor: colors.primary }]} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={20} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Appearance Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.text }]}>Appearance</Text>
                    <RadioOption label="System Default" value="system" />
                    <RadioOption label="Light Mode" value="light" />
                    <RadioOption label="Dark Mode" value="dark" />
                </View>

                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.text }]}>Notifications</Text>
                    <View style={[styles.settingItem, { alignItems: 'flex-start', borderBottomColor: colors.border }]}>
                        <View>
                            <Text style={[styles.settingText, { color: colors.text }]}>Enable/Disable Notifications</Text>
                            <Text style={[styles.subtitleText, { color: colors.subText }]}>
                                Switch system notifications recivive from the app
                            </Text>
                        </View>
                        <Switch
                            value={isAbsenceNotificationEnabled}
                            onValueChange={toggleSwitch}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={isAbsenceNotificationEnabled ? "#f4f3f4" : "#f4f3f4"}
                        />
                    </View>
                </View>

                {/* Accounts Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.text }]}>Accounts</Text>
                    {/* Navigate to the ResetPw screen */}
                    <TouchableOpacity
                        style={[styles.settingItem, { borderBottomColor: colors.border }]}
                        onPress={() => navigation.navigate('ResetPw')}
                    >
                        <Text style={[styles.settingText, { color: colors.text }]}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingItem, { borderBottomColor: colors.border }]}
                        onPress={handleLogout}
                    >
                        <Text style={[styles.settingText, { color: colors.text }]}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingItem, { borderBottomColor: 'transparent' }]}>
                        <Text style={[styles.settingText, { color: 'red' }]}>Remove Account</Text>
                    </TouchableOpacity>
                </View>

                {/* Help & Support Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.text }]}>Help & Support</Text>
                    <TouchableOpacity
                        style={[styles.settingItem, { borderBottomColor: colors.border }]}
                        onPress={() => handleOpenURL('https://drive.google.com/drive/folders/1q8Ydg4nmXvtUSCWhB6xAYeH1e_LgwTrl?usp=sharing')}
                    >
                        <Text style={[styles.settingText, { color: colors.text }]}>User Guide</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.settingItem, { borderBottomColor: colors.border }]}
                        onPress={() => handleOpenURL('mailto:edutrack123@gmail.com')}
                    >
                        <Text style={[styles.settingText, { color: colors.text }]}>Contact Support</Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.text }]}>About</Text>
                    <TouchableOpacity
                        style={[styles.settingItem, { borderBottomColor: colors.border }]}
                        onPress={() => handleOpenURL('https://github.com/UGKL1/EduTrack/blob/main/README.md')}
                    >
                        <Text style={[styles.settingText, { color: colors.text }]}>Readme on GitHub</Text>
                    </TouchableOpacity>
                    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.settingText, { color: colors.text }]}>Version 1.0</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Navigation (FIXED FOR ADMIN + TEACHER) */}
            <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate(dashboardRoute)}
                >
                    <FontAwesome5 name="home" size={20} color={colors.text} />
                    <Text style={[styles.navText, { color: colors.text }]}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate(notificationRoute)}
                >
                    <FontAwesome5 name="bell" size={20} color={colors.text} />
                    <Text style={[styles.navText, { color: colors.text }]}>Notifications</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton}>
                    <FontAwesome5 name="cog" size={20} color={colors.primary} />
                    <Text style={[styles.navText, { color: colors.primary }]}>Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Styles (UNCHANGED)
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        marginTop: 40,
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        padding: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    section: { marginBottom: 20 },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    settingText: { fontSize: 16 },
    subtitleText: { fontSize: 12, marginTop: 4 },
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
    navButton: { alignItems: 'center', justifyContent: 'center' },
    navText: { marginTop: 5, fontSize: 12 },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});
