import { StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.primary,
	},
	scrollViewContent: {
		flexGrow: 1,
		justifyContent: 'flex-start', // deixa conteúdo no topo
	},

	flexOne: {
		flex: 1,
	},
	fakeHeader: {
		backgroundColor: theme.colors.primary,
		width: '100%',
	},
	headerContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 60,
	},
	formContainer: {
		flex: 1,
		backgroundColor: 'white',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		padding: 24,
	},
	formHeader: {
		marginBottom: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 30,
		fontFamily: 'Poppins-SemiBold',
		color: theme.colors.primary,
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 14,
		fontFamily: 'Poppins-Light',
		color: theme.colors.labels,
		bottom: 16,
	},
	input: {
		height: 48,
		borderWidth: 1,
		borderColor: theme.colors.primary,
		borderRadius: 8,
		paddingHorizontal: 12,
		marginBottom: 16,
		color: '#000',
	},
	button: {
		backgroundColor: theme.colors.primary,
		fontFamily: 'Poppins-SemiBold',
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontFamily: 'Poppins-SemiBold',
	},
	logo: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
	},
	footer: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginTop: 16,
	},
	footerText: {
		fontSize: 14,
		fontFamily: 'Poppins-Light',
		color: '#6E6E6E',
	},
	footerTextButton: {
		fontSize: 14,
		fontFamily: 'Poppins-SemiBold',
		color: theme.colors.primary,
		textDecorationLine: 'underline',
	},

	flatImage: {
		width: 330,
		height: 237,
	},
});

export default styles;
