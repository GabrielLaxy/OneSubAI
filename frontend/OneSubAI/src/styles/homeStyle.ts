import { StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
	fakeHeader: {
		backgroundColor: theme.colors.primary,
		width: '100%',
		height: 200,
	},

	fakeHeaderContent: {
		flex: 1, // ocupa toda a altura do fakeHeader
		justifyContent: 'center', // centraliza verticalmente
		alignItems: 'center', // centraliza horizontalmente
		paddingHorizontal: 20, // opcional, para não grudar nas laterais
	},

	secondLayer: {
		backgroundColor: theme.colors.accent,
		marginTop: -40,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		padding: 20,
		minHeight: '80%',
	},

	dashboard: {
		borderRadius: 20,
		borderColor: theme.colors.dashboardBorder,
		borderWidth: 1,
		paddingBottom: 20,
	},

	dashboardTexts: {
		padding: 20,
	},

	dashboardParagraph: {
		fontSize: 15,
		color: theme.colors.labels,
		fontFamily: 'Poppins-Regular',
	},

	dashboardTitle: {
		fontSize: 30,
		fontFamily: 'Poppins-SemiBold',
	},

	dashboardLabels: {
		gap: 50,
		paddingBottom: 40,
		paddingHorizontal: 20,
	},

	graphic: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 20,
	},

	labelBase: {
		paddingVertical: 6,
		paddingHorizontal: 24,
		borderRadius: 20,
		borderColor: theme.colors.dashboardBorder,
		borderWidth: 1,
	},

	labelText: {
		textTransform: 'capitalize',
		fontSize: 13,
		fontFamily: 'Poppins-SemiBold',
	},

	scaleContainer: {
		width: 50,
		justifyContent: 'space-between',
		height: 150,
	},

	scaleText: {
		fontSize: 12,
		fontFamily: 'Poppins-Regular',
		color: theme.colors.labels,
		position: 'absolute',
		right: 0,
	},

	graphContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		height: 170,
	},

	barArea: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '80%',
		height: 150,
		position: 'relative',
	},

	barContainer: {
		width: 30,
		alignItems: 'center',
		position: 'relative',
	},

	barTouchArea: {
		height: 150,
		justifyContent: 'flex-end',
	},

	labelTextBelow: {
		position: 'absolute',
		bottom: -20,
		width: 50,
		textAlign: 'center',
		color: theme.colors.labels,
		fontFamily: 'Poppins-Regular',
		fontSize: 11
	},

	dashLineBase: {
		position: 'absolute',
		left: 0,
		right: 0,
		borderTopWidth: 1,
		borderStyle: 'dashed',
		height: 1,
	},

	dashDot: {
		position: 'absolute',
		left: -10,
		width: 6,
		height: 6,
		borderRadius: 6,
		transform: [{ translateY: -4 }],
	},

	dashValue: {
		position: 'absolute',
		left: -63,
		fontSize: 12,
		fontFamily: 'Poppins-Bold',
		transform: [{ translateX: -2.8 }, { translateY: -10 }],
	},

	subscribes: {
		marginTop: 40,
	},

	subscribesTexts: {
		marginBottom: 15,
		fontFamily: 'Poppins-Regular',
	},

	subscribesTitle: {
		fontSize: 25,
		fontFamily: 'Poppins-SemiBold',
	},

	subscribesParagraph: {
		fontSize: 15,
		fontFamily: 'Poppins-Regular',
		color: theme.colors.labels,
	},

	subs: {
		flexDirection: 'row',
		gap: 20,
		marginBottom: 80,
	},

	subscribeSquare: {
		borderColor: theme.colors.dashboardBorder,
		borderWidth: 1,
		height: 135,
		width: 138,
		padding: 15,
		borderRadius: 8,
	},

	streamingTitle: {
		fontSize: 15,
		fontFamily: 'Poppins-SemiBold',
	},

	subscribeExpirationAlert: {
		fontSize: 10,
		fontFamily: 'Poppins-Regular',
		color: theme.colors.labels,
	},

	subscribePreco: {
		marginTop: 10,
		fontSize: 15,
		fontFamily: 'Poppins-SemiBold',
	},

	streamingImage: {
		height: 33,
		width: 33,
		marginBottom: 5,
	},
});

export default styles;
