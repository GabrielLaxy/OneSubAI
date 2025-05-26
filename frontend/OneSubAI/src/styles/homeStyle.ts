import { StyleSheet, Dimensions } from 'react-native';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.accent,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	fakeHeader: {
		backgroundColor: theme.colors.primary,
		width: width,
		height: 150, // altura maior para simular o fundo roxo
	},

	secondLayer: {
		backgroundColor: theme.colors.accent,
		marginTop: -40,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		padding: 20,
		minHeight: height * 0.8,
	},

	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: theme.colors.text,
		marginBottom: 10,
	},

	paragraph: {
		fontSize: 16,
		color: theme.colors.text,
	},

	dashboard: {
		borderRadius: 20,
		borderColor: theme.colors.dashboardBorder,
		borderWidth: 1,
		paddingBottom: 20
	},

	dashboardParagraph: {
		fontSize: 15,
		color: theme.colors.dashboardBorder
	},

	dashboardTitle: {
		fontSize: 30,
		fontWeight: 700,
	},

	dashboardLabels: {
		gap: 50,
		paddingBottom: 40,
		paddingHorizontal: 20
	},

	dashboardTexts: {
		padding: 20,
	},

	graphicLabels: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 20,
	},

	labelBase: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 20,
		borderColor: theme.colors.dashboardBorder,
		borderWidth: 1,
	},

	labelText: {
		textTransform: 'capitalize',
		fontWeight: '600',
	},

	graphic: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		height: 40,
	},

	bars: {
		backgroundColor: theme.colors.primary,
		borderRadius: 8,
		width: 30,
		marginHorizontal: 5,
	},

	months: {
		marginTop: 6,
	},

	graphicBars: {
		alignItems: 'center',
		flex: 1,
	},
});

export default styles;
