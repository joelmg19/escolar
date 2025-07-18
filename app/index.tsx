import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)/ninos" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
