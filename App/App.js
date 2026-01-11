// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

// Import components for the loading screen
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Import screens from assets
import SignupOrLogin from './Component/Screens/SignupOrLogin';
import Login from './Component/Screens/Login';
import Dashboard from './Component/Screens/Dashboard';
import AttendanceScreen from './Component/Screens/AttendanceScreen';
import SettingsScreen from './Component/Screens/SettingsScreen';
import Admin from './Component/Screens/Admin';
import ResetPw from './Component/Screens/ResetPw';
import StaffSignUp from './Component/Screens/StaffSignUp';
import AdminSignUp from './Component/Screens/AdminSignUp';
import AdminDashboard from './Component/Screens/AdminDashboard';
import TeacherProfile from './Component/Screens/TeacherProfile';
import ManageStudent from './Component/Screens/ManageStudent';
import ManageTeachers from './Component/Screens/ManageTeachers';
import QuickAccess from './Component/Screens/QuickAccess';
import AttendanceReports from './Component/Screens/AttendanceReports';


import NotificationsScreen from './Component/Screens/NotificationsScreen';
import AdminNotificationsScreen from './Component/Screens/AdminNotificationsScreen';
import AdminReport from './Component/Screens/AdminReport';
import RegisterScreen from './Component/Screens/RegisterScreen';

// Import Auth hook
import useAuth from './hooks/useAuth';

// Import Theme context
import { ThemeProvider } from './context/ThemeContext';

const Stack = createNativeStackNavigator();

// Auth Stack (Not Logged In)
function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="SignupOrLogin"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignupOrLogin" component={SignupOrLogin} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="StaffSignUp" component={StaffSignUp} />
      <Stack.Screen name="AdminSignUp" component={AdminSignUp} />
      <Stack.Screen name="ResetPw" component={ResetPw} />



    </Stack.Navigator>
  );
}

// Teacher stack (Logged in)
function TeacherAppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="TeacherProfile" component={TeacherProfile} />
      <Stack.Screen name="QuickAccess" component={QuickAccess} />
      <Stack.Screen name="AttendanceReports" component={AttendanceReports} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <Stack.Screen name="ResetPw" component={ResetPw} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

    </Stack.Navigator>
  );
}

//Admin stack (Logged in)
function AdminAppStack() {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="ManageStudent" component={ManageStudent} />
      <Stack.Screen name="ManageTeachers" component={ManageTeachers} />
      <Stack.Screen name="AdminNotificationsScreen" component={AdminNotificationsScreen} />
      <Stack.Screen name="AdminReport" component={AdminReport} />
      <Stack.Screen name="ResetPw" component={ResetPw} />
    </Stack.Navigator>
  );
}

// Loading Screen Component
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
}

// App root component
export default function App() {
  const { user, isAuthLoading } = useAuth();

  return (
    <ThemeProvider>
      <NavigationContainer>
        {isAuthLoading ? (
          <LoadingScreen />
        ) : user ? (
          user.role === 'Admin' ? (
            <AdminAppStack />
          ) : (
            <TeacherAppStack />
          )
        ) : (
          <AuthStack />
        )}
        <Toast />
      </NavigationContainer>
    </ThemeProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
