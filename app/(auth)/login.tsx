import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
// eslint-disable-next-line import/no-unresolved
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider } from 'firebase/auth';

export default function LoginScreen() {
  const { login, loginWithCredential } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '160554863054-q8592qdm5teh0nl20tdh95uevkkkva7u.apps.googleusercontent.com',
    androidClientId: '160554863054-q8592qdm5teh0nl20tdh95uevkkkva7u.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication || {};
      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        loginWithCredential(credential).then(() => {
          router.replace('/(tabs)/ninos');
        });
      }
    }
  }, [response, loginWithCredential, router]);

  const handleLogin = async () => {
    try {
      await login(identifier, password);
      router.replace('/(tabs)/ninos');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico o nombre de usuario"
        value={identifier}
        onChangeText={setIdentifier}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <Button
        title="Iniciar con Google"
        onPress={() => promptAsync()}
        disabled={!request}
      />
      <Button
        title="Crear cuenta"
        onPress={() => router.push('/(auth)/signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 12,
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
});
