// Component/Screens/StaffSignUp.js
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase';
import { useTheme } from '../../context/ThemeContext';

export default function StaffSignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Dropdown States ---
  const [gradeOpen, setGradeOpen] = useState(false);
  const [grade, setGrade] = useState(null);
  const [gradeItems, setGradeItems] = useState([
    { label: 'Grade 1', value: '1' },
    { label: 'Grade 2', value: '2' },
    { label: 'Grade 3', value: '3' },
    { label: 'Grade 4', value: '4' },
    { label: 'Grade 5', value: '5' }
   
  ]);

  const [sectionOpen, setSectionOpen] = useState(false);
  const [section, setSection] = useState(null);
  const [sectionItems, setSectionItems] = useState([
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' }
  ]);

  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleSignup = async () => {
    // 1. Basic Empty Field Validation
    if (!username || !email || !grade || !section || !newPassword || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'All fields are required.' });
      return;
    }

    // 2. Email Validation (Must be a valid format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({ type: 'error', text1: 'Please enter a valid email address.' });
      return;
    }

    // 3. Password Validation (8+ chars, at least 1 letter, at least 1 number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      Toast.show({ 
        type: 'error', 
        text1: 'Password must be 8+ chars, with at least 1 letter and 1 number.' 
      });
      return;
    }

    // 4. Password Match Validation
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match.' });
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, newPassword);
      const user = userCredential.user;

      // Save user role and info to 'teachers' collection in Firestore
      await setDoc(doc(firestore, 'teachers', user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        grade: grade,
        section: section,
        role: 'Teacher',
      });

      // Success Notification
      Toast.show({
        type: 'success',
        text1: 'Account created successfully!',
        text2: 'Please sign in.',
      });

      // Navigate to Login screen
      navigation.navigate('Login');

    } catch (error) {
      console.log('Signup Error:', error.message);
      if (error.code === 'auth/email-already-in-use') {
        Toast.show({ type: 'error', text1: 'Email is already in use.' });
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
        
        {/* Dropdowns Row */}
        <View style={[styles.dropdownRow, { zIndex: 1000 }]}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <DropDownPicker
              open={gradeOpen}
              value={grade}
              items={gradeItems}
              setOpen={setGradeOpen}
              setValue={setGrade}
              setItems={setGradeItems}
              placeholder="Grade"
              style={[styles.dropdown, { backgroundColor: colors.card }]}
              textStyle={{ color: colors.text }}
              dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.card }]}
              onOpen={() => setSectionOpen(false)} // Closes the section dropdown if open
            />
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <DropDownPicker
              open={sectionOpen}
              value={section}
              items={sectionItems}
              setOpen={setSectionOpen}
              setValue={setSection}
              setItems={setSectionItems}
              placeholder="Section"
              style={[styles.dropdown, { backgroundColor: colors.card }]}
              textStyle={{ color: colors.text }}
              dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.card }]}
              onOpen={() => setGradeOpen(false)} // Closes the grade dropdown if open
            />
          </View>
        </View>

        {/* Password Inputs */}
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

        {/* Action Buttons */}
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

// --- Styles ---
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
    marginTop: 20, 
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  dropdownRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  dropdown: {
    borderColor: 'transparent',
    borderRadius: 8,
    minHeight: 50,
  },
  dropdownContainer: {
    borderColor: 'transparent',
    borderRadius: 8,
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