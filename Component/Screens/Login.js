import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Alert } from 'react-native';

export default function Login({ navigation }) {   
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // This function is for testing purposes and will always navigate.
  const handleLogin = () => {
    navigation.navigate("Dashboard");  
  };

  // This function will always navigate to the admin dashboard.
  const handleAdminLogin = () => {
    navigation.navigate("AdminDashboard");  
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/edulogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Staff ID / Email address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Remember me + Forgot password */}
      <View style={styles.row}>
        <Text style={styles.remember}>☑ Remember me</Text>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </View>

      {/* Login buttons */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log-in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAlt} onPress={handleAdminLogin}>
        <Text style={styles.buttonText}>Log-in as an Administrator</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 240,
    height: 240,
    alignSelf: 'center',
    marginBottom: 10,
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
});
