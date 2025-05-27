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
		backgroundColor: theme.colors.background,
	},
	bottomContainer: {
		flex: 1,
		backgroundColor: theme.colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonContainer: {
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
});

export default styles;
