import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { darkTheme, lightTheme } from '@moves/design-tokens';

export default function RootLayout() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.bg },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Moves' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
