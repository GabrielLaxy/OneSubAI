import { StyleSheet, Platform } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
	tabBarContainer: {
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
	tabBarContent: {
		marginBottom: Platform.OS === 'ios' ? 38 : 24,
		height: 60,
		width: '75%',
		position: 'absolute',
		justifyContent: 'space-around',
		alignItems: 'center',
		bottom: 0,
		backgroundColor: theme.colors.accent,
		borderWidth: 1,
		borderColor: theme.colors.primary,
		flexDirection: 'row',
		borderRadius: 99,
		shadowRadius: 3.8,
		padding: 4,
	},
	tabButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '33%',
		height: '100%',
		borderRadius: 99,
	},
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		borderTopStartRadius: 100,
		borderTopEndRadius: 100,
		borderBottomStartRadius: 100,
		borderBottomEndRadius: 100,
	},
	iconContainerFocused: {
		width: '100%',
		backgroundColor: theme.colors.primary,
	},
});

export default styles;
