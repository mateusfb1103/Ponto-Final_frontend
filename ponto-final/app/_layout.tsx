import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, role, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Verifica em qual grupo de rotas o usuário está tentando entrar
    const inAuthGroup = segments[0] === '(auth)';

    if (!session) {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (session && role) {
      if (inAuthGroup || segments[0] === undefined) {
        if (role === 'cliente') {
          router.replace('/(cliente)/home');
        } else if (role === 'coletor') {
          router.replace('/(coletor)/disponiveis');
        }
      }
    }
  }, [session, role, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#297C2A" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode={colorScheme === 'dark' ? 'dark' : 'light'}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(cliente)" />
            <Stack.Screen name="(coletor)" />
          </Stack>

          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}