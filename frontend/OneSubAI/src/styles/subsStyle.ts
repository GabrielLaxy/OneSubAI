import { StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
	fakeHeader: {
		backgroundColor: theme.colors.accent,
		width: '100%',
	},

	fakeHeaderContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},

	secondLayer: {
		backgroundColor: theme.colors.primary,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		padding: 20,
		minHeight: '25%',
	},

	descriptionPage: {
		fontFamily: 'Poppins-Regular',
		textAlign: 'center',
		color: theme.colors.accent,
		fontSize: 17,
		margin: 20,
	},

	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.accent,
		borderRadius: 70,
		paddingHorizontal: 16,
		height: 50,
	},

	icon: {
		marginRight: 10,
	},

	input: {
		flex: 1,
		fontSize: 16,
		fontFamily: 'Poppins-Regular',
	},

	managerSubsTitle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginInline: 20,
		marginBlock: 20,
	},

	subsTitle: {
		color: theme.colors.text,
		fontSize: 17,
		fontFamily: 'Poppins-SemiBold',
	},

	plansContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBlock: 9,
		marginInline: 20,
	},

	streamingPlans: {
		justifyContent: 'space-between',
		flexGrow: 8,
		flexShrink: 1,
	},

	streamingImageContainer: {
		marginRight: 10,
	},

	streamingImage: {
		height: 60,
		width: 60,
	},

	streaming: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 17,
		padding: 0,
	},

	plan: {
		color: theme.colors.labels,
		fontFamily: 'Poppins-Medium',
		fontSize: 11,
		lineHeight: 12,
		marginTop: -12,
	},

	priceContainer: {
		flexGrow: 2, // ocupa 20% do restante
		alignItems: 'flex-end',
	},

	price: {
		fontFamily: 'Poppins-Medium',
		fontSize: 17,
	},

	dialog: {
		backgroundColor: theme.colors.accent,
	},

	dialogTitle: {
		color: theme.colors.text,
		fontFamily: 'Poppins-SemiBold',
	},

	dialogParagraph: {
		color: theme.colors.text,
		fontFamily: 'Poppins-regular',
	},

	cancelButton: {
		color: theme.colors.primary,
		fontFamily: 'Poppins-Medium',
	},

	deleteButton: {
		color: theme.colors.primary,
		fontFamily: 'Poppins-Medium',
	},

	listTile: {
		backgroundColor: theme.colors.accent,
	},

	confirmButton: {
		backgroundColor: theme.colors.primary,
		padding: 10,
		borderRadius: 20,
		width: '100%',
		alignItems: 'center',
	},

	signatureDateParagraph: {
		fontFamily: 'Poppins-Regular',
		fontSize: 13,
		width: '80%',
		marginBottom: 17,
		textAlign: 'center',
	},

	signatureDateTitle: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 20,
	},

	noSignatures: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingVertical: 40
	},

	noSignaturesImage: {
		width: 140,
		height: 140,
	},
});

export default styles;
