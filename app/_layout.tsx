// @ts-nocheck
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ApplicationProvider } from '@ui-kitten/components';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import * as eva from '@eva-design/eva';
import GruvTheme from '@/constants/GruvTheme';
import { default as mapping } from '../mapping.json';

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		Eva: require('../assets/fonts/EVA-Matisse_Standard.ttf'),
		// ...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) return null;

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	return (
		<ApplicationProvider {...eva} customMapping={mapping} theme={{ ...eva.dark, ...GruvTheme }}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</ApplicationProvider>
	);
}
