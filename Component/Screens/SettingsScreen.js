import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
    const handleBack = () => {
        navigation.goBack();
    };

    const handleLogout = () => {
        // You can also clear any async storage or tokens here if needed
        navigation.navigate("SignupOrLogin");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Notifications</Text>
                <View style={[styles.settingItem, { alignItems: 'flex-start' }]}>
                    <View>
                        <Text style={styles.settingText}>Absence Notification</Text>
                        <Text style={styles.subtitleText}>Notify parents/guardians of absences</Text>
                    </View>
                    <Switch />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Help & Support</Text>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>User Guide</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Contact Support</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>About</Text>
                <Text style={styles.settingText}>Version 1.1.1</Text>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Terms & Privacy</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Accounts</Text>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Change Password</Text>
                </TouchableOpacity>

                {/* ✅ Modified Logout Button */}
                <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
                    <Text style={styles.settingText}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={[styles.settingText, { color: 'red' }]}>Remove Account</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Dashboard")}>
                    <FontAwesome5 name="home" size={20} color="#fff" />
                    <Text style={styles.navText}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <FontAwesome5 name="bell" size={20} color="#fff" />
                    <Text style={styles.navText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <FontAwesome5 name="cog" size={20} color="#007BFF" />
                    <Text style={styles.navText}>Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        padding: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#1E1E1E',
    },
    settingText: {
        color: '#fff',
        fontSize: 16,
    },
    subtitleText: {
        color: '#ccc',
        fontSize: 12,
        marginTop: 4,
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
        marginTop: 5,
        fontSize: 12,
    },
});
