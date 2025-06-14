import { useEffect } from 'react';
import Theme from './src/theme';
import { PaperProvider } from 'react-native-paper';
import Routes from './src/screens/routes';
import { NavigationContainer } from '@react-navigation/native';
import { MoviesProvider } from './src/contexts/moviesContext';
import { UserProvider } from './src/contexts/userContext';
import { FinalMovieProvider } from './src/contexts/finalMovieContext';

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
			<UserProvider>
				<MoviesProvider>
					<FinalMovieProvider>
						<NavigationContainer>
							<Routes />
						</NavigationContainer>
					</FinalMovieProvider>
				</MoviesProvider>
			</UserProvider>
		</PaperProvider>
	);
}
