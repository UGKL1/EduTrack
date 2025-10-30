// Component/Screens/Admin.js
import { useState } from 'react';
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

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleAdminLogin = async () => {
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

      // Check if user is in the 'admins' collection
      const userDocRef = doc(firestore, 'admins', user.uid); // <-- MODIFIED
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Success! User is an Admin.
        // The useAuth hook will handle navigation to the Admin Dashboard.
        Toast.show({ type: 'success', text1: 'Welcome, Admin!' });
      } else {
        // User is not in 'admins'. Check if they are a 'teacher'.
        const teacherDocRef = doc(firestore, 'teachers', user.uid);
        const teacherDocSnap = await getDoc(teacherDocRef);

        if (teacherDocSnap.exists()) {
          // This is a teacher account
          await signOut(auth);
          Toast.show({
            type: 'error',
            text1: 'Teacher Account',
            text2: 'Please use the Staff sign-in screen.',
          });
        } else {
          // User exists in auth but not in 'teachers' or 'admins' DB
          await signOut(auth);
          Toast.show({
            type: 'error',
            text1: 'User data not found.',
            text2: 'Please contact support.',
          });
        }
      }
    } catch (error) {
      // Handle Auth errors
      console.log('Admin Login Error:', error.message);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        Toast.show({ type: 'error', text1: 'Invalid admin credentials.' });
      } else {
        Toast.show({ type: 'error', text1: 'An error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // ... (rest of the file, styles are unchanged)
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
          placeholder="Admin ID / Email address"
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
            onPPress={() => setRememberMe(!rememberMe)}
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
          style={styles.buttonAlt}
          onPress={handleAdminLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign-in as an Administrator</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
// ... (styles)
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