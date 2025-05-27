import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconButton, TouchableRipple } from 'react-native-paper';
import RecPoster from '../components/recPoster';
import styles from '../styles/recScreenStyle';
import theme from '../theme';

const poster = 'https://image.tmdb.org/t/p/w500/uT1pHr90KqQGMucv7YgyPdxhMiC.jpg';
const title = "Jumanji: Bem-Vindo à Selva";
const genres = ['Ação', 'Aventura', 'Ficção Científica'];

export default function RecScreen() {
	return (
		<View style={styles.container}>
			<StatusBar animated={true} style="auto" />
			<View style={styles.topContainer}>
				<RecPoster posterUrl={poster} title={title} genres={genres}/>
			</View>
			<View style={styles.bottomContainer}>
				<View style={styles.buttonContainer}>
					<IconButton
						icon="thumb-up"
						iconColor="white"
						mode="outlined"
						size={35}
						rippleColor={'#63FF80'}
						onPress={() => console.log('Pressed')}
					/>
					<View style={styles.rippleContainer}>
						<TouchableRipple
							borderless={false}
							rippleColor={'white'}
							onPress={() => console.log('Pressed')}
							style={styles.ripple}
						>
							<Text style={styles.buttonText}>NUNCA ASSISTI</Text>
						</TouchableRipple>
					</View>
					<IconButton
						icon="thumb-down"
						iconColor="white"
						mode="outlined"
						size={35}
						rippleColor={'#FF5B5B'}
						onPress={() => console.log('Pressed')}
					/>
				</View>
			</View>
		</View>
	);
}
