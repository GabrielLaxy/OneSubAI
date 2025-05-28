import { StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
	fakeHeader: {
		backgroundColor: theme.colors.primary,
		width: '100%',
		height: 150,
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
	},

	dashboardTitle: {
		fontSize: 30,
		fontWeight: '700',
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
		paddingHorizontal: 17,
		borderRadius: 20,
		borderColor: theme.colors.dashboardBorder,
		borderWidth: 1,
	},

	labelText: {
		textTransform: 'capitalize',
		fontSize: 13,
		fontWeight: '600',
	},

	scaleContainer: {
		width: 40,
		justifyContent: 'space-between',
		height: 150,
	},

	scaleText: {
		fontSize: 12,
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
		left: -55,
		fontSize: 12,
		fontWeight: 'bold',
		transform: [{ translateX: -2.8 }, { translateY: -10 }],
	},
});

export default styles;
