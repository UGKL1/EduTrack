import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupOrLogin from './Component/Screens/SignupOrLogin';
import Login from './Component/Screens/Login';
import Dashboard from './Component/Screens/Dashboard';
import AttendanceScreen from './Component/Screens/AttendanceScreen';
import SettingsScreen from './Component/Screens/SettingsScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}