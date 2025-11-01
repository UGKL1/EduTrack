// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

// Import components for the loading screen
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Import screens
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
import ManageTeachers from './Component/Screens/ManageTeachers';// <-- Import AdminDashboard
import QuickAccess from './Component/Screens/QuickAccess';
// Import auth hook
import useAuth from './hooks/useAuth';



const Stack = createNativeStackNavigator();

// Stack for users who are NOT logged in
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
      <Stack.Screen name="TeacherProfile" component={TeacherProfile} />
      <Stack.Screen name="ManageStudent" component={ManageStudent} />
      <Stack.Screen name="ManageTeachers" component={ManageTeachers} />
      <Stack.Screen name="QuickAccess" component={QuickAccess} />
    </Stack.Navigator>
  );
}

// Stack for TEACHERS who ARE logged in
function TeacherAppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard" // <-- Teacher starting screen
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="TeacherProfile" component={TeacherProfile} />
      <Stack.Screen name="QuickAccess" component={QuickAccess} />
    </Stack.Navigator>
  );
}

// Stack for ADMINS who ARE logged in
function AdminAppStack() {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard" // <-- Admin starting screen
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      {/* Add other screens admins can access, e.g., Settings */}
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="ManageStudent" component={ManageStudent} />
      <Stack.Screen name="ManageTeachers" component={ManageTeachers} />
      {/* You can add more admin-specific screens here */}
    </Stack.Navigator>
  );
}

// Loading component
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
}

export default function App() {
  const { user, isAuthLoading } = useAuth();

  return (
    <NavigationContainer>
      {isAuthLoading ? (
        // 1. Show loading screen while useAuth is checking
        <LoadingScreen />
      ) : user ? (
        // 2. User is logged in, check their role
        user.role === 'Admin' ? (
          <AdminAppStack /> // Go to Admin screens
        ) : (
          <TeacherAppStack /> // Go to Teacher screens
        )
      ) : (
        // 3. No user, show login screens
        <AuthStack />
      )}
      <Toast />
    </NavigationContainer>
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