import { StyleSheet, Dimensions } from 'react-native';
import theme from '../theme';

const { width, height } = Dimensions.get('window');
const posterWidth = width * 0.85;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.primary,
	},
	posterImage: {
		width: posterWidth,
		height: height * 0.6,
		borderRadius: 20,
		alignSelf: 'center',
	},
	widthContainer: {
		width: posterWidth,
	},
	bottomSheetContainer: {
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 16,
	},
	infoContainer: {
		alignSelf: 'flex-start',
	},
	title: {
		fontSize: 36,
		fontFamily: 'Poppins-Bold',
		color: theme.colors.text,
		textAlign: 'left',
	},
	genres: {
		fontFamily: 'Poppins-Light',
		fontSize: 14,
		marginBottom: 8,
	},
	providersTitle: {
		fontFamily: 'Poppins-Medium',
		fontSize: 14,
	},
	overviewContainer: {
		width: posterWidth,
		height: 150,
		borderRadius: 10,
		marginTop: 20,
		overflow: 'hidden',
		backgroundColor: theme.colors.background,
	},
	overview:{
		fontFamily: 'Poppins-Regular',
		fontSize: 14,
		color: theme.colors.text,
		textAlign: 'justify',
		paddingVertical: 1,
	}
});

export default styles;
