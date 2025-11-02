import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Screens
import SignupOrLogin from './Component/Screens/SignupOrLogin';
import Login from './Component/Screens/Login';
import Dashboard from './Component/Screens/Dashboard';
import AttendanceReports from './Component/Screens/AttendanceReports';
import AttendanceScreen from './Component/Screens/AttendanceScreen';
import SettingsScreen from './Component/Screens/SettingsScreen';
import Admin from './Component/Screens/Admin';
import ResetPw from './Component/Screens/ResetPw';
import StaffSignUp from './Component/Screens/StaffSignUp';
import AdminSignUp from './Component/Screens/AdminSignUp';
import AdminDashboard from './Component/Screens/AdminDashboard';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import AttendanceReports from './Component/Screens/AttendanceReports';
// <-- Import AdminDashboard

=======
import TeacherProfile from './Component/Screens/TeacherProfile';
import ManageStudent from './Component/Screens/ManageStudent';
import ManageTeachers from './Component/Screens/ManageTeachers'; // <-- Import AdminDashboard
import QuickAccess from './Component/Screens/QuickAccess';
import AttendanceReports from './Component/Screens/AttendanceReports';
>>>>>>> Stashed changes
// Import auth hook
=======
import TeacherProfile from './Component/Screens/TeacherProfile';
import ManageStudent from './Component/Screens/ManageStudent';
import ManageTeachers from './Component/Screens/ManageTeachers';
import QuickAccess from './Component/Screens/QuickAccess';

// Hooks
>>>>>>> Stashed changes
import useAuth from './hooks/useAuth';

const Stack = createNativeStackNavigator();

// 🔹 Stack for NOT logged-in users
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
<<<<<<< Updated upstream
=======
      <Stack.Screen name="TeacherProfile" component={TeacherProfile} />
      <Stack.Screen name="ManageStudent" component={ManageStudent} />
      <Stack.Screen name="ManageTeachers" component={ManageTeachers} />
      <Stack.Screen name="QuickAccess" component={QuickAccess} />
      <Stack.Screen name="AttendanceReports" component={AttendanceReports} />
>>>>>>> Stashed changes
    </Stack.Navigator>
  );
}

// 🔹 Stack for TEACHERS
function TeacherAppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
<<<<<<< Updated upstream
      <Stack.Screen name="AttendanceReports" component={AttendanceReports} />
=======
      <Stack.Screen name="TeacherProfile" component={TeacherProfile} />
      <Stack.Screen name="AttendanceReports" component={AttendanceReports} />
      <Stack.Screen name="QuickAccess" component={QuickAccess} />
      {/* Optional: Teachers can see reports if needed */}
      {/* <Stack.Screen name="AttendanceReports" component={AttendanceReports} /> */}
>>>>>>> Stashed changes
    </Stack.Navigator>
  );
}

// 🔹 Stack for ADMINS
function AdminAppStack() {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
<<<<<<< Updated upstream
      {/* You can add more admin-specific screens here */}
=======
      <Stack.Screen name="ManageStudent" component={ManageStudent} />
      <Stack.Screen name="ManageTeachers" component={ManageTeachers} />
      <Stack.Screen name="AttendanceReports" component={AttendanceReports} />
>>>>>>> Stashed changes
    </Stack.Navigator>
  );
}

// 🔹 Loading screen
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
        <LoadingScreen />
      ) : user ? (
        user.role?.toLowerCase() === 'admin' ? ( // ✅ ensure role is correct
          <AdminAppStack />
        ) : (
          <TeacherAppStack />
        )
      ) : (
        <AuthStack />
      )}
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
