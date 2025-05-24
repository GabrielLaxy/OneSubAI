import { StyleSheet } from 'react-native';
import theme from '../theme';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.primary,
	},
	topContainer: {
		flex: 4,
		backgroundColor: theme.colors.background,
	},
    bottomContainer:{
        flex: 1,
        backgroundColor: theme.colors.primary,
    }
});

export default styles;
