import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function Login() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('./assets/edulogo.png')} // replace with actual logo path
        style={styles.logo}
        resizeMode="contain"
      />

      {/* App Name */}
      <Text style={styles.appName}>EDUTRACK</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.subText}>Don’t have an account ?</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D', // dark background like in image
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007BFF', // blue buttons
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
