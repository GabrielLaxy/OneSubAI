import { View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getInitialMovies } from '../services/httpsRequests';
import { useMovies } from '../contexts/moviesContext';
import { useUserContext } from '../contexts/userContext';

export default function RecOption({ navigation }: any) {
	const { setMovies } = useMovies();
	const { userId } = useUserContext();

	

	async function handleMovies() {
		const data = await getInitialMovies(userId);
		if (data && data.filmes) {
			setMovies(data.filmes);
		}
		navigation.navigate('RecScreen');
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View>
				<Button title="Leva para tela do tinder" onPress={handleMovies} />
			</View>
		</SafeAreaView>
	);
}
