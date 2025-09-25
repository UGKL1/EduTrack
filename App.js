import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from './hooks/useAuth'; 

// Unauthenticated Screens
import SignupOrLogin from './Component/Screens/SignupOrLogin';
import Login from './Component/Screens/Login';
import ResetPw from './Component/Screens/ResetPw';

// Authenticated/App Screens
import Dashboard from './Component/Screens/Dashboard';
import AttendanceScreen from './Component/Screens/AttendanceScreen';
import SettingsScreen from './Component/Screens/SettingsScreen';
import Admin from './Component/Screens/Admin';


const Stack = createNativeStackNavigator();

// Stack Navigator for authenticated users (App Screens).

function AppScreens() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} /> 
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} /> 
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="Admin" component={Admin} />
      {<Stack.Screen name="ResetPw" component={ResetPw} />}
    </Stack.Navigator>
  );
}

// Stack Navigator for unauthenticated users (Auth Screens).

function AuthScreens() {
  return (
    <Stack.Navigator
      initialRouteName="SignupOrLogin"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignupOrLogin" component={SignupOrLogin} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ResetPw" component={ResetPw} />
    </Stack.Navigator>
  );
}

// Main application navigation, conditional based on authentication status.

export default function AppNavigation() {
  // Assuming useAuth returns an object or boolean that indicates the user's logged-in status
  const { user } = useAuth(); 

  return (
    <NavigationContainer>
      {user ? <AppScreens /> : <AuthScreens />}
    </NavigationContainer>
  );
}