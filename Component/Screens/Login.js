// Component/Screens/Login.js
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';

// Import Firebase auth and firestore functions
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Email and password are required.' });
      return;
    }

    setLoading(true);

    try {
      // Sign in with Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get user document from Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        // Check user role
        if (userData.role === 'Teacher') {
          // Success! The useAuth hook will handle navigation
          Toast.show({ type: 'success', text1: 'Welcome back!' });
        } else {
          // Wrong role! Sign them out.
          await signOut(auth);
          Toast.show({
            type: 'error',
            text1: 'Admin Account',
            text2: 'Please use the Admin sign-in screen.',
          });
        }
      } else {
        // No user data found 
        await signOut(auth);
        Toast.show({
          type: 'error',
          text1: 'User data not found.',
        });
      }
    } catch (error) {
      // Handle Auth errors
      console.log('Login Error:', error.message);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        Toast.show({ type: 'error', text1: 'Invalid email or password.' });
      } else {
        Toast.show({ type: 'error', text1: 'An error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/edulogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Staff ID / Email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
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
          <TouchableOpacity onPress={() => navigation.navigate('ResetPw')}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonAlt}
          onPress={() => navigation.navigate('Admin')}
        >
          <Text style={styles.buttonText}>Sign in as an Administrator</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('SignupOrLogin')}
        >
          <Text style={styles.buttonText}>Back to Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
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
    marginTop: 80, 
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
    alignItems: 'center',
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
    backgroundColor: '#0056b3', 
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
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tick: {
    color: '#007BFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  secondaryButton: {
  backgroundColor: '#444', 
},
});