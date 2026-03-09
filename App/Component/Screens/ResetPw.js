// Component/Screens/ResetPw.js
import React, { useState } from 'react';
import {
  StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useTheme } from '../../context/ThemeContext'; // Import Theme Hook

export default function ResetPw() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { colors } = useTheme(); // Use Theme

  const handleReset = async () => {
    if (!email) {
      Toast.show({ type: 'error', text1: 'Please enter your email address.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({ type: 'error', text1: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);

    try {
      // Send the password reset email
      await sendPasswordResetEmail(auth, email);

      Toast.show({
        type: 'success',
        text1: 'Password reset email sent!',
        text2: 'Please check your inbox.',
      });
      navigation.goBack();

    } catch (error) {
      console.log('Reset Password Error:', error.message);
      if (error.code === 'auth/user-not-found') {
        Toast.show({
          type: 'error',
          text1: 'No user found with this email.',
        });
      } else {
        Toast.show({ type: 'error', text1: 'An error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
          placeholder="Email address"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Email</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to sign-in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    justifyContent: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});