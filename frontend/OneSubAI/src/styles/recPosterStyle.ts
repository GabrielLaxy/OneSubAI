import { StyleSheet, Dimensions } from 'react-native';
import theme from '../theme';

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
	posterContainer: {
		width: width * 0.87,
		aspectRatio: 1 / 1.67,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: 10,
		overflow: 'hidden',
		position: 'absolute',
	},
	posterImage: {},
	title: {
		color: 'white',
		fontSize: 48,
		fontFamily: 'Poppins-Bold',
		textAlign: 'center',
		bottom: 10,
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
