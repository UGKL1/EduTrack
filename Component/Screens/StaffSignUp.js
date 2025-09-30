import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function StaffSignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation();

  const handleSignup = () => {
    navigation.navigate('Login'); // or your post-signup screen
  };

  const handleAdminSignup = () => {
    navigation.navigate('AdminDashboard'); // or your admin flow
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
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
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign-up</Text>
        </TouchableOpacity>

        <TouchableOpacity
               style={styles.buttonAlt}
                onPress={() => navigation.navigate('AdminSignUp')}
        >
              <Text style={styles.buttonText}>Sign Up as an Administrator</Text>
            </TouchableOpacity>

        {/* Link to login */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  appName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
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
