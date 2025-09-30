import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignupOrLogin from './Component/Screens/SignupOrLogin';
import Login from './Component/Screens/Login';
import Dashboard from './Component/Screens/Dashboard';
import AttendanceScreen from './Component/Screens/AttendanceScreen';
import SettingsScreen from './Component/Screens/SettingsScreen';
import Admin from './Component/Screens/Admin';
import ResetPw from './Component/Screens/ResetPw';
import StaffSignUp from './Component/Screens/StaffSignUp';
import AdminSignUp from './Component/Screens/AdminSignUp';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignupOrLogin"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignupOrLogin" component={SignupOrLogin} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="ResetPw" component={ResetPw} />
        <Stack.Screen name="StaffSignUp" component={StaffSignUp} />
        <Stack.Screen name="AdminSignUp" component={AdminSignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
