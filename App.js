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
    </Stack.Navigator>
  );
}

// Stack is for users who ARE logged in
function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
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
      {/* If Firebase is loading, show the loading screen.
      */}
      {isAuthLoading ? (
        <LoadingScreen />
      ) : /* If Firebase is done and 'user' exists, show the main app.
      */
      user ? (
        <AppStack />
      ) : (
        /* If Firebase is done and 'user' is null, show the login screens.
      */
        <AuthStack />
      )}
      {/* Adds the Toast message component globally */}
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