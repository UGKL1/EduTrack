import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Alert } from 'react-native';
// 1. Import the necessary Firebase auth functions (e.g., signInWithEmailAndPassword)
import { signInWithEmailAndPassword } from 'firebase/auth'; 
// 2. Import your Firebase auth instance
import { auth } from '../../config/firebase'; 
// Optional: Import a hypothetical function for admin-specific sign-in if needed
// import { signInAdmin } from '../utils/auth'; 

export default function Login() {   
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator

  const navigation = useNavigation();

  // 1. Unified function for regular user login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // Use Firebase function to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Success! The useAuth hook will detect the user and switch the stack to Dashboard.
      console.log("User logged in:", userCredential.user.uid);
      
      // No need to call navigation.navigate("Dashboard") here, 
      // as the AppNavigation component handles the switch automatically.
      
    } catch (error) {
      // Handle Firebase errors (e.g., 'auth/invalid-email', 'auth/wrong-password')
      const errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 2. Modified Admin login to navigate to the Admin screen
  // NOTE: You should implement proper admin role checking on your backend/in your Firebase
  // user data after the successful login in the handleLogin function.
  const handleAdminLogin = async () => {
    // For a simple demonstration, we'll try to log in and then navigate to Admin
    // For production, you must verify the user's role AFTER successful authentication.
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // If sign-in is successful, you would normally check if the user has an 'admin' role.
      // For now, we'll assume successful sign-in allows navigation to the Admin screen, 
      // but the AppStack must handle this.
      
      // Because your AppNavigation only switches between AuthStack and AppStack,
      // and Admin is part of AppStack, a successful login will put the user in AppStack 
      // (Dashboard). We need to explicitly navigate to the Admin screen *after* the switch.
      
      // A common pattern is to navigate only after a small delay to let the stack switch happen:
      setTimeout(() => {
          navigation.navigate('Admin'); // Use the correct screen name: 'Admin'
      }, 100);

    } catch (error) {
      const errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
      Alert.alert("Admin Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ... (Logo and other components remain the same) ... */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/edulogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Staff ID / Email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none" // Important for email inputs
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={styles.checkbox}>
              {rememberMe && <Text style={styles.tick}>✓</Text>}
            </View>
            <Text style={styles.remember}>Remember me</Text>
          </TouchableOpacity>

          {/* Correct navigation name for Forgot Password is 'ResetPw' */}
          <TouchableOpacity onPress={() => navigation.navigate('ResetPw')}> 
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login buttons */}
        <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading} // Disable button while loading
        >
          <Text style={styles.buttonText}>{loading ? 'Logging In...' : 'Log-in'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.buttonAlt} 
            onPress={handleAdminLogin}
            disabled={loading} // Disable button while loading
        >
          <Text style={styles.buttonText}>{loading ? 'Logging In...' : 'Log-in as an Administrator'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... (Styles remain the same) ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logo: {
    width: 150,
    height: 150,
  },
  formContainer: {
    flex: 1,
    marginTop: 150,
  },
  input: {
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  remember: {
    color: '#ccc',
  },
  forgot: {
    color: '#007BFF',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonAlt: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tick: {
    color: '#007BFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});