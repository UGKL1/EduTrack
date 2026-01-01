// Component/Screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

// Import Firebase auth
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase'; 

// Import Theme Hook
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
    // Access the theme context
    const { colors, themePreference, updateTheme } = useTheme();

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
                            <Text style={[styles.settingText, { color: colors.text }]}>Absence Notification</Text>
                            <Text style={[styles.subtitleText, { color: colors.subText }]}>Notify parents/guardians of absences</Text>
                        </View>
                        <Switch />
                    </View>
                </View>

                {/* Help & Support Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.text }]}>Help & Support</Text>
                    <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.settingText, { color: colors.text }]}>User Guide</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.settingText, { color: colors.text }]}>Contact Support</Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.text }]}>About</Text>
                    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.settingText, { color: colors.text }]}>Version 1.1.1</Text>
                    </View>
                    <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.settingText, { color: colors.text }]}>Terms & Privacy</Text>
                    </TouchableOpacity>
                </View>

                {/* Accounts Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.text }]}>Accounts</Text>
                    
                    {/* FIXED: Navigate to ResetPw screen */}
                    <TouchableOpacity 
                        style={[styles.settingItem, { borderBottomColor: colors.border }]}
                        onPress={() => navigation.navigate('ResetPw')}
                    >
                        <Text style={[styles.settingText, { color: colors.text }]}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={handleLogout}>
                        <Text style={[styles.settingText, { color: colors.text }]}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingItem, { borderBottomColor: 'transparent' }]}>
                        <Text style={[styles.settingText, { color: 'red' }]}>Remove Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Dashboard")}>
                    <FontAwesome5 name="home" size={20} color={colors.text} />
                    <Text style={[styles.navText, { color: colors.text }]}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('NotificationsScreen')}>
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

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Background color handled dynamically
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        marginTop: 40, // Top margin for safe area
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        padding: 10,
    },
    headerTitle: {
        // Color handled dynamically
        fontSize: 22,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Extra padding so content isn't hidden behind bottom nav
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        // Color handled dynamically
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
        // Border color handled dynamically
    },
    settingText: {
        // Color handled dynamically
        fontSize: 16,
    },
    subtitleText: {
        // Color handled dynamically
        fontSize: 12,
        marginTop: 4,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // Background color handled dynamically
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
        // Color handled dynamically
        marginTop: 5,
        fontSize: 12,
    },
    // Radio Button Styles
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
        // Background color handled dynamically
    },
});