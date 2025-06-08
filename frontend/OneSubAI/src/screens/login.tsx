import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinalMovie } from '../contexts/finalMovieContext';
import Styles from '../styles/loginStyle'; // importando o arquivo de estilos

// sempre manter o conteudo dentro da tag </SafeAreaView> ele eveita que o conteudo seja escondido pela status bar dos celulares

export default function Login({ navigation }: any) {
	const { finalMovie, setFinalMovie } = useFinalMovie();

	const movie = [
		{
			id: 155,
			title_pt_br: 'Batman: O Cavaleiro das Trevas',
			poster_url:
				'https://image.tmdb.org/t/p/w500/4lj1ikfsSmMZNyfdi8R8Tv5tsgb.jpg',
			genres: [7, 5, 12, 11],
			providers: [3],
			directors: ['Christopher Nolan'],
			actors: [
				'Christian Bale',
				'Heath Ledger',
				'Aaron Eckhart',
				'Michael Caine',
				'Maggie Gyllenhaal',
			],
			keywords: [
				'joker',
				'sadism',
				'chaos',
				'secret identity',
				'crime fighter',
				'superhero',
				'anti hero',
				'scarecrow',
				'based on comic',
				'vigilante',
				'organized crime',
				'tragic hero',
				'anti villain',
				'criminal mastermind',
				'district attorney',
				'super power',
				'super villain',
				'neo-noir',
				'bold',
			],
			tmdb_rating: 8.52,
			overview:
				'Após dois anos desde o surgimento do Batman, os criminosos de Gotham City têm muito o que temer. Com a ajuda do tenente James Gordon e do promotor público Harvey Dent, Batman luta contra o crime organizado. Acuados com o combate, os chefes do crime aceitam a proposta feita pelo Coringa e o contratam para combater o Homem-Morcego.',
		},
	];
	function handleSetFinalMovie() {
		setFinalMovie(movie[0]);
		navigation.navigate('FinalRec');
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			{/* definir o estilo do SafeAreaView sempre como flex: 1 para ocupar toda a tela toda */}
			<View style={Styles.container}>
				<Text>Tela de Login</Text>
				<Button
					title="Tela de cadastro"
					onPress={() => navigation.navigate('Register')}
				/>
				<Button title="Home" onPress={() => navigation.navigate('TabRoutes')} />
				<Button title="REC" onPress={handleSetFinalMovie} />
			</View>
		</SafeAreaView>
	);
}
