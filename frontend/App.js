import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupOrLogin from './Componment/Screens/SignupOrLogin';
import Login from './Componment/Screens/Login'; 

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}