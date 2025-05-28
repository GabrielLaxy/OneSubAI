import { StyleSheet, Dimensions } from 'react-native';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	posterContainer: {
		width: width * 0.9, // 85% da largura da tela
		height: height * 0.75, // ajuste conforme desejar
		borderRadius: 30,
		alignItems: 'center',
		backgroundColor: 'white',
		justifyContent: 'center',
		alignSelf: 'center', // centraliza o card
	},
	posterImage: {
		width: '100%',
		height: '100%',
		borderRadius: 30,
		overflow: 'hidden',
	},
	imageContainer: {
		flex: 1,
	},
	backgroundGradient: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: 20,
	},
	title: {
		color: 'white',
		fontSize: 48,
		fontFamily: 'Poppins-Bold',
		marginBottom: 10,
		textAlign: 'center',
	},
	genres: {
		color: 'white',
		fontSize: 16,
		fontFamily: 'Poppins-Light',
		textAlign: 'center',
		top: -10,
	},
});

export default styles;
