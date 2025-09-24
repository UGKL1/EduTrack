import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/edulogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Form content in the middle */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Admin ID / Email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
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

        {/* Admin Login Button */}
        <TouchableOpacity style={styles.buttonAlt}>
          <Text style={styles.buttonText}>Log-in as an Administrator</Text>
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
    marginTop: 80, // same as Login screen
  },
  logo: {
    width: 150,   // same as Login
    height: 150,  // same as Login
  },
    formContainer: {
    flex: 1,
    marginTop: 150,  // adjust upward positioning
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
