// Component/Screens/StaffSignUp.js
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase';
import { useTheme } from '../../context/ThemeContext'; // Import Theme Hook

export default function StaffSignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState(''); // Added Grade State
  const [section, setSection] = useState(''); // Added Section State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { colors } = useTheme(); // Use Theme

  const handleSignup = async () => {
    // Validation
    if (!username || !email || !grade || !section || !newPassword || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'All fields are required.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match.' });
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        newPassword
      );
      const user = userCredential.user;

      // Save user role and info to 'teachers' collection
      await setDoc(doc(firestore, 'teachers', user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        grade: grade, // Save Grade
        section: section, // Save Section
        role: 'Teacher',
      });

      // Success!
      Toast.show({
        type: 'success',
        text1: 'Account created successfully!',
        text2: 'Please sign in.',
      });

      // Navigate to Teacher login screen
      navigation.navigate('Login');

    } catch (error) {
      // Handle errors
      console.log('Signup Error:', error.message);
      if (error.code === 'auth/email-already-in-use') {
        Toast.show({ type: 'error', text1: 'Email is already in use.' });
      } else if (error.code === 'auth/weak-password') {
        Toast.show({
          type: 'error',
          text1: 'Password should be at least 6 characters.',
        });
      } else {
        Toast.show({ type: 'error', text1: 'An error occurred. Try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/edulogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Username"
          placeholderTextColor={colors.placeholder}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Email address"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Grade (e.g. 10)"
          placeholderTextColor={colors.placeholder}
          value={grade}
          onChangeText={setGrade}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Section (e.g. A)"
          placeholderTextColor={colors.placeholder}
          value={section}
          onChangeText={setSection}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="New Password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={24} color={colors.placeholder} />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="Confirm Password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color={colors.placeholder} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign-up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonAlt}
          onPress={() => navigation.navigate('AdminSignUp')}
        >
          <Text style={styles.buttonText}>Sign Up as an Administrator</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  passwordContainer: {
    justifyContent: 'center',
    marginVertical: 8,
  },
  passwordInput: {
    padding: 12,
    borderRadius: 8,
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
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
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
  },
});