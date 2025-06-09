import { StyleSheet } from "react-native";
import theme from "../theme";

const styles = StyleSheet.create({
	fakeHeader: {
		backgroundColor: theme.colors.primary,
		width: '100%',
	},

	fakeHeaderContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},

	secondLayer: {
		backgroundColor: theme.colors.accent,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		padding: 20,
		minHeight: '55%',
	},

    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    }
});

export default styles;