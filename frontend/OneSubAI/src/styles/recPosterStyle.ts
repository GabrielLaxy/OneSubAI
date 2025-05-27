import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  posterContainer: {
    width: width * 0.45,
    marginVertical: 10,
    alignItems: "center",
  },
  posterImage: {
    width: "100%",
    height: 225,
    borderRadius: 10,
  },
  titleText: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  genresText: {
    color: "#666",
    fontSize: 14,
  },
});

export default styles;