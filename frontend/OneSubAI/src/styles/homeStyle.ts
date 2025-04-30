import { StyleSheet, Dimensions } from "react-native";
import theme from "../theme";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    fakeHeader: {
        backgroundColor: theme.colors.primary,
        width: width,
        height: 50,
    },
});
export default styles;