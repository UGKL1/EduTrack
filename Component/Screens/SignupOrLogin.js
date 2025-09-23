import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // 👈 import navigation hook

export default function SignupOrLogin() {
  const navigation = useNavigation(); // 👈 gives you access to navigation object

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/edulogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Sign in button → navigates to Login screen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')} // 👈 navigate by screen name
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.subText}>Don’t have an account ?</Text>

      {/* Sign up button (for later use) */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('Need signup screen next…')} // placeholder
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subText: {
    color: '#ccc',
    marginVertical: 5,
  },
});