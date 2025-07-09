import { Slot } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function RootLayoutNav() {
  const { user } = useAuth();

  if (!user) {
    return <Slot name="(auth)" />;
  }

  return <Slot name="(tabs)" />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
