import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ResetPw() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

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
          placeholder="Username / Email address"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
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

        {/* Back to sign-in */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Back to sign-in</Text>
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
  marginTop: 80, // same as login screen
},
logo: {
  width: 150,
  height: 150,
},

  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
    marginTop:150, // keeps form in middle
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
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

