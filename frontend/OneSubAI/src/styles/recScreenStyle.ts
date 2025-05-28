import { StyleSheet, Dimensions } from 'react-native';
import theme from '../theme';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.primary,
	},
	topContainer: {
		flex: 5,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.primary,
	},
	posterContainer: {
		width: '90%',
		height: '100%',
		// Adicione estas propriedades:
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1,
	},
	bottomContainer: {
		flex: 1,
		backgroundColor: theme.colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonContainer: {
		overflow: 'hidden',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 10,
	},
	rippleContainer: {
		borderRadius: 50,
		overflow: 'hidden',
		width: width * 0.45,
		height: 52,
		borderColor: theme.colors.outline,
		borderWidth: 0.8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	ripple: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: theme.colors.accent,
		fontFamily: 'Poppins-Medium',
		fontSize: 17,
		textDecorationLine: 'underline',
	},
	emptyMessage: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyText: {
		color: theme.colors.accent,
		fontSize: 20,
		fontFamily: 'Poppins-Medium',
	},
	backPosterStyle: {
		position: 'absolute',
		width: '85%',
		height: '90%',
		alignSelf: 'center',
		zIndex: 1,
	},
});

export default styles;
