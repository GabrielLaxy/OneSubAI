import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import  Theme  from './src/theme';
import { PaperProvider } from 'react-native-paper';
import Routes from './src/screens/routes';
import { NavigationContainer } from '@react-navigation/native';

import { useFonts } from 'expo-font';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';

preventAutoHideAsync();

export default function App() {
	const [loaded, error] = useFonts({
		'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
		'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
		'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
		'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
		'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
	});

	useEffect(() => {
		if (loaded || error) {
			hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<PaperProvider theme={Theme}>
			<NavigationContainer>
				<Routes />
			</NavigationContainer>
		</PaperProvider>
	);
}